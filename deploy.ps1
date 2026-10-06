<#
.SYNOPSIS
  Publica o simulado em um bucket S3 com static website hosting.

.DESCRIPTION
  Cria o bucket (se ainda não existir), libera leitura pública apenas deste bucket,
  ativa o website hosting e envia os arquivos do site. Pode ser executado de novo
  para atualizar o site: só os arquivos alterados são enviados.

  Usa somente o Amazon S3 (e, se -AlertEmail for informado, o AWS Budgets, que é gratuito).

.EXAMPLE
  .\deploy.ps1 -BucketName simulado-clf-seunome
.EXAMPLE
  .\deploy.ps1 -BucketName simulado-clf-seunome -AlertEmail voce@exemplo.com
#>
param(
  [Parameter(Mandatory = $true)]
  [ValidatePattern('^[a-z0-9][a-z0-9.-]{1,61}[a-z0-9]$')]
  [string]$BucketName,

  [string]$Region = 'us-east-1',

  # Se informado, cria um "zero spend budget" que avisa por e-mail sobre qualquer cobrança.
  [string]$AlertEmail
)

$ErrorActionPreference = 'Stop'
$root = $PSScriptRoot

function Step($msg) { Write-Host "`n==> $msg" -ForegroundColor Cyan }
function Invoke-Aws {
  # Executa o AWS CLI e interrompe o script se o comando falhar.
  & aws.exe @args
  if ($LASTEXITCODE -ne 0) { throw "Falha ao executar: aws $($args -join ' ')" }
}
function Test-Aws {
  # Retorna $true se o comando der certo, sem mostrar erros (o stderr redirecionado no PS 5.1 viraria exceção).
  $old = $ErrorActionPreference
  $ErrorActionPreference = 'Continue'
  try { & aws.exe @args 2>$null | Out-Null; return ($LASTEXITCODE -eq 0) }
  finally { $ErrorActionPreference = $old }
}
function Write-TempJson($obj) {
  # PowerShell 5.1 estraga aspas ao passar JSON direto para programas nativos; um arquivo evita isso.
  $path = [System.IO.Path]::GetTempFileName()
  # -InputObject (e não pipe): no PS 5.1 o pipe desembrulha listas de 1 item e o JSON vira objeto.
  [System.IO.File]::WriteAllText($path, (ConvertTo-Json -InputObject $obj -Depth 10 -Compress))
  return $path
}
function Test-RootArn([string]$arn) {
  # O número da conta é o mesmo para root e IAM; só o ARN diferencia (root termina em ":root").
  return $arn -match ':root$'
}

if (-not (Get-Command aws.exe -ErrorAction SilentlyContinue)) {
  throw 'AWS CLI não encontrado. Instale em https://aws.amazon.com/cli/ e depois rode "aws login" (ou "aws configure").'
}

Step 'Verificando credenciais'
$identity = (& aws.exe sts get-caller-identity --query '[Account,Arn]' --output text)
if ($LASTEXITCODE -ne 0) { throw 'Credenciais ausentes ou expiradas. Rode "aws login" com o seu usuário IAM (ou "aws configure" com as chaves dele).' }
$accountId, $arn = $identity -split '\s+'
if (Test-RootArn $arn) { throw 'Credenciais do usuário root detectadas. Por segurança o deploy é recusado: faça login com um usuário IAM.' }
Write-Host "Conta: $accountId | Identidade: $arn"

Step "Bucket s3://$BucketName ($Region)"
if (Test-Aws s3api head-bucket --bucket $BucketName) {
  Write-Host 'Bucket já existe, seguindo para a atualização.'
} else {
  if ($Region -eq 'us-east-1') {
    Invoke-Aws s3api create-bucket --bucket $BucketName --region $Region | Out-Null
  } else {
    Invoke-Aws s3api create-bucket --bucket $BucketName --region $Region --create-bucket-configuration "LocationConstraint=$Region" | Out-Null
  }
  Write-Host 'Bucket criado.'
}

Step 'Liberando política pública somente neste bucket (ACLs continuam bloqueadas)'
Invoke-Aws s3api put-public-access-block --bucket $BucketName --public-access-block-configuration `
  'BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=false,RestrictPublicBuckets=false'

$policy = @{
  Version   = '2012-10-17'
  Statement = @(@{
    Sid       = 'PublicReadForWebsite'
    Effect    = 'Allow'
    Principal = '*'
    Action    = 's3:GetObject'
    Resource  = "arn:aws:s3:::$BucketName/*"
  })
}
$policyFile = Write-TempJson $policy
try { Invoke-Aws s3api put-bucket-policy --bucket $BucketName --policy "file://$policyFile" }
finally { Remove-Item $policyFile -ErrorAction SilentlyContinue }

Step 'Ativando static website hosting'
Invoke-Aws s3 website "s3://$BucketName/" --index-document index.html --error-document error.html

Step 'Enviando arquivos (somente os que mudaram)'
# Content-Type explícito para cada tipo: evita que o Windows envie CSS/JS como text/plain.
# Cache-Control no-cache: o navegador sempre confirma com o S3 (resposta 304 se nada mudou),
# então uma versão nova nunca se mistura com arquivos antigos guardados no cache.
$cache = 'no-cache'
# Na raiz, só os .html do primeiro nível: no sync o "*" também atravessa "/", então '*/*' exclui subpastas (tests/, .claude/ ...).
Invoke-Aws s3 sync $root "s3://$BucketName/" --exclude '*' --include '*.html' --exclude '*/*' --delete --content-type 'text/html; charset=utf-8' --cache-control $cache
Invoke-Aws s3 sync (Join-Path $root 'css') "s3://$BucketName/css/" --delete --content-type 'text/css; charset=utf-8' --cache-control $cache
Invoke-Aws s3 sync (Join-Path $root 'js') "s3://$BucketName/js/" --delete --content-type 'application/javascript; charset=utf-8' --cache-control $cache

if ($AlertEmail) {
  Step 'Alerta de custo (AWS Budgets, gratuito)'
  if (Test-Aws budgets describe-budget --account-id $accountId --budget-name 'zero-spend') {
    Write-Host 'Budget "zero-spend" já existe.'
  } else {
    $budgetFile = Write-TempJson @{
      BudgetName  = 'zero-spend'
      BudgetLimit = @{ Amount = '0.01'; Unit = 'USD' }
      TimeUnit    = 'MONTHLY'
      BudgetType  = 'COST'
    }
    $notifFile = Write-TempJson @(@{
      Notification = @{ NotificationType = 'ACTUAL'; ComparisonOperator = 'GREATER_THAN'; Threshold = 100; ThresholdType = 'PERCENTAGE' }
      Subscribers  = @(@{ SubscriptionType = 'EMAIL'; Address = $AlertEmail })
    })
    try {
      & aws.exe budgets create-budget --account-id $accountId --budget "file://$budgetFile" --notifications-with-subscribers "file://$notifFile"
      if ($LASTEXITCODE -eq 0) { Write-Host "Budget criado: você recebe um e-mail se a conta gastar mais de US$ 0,01 no mês." }
      else { Write-Warning 'Não foi possível criar o budget (o usuário IAM precisa das permissões budgets:ViewBudget e budgets:ModifyBudget). Crie pelo console: Billing > Budgets > Zero spend budget.' }
    } finally {
      Remove-Item $budgetFile, $notifFile -ErrorAction SilentlyContinue
    }
  }
}

# Regiões mais antigas usam "s3-website-<região>"; as mais novas usam "s3-website.<região>".
$dashRegions = 'us-east-1', 'us-west-1', 'us-west-2', 'ap-southeast-1', 'ap-southeast-2', 'ap-northeast-1', 'eu-west-1', 'sa-east-1'
$sep = if ($dashRegions -contains $Region) { '-' } else { '.' }
$url = "http://$BucketName.s3-website$sep$Region.amazonaws.com"

Write-Host "`nPronto! Site no ar em:" -ForegroundColor Green
Write-Host $url -ForegroundColor Yellow
