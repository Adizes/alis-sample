// Scoring-engine tests: node express-diagnostics/test/engine.test.mjs
// 1) Golden case rebuilt from the REAL legacy PDF ("Company Express Diagnostics Report 2023", 27.10.2026,
//    IT Magnificent Company, 1 participant) — every question's colour and phrasing, and every radar value.
// 2) Hand-computed multi-respondent cases for the mode / mean − σ/2 / dispersion / border rules.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const ctx = {}; vm.createContext(ctx);
vm.runInContext(readFileSync(join(here, '../../shared/ed-engine.js'), 'utf8') + ';globalThis.ED = ED;', ctx);
const J = (x) => JSON.parse(JSON.stringify(x)); // objects come from another VM realm
const ED = ctx.ED;
let n = 0; const t = (name, fn) => { fn(); n++; console.log('  ✓ ' + name); };
const close = (a, b, eps = 1e-9, msg) => assert.ok(Math.abs(a - b) <= eps, `${msg || ''} expected ${b}, got ${a}`);

console.log('Express Diagnostics engine');

/* ------------------------------------------------------------------ golden case (legacy PDF) */
// The legacy run had 72 slots: questions 68–72 were blank but still answered and scored.
// Categories of 68–72 (from the DB): 27, 23, 27, 27, 27.
const LEGACY_CATS = ED.QUESTION_CATS.concat([27, 23, 27, 27, 27]);
// Observed in the PDF, per question: colour (G/Y/R) + phrasing shown (1 = base, 2, 3; 0 = base shown because "cannot answer").
const OBS = {
  1: 'R0', 2: 'G1', 3: 'G1', 4: 'Y2', 5: 'G1', 6: 'Y2', 7: 'R3', 8: 'R0', 9: 'R3', 10: 'G1', 11: 'Y2', 12: 'R3', 13: 'R0', 14: 'Y2',
  15: 'G1', 16: 'G1', 17: 'R0', 18: 'Y2', 19: 'R3', 20: 'R3', 21: 'R3', 22: 'G1', 23: 'G1', 24: 'Y2', 25: 'G1', 26: 'G1', 27: 'Y2',
  28: 'G1', 29: 'G1', 30: 'G1', 31: 'R3', 32: 'G1', 33: 'Y2', 34: 'Y2', 35: 'R3', 36: 'G1', 37: 'Y2', 38: 'G1', 39: 'G1', 40: 'R3',
  41: 'G1', 42: 'Y2', 43: 'G1', 44: 'R3', 45: 'G1', 46: 'Y2', 47: 'G1', 48: 'G1', 49: 'R3', 50: 'R0', 51: 'R3', 52: 'G1', 53: 'Y2',
  54: 'Y2', 55: 'Y2', 56: 'G1', 57: 'R0', 58: 'R3', 59: 'G1', 60: 'R3', 61: 'G1', 62: 'Y2', 63: 'R3', 64: 'R0', 65: 'R3', 66: 'G1', 67: 'Y2',
  69: 'Y', 70: 'Y', 71: 'Y', 72: 'G', 68: 'R',
};
// Answers reconstructed from the PDF (raw 1..5; 1 = cannot answer). Greens are 4 (Often) or 5 (Always):
// which one is fixed by the radar values below, e.g. Values = 50% ⇒ Q2 = Q3 = Often.
const LEGACY_ANSWERS = [
  1, 4, 4, 3, 4, 3, 2, 1, 2, 4, 3, 2, 1, 3, 4, 4, 1, 3, 2, 2,
  2, 5, 5, 3, 5, 4, 3, 4, 4, 4, 2, 5, 3, 3, 2, 5, 3, 4, 4,
  2, 4, 3, 5, 2, 5, 3, 5, 4, 2, 1, 2, 5, 3, 3, 3, 5, 1, 2,
  4, 2, 5, 3, 2, 1, 2, 4, 3,
  1, 3, 3, 3, 4, // 68–72
];
// Radar values measured from the PDF's vector paths (radius 86.4 pt = 100%), and the exact value they round to.
const RADAR = {
  17: [50.0, 50], 18: [37.5, 37.5], 20: [39.9, 40], 21: [49.9, 50], 22: [25.0, 25], 23: [70.5, 31 / 11 / 4 * 100], 24: [50.0, 50], 25: [75.0, 75],
  26: [55.1, 55], 27: [58.3, 21 / 9 / 4 * 100], 28: [41.7, 5 / 3 / 4 * 100], 29: [62.4, 62.5], 30: [12.5, 12.5], 31: [62.5, 62.5], 32: [12.5, 12.5], 33: [50.0, 50],
};
// Causal-factors diagram colours on page 2 of the PDF.
const DIAGRAM = { 17: 'yellow', 18: 'red', 23: 'yellow', 20: 'red', 21: 'yellow', 24: 'yellow', 25: 'green', 22: 'red', 26: 'yellow', 27: 'yellow', 28: 'red', 29: 'yellow', 32: 'red', 30: 'red', 31: 'yellow', 33: 'yellow' };

t('golden: legacy PDF — colour and phrasing of all 72 questions', () => {
  const r = ED.score([LEGACY_ANSWERS], { cats: LEGACY_CATS });
  const C = { G: 'green', Y: 'yellow', R: 'red' };
  for (let q = 1; q <= 72; q++) {
    const o = OBS[q], got = r.questions[q - 1];
    assert.equal(got.color, C[o[0]], 'Q' + q + ' colour');
    if (o[1] !== undefined) assert.equal(got.zone, Number(o[1]), 'Q' + q + ' phrasing');
    assert.equal(got.border, 'dotted', 'Q' + q + ' border (1 participant)');
  }
});

t('golden: legacy PDF — radar values (16 axes) and diagram colours', () => {
  const r = ED.score([LEGACY_ANSWERS], { cats: LEGACY_CATS });
  assert.equal(r.cells.length, 16);
  for (const c of r.cells) {
    const [measured, exact] = RADAR[c.id];
    close(c.percent, exact, 1e-9, 'cell ' + c.code);
    close(c.percent, measured, 0.6, 'cell ' + c.code + ' vs PDF');
    assert.equal(c.color, DIAGRAM[c.id], 'diagram ' + c.code);
    assert.equal(c.border, c.n === 1 || c.dispersion < 0.7 ? 'dotted' : c.border);
  }
  assert.equal(r.norms.upperPercent, 75); assert.equal(r.norms.lowerPercent, 50);
});

t('golden: same person on the 67-question bank (68–72 dropped)', () => {
  const r = ED.score([LEGACY_ANSWERS.slice(0, 67)]);
  assert.equal(r.questions.length, 67);
  const p = Object.fromEntries(r.cells.map(c => [c.id, c.percent]));
  close(p[23], 29 / 10 / 4 * 100); // Planning without blank Q69: 72.5%
  close(p[27], 14 / 5 / 4 * 100);  // Transformation without 68,70–72: 70%
  close(p[17], 50); close(p[33], 50);
});

/* ------------------------------------------------------------------ multi-respondent rules */
t('single answer: middle = answer − 1, cannot-answer excluded', () => {
  assert.deepEqual(J(ED.questionStats([5])), { n: 1, middle: 4, dispersion: 0, mean: 4, mode: 4 });
  assert.deepEqual(J(ED.questionStats([1])), { n: 0, middle: 0, dispersion: 0, mean: 0, mode: null });
  assert.equal(ED.questionStats([1, 1, 3]).middle, 2);
  assert.equal(ED.questionStats([1, 1, 3]).n, 1);
});

t('unique mode wins over the mean', () => {
  const s = ED.questionStats([5, 5, 2]); // 4,4,1 → mode 4 (mean 3)
  assert.equal(s.middle, 4); close(s.dispersion, Math.sqrt(3));
});

t('no unique mode → mean − σ/2 (sample σ)', () => {
  const s = ED.questionStats([4, 5]); // 3,4 → mean 3.5, σ = 0.7071 → 3.1464
  close(s.middle, 3.5 - Math.SQRT1_2 / 2); close(s.dispersion, Math.SQRT1_2);
  const s2 = ED.questionStats([2, 2, 5, 5]); // 1,1,4,4 → mean 2.5, σ = √3 → 1.634
  close(s2.middle, 2.5 - Math.sqrt(3) / 2);
  assert.equal(ED.colorOf(s2.middle), 'red');
  const s3 = ED.questionStats([2, 3, 4]); // 1,2,3 all once → no mode → 2 − 0.5 = 1.5
  close(s3.middle, 1.5);
});

t('borders: dotted < 0.7 ≤ thin < 1 ≤ thick; 1 participant always dotted', () => {
  assert.equal(ED.borderOf(1, 3), 'dotted');
  assert.equal(ED.borderOf(4, 0.69), 'dotted');
  assert.equal(ED.borderOf(4, 0.7), 'thin');
  assert.equal(ED.borderOf(4, 0.99), 'thin');
  assert.equal(ED.borderOf(4, 1), 'thick');
  assert.equal(ED.borderOf(0, 0), 'dotted');
});

t('zones and colours at the 2.0 / 3.0 boundaries', () => {
  const one = (raw) => ED.score([Array(67).fill(raw)]).questions[0];
  assert.deepEqual([one(5).zone, one(5).color], [1, 'green']);
  assert.deepEqual([one(4).zone, one(4).color], [1, 'green']);   // middle 3
  assert.deepEqual([one(3).zone, one(3).color], [2, 'yellow']);  // middle 2
  assert.deepEqual([one(2).zone, one(2).color], [3, 'red']);     // middle 1
  assert.deepEqual([one(1).zone, one(1).color], [0, 'red']);     // cannot answer
});

t('team of 3: cell = mean of question middles, participants = minimum n', () => {
  const a = Array(67).fill(5), b = Array(67).fill(5), c = Array(67).fill(3);
  a[0] = 5; b[0] = 4; c[0] = 1;  // Q1: 4,3 → no mode → 3.5 − 0.354
  a[1] = 2; b[1] = 2; c[1] = 5;  // Q2: 1,1,4 → mode 1
  const r = ED.score([a, b, c]);
  const q1 = r.questions[0], q2 = r.questions[1], q3 = r.questions[2];
  assert.equal(q1.n, 2); close(q1.middle, 3.5 - Math.SQRT1_2 / 2); assert.equal(q1.border, 'thin');
  assert.equal(q2.middle, 1); close(q2.dispersion, Math.sqrt(3)); assert.equal(q2.border, 'thick'); assert.equal(q2.zone, 3);
  assert.equal(q3.middle, 4); close(q3.dispersion, Math.sqrt(4 / 3)); // 4,4,2 → mode 4
  const values = r.cells[0];
  close(values.middle, (q1.middle + 1 + 4) / 3);
  close(values.dispersion, (q1.dispersion + q2.dispersion + q3.dispersion) / 3);
  assert.equal(values.n, 2);
  close(values.percent, values.middle / 4 * 100);
  assert.equal(r.participants, 3);
});

t('validation', () => {
  assert.equal(ED.validAnswers(Array(67).fill(3)), true);
  assert.equal(ED.validAnswers(Array(66).fill(3)), false);
  assert.equal(ED.validAnswers(Array(67).fill(0)), false);
  assert.equal(ED.validAnswers(Array(67).fill(2.5)), false);
  assert.equal(ED.COUNT, 67);
});

console.log(`\n${n} engine tests passed`);
