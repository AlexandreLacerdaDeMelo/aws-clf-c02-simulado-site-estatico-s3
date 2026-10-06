---
name: test-and-verify
description: Valida mudanças no simulado CLF-C02 rodando a validação do banco de questões e o teste ponta a ponta em Chrome/Edge headless (tests/e2e.mjs), inspecionando os screenshots e escrevendo testes de regressão. Use depois de qualquer mudança em HTML/CSS/JS ou no banco de questões, ao corrigir um bug, antes de publicar, ou quando o usuário pedir para testar o site local ou o publicado.
---

# Testar e verificar

Os dois testes ficam em `tests/`, não usam dependências npm e exigem Node 22+ e Chrome ou Edge.

## Rodar

```bash
node tests/validate-questions.mjs   # banco: totais por domínio, formato, ids, "(Escolha N)"
node tests/e2e.mjs                  # site local via file://
```

```powershell
# site publicado no S3
$env:CLF_URL = 'http://simulado-clf-c02-5jxyt2.s3-website-us-east-1.amazonaws.com'; node tests/e2e.mjs; Remove-Item Env:CLF_URL
```

O E2E imprime `PASS`/`FAIL` por verificação e um total `N/N`. O total **varia**: as verificações de múltipla resposta só rodam se o sorteio trouxer uma questão de múltipla resposta. Por isso a documentação não cita um número fixo; reporte o número que a execução imprimir.

## O que o E2E cobre

- **Modos e conteúdo:** os três modos, o sorteio por domínio nas proporções de `MODES.full.mix`, a múltipla resposta e o treino com feedback.
- **Mapa de questões:** estados e contraste nos dois temas.
- **Persistência:** marcar para revisão, retomar a rodada depois de recarregar a página e sair do quiz mantendo o progresso.
- **Resultado:** os números, os filtros da revisão e as recomendações.
- **Temas e layout:** tema automático; ausência de rolagem horizontal em 1920, 1366, 820 e 390 px; mapa em drawer e área de toque no celular.
- **Rodapé:** detecção do bucket quando a URL é do S3, ou "Rodando localmente".
- **Regressões de bugs já corrigidos.**
- **Erros de JavaScript.**

## Inspecionar os screenshots (obrigatório depois de mexer em CSS, HTML ou em qualquer renderização do `app.js`)

A renderização do `app.js` (templates de `innerHTML` em `renderResult`, `renderContinue`, `mapHtml` etc.) também gera layout.

Teste passando **não** garante layout bom; vários bugs deste projeto só apareceram nos screenshots. Abra os PNG em `%TEMP%\clf-e2e` com a ferramenta Read e confira:

| Arquivo | O que olhar |
|---|---|
| `01-inicio-claro/escuro` | hierarquia, "Continue estudando", progresso |
| `02-quiz-escolha-unica`, `03-quiz-multipla` | questão em destaque, faixa "Selecione 2 respostas", barra superior de ponta a ponta |
| `04-mapa-claro/escuro` | respondida ≠ em branco, triângulo de marcada, anel na atual |
| `05-continuar` | painel de rodada em andamento |
| `06-resultado-claro/escuro` (página inteira) | %, contagens, barras por domínio, "O que estudar agora" sem quebra, revisão |
| `07-treino` | feedback, explicação, "Sequência: N" |
| `08-quiz-tablet`, `09-celular-*`, `10-celular-mapa`, `11/12-celular-*` | ações fixas embaixo, drawer, alternativas sem espaço sobrando, sem conteúdo cortado |

Para olhar uma faixa de uma página longa, recorte com Pillow (`Image.crop`) num PNG temporário e apague depois.

## Escrever um teste de regressão (todo bug corrigido ganha um)

- **Onde:** perto da funcionalidade testada no fluxo do `tests/e2e.mjs`. Casos que dependem de estado salvo ficam no bloco "Regressões apontadas no code review". O nome do `check` diz o comportamento esperado.
- **Se der, confirme que o teste falharia sem a correção.**
- **Ferramentas do próprio arquivo:**
  - `ev(expr)` / `click(sel)` / `text(sel)`: executar JS, clicar e ler texto na página.
  - `waitFor(expr, timeout)`: espera ativa. **Use em vez de `sleep` longo** para condições assíncronas (fim do tempo, troca de tela).
  - `fakeSession(elapsed)`: grava uma `clf.session` falsa (5 questões, modo rápido). Depois chame `load()` para recarregar a página e testar a retomada, o tempo esgotado ou o aviso de tempo.
  - `setTheme('light'|'dark'|null)` e `media(scheme)`: tema manual ou do sistema. Depois de `load()` ou `Page.reload`, o tema volta ao do sistema; reaplique com `setTheme`.
  - `viewport(w, h, mobile)` e `noOverflow(label, w)`: larguras e rolagem horizontal.
  - `shot(nome, full)`: screenshot.
- **Helpers dentro da página:** `__q()` (questão atual) e `__ans(certo)` (responde certo ou errado).

## Particularidades do E2E (não "conserte" sem entender)

- **Animações:** ele emula `prefers-reduced-motion: reduce`. Sob emulação de viewport, o headless nem sempre avança animações antes da captura, e sem isso os screenshots saem "apagados".
- **`beforeunload`:** o diálogo é confirmado automaticamente via `Page.javascriptDialogOpening`. A proteção continua no site; não a remova para facilitar o teste.
- **Execuções seguidas:** porta de depuração dinâmica (`--remote-debugging-port=0` + `DevToolsActivePort`), perfil novo a cada execução e `taskkill /T` síncrono no Windows permitem rodar várias vezes em sequência.
- **Navegador preso** (EBUSY no perfil, porta ocupada): encerre os Chrome de teste e rode de novo:
  ```powershell
  Get-CimInstance Win32_Process -Filter "Name='chrome.exe'" | Where-Object { $_.CommandLine -like '*clf-e2e*' } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force }
  ```

## Validação do banco

`tests/validate-questions.mjs` confere:
- os totais por domínio (`EXPECTED`);
- ids únicos com o prefixo do domínio;
- campos preenchidos;
- 4 alternativas na escolha única e 5 na múltipla resposta;
- "(Escolha N)" coerente com o número de respostas;
- enunciados sem duplicata.

Para mudanças no conteúdo, veja a skill `question-bank`.
