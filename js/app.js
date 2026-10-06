(function () {
  'use strict';

  // =========================================================================
  // Utilitários
  // =========================================================================
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const LETTERS = ['A', 'B', 'C', 'D', 'E'];
  const pct = (c, t) => (t ? Math.round((c / t) * 100) : 0);
  const pad2 = (n) => String(n).padStart(2, '0');

  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // 754 -> "12:34"; 4472 -> "1:14:32"
  function fmtClock(sec) {
    sec = Math.max(0, Math.round(sec));
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return h ? `${h}:${pad2(m)}:${pad2(s)}` : `${pad2(m)}:${pad2(s)}`;
  }

  const dayKey = (ts) => { const d = new Date(ts); return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`; };
  function relDate(ts) {
    const today = dayKey(Date.now());
    const yesterday = dayKey(Date.now() - 864e5);
    const k = dayKey(ts);
    if (k === today) return 'Hoje';
    if (k === yesterday) return 'Ontem';
    const d = new Date(ts);
    return `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}`;
  }

  const ICON = {
    check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
    x: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>'
  };

  // localStorage pode falhar (aba anônima, bloqueio de cookies): o site funciona sem ele.
  const store = {
    get(key, fallback) {
      try {
        const v = localStorage.getItem(key);
        return v ? JSON.parse(v) : fallback;
      } catch (e) { return fallback; }
    },
    set(key, value) {
      try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* sem persistência */ }
    },
    remove(key) {
      try { localStorage.removeItem(key); } catch (e) { /* sem persistência */ }
    }
  };
  const KEY_HISTORY = 'clf.history';
  const KEY_ACH = 'clf.achievements';
  const KEY_THEME = 'clf.theme';
  const KEY_SESSION = 'clf.session';
  const KEY_EXAM_COUNT = 'clf.examCount'; // último número de simulado usado; só aumenta

  // =========================================================================
  // Configuração
  // =========================================================================
  const MODES = {
    full: { label: 'Simulado completo', minutes: 90, mix: { conceitos: 16, seguranca: 19, tecnologia: 22, faturamento: 8 } },
    quick: { label: 'Simulado rápido', minutes: 30, mix: { conceitos: 5, seguranca: 6, tecnologia: 7, faturamento: 2 } },
    train: { label: 'Treino', minutes: 0 }
  };
  const PASS = 700;          // nota mínima do exame (escala 100–1000)
  const PASS_PCT = ((PASS - 100) / 900) * 100; // % de acerto equivalente à nota mínima (~66,7%)
  const ARCHITECT = 900;     // nota do marco "Arquiteto"
  const STRONG = 80;         // % a partir da qual um domínio é ponto forte
  const WEAK = 70;           // % abaixo da qual um domínio pede atenção
  const MIN_SAMPLE = 3;      // questões mínimas para tirar conclusões sobre UM domínio
  const MIN_ROUND = 5;       // questões mínimas na RODADA para recomendações gerais confiáveis
  // Limites dos marcos (conquistas)
  const ACH_PERFECT_MIN = 10;  // "Gabaritou": tamanho mínimo da rodada
  const ACH_COMBO = 10;        // "Auto Scaling": acertos seguidos
  const ACH_GUARDIAN_MIN = 5;  // "Guardião IAM": questões mínimas de Segurança
  const ACH_PERSIST = 5;       // "Alta disponibilidade": tentativas concluídas
  const ACH_FAST_RATIO = 0.5;  // "Baixa latência": aprovado usando menos que esta fração do tempo
  const BLANK_WARN_RATIO = 0.5; // acima desta fração em branco, as recomendações avisam
  const TOP_TOPICS = 3;        // temas com mais erros listados em "O que estudar agora"
  const HISTORY_ROWS = 6;      // linhas da tabela de histórico recente
  const SAVE_EVERY = 15;     // segundos entre salvamentos automáticos do tempo
  const WARN_SECONDS = 300;  // a partir de quanto tempo restante o cronômetro avisa
  const HISTORY_MAX = 50;    // rodadas guardadas em clf.history
  const TREND_POINTS = 12;   // simulados mostrados no gráfico de evolução
  const QUESTION_BY_ID = new Map(QUESTIONS.map((q) => [q.id, q]));
  const quickCount = Object.values(MODES.quick.mix).reduce((a, b) => a + b, 0);

  const ACHIEVEMENTS = [
    { id: 'first', name: 'Primeiro deploy', desc: 'Conclua seu primeiro simulado ou treino.' },
    { id: 'pass', name: 'Aprovado', desc: `Tire ${PASS} ou mais no simulado completo.` },
    { id: 'architect', name: 'Arquiteto', desc: `Tire ${ARCHITECT} ou mais no simulado completo.` },
    { id: 'perfect', name: 'Gabaritou', desc: `Acerte 100% de uma rodada com ${ACH_PERFECT_MIN} ou mais questões.` },
    { id: 'combo10', name: 'Auto Scaling', desc: `Acerte ${ACH_COMBO} questões seguidas.` },
    { id: 'fast', name: 'Baixa latência', desc: `Seja aprovado usando menos de ${ACH_FAST_RATIO * 100}% do tempo.` },
    { id: 'guardian', name: 'Guardião IAM', desc: `Zere os erros em Segurança (mínimo ${ACH_GUARDIAN_MIN} questões) num simulado.` },
    { id: 'persist', name: 'Alta disponibilidade', desc: `Conclua ${ACH_PERSIST} tentativas.` }
  ];

  // =========================================================================
  // Estado
  // =========================================================================
  let S = null;              // rodada atual
  let lastStart = null;      // para "Refazer"
  let timerId = null;
  let lastResult = null;
  let reviewFilter = 'wrong';
  let warnedTime = false;
  let lastSave = 0;          // instante do último saveSession()

  const screens = { home: $('#screen-home'), quiz: $('#screen-quiz'), result: $('#screen-result') };
  function show(name) {
    Object.entries(screens).forEach(([k, el]) => { el.hidden = k !== name; });
    window.scrollTo(0, 0);
  }
  const inQuiz = () => S && !S.done && !screens.quiz.hidden;

  // =========================================================================
  // Estatísticas (funções puras sobre o histórico e a rodada)
  // =========================================================================
  const isCorrect = (it) => it.sel.length === it.q.a.length && it.q.a.every((x) => it.sel.includes(x));
  const scaledScore = (correct, total) => Math.round(100 + (900 * correct) / total);
  const emptyDomains = () => Object.fromEntries(Object.keys(DOMAINS).map((d) => [d, { c: 0, t: 0 }]));

  // Número de cada simulado (treinos não contam). Usa o `num` gravado na entrada;
  // entradas antigas sem `num` recebem número sequencial (e são gravadas por nextExamNumber).
  function examNumbers(hist) {
    let n = 0;
    return hist.map((h) => {
      if (h.mode === 'train') return null;
      n = h.num || n + 1;
      return n;
    });
  }

  // Próximo número de simulado. Grava `num` nas entradas antigas e usa um contador que só aumenta,
  // para a numeração não mudar nem reiniciar quando o histórico é cortado em HISTORY_MAX.
  function nextExamNumber(hist) {
    const nums = examNumbers(hist);
    hist.forEach((h, i) => { if (nums[i]) h.num = nums[i]; });
    const last = Math.max(store.get(KEY_EXAM_COUNT, 0), ...nums.filter(Boolean), 0);
    store.set(KEY_EXAM_COUNT, last + 1);
    return last + 1;
  }

  // "Simulado completo" / "Treino · Segurança e conformidade"
  const modeLabel = (mode, domain) => (mode === 'train' ? `Treino · ${DOMAINS[domain]?.name || ''}` : MODES[mode]?.label || 'Simulado');
  // Rótulo de uma rodada concluída: "Simulado completo #04" / "Treino · ..."
  const entryLabel = (h, num) => (h.mode === 'train' ? modeLabel(h.mode, h.domain) : `${modeLabel(h.mode)} #${pad2(num)}`);

  // Dias seguidos com pelo menos uma rodada concluída (até hoje ou ontem).
  function studyStreak(hist) {
    const days = new Set(hist.map((h) => dayKey(h.date)));
    let t = Date.now();
    if (!days.has(dayKey(t))) t -= 864e5;
    let n = 0;
    while (days.has(dayKey(t))) { n++; t -= 864e5; }
    return n;
  }

  function summarizeHistory(hist) {
    const answered = hist.reduce((s, h) => s + (h.total - (h.blank || 0)), 0);
    const correct = hist.reduce((s, h) => s + h.correct, 0);
    const exams = hist.filter((h) => h.mode !== 'train');
    return {
      answered,
      accuracy: answered ? pct(correct, answered) : null,
      exams: exams.length,
      streak: studyStreak(hist)
    };
  }

  // Acertos acumulados por domínio (só entradas que guardam byDomain).
  function domainHistory(hist) {
    const acc = emptyDomains();
    hist.forEach((h) => {
      if (!h.byDomain) return;
      Object.entries(h.byDomain).forEach(([d, v]) => {
        if (acc[d]) { acc[d].c += v.c; acc[d].t += v.t; }
      });
    });
    return acc;
  }

  // Calcula o resultado de uma rodada a partir das respostas reais.
  function evaluate(items) {
    let correct = 0, blank = 0, streak = 0, best = 0;
    const byDomain = emptyDomains();
    const missedTopics = {};
    items.forEach((it) => {
      const ok = isCorrect(it);
      byDomain[it.q.d].t++;
      if (!it.sel.length) blank++;
      if (ok) {
        correct++;
        byDomain[it.q.d].c++;
        best = Math.max(best, ++streak);
      } else {
        streak = 0;
        missedTopics[it.q.s] = (missedTopics[it.q.s] || 0) + 1;
      }
    });
    const total = items.length;
    return { total, correct, blank, wrong: total - correct - blank, best, byDomain, missedTopics };
  }

  // Recomendações derivadas apenas dos dados da rodada.
  function recommendations(r) {
    const recs = [];
    const doms = Object.entries(r.byDomain)
      .filter(([, v]) => v.t >= MIN_SAMPLE)
      .map(([d, v]) => ({ d, name: DOMAINS[d].name, c: v.c, t: v.t, p: pct(v.c, v.t) }))
      .sort((a, b) => b.p - a.p);
    let weakest = null;

    if (r.total < MIN_ROUND) {
      recs.push({ kind: '', html: `Amostra pequena (${r.total} ${r.total === 1 ? 'questão' : 'questões'}). Responda mais questões para recomendações confiáveis.` });
    }
    if (r.blank > r.total * BLANK_WARN_RATIO) {
      recs.push({ kind: 'bad', html: `Você deixou <strong>${r.blank} de ${r.total}</strong> questões em branco, então os números abaixo refletem principalmente questões não respondidas.` });
    }
    if (doms.length >= 2 && doms[0].p !== doms[doms.length - 1].p) {
      const b = doms[0];
      const w = doms[doms.length - 1];
      recs.push(b.p >= WEAK
        ? { kind: 'ok', html: `Seu melhor desempenho foi em <strong>${esc(b.name)}</strong>: ${b.p}% (${b.c} de ${b.t}).` }
        : { kind: 'bad', html: `Nenhum domínio chegou a ${WEAK}%. O mais próximo foi <strong>${esc(b.name)}</strong>, com ${b.p}%.` });
      recs.push({ kind: 'bad', html: `Seu maior ponto de atenção foi <strong>${esc(w.name)}</strong>: ${w.p}%, com ${w.t - w.c} ${w.t - w.c === 1 ? 'erro' : 'erros'} em ${w.t} questões.` });
      if (w.p < 100) weakest = w;
    } else if (doms.length === 1) {
      const only = doms[0];
      recs.push({ kind: only.p >= WEAK ? 'ok' : 'bad', html: `Você acertou ${only.p}% em <strong>${esc(only.name)}</strong> (${only.c} de ${only.t}).` });
      if (only.p < 100) weakest = only;
    } else if (doms.length >= 2) {
      recs.push({ kind: 'ok', html: `Desempenho igual em todos os domínios avaliados: ${doms[0].p}%.` });
    }

    const topics = Object.entries(r.missedTopics).sort((a, b) => b[1] - a[1]).slice(0, TOP_TOPICS);
    if (topics.length) {
      const list = topics.map(([s, n]) => `<strong>${esc(s)}</strong> (${n})`).join(', ');
      recs.push({ kind: 'bad', html: `Temas com mais erros ou questões em branco: ${list}. Releia as explicações na revisão abaixo.` });
    } else if (r.total >= MIN_ROUND) {
      recs.push({ kind: 'ok', html: 'Nenhum erro nesta rodada.' });
    }
    return { recs, weakest };
  }

  // =========================================================================
  // Rodada: criação, persistência e restauração
  // =========================================================================
  function buildPool(mode, domain) {
    if (mode === 'train') return shuffle(QUESTIONS.filter((q) => q.d === domain));
    // Sorteia por domínio nos pesos oficiais do exame.
    return shuffle(Object.entries(MODES[mode].mix).flatMap(([d, n]) =>
      shuffle(QUESTIONS.filter((q) => q.d === d)).slice(0, n)));
  }

  function newItem(q, order) {
    // streak: sequência de acertos registrada no momento em que a questão foi conferida (treino)
    return { q, order: order || shuffle(q.o.map((_, i) => i)), sel: [], flagged: false, revealed: false, streak: 0 };
  }

  const elapsed = () => (Date.now() - S.startedAt) / 1000;

  function saveSession() {
    if (!S || S.done) return;
    lastSave = Date.now();
    store.set(KEY_SESSION, {
      v: 1,
      mode: S.mode,
      domain: S.domain,
      i: S.i,
      elapsed: Math.round(elapsed()),
      combo: S.combo,
      items: S.items.map((it) => ({ id: it.q.id, o: it.order, s: it.sel, f: it.flagged ? 1 : 0, r: it.revealed ? 1 : 0, k: it.streak }))
    });
  }

  const clearSession = () => store.remove(KEY_SESSION);

  // Lê a rodada salva e valida contra o banco atual; descarta se algo não bater.
  function loadSession() {
    const raw = store.get(KEY_SESSION, null);
    if (!raw || raw.v !== 1 || !MODES[raw.mode] || !Array.isArray(raw.items) || !raw.items.length) return null;
    const valid = raw.items.every((x) => {
      const q = QUESTION_BY_ID.get(x.id);
      return q && Array.isArray(x.o) && x.o.length === q.o.length && Array.isArray(x.s) && x.s.every((i) => i >= 0 && i < q.o.length);
    });
    if (!valid || (raw.mode === 'train' && !DOMAINS[raw.domain])) { clearSession(); return null; }
    return raw;
  }

  function hydrate(raw) {
    return {
      mode: raw.mode,
      domain: raw.domain,
      i: Math.min(Math.max(0, raw.i | 0), raw.items.length - 1),
      startedAt: Date.now() - (raw.elapsed || 0) * 1000,
      limit: MODES[raw.mode].minutes * 60,
      combo: raw.combo || 0,
      done: false,
      items: raw.items.map((x) => {
        const it = newItem(QUESTION_BY_ID.get(x.id), x.o);
        it.sel = x.s.slice();
        it.flagged = !!x.f;
        it.revealed = !!x.r;
        it.streak = x.k | 0;
        return it;
      })
    };
  }

  function start(mode, domain) {
    const items = buildPool(mode, domain).map((q) => newItem(q));
    beginSession({ mode, domain, items, i: 0, startedAt: Date.now(), limit: MODES[mode].minutes * 60, combo: 0, done: false });
  }

  function resume() {
    const raw = loadSession();
    if (raw) beginSession(hydrate(raw)); else renderHome();
  }

  function beginSession(session) {
    S = session;
    lastStart = { mode: S.mode, domain: S.domain };
    // Único ponto que trata "tempo esgotado antes de abrir" (ex.: rodada retomada depois do prazo):
    // vai direto ao resultado, sem mostrar o quiz.
    if (S.limit && elapsed() >= S.limit) { finish(true); return; }
    warnedTime = false;
    $('#timer').classList.remove('warn'); // não herda o aviso de uma rodada anterior
    const train = S.mode === 'train';
    $('#quiz-mode-label').textContent = modeLabel(S.mode, S.domain);
    $('#timer-label').textContent = train ? 'Tempo' : 'Tempo restante';
    $('#flag-btn').hidden = train;
    $('#shortcuts').innerHTML = train
      ? '<kbd>1</kbd>–<kbd>5</kbd> escolhem · <kbd>Enter</kbd> confere e avança · <kbd>←</kbd> <kbd>→</kbd> navegam'
      : '<kbd>1</kbd>–<kbd>5</kbd> escolhem · <kbd>Enter</kbd> avança · <kbd>←</kbd> <kbd>→</kbd> navegam · <kbd>M</kbd> marca';
    ['#finish-btn', '#finish-btn-2'].forEach((s) => { $(s).textContent = train ? 'Encerrar treino' : 'Finalizar simulado'; });
    renderLegend();
    clearInterval(timerId);
    show('quiz');
    renderQuestion();
    timerId = setInterval(tick, 1000);
    tick();          // se o tempo acabar aqui, finish() já para o intervalo
    saveSession();   // não faz nada se a rodada terminou
  }

  function stopTimer() { clearInterval(timerId); timerId = null; }

  function tick() {
    if (!S || S.done) return;
    const el = $('#timer');
    const secs = Math.round(elapsed());
    if (S.limit) {
      const left = S.limit - elapsed();
      el.textContent = fmtClock(left);
      el.classList.toggle('warn', left <= WARN_SECONDS);
      if (left <= WARN_SECONDS && left > 0 && !warnedTime) {
        warnedTime = true;
        // Usa o tempo real que falta (pode ser bem menos que 5 min ao retomar ou voltar de outra aba).
        const mins = Math.ceil(left / 60);
        toast(left > 60 ? `Faltam ${mins} minutos.` : 'Falta menos de 1 minuto.');
      }
      if (left <= 0) { finish(true); return; }
    } else {
      el.textContent = fmtClock(secs);
    }
    // Compara com o último salvamento: resiste a ticks atrasados ou pulados (aba em segundo plano).
    if (Date.now() - lastSave >= SAVE_EVERY * 1000) saveSession();
  }

  // =========================================================================
  // Quiz: renderização
  // =========================================================================
  function renderQuestion(animate = true) {
    const it = S.items[S.i];
    const q = it.q;
    const need = q.a.length;
    const multi = need > 1;
    const total = S.items.length;

    $('#quiz-counter').textContent = `Questão ${S.i + 1} de ${total}`;
    $('#progress-bar').style.width = `${((S.i + 1) / total) * 100}%`;
    $('#q-number').textContent = `Questão ${S.i + 1}`;
    $('#q-domain').textContent = DOMAINS[q.d].name;
    $('#q-text').textContent = q.q;

    const hint = $('#q-hint');
    hint.classList.toggle('multi', multi);
    hint.innerHTML = multi
      ? `<span class="tag">Múltipla resposta</span><span>Selecione ${need} respostas</span><span class="sel-count">${it.sel.length} de ${need} selecionadas</span>`
      : 'Selecione 1 resposta';

    renderOptions(it);
    renderFeedback(it);
    renderFlag(it);
    updateActions();
    renderMaps();

    if (animate) {
      const card = $('#question');
      card.classList.remove('enter');
      void card.offsetWidth; // reinicia a animação
      card.classList.add('enter');
    }
  }

  // Estado visual de uma alternativa: classes e rótulo de status.
  function optionState(it, orig) {
    const selected = it.sel.includes(orig);
    if (it.revealed) {
      if (it.q.a.includes(orig)) return { cls: 'option correct', status: 'Correta', selected };
      if (selected) return { cls: 'option wrong', status: 'Sua resposta', selected };
      return { cls: 'option dim', status: '', selected };
    }
    return { cls: selected ? 'option selected' : 'option', status: '', selected };
  }

  function renderOptions(it) {
    const q = it.q;
    const multi = q.a.length > 1;
    const box = $('#options');
    // Mesma questão já na tela: atualiza os botões no lugar, para as transições de seleção aparecerem.
    const key = `${q.id}:${it.order.join(',')}`; // mesma questão E mesma ordem das alternativas
    if (box.dataset.key === key) {
      Array.from(box.children).forEach((btn) => {
        const st = optionState(it, Number(btn.dataset.orig));
        btn.className = st.cls;
        btn.setAttribute('aria-checked', String(st.selected));
        if (it.revealed) btn.setAttribute('aria-disabled', 'true'); else btn.removeAttribute('aria-disabled');
        btn.querySelector('.opt-status').textContent = st.status;
      });
      return;
    }
    box.dataset.key = key;
    box.setAttribute('role', multi ? 'group' : 'radiogroup');
    box.setAttribute('aria-labelledby', 'q-text');
    box.innerHTML = it.order.map((orig, pos) => {
      const st = optionState(it, orig);
      return `<button type="button" class="${st.cls}" role="${multi ? 'checkbox' : 'radio'}" aria-checked="${st.selected}"
        data-orig="${orig}" ${it.revealed ? 'aria-disabled="true"' : ''}>
        <span class="opt-control" aria-hidden="true"></span>
        <span class="opt-key">${LETTERS[pos]}</span>
        <span class="opt-text">${esc(q.o[orig])}</span>
        <span class="opt-status">${st.status}</span></button>`;
    }).join('');
  }

  // Bloco "Sua resposta / Resposta correta / Explicação / Tema" (treino e revisão).
  function explanationHtml(it) {
    const q = it.q;
    const letter = (orig) => LETTERS[it.order.indexOf(orig)];
    const line = (orig, kind) => `<span class="ans ${kind}"><b>${letter(orig)}</b>${esc(q.o[orig])}</span>`;
    const correctSorted = q.a.slice().sort((x, y) => it.order.indexOf(x) - it.order.indexOf(y));
    const chosenSorted = it.sel.slice().sort((x, y) => it.order.indexOf(x) - it.order.indexOf(y));
    const yours = chosenSorted.length
      ? chosenSorted.map((o) => line(o, q.a.includes(o) ? 'ok' : 'bad')).join('')
      : '<span class="ans subtle">Em branco</span>';
    return `<dl class="explain">
      <dt>Sua resposta</dt><dd>${yours}</dd>
      <dt>Resposta correta</dt><dd>${correctSorted.map((o) => line(o, 'ok')).join('')}</dd>
      <dt>Explicação</dt><dd>${esc(q.e)}</dd>
      <dt>Tema</dt><dd class="topic">${esc(q.s)}</dd>
    </dl>`;
  }

  function renderFeedback(it) {
    const fb = $('#feedback');
    if (!it.revealed) { fb.hidden = true; fb.innerHTML = ''; return; }
    const ok = isCorrect(it);
    // Sequência registrada quando esta questão foi conferida (não a atual da rodada).
    const streak = ok && it.streak >= 2 ? `<span class="streak">Sequência: ${it.streak}</span>` : '';
    fb.hidden = false;
    fb.innerHTML = `<p class="feedback-head ${ok ? 'ok' : 'bad'}">${ok ? ICON.check : ICON.x}${ok ? 'Correto' : 'Incorreto'}${streak}</p>${explanationHtml(it)}`;
  }

  function renderFlag(it) {
    const flag = $('#flag-btn');
    flag.setAttribute('aria-pressed', String(it.flagged));
    flag.setAttribute('aria-label', it.flagged ? 'Desmarcar questão' : 'Marcar para revisão');
    $('#flag-label').textContent = it.flagged ? 'Marcada' : 'Marcar';
  }

  function updateActions() {
    const it = S.items[S.i];
    const last = S.i === S.items.length - 1;
    const next = $('#next-btn');
    $('#prev-btn').disabled = S.i === 0;
    if (S.mode === 'train' && !it.revealed) {
      $('#next-label').textContent = 'Conferir';
      next.disabled = it.sel.length !== it.q.a.length;
    } else {
      $('#next-label').textContent = last ? (S.mode === 'train' ? 'Ver resultado' : 'Finalizar') : 'Próxima';
      next.disabled = false;
    }
  }

  // Estado de uma célula do mapa: respondida/correta/incorreta/em branco + marcada + atual.
  function cellState(it, phase) {
    if (phase === 'review' || it.revealed) {
      if (phase === 'review' && !it.sel.length) return 'blank';
      return isCorrect(it) ? 'correct' : 'wrong';
    }
    return it.sel.length ? 'answered' : 'blank';
  }
  const STATE_LABEL = { answered: 'respondida', blank: 'em branco', correct: 'correta', wrong: 'incorreta' };

  function mapHtml(items, phase, current) {
    return items.map((it, idx) => {
      const st = cellState(it, phase);
      const cls = ['qcell', st];
      if (it.flagged) cls.push('flagged');
      if (idx === current) cls.push('current');
      const label = `Questão ${idx + 1}, ${STATE_LABEL[st]}${it.flagged ? ', marcada' : ''}`;
      return `<button type="button" class="${cls.join(' ')}" data-idx="${idx}" aria-label="${label}"${idx === current ? ' aria-current="true"' : ''}>${idx + 1}</button>`;
    }).join('');
  }

  function countsHtml() {
    const items = S.items;
    let cells;
    if (S.mode === 'train') {
      const rev = items.filter((it) => it.revealed);
      const ok = rev.filter(isCorrect).length;
      cells = [['Conferidas', rev.length], ['Acertos', ok], ['Erros', rev.length - ok]];
    } else {
      const answered = items.filter((it) => it.sel.length).length;
      cells = [['Respondidas', answered], ['Marcadas', items.filter((it) => it.flagged).length], ['Em branco', items.length - answered]];
    }
    return cells.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('');
  }

  function renderMaps() {
    const html = mapHtml(S.items, 'quiz', S.i);
    $('#rail-map').innerHTML = html;
    $('#drawer-map').innerHTML = html;
    const counts = countsHtml();
    $('#rail-counts').innerHTML = counts;
    $('#drawer-counts').innerHTML = counts;
  }

  function legendHtml(states) {
    const names = { answered: 'Respondida', blank: 'Em branco', correct: 'Correta', wrong: 'Incorreta', flagged: 'Marcada' };
    return states.map((s) => `<span><i class="lg ${s === 'blank' ? '' : s}" aria-hidden="true"></i>${names[s]}</span>`).join('');
  }

  function renderLegend() {
    const states = S.mode === 'train' ? ['correct', 'wrong', 'answered', 'blank'] : ['answered', 'blank', 'flagged'];
    $('#rail-legend').innerHTML = legendHtml(states);
    $('#drawer-legend').innerHTML = legendHtml(states);
  }

  // =========================================================================
  // Quiz: ações
  // =========================================================================
  function selectOption(orig) {
    const it = S.items[S.i];
    if (it.revealed) return;
    const need = it.q.a.length;
    if (need === 1) {
      it.sel = [orig];
    } else if (it.sel.includes(orig)) {
      it.sel = it.sel.filter((x) => x !== orig);
    } else {
      it.sel.push(orig);
      if (it.sel.length > need) it.sel.shift(); // mantém só a quantidade pedida
    }
    renderQuestion(false); // os botões são atualizados no lugar, então o foco do teclado se mantém
    saveSession();
  }

  function reveal() {
    const it = S.items[S.i];
    it.revealed = true;
    S.combo = isCorrect(it) ? S.combo + 1 : 0;
    it.streak = S.combo;
    renderQuestion(false);
    $('#next-btn').focus();
    saveSession();
  }

  function toggleFlag() {
    if (S.mode === 'train') return;
    const it = S.items[S.i];
    it.flagged = !it.flagged;
    renderFlag(it);
    renderMaps();
    saveSession();
  }

  function goTo(idx) {
    if (idx < 0 || idx >= S.items.length) return;
    S.i = idx;
    renderQuestion();
    saveSession();
  }

  function onNext() {
    const it = S.items[S.i];
    const last = S.i === S.items.length - 1;
    if (S.mode === 'train' && !it.revealed) {
      if (it.sel.length === it.q.a.length) reveal();
      return;
    }
    if (last) requestFinish(); else goTo(S.i + 1);
  }

  async function requestFinish() {
    if (S.mode === 'train') {
      const rev = S.items.filter((it) => it.revealed).length;
      if (!rev) {
        if (await confirmDialog('Encerrar treino?', 'Nenhuma questão foi conferida, então não haverá resultado.', 'Encerrar') && inQuiz()) discardAndHome();
        return;
      }
      if (rev === S.items.length) { finish(false); return; }
      if (await confirmDialog('Encerrar treino?', `Você conferiu ${rev} de ${S.items.length} questões. O resultado considera só as conferidas.`, 'Encerrar')) finish(false);
      return;
    }
    const blank = S.items.filter((it) => !it.sel.length).length;
    const flagged = S.items.filter((it) => it.flagged).length;
    const parts = [];
    if (blank) parts.push(`${blank} em branco (contam como erro)`);
    if (flagged) parts.push(`${flagged} marcada${flagged > 1 ? 's' : ''} para revisão`);
    const text = parts.length ? `Você tem ${parts.join(' e ')}. Deseja finalizar mesmo assim?` : 'Todas as questões foram respondidas. Deseja ver o resultado?';
    if (await confirmDialog('Finalizar simulado?', text, 'Finalizar')) finish(false);
  }

  function discardAndHome() {
    if (S) S.done = true;
    stopTimer();
    clearSession();
    renderHome();
  }

  async function exitQuiz() {
    if (!inQuiz()) { renderHome(); return; }
    if (!(await confirmDialog('Sair do simulado?', 'Seu progresso fica salvo e você pode continuar pela tela inicial.', 'Sair'))) return;
    if (!inQuiz()) return; // a rodada terminou enquanto o diálogo estava aberto
    saveSession();
    stopTimer();
    S = null;
    renderHome();
  }

  // =========================================================================
  // Resultado
  // =========================================================================
  function finish(timeUp) {
    if (!S || S.done) return;
    S.done = true;
    stopTimer();
    clearSession();
    closeDrawer();
    const dlg = $('#confirm-dialog');
    if (dlg.open) dlg.close(); // uma confirmação pendente não pode agir sobre a rodada encerrada

    const train = S.mode === 'train';
    const counted = train ? S.items.filter((it) => it.revealed) : S.items;
    const ev = evaluate(counted);
    const time = Math.min(elapsed(), S.limit || Infinity);
    const score = scaledScore(ev.correct, ev.total);
    const r = { ...ev, mode: S.mode, domain: S.domain, score, passed: score >= PASS, time, limit: S.limit, timeUp, date: Date.now(), items: counted };

    const hist = store.get(KEY_HISTORY, []);
    r.number = train ? null : nextExamNumber(hist);
    const entry = { date: r.date, mode: r.mode, domain: r.domain, score, correct: ev.correct, total: ev.total, blank: ev.blank, time: Math.round(time), byDomain: ev.byDomain };
    if (r.number) entry.num = r.number;
    hist.push(entry);
    store.set(KEY_HISTORY, hist.slice(-HISTORY_MAX));

    lastResult = r;
    renderResult(r, checkAchievements(r, hist.length));
  }

  function checkAchievements(r, attempts) {
    const got = new Set(store.get(KEY_ACH, []));
    const exam = r.mode !== 'train';
    const rules = {
      first: true,
      pass: r.mode === 'full' && r.score >= PASS,
      architect: r.mode === 'full' && r.score >= ARCHITECT,
      perfect: r.total >= ACH_PERFECT_MIN && r.correct === r.total,
      combo10: r.best >= ACH_COMBO,
      fast: exam && r.passed && r.time < r.limit * ACH_FAST_RATIO,
      guardian: exam && r.byDomain.seguranca.t >= ACH_GUARDIAN_MIN && r.byDomain.seguranca.c === r.byDomain.seguranca.t,
      persist: attempts >= ACH_PERSIST
    };
    const fresh = ACHIEVEMENTS.filter((a) => rules[a.id] && !got.has(a.id));
    fresh.forEach((a) => got.add(a.id));
    store.set(KEY_ACH, Array.from(got));
    return fresh;
  }

  function domainClass(p, t) {
    if (t < MIN_SAMPLE) return 'small';
    if (p >= STRONG) return 'strong';
    if (p < WEAK) return 'weak';
    return '';
  }

  function renderResult(r, unlocked) {
    const train = r.mode === 'train';
    const label = entryLabel(r, r.number);
    $('#result-mode').textContent = `${label} · ${relDate(r.date)}`;
    $('#r-pct').textContent = `${pct(r.correct, r.total)}%`;
    $('#r-correct').textContent = `${r.correct} de ${r.total} ${r.total === 1 ? 'correta' : 'corretas'}`;

    const timeUp = r.timeUp ? '<small>O tempo acabou; questões sem resposta contam como erro.</small>' : '';
    $('#r-verdict').innerHTML = train
      ? `<span class="status ${pct(r.correct, r.total) >= WEAK ? 'pass' : 'fail'}">Treino concluído</span><br>${r.total} ${r.total === 1 ? 'questão conferida' : 'questões conferidas'} em ${esc(DOMAINS[r.domain].name)}.`
      : `<span class="status ${r.passed ? 'pass' : 'fail'}">${r.passed ? 'Acima da nota de aprovação' : 'Abaixo da nota de aprovação'}</span><br>Pontuação estimada <strong class="mono">${r.score}</strong>/1000. A aprovação é ${PASS}.<small>Estimativa linear; a AWS usa uma escala própria.</small>${timeUp}`;

    const stats = [
      ['Acertos', `<span class="ok">${r.correct}</span>`],
      ['Erros', `<span class="${r.wrong ? 'bad' : ''}">${r.wrong}</span>`],
      ['Em branco', String(r.blank)],
      ['Tempo utilizado', r.limit ? `${fmtClock(r.time)} <small>de ${fmtClock(r.limit)}</small>` : fmtClock(r.time)],
      ['Maior sequência de acertos', String(r.best)]
    ];
    if (train) stats.splice(2, 1); // no treino não existe "em branco"
    $('#r-stats').innerHTML = stats.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('');

    $('#r-domains').innerHTML = Object.entries(DOMAINS)
      .filter(([d]) => r.byDomain[d].t > 0)
      .map(([d, info]) => {
        const { c, t } = r.byDomain[d];
        const p = pct(c, t);
        const cls = domainClass(p, t);
        const tag = { strong: 'Forte', weak: 'Atenção', small: 'Amostra pequena' }[cls] || '';
        return `<div class="d-row">
          <div class="d-row-head"><span class="d-name">${esc(info.name)}${tag ? `<span class="d-tag ${cls}">${tag}</span>` : ''}</span>
            <span class="d-nums">${c}/${t}<strong>${p}%</strong></span></div>
          <div class="d-bar" role="img" aria-label="${esc(info.name)}: ${p}% de acertos"><span class="${cls}" style="width:${p}%"></span><i style="left:${WEAK}%" title="${WEAK}%"></i></div>
        </div>`;
      }).join('') + `<p class="d-legend">O traço marca ${WEAK}%. Forte: ${STRONG}% ou mais. Atenção: abaixo de ${WEAK}%. Domínios com menos de ${MIN_SAMPLE} questões não são avaliados.</p>`;

    const { recs, weakest } = recommendations(r);
    const actions = [];
    if (weakest) actions.push(`<button type="button" class="btn btn-primary" data-train="${weakest.d}">Treinar ${esc(weakest.name)}</button>`);
    if (r.mode !== 'full' && r.total >= MIN_ROUND && pct(r.correct, r.total) >= STRONG) actions.push('<button type="button" class="btn" data-mode-start="full">Fazer o simulado completo</button>');
    $('#r-advice').innerHTML = `<ul class="advice-list">${recs.map((x) => `<li class="${x.kind}"><span>${x.html}</span></li>`).join('')}</ul>` +
      (actions.length ? `<div class="advice-actions">${actions.join('')}</div>` : '');

    const ms = $('#r-milestone');
    ms.hidden = !unlocked.length;
    ms.innerHTML = unlocked.length ? `Marco alcançado: ${unlocked.map((a) => `<strong>${esc(a.name)}</strong>`).join(', ')}.` : '';

    reviewFilter = r.wrong ? 'wrong' : r.blank ? 'blank' : 'all';
    renderReview();
    show('result');
  }

  const FILTERS = [
    ['wrong', 'Erradas', (it) => it.sel.length && !isCorrect(it)],
    ['blank', 'Em branco', (it) => !it.sel.length],
    ['flagged', 'Marcadas', (it) => it.flagged],
    ['all', 'Todas', () => true]
  ];

  function renderReview() {
    const r = lastResult;
    const train = r.mode === 'train';
    const filters = FILTERS.filter(([k]) => !train || (k !== 'blank' && k !== 'flagged'));
    $('#review-filters').innerHTML = filters.map(([k, name, fn]) =>
      `<button type="button" role="radio" aria-checked="${k === reviewFilter}" data-filter="${k}">${name}<span class="n">${r.items.filter(fn).length}</span></button>`).join('');

    $('#review-map').innerHTML = mapHtml(r.items, 'review', -1);

    const fn = FILTERS.find(([k]) => k === reviewFilter)[2];
    const list = r.items.map((it, idx) => ({ it, idx })).filter(({ it }) => fn(it));
    if (!list.length) {
      const msg = { wrong: 'Nenhuma questão errada.', blank: 'Nenhuma questão em branco.', flagged: 'Nenhuma questão marcada para revisão.' }[reviewFilter] || 'Nada para mostrar.';
      $('#review-list').innerHTML = `<li class="empty-review">${msg}</li>`;
      return;
    }
    $('#review-list').innerHTML = list.map(({ it, idx }) => {
      const q = it.q;
      const ok = isCorrect(it);
      const state = ok ? '<span class="state ok">Correta</span>' : it.sel.length ? '<span class="state bad">Incorreta</span>' : '<span class="state blank">Em branco</span>';
      return `<li class="review-item" id="rev-${idx}">
        <div class="review-top"><span class="num">Questão ${idx + 1}</span><span>${esc(DOMAINS[q.d].name)}</span>${state}${it.flagged ? '<span class="state flag">Marcada</span>' : ''}</div>
        <p class="review-q">${esc(q.q)}</p>
        <ul class="review-opts">
          ${it.order.map((orig, pos) => {
            const right = q.a.includes(orig);
            const chosen = it.sel.includes(orig);
            const cls = right ? 'correct' : chosen ? 'wrong' : '';
            return `<li class="${cls}"><span class="k">${LETTERS[pos]}</span><span>${esc(q.o[orig])}</span><span class="m" aria-label="${right ? 'correta' : chosen ? 'sua resposta, incorreta' : ''}">${right ? '✓' : chosen ? '✕' : ''}</span></li>`;
          }).join('')}
        </ul>
        ${explanationHtml(it)}
      </li>`;
    }).join('');
  }

  function jumpToReview(idx) {
    if (!$(`#rev-${idx}`)) { reviewFilter = 'all'; renderReview(); }
    const el = $(`#rev-${idx}`);
    el.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
    el.classList.remove('flash'); void el.offsetWidth; el.classList.add('flash');
  }

  // =========================================================================
  // Início
  // =========================================================================
  function renderContinue(hist) {
    const box = $('#continue');
    const saved = loadSession();

    if (saved) {
      const total = saved.items.length;
      const answered = saved.items.filter((x) => x.s.length).length;
      const train = saved.mode === 'train';
      const title = modeLabel(saved.mode, saved.domain);
      const meta = [`<span><strong>${answered}</strong> de ${total} respondidas</span>`];
      if (train) {
        const rev = saved.items.filter((x) => x.r);
        const ok = rev.filter((x) => isCorrect({ q: QUESTION_BY_ID.get(x.id), sel: x.s })).length;
        if (rev.length) meta.push(`<span><strong>${pct(ok, rev.length)}%</strong> de acerto</span>`);
      } else {
        meta.push(`<span><strong>${fmtClock(MODES[saved.mode].minutes * 60 - (saved.elapsed || 0))}</strong> restantes</span>`);
      }
      box.innerHTML = `<p class="continue-label">Em andamento</p>
        <p class="continue-title">${esc(title)}</p>
        <p class="continue-meta">${meta.join('')}</p>
        <div class="continue-progress" aria-hidden="true"><span style="width:${pct(answered, total)}%"></span></div>
        <div class="continue-actions">
          <button type="button" class="btn btn-primary" data-action="resume">Continuar</button>
          <button type="button" class="btn-quiet" data-action="discard">Descartar</button>
        </div>
        ${train ? '' : '<p class="continue-note">O tempo fica pausado enquanto o simulado está fechado.</p>'}`;
      return;
    }

    if (hist.length) {
      const nums = examNumbers(hist);
      const i = hist.length - 1;
      const h = hist[i];
      const p = pct(h.correct, h.total);
      box.innerHTML = `<p class="continue-label">Último resultado · ${relDate(h.date)}</p>
        <p class="continue-title">${esc(entryLabel(h, nums[i]))}</p>
        <p class="continue-meta"><span><strong>${p}%</strong> de acerto</span><span><strong>${h.correct}</strong> de ${h.total} questões</span></p>
        <div class="continue-actions">
          <button type="button" class="btn btn-primary" data-action="again" data-mode="${h.mode}" data-domain="${esc(h.domain || '')}">${h.mode === 'train' ? 'Treinar de novo' : 'Novo simulado'}</button>
        </div>`;
      return;
    }

    box.innerHTML = `<p class="continue-title">Comece seu primeiro simulado</p>
      <p class="continue-meta"><span>O simulado rápido (${quickCount} questões, ${MODES.quick.minutes} min) mostra em poucos minutos em quais domínios você precisa focar.</span></p>
      <div class="continue-actions"><button type="button" class="btn btn-primary" data-action="again" data-mode="quick">Começar simulado rápido</button></div>`;
  }

  function renderDomainList(hist) {
    const dh = domainHistory(hist);
    $('#domain-list').innerHTML = Object.entries(DOMAINS).map(([key, d]) => {
      const n = QUESTIONS.filter((q) => q.d === key).length;
      const { c, t } = dh[key];
      const p = pct(c, t);
      const k = domainClass(p, t);
      const cls = k === 'small' ? '' : k;
      const hist = t ? `<span class="d-pct ${cls}" title="Seu acerto histórico neste domínio">${p}%</span>` : '<span class="d-pct">—</span>';
      return `<li><button type="button" class="domain-btn" data-domain="${key}"><span>${esc(d.name)}</span><span class="d-count">${n} questões</span>${hist}</button></li>`;
    }).join('');
  }

  function sparkline(values) {
    const w = 300, h = 56, pad = 4;
    const x = (i) => (values.length === 1 ? w / 2 : pad + (i * (w - 2 * pad)) / (values.length - 1));
    const y = (v) => h - pad - (v / 100) * (h - 2 * pad);
    const pts = values.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
    return `<svg class="spark" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" role="img" aria-label="Acerto nos últimos simulados: ${values.join('%, ')}%">
      <line x1="0" x2="${w}" y1="${y(PASS_PCT)}" y2="${y(PASS_PCT)}" class="spark-goal"><title>Aprovação (${PASS}/1000)</title></line>
      <polyline points="${pts}" class="spark-line"/>
      ${values.map((v, i) => `<circle cx="${x(i).toFixed(1)}" cy="${y(v).toFixed(1)}" r="2.5" class="spark-dot"><title>${v}%</title></circle>`).join('')}
    </svg>`;
  }

  function renderProgress(hist) {
    if (!hist.length) {
      $('#progress').innerHTML = '<p class="empty">Seu progresso aparece aqui depois da primeira rodada: questões respondidas, taxa de acerto, simulados concluídos e dias seguidos de estudo.</p>';
      $('#history').innerHTML = '';
      return;
    }
    const s = summarizeHistory(hist);
    $('#progress').innerHTML = `<dl class="metrics">
      <div class="metric"><dt>Questões respondidas</dt><dd>${s.answered}</dd></div>
      <div class="metric"><dt>Taxa de acerto</dt><dd>${s.accuracy === null ? '—' : s.accuracy + '%'}</dd></div>
      <div class="metric"><dt>Simulados concluídos</dt><dd>${s.exams}</dd></div>
      <div class="metric"><dt>Sequência de estudo</dt><dd>${s.streak}<small>${s.streak === 1 ? 'dia' : 'dias'}</small></dd></div>
    </dl>`;

    const nums = examNumbers(hist);
    const exams = hist.filter((h) => h.mode !== 'train');
    const trend = exams.length >= 2
      ? `<div class="trend"><div class="trend-head"><span>Evolução nos simulados</span><span>tracejado = aprovação · últimos ${Math.min(exams.length, TREND_POINTS)}</span></div>${sparkline(exams.slice(-TREND_POINTS).map((h) => pct(h.correct, h.total)))}</div>`
      : '';
    const rows = hist.map((h, i) => ({ h, i })).slice(-HISTORY_ROWS).reverse().map(({ h, i }) => {
      const p = pct(h.correct, h.total);
      const ok = h.mode === 'train' ? p >= WEAK : h.score >= PASS;
      return `<tr><td>${esc(entryLabel(h, nums[i]))}</td><td class="num ${ok ? 'pass' : 'fail'}">${p}%</td><td class="num">${h.total}</td><td class="num">${relDate(h.date)}</td></tr>`;
    }).join('');
    $('#history').innerHTML = `${trend}
      <table class="history-table">
        <caption>Histórico recente</caption>
        <thead><tr><th scope="col">Rodada</th><th scope="col" class="num">Acerto</th><th scope="col" class="num">Questões</th><th scope="col" class="num">Data</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
      <button type="button" class="btn-quiet clear-history" data-action="clear-history">Limpar histórico</button>`;
  }

  function renderAchievements() {
    const got = new Set(store.get(KEY_ACH, []));
    $('#milestone-count').textContent = `${ACHIEVEMENTS.filter((a) => got.has(a.id)).length} de ${ACHIEVEMENTS.length}`;
    $('#achievements').innerHTML = ACHIEVEMENTS.map((a) => {
      const done = got.has(a.id);
      return `<li class="${done ? 'done' : ''}"><span class="ms-icon" aria-hidden="true">${done ? ICON.check : ''}</span>
        <span><strong>${esc(a.name)}</strong><small>${esc(a.desc)}</small><span class="sr-only">${done ? 'alcançado' : 'pendente'}</span></span></li>`;
    }).join('');
  }

  function renderHome() {
    const hist = store.get(KEY_HISTORY, []); // lido uma vez e repassado
    renderContinue(hist);
    renderDomainList(hist);
    renderProgress(hist);
    renderAchievements();
    show('home');
  }

  // =========================================================================
  // Tema, diálogos, toast, drawer
  // =========================================================================
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)');
  const effectiveTheme = () => document.documentElement.getAttribute('data-theme') || (systemDark.matches ? 'dark' : 'light');
  function applyTheme(theme) {
    if (theme) document.documentElement.setAttribute('data-theme', theme);
    else document.documentElement.removeAttribute('data-theme');
    $('#theme-toggle').setAttribute('aria-label', effectiveTheme() === 'dark' ? 'Usar tema claro' : 'Usar tema escuro');
  }
  applyTheme(store.get(KEY_THEME, null));
  systemDark.addEventListener('change', () => applyTheme(store.get(KEY_THEME, null)));

  function confirmDialog(title, text, yesLabel) {
    const dlg = $('#confirm-dialog');
    $('#dlg-title').textContent = title;
    $('#dlg-text').textContent = text;
    $('#dlg-yes').textContent = yesLabel;
    if (typeof dlg.showModal !== 'function') return Promise.resolve(window.confirm(text));
    return new Promise((resolve) => {
      let settled = false;
      const done = (answer) => {
        if (settled) return;
        settled = true;
        dlg.removeEventListener('click', onClick);
        dlg.removeEventListener('cancel', onCancel);
        dlg.removeEventListener('close', onClose);
        if (dlg.open) dlg.close();
        resolve(answer);
      };
      const onClick = (e) => {
        const btn = e.target.closest('[data-answer]');
        if (btn) done(btn.dataset.answer === 'yes');
      };
      const onCancel = (e) => { e.preventDefault(); done(false); };
      const onClose = () => done(false); // fechado por fora (ex.: o tempo acabou) = "não"
      dlg.addEventListener('click', onClick);
      dlg.addEventListener('cancel', onCancel);
      dlg.addEventListener('close', onClose);
      dlg.showModal();
      $('#dlg-yes').focus();
    });
  }

  let toastId = null;
  function toast(msg) {
    const el = $('#toast');
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toastId);
    toastId = setTimeout(() => el.classList.remove('show'), 2600);
  }

  const drawer = $('#map-dialog');
  function openDrawer() {
    if (typeof drawer.showModal !== 'function') return;
    drawer.showModal();
    const cur = drawer.querySelector('.qcell.current');
    if (cur) cur.focus();
  }
  function closeDrawer() { if (drawer.open) drawer.close(); }

  // =========================================================================
  // Rodapé: informações de hospedagem
  // =========================================================================
  function renderHostInfo() {
    const host = location.hostname;
    const m = host.match(/^(.+)\.s3-website[.-]([a-z0-9-]+)\.amazonaws\.com$/);
    const nav = performance.getEntriesByType && performance.getEntriesByType('navigation')[0];
    const ms = nav && nav.loadEventEnd ? Math.round(nav.loadEventEnd - nav.startTime) : null;
    const loaded = ms ? ` · carregado em ${ms} ms` : '';
    let html;
    if (m) {
      html = `· bucket <code>${esc(m[1])}</code> · região <code>${esc(m[2])}</code>${loaded}`;
    } else if (location.protocol === 'file:' || host === 'localhost' || host === '127.0.0.1') {
      $('#host-title').textContent = 'Rodando localmente';
      html = `· depois do deploy, aqui aparecem o bucket e a região${loaded}`;
    } else {
      html = `· servido por <code>${esc(host)}</code>${loaded}`;
    }
    $('#host-info').innerHTML = html;
  }
  window.addEventListener('load', () => setTimeout(renderHostInfo, 0));

  // =========================================================================
  // Eventos
  // =========================================================================
  $('#theme-toggle').addEventListener('click', () => {
    const next = effectiveTheme() === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    store.set(KEY_THEME, next);
  });

  $$('.mode-row[data-mode]').forEach((btn) => btn.addEventListener('click', () => start(btn.dataset.mode)));
  $('#domain-list').addEventListener('click', (e) => {
    const b = e.target.closest('[data-domain]');
    if (b) start('train', b.dataset.domain);
  });

  $('#screen-home').addEventListener('click', async (e) => {
    const b = e.target.closest('[data-action]');
    if (!b) return;
    const action = b.dataset.action;
    if (action === 'resume') resume();
    else if (action === 'again') start(b.dataset.mode, b.dataset.domain || undefined);
    else if (action === 'discard') {
      if (await confirmDialog('Descartar rodada?', 'As respostas desta rodada serão perdidas.', 'Descartar')) { clearSession(); renderHome(); }
    } else if (action === 'clear-history') {
      if (await confirmDialog('Limpar histórico?', 'Suas rodadas e marcos salvos neste navegador serão apagados.', 'Limpar')) {
        store.set(KEY_HISTORY, []);
        store.set(KEY_ACH, []);
        store.remove(KEY_EXAM_COUNT); // a numeração dos simulados recomeça em #01
        renderHome();
        toast('Histórico apagado.');
      }
    }
  });

  $('#options').addEventListener('click', (e) => {
    const b = e.target.closest('.option');
    if (b) selectOption(Number(b.dataset.orig));
  });
  $('#next-btn').addEventListener('click', onNext);
  $('#prev-btn').addEventListener('click', () => goTo(S.i - 1));
  $('#flag-btn').addEventListener('click', toggleFlag);
  $('#finish-btn').addEventListener('click', requestFinish);
  $('#finish-btn-2').addEventListener('click', () => { closeDrawer(); requestFinish(); });
  $('#map-open').addEventListener('click', openDrawer);
  $('#map-close').addEventListener('click', closeDrawer);
  drawer.addEventListener('click', (e) => { if (e.target === drawer) closeDrawer(); }); // clique no fundo fecha
  ['#rail-map', '#drawer-map'].forEach((sel) => $(sel).addEventListener('click', (e) => {
    const b = e.target.closest('[data-idx]');
    if (!b) return;
    closeDrawer();
    goTo(Number(b.dataset.idx));
  }));
  $('#quiz-exit').addEventListener('click', exitQuiz);
  $('#brand-link').addEventListener('click', (e) => { e.preventDefault(); exitQuiz(); });

  $('#retry-btn').addEventListener('click', () => start(lastStart.mode, lastStart.domain));
  $('#home-btn').addEventListener('click', renderHome);
  $('#review-filters').addEventListener('click', (e) => {
    const b = e.target.closest('[data-filter]');
    if (!b) return;
    reviewFilter = b.dataset.filter;
    renderReview();
  });
  $('#review-map').addEventListener('click', (e) => {
    const b = e.target.closest('[data-idx]');
    if (b) jumpToReview(Number(b.dataset.idx));
  });
  $('#r-advice').addEventListener('click', (e) => {
    const t = e.target.closest('[data-train]');
    if (t) { start('train', t.dataset.train); return; }
    const m = e.target.closest('[data-mode-start]');
    if (m) start(m.dataset.modeStart);
  });

  // Atalhos: 1-5 ou A-E escolhem, Enter avança, setas navegam, M marca.
  document.addEventListener('keydown', (e) => {
    if (!inQuiz() || e.ctrlKey || e.metaKey || e.altKey) return;
    if ($('#confirm-dialog').open || drawer.open) return;
    const tag = document.activeElement && document.activeElement.tagName;
    const it = S.items[S.i];
    const key = e.key.toUpperCase();
    let pos = -1;
    if (/^[1-5]$/.test(key)) pos = Number(key) - 1;
    else if (/^[A-E]$/.test(key)) pos = LETTERS.indexOf(key);
    if (pos >= 0 && pos < it.order.length) {
      e.preventDefault();
      selectOption(it.order[pos]);
    } else if (key === 'M') {
      e.preventDefault();
      toggleFlag();
    } else if (e.key === 'Enter' && tag !== 'BUTTON' && tag !== 'SUMMARY' && tag !== 'A') {
      e.preventDefault();
      if (!$('#next-btn').disabled) onNext();
    } else if (e.key === 'ArrowRight') {
      goTo(S.i + 1);
    } else if (e.key === 'ArrowLeft') {
      goTo(S.i - 1);
    }
  });

  // O progresso é salvo, mas o aviso continua para evitar fechar a aba por engano.
  window.addEventListener('beforeunload', (e) => {
    if (!inQuiz()) return;
    saveSession();
    e.preventDefault();
    e.returnValue = '';
  });
  window.addEventListener('pagehide', saveSession);
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') saveSession(); });

  $('#bank-size').textContent = QUESTIONS.length;
  renderHome();
})();
