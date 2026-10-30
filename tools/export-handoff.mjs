// Exports everything a new platform needs, straight from the source files (nothing hand-copied):
//   handoff/data/*.json          models, all texts in every language, email texts
//   handoff/data/test-vectors/   inputs + expected outputs to verify a re-implementation
//   handoff/questions-*.md       readable question tables (all languages)
// Run: node tools/export-handoff.mjs
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import vm from 'node:vm';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(join(root, p), 'utf8');
const out = join(root, 'handoff');
mkdirSync(join(out, 'data/test-vectors'), { recursive: true });
const J = (x) => JSON.parse(JSON.stringify(x));
const write = (p, obj) => writeFileSync(join(out, p), typeof obj === 'string' ? obj : JSON.stringify(obj, null, 2) + '\n');
const VERSION = JSON.parse(read('package.json')).version;

// ---- load engines + language files in one sandbox
const ctx = {}; vm.createContext(ctx);
const langFiles = (dir) => readdirSync(join(root, dir)).filter(f => f.endsWith('.js')).sort((a, b) => (a === 'en.js' ? -1 : b === 'en.js' ? 1 : a.localeCompare(b)));
vm.runInContext('var ED_I18N = {}, ES_I18N = {};\n' +
  langFiles('express-diagnostics/src/i18n').map(f => read('express-diagnostics/src/i18n/' + f)).join('\n') + '\n' +
  langFiles('engagement-survey/src/i18n').map(f => read('engagement-survey/src/i18n/' + f)).join('\n') + '\n' +
  read('shared/ed-engine.js') + '\n' + read('shared/es-engine.js') +
  '\nglobalThis.ED = ED; globalThis.ES = ES; globalThis.ED_I18N = ED_I18N; globalThis.ES_I18N = ES_I18N;', ctx);
const { ED, ES } = ctx;
const EDL = J(ctx.ED_I18N), ESL = J(ctx.ES_I18N), LANGS = Object.keys(EDL);

// ---- server texts (emails) from the Apps Script config
const gctx = {}; vm.createContext(gctx);
vm.runInContext(read('apps-script/src/00-config.gs') + '\n' + read('apps-script/src/01-labels.gs') + '\nglobalThis.LABELS = LABELS; globalThis.CONFIG = CONFIG;', gctx);
const LABELS = J(gctx.LABELS), CONFIG = J(gctx.CONFIG);

/* ================================================================ Express Diagnostics */
const edCell = (id) => J(ED.CELLS).find(c => c.id === id);
const edQuestions = J(ED.QUESTION_CATS).map((cat, i) => {
  const c = edCell(cat), texts = {};
  LANGS.forEach(l => { const q = EDL[l].questions[i]; texts[l] = { statement: q.t, zone2: q.z2, zone3: q.z3 }; });
  return { number: i + 1, cellId: cat, cellCode: c.code, cellKey: c.key, texts };
});
write('data/express-diagnostics.json', {
  test: 'Express Diagnostics', code: 'ED', version: VERSION,
  model: {
    questionCount: ED.COUNT,
    answerValues: { 1: 'I cannot answer (excluded from all statistics)', 2: 'Never', 3: 'Sometimes', 4: 'Often', 5: 'Always' },
    norms: J(ED.NORMS),
    cells: J(ED.CELLS),
    radars: J(ED.RADARS),
    minimumResponses: CONFIG.MIN_RESPONSES.ED,
  },
  questions: edQuestions,
  texts: EDL, // every UI / report string, per language (questions included)
});

/* ================================================================ Engagement Survey */
const esCat = (id) => J(ES.CATS).find(c => c.id === id);
const esQuestions = J(ES.QUESTION_CATS).map((cat, i) => {
  const c = esCat(cat), scale = ES.SCALES[i], texts = {}, options = {};
  LANGS.forEach(l => {
    const q = ESL[l].questions[i];
    texts[l] = typeof q === 'string' ? q : q.t;
    options[l] = ESL[l].scales[scale].map(o => ({ value: o.value, label: o.label, sub: o.sub || '' }))
      .concat(ES.hasDontKnow(i) ? [{ value: 1, label: ESL[l].dontKnow, sub: '' }] : []);
  });
  return { number: i + 1, factorId: cat, factorKey: c.key, group: c.group, scale, hasDontKnow: ES.hasDontKnow(i), texts, options };
});
write('data/engagement-survey.json', {
  test: 'Engagement Survey', code: 'ES', version: VERSION,
  model: {
    questionCount: ES.COUNT,
    scales: {
      F: 'Frequency (Never → Always), labels also show the agreement wording',
      A: 'Agreement (Absolutely disagree → Absolutely agree), labels also show the frequency wording',
      FR: 'Frequency, REVERSED: negative statement (Q5). "Never" is stored as 5',
      AR: 'Agreement, REVERSED: negative statement (Q45). "Absolutely disagree" is stored as 5',
      S: 'Satisfaction (Q42)',
      C: 'Change over the last year (Q50). 5 options, no "Don\'t know"; 1 = significantly deteriorated',
    },
    answerValues: 'Stored raw 1–5. 5 is ALWAYS the most positive answer. 1 = "Don\'t know" (except Q50, where 1 = significantly deteriorated).',
    importance: { values: { 1: 'Less important', 2: 'Medium', 3: 'Most important' }, default: 1, maxMost: ES.MAX_MOST, minMost: ES.MIN_MOST },
    factors: J(ES.CATS), groups: J(ES.GROUPS), levels: J(ES.LEVELS),
    minimumResponses: ES.MIN_RESPONSES, minimumGroupSize: ES.MIN_GROUP, minimumEmployeesToLaunch: CONFIG.MIN_RESPONSES.ES,
  },
  questions: esQuestions,
  texts: ESL,
});

write('data/emails.json', { note: 'Server-side texts: invitations, reminders and the report email, per language. {placeholders} are filled by the server.', languages: LABELS });

/* ================================================================ readable tables */
const md = (s) => String(s == null ? '' : s).replace(/\|/g, '\\|').replace(/\n/g, ' ');
let edMd = `# Express Diagnostics — all statements (${LANGS.join(', ').toUpperCase()})\n\n` +
  `Generated from the source files by \`tools/export-handoff.mjs\` (v${VERSION}). Machine-readable: \`data/express-diagnostics.json\`.\n\n` +
  `Each statement has three wordings. The participant only sees the **statement**. The report prints the statement when the group score is good (zone 1), ` +
  `**zone 2** when it is in the attention zone, and **zone 3** in the anomaly zone (rules in \`02-express-diagnostics.md\`).\n\n` +
  `Answer scale (raw values stored): 1 = I cannot answer · 2 = Never · 3 = Sometimes · 4 = Often · 5 = Always.\n\n`;
for (const cell of J(ED.CELLS)) {
  const qs = edQuestions.filter(q => q.cellId === cell.id);
  edMd += `## ${cell.code} · ${LANGS.map(l => EDL[l].cells[cell.key]).join(' / ')} (cell ${cell.id}, key \`${cell.key}\`)\n\n`;
  for (const l of LANGS) {
    edMd += `**${EDL[l].langName}**\n\n| # | Statement (zone 1, shown to participants) | Zone 2 (attention) | Zone 3 (anomaly) |\n|---|---|---|---|\n`;
    qs.forEach(q => { edMd += `| ${q.number} | ${md(q.texts[l].statement)} | ${md(q.texts[l].zone2)} | ${md(q.texts[l].zone3)} |\n`; });
    edMd += '\n';
  }
}
write('questions-express-diagnostics.md', edMd);

let esMd = `# Engagement Survey — all questions (${LANGS.join(', ').toUpperCase()})\n\n` +
  `Generated from the source files by \`tools/export-handoff.mjs\` (v${VERSION}). Machine-readable: \`data/engagement-survey.json\`.\n\n` +
  `## Answer options per scale\n\nThe number in brackets is the raw value stored. **5 is always the most positive answer.** Options are shown in this order (top to bottom).\n\n`;
for (const sc of ['F', 'A', 'FR', 'AR', 'S', 'C']) {
  const used = esQuestions.filter(q => q.scale === sc).map(q => q.number);
  esMd += `### Scale ${sc} — used by Q${used.join(', Q')}\n\n| ${LANGS.map(l => ESL[l].langName).join(' | ')} |\n|${LANGS.map(() => '---').join('|')}|\n`;
  const n = ESL.en.scales[sc].length + (sc === 'C' ? 0 : 1);
  for (let k = 0; k < n; k++) {
    esMd += '| ' + LANGS.map(l => {
      const o = ESL[l].scales[sc][k];
      return o ? `[${o.value}] ${md(o.label)}${o.sub ? ' · ' + md(o.sub) : ''}` : `[1] ${md(ESL[l].dontKnow)} (separate link under the options)`;
    }).join(' | ') + ' |\n';
  }
  esMd += '\n';
}
esMd += `## Importance (asked on every question)\n\n| Value | ${LANGS.map(l => ESL[l].langName).join(' | ')} |\n|---|${LANGS.map(() => '---').join('|')}|\n` +
  [1, 2, 3].map(k => `| ${k} | ${LANGS.map(l => md(ESL[l].ui.imp[k - 1])).join(' | ')} |`).join('\n') +
  `\n\nDefault 1. Between ${ES.MIN_MOST} and ${ES.MAX_MOST} questions must be marked 3 (“Most important”).\n\n## Questions\n\n` +
  `| # | Factor | Group | Scale | ${LANGS.map(l => ESL[l].langName).join(' | ')} |\n|---|---|---|---|${LANGS.map(() => '---').join('|')}|\n`;
esQuestions.forEach(q => {
  esMd += `| ${q.number} | ${md(ESL.en.cells[q.factorKey])} (${q.factorId}) | ${md(ESL.en.pdf.groups[q.group])} | ${q.scale} | ${LANGS.map(l => md(q.texts[l])).join(' | ')} |\n`;
});
write('questions-engagement-survey.md', esMd);

/* ================================================================ test vectors */
// ED golden case: one real respondent from the legacy PDF (67-question bank)
const edSrc = read('express-diagnostics/test/engine.test.mjs');
const legacy = JSON.parse('[' + edSrc.match(/const LEGACY_ANSWERS = \[([\s\S]*?)\];/)[1].replace(/\/\/.*$/gm, '').trim().replace(/,\s*$/, '') + ']');
const goldenAnswers = legacy.slice(0, 67);
const round = (x) => Math.round(x * 1e6) / 1e6;
const edOut = (responses) => {
  const r = J(ED.score(responses));
  return {
    participants: r.participants,
    cells: r.cells.map(c => ({ id: c.id, code: c.code, key: c.key, middle: round(c.middle), dispersion: round(c.dispersion), percent: round(c.percent), n: c.n, color: c.color, border: c.border })),
    questions: r.questions.map(q => ({ number: q.i + 1, n: q.n, middle: round(q.middle), dispersion: round(q.dispersion), color: q.color, border: q.border, zone: q.zone })),
  };
};
// a deterministic multi-respondent group (5 people)
let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
const edGroup = Array.from({ length: 5 }, (_, p) => Array.from({ length: 67 }, (_, q) => { const x = rnd(); return x < 0.06 ? 1 : 2 + Math.min(3, Math.floor(rnd() * 2 + (p + q) % 3)); }));
write('data/test-vectors/express-diagnostics.json', {
  note: 'Feed `input.responses` (one array of 67 raw answers per participant) to your implementation and compare with `expected`. Numbers rounded to 6 decimals.',
  cases: [
    { name: 'golden: real legacy respondent (reconstructed from the legacy PDF; matches its colours, wordings and radar values)', input: { responses: [goldenAnswers] }, expected: edOut([goldenAnswers]) },
    { name: 'group of 5 (deterministic sample)', input: { responses: edGroup }, expected: edOut(edGroup) },
    { name: 'question rules (Q1 only matters): mode vs mean − σ/2, "cannot answer" excluded', input: { q1Answers: [5, 5, 4, 1] },
      expected: (() => { const s = J(ED.questionStats([5, 5, 4, 1])); return { n: s.n, middle: round(s.middle), dispersion: round(s.dispersion), mode: s.mode }; })() },
    { name: 'no unique mode → mean − σ/2', input: { q1Answers: [5, 4] },
      expected: (() => { const s = J(ED.questionStats([5, 4])); return { n: s.n, middle: round(s.middle), dispersion: round(s.dispersion), mode: s.mode }; })() },
  ],
});

// ES: classification cases + one full aggregate
const fill = (v) => Array(50).fill(v);
const imp = (most, rest = 1) => Array.from({ length: 50 }, (_, i) => (most.includes(i) ? 3 : rest));
const cls = (name, a, i) => ({ name, input: { answers: a, importance: i }, expected: (() => { const c = J(ES.classify(a, i)); return { level: c.level, all45: round(c.all45), all23: round(c.all23), most45: round(c.most45), most23: round(c.most23), mostCount: c.mostCount }; })() });
const a70 = fill(5); for (let i = 0; i < 15; i++) a70[i] = 3;
const a60 = fill(5); for (let i = 0; i < 20; i++) a60[i] = 2;
const aDis = fill(2); for (let i = 0; i < 15; i++) aDis[i] = 4;
const aDk = fill(5); for (let i = 0; i < 16; i++) aDk[i] = 1;
const classCases = [
  cls('fully engaged: 70% top answers and 100% of "most important" in 4–5', a70, imp([20, 21, 22])),
  cls('somewhat: 70% top but only 66.7% of "most important" in 4–5', a70, imp([0, 21, 22])),
  cls('engaged: 60% top + 70% of "most important" in 4–5', a60, imp([0, 1, 2, 30, 31, 32, 33, 34, 35, 36])),
  cls('somewhat: 60% top + 60% of "most important"', a60, imp([0, 1, 2, 3, 31, 32, 33, 34, 35, 36])),
  cls('disengaged: 70% in 2–3 and 100% of "most important" in 2–3', aDis, imp([20, 21, 22])),
  cls('"Don\'t know" (1) counts in the denominator: 68% top → engaged', aDk, imp([40])),
];
seed = 11;
const areas = ['Sales', 'Sales', 'Sales', 'Sales', 'Sales', 'Sales', 'Operations', 'Operations', 'Operations', 'Operations', 'Operations', 'Finance', 'Finance', 'HR', ''];
const esGroup = areas.map((area, p) => {
  const bias = [5, 4, 3, 2][p % 4];
  const answers = Array.from({ length: 50 }, (_, q) => { const x = rnd(); if (q !== 49 && x < 0.05) return 1; return Math.max(2, Math.min(5, bias + (x < 0.3 ? -1 : x > 0.85 ? 1 : 0))); });
  if (rnd() < 0.2) answers[49] = 1;
  const most = new Set(); while (most.size < 3 + (p % 9)) most.add(Math.floor(rnd() * 50));
  const importance = Array.from({ length: 50 }, (_, q) => (most.has(q) ? 3 : rnd() < 0.4 ? 2 : 1));
  const comments = Array(50).fill(''); if (p % 5 === 0) comments[p % 50] = 'Sample comment ' + (p + 1);
  return { answers, importance, area, comments };
});
const agg = J(ES.aggregate(esGroup));
const r6 = (o) => JSON.parse(JSON.stringify(o, (k, v) => (typeof v === 'number' ? round(v) : v)));
write('data/test-vectors/engagement-survey.json', {
  note: 'classification: one respondent → level. aggregate: 15 respondents with areas → everything the report shows. Numbers rounded to 6 decimals.',
  classification: classCases,
  aggregate: {
    input: { responses: esGroup },
    expected: r6({
      n: agg.n, overall: agg.overall, areas: agg.areas, other: agg.other, cats: agg.cats,
      top: agg.top.map(q => ({ number: q.i + 1, mostPct: q.mostPct })),
      questions: agg.questions.map(q => ({ number: q.i + 1, dist: q.dist, mostPct: q.mostPct, stats: q.stats && { n: q.stats.n, middle: q.stats.middle, dispersion: q.stats.dispersion } })),
      nComments: agg.nComments,
    }),
  },
});

console.log(`handoff/ exported (v${VERSION}): ${edQuestions.length} ED statements, ${esQuestions.length} ES questions, languages ${LANGS.join(', ')}`);
