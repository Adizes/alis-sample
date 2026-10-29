/* Participant survey shell shared by Express Diagnostics and Engagement Survey.
 * Personal link ?t=TOKEN → p_load → intro → one statement per screen → review (all answers, click to edit)
 * → p_submit → thank-you. The participant never sees results. Language = the launch's language.
 *
 * spec = {
 *   I18N, prefix (storage key), count, autoAdvance,
 *   section(q) → { index, total, key }       // progress segments + eyebrow
 *   options(t, q) → [{ value, label, sub }]  // in display order (keys 1..n)
 *   cannot(t, q) → label | null              // raw value 1 ("I cannot answer" / "Don't know")
 *   text(t, q) → statement
 *   importance: { max, min } | null          // Engagement Survey: less / medium / most important
 *   comments: bool
 *   payload(state) → extra fields for p_submit
 * }
 */
function Survey(el, cfg, spec) {
  this.el = el; this.cfg = cfg; this.spec = spec; this.I18N = spec.I18N; this.N = spec.count;
  this.token = (qs('t') || '').replace(/[^A-Za-z0-9]/g, '');
  this.skey = spec.prefix + (this.token || 'demo');
  this.info = null;
  this.lang = this.pickLang(cfg.lang !== 'auto' ? cfg.lang : '');
  this.state = this.fresh();
  this.busy = false; this.dir = 1; this.reviewing = false;
  this.root = document.createElement('div');
  this.root.className = 'adz';
  el.innerHTML = ''; el.appendChild(this.root);
  var self = this;
  this.onKey = function (e) { self.key(e); };
  document.addEventListener('keydown', this.onKey);
  // sections: first question of each, and size
  this.sec = {};
  for (var q = 0; q < this.N; q++) { var s = spec.section(q); if (!this.sec[s.index]) this.sec[s.index] = { start: q, len: 0 }; this.sec[s.index].len++; }
  this.boot();
}
var SP = Survey.prototype;
SP.fresh = function () { var n = this.N; return { step: 0, answers: [], importance: this.spec.importance ? Array.apply(null, Array(n)).map(function () { return 1; }) : null, comments: this.spec.comments ? [] : null }; };
SP.t = function () { return this.I18N[this.lang] || this.I18N.en; };
SP.pickLang = function (want) {
  var avail = Object.keys(this.I18N);
  if (!want) want = (navigator.language || 'en').slice(0, 2).toLowerCase();
  return avail.indexOf(want) >= 0 ? want : (avail.indexOf('en') >= 0 ? 'en' : avail[0]);
};
SP.save = function () { store(this.skey, this.state); };
SP.vars = function () {
  var i = this.info || {};
  return { company: esc(i.company || ''), first: esc(i.firstName || ''), date: esc(i.closeDate ? formatDate(i.closeDate + 'T12:00:00', this.t().locale) : ''), n: this.N, max: this.spec.importance ? this.spec.importance.max : '' };
};
SP.mostCount = function () { var c = 0; (this.state.importance || []).forEach(function (v) { if (v === 3) c++; }); return c; };

/* ---------- loading the invitation ---------- */
SP.boot = function () {
  var self = this, t = this.t();
  if (!this.token && this.cfg.endpoint) return this.renderState('noToken');
  this.frame('<div class="adz-loading"><div class="adz-spinner"></div><p class="adz-lead">' + esc(t.ui.loading) + '</p></div>');
  var req = this.cfg.endpoint ? api(this.cfg.endpoint, { action: 'p_load', t: this.token }, 20000)
    : Promise.resolve({ ok: true, state: 'open', lang: this.lang, company: 'Demo Company', firstName: 'Demo', closeDate: '' });
  req.then(function (info) {
    self.info = info;
    self.lang = self.pickLang(info.lang);   // the launch decides the language
    if (info.state !== 'open') { store(self.skey, null); return self.renderState(info.state); }
    var saved = load(self.skey);
    if (saved && (saved.answers || []).some(Boolean)) { self.saved = saved; self.renderResume(); }
    else self.renderIntro();
  }).catch(function (e) {
    if (e && e.code === 'invalid_link') return self.renderState('invalid_link');
    self.frame('<div class="adz-loading"><p class="adz-lead">' + esc(t.ui.errorGeneric) + '</p>' +
      '<button type="button" class="adz-btn" data-act="retry">' + esc(t.ui.retry) + '</button></div>');
    self.root.querySelector('[data-act="retry"]').addEventListener('click', function () { self.boot(); });
  });
};

/* ---------- chrome ---------- */
SP.logo = function () {
  var b = this.cfg.assetsBase;
  return b ? '<img class="adz-logo" alt="Adizes Institute" src="' + esc(b + 'adizes-logo-color.png') + '">' : '<span class="adz-logo-txt">ADIZES</span>';
};
SP.progress = function () {
  var answered = this.state.step, sec = this.sec;
  return '<div class="adz-progress" aria-hidden="true">' + Object.keys(sec).map(function (k) {
    var s = sec[k], f = Math.max(0, Math.min(1, (answered - s.start) / s.len));
    return '<span style="flex:' + s.len + '"><i style="width:' + (f * 100) + '%"></i></span>';
  }).join('') + '</div>';
};
SP.frame = function (inner, opts) {
  opts = opts || {};
  this.root.innerHTML =
    '<div class="adz-stage">' +
      '<div class="adz-top">' + this.logo() + (opts.right || '') + '</div>' +
      (opts.progress ? this.progress() : '') +
      '<div class="adz-body' + (opts.top ? ' is-top' : '') + '"><div class="adz-screen' + (opts.wide ? ' is-wide' : '') + (this.dir < 0 ? ' is-back' : '') + '">' + inner + '</div></div>' +
    '</div>';
  this.scrollTop();
};
SP.scrollTop = function () {
  if (!this.mounted) { this.mounted = true; return; }
  var r = this.el.getBoundingClientRect();
  if (r.top < 0 || r.top > window.innerHeight * 0.4) {
    try { window.scrollTo({ top: window.pageYOffset + r.top - 10, behavior: 'smooth' }); } catch (e) { window.scrollTo(0, window.pageYOffset + r.top - 10); }
  }
};

/* ---------- screens ---------- */
SP.renderState = function (key) {
  var t = this.t(), s = t.states[key] || t.states.invalid_link;
  this.view = 'state';
  this.frame('<div class="adz-msg"><div class="adz-eyebrow">' + esc(t.intro.eyebrow) + '</div>' +
    '<h1 class="adz-h1 adz-h1--sm">' + esc(s.title) + '</h1><p class="adz-lead">' + esc(s.body) + '</p></div>');
};
SP.renderIntro = function () {
  var t = this.t(), v = this.vars(), self = this, i = this.info || {};
  this.view = 'intro';
  this.frame(
    '<div class="adz-eyebrow">' + esc(t.intro.eyebrow) + (v.company ? ' · ' + v.company : '') + '</div>' +
    (v.first && t.intro.hello ? '<p class="adz-hello">' + fill(esc(t.intro.hello), v) + '</p>' : '') +
    '<h1 class="adz-h1">' + fill(esc(t.intro.title), v) + '</h1>' +
    '<p class="adz-lead">' + fill(esc(t.intro.body), v) + '</p>' +
    '<ul class="adz-list">' + t.intro.bullets.map(function (b) { return '<li>' + fill(esc(b), v) + '</li>'; }).join('') + '</ul>' +
    (t.intro.note ? '<p class="adz-note">' + fill(esc(t.intro.note), v) + '</p>' : '') +
    '<div class="adz-actions"><button type="button" class="adz-btn" data-act="start">' + esc(t.ui.start) + ' →</button>' +
    '<span class="adz-hint">' + esc(t.ui.pressEnter) + '</span></div>' +
    '<p class="adz-meta">' + fill(esc(t.intro.meta), v) + (i.closeDate ? ' · ' + fill(esc(t.intro.deadline), v) : '') + '</p>');
  this.root.querySelector('[data-act="start"]').addEventListener('click', function () { self.start(); });
};
SP.start = function () { this.state = this.fresh(); this.dir = 1; this.reviewing = false; this.save(); this.renderStep(); };
SP.renderResume = function () {
  var t = this.t(), self = this;
  this.view = 'resume';
  this.frame(
    '<div class="adz-eyebrow">' + esc(t.intro.eyebrow) + '</div>' +
    '<h1 class="adz-h1 adz-h1--sm">' + esc(t.ui.resume) + '</h1>' +
    '<div class="adz-actions"><button type="button" class="adz-btn" data-act="yes">' + esc(t.ui.resumeYes) + ' →</button>' +
    '<button type="button" class="adz-btn adz-btn--ghost" data-act="no">' + esc(t.ui.resumeNo) + '</button></div>');
  this.root.querySelector('[data-act="yes"]').addEventListener('click', function () {
    self.state = self.saved; var d = self.fresh();
    if (self.spec.importance && !self.state.importance) self.state.importance = d.importance;
    if (self.spec.comments && !self.state.comments) self.state.comments = [];
    if (self.state.step >= self.N) self.renderReview(); else self.renderStep();
  });
  this.root.querySelector('[data-act="no"]').addEventListener('click', function () { store(self.skey, null); self.renderIntro(); });
};

/* ---------- one statement per screen ---------- */
SP.renderStep = function () {
  if (this.state.step >= this.N) return this.renderReview();
  var t = this.t(), self = this, sp = this.spec, q = this.state.step, s = sp.section(q);
  var cur = this.state.answers[q], opts = sp.options(t, q), cannot = sp.cannot(t, q);
  this.view = 'step';
  var imp = '';
  if (sp.importance) {
    var lv = this.state.importance[q], used = this.mostCount(), full = used >= sp.importance.max && lv !== 3;
    imp = '<div class="adz-imp"><div class="adz-imp-h"><b>' + esc(t.ui.importance) + '</b><span class="adz-imp-c' + (used >= sp.importance.max ? ' is-full' : '') + '">' +
      fill(esc(t.ui.mostCount), { n: used, max: sp.importance.max }) + '</span></div>' +
      '<div class="adz-seg" role="radiogroup">' + [1, 2, 3].map(function (k) {
        return '<button type="button" role="radio" data-imp="' + k + '" aria-checked="' + (lv === k) + '"' + (k === 3 && full ? ' disabled title="' + esc(t.ui.mostFull) + '"' : '') + '>' + esc(t.ui.imp[k - 1]) + '</button>';
      }).join('') + '</div>' + (full ? '<p class="adz-imp-note">' + esc(t.ui.mostFull) + '</p>' : '') + '</div>';
  }
  var com = '';
  if (sp.comments) {
    var cv = this.state.comments[q] || '';
    com = '<div class="adz-com">' + (cv || this.openComment === q ? '' : '<button type="button" class="adz-com-btn" data-act="comment">+ ' + esc(t.ui.comment) + '</button>') +
      '<textarea class="adz-com-ta" maxlength="1000" placeholder="' + esc(t.ui.commentPh) + '"' + (cv || this.openComment === q ? '' : ' hidden') + '>' + esc(cv) + '</textarea></div>';
  }
  var canNext = !!cur;
  var navRight = this.reviewing
    ? '<button type="button" class="adz-btn" data-act="toreview"' + (canNext ? '' : ' disabled') + '>' + esc(t.review.back) + ' →</button>'
    : (canNext ? '<button type="button" class="adz-btn' + (sp.autoAdvance && !sp.importance ? ' adz-btn--ghost' : '') + '" data-act="next">' + esc(t.ui.next) + ' →</button>' : '');
  var html =
    '<div class="adz-qhead"><div class="adz-eyebrow">' + esc(t.ui.section) + ' ' + (s.index + 1) + '/' + s.total + ' · ' + esc(t.cells[s.key]) + '</div>' +
    '<span class="adz-count">' + (q + 1) + ' ' + esc(t.ui.of) + ' ' + this.N + '</span></div>' +
    '<h2 class="adz-q">' + esc(sp.text(t, q)) + '</h2>' +
    '<div class="adz-scale" role="radiogroup">' + opts.map(function (o, i) {
      return '<button type="button" role="radio" class="adz-opt" data-v="' + o.value + '" aria-checked="' + (cur === o.value) + '">' +
        '<span class="adz-key">' + (i + 1) + '</span><span class="adz-opt-t"><b>' + esc(o.label) + '</b>' + (o.sub ? '<small>' + esc(o.sub) + '</small>' : '') + '</span></button>';
    }).join('') + '</div>' +
    (cannot ? '<button type="button" class="adz-cannot" data-v="1" aria-pressed="' + (cur === 1) + '">' + esc(cannot) + '</button>' : '') +
    imp + com +
    '<div class="adz-nav">' +
      '<button type="button" class="adz-back" data-act="back"' + (q === 0 || this.reviewing ? ' hidden' : '') + '>← ' + esc(t.ui.back) + '</button>' +
      '<div class="adz-actions adz-actions--tight"><span class="adz-hint adz-hint--keys">' + fill(esc(t.ui.keyboardHint), { n: opts.length }) + '</span>' + navRight + '</div>' +
    '</div>';
  this.frame(html, { progress: true });
  this.root.querySelectorAll('[data-v]').forEach(function (b) { b.addEventListener('click', function () { self.choose(Number(b.getAttribute('data-v')), b); }); });
  this.root.querySelectorAll('[data-imp]').forEach(function (b) { b.addEventListener('click', function () { self.setImportance(Number(b.getAttribute('data-imp'))); }); });
  var cb = this.root.querySelector('[data-act="comment"]');
  if (cb) cb.addEventListener('click', function () { self.openComment = q; cb.remove(); var ta = self.root.querySelector('.adz-com-ta'); ta.hidden = false; ta.focus(); });
  var ta = this.root.querySelector('.adz-com-ta');
  if (ta) ta.addEventListener('input', function () { self.state.comments[q] = ta.value.slice(0, 1000); self.save(); });
  function on(act, fn) { var b = self.root.querySelector('[data-act="' + act + '"]'); if (b) b.addEventListener('click', fn); }
  on('back', function () { self.back(); });
  on('next', function () { self.next(); });
  on('toreview', function () { self.toReview(); });
};
SP.choose = function (v, btn) {
  if (this.busy) return;
  var q = this.state.step;
  this.state.answers[q] = v;
  this.root.querySelectorAll('.adz-opt').forEach(function (b) { b.setAttribute('aria-checked', String(Number(b.getAttribute('data-v')) === v)); });
  var c = this.root.querySelector('.adz-cannot'); if (c) c.setAttribute('aria-pressed', String(v === 1));
  if (btn) { btn.classList.remove('is-pop'); void btn.offsetWidth; btn.classList.add('is-pop'); }
  this.save();
  var self = this;
  if (this.spec.autoAdvance && !this.spec.importance) {
    this.busy = true;
    setTimeout(function () { self.busy = false; if (self.reviewing) self.toReview(); else self.next(); }, 280);
  } else {
    // keep the screen (importance / comment may follow) and just enable Next
    var nr = this.root.querySelector('[data-act="next"],[data-act="toreview"]');
    if (nr) nr.disabled = false; else this.renderStepKeepScroll();
  }
};
SP.renderStepKeepScroll = function () { var y = window.pageYOffset; this.mounted = false; this.renderStep(); window.scrollTo(0, y); };
SP.setImportance = function (k) {
  var q = this.state.step, max = this.spec.importance.max;
  if (k === 3 && this.state.importance[q] !== 3 && this.mostCount() >= max) return;
  this.state.importance[q] = k; this.save(); this.renderStepKeepScroll();
};
SP.next = function () {
  if (this.state.step < this.N && !this.state.answers[this.state.step]) return;
  this.openComment = null;
  this.state.step = Math.min(this.state.step + 1, this.N); this.dir = 1; this.save(); this.renderStep();
};
SP.back = function () {
  if (this.state.step === 0) return;
  this.openComment = null;
  this.state.step--; this.dir = -1; this.save(); this.renderStep();
};
SP.goTo = function (q) { this.reviewing = true; this.openComment = null; this.state.step = q; this.dir = 1; this.save(); this.renderStep(); };
SP.toReview = function () { this.state.step = this.N; this.dir = -1; this.save(); this.renderReview(); };
SP.key = function (e) {
  if (!this.root.isConnected) { document.removeEventListener('keydown', this.onKey); return; }
  var tag = (e.target && e.target.tagName) || '';
  if (tag === 'INPUT' || tag === 'TEXTAREA' || e.metaKey || e.ctrlKey || e.altKey) return;
  if (this.view === 'intro' && e.key === 'Enter') {
    var r = this.el.getBoundingClientRect();
    if (r.top < window.innerHeight && r.bottom > 0) { e.preventDefault(); this.start(); }
    return;
  }
  if (this.view !== 'step') return;
  var opts = this.spec.options(this.t(), this.state.step);
  var k = Number(e.key);
  if (/^[1-9]$/.test(e.key) && opts[k - 1]) { e.preventDefault(); this.choose(opts[k - 1].value, this.root.querySelector('.adz-opt[data-v="' + opts[k - 1].value + '"]')); return; }
  if (e.key === '0' && this.spec.cannot(this.t(), this.state.step)) { e.preventDefault(); this.choose(1, this.root.querySelector('.adz-cannot')); return; }
  if (e.key === 'Enter') { e.preventDefault(); if (this.reviewing) { if (this.state.answers[this.state.step]) this.toReview(); } else this.next(); }
};

/* ---------- review: every answer, click to change ---------- */
SP.answerLabel = function (t, q, v) {
  if (v === 1 && this.spec.cannot(t, q)) return this.spec.cannot(t, q);
  var o = this.spec.options(t, q).filter(function (x) { return x.value === v; })[0];
  return o ? o.label : '';
};
SP.renderReview = function () {
  var t = this.t(), R = t.review, self = this, sp = this.spec, N = this.N;
  this.view = 'review'; this.reviewing = true;
  var missing = [], cannot = 0;
  for (var q = 0; q < N; q++) { var a = this.state.answers[q]; if (!a) missing.push(q); else if (a === 1 && sp.cannot(t, q)) cannot++; }
  var most = this.mostCount(), needMost = sp.importance && most < sp.importance.min;
  var groups = {}, order = [];
  for (var i = 0; i < N; i++) { var s = sp.section(i); if (!groups[s.index]) { groups[s.index] = { s: s, qs: [] }; order.push(s.index); } groups[s.index].qs.push(i); }
  var list = order.map(function (k) {
    var g = groups[k];
    return '<div class="adz-rv-sec"><div class="adz-rv-h">' + (g.s.index + 1) + '. ' + esc(t.cells[g.s.key]) + '</div>' + g.qs.map(function (q) {
      var a = self.state.answers[q], lbl = a ? self.answerLabel(t, q, a) : R.missing;
      var tags = '';
      if (sp.importance && self.state.importance[q] === 3) tags += '<span class="adz-tag is-most">★ ' + esc(t.ui.imp[2]) + '</span>';
      if (sp.comments && (self.state.comments[q] || '').trim()) tags += '<span class="adz-tag">' + esc(R.commented) + '</span>';
      return '<button type="button" class="adz-rv-row' + (a ? '' : ' is-missing') + '" data-q="' + q + '"><span class="adz-rv-n">' + (q + 1) + '</span>' +
        '<span class="adz-rv-t">' + esc(sp.text(t, q)) + (tags ? '<span class="adz-rv-tags">' + tags + '</span>' : '') + '</span>' +
        '<span class="adz-rv-a' + (a === 1 && sp.cannot(t, q) ? ' is-cannot' : '') + '">' + esc(lbl) + '</span></button>';
    }).join('') + '</div>';
  }).join('');
  var ok = !missing.length && !needMost;
  var summary = (missing.length ? fill(esc(R.missingN), { n: missing.length }) : fill(esc(R.body), { n: N })) +
    (cannot ? ' ' + fill(esc(R.cannot), { n: cannot }) : '') +
    (sp.importance ? ' ' + fill(esc(R.most), { n: most, max: sp.importance.max }) : '');
  var actions = function (pos) {
    return '<div class="adz-actions adz-rv-actions"><button type="button" class="adz-btn" data-act="submit"' + (ok ? '' : ' disabled') + '>' + esc(R.submit) + ' →</button>' +
      (pos === 'top' ? '<span class="adz-hint">' + esc(R.hint) + '</span>' : '') + '</div>';
  };
  this.frame(
    '<div class="adz-eyebrow">' + esc(R.eyebrow) + '</div>' +
    '<h1 class="adz-h1 adz-h1--sm">' + esc(R.title) + '</h1>' +
    '<p class="adz-lead">' + summary + '</p>' +
    (needMost ? '<p class="adz-warn">' + fill(esc(R.needMost), { min: sp.importance.min }) + '</p>' : '') +
    (missing.length ? '<p class="adz-warn">' + esc(R.missingHelp) + '</p>' : '') +
    '<p class="adz-note">' + esc(R.warn) + '</p>' + actions('top') +
    '<div class="adz-rv">' + list + '</div>' + actions('bottom'), { progress: true, wide: true, top: true });
  this.root.querySelectorAll('[data-q]').forEach(function (b) { b.addEventListener('click', function () { self.goTo(Number(b.getAttribute('data-q'))); }); });
  this.root.querySelectorAll('[data-act="submit"]').forEach(function (b) { b.addEventListener('click', function () { self.submit(); }); });
};

/* ---------- submit + thanks ---------- */
SP.submit = function () {
  var t = this.t(), self = this;
  this.view = 'sending';
  this.frame('<div class="adz-loading"><div class="adz-spinner"></div><p class="adz-lead">' + esc(t.ui.sending) + '</p></div>');
  var started = Date.now();
  var payload = { action: 'p_submit', v: this.cfg.version, t: this.token, lang: this.lang, answers: this.state.answers.slice(0, this.N) };
  if (this.spec.payload) { var extra = this.spec.payload(this.state); for (var k in extra) payload[k] = extra[k]; }
  api(this.cfg.endpoint, payload, 30000).then(function () {
    setTimeout(function () { store(self.skey, null); self.renderThanks(); }, Math.max(0, 900 - (Date.now() - started)));
  }).catch(function (e) {
    if (e && (e.code === 'already_completed' || e.code === 'closed' || e.code === 'invalid_link')) { store(self.skey, null); return self.renderState(e.code === 'already_completed' ? 'completed' : e.code); }
    self.frame('<div class="adz-loading"><p class="adz-lead">' + esc(t.ui.errorGeneric) + '</p>' +
      '<button type="button" class="adz-btn" data-act="retry">' + esc(t.ui.retry) + '</button></div>');
    self.root.querySelector('[data-act="retry"]').addEventListener('click', function () { self.submit(); });
  });
};
SP.renderThanks = function () {
  var t = this.t(), v = this.vars();
  this.view = 'thanks';
  this.frame('<div class="adz-msg adz-msg--done"><div class="adz-check" aria-hidden="true"></div>' +
    '<h1 class="adz-h1 adz-h1--sm">' + fill(esc(t.thanks.title), v).replace(/,\s*$/, '') + '</h1>' +
    '<p class="adz-lead">' + fill(esc(t.thanks.body), v) + '</p></div>');
};

function bootSurvey(configVar, defaults, spec, globalName) {
  function go() {
    var cfg = {}, user = window[configVar] || {};
    for (var k in defaults) cfg[k] = defaults[k];
    for (var k2 in user) cfg[k2] = user[k2];
    if (!cfg.assetsBase) cfg.assetsBase = detectAssets();
    var el = typeof cfg.mount === 'string' ? document.querySelector(cfg.mount) : cfg.mount;
    if (!el) { if (window.console) console.error('[' + globalName + '] mount element not found: ' + cfg.mount); return; }
    if (!el.id) el.id = String(cfg.mount).replace(/^#/, '') || 'adz-survey';
    injectStyle('adz-style-' + el.id, cfg.css, '#' + el.id);
    if (cfg.loadFont) loadFontCss();
    window[globalName] = { app: new Survey(el, cfg, spec), version: cfg.version };
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', go); else go();
}
