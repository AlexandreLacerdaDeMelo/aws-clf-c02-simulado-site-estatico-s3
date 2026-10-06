# CLAUDE.md

Plataforma de preparação para o exame **AWS Certified Cloud Practitioner (CLF-C02)**, em português do Brasil, publicada como site estático em um bucket Amazon S3. Nasceu como o checkpoint "colocar um site estático no ar via S3" de uma trilha de estudos (AWS Cloud Practitioner + cursos de Claude). O autor é Alexandre Lacerda de Melo, creditado no rodapé do `index.html`; mantenha esse crédito.

Fale com o usuário em português. Ele é iniciante em AWS: explique comandos da AWS em linguagem simples.

## Skills do projeto (`.claude/skills/`)

| Skill | Use quando |
|---|---|
| `test-and-verify` | tiver mudado qualquer código ou conteúdo, corrigido um bug, ou antes de publicar |
| `question-bank` | for criar, editar ou revisar questões em `js/questions.js` |

## Estado atual

| Item | Valor |
|---|---|
| URL pública | <http://simulado-clf-c02-5jxyt2.s3-website-us-east-1.amazonaws.com> (só HTTP) |
| Bucket / região | `simulado-clf-c02-5jxyt2` / `us-east-1` |
| Conta | IAM user `Alexandre_Lacerda_adm` (não root), no **plano gratuito** da AWS (em 04/10/2026: válido até 02/12/2026) |
| Credenciais do CLI | `aws login` (temporárias; se expirarem, peça ao usuário para rodar `! aws login`) |
| Alerta de custo | Não criado (o usuário não informou e-mail) |
| Repositório | <https://github.com/AlexandreLacerdaDeMelo/aws-clf-c02-simulado-site-estatico-s3> (público, branch `main`, remoto `origin`) |

**Commits e Git:**
- Autor: e-mail privado do GitHub, configurado só neste repositório (`git config user.email`). Não troque pelo Gmail do usuário.
- **Nenhuma marca de IA:** não adicione `Co-Authored-By`, "Generated with" nem nada parecido em commits, PRs ou issues; o usuário pediu explicitamente.
- Só faça commit e push quando o usuário pedir.

## Estrutura

| Arquivo | Papel |
|---|---|
| `index.html` | Telas (`#screen-home`, `#screen-quiz`, `#screen-result`) alternadas com `hidden`, drawer do mapa, diálogo de confirmação, toast e rodapé com o crédito do autor. CSS e JS referenciados com `?v=` |
| `error.html` | 404 do S3. Usa caminhos absolutos porque é servida em qualquer rota; via `file://` fica sem estilo, e isso é esperado |
| `css/style.css` | Design system: tokens de cor nos 3 blocos de tema, escalas e componentes |
| `js/questions.js` | `DOMAINS` e `QUESTIONS` (skill `question-bank`) |
| `js/app.js` | Toda a lógica, numa IIFE (mapa abaixo) |
| `deploy.ps1` / `destroy.ps1` | Publicar ou apagar o bucket (passo a passo no `README.md`, seção "Publicar no S3") |
| `tests/` | `validate-questions.mjs` e `e2e.mjs`, sem dependências npm (skill `test-and-verify`) |
| `.claude/skills/` | As Skills acima |

### Mapa do `js/app.js` (seções, na ordem)

- **Utilitários:** `$`, `esc`, `shuffle`, `fmtClock`, `relDate`, `dayKey`, `ICON`.
- **`store`:** `get`, `set` e `remove`, com try/catch. Chaves `KEY_*`.
- **Configuração:** `MODES` (com o `mix`), `PASS`, `PASS_PCT`, `ARCHITECT`, `STRONG`, `WEAK`, `MIN_SAMPLE` (por domínio), `MIN_ROUND` (por rodada), `BLANK_WARN_RATIO`, `TOP_TOPICS`, `ACH_*`, `SAVE_EVERY`, `WARN_SECONDS`, `HISTORY_MAX`, `HISTORY_ROWS`, `TREND_POINTS` e `ACHIEVEMENTS`.
- **Estatísticas puras:**
  - histórico: `summarizeHistory`, `studyStreak`, `domainHistory`, `examNumbers`, `nextExamNumber`
  - rótulos: `modeLabel` e `entryLabel` (o único lugar que monta "Treino · …" e "… #NN")
  - rodada: `evaluate` e `recommendations`
- **Rodada:**
  - criação: `buildPool`, `newItem`, `start`
  - persistência: `saveSession`, `loadSession` (valida contra `QUESTIONS`) e `hydrate`
  - controle: `resume`, `beginSession` (único lugar que trata o tempo esgotado antes de abrir) e `tick`
- **Quiz:**
  - renderização: `renderQuestion`, `renderOptions`/`optionState`, `explanationHtml`, `renderFeedback`, `renderFlag`, `updateActions`
  - mapa: `mapHtml` (trilho, drawer e revisão)
  - ações: `selectOption`, `reveal`, `toggleFlag`, `goTo`, `onNext`, `requestFinish`, `exitQuiz`
- **Resultado:** `finish`, `checkAchievements`, `renderResult`, `renderReview` (`FILTERS`), `jumpToReview`.
- **Início:** `renderHome` lê o histórico uma vez e o repassa para `renderContinue`, `renderDomainList` e `renderProgress` (com o gráfico `sparkline`); depois chama `renderAchievements`.
- **Tema, diálogos e rodapé:** `applyTheme`, `confirmDialog`, `toast`, drawer e `renderHostInfo` (detecta bucket e região quando a URL é `*.s3-website*`).
- **Eventos e atalhos de teclado.**

## Regras globais (valem para qualquer tarefa)

- **Edições do usuário:** leia os arquivos antes de mudar. O usuário às vezes edita à mão (por exemplo, o rodapé). Preserve essas edições e, se quebrarem algo (como uma tag não fechada), corrija o mínimo e avise.
- **Sem dependências:** HTML/CSS/JS puros, **sem frameworks, build ou CDN**, sem backend, API, banco externo ou autenticação.
- **Funciona via `file://`:** por isso as questões são uma variável global em `questions.js`, e não um JSON carregado com `fetch`.
- **`localStorage` só via `store`**, inclusive no HTML: nenhum script inline lê o `localStorage`. Chaves:
  - `clf.history`: últimas `HISTORY_MAX` rodadas `{date, mode, domain, score, correct, total, blank, time, byDomain, num}`. `num` é o número fixo do simulado; treinos não têm. Entradas antigas podem não ter `blank`, `byDomain` e `num`, e o código precisa tolerar isso.
  - `clf.achievements`: ids dos marcos.
  - `clf.theme`: `"light"`, `"dark"` ou ausente (segue o sistema).
  - `clf.examCount`: último número de simulado. Só aumenta; "Limpar histórico" o apaga.
  - `clf.session`: rodada em andamento `{v: 1, mode, domain, i, elapsed, combo, items: [{id, o, s, f, r, k}]}`, em que `k` é a sequência registrada quando a questão foi conferida. É validada contra `QUESTIONS` ao carregar e apagada ao finalizar ou descartar. O tempo fica pausado com a rodada fechada.
- **Segurança:** todo texto vai para `innerHTML` passando por `esc()`.
- **Nada de métricas inventadas:**
  - progresso, resultado e recomendações saem de `clf.history` ou da rodada;
  - comparações entre domínios só usam domínios com pelo menos `MIN_SAMPLE` questões;
  - abaixo de `MIN_ROUND` questões na rodada:
    - as recomendações aparecem precedidas do aviso "Amostra pequena";
    - não aparecem o "Nenhum erro nesta rodada." nem o botão "Fazer o simulado completo";
  - acima de `BLANK_WARN_RATIO` em branco, elas avisam que os números refletem questões não respondidas;
  - "melhor desempenho" só se for pelo menos `WEAK`.
- **`beforeunload`:** o aviso durante o quiz fica.
- **Código:** funções pequenas, com responsabilidade clara. Limites de regra de negócio são constantes nomeadas no topo do `app.js`, e textos que citam esses limites são montados a partir delas. A exceção são os `100`/`900` que definem a escala 100–1000 (`scaledScore`, `PASS_PCT`), que podem ficar como literais.
- **Validação:** depois de qualquer mudança, use a skill `test-and-verify`. Todo bug corrigido ganha um teste de regressão.
- **Custo zero na AWS:** só o S3 (e o Budgets, que é gratuito), nada pago. **Nunca execute `deploy.ps1`, `destroy.ps1` ou comandos `aws` que alterem recursos sem pedido explícito do usuário.** Cada publicação exige um pedido novo; o passo a passo está no `README.md` (seção "Publicar no S3").
- **Banco de questões:** questões sempre **originais**, nunca de dumps ou da prova real. Mudanças de interface não alteram o banco. Detalhes na skill `question-bank`.

## Revisão de código

- **Ferramenta:** a revisão é feita com o `/code-review` embutido: `/code-review high`, que revisa as mudanças ainda não commitadas (`git diff`). Para revisar arquivos específicos, passe-os como alvo.
- **Quando:** só quando o usuário pedir. Se ele pedir antes de publicar, espere o review terminar, a menos que ele mande publicar mesmo assim.
- **Achados:** verifique cada achado no código antes de corrigir. Reporte ao usuário em português, agrupando por impacto (visível para quem usa × interno).

## Decisões de produto já tomadas (não reabra sem o usuário pedir)

- **Explicações:** ficam como texto corrido num bloco rotulado. Não divida em "por que está certa" e "por que as outras estão erradas" por heurística; isso inventaria uma estrutura que o banco não tem.
- **Placar de pontos:** foi removido. Os 8 marcos ficam, numa lista discreta e sem emojis.
- **Pontuação 100–1000:** é uma estimativa linear, e a interface diz isso. O tracejado do gráfico marca a aprovação (`PASS_PCT`, cerca de 66,7%) e as barras de domínio usam `WEAK` (70%). São réguas diferentes **de propósito**: não as "unifique".
- **Tempo da rodada salva:** fica pausado enquanto ela está fechada, e a tela avisa.
- **`error.html`:** não aplica o tema salvo, para não ler o `localStorage` fora do `store`.
- **Link do autor no rodapé:** usa a cor padrão de link, como o usuário deixou.

## Manutenção da documentação

- **Ao mudar um comportamento:** atualize o `README.md` (para humanos) e a Skill correspondente.
- **Fonte única:** não repita aqui o que já está numa Skill; aponte para ela. A única exceção são as regras críticas de segurança e de custo (nunca publicar sem pedido, questões originais), que ficam aqui em uma linha, com o detalhe na Skill.
- **Números que mudam:** não escreva valores que variam (total de verificações do E2E, valor de `?v=`); aponte para a fonte (`tests/e2e.mjs`, `index.html`).
- **Frontmatter das Skills é YAML:**
  - na `description`, não use ": " sem aspas, porque isso quebra o carregamento (já aconteceu uma vez);
  - depois de editar, valide com:
    ```bash
    python -c "import yaml,glob; [yaml.safe_load(open(f,encoding='utf-8').read().split('---')[1]) for f in glob.glob('.claude/skills/*/SKILL.md')]; print('ok')"
    ```

## Armadilha do ambiente (vale para qualquer tarefa)

Heredocs no Git Bash processam barras invertidas: `\n` e caminhos `C:\...` saem corrompidos. Para gravar arquivos com `\`, use a ferramenta Write/Edit, não `cat <<EOF` nem `python - <<EOF`.
