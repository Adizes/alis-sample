/* Express Diagnostics — participant widget (personal invitation link ?t=TOKEN).
 * The participant answers and only sees a thank-you; the group report is generated in the admin.
 * Embed (Webflow page /express-diagnostics):
 *   <div id="ed-assessment"></div>
 *   <script>window.ED_CONFIG = { endpoint: 'https://script.google.com/macros/s/XXX/exec' };</script>
 *   <script src="https://cdn.jsdelivr.net/gh/Adizes/alis-sample@vX/express-diagnostics/dist/express-diagnostics.min.js" defer></script>
 * Bundled by build.mjs with: i18n files, shared/core.js, shared/ed-engine.js, shared/survey.js.
 */
var ED_SECTIONS = ED.CELLS.length;
function edSection(q) {
  var cat = ED.QUESTION_CATS[q];
  for (var i = 0; i < ED.CELLS.length; i++) if (ED.CELLS[i].id === cat) return { index: i, total: ED_SECTIONS, key: ED.CELLS[i].key };
  return { index: 0, total: ED_SECTIONS, key: ED.CELLS[0].key };
}

bootSurvey('ED_CONFIG', {
  mount: '#ed-assessment',
  endpoint: '',              // Apps Script web app URL ('' = demo mode: nothing is saved)
  lang: 'auto',              // 'auto' = the launch's language
  assetsBase: '',
  loadFont: true,
  css: __CSS__,
  version: '__VERSION__',
}, {
  I18N: ED_I18N, prefix: 'adz-ed:', count: ED.COUNT, autoAdvance: true,
  section: edSection,
  options: function (t) { return t.scale; },
  cannot: function (t) { return t.cannot; },
  text: function (t, q) { return t.questions[q].t; },
  importance: null, comments: false,
}, 'EDA');
