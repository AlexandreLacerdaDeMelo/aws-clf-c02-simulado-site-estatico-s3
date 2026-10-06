# Simulados CLF-C02

Plataforma de preparação para o exame **AWS Certified Cloud Practitioner (CLF-C02)**: simulados no formato da prova, treino por domínio e análise de desempenho. É um site 100% estático (HTML, CSS e JavaScript puros), publicado em um bucket **Amazon S3** com *static website hosting* e custo zero de operação.

**No ar:** <http://simulado-clf-c02-5jxyt2.s3-website-us-east-1.amazonaws.com>

**Código:** <https://github.com/AlexandreLacerdaDeMelo/aws-clf-c02-simulado-site-estatico-s3>

Desenvolvido por [Alexandre Lacerda de Melo](https://github.com/AlexandreLacerdaDeMelo).

---

## Sumário

- [Sobre o projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Arquitetura](#arquitetura)
- [Estrutura de arquivos](#estrutura-de-arquivos)
- [Banco de questões](#banco-de-questões)
- [Rodar localmente](#rodar-localmente)
- [Testes](#testes)
- [Publicar no S3](#publicar-no-s3)
- [Custo zero](#custo-zero)
- [Remover tudo](#remover-tudo)
- [Limitações conhecidas](#limitações-conhecidas)

---

## Sobre o projeto

O projeto nasceu como um checkpoint de uma trilha de estudos (AWS Cloud Practitioner + cursos de Claude): **colocar um site estático no ar a partir de um bucket S3**. Em vez de uma página de exemplo, o site é uma ferramenta útil para quem estuda para a própria certificação. E ele mostra, no rodapé, de qual bucket e região está sendo servido.

## Funcionalidades

**Estudo**
- **Simulado completo:** 65 questões sorteadas de um banco de 130, nos pesos oficiais do exame, com 90 minutos.
- **Simulado rápido:** 20 questões, na mesma proporção, com 30 minutos.
- **Treino por domínio:** sem tempo, com correção e explicação logo após cada resposta.
- **Questões de múltipla resposta** ("Escolha 2"), com indicação clara e contador de seleções.

**Durante o simulado**
- **Mapa de questões:** mostra respondidas, em branco e marcadas para revisão; no treino, também corretas e incorretas. No celular, abre num painel que sobe da parte de baixo da tela.
- **Marcar para revisão** com um clique ou com a tecla `M`.
- **Retomar depois:** a rodada fica salva no navegador, mesmo se a aba for fechada. O tempo fica pausado enquanto ela está fechada; se o prazo já tiver acabado, "Continuar" leva direto ao resultado.
- **Aviso de tempo** nos últimos 5 minutos, com o tempo que realmente falta.
- **Sequência de acertos** no treino, registrada em cada questão (ao voltar a uma questão, aparece a sequência daquele momento).
- **Atalhos:** `1`–`5` ou `A`–`E` escolhem, `Enter` avança (ou confere, no treino), `←`/`→` navegam.

**Depois do simulado**
- **Resultado como análise:** % de acerto, pontuação estimada de 100 a 1000 (aprovação em 700), acertos, erros, em branco, tempo e maior sequência de acertos.
- **Desempenho por domínio**, com pontos fortes (80% ou mais) e de atenção (abaixo de 70%).
- **O que estudar agora:** recomendações calculadas a partir das respostas (melhor e pior domínio, temas com mais erros) e um atalho para treinar o domínio mais fraco.
- **Revisão** com filtros (Erradas, Em branco, Marcadas, Todas). Cada questão mostra sua resposta, a resposta correta e a explicação.

**Progresso**
- **Métricas:** questões respondidas, taxa de acerto, simulados concluídos e dias seguidos de estudo.
- **Evolução e histórico:** gráfico de evolução do acerto, com a linha de aprovação (nota 700), e histórico recente.
- **Numeração fixa dos simulados** (#01, #02…): nunca reinicia nem muda; só recomeça se você limpar o histórico.
- **Marcos:** 8 conquistas.

**Interface**
- Tema claro, escuro ou automático (segue o sistema).
- Layout próprio para celular e tablet.
- Navegação completa por teclado, foco visível e respeito a `prefers-reduced-motion`.

## Arquitetura

```
 Navegador ──HTTP GET──▶  Endpoint de website do S3  ──▶  Bucket simulado-clf-c02-5jxyt2
    │                     (index.html / error.html)        index.html, error.html,
    │                                                       css/style.css, js/*.js
    └── localStorage: histórico, marcos, tema, numeração e rodada em andamento
```

Não existe servidor, API nem banco de dados. Toda a lógica roda no navegador, e o progresso de cada pessoa fica salvo só no navegador dela.

**Decisões técnicas**

| Decisão | Motivo |
|---|---|
| HTML/CSS/JS puros, sem framework, build ou CDN | Nada para compilar ou atualizar; o bucket recebe os arquivos como estão |
| Questões em `js/questions.js` (variável global), não em JSON | Funciona também abrindo o `index.html` direto do disco (`file://`), onde o `fetch` de arquivos locais é bloqueado |
| `localStorage` atrás de um helper (`store`) com try/catch | O site continua funcionando em aba anônima ou com armazenamento bloqueado |
| Design system com tokens de cor nos três contextos de tema | Claro, escuro manual e escuro automático sempre consistentes |
| `Content-Type` explícito no deploy | Evita que o Windows envie CSS/JS como `text/plain` |
| `Cache-Control: no-cache` no deploy e arquivos versionados (`?v=`) no `index.html` | O navegador sempre confere se há versão nova; sem isso, uma atualização pode juntar HTML novo com CSS/JS antigos do cache e quebrar a página |

## Estrutura de arquivos

```
index.html                 telas (início, simulado, resultado), mapa e diálogos
error.html                 página 404 configurada no static website hosting
css/style.css              design system (tokens, tipografia) e componentes
js/questions.js            banco de questões: DOMAINS e QUESTIONS
js/app.js                  lógica: rodadas, persistência, estatísticas, telas
deploy.ps1                 cria/atualiza o bucket e publica o site
destroy.ps1                apaga o bucket e todo o conteúdo
tests/validate-questions.mjs   valida o banco de questões
tests/e2e.mjs              teste ponta a ponta em navegador headless
CLAUDE.md                  regras globais do projeto para o Claude Code
.claude/skills/            Skills do Claude Code: test-and-verify, question-bank
```

Só os `*.html` da raiz, `css/` e `js/` vão para o bucket. Testes, documentação e `.claude/` ficam fora.

## Banco de questões

São **130 questões originais**, escritas em português no estilo de cenário da prova:

| Domínio | Peso no exame | No banco | No simulado completo |
|---|---:|---:|---:|
| Conceitos de nuvem | 24% | 31 | 16 |
| Segurança e conformidade | 30% | 39 | 19 |
| Tecnologia e serviços | 34% | 44 | 22 |
| Faturamento, preços e suporte | 12% | 16 | 8 |

Formato de cada questão em `js/questions.js`:

```js
{
  id: 's08', d: 'seguranca',           // prefixo do domínio + número
  q: 'Enunciado em cenário...',        // termina com "(Escolha 2)" se tiver 2 respostas
  o: ['Alternativa A', 'B', 'C', 'D'], // 4 alternativas (5 na múltipla resposta)
  a: [1],                              // índice(s) correto(s); a ordem é embaralhada na tela
  e: 'Por que a correta está certa e por que as outras estão erradas.',
  s: 'AWS IAM'                         // serviço ou tema
}
```

Para adicionar questões, edite esse arquivo. Se os totais por domínio mudarem, os números também aparecem nos testes, em textos da tela inicial e neste README. O passo a passo completo está na skill `.claude/skills/question-bank/SKILL.md`. No final, rode os testes.

> **Questões sempre originais.** Não copie nem traduza questões de dumps (como ExamTopics) ou da prova real: isso viola o contrato de certificação da AWS.

## Rodar localmente

Abra o `index.html` com dois cliques. Não precisa de servidor nem de instalação.

## Testes

Requisitos: Node.js 22+ e Google Chrome ou Microsoft Edge instalados. Nenhuma dependência npm.

```bash
node tests/validate-questions.mjs     # estrutura e distribuição do banco
node tests/e2e.mjs                    # site local (file://)
```

Para testar o site publicado (PowerShell):

```powershell
$env:CLF_URL = 'http://simulado-clf-c02-5jxyt2.s3-website-us-east-1.amazonaws.com'; node tests/e2e.mjs; Remove-Item Env:CLF_URL
```

**O que o teste ponta a ponta cobre** (o total impresso varia um pouco: as verificações de múltipla resposta só rodam quando o sorteio traz uma questão desse tipo):
- os três modos e o sorteio por domínio
- múltipla resposta
- contraste do mapa de questões nos dois temas
- retomada após recarregar a página
- os números do resultado, os filtros da revisão e as recomendações
- tema automático
- ausência de rolagem horizontal em 1920, 1366, 820 e 390 px
- mapa e área de toque no celular
- detecção do bucket no rodapé
- erros de JavaScript
- regressões de bugs já corrigidos:
  - retomar com o tempo esgotado
  - tempo acabar com um diálogo aberto
  - aviso de tempo herdado pelo treino
  - numeração dos simulados após cortar o histórico
  - sequência de acertos ao voltar
  - texto do aviso de tempo

Os screenshots ficam em `%TEMP%\clf-e2e`. Vale olhá-los depois de mudar o visual.

## Publicar no S3

**Pré-requisitos**

1. [AWS CLI v2](https://aws.amazon.com/cli/) instalado.
2. Um usuário IAM (nunca o root) com permissão no S3 (por exemplo, `AmazonS3FullAccess`). Para o alerta de custo, ele também precisa de `budgets:ViewBudget` e `budgets:ModifyBudget`.
3. Credenciais no CLI, de uma destas formas:
   - `aws login`: usa o login do console no navegador, sem criar chaves (as credenciais são temporárias);
   - `aws configure`: usa a access key do usuário IAM.

   Antes de qualquer uma, defina a região: `aws configure set region us-east-1`.

**Publicar ou atualizar** (o nome do bucket precisa ser único no mundo):

```powershell
.\deploy.ps1 -BucketName simulado-clf-seunome -AlertEmail seu@email.com
```

O script é idempotente: rodar de novo só atualiza o que mudou. Ele:

1. confere as credenciais e **recusa o usuário root**;
2. cria o bucket, se ainda não existir;
3. libera **somente neste bucket** a leitura pública por política (ACLs continuam bloqueadas);
4. aplica uma bucket policy que permite apenas `s3:GetObject`;
5. ativa o static website hosting com `index.html` e `error.html`;
6. envia os `*.html` da raiz, `css/` e `js/` com `aws s3 sync`, com `Content-Type` correto e `Cache-Control: no-cache`;
7. com `-AlertEmail`, cria um *zero spend budget* (opcional; confirme a inscrição no e-mail que a AWS enviar);
8. mostra a URL do site.

**Conferir depois de publicar**

- **Mesmos arquivos:** os arquivos no ar são idênticos aos locais (compare o hash SHA-256) e saem com `Cache-Control: no-cache`.
- **Página de erro:** um endereço inexistente (por exemplo, `/nao-existe`) responde 404 com a página de erro.
- **Teste ponta a ponta contra a URL publicada** (veja [Testes](#testes)): ele confere o site inteiro no S3, inclusive se o rodapé mostra o bucket e a região.
- **Visitante novo:** abra o site numa janela anônima para ver como ele veria.

**Problemas comuns**

| Sintoma | Causa e solução |
|---|---|
| `AccessDenied` ao aplicar a bucket policy | O bloqueio de acesso público está ativo no nível da **conta**. Desative-o em S3 › *Block Public Access settings for this account* |
| `BucketAlreadyExists` | O nome já é usado por outra conta. Escolha outro |
| "Credenciais do usuário root detectadas" | O deploy recusa o root por segurança. Faça login com um usuário IAM |
| Credenciais expiradas ou `NoCredentials` | Rode `aws login` de novo (ou `aws configure`) |
| `aws login` reclama de região ou de terminal | Defina a região antes: `aws configure set region us-east-1` |
| O site não abre no navegador | O endpoint do S3 só aceita **HTTP**. Digite a URL começando com `http://` |
| Site aparece quebrado ou com visual antigo depois de um deploy | O navegador está usando CSS/JS antigos do cache. Teste em janela anônima ou com Ctrl+F5. O deploy envia `Cache-Control: no-cache`, e o `index.html` versiona os arquivos (`?v=`) para evitar isso |

## Custo zero

- **Só Amazon S3.** Nada de CloudFront, Route 53, domínio próprio, EC2 ou banco de dados.
- **Site minúsculo:** cerca de 175 KB. Cada visita faz 4 GETs (HTML, CSS e dois arquivos JS).
- **Uploads mínimos:** o `sync` só envia os arquivos alterados. Sem versionamento, logs ou replicação.
- **Alerta de custo:** o *zero spend budget* (opcional) avisa por e-mail sobre qualquer cobrança, e o AWS Budgets é gratuito.
- **Contas no plano gratuito** (criadas a partir de 15/07/2025) não são cobradas enquanto não fizerem upgrade para o plano pago. Contas mais antigas têm o Free Tier de 12 meses do S3 (5 GB, 20.000 GETs e 2.000 PUTs por mês).
- **Antes de fazer upgrade** para o plano pago, revise o que está ligado na conta.

## Remover tudo

```powershell
.\destroy.ps1 -BucketName simulado-clf-seunome
```

Apaga todos os objetos e o bucket. Ele pede para digitar o nome do bucket para confirmar.

## Limitações conhecidas

- **Só HTTP:** o endpoint de website do S3 não tem HTTPS, e o navegador mostra "Não seguro". HTTPS exigiria CloudFront, o que está fora do escopo de custo zero.
- **Progresso local:** o progresso fica só no navegador em que você estudou. Não há conta, login nem sincronização entre dispositivos.
- **Pontuação estimada:** é uma conversão linear do acerto para a escala 100–1000; a AWS usa uma escala própria.
- **Explicações em texto corrido:** cada uma diz por que a correta está certa e por que as outras não servem, mas sem separação formal em seções.
