// Engagement Survey engine tests: node engagement-survey/test/engine.test.mjs
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const ctx = {}; vm.createContext(ctx);
vm.runInContext(readFileSync(join(here, '../../shared/ed-engine.js'), 'utf8') + '\n' + readFileSync(join(here, '../../shared/es-engine.js'), 'utf8') + ';globalThis.ES = ES; globalThis.ED = ED;', ctx);
const ES = ctx.ES;
const J = (x) => JSON.parse(JSON.stringify(x));
let n = 0; const t = (name, fn) => { fn(); n++; console.log('  ✓ ' + name); };
const fillA = (v) => Array(50).fill(v);
// importance: `most` questions (indexes) at level 3, the rest at `rest`
const imp = (most, rest = 1) => Array.from({ length: 50 }, (_, i) => (most.includes(i) ? 3 : rest));

console.log('Engagement Survey engine');

t('bank: 50 questions, 15 factors, scale variants on Q5, Q42, Q45, Q50', () => {
  assert.equal(ES.COUNT, 50);
  assert.equal(ES.QUESTION_CATS.length, 50);
  assert.equal(new Set(ES.QUESTION_CATS).size, 15);
  assert.deepEqual([ES.SCALES[4], ES.SCALES[41], ES.SCALES[44], ES.SCALES[49]], ['FR', 'S', 'AR', 'C']);
  assert.equal(ES.SCALES.filter(s => s === 'A').length, 15);
  assert.equal(ES.SCALES.filter(s => s === 'F').length, 31);
  assert.deepEqual(J(ES.QUESTION_CATS.slice(18, 27)), Array(9).fill(34)); // Supervisor block Q19–27
  assert.equal(ES.hasDontKnow(49), false); assert.equal(ES.hasDontKnow(0), true);
});

t('fully engaged needs ≥70% top answers AND exactly 100% of "most important" in the top two', () => {
  const a = fillA(5); for (let i = 0; i < 15; i++) a[i] = 3; // 70% in 4+5
  assert.equal(ES.classify(a, imp([20, 21, 22])).level, 'fully');
});

t('engaged: ≥60% + ≥70% of most important; order of checks matches legacy', () => {
  const a = fillA(5); for (let i = 0; i < 20; i++) a[i] = 2; // 60% top
  const r = ES.classify(a, imp([0, 1, 2, 30, 31, 32, 33, 34, 35, 36])); // 7/10 = 70% most in top
  assert.equal(r.level, 'engaged');
  assert.equal(ES.classify(a, imp([0, 1, 2, 3, 31, 32, 33, 34, 35, 36])).level, 'somewhat'); // 60% most
});

t('66.7% of most important in the top two → somewhat engaged', () => {
  const a = fillA(5); for (let i = 0; i < 15; i++) a[i] = 3;
  assert.equal(ES.classify(a, imp([0, 21, 22])).level, 'somewhat');
});

t('disengaged: ≥70% in Never/Sometimes and ≥70% of most important there', () => {
  const a = fillA(2); for (let i = 0; i < 15; i++) a[i] = 4;
  assert.equal(ES.classify(a, imp([20, 21, 22])).level, 'disengaged');
  assert.equal(ES.classify(a, imp([0, 21, 22])).level, 'somewhat');
});

t('"Don\'t know" (1) counts in the totals, so it dilutes the percentages', () => {
  const a = fillA(5); for (let i = 0; i < 16; i++) a[i] = 1; // 68% top
  assert.equal(ES.classify(a, imp([40])).level, 'engaged');
  for (let i = 0; i < 21; i++) a[i] = 1; // 58% top
  assert.equal(ES.classify(a, imp([40])).level, 'somewhat');
});

t('no "most important" picks → never fully/engaged/disengaged', () => {
  assert.equal(ES.classify(fillA(5), imp([])).level, 'somewhat');
  assert.equal(ES.classify(fillA(2), imp([])).level, 'somewhat');
});

t('validation: 50 answers 1–5, importance 1–3, between 1 and 15 "most important"', () => {
  assert.equal(ES.validResponse(fillA(4), imp([0])), '');
  assert.equal(ES.validResponse(fillA(4), imp(Array.from({ length: 15 }, (_, i) => i))), '');
  assert.equal(ES.validResponse(fillA(4), imp(Array.from({ length: 16 }, (_, i) => i))), 'invalid_importance');
  assert.equal(ES.validResponse(fillA(4), imp([])), 'invalid_importance');
  assert.equal(ES.validResponse(fillA(6), imp([0])), 'invalid_answers');
  assert.equal(ES.validResponse(fillA(4).slice(1), imp([0])), 'invalid_answers');
  assert.equal(ES.validResponse(fillA(4), Array(50).fill(0)), 'invalid_importance');
});

t('aggregate: levels, positive KPI, areas only with ≥5 answers, the rest pooled or hidden', () => {
  const resp = (level, area) => {
    const a = level === 'fully' ? fillA(5) : level === 'dis' ? fillA(2) : fillA(5).map((v, i) => (i % 2 ? 3 : 5));
    return { answers: a, importance: imp([0]), area, comments: [] };
  };
  const rs = [].concat(
    Array(5).fill(0).map(() => resp('fully', 'Ventas')),
    Array(3).fill(0).map(() => resp('dis', 'Ventas')),
    Array(5).fill(0).map(() => resp('mid', 'Operaciones')),
    Array(2).fill(0).map(() => resp('fully', 'Finanzas')),
    Array(1).fill(0).map(() => resp('dis', '')),
  );
  const g = J(ES.aggregate(rs));
  assert.equal(g.n, 16);
  assert.deepEqual(g.overall.count, { fully: 7, engaged: 0, somewhat: 5, disengaged: 4 });
  assert.equal(g.overall.positive, 7 / 16 * 100);
  assert.deepEqual(g.areas.map(a => [a.name, a.levels.n]), [['Operaciones', 5], ['Ventas', 8]]);
  assert.equal(g.other.levels, null); assert.equal(g.other.hidden, 3); // Finanzas (2) + no area (1) → not shown
  const g2 = J(ES.aggregate(rs.concat(Array(2).fill(0).map(() => resp('fully', 'Finanzas')))));
  assert.equal(g2.other.levels.n, 5); // Finanzas (4) + no area (1) pooled as "other areas"
});

t('aggregate: question distributions, "most important" %, comments, factors', () => {
  const a1 = fillA(5), a2 = fillA(4), a3 = fillA(1);
  a1[49] = 1; a2[49] = 5; a3[49] = 3; // Q50 has no "Don't know": 1 = significantly worse
  const c = Array(50).fill(''); c[0] = 'Más comunicación, por favor';
  const g = J(ES.aggregate([
    { answers: a1, importance: imp([0, 1]), area: 'A', comments: c },
    { answers: a2, importance: imp([0]), area: 'A', comments: [] },
    { answers: a3, importance: imp([2]), area: 'A', comments: [] },
  ]));
  assert.deepEqual(g.questions[0].dist, [0, 1, 0, 0, 1, 1]);
  assert.equal(Math.round(g.questions[0].mostPct), 67);
  assert.deepEqual(g.top.slice(0, 3).map(q => q.i), [0, 1, 2]);
  assert.deepEqual(g.questions[0].comments, ['Más comunicación, por favor']);
  assert.equal(g.nComments, 1);
  assert.equal(g.questions[49].stats, null);
  const values = g.cats.find(x => x.key === 'values');
  // Q1: 4,3 (Don't know excluded) → no unique mode → 3.5 − σ/2
  assert.ok(Math.abs(g.questions[0].stats.middle - (3.5 - Math.SQRT1_2 / 2)) < 1e-9);
  assert.ok(Math.abs(values.middle - g.questions[0].stats.middle) < 1e-9);
  assert.equal(values.color, 'green');
  const changes = g.cats.find(x => x.key === 'changes');
  assert.deepEqual(changes.questions, [47]); // Q48 only (Q50 left out)
  assert.equal(g.cats.length, 15);
});

console.log(`\n${n} engine tests passed`);
