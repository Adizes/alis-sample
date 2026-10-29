/* Engagement Survey — participant widget (personal invitation link ?t=TOKEN). Anonymous: the participant
 * only sees a thank-you; the group report is generated in the admin.
 * Embed (Webflow page /engagement-survey):
 *   <div id="es-survey"></div>
 *   <script>window.ES_CONFIG = { endpoint: 'https://script.google.com/macros/s/XXX/exec' };</script>
 *   <script src="https://cdn.jsdelivr.net/gh/Adizes/alis-sample@vX/engagement-survey/dist/engagement-survey.min.js" defer></script>
 * Bundled by build.mjs with: i18n files, shared/core.js, shared/ed-engine.js, shared/es-engine.js, shared/survey.js.
 */
var ES_CAT_INDEX = {};
ES.CATS.forEach(function (c, i) { ES_CAT_INDEX[c.id] = c; });
// Sections follow the order of the questions (Values, Climate, … Supervisor, Planning, …).
var ES_SECTIONS = [];
ES.QUESTION_CATS.forEach(function (c) { if (ES_SECTIONS[ES_SECTIONS.length - 1] !== c) ES_SECTIONS.push(c); });
function esSection(q) {
  // Q48 and Q50 are both "Changes" but separated by Q49 → each run is its own segment.
  var run = -1, last = null;
  for (var i = 0; i <= q; i++) { if (ES.QUESTION_CATS[i] !== last) { run++; last = ES.QUESTION_CATS[i]; } }
  return { index: run, total: ES_SECTIONS.length, key: ES_CAT_INDEX[ES.QUESTION_CATS[q]].key };
}

bootSurvey('ES_CONFIG', {
  mount: '#es-survey',
  endpoint: '',
  lang: 'auto',
  assetsBase: '',
  loadFont: true,
  css: __CSS__,
  version: '__VERSION__',
}, {
  I18N: ES_I18N, prefix: 'adz-es:', count: ES.COUNT, autoAdvance: false,
  section: esSection,
  options: function (t, q) { return t.scales[ES.SCALES[q]]; },
  cannot: function (t, q) { return ES.hasDontKnow(q) ? t.dontKnow : null; },
  text: function (t, q) { return t.questions[q]; },
  importance: { max: ES.MAX_MOST, min: ES.MIN_MOST },
  comments: true,
  payload: function (s) {
    return { importance: s.importance.slice(0, ES.COUNT), comments: (s.comments || []).slice(0, ES.COUNT).map(function (c) { return String(c || '').slice(0, 1000); }) };
  },
}, 'ESA');
