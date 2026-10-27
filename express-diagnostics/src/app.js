/* Express Diagnostics — participant widget (personal invitation link ?t=TOKEN).
 * The participant answers and only sees a thank-you; the group report is generated in the admin.
 * Embed:
 *   <div id="ed-assessment"></div>
 *   <script>window.ED_CONFIG = { endpoint: 'https://script.google.com/macros/s/XXX/exec' };</script>
 *   <script src="https://cdn.jsdelivr.net/gh/Adizes/alis-sample@vX/express-diagnostics/dist/express-diagnostics.min.js" defer></script>
 * Bundled by build.mjs together with: i18n files, shared/core.js, shared/ed-engine.js.
 */
var VERSION = '__VERSION__';
var CSS = __CSS__;
var I18N = ED_I18N;
var N = ED.COUNT;

var DEFAULTS = {
  mount: '#ed-assessment',
  endpoint: '',            // Apps Script web app URL ('' = demo mode: nothing is saved)
  lang: 'auto',            // 'auto' = the language chosen for the launch
  languages: Object.keys(I18N),
  assetsBase: '',
  loadFont: true,
};

function sectionOf(q) { var cat = ED.QUESTION_CATS[q]; for (var i = 0; i < ED.CELLS.length; i++) if (ED.CELLS[i].id === cat) return i; return 0; }
var FIRST_OF_SECTION = {};
for (var qi = 0; qi < N; qi++) { var s0 = sectionOf(qi); if (FIRST_OF_SECTION[s0] == null) FIRST_OF_SECTION[s0] = qi; }

function App(el, cfg) {
  this.el = el; this.cfg = cfg;
  this.token = (qs('t') || '').replace(/[^A-Za-z0-9]/g, '');
  this.skey = 'adz-ed:' + (this.token || 'demo');
  this.info = null;
  this.lang = this.pickLang();
  this.state = { step: 0, answers: [] };
  this.busy = false; this.dir = 1;
  this.root = document.createElement('div');
  this.root.className = 'adz';
  el.innerHTML = ''; el.appendChild(this.root);
  var self = this;
  this.onKey = function (e) { self.key(e); };
  document.addEventListener('keydown', this.onKey);
  this.boot();
}
App.prototype.t = function () { return I18N[this.lang] || I18N.en; };
App.prototype.pickLang = function (launchLang) {
  var avail = this.cfg.languages.filter(function (l) { return I18N[l]; });
  var saved = load(this.skey) || {};
  var want = qs('lang') || saved.lang || (this.cfg.lang !== 'auto' ? this.cfg.lang : '') || launchLang ||
    ((navigator.language || 'en').slice(0, 2).toLowerCase());
  return avail.indexOf(want) >= 0 ? want : (avail.indexOf('en') >= 0 ? 'en' : avail[0]);
};
App.prototype.save = function () { this.state.lang = this.lang; store(this.skey, this.state); };
App.prototype.vars = function () {
  var i = this.info || {};
  return { company: esc(i.company || ''), first: esc(i.firstName || ''), date: esc(i.closeDate ? formatDate(i.closeDate + 'T12:00:00', this.t().locale) : '') };
};

/* ---------- loading the invitation ---------- */
App.prototype.boot = function () {
  var self = this;
  if (!this.token && this.cfg.endpoint) return this.renderState('noToken');
  this.frame('<div class="adz-loading"><div class="adz-spinner"></div><p class="adz-lead">' + esc(this.t().ui.loading) + '</p></div>', { lang: false });
  var req = this.cfg.endpoint ? api(this.cfg.endpoint, { action: 'p_load', t: this.token }, 20000)
    : Promise.resolve({ ok: true, state: 'open', type: 'ED', lang: this.lang, company: 'Demo Company', firstName: 'Demo', closeDate: '' });
  req.then(function (info) {
    self.info = info;
    if (!qs('lang') && !(load(self.skey) || {}).lang) self.lang = self.pickLang(info.lang);
    if (info.state !== 'open') { store(self.skey, null); return self.renderState(info.state); }
    var saved = load(self.skey);
    if (saved && (saved.answers || []).some(Boolean)) { self.saved = saved; self.renderResume(); }
    else self.renderIntro();
  }).catch(function (e) {
    if (e && e.code === 'invalid_link') return self.renderState('invalid_link');
    self.frame('<div class="adz-loading"><p class="adz-lead">' + esc(self.t().ui.errorGeneric) + '</p>' +
      '<button type="button" class="adz-btn" data-act="retry">' + esc(self.t().ui.retry) + '</button></div>', { lang: false });
    self.root.querySelector('[data-act="retry"]').addEventListener('click', function () { self.boot(); });
  });
};

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
  var answered = this.state.step;
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
      var fn = { intro: 'renderIntro', resume: 'renderResume', step: 'renderStep', review: 'renderReview', state: 'renderState', thanks: 'renderThanks' }[self.view];
      if (fn) self[fn](self.stateKey);
    });
  });
};

/* ---------- screens ---------- */
App.prototype.renderState = function (key) {
  var s = this.t().states[key] || this.t().states.invalid_link;
  this.view = 'state'; this.stateKey = key;
  this.frame('<div class="adz-msg"><div class="adz-eyebrow">' + esc(this.t().intro.eyebrow) + '</div>' +
    '<h1 class="adz-h1 adz-h1--sm">' + esc(s.title) + '</h1><p class="adz-lead">' + esc(s.body) + '</p></div>');
};
App.prototype.renderIntro = function () {
  var t = this.t(), v = this.vars(), self = this, i = this.info || {};
  this.view = 'intro';
  this.frame(
    '<div class="adz-eyebrow">' + esc(t.intro.eyebrow) + (v.company ? ' · ' + v.company : '') + '</div>' +
    (v.first ? '<p class="adz-hello">' + fill(esc(t.intro.hello), v) + '</p>' : '') +
    '<h1 class="adz-h1">' + fill(esc(t.intro.title), v) + '</h1>' +
    '<p class="adz-lead">' + fill(esc(t.intro.body), v) + '</p>' +
    '<ul class="adz-list">' + t.intro.bullets.map(function (b) { return '<li>' + esc(b) + '</li>'; }).join('') + '</ul>' +
    '<p class="adz-note">' + esc(t.intro.note) + '</p>' +
    '<div class="adz-actions"><button type="button" class="adz-btn" data-act="start">' + esc(t.ui.start) + ' →</button>' +
    '<span class="adz-hint">' + esc(t.ui.pressEnter) + '</span></div>' +
    '<p class="adz-meta">' + esc(t.intro.meta) + (i.closeDate ? ' · ' + fill(esc(t.intro.deadline), v) : '') + '</p>');
  this.root.querySelector('[data-act="start"]').addEventListener('click', function () { self.start(); });
};
App.prototype.start = function () { this.state = { step: 0, answers: [] }; this.dir = 1; this.save(); this.renderStep(); };
App.prototype.renderResume = function () {
  var t = this.t(), self = this;
  this.view = 'resume';
  this.frame(
    '<div class="adz-eyebrow">' + esc(t.intro.eyebrow) + '</div>' +
    '<h1 class="adz-h1 adz-h1--sm">' + esc(t.ui.resume) + '</h1>' +
    '<div class="adz-actions"><button type="button" class="adz-btn" data-act="yes">' + esc(t.ui.resumeYes) + ' →</button>' +
    '<button type="button" class="adz-btn adz-btn--ghost" data-act="no">' + esc(t.ui.resumeNo) + '</button></div>');
  this.root.querySelector('[data-act="yes"]').addEventListener('click', function () { self.state = self.saved; self.renderStep(); });
  this.root.querySelector('[data-act="no"]').addEventListener('click', function () { store(self.skey, null); self.renderIntro(); });
};

/* ---------- statements ---------- */
App.prototype.renderStep = function () {
  if (this.state.step >= N) return this.renderReview();
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

/* ---------- review + submit + thanks ---------- */
App.prototype.renderReview = function () {
  var t = this.t(), R = t.review, self = this;
  var cannot = this.state.answers.slice(0, N).filter(function (v) { return v === 1; }).length;
  this.view = 'review';
  this.frame(
    '<div class="adz-eyebrow">' + esc(R.eyebrow) + '</div>' +
    '<h1 class="adz-h1 adz-h1--sm">' + esc(R.title) + '</h1>' +
    '<p class="adz-lead">' + esc(R.body) + (cannot ? ' ' + fill(esc(R.cannot), { n: cannot }) : '') + '</p>' +
    '<p class="adz-note">' + esc(R.warn) + '</p>' +
    '<div class="adz-actions"><button type="button" class="adz-btn" data-act="submit">' + esc(R.submit) + ' →</button>' +
    '<button type="button" class="adz-btn adz-btn--ghost" data-act="edit">' + esc(R.edit) + '</button></div>', { progress: true });
  this.root.querySelector('[data-act="submit"]').addEventListener('click', function () { self.submit(); });
  this.root.querySelector('[data-act="edit"]').addEventListener('click', function () { self.state.step = 0; self.dir = -1; self.save(); self.renderStep(); });
};
App.prototype.submit = function () {
  var t = this.t(), self = this;
  this.view = 'sending';
  this.frame('<div class="adz-loading"><div class="adz-spinner"></div><p class="adz-lead">' + esc(t.ui.sending) + '</p></div>', { lang: false });
  var started = Date.now();
  api(this.cfg.endpoint, { action: 'p_submit', v: VERSION, t: this.token, lang: this.lang, answers: this.state.answers.slice(0, N) }, 30000).then(function () {
    setTimeout(function () { store(self.skey, null); self.renderThanks(); }, Math.max(0, 900 - (Date.now() - started)));
  }).catch(function (e) {
    if (e && (e.code === 'already_completed' || e.code === 'closed' || e.code === 'invalid_link')) { store(self.skey, null); return self.renderState(e.code === 'already_completed' ? 'completed' : e.code); }
    self.frame('<div class="adz-loading"><p class="adz-lead">' + esc(t.ui.errorGeneric) + '</p>' +
      '<button type="button" class="adz-btn" data-act="retry">' + esc(t.ui.retry) + '</button></div>', { lang: false });
    self.root.querySelector('[data-act="retry"]').addEventListener('click', function () { self.submit(); });
  });
};
App.prototype.renderThanks = function () {
  var t = this.t(), v = this.vars();
  this.view = 'thanks';
  this.frame('<div class="adz-msg adz-msg--done"><div class="adz-check" aria-hidden="true"></div>' +
    '<h1 class="adz-h1 adz-h1--sm">' + fill(esc(t.thanks.title), v).replace(/,\s*$/, '') + '</h1>' +
    '<p class="adz-lead">' + fill(esc(t.thanks.body), v) + '</p></div>');
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
  window.EDA = { app: new App(el, cfg), version: VERSION };
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
