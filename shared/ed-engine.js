/* Express Diagnostics — scoring engine (exact port of the legacy s.adizes.com algorithm).
 * Plain ES5 so the SAME file runs in the browser widget, in the admin and in Apps Script.
 *
 * Legacy rules (see express-diagnostics/LEGACY.md):
 *  - Raw answers 1..5. 1 = "cannot answer" → excluded. 2..5 → 1..4.
 *  - Per question: dispersion = sample std dev (n-1); n<=1 → 0.
 *    middle = the mode if exactly one value is the most frequent; otherwise mean − dispersion/2.
 *    No valid answers (n = 0) → middle 0, dispersion 0, and the report shows the base statement.
 *  - Text: middle ≥ 3 → zone 1 (base), < 2 → zone 3, else zone 2.
 *  - Colour: ≥ 3 green, ≥ 2 yellow, else red. Border: 1 participant → dotted;
 *    dispersion ≥ 1 → thick; ≥ 0.7 → thin; else dotted.
 *  - Category (cell): mean of its questions' middles (n=0 questions count as 0), mean of dispersions,
 *    percent = middle / 4 * 100, participants = the minimum n of its questions.
 */
var ED = (function () {
  var NORMS = { upperMiddle: 3, lowerMiddle: 2, upperDispersion: 1, lowerDispersion: 0.7, scale: 4 };

  // The 16 matrix cells, in report order (categoryID ascending). `key` is used by the language files.
  var CELLS = [
    { id: 17, code: '1.1 V', key: 'values' },
    { id: 18, code: '1.2 C', key: 'climate' },
    { id: 20, code: '2.1 H', key: 'responsibility' },
    { id: 21, code: '2.2 V', key: 'authority' },
    { id: 22, code: '2.3 R', key: 'reward' },
    { id: 23, code: '3.1 P', key: 'planning' },
    { id: 24, code: '3.2 I', key: 'information' },
    { id: 25, code: '3.3 CA', key: 'corrective' },
    { id: 26, code: '4/5 1 CI', key: 'client' },
    { id: 27, code: '4/5 2 T', key: 'transformation' },
    { id: 28, code: '4/5 3 HR', key: 'human' },
    { id: 29, code: '4/5 4 F', key: 'financial' },
    { id: 30, code: '6.1 I', key: 'behaviour' },
    { id: 31, code: '6.2 E', key: 'changes' },
    { id: 32, code: '6.3 A', key: 'inefficiency' },
    { id: 33, code: '6.4 P', key: 'ineffectiveness' },
  ];

  // Category of each of the 67 questions (questions 68–72 were blank in production and are not used).
  var QUESTION_CATS = [].concat(
    rep(17, 3), rep(18, 6), rep(20, 5), rep(21, 4), rep(22, 2), rep(23, 10), rep(24, 5), rep(25, 4),
    rep(26, 5), rep(27, 5), rep(28, 3), rep(29, 4), rep(30, 2), rep(31, 4), rep(32, 2), rep(33, 3)
  );

  // Radar charts (8 axes each, clockwise from the top) and the causal-factors diagram.
  var RADARS = [[17, 18, 20, 21, 22, 23, 24, 25], [26, 27, 28, 29, 30, 31, 32, 33]];

  function rep(v, n) { var a = []; for (var i = 0; i < n; i++) a.push(v); return a; }

  function questionStats(raws) {
    var xs = [];
    for (var i = 0; i < raws.length; i++) { var r = Number(raws[i]); if (r > 1 && r <= 5) xs.push(r - 1); }
    var n = xs.length;
    if (!n) return { n: 0, middle: 0, dispersion: 0, mean: 0, mode: null };
    var sum = 0; for (var j = 0; j < n; j++) sum += xs[j];
    var mean = sum / n;
    var sq = 0; for (var k = 0; k < n; k++) sq += (xs[k] - mean) * (xs[k] - mean);
    var dispersion = n > 1 ? Math.sqrt(sq / (n - 1)) : 0;
    var freq = {}, max = 0;
    for (var m = 0; m < n; m++) { freq[xs[m]] = (freq[xs[m]] || 0) + 1; if (freq[xs[m]] > max) max = freq[xs[m]]; }
    var tops = []; for (var v in freq) if (freq[v] === max) tops.push(Number(v));
    var mode = tops.length === 1 ? tops[0] : null;
    return { n: n, middle: mode !== null ? mode : mean - dispersion / 2, dispersion: dispersion, mean: mean, mode: mode };
  }

  function colorOf(middle) { return middle >= NORMS.upperMiddle ? 'green' : middle >= NORMS.lowerMiddle ? 'yellow' : 'red'; }
  function borderOf(n, dispersion) {
    if (n === 1) return 'dotted';
    if (dispersion >= NORMS.upperDispersion) return 'thick';
    if (dispersion >= NORMS.lowerDispersion) return 'thin';
    return 'dotted';
  }
  function zoneOf(st) {
    if (!st.n) return 0; // no valid answers: legacy shows the base statement
    return st.middle >= NORMS.upperMiddle ? 1 : st.middle < NORMS.lowerMiddle ? 3 : 2;
  }
  function pct(middle) { return middle / NORMS.scale * 100; }

  /**
   * responses: array of respondents, each an array of raw answers (1..5) in question order.
   * opts.cats: optional per-question category list (defaults to the 67-question bank).
   */
  function score(responses, opts) {
    opts = opts || {};
    var cats = opts.cats || QUESTION_CATS;
    var questions = [];
    for (var q = 0; q < cats.length; q++) {
      var raws = [];
      for (var r = 0; r < responses.length; r++) raws.push(responses[r][q]);
      var st = questionStats(raws);
      questions.push({
        i: q, cat: cats[q], n: st.n, middle: st.middle, dispersion: st.dispersion,
        color: colorOf(st.middle), border: borderOf(st.n, st.dispersion), zone: zoneOf(st),
      });
    }
    var cells = [];
    for (var c = 0; c < CELLS.length; c++) {
      var qs = questions.filter(function (x) { return x.cat === CELLS[c].id; });
      if (!qs.length) continue;
      var mid = 0, disp = 0, n = Infinity;
      qs.forEach(function (x) { mid += x.middle; disp += x.dispersion; if (x.n < n) n = x.n; });
      mid /= qs.length; disp /= qs.length;
      cells.push({
        id: CELLS[c].id, code: CELLS[c].code, key: CELLS[c].key,
        middle: mid, dispersion: disp, percent: pct(mid), n: n,
        color: colorOf(mid), border: borderOf(n, disp),
        questions: qs.map(function (x) { return x.i; }),
      });
    }
    return {
      participants: responses.length,
      questions: questions,
      cells: cells,
      norms: { upperMiddle: NORMS.upperMiddle, lowerMiddle: NORMS.lowerMiddle, upperPercent: pct(NORMS.upperMiddle), lowerPercent: pct(NORMS.lowerMiddle) },
    };
  }

  function validAnswers(a) {
    if (!a || a.length !== QUESTION_CATS.length) return false;
    for (var i = 0; i < a.length; i++) { var v = Number(a[i]); if (!(v >= 1 && v <= 5 && Math.floor(v) === v)) return false; }
    return true;
  }
  function cellById(result, id) { for (var i = 0; i < result.cells.length; i++) if (result.cells[i].id === id) return result.cells[i]; return null; }

  return {
    NORMS: NORMS, CELLS: CELLS, QUESTION_CATS: QUESTION_CATS, RADARS: RADARS, COUNT: QUESTION_CATS.length,
    questionStats: questionStats, score: score, validAnswers: validAnswers, cellById: cellById,
    colorOf: colorOf, borderOf: borderOf,
  };
})();
