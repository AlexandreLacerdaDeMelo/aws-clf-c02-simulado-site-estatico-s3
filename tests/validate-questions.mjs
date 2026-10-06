// Valida o banco de questões: node tests/validate-questions.mjs
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const file = fileURLToPath(new URL('../js/questions.js', import.meta.url));
const ctx = {};
vm.runInNewContext(readFileSync(file, 'utf8') + '\nthis.QUESTIONS = QUESTIONS; this.DOMAINS = DOMAINS;', ctx);
const { QUESTIONS, DOMAINS } = ctx;

const EXPECTED = { conceitos: 31, seguranca: 39, tecnologia: 44, faturamento: 16 };
const PREFIX = { conceitos: 'c', seguranca: 's', tecnologia: 't', faturamento: 'f' };
const errors = [];
const count = {};
const ids = new Set();
const texts = new Set();

for (const q of QUESTIONS) {
  const where = q.id || '(sem id)';
  count[q.d] = (count[q.d] || 0) + 1;
  if (ids.has(q.id)) errors.push(`${where}: id duplicado`);
  ids.add(q.id);
  if (!DOMAINS[q.d]) errors.push(`${where}: domínio inválido "${q.d}"`);
  else if (!q.id.startsWith(PREFIX[q.d])) errors.push(`${where}: prefixo do id não bate com o domínio`);
  for (const f of ['q', 'e', 's']) if (!q[f] || !String(q[f]).trim()) errors.push(`${where}: campo "${f}" vazio`);
  if (texts.has(q.q)) errors.push(`${where}: enunciado duplicado`);
  texts.add(q.q);
  if (new Set(q.o).size !== q.o.length) errors.push(`${where}: alternativas repetidas`);
  if (!Array.isArray(q.a) || !q.a.length) errors.push(`${where}: sem resposta`);
  else if (!q.a.every((i) => Number.isInteger(i) && i >= 0 && i < q.o.length)) errors.push(`${where}: índice de resposta inválido`);
  else if (new Set(q.a).size !== q.a.length) errors.push(`${where}: resposta repetida`);
  const multi = q.a.length > 1;
  const m = q.q.match(/\(Escolha (\d)\)/);
  if (multi && (!m || Number(m[1]) !== q.a.length)) errors.push(`${where}: múltipla resposta sem "(Escolha ${q.a.length})"`);
  if (!multi && m) errors.push(`${where}: diz "(Escolha N)" mas tem 1 resposta`);
  if (multi && q.o.length !== 5) errors.push(`${where}: múltipla resposta deve ter 5 alternativas`);
  if (!multi && q.o.length !== 4) errors.push(`${where}: escolha única deve ter 4 alternativas`);
}

for (const [d, n] of Object.entries(EXPECTED)) {
  if (count[d] !== n) errors.push(`domínio ${d}: esperado ${n}, encontrado ${count[d] || 0}`);
}

const multi = QUESTIONS.filter((q) => q.a.length > 1).length;
const pos = {};
QUESTIONS.filter((q) => q.a.length === 1).forEach((q) => { pos[q.a[0]] = (pos[q.a[0]] || 0) + 1; });

console.log(`Total: ${QUESTIONS.length} questões`, count);
console.log(`Múltipla resposta: ${multi} (${Math.round((multi / QUESTIONS.length) * 100)}%)`);
console.log('Posição da resposta antes do embaralhamento:', pos);
if (errors.length) {
  console.error(`\n${errors.length} erro(s):\n- ` + errors.join('\n- '));
  process.exit(1);
}
console.log('\nOK: nenhum problema encontrado.');
