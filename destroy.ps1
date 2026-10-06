<#
.SYNOPSIS
  Apaga todos os arquivos e o bucket do site. Use depois que o checkpoint for avaliado.

.EXAMPLE
  .\destroy.ps1 -BucketName simulado-clf-seunome
#>
param(
  [Parameter(Mandatory = $true)]
  [string]$BucketName,

  # Pula a confirmação.
  [switch]$Force
)

$ErrorActionPreference = 'Stop'

# Mesma proteção do deploy.ps1: o número da conta é igual para root e IAM; só o ARN diferencia.
$arn = (& aws.exe sts get-caller-identity --query Arn --output text)
if ($LASTEXITCODE -ne 0) { throw 'Credenciais ausentes ou expiradas. Rode "aws login" com o seu usuário IAM.' }
if ($arn -match ':root$') { throw 'Credenciais do usuário root detectadas. Por segurança a remoção é recusada: faça login com um usuário IAM.' }

# A confirmação interativa (Read-Host) só funciona num terminal do usuário; o -Force a dispensa.
if (-not $Force) {
  $answer = Read-Host "Isso apaga o bucket s3://$BucketName e todo o conteúdo dele. Digite o nome do bucket para confirmar"
  if ($answer -ne $BucketName) { Write-Host 'Cancelado.'; exit 1 }
}

& aws.exe s3 rb "s3://$BucketName" --force
if ($LASTEXITCODE -ne 0) { throw 'Não foi possível apagar o bucket.' }

Write-Host "Bucket $BucketName apagado. Nada mais deste site fica na sua conta." -ForegroundColor Green
Write-Host 'O budget "zero-spend" (se criado) foi mantido: ele é gratuito e continua protegendo a conta.'
