/* Express Diagnostics — widget (individual mode).
 * Embed:
 *   <div id="ed-assessment"></div>
 *   <script>window.ED_CONFIG = { endpoint: 'https://script.google.com/macros/s/XXX/exec' };</script>
 *   <script src="https://cdn.jsdelivr.net/gh/Adizes/alis-sample@vX/express-diagnostics/dist/express-diagnostics.min.js" defer></script>
 * Bundled by build.mjs together with: i18n files, shared/core.js, shared/ed-engine.js, shared/pdfkit.js,
 * shared/ed-report.js, shared/ed-visuals.js.
 */
var VERSION = '__VERSION__';
var CSS = __CSS__;
var I18N = ED_I18N;
var N = ED.COUNT;

var DEFAULTS = {
  mount: '#ed-assessment',
  endpoint: '',                         // Apps Script web app URL ('' = demo mode, nothing is saved)
  lang: 'auto',
  languages: Object.keys(I18N),
  calendlyUrl: 'https://calendly.com/jaime-morales/30min',
  privacyUrl: { en: 'https://www.adizes.com/privacy-policy', es: 'https://www.adizes.com/privacy-policy' },
  assetsBase: '',
  storageKey: 'adz-ed:v1',
  loadFont: true,
};

// Step list: one step per statement, then the contact gate.
function sectionOf(q) { var cat = ED.QUESTION_CATS[q]; for (var i = 0; i < ED.CELLS.length; i++) if (ED.CELLS[i].id === cat) return i; return 0; }
var FIRST_OF_SECTION = {};
for (var qi = 0; qi < N; qi++) { var s0 = sectionOf(qi); if (FIRST_OF_SECTION[s0] == null) FIRST_OF_SECTION[s0] = qi; }

function App(el, cfg) {
  this.el = el; this.cfg = cfg;
  this.lang = this.pickLang();
  this.state = this.fresh();
  this.busy = false; this.dir = 1;
  this.root = document.createElement('div');
  this.root.className = 'adz';
  el.innerHTML = ''; el.appendChild(this.root);
  var saved = load(cfg.storageKey);
  if (saved && saved.result) { this.state = saved; this.renderResults(); }
  else if (saved && (saved.step > 0 || (saved.answers || []).some(Boolean))) { this.saved = saved; this.renderResume(); }
  else this.renderIntro();
  var self = this;
  this.onKey = function (e) { self.key(e); };
  document.addEventListener('keydown', this.onKey);
}
App.prototype.fresh = function () { return { step: 0, answers: [], contact: {}, startedAt: new Date().toISOString() }; };
App.prototype.t = function () { return I18N[this.lang] || I18N.en; };
App.prototype.pickLang = function () {
  var avail = this.cfg.languages.filter(function (l) { return I18N[l]; });
  var want = qs('lang') || (this.cfg.lang !== 'auto' ? this.cfg.lang : '') || ((load(this.cfg.storageKey) || {}).lang) ||
    ((navigator.language || 'en').slice(0, 2).toLowerCase());
  return avail.indexOf(want) >= 0 ? want : (avail.indexOf('en') >= 0 ? 'en' : avail[0]);
};
App.prototype.save = function () { this.state.lang = this.lang; store(this.cfg.storageKey, this.state); };

/* ---------- chrome ---------- */
App.prototype.logo = function () {
  var b = this.cfg.assetsBase;
  return b ? '<img class="adz-logo" alt="Adizes Institute" src="' + esc(b + 'adizes-logo-color.png') + '">' : '<span class="adz-logo-txt">ADIZES</span>';
};
App.prototype.langSwitch = function () {
  var self = this, langs = this.cfg.languages.filter(function (l) { return I18N[l]; });
  if (langs.length < 2) return '';
  return '<div class="adz-lang" role="group" aria-label="' + esc(this.t().ui.language) + '">' + langs.map(function (l) {
    return '<button type="button" data-lang="' + l + '" aria-pressed="' + (l === self.lang) + '">' + l.toUpperCase() + '</button>';
  }).join('') + '</div>';
};
App.prototype.progress = function () {
  var answered = this.state.step; // statements already passed
  return '<div class="adz-progress" aria-hidden="true">' + ED.CELLS.map(function (c, i) {
    var start = FIRST_OF_SECTION[i], len = ED.QUESTION_CATS.filter(function (x) { return x === c.id; }).length;
    var f = Math.max(0, Math.min(1, (answered - start) / len));
    return '<span style="flex:' + len + '"><i style="width:' + (f * 100) + '%"></i></span>';
  }).join('') + '</div>';
};
App.prototype.frame = function (inner, opts) {
  opts = opts || {};
  this.root.innerHTML =
    '<div class="adz-stage">' +
      '<div class="adz-top">' + this.logo() + (opts.lang !== false ? this.langSwitch() : '') + '</div>' +
      (opts.progress ? this.progress() : '') +
      '<div class="adz-body"><div class="adz-screen' + (this.dir < 0 ? ' is-back' : '') + '">' + inner + '</div></div>' +
    '</div>';
  this.bindLang();
  this.scrollTop();
};
App.prototype.scrollTop = function () {
  if (!this.mounted) { this.mounted = true; return; }
  var r = this.el.getBoundingClientRect();
  if (r.top < 0 || r.top > window.innerHeight * 0.4) {
    try { window.scrollTo({ top: window.pageYOffset + r.top - 10, behavior: 'smooth' }); } catch (e) { window.scrollTo(0, window.pageYOffset + r.top - 10); }
  }
};
App.prototype.bindLang = function () {
  var self = this;
  this.root.querySelectorAll('[data-lang]').forEach(function (b) {
    b.addEventListener('click', function () {
      self.lang = b.getAttribute('data-lang'); self.save(); self.dir = 1; self.mounted = false;
      if (self.state.result) self.renderResults();
      else if (self.view === 'intro') self.renderIntro();
      else if (self.view === 'resume') self.renderResume();
      else self.renderStep();
    });
  });
};

/* ---------- intro / resume ---------- */
App.prototype.renderIntro = function () {
  var t = this.t(), self = this;
  this.view = 'intro';
  this.frame(
    '<div class="adz-eyebrow">' + esc(t.intro.eyebrow) + '</div>' +
    '<h1 class="adz-h1">' + esc(t.intro.title) + '</h1>' +
    '<p class="adz-lead">' + esc(t.intro.body) + '</p>' +
    '<ul class="adz-list">' + t.intro.bullets.map(function (b) { return '<li>' + esc(b) + '</li>'; }).join('') + '</ul>' +
    '<p class="adz-note">' + esc(t.intro.note) + '</p>' +
    '<div class="adz-actions"><button type="button" class="adz-btn" data-act="start">' + esc(t.ui.start) + ' →</button>' +
    '<span class="adz-hint">' + esc(t.ui.pressEnter) + '</span></div>' +
    '<p class="adz-meta">' + esc(t.ui.minutes) + '</p>');
  this.root.querySelector('[data-act="start"]').addEventListener('click', function () { self.start(); });
};
App.prototype.start = function () { this.state = this.fresh(); this.dir = 1; this.save(); this.renderStep(); };
App.prototype.renderResume = function () {
  var t = this.t(), self = this;
  this.view = 'resume';
  this.frame(
    '<div class="adz-eyebrow">' + esc(t.intro.eyebrow) + '</div>' +
    '<h1 class="adz-h1 adz-h1--sm">' + esc(t.ui.resume) + '</h1>' +
    '<div class="adz-actions"><button type="button" class="adz-btn" data-act="yes">' + esc(t.ui.resumeYes) + ' →</button>' +
    '<button type="button" class="adz-btn adz-btn--ghost" data-act="no">' + esc(t.ui.resumeNo) + '</button></div>');
  this.root.querySelector('[data-act="yes"]').addEventListener('click', function () { self.state = self.saved; self.renderStep(); });
  this.root.querySelector('[data-act="no"]').addEventListener('click', function () { store(self.cfg.storageKey, null); self.renderIntro(); });
};

/* ---------- statements ---------- */
App.prototype.renderStep = function () {
  if (this.state.step >= N) return this.renderGate();
  var t = this.t(), self = this, q = this.state.step, sec = sectionOf(q), cell = ED.CELLS[sec];
  var cur = this.state.answers[q];
  this.view = 'step';
  var html =
    '<div class="adz-qhead"><div class="adz-eyebrow">' + esc(t.ui.section) + ' ' + (sec + 1) + '/16 · ' + esc(t.cells[cell.key]) + '</div>' +
    '<span class="adz-count">' + (q + 1) + ' ' + esc(t.ui.of) + ' ' + N + '</span></div>' +
    '<h2 class="adz-q">' + esc(t.questions[q].t) + '</h2>' +
    '<div class="adz-scale" role="radiogroup">' + t.scale.map(function (o, i) {
      return '<button type="button" role="radio" class="adz-opt" data-v="' + o.value + '" aria-checked="' + (cur === o.value) + '">' +
        '<span class="adz-key">' + (i + 1) + '</span><span class="adz-opt-t"><b>' + esc(o.label) + '</b><small>' + esc(o.sub) + '</small></span></button>';
    }).join('') + '</div>' +
    '<button type="button" class="adz-cannot" data-v="1" aria-pressed="' + (cur === 1) + '">' + esc(t.cannot) + '</button>' +
    '<div class="adz-nav">' +
      '<button type="button" class="adz-back" data-act="back"' + (q === 0 ? ' hidden' : '') + '>← ' + esc(t.ui.back) + '</button>' +
      '<div class="adz-actions adz-actions--tight"><span class="adz-hint adz-hint--keys">' + esc(t.ui.keyboardHint) + '</span>' +
      (cur ? '<button type="button" class="adz-btn adz-btn--ghost" data-act="next">' + esc(t.ui.next) + ' →</button>' : '') + '</div>' +
    '</div>';
  this.frame(html, { progress: true, lang: q === 0 });
  this.root.querySelectorAll('[data-v]').forEach(function (b) { b.addEventListener('click', function () { self.choose(Number(b.getAttribute('data-v')), b); }); });
  var back = this.root.querySelector('[data-act="back"]'); if (back) back.addEventListener('click', function () { self.back(); });
  var nxt = this.root.querySelector('[data-act="next"]'); if (nxt) nxt.addEventListener('click', function () { self.next(); });
};
App.prototype.choose = function (v, btn) {
  if (this.busy) return;
  this.state.answers[this.state.step] = v;
  this.root.querySelectorAll('.adz-opt').forEach(function (b) { b.setAttribute('aria-checked', String(Number(b.getAttribute('data-v')) === v)); });
  var c = this.root.querySelector('.adz-cannot'); if (c) c.setAttribute('aria-pressed', String(v === 1));
  if (btn) { btn.classList.remove('is-pop'); void btn.offsetWidth; btn.classList.add('is-pop'); }
  this.save();
  var self = this; this.busy = true;
  setTimeout(function () { self.busy = false; self.next(); }, 280);
};
App.prototype.next = function () {
  if (this.state.step < N && !this.state.answers[this.state.step]) return;
  this.state.step = Math.min(this.state.step + 1, N); this.dir = 1; this.save(); this.renderStep();
};
App.prototype.back = function () {
  if (this.state.step === 0) return;
  this.state.step--; this.dir = -1; this.save(); this.renderStep();
};
App.prototype.key = function (e) {
  if (!this.root.isConnected) { document.removeEventListener('keydown', this.onKey); return; }
  var tag = (e.target && e.target.tagName) || '';
  if (tag === 'INPUT' || tag === 'TEXTAREA' || e.metaKey || e.ctrlKey || e.altKey) return;
  if (this.view === 'intro' && e.key === 'Enter') {
    var r = this.el.getBoundingClientRect();
    if (r.top < window.innerHeight && r.bottom > 0) { e.preventDefault(); this.start(); }
    return;
  }
  if (this.view !== 'step') return;
  var t = this.t();
  if (/^[1-4]$/.test(e.key)) { e.preventDefault(); var v = t.scale[Number(e.key) - 1].value; this.choose(v, this.root.querySelector('.adz-opt[data-v="' + v + '"]')); return; }
  if (e.key === '0') { e.preventDefault(); this.choose(1, this.root.querySelector('.adz-cannot')); return; }
  if (e.key === 'Enter') { e.preventDefault(); this.next(); }
  if (e.key === 'Backspace') { e.preventDefault(); this.back(); }
};

/* ---------- gate ---------- */
App.prototype.renderGate = function () {
  var t = this.t(), g = t.gate, c = this.state.contact || {}, self = this;
  var privacy = (this.cfg.privacyUrl && (this.cfg.privacyUrl[this.lang] || this.cfg.privacyUrl.en)) || '#';
  var consent = esc(g.consent).replace('{privacy}', '<a href="' + esc(privacy) + '" target="_blank" rel="noopener">' + esc(g.privacy) + '</a>');
  this.view = 'gate';
  function field(n, type, label, ph, val, err, ac) {
    return '<div class="adz-field" data-f="' + n + '"><label for="adz-' + n + '">' + esc(label) + '</label>' +
      '<input id="adz-' + n + '" name="' + n + '" type="' + type + '" placeholder="' + esc(ph) + '" value="' + esc(val || '') + '" autocomplete="' + ac + '"' + (n === 'email' ? ' inputmode="email"' : '') + '>' +
      '<div class="adz-err">' + esc(err) + '</div></div>';
  }
  this.frame(
    '<div class="adz-eyebrow">' + esc(g.eyebrow) + '</div>' +
    '<h1 class="adz-h1 adz-h1--sm">' + esc(g.title) + '</h1>' +
    '<p class="adz-lead">' + esc(g.body) + '</p>' +
    '<form class="adz-form" novalidate>' +
      field('name', 'text', g.name, g.namePh, c.name, g.errName, 'name') +
      field('email', 'email', g.email, g.emailPh, c.email, g.errEmail, 'email') +
      field('company', 'text', g.company, g.companyPh, c.company, g.errCompany, 'organization') +
      '<div class="adz-field" data-f="consent"><label class="adz-consent"><input type="checkbox" name="consent"' + (c.consent ? ' checked' : '') + '><span>' + consent + '</span></label><div class="adz-err">' + esc(g.errConsent) + '</div></div>' +
      '<div class="adz-nav"><button type="button" class="adz-back" data-act="back">← ' + esc(t.ui.back) + '</button>' +
      '<button type="submit" class="adz-btn">' + esc(g.submit) + ' →</button></div>' +
    '</form>', { progress: true, lang: false });
  var form = this.root.querySelector('form');
  this.root.querySelector('[data-act="back"]').addEventListener('click', function () { self.back(); });
  form.addEventListener('input', function (e) { var f = e.target.closest('.adz-field'); if (f) f.classList.remove('has-error'); });
  form.addEventListener('submit', function (e) { e.preventDefault(); self.submit(form); });
};
App.prototype.submit = function (form) {
  var v = { name: form.name.value.trim().replace(/\s+/g, ' '), email: form.email.value.trim(), company: form.company.value.trim().replace(/\s+/g, ' '), consent: form.consent.checked };
  var bad = [];
  if (v.name.length < 2) bad.push('name');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email)) bad.push('email');
  if (!v.company) bad.push('company');
  if (!v.consent) bad.push('consent');
  form.querySelectorAll('.adz-field').forEach(function (f) { f.classList.toggle('has-error', bad.indexOf(f.getAttribute('data-f')) >= 0); });
  if (bad.length) { var el = form.querySelector('[name="' + bad[0] + '"]'); if (el) el.focus(); return; }
  this.state.contact = v; this.save(); this.send();
};
App.prototype.send = function () {
  var t = this.t(), self = this, s = this.state;
  this.view = 'loading';
  this.frame('<div class="adz-loading"><div class="adz-spinner"></div><p class="adz-lead">' + esc(t.ui.loading) + '</p></div>', { lang: false });
  var answers = s.answers.slice(0, N);
  var payload = { action: 'ed_submit', v: VERSION, lang: this.lang, answers: answers, contact: s.contact, meta: utmMeta(s.startedAt) };
  var started = Date.now();
  api(this.cfg.endpoint, payload, 30000).then(function (res) {
    setTimeout(function () {
      s.id = res.id; s.result = true; s.submittedAt = new Date().toISOString(); s.pdf = 'pending';
      self.save(); self.renderResults();
    }, Math.max(0, 1200 - (Date.now() - started)));
  }).catch(function () {
    self.frame('<div class="adz-loading"><p class="adz-lead">' + esc(t.ui.errorGeneric) + '</p>' +
      '<button type="button" class="adz-btn" data-act="retry">' + esc(t.ui.retry) + '</button></div>', { lang: false });
    self.root.querySelector('[data-act="retry"]').addEventListener('click', function () { self.send(); });
  });
};

/* ---------- results ---------- */
App.prototype.result = function () { return ED.score([this.state.answers.slice(0, N)]); };
App.prototype.renderResults = function () {
  var t = this.t(), R = t.results, s = this.state, r = this.result(), self = this;
  this.view = 'results';
  var counts = edCounts(r);
  var focus = r.cells.filter(function (c) { return c.color === 'red'; });
  var focusNote = '';
  if (!focus.length) { focus = r.cells.filter(function (c) { return c.color === 'yellow'; }).sort(function (a, b) { return a.percent - b.percent; }).slice(0, 3); focusNote = R.focusNone; }
  var focusHtml = focus.map(function (c) {
    var qs2 = c.questions.map(function (i) { return r.questions[i]; }).filter(function (q) { return q.color !== 'green'; });
    return '<div class="adz-focus is-' + c.color + '"><div class="adz-focus-h"><b>' + esc(t.cells[c.key]) + '</b><span>' + Math.round(c.percent) + '%</span></div>' +
      '<ul>' + qs2.map(function (q) { return '<li class="is-' + q.color + '">' + esc(edQuestionText(t, q)) + (q.zone === 0 ? ' <em>· ' + esc(t.noAnswer) + '</em>' : '') + '</li>'; }).join('') + '</ul></div>';
  }).join('');
  var email = '<b>' + esc(s.contact && s.contact.email || '') + '</b>';
  var pdfStatus = s.pdf === 'sent' ? fill(esc(R.pdfSent), { email: email }) : s.pdf === 'error' ? esc(R.pdfError) : fill(esc(R.pdfSending), { email: email });

  this.root.innerHTML =
    '<div class="adz-results">' +
      '<div class="adz-top">' + this.logo() + this.langSwitch() + '</div>' +
      '<header class="adz-hero">' +
        '<div class="adz-eyebrow">' + esc(R.eyebrow) + '</div>' +
        '<h1 class="adz-h1">' + esc(s.contact.company || '') + '</h1>' +
        '<p class="adz-lead">' + esc(R.lead) + '</p>' +
        '<div class="adz-counts">' + ['red', 'yellow', 'green'].map(function (c) {
          return '<div class="adz-countbox is-' + c + '"><b>' + counts[c] + '</b><span>' + esc(R.count[c]) + '</span></div>';
        }).join('') + '</div>' +
      '</header>' +
      '<section class="adz-sec"><h2>' + esc(R.diagramTitle) + '</h2><p class="adz-help">' + esc(R.diagramHelp) + '</p>' + edDiagramHtml(t, r) +
        '<div class="adz-legend">' + ['green', 'yellow', 'red'].map(function (c) { return '<span class="is-' + c + '"><i></i>' + esc(t.colors[c]) + '</span>'; }).join('') + '</div></section>' +
      '<section class="adz-sec"><h2>' + esc(R.radarTitle) + '</h2><p class="adz-help">' + esc(R.radarHelp) + '</p>' +
        '<div class="adz-radars">' + edRadarSvg(t, r, ED.RADARS[0], t.radar.title1) + edRadarSvg(t, r, ED.RADARS[1], t.radar.title2) + '</div>' +
        '<div class="adz-legend adz-legend--lines"><span class="is-ok"><i></i>' + esc(t.radar.normal) + '</span><span class="is-bad"><i></i>' + esc(t.radar.abnormal) + '</span><span class="is-you"><i></i>' + esc(t.radar.yours) + '</span></div></section>' +
      '<section class="adz-sec"><h2>' + esc(R.focusTitle) + '</h2><p class="adz-help">' + esc(focusNote || R.focusHelp) + '</p>' + focusHtml + '</section>' +
      '<div class="adz-split">' +
        '<section class="adz-card adz-card--dark">' +
          '<div class="adz-eyebrow">' + esc(R.sessionEyebrow) + '</div><h2>' + esc(R.sessionTitle) + '</h2><p>' + esc(R.sessionBody) + '</p>' +
          '<a class="adz-btn" data-act="book" href="' + esc(this.calendlyLink()) + '" target="_blank" rel="noopener">' + esc(R.sessionCta) + ' →</a>' +
        '</section>' +
        '<section class="adz-card">' +
          '<h2>' + esc(R.pdfTitle) + '</h2><p class="adz-status" data-pdf-status>' + pdfStatus + '</p>' +
          '<button type="button" class="adz-btn adz-btn--ghost" data-act="download">' + esc(R.download) + '</button>' +
        '</section>' +
      '</div>' +
      '<div class="adz-foot"><button type="button" data-act="retake">' + esc(R.retake) + '</button></div>' +
    '</div>';
  this.bindLang(); this.scrollTop();
  this.root.querySelector('[data-act="book"]').addEventListener('click', function () { self.event('book_click'); });
  this.root.querySelector('[data-act="download"]').addEventListener('click', function (e) { self.download(e.currentTarget); });
  this.root.querySelector('[data-act="retake"]').addEventListener('click', function () { store(self.cfg.storageKey, null); self.state = self.fresh(); self.dir = 1; self.renderIntro(); });
  if (s.pdf === 'pending' && !this.delivering) this.deliver();
};
App.prototype.calendlyLink = function () {
  var c = this.state.contact || {}, u = this.cfg.calendlyUrl, sep = u.indexOf('?') >= 0 ? '&' : '?';
  return u + sep + 'name=' + encodeURIComponent(c.name || '') + '&email=' + encodeURIComponent(c.email || '') +
    '&utm_source=express-diagnostics&utm_content=' + encodeURIComponent(this.state.id || '');
};
App.prototype.event = function (type) { if (this.state.id) api(this.cfg.endpoint, { action: 'ed_event', id: this.state.id, type: type }, 15000).catch(function () {}); };
App.prototype.setPdfStatus = function (kind) {
  var R = this.t().results, el = this.root.querySelector('[data-pdf-status]'), email = '<b>' + esc(this.state.contact.email) + '</b>';
  if (el) el.innerHTML = kind === 'sent' ? fill(esc(R.pdfSent), { email: email }) : kind === 'error' ? esc(R.pdfError) : fill(esc(R.pdfSending), { email: email });
};
App.prototype.pdfData = function () {
  var c = this.state.contact || {};
  return { result: this.result(), company: c.company, participants: [c.name], dateIso: this.state.submittedAt, calendlyUrl: this.calendlyLink() };
};
App.prototype.buildPdf = function (lang) {
  var self = this;
  return getPdfAssets(this.cfg.assetsBase).then(function (A) { return renderEdPdf(A, lang, self.pdfData()); });
};
App.prototype.fileName = function () {
  var n = (this.state.contact.company || '').replace(/[^\wÀ-ſ ]+/g, '').trim().replace(/\s+/g, '-');
  return (this.lang === 'es' ? 'Diagnostico-Expres' : 'Express-Diagnostics') + (n ? '-' + n : '') + '.pdf';
};
App.prototype.deliver = function () {
  var self = this, s = this.state, lang = this.lang;
  this.delivering = true;
  this.buildPdf(lang).then(function (doc) {
    return api(self.cfg.endpoint, { action: 'ed_deliver', id: s.id, lang: lang, fileName: self.fileName(), pdf: doc.output('datauristring').split(',')[1] }, 60000);
  }).then(function () { s.pdf = 'sent'; self.save(); self.setPdfStatus('sent'); })
    .catch(function (e) { if (window.console) console.warn('[ED] deliver', e); s.pdf = 'error'; self.save(); self.setPdfStatus('error'); })
    .then(function () { self.delivering = false; });
};
App.prototype.download = function (btn) {
  var self = this, R = this.t().results, label = btn.textContent;
  btn.disabled = true; btn.textContent = R.preparing;
  this.buildPdf(this.lang).then(function (doc) { doc.save(self.fileName()); self.event('pdf_download'); })
    .catch(function (e) { if (window.console) console.error(e); alert(self.t().ui.errorGeneric); })
    .then(function () { btn.disabled = false; btn.textContent = label; });
};

/* ---------- boot ---------- */
function boot() {
  var cfg = {}, user = window.ED_CONFIG || {};
  for (var k in DEFAULTS) cfg[k] = DEFAULTS[k];
  for (var k2 in user) cfg[k2] = user[k2];
  if (!cfg.assetsBase) cfg.assetsBase = detectAssets();
  var el = typeof cfg.mount === 'string' ? document.querySelector(cfg.mount) : cfg.mount;
  if (!el) { if (window.console) console.error('[ED] mount element not found: ' + cfg.mount); return; }
  if (!el.id) el.id = 'ed-assessment';
  injectStyle('adz-style-' + el.id, CSS, '#' + el.id);
  if (cfg.loadFont) loadFontCss();
  window.EDA = {
    app: new App(el, cfg), version: VERSION, score: ED.score,
    // Team report (used by the admin): responses = [[67 raw answers], ...]
    teamPdf: function (responses, company, names, lang, dateIso) {
      return getPdfAssets(cfg.assetsBase).then(function (A) {
        return renderEdPdf(A, lang || 'en', { result: ED.score(responses), company: company, participants: names || [], dateIso: dateIso, calendlyUrl: cfg.calendlyUrl });
      });
    },
  };
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
