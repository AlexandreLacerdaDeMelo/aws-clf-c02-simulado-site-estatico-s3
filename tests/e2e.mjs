// Teste ponta a ponta no Chrome/Edge headless via DevTools Protocol.
//   Local (file://):   node tests/e2e.mjs
//   Site publicado (PowerShell):
//     $env:CLF_URL = 'http://<bucket>.s3-website-<região>.amazonaws.com'; node tests/e2e.mjs; Remove-Item Env:CLF_URL
// Screenshots vão para %TEMP%\clf-e2e. Não usa nenhuma dependência externa (Node 22+).
import { spawn, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, rmSync, writeFileSync, readdirSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const OUT = join(tmpdir(), 'clf-e2e');
const PROFILE = join(OUT, `profile-${Date.now()}`); // perfil novo a cada execução = localStorage vazio
const PAGE = process.env.CLF_URL || pathToFileURL(join(ROOT, 'index.html')).href;

const BROWSERS = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  '/usr/bin/google-chrome', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
];
const exe = BROWSERS.find(existsSync);
if (!exe) { console.error('Chrome/Edge não encontrado.'); process.exit(1); }

mkdirSync(OUT, { recursive: true });
for (const f of readdirSync(OUT)) {
  // Remove screenshots e perfis antigos; ignora o que ainda estiver em uso.
  if (f.endsWith('.png') || f.startsWith('profile')) {
    try { rmSync(join(OUT, f), { recursive: true, force: true }); } catch { /* em uso */ }
  }
}
// Porta 0: o Chrome escolhe uma porta livre e a grava em DevToolsActivePort (permite execuções seguidas).
const browser = spawn(exe, ['--headless=new', '--remote-debugging-port=0', `--user-data-dir=${PROFILE}`, '--window-size=1366,900', 'about:blank']);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const results = [];
const problems = [];
function check(name, ok, detail = '') {
  results.push({ name, ok: !!ok });
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? '  (' + detail + ')' : ''}`);
}

let targets = [];
for (let i = 0; i < 80 && !targets.find((t) => t.type === 'page'); i++) {
  try {
    const port = readFileSync(join(PROFILE, 'DevToolsActivePort'), 'utf8').split(/\r?\n/)[0].trim();
    targets = await (await fetch(`http://127.0.0.1:${port}/json`)).json();
  } catch { /* ainda subindo */ }
  await sleep(250);
}
if (!targets.find((t) => t.type === 'page')) { console.error('Não foi possível conectar ao navegador headless.'); process.exit(1); }
const ws = new WebSocket(targets.find((t) => t.type === 'page').webSocketDebuggerUrl);
await new Promise((r) => { ws.onopen = r; });

let seq = 0;
const pending = new Map();
const send = (method, params = {}) => { const i = ++seq; ws.send(JSON.stringify({ id: i, method, params })); return i; };
const cdp = (method, params = {}) => new Promise((r) => { pending.set(send(method, params), r); });
ws.onmessage = (m) => {
  const d = JSON.parse(m.data);
  if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); }
  if (d.method === 'Runtime.exceptionThrown') problems.push('exceção: ' + (d.params.exceptionDetails.exception?.description || d.params.exceptionDetails.text));
  if (d.method === 'Runtime.consoleAPICalled' && d.params.type === 'error') problems.push('console.error: ' + d.params.args.map((a) => a.value ?? a.description).join(' '));
  // O site mantém o aviso de beforeunload durante o quiz; o teste apenas confirma o diálogo.
  if (d.method === 'Page.javascriptDialogOpening') send('Page.handleJavaScriptDialog', { accept: true });
};
const ev = async (expr) => {
  const r = await cdp('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true });
  if (r.result.exceptionDetails) throw new Error(expr.slice(0, 90) + ' -> ' + r.result.exceptionDetails.exception?.description);
  return r.result.result.value;
};
const click = (sel) => ev(`(() => { const el = document.querySelector(${JSON.stringify(sel)}); if (!el) throw new Error('não encontrado: ${sel}'); el.click(); return true; })()`);
const text = (sel) => ev(`document.querySelector(${JSON.stringify(sel)})?.textContent.trim() ?? null`);
const shot = async (name, full = false) => {
  await sleep(300); // deixa terminar transições e animações antes da captura
  const params = { format: 'png' };
  if (full) {
    const { result } = await cdp('Page.getLayoutMetrics');
    params.clip = { x: 0, y: 0, width: result.cssContentSize.width, height: Math.min(result.cssContentSize.height, 4000), scale: 1 };
    params.captureBeyondViewport = true;
  }
  const r = await cdp('Page.captureScreenshot', params);
  writeFileSync(join(OUT, name + '.png'), Buffer.from(r.result.data, 'base64'));
};
// Espera ativa: verifica a condição a cada 100 ms, em vez de dormir um tempo fixo.
const waitFor = async (expr, timeout = 8000) => {
  const end = Date.now() + timeout;
  while (Date.now() < end) { if (await ev(expr)) return true; await sleep(100); }
  return false;
};
const setTheme = (t) => ev(t ? `document.documentElement.setAttribute('data-theme', '${t}'); true` : "document.documentElement.removeAttribute('data-theme'); true");
const viewport = (width, height, mobile = false) => cdp('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: mobile ? 2 : 1, mobile });
const noOverflow = async (label, width) => {
  const sw = await ev('document.documentElement.scrollWidth');
  check(`sem rolagem horizontal: ${label} (${width}px)`, sw <= width, `scrollWidth ${sw}`);
};
// Screenshots determinísticos: sem animações (o CSS respeita prefers-reduced-motion).
const media = (scheme) => cdp('Emulation.setEmulatedMedia', { features: [
  { name: 'prefers-reduced-motion', value: 'reduce' },
  ...(scheme ? [{ name: 'prefers-color-scheme', value: scheme }] : [])
] });
const load = async () => { await cdp('Page.navigate', { url: PAGE }); await sleep(900); await ev(HELPERS); };

// Responde a questão atual: certa (true) ou errada (false). Retorna o domínio e se é múltipla.
const HELPERS = `
window.__q = () => QUESTIONS.find((x) => x.q === document.querySelector('#q-text').textContent);
window.__ans = (good) => {
  const q = __q();
  const shown = [...document.querySelectorAll('#options .option')].map((b) => +b.dataset.orig);
  const pick = good ? q.a : shown.filter((o) => !q.a.includes(o)).slice(0, q.a.length);
  pick.forEach((o) => document.querySelector('.option[data-orig="' + o + '"]').click());
  return { d: q.d, multi: q.a.length > 1 };
};
true`;

try {
  await cdp('Runtime.enable'); await cdp('Page.enable');
  await viewport(1366, 900);
  await media();
  await load();

  // ---------- Início ----------
  check('banco tem 130 questões', (await ev('QUESTIONS.length')) === 130);
  await sleep(300);
  const host = await text('.host');
  const s3 = /\.s3-website[.-]/.test(PAGE);
  check(s3 ? 'rodapé detecta bucket e região do S3' : 'rodapé indica execução local',
    s3 ? /bucket .+ · região .+/.test(host) : host.includes('Rodando localmente'), host);
  check('início sem histórico sugere o primeiro simulado', (await text('#continue')).includes('Comece seu primeiro simulado'));
  check('lista de modos com completo, rápido e treino', (await ev("document.querySelectorAll('.mode-list > li').length")) === 3);
  await setTheme('light'); await shot('01-inicio-claro');
  await setTheme('dark'); await shot('01-inicio-escuro');
  await setTheme('light');
  await noOverflow('início', 1366);

  // ---------- Simulado completo ----------
  await click('.mode-row[data-mode=full]'); await sleep(250);
  check('cabeçalho mostra "Questão 1 de 65"', (await text('#quiz-counter')) === 'Questão 1 de 65');
  check('tempo restante começa em 1:30:00', (await text('#timer')) === '1:30:00');
  check('trilho com mapa visível no desktop', await ev("getComputedStyle(document.querySelector('.quiz-rail')).display !== 'none'"));
  await shot('02-quiz-escolha-unica');

  const domains = {};
  let multiChecked = false;
  for (let i = 0; i < 30; i++) {
    const q = await ev('__q().a.length');
    if (q > 1 && !multiChecked) {
      multiChecked = true;
      check('múltipla resposta: indicador "Selecione 2 respostas"', (await text('#q-hint')).includes('Selecione 2 respostas'));
      check('múltipla resposta: alternativas são checkbox', (await ev("document.querySelector('.option').getAttribute('role')")) === 'checkbox');
      await click('#options .option');
      check('múltipla resposta: contador "1 de 2 selecionadas"', (await text('#q-hint .sel-count')) === '1 de 2 selecionadas');
      await ev("document.querySelectorAll('#options .option.selected').forEach((b) => b.click()); true");
      await shot('03-quiz-multipla');
    }
    const r = await ev(`__ans(${i % 4 !== 3})`); // ~75% de acertos
    domains[r.d] = (domains[r.d] || 0) + 1;
    if (i === 2 || i === 5) await click('#flag-btn');
    await click('#next-btn');
  }
  check('marcar: botão volta ao estado normal na questão seguinte', (await ev("document.querySelector('#flag-btn').getAttribute('aria-pressed')")) === 'false');

  // Mapa nos dois temas: respondida ≠ em branco, marcada com indicador, atual destacada
  for (const theme of ['light', 'dark']) {
    await setTheme(theme); await sleep(80);
    const c = await ev(`(() => {
      const cells = [...document.querySelectorAll('#rail-map .qcell')];
      const bg = (el) => getComputedStyle(el).backgroundColor;
      const answered = cells.find((el) => el.classList.contains('answered') && !el.classList.contains('current'));
      const blank = cells.find((el) => el.classList.contains('blank') && !el.classList.contains('current'));
      const flagged = cells.find((el) => el.classList.contains('flagged'));
      const cur = document.querySelector('#rail-map .qcell.current');
      return { answered: bg(answered), blank: bg(blank), fg: getComputedStyle(answered).color,
        flag: getComputedStyle(flagged, '::before').borderRightColor, ring: getComputedStyle(cur).boxShadow };
    })()`);
    check(`mapa (${theme}): respondida ≠ em branco`, c.answered !== c.blank, `${c.answered} vs ${c.blank}`);
    check(`mapa (${theme}): texto da respondida contrasta`, c.fg !== c.answered, c.fg);
    check(`mapa (${theme}): marcada tem indicador`, c.flag && c.flag !== 'rgba(0, 0, 0, 0)', c.flag);
    check(`mapa (${theme}): questão atual destacada`, c.ring && c.ring !== 'none');
    await shot(`04-mapa-${theme === 'light' ? 'claro' : 'escuro'}`);
  }
  await setTheme('light');

  // ---------- Retomar rodada depois de recarregar a página ----------
  await cdp('Page.reload'); await sleep(1000); await ev(HELPERS);
  await setTheme('light'); // o recarregamento volta ao tema do sistema
  const cont = await text('#continue');
  check('após recarregar, início oferece continuar', cont.includes('Em andamento') && cont.includes('30 de 65 respondidas'), cont.slice(0, 80));
  await shot('05-continuar');
  await click('[data-action=resume]'); await sleep(250);
  check('rodada retomada na questão 31', (await text('#quiz-counter')) === 'Questão 31 de 65');
  const counts = await ev("[...document.querySelectorAll('#rail-counts dd')].map((d) => d.textContent)");
  check('respostas e marcações restauradas', counts[0] === '30' && counts[1] === '2', counts.join('/'));

  // Responde até a 64ª; a 65ª fica em branco para testar o filtro "Em branco".
  for (let i = 30; i < 65; i++) {
    if (i < 64) {
      const r = await ev(`__ans(${i % 4 !== 3})`);
      domains[r.d] = (domains[r.d] || 0) + 1;
      await click('#next-btn');
    } else {
      const d = await ev('__q().d');
      domains[d] = (domains[d] || 0) + 1;
    }
  }
  check('sorteio 16/19/22/8 por domínio', domains.conceitos === 16 && domains.seguranca === 19 && domains.tecnologia === 22 && domains.faturamento === 8, JSON.stringify(domains));
  check('última questão mostra "Finalizar"', (await text('#next-label')) === 'Finalizar');
  await click('#next-btn'); await sleep(200);
  check('diálogo de finalização abre e avisa da questão em branco', (await ev("document.querySelector('#confirm-dialog').open")) && (await text('#dlg-text')).includes('1 em branco'));
  await click('#dlg-yes'); await sleep(700);

  // ---------- Resultado ----------
  const res = await ev(`(() => {
    const dd = [...document.querySelectorAll('#r-stats > div')].map((d) => [d.querySelector('dt').textContent, d.querySelector('dd').textContent]);
    return { pct: document.querySelector('#r-pct').textContent, correct: document.querySelector('#r-correct').textContent, stats: Object.fromEntries(dd),
      advice: document.querySelectorAll('.advice-list li').length, domains: document.querySelectorAll('.d-row').length,
      filters: [...document.querySelectorAll('#review-filters button')].map((b) => b.textContent),
      cells: document.querySelectorAll('#review-map .qcell').length, wrongCells: document.querySelectorAll('#review-map .qcell.wrong').length,
      items: document.querySelectorAll('#review-list .review-item').length };
  })()`);
  const [ok, tot] = res.correct.match(/\d+/g).map(Number);
  check('resultado: % = acertos/total', res.pct === `${Math.round((ok / tot) * 100)}%`, `${res.pct} · ${res.correct}`);
  check('resultado: acertos + erros + em branco = 65', Number(res.stats['Acertos']) + Number(res.stats['Erros']) + Number(res.stats['Em branco']) === 65, JSON.stringify(res.stats));
  check('resultado: 4 domínios avaliados', res.domains === 4);
  check('resultado: recomendações de estudo', res.advice >= 2, String(res.advice));
  check('revisão: filtro "Erradas" bate com os erros', res.filters[0] === `Erradas${res.stats['Erros']}`, res.filters.join(' | '));
  check('revisão: mapa com 65 questões e incorretas marcadas', res.cells === 65 && res.wrongCells === Number(res.stats['Erros']), `${res.cells}/${res.wrongCells}`);
  check('revisão: lista mostra as erradas', res.items === Number(res.stats['Erros']));
  check('revisão: filtro "Em branco" conta 1', res.filters[1] === 'Em branco1', res.filters[1]);
  check('revisão: explicação com resposta escolhida e correta', (await text('#review-list .explain')).includes('Resposta correta'));
  check('histórico salvo com byDomain', await ev("JSON.parse(localStorage.getItem('clf.history')).at(-1).byDomain.seguranca.t === 19"));
  check('rodada salva é apagada ao finalizar', await ev("localStorage.getItem('clf.session') === null"));
  await shot('06-resultado-claro', true);
  await setTheme('dark'); await shot('06-resultado-escuro', true); await setTheme('light');
  await click('#review-filters [data-filter=all]');
  check('revisão: filtro "Todas" lista 65', (await ev("document.querySelectorAll('#review-list .review-item').length")) === 65);
  await noOverflow('resultado', 1366);

  // ---------- Treino ----------
  await click('#home-btn'); await sleep(200);
  check('início mostra o último resultado', (await text('#continue')).includes('Simulado completo #01'));
  await ev("document.querySelector('#train-details').open = true; true");
  await click('.domain-btn[data-domain=seguranca]'); await sleep(250);
  check('treino: Conferir começa desabilitado', await ev("document.querySelector('#next-btn').disabled"));
  await ev('__ans(true); true'); await click('#next-btn');
  check('treino: feedback "Correto" com explicação', (await text('#feedback')).startsWith('Correto') && (await text('#feedback')).includes('Explicação'));
  check('treino: mapa marca a questão como correta', await ev("document.querySelector('#rail-map .qcell').classList.contains('correct')"));
  await click('#next-btn'); await ev('__ans(true); true'); await click('#next-btn');
  check('treino: sequência aparece após 2 acertos', (await text('#feedback .streak')) === 'Sequência: 2');
  await shot('07-treino');
  await click('#prev-btn');
  check('treino: ao voltar, a questão mostra a sequência daquele momento (sem "Sequência: 2")', (await ev("document.querySelector('#feedback .streak')")) === null);
  await click('#next-btn');
  await click('#next-btn'); await ev('__ans(false); true'); await click('#next-btn');
  check('treino: feedback "Incorreto" mostra a resposta correta', (await text('#feedback')).startsWith('Incorreto'));
  await ev('document.activeElement.blur(); true');
  await click('#next-btn');
  await cdp('Input.dispatchKeyEvent', { type: 'keyDown', key: '1', text: '1' });
  await cdp('Input.dispatchKeyEvent', { type: 'keyUp', key: '1' });
  check('teclado: tecla 1 seleciona a alternativa A', (await ev("document.querySelectorAll('.option.selected').length")) >= 1);
  await click('#finish-btn'); await sleep(200); await click('#dlg-yes'); await sleep(500);
  check('treino: resultado considera só as conferidas', (await text('#r-correct')) === '2 de 3 corretas');

  // ---------- Tema automático pelo sistema ----------
  await click('#home-btn');
  await setTheme(null);
  await media('dark'); await sleep(100);
  check('tema automático: escuro pelo sistema', (await ev('getComputedStyle(document.body).backgroundColor')) === 'rgb(14, 17, 22)');
  await media('light'); await sleep(100);
  check('tema automático: claro pelo sistema', (await ev('getComputedStyle(document.body).backgroundColor')) === 'rgb(246, 247, 249)');

  // ---------- Regressões apontadas no code review ----------
  await media('light');
  check('histórico grava o número fixo do simulado (num)', await ev("JSON.parse(localStorage.getItem('clf.history')).find((h) => h.mode === 'full').num === 1"));
  const fakeSession = (elapsed) => ev(`(() => {
    const items = QUESTIONS.filter((q) => q.d === 'conceitos' && q.a.length === 1).slice(0, 5)
      .map((q) => ({ id: q.id, o: q.o.map((_, i) => i), s: [q.a[0]], f: 0, r: 0 }));
    localStorage.setItem('clf.session', JSON.stringify({ v: 1, mode: 'quick', i: 0, elapsed: ${elapsed}, combo: 0, items }));
    return true;
  })()`);

  // Rodada salva com o tempo esgotado: "Continuar" leva ao resultado e não reabre o quiz.
  await fakeSession(1800); await load(); await setTheme('light');
  await click('[data-action=resume]');
  await waitFor("!document.querySelector('#screen-result').hidden");
  check('tempo esgotado: continuar mostra o resultado e não volta ao quiz',
    (await ev("!document.querySelector('#screen-result').hidden && document.querySelector('#screen-quiz').hidden")) && (await text('#r-correct')) === '5 de 5 corretas');
  check('numeração: o simulado seguinte recebe #02', (await text('#result-mode')).includes('#02'), await text('#result-mode'));

  // Numeração não reinicia quando os simulados saem da janela de 50 rodadas do histórico.
  await ev(`(() => {
    const t = Date.now();
    const trains = Array.from({ length: 50 }, (_, i) => ({ date: t - i, mode: 'train', domain: 'conceitos', score: 500, correct: 1, total: 2, blank: 0, time: 10 }));
    localStorage.setItem('clf.history', JSON.stringify(trains));
    return true;
  })()`);
  await fakeSession(1800); await load(); await setTheme('light');
  await click('[data-action=resume]');
  await waitFor("!document.querySelector('#screen-result').hidden");
  check('numeração: continua em #03 mesmo sem simulados no histórico recente', (await text('#result-mode')).includes('#03'), await text('#result-mode'));
  check('histórico continua limitado a 50 rodadas', (await ev("JSON.parse(localStorage.getItem('clf.history')).length")) === 50);

  // O aviso de tempo (laranja) não passa para o cronômetro do treino.
  await click('#home-btn');
  await ev("document.querySelector('#timer').classList.add('warn'); true");
  await ev("document.querySelector('#train-details').open = true; true");
  await click('.domain-btn[data-domain=faturamento]'); await sleep(200);
  check('treino não herda o aviso de tempo da rodada anterior', !(await ev("document.querySelector('#timer').classList.contains('warn')")));
  await click('#quiz-exit'); await sleep(150); await click('#dlg-yes'); await sleep(200);

  // Tempo acaba com o diálogo "Sair?" aberto: o diálogo fecha e o resultado fica na tela.
  await fakeSession(1797); await load(); await setTheme('light');
  await click('[data-action=resume]'); await sleep(200);
  check('aviso de tempo usa o tempo real que falta', (await text('#toast')) === 'Falta menos de 1 minuto.', await text('#toast'));
  await click('#quiz-exit'); await sleep(150);
  check('diálogo "Sair?" abre durante o quiz', await ev("document.querySelector('#confirm-dialog').open"));
  await waitFor("!document.querySelector('#screen-result').hidden", 10000);
  check('tempo acaba com diálogo aberto: diálogo fecha e resultado aparece',
    !(await ev("document.querySelector('#confirm-dialog').open")) && (await ev("!document.querySelector('#screen-result').hidden")));
  await click('#home-btn');

  // ---------- Larguras: laptop, desktop largo, tablet, celular ----------
  await click('.mode-row[data-mode=quick]'); await sleep(250);
  for (const [w, h, mobile, label] of [[1920, 1080, false, 'desktop'], [1366, 768, false, 'laptop'], [820, 1180, true, 'tablet'], [390, 844, true, 'celular']]) {
    await viewport(w, h, mobile); await sleep(150);
    await noOverflow(`quiz ${label}`, w);
    if (label === 'tablet') await shot('08-quiz-tablet');
  }
  check('celular: botão Mapa visível e trilho oculto', await ev("getComputedStyle(document.querySelector('#map-open')).display !== 'none' && getComputedStyle(document.querySelector('.quiz-rail')).display === 'none'"));
  check('celular: tempo continua visível', await ev("document.querySelector('#timer').offsetParent !== null && document.querySelector('#timer').textContent.length > 0"));
  const tap = await ev("Math.min(...[...document.querySelectorAll('.option')].map((b) => b.getBoundingClientRect().height))");
  check('celular: alternativas com área de toque ≥ 44px', tap >= 44, `${Math.round(tap)}px`);
  await ev('__ans(true); true');
  await setTheme('dark'); await shot('09-celular-quiz-escuro'); await setTheme('light');
  await shot('09-celular-quiz-claro');
  await click('#map-open'); await sleep(250);
  check('celular: mapa abre em drawer', await ev("document.querySelector('#map-dialog').open && document.querySelectorAll('#drawer-map .qcell').length === 20"));
  await shot('10-celular-mapa');
  await ev("document.querySelectorAll('#drawer-map .qcell')[5].click(); true"); await sleep(150);
  check('celular: tocar no mapa navega e fecha o drawer', !(await ev("document.querySelector('#map-dialog').open")) && (await text('#quiz-counter')) === 'Questão 6 de 20');

  // Sair salva a rodada; o início mostra "Continuar"
  await click('#quiz-exit'); await sleep(150); await click('#dlg-yes'); await sleep(250);
  check('sair do quiz preserva a rodada', (await text('#continue')).includes('Simulado rápido'));
  await noOverflow('início celular', 390);
  await shot('11-celular-inicio', true);
  await click('[data-action=resume]'); await sleep(200);
  await click('#finish-btn-2'); await sleep(200); await click('#dlg-yes'); await sleep(500);
  await noOverflow('resultado celular', 390);
  await shot('12-celular-resultado', true);

  check('nenhum erro de JavaScript', problems.length === 0, problems.join(' | '));
} catch (err) {
  check('execução do teste', false, err.message);
} finally {
  ws.close();
  // No Windows, kill() não encerra os processos filhos do Chrome.
  if (process.platform === 'win32') spawnSync('taskkill', ['/pid', String(browser.pid), '/T', '/F']);
  else browser.kill();
}

const failed = results.filter((r) => !r.ok).length;
console.log(`\n${results.length - failed}/${results.length} verificações passaram. Screenshots em ${OUT}`);
process.exit(failed ? 1 : 0);
