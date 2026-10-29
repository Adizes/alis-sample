/* Engagement Survey — scoring engine (legacy s.adizes.com rules, questionnaire 28 / "AA").
 * Plain ES5: the SAME file runs in the participant widget, the admin and Apps Script.
 *
 * Per respondent (legacy CalculateResult::calculateInvolvement, checked in this exact order):
 *   all[k]  = share of answers with raw value k (1..5) over every answered question ("Don't know" = 1 counts)
 *   most[k] = the same, only over the questions marked "most important" (importance level 3)
 *   all4+all5 ≥ 70 and most4+most5 = 100      → fully engaged
 *   all4+all5 ≥ 60 and most4+most5 ≥ 70       → engaged
 *   all2+all3 ≥ 70 and most2+most3 ≥ 70       → disengaged
 *   otherwise                                  → somewhat engaged
 * Raw values always mean the same direction (5 = best): Q5 and Q45 are negative statements and their
 * answer labels are reversed in the data, exactly like the legacy platform (done correctly in every language).
 */
var ES = (function () {
  function rep(v, n) { var a = []; for (var i = 0; i < n; i++) a.push(v); return a; }
  var QUESTION_CATS = [].concat(rep(17, 3), rep(18, 4), [19], rep(20, 3), rep(21, 3), rep(22, 4), rep(34, 9), rep(23, 3), rep(24, 2), rep(26, 2), rep(27, 4), rep(28, 3), rep(30, 6), [31], [32], [31]);
  // Scale of each question: F frequency · A agreement · FR/AR reversed (Q5, Q45) · S satisfaction (Q42) · C change (Q50, no "Don't know")
  var AGREE = [8, 10, 12, 15, 16, 17, 18, 26, 28, 29, 30, 33, 41, 47, 49];
  var SCALES = QUESTION_CATS.map(function (c, i) {
    var q = i + 1;
    return q === 5 ? 'FR' : q === 45 ? 'AR' : q === 42 ? 'S' : q === 50 ? 'C' : AGREE.indexOf(q) >= 0 ? 'A' : 'F';
  });
  var CATS = [
    { id: 17, key: 'values', group: 'culture' }, { id: 18, key: 'climate', group: 'culture' }, { id: 19, key: 'styles', group: 'culture' },
    { id: 20, key: 'responsibility', group: 'structure' }, { id: 21, key: 'authority', group: 'structure' }, { id: 22, key: 'reward', group: 'structure' },
    { id: 23, key: 'planning', group: 'process' }, { id: 24, key: 'information', group: 'process' },
    { id: 26, key: 'client', group: 'functions' }, { id: 27, key: 'transformation', group: 'functions' }, { id: 28, key: 'human', group: 'functions' }, { id: 34, key: 'supervisor', group: 'functions' },
    { id: 30, key: 'behaviour', group: 'effects' }, { id: 31, key: 'changes', group: 'effects' }, { id: 32, key: 'inefficiency', group: 'effects' },
  ];
  var GROUPS = ['culture', 'structure', 'process', 'functions', 'effects'];
  var LEVELS = ['fully', 'engaged', 'somewhat', 'disengaged'];
  var COUNT = QUESTION_CATS.length, MAX_MOST = 15, MIN_MOST = 1, MIN_RESPONSES = 5, MIN_GROUP = 5;

  function hasDontKnow(q) { return SCALES[q] !== 'C'; }

  function classify(answers, importance) {
    var all = [0, 0, 0, 0, 0, 0], most = [0, 0, 0, 0, 0, 0], nAll = 0, nMost = 0;
    for (var i = 0; i < answers.length; i++) {
      var v = Number(answers[i]);
      if (!(v >= 1 && v <= 5)) continue;
      all[v]++; nAll++;
      if (Number(importance && importance[i]) === 3) { most[v]++; nMost++; }
    }
    function p(arr, n, a, b) { return n ? (arr[a] + arr[b]) / n * 100 : 0; }
    var a45 = p(all, nAll, 4, 5), a23 = p(all, nAll, 2, 3), m45 = p(most, nMost, 4, 5), m23 = p(most, nMost, 2, 3);
    var level = (a45 >= 70 && m45 === 100) ? 'fully' : (a45 >= 60 && m45 >= 70) ? 'engaged' : (a23 >= 70 && m23 >= 70) ? 'disengaged' : 'somewhat';
    return { level: level, all45: a45, all23: a23, most45: m45, most23: m23, mostCount: nMost };
  }

  function validResponse(answers, importance) {
    if (!answers || answers.length !== COUNT || !importance || importance.length !== COUNT) return 'invalid_answers';
    var most = 0;
    for (var i = 0; i < COUNT; i++) {
      var v = Number(answers[i]), m = Number(importance[i]);
      if (!(v >= 1 && v <= 5 && Math.floor(v) === v)) return 'invalid_answers';
      if ([1, 2, 3].indexOf(m) < 0) return 'invalid_importance';
      if (m === 3) most++;
    }
    if (most < MIN_MOST || most > MAX_MOST) return 'invalid_importance';
    return '';
  }

  function levelCounts(list) {
    var c = { fully: 0, engaged: 0, somewhat: 0, disengaged: 0 }, n = list.length;
    list.forEach(function (r) { c[r.level]++; });
    var pct = {}; LEVELS.forEach(function (k) { pct[k] = n ? c[k] / n * 100 : 0; });
    return { n: n, count: c, pct: pct, positive: n ? (c.fully + c.engaged) / n * 100 : 0 };
  }

  /**
   * responses: [{ answers:[50], importance:[50], area:'', comments:[50] }]
   * Returns everything the report needs. Areas with fewer than 5 responses are never shown on their own:
   * they are pooled into "other areas" (shown only if that pool has 5 or more).
   */
  function aggregate(responses) {
    var rs = responses.map(function (r) {
      var c = classify(r.answers, r.importance);
      return { answers: r.answers.map(Number), importance: r.importance.map(Number), area: String(r.area || '').trim(), comments: r.comments || [], level: c.level };
    });
    var overall = levelCounts(rs);
    // areas
    var byArea = {};
    rs.forEach(function (r) { var k = r.area || ''; (byArea[k] = byArea[k] || []).push(r); });
    var areas = [], other = [];
    Object.keys(byArea).sort().forEach(function (k) {
      if (k && byArea[k].length >= MIN_GROUP) areas.push({ name: k, levels: levelCounts(byArea[k]) });
      else other = other.concat(byArea[k]);
    });
    var otherGroup = other.length >= MIN_GROUP && areas.length ? { levels: levelCounts(other), hidden: 0 } : { levels: null, hidden: other.length };
    // questions
    var questions = [];
    for (var q = 0; q < COUNT; q++) {
      var dist = [0, 0, 0, 0, 0, 0], most = 0, comments = [];
      rs.forEach(function (r) { dist[r.answers[q]]++; if (r.importance[q] === 3) most++; var cm = String(r.comments[q] || '').trim(); if (cm) comments.push(cm); });
      var st = q === COUNT - 1 ? null : ED.questionStats(rs.map(function (r) { return r.answers[q]; }));
      questions.push({ i: q, cat: QUESTION_CATS[q], scale: SCALES[q], dist: dist, n: rs.length, mostPct: rs.length ? most / rs.length * 100 : 0, stats: st, comments: comments });
    }
    // factors (same statistics as the Express Diagnostics matrix; Q50 is a meta question and is left out)
    var cats = CATS.map(function (c) {
      var qs = questions.filter(function (x) { return x.cat === c.id && x.stats; });
      var mid = 0, disp = 0; qs.forEach(function (x) { mid += x.stats.middle; disp += x.stats.dispersion; });
      mid = qs.length ? mid / qs.length : 0; disp = qs.length ? disp / qs.length : 0;
      return { id: c.id, key: c.key, group: c.group, middle: mid, dispersion: disp, percent: mid / 4 * 100, color: ED.colorOf(mid), questions: qs.map(function (x) { return x.i; }) };
    });
    var top = questions.filter(function (x) { return x.mostPct > 0; }).sort(function (a, b) { return b.mostPct - a.mostPct || a.i - b.i; }).slice(0, 10);
    var nComments = questions.reduce(function (s, x) { return s + x.comments.length; }, 0);
    return { n: rs.length, overall: overall, areas: areas, other: otherGroup, questions: questions, cats: cats, top: top, nComments: nComments };
  }

  return {
    COUNT: COUNT, QUESTION_CATS: QUESTION_CATS, SCALES: SCALES, CATS: CATS, GROUPS: GROUPS, LEVELS: LEVELS,
    MAX_MOST: MAX_MOST, MIN_MOST: MIN_MOST, MIN_RESPONSES: MIN_RESPONSES, MIN_GROUP: MIN_GROUP,
    hasDontKnow: hasDontKnow, classify: classify, validResponse: validResponse, aggregate: aggregate, levelCounts: levelCounts,
  };
})();
