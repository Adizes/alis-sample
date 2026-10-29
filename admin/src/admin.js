/* Adizes Admin — single-page app served by Apps Script (HtmlService).
 * Talks to the server only through google.script.run.adminApi(action, payload, sessionToken) → JSON string.
 * Bundled with: both tests' i18n, shared/core.js, ed-engine.js, es-engine.js, pdfkit.js, ed-report.js, es-report.js.
 */
var CFG = window.ADM_CONFIG || {};
var S = null;          // last state from the server
var APP = document.getElementById('app');
var MODAL = document.getElementById('modal-root');
var SKEY = 'adz-admin-session';
var TOKEN = (CFG.autoSession && CFG.autoSession.indexOf('__') !== 0) ? CFG.autoSession : (function () { try { return localStorage.getItem(SKEY) || ''; } catch (e) { return ''; } })();
function saveToken(t) { TOKEN = t || ''; try { if (t) localStorage.setItem(SKEY, t); else localStorage.removeItem(SKEY); } catch (e) {} }
if (TOKEN) saveToken(TOKEN);

var ST = { Draft: 'Draft', Open: 'Open', Ready: 'Ready', 'Report sent': 'Report sent', Closed: 'Closed' };
var IST = { Pending: 'Not sent', Sent: 'Invited', Completed: 'Answered' };
var TYPES = { ED: 'Express Diagnostics', ES: 'Engagement Survey' };
var TYPE_INFO = {
  ED: '67 statements · group report with participants’ names · minimum 1 response',
  ES: '50 questions · anonymous · minimum 5 responses · results by area',
};
var LANGS = { en: 'English', es: 'Español' };
var ERR = {
  forbidden: 'Your session has expired. Please sign in again.', invalid_code: 'That code isn’t valid or has expired.', too_many_attempts: 'Too many attempts. Request a new code.',
  name_required: 'The name is required.', invalid_email: 'Please check the email address.', duplicate_email: 'There is already an employee with that email in this company.',
  invalid_recipients: 'Please check the recipients’ emails.', invalid_date: 'Please check the date.', below_minimum: 'The minimum number of responses hasn’t been reached yet.',
  no_participants: 'Add at least one participant.', not_draft: 'This launch is no longer a draft.', not_open: 'This launch isn’t open.',
  no_report: 'Generate the report first.', no_recipients: 'Add at least one recipient.', only_drafts: 'Only drafts can be deleted.', not_ready: 'Open the launch first.',
  launch_not_editable: 'Participants can’t be changed in this launch anymore.', company_not_found: 'Company not found.', not_found: 'Record not found.',
  not_setup: 'Run setup() in Apps Script first.', not_reopenable: 'This launch can’t be reopened.', invalid_type: 'Invalid test type.',
};

/* ------------------------------------------------------------------ server */
function call(action, payload) {
  return new Promise(function (resolve, reject) {
    if (!window.google || !google.script || !google.script.run) return reject(new Error('Not connected to Apps Script'));
    google.script.run
      .withSuccessHandler(function (txt) {
        var r; try { r = JSON.parse(txt); } catch (e) { return reject(new Error('Invalid response')); }
        if (!r.ok) {
          var e2 = new Error(ERR[r.error] || r.error || 'Error'); e2.code = r.error;
          if (r.error === 'forbidden') { saveToken(''); S = null; renderLogin(); }
          return reject(e2);
        }
        resolve(r);
      })
      .withFailureHandler(function (e) { reject(new Error((e && e.message) || 'Connection error')); })
      .adminApi(action, payload || {}, TOKEN);
  });
}
var busyEl = null;
function busy(on) {
  if (on && !busyEl) { busyEl = document.createElement('div'); busyEl.className = 'busy'; busyEl.innerHTML = '<div class="adm-spinner"></div>'; document.body.appendChild(busyEl); }
  if (!on && busyEl) { busyEl.remove(); busyEl = null; }
}
// Mutating call: shows a spinner, refreshes the state and re-renders.
function run(action, payload, okMsg) {
  busy(true);
  return call(action, payload).then(function (r) {
    if (r.companies) S = r;
    busy(false); render();
    if (okMsg) toast(typeof okMsg === 'function' ? okMsg(r) : okMsg);
    return r;
  }, function (e) { busy(false); if (e.code !== 'forbidden') toast(e.message, true); throw e; });
}
var toastT = null;
function toast(msg, isErr) {
  var el = document.getElementById('toast');
  el.textContent = msg; el.className = 'adm-toast is-on' + (isErr ? ' is-err' : '');
  clearTimeout(toastT); toastT = setTimeout(function () { el.className = 'adm-toast' + (isErr ? ' is-err' : ''); }, isErr ? 5000 : 2600);
}

/* ------------------------------------------------------------------ helpers */
function h(s) { return esc(s); }
function byId(list, id) { for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i]; return null; }
function company(id) { return byId(S.companies, id) || { name: '—' }; }
function launchesOf(cid) { return S.launches.filter(function (l) { return l.companyId === cid; }); }
function employeesOf(cid, all) { return S.employees.filter(function (e) { return e.companyId === cid && (all || e.status !== 'Archived'); }); }
function invitesOf(lid) { return S.invites.filter(function (i) { return i.launchId === lid; }); }
function chip(status, map) { return '<span class="chip chip-' + String(status).replace(/\s/g, '') + '">' + h((map || ST)[status] || status) + '</span>'; }
function typeTag(t) { return '<span class="type type-' + t + '" title="' + h(TYPES[t]) + '">' + t + '</span>'; }
function fdate(iso, withTime) {
  if (!iso) return '';
  var d = new Date(String(iso).length === 10 ? iso + 'T12:00:00' : iso);
  if (isNaN(d)) return String(iso);
  var o = { day: 'numeric', month: 'short', year: 'numeric' };
  if (withTime) { o.hour = 'numeric'; o.minute = '2-digit'; }
  return d.toLocaleDateString('en-US', o);
}
function progress(l) {
  var pct = l.total ? Math.round(l.done / l.total * 100) : 0, minPct = l.total ? Math.min(100, l.minResponses / l.total * 100) : 0;
  return '<div class="prog"><div class="prog-bar' + (l.done >= l.minResponses ? ' is-ok' : '') + '"><i style="width:' + pct + '%"></i>' +
    (l.minResponses > 1 && minPct < 100 ? '<b style="left:' + minPct + '%" title="Minimum"></b>' : '') + '</div><span>' + l.done + ' of ' + l.total + '</span></div>';
}
function go(hash) { if (location.hash === hash) render(); else location.hash = hash; }
function copyText(text, label) {
  function fallback() {
    var ta = document.createElement('textarea'); ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select(); var ok = false; try { ok = document.execCommand('copy'); } catch (e) {} ta.remove();
    return ok;
  }
  var p = (navigator.clipboard && navigator.clipboard.writeText) ? navigator.clipboard.writeText(text).then(function () { return true; }, fallback) : Promise.resolve(fallback());
  return p.then(function (ok) {
    if (ok) toast(label || 'Copied');
    else modal({ title: 'Copy this text', body: '<textarea class="textarea linkbox" rows="8" readonly>' + h(text) + '</textarea>', ok: null });
  });
}

/* ------------------------------------------------------------------ modal + form helpers */
function modal(o) {
  MODAL.innerHTML = '<div class="modal-bg"><div class="modal' + (o.wide ? ' is-wide' : '') + '" role="dialog" aria-modal="true">' +
    '<div class="modal-h"><h3>' + h(o.title) + '</h3><button type="button" class="x" data-x aria-label="Close">×</button></div>' +
    '<form class="modal-form" novalidate><div class="modal-b">' + o.body + '<div class="err" data-err></div></div>' +
    '<div class="modal-f"><button type="button" class="btn btn-ghost" data-x>' + (o.ok === null ? 'Close' : 'Cancel') + '</button>' +
    (o.ok === null ? '' : '<button type="submit" class="btn ' + (o.danger ? 'btn-red' : 'btn-dark') + '">' + h(o.ok || 'Save') + '</button>') + '</div></form></div></div>';
  var bg = MODAL.firstChild, form = MODAL.querySelector('form');
  function close() { MODAL.innerHTML = ''; document.removeEventListener('keydown', onEsc); }
  function onEsc(e) { if (e.key === 'Escape') close(); }
  document.addEventListener('keydown', onEsc);
  MODAL.querySelectorAll('[data-x]').forEach(function (b) { b.addEventListener('click', close); });
  bg.addEventListener('mousedown', function (e) { if (e.target === bg) close(); });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var err = form.querySelector('[data-err]'); err.textContent = '';
    var res = o.onOk && o.onOk(form, close);
    if (res && res.then) res.then(function () { close(); }, function (ex) { err.textContent = ex.message; });
    else if (typeof res === 'string') err.textContent = res;
    else if (res !== false) close();
  });
  if (o.onOpen) o.onOpen(form);
  var first = form.querySelector('input:not([type=checkbox]):not([type=radio]):not([type=search]),textarea,select'); if (first) first.focus();
  return form;
}
function confirmBox(title, html, okLabel, fn, danger) {
  modal({ title: title, body: '<p class="lead-p">' + html + '</p>', ok: okLabel, danger: danger, onOk: function () { return fn(); } });
}
// field(label, control, hint, cls) — hints sit under their own control and never stretch the row
function field(label, inner, hint, cls) { return '<div class="field' + (cls ? ' ' + cls : '') + '"><label>' + h(label) + '</label>' + inner + (hint ? '<div class="hint">' + h(hint) + '</div>' : '') + '</div>'; }
function grid(cols, inner) { return '<div class="fgrid fgrid-' + cols + '">' + inner + '</div>'; }
function inp(name, val, type, ph, extra) { return '<input class="input" name="' + name + '" type="' + (type || 'text') + '" value="' + h(val == null ? '' : val) + '"' + (ph ? ' placeholder="' + h(ph) + '"' : '') + (extra || '') + '>'; }
function sel(name, val, opts, extra) { return '<select class="select" name="' + name + '"' + (extra || '') + '>' + Object.keys(opts).map(function (k) { return '<option value="' + h(k) + '"' + (k === val ? ' selected' : '') + '>' + h(opts[k]) + '</option>'; }).join('') + '</select>'; }
function vals(form) { var o = {}; Array.prototype.forEach.call(form.elements, function (el) { if (!el.name) return; if (el.type === 'radio') { if (el.checked) o[el.name] = el.value; } else if (el.type === 'checkbox') { if (el.name !== 'emp') o[el.name] = el.checked; } else o[el.name] = el.value.trim(); }); return o; }

/* ------------------------------------------------------------------ sign in */
function renderLogin(step, email) {
  MODAL.innerHTML = '';
  var logo = '<img class="login-logo" alt="Adizes" src="' + h(CFG.assetsBase + 'adizes-logo-color.png') + '">';
  if (step !== 'code') {
    APP.innerHTML = '<div class="login"><form class="card login-card" novalidate>' + logo +
      '<h1>Admin sign-in</h1><p class="muted">Enter your work email. If it’s authorized, we’ll send you a 6-digit code.</p>' +
      field('Email', inp('email', email || '', 'email', 'you@company.com', ' autocomplete="email" inputmode="email"')) +
      '<div class="err" data-err></div><button type="submit" class="btn btn-red btn-block">Send code</button></form></div>';
    var f = APP.querySelector('form');
    f.email.focus();
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var em = f.email.value.trim().toLowerCase();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(em)) { f.querySelector('[data-err]').textContent = ERR.invalid_email; return; }
      busy(true);
      call('loginStart', { email: em }).then(function () { busy(false); renderLogin('code', em); }, function (ex) { busy(false); f.querySelector('[data-err]').textContent = ex.message; });
    });
    return;
  }
  APP.innerHTML = '<div class="login"><form class="card login-card" novalidate>' + logo +
    '<h1>Check your email</h1><p class="muted">If <b>' + h(email) + '</b> is authorized, a code is on its way from info@adizes.com. It expires in 10 minutes.</p>' +
    field('6-digit code', inp('code', '', 'text', '123456', ' autocomplete="one-time-code" inputmode="numeric" maxlength="6"')) +
    '<div class="err" data-err></div><button type="submit" class="btn btn-red btn-block">Sign in</button>' +
    '<button type="button" class="btn btn-ghost btn-block" data-act="back">Use another email</button></form></div>';
  var f2 = APP.querySelector('form');
  f2.code.focus();
  f2.querySelector('[data-act="back"]').addEventListener('click', function () { renderLogin('email', email); });
  f2.addEventListener('submit', function (e) {
    e.preventDefault();
    busy(true);
    call('loginVerify', { email: email, code: f2.code.value }).then(function (r) {
      saveToken(r.token); return call('state');
    }).then(function (r) { busy(false); S = r; if (!location.hash) location.hash = '#/'; render(); }, function (ex) { busy(false); f2.querySelector('[data-err]').textContent = ex.message; });
  });
}
function signOut() { saveToken(''); S = null; location.hash = ''; renderLogin(); }

/* ------------------------------------------------------------------ layout */
function shell(active, inner) {
  return '<header class="adm-top"><div class="adm-top-in">' +
    '<a class="adm-brand" href="#/"><img class="adm-logo" alt="Adizes" src="' + h(CFG.assetsBase + 'adizes-logo-color.png') + '"><span>Admin</span></a>' +
    '<nav class="adm-nav"><a href="#/" class="' + (active === 'companies' ? 'is-on' : '') + '">Companies</a>' +
    '<a href="#/launches" class="' + (active === 'launches' ? 'is-on' : '') + '">Launches</a></nav>' +
    '<div class="adm-me" title="' + h(S.me) + '">' + h(S.me) + '</div><button class="btn btn-ghost btn-sm" data-signout>Sign out</button></div></header>' +
    '<main class="adm-main">' + inner + '</main>';
}
var UI = { showArchived: false, q: '', lq: '', lstatus: 'active', ltype: '' };

function render() {
  if (!S) return;
  var parts = location.hash.replace(/^#\/?/, '').split('/');
  var view = parts[0] || '', id = parts[1];
  if (view === 'company' && byId(S.companies, id)) renderCompany(id);
  else if (view === 'launch' && byId(S.launches, id)) renderLaunch(id);
  else if (view === 'launches') renderLaunches();
  else renderCompanies();
  var so = APP.querySelector('[data-signout]'); if (so) so.addEventListener('click', signOut);
}
window.addEventListener('hashchange', function () { MODAL.innerHTML = ''; render(); window.scrollTo(0, 0); });

/* ------------------------------------------------------------------ companies */
function renderCompanies() {
  var q = UI.q.toLowerCase();
  var list = S.companies.filter(function (c) { return (UI.showArchived || c.status !== 'Archived') && (!q || c.name.toLowerCase().indexOf(q) >= 0 || String(c.country || '').toLowerCase().indexOf(q) >= 0); })
    .sort(function (a, b) { return a.name.localeCompare(b.name); });
  var cards = list.map(function (c) {
    var ls = launchesOf(c.id);
    var by = function (t) { return ls.filter(function (l) { return l.type === t; }).length; };
    var open = ls.filter(function (l) { return l.status === 'Open'; }).length, ready = ls.filter(function (l) { return l.status === 'Ready'; }).length;
    return '<a class="card co-card" href="#/company/' + h(c.id) + '"><h3>' + h(c.name) + '</h3><div class="muted small">' + h(c.country || '') + (c.contactName ? ' · ' + h(c.contactName) : '') + '</div>' +
      '<div class="co-meta"><span><b>' + employeesOf(c.id).length + '</b> employees</span><span>' + typeTag('ED') + ' <b>' + by('ED') + '</b></span><span>' + typeTag('ES') + ' <b>' + by('ES') + '</b></span>' +
      (open ? '<span>' + chip('Open') + ' ' + open + '</span>' : '') + (ready ? '<span>' + chip('Ready') + ' ' + ready + '</span>' : '') +
      (c.status === 'Archived' ? chip('Archived', { Archived: 'Archived' }) : '') + '</div></a>';
  }).join('');
  APP.innerHTML = shell('companies',
    '<div class="adm-head"><div><div class="adm-eyebrow">Adizes Assessments</div><h1 class="adm-h1">Companies</h1></div>' +
    '<div class="adm-btns"><button class="btn btn-red" data-act="new-company">+ New company</button></div></div>' +
    '<div class="toolbar"><input class="input" type="search" placeholder="Search companies…" value="' + h(UI.q) + '" data-q>' +
    '<label class="chk"><input type="checkbox" data-arch' + (UI.showArchived ? ' checked' : '') + '> Show archived</label></div>' +
    (cards ? '<div class="grid">' + cards + '</div>' : '<div class="card empty"><b>' + (S.companies.length ? 'No results' : 'No companies yet') + '</b>' + (S.companies.length ? '' : 'Create the first one, add its employees and launch a test.') + '</div>'));
  APP.querySelector('[data-act="new-company"]').addEventListener('click', function () { companyForm(); });
  var qEl = APP.querySelector('[data-q]');
  qEl.addEventListener('input', function () { UI.q = qEl.value; render(); var n = APP.querySelector('[data-q]'); n.focus(); n.setSelectionRange(n.value.length, n.value.length); });
  APP.querySelector('[data-arch]').addEventListener('change', function (e) { UI.showArchived = e.target.checked; render(); });
}
function companyForm(c) {
  c = c || {};
  modal({
    title: c.id ? 'Edit company' : 'New company', ok: c.id ? 'Save changes' : 'Create company',
    body: field('Company name', inp('name', c.name, 'text', 'e.g. Grupo Ñandú')) +
      grid('2', field('Country', inp('country', c.country, 'text', 'e.g. Mexico')) + field('Default language for tests', sel('language', c.language || 'en', LANGS))) +
      grid('2', field('Contact name', inp('contactName', c.contactName, 'text', 'Who receives the report')) + field('Contact email', inp('contactEmail', c.contactEmail, 'email', 'name@company.com'))) +
      '<p class="hint hint-row">The contact email is suggested as the report recipient for new launches.</p>' +
      field('Notes', '<textarea class="textarea" name="notes" rows="3" placeholder="Internal notes (optional)">' + h(c.notes || '') + '</textarea>'),
    onOk: function (form) {
      var v = vals(form); v.id = c.id;
      if (!v.name) return ERR.name_required;
      return run('saveCompany', v, c.id ? 'Company updated' : 'Company created').then(function (r) {
        if (!c.id) { var nw = r.companies.filter(function (x) { return x.name === v.name; }).pop(); if (nw) go('#/company/' + nw.id); }
      });
    },
  });
}

/* ------------------------------------------------------------------ company */
function launchRows(ls) {
  return ls.map(function (l) {
    return '<tr class="is-click" data-go="#/launch/' + h(l.id) + '"><td class="strong">' + h(l.name) + '</td><td>' + chip(l.status) + '</td>' +
      '<td data-l="Progress">' + progress(l) + '</td><td class="nowrap muted small" data-l="Closes">' + h(fdate(l.closeDate) || '—') + '</td><td class="muted small" data-l="Language">' + h(LANGS[l.language] || l.language) + '</td></tr>';
  }).join('');
}
function renderCompany(cid) {
  var c = company(cid), ls = launchesOf(cid).sort(function (a, b) { return String(b.createdAt).localeCompare(String(a.createdAt)); });
  var emps = employeesOf(cid, UI.showArchived).sort(function (a, b) { return a.name.localeCompare(b.name); });
  var testSecs = ['ED', 'ES'].map(function (t) {
    var mine = ls.filter(function (l) { return l.type === t; });
    return '<div class="card tsec"><div class="tsec-h"><div>' + typeTag(t) + ' <b>' + TYPES[t] + '</b> <span class="muted small">' + mine.length + '</span></div>' +
      '<button class="btn btn-line btn-sm" data-new-launch="' + t + '">+ New ' + h(TYPES[t]) + '</button></div>' +
      (mine.length ? '<table class="tbl"><thead><tr><th>Name</th><th>Status</th><th>Progress</th><th>Closes</th><th>Language</th></tr></thead><tbody>' + launchRows(mine) + '</tbody></table>'
        : '<div class="empty empty-sm">No ' + h(TYPES[t]) + ' launches yet.</div>') + '</div>';
  }).join('');
  var eRows = emps.map(function (e) {
    var n = S.invites.filter(function (i) { return i.employeeId === e.id; }).length;
    return '<tr><td class="strong">' + h(e.name) + (e.status === 'Archived' ? ' ' + chip('Archived', { Archived: 'Archived' }) : '') + '</td><td data-l="Email">' + h(e.email) + '</td>' +
      '<td data-l="Area">' + h(e.area || '—') + '</td><td data-l="Position">' + h(e.position || '—') + '</td><td class="num muted small" data-l="Launches">' + n + '</td>' +
      '<td class="act"><button class="btn btn-ghost btn-sm" data-edit-emp="' + h(e.id) + '">Edit</button>' +
      '<button class="btn btn-ghost btn-sm" data-arch-emp="' + h(e.id) + '">' + (e.status === 'Archived' ? 'Restore' : 'Archive') + '</button></td></tr>';
  }).join('');
  var areas = {}; employeesOf(cid).forEach(function (e) { if (e.area) areas[e.area] = (areas[e.area] || 0) + 1; });
  var areaChips = Object.keys(areas).sort().map(function (a) { return '<span class="pill">' + h(a) + ' <b>' + areas[a] + '</b></span>'; }).join('');
  APP.innerHTML = shell('companies',
    '<div class="adm-crumbs"><a href="#/">Companies</a> ›</div>' +
    '<div class="adm-head"><div><h1 class="adm-h1">' + h(c.name) + (c.status === 'Archived' ? ' ' + chip('Archived', { Archived: 'Archived' }) : '') + '</h1>' +
    '<div class="adm-sub">' + [c.country, LANGS[c.language], c.contactName && (c.contactName + (c.contactEmail ? ' · ' + c.contactEmail : ''))].filter(Boolean).map(h).join(' · ') + '</div></div>' +
    '<div class="adm-btns"><button class="btn btn-line" data-act="edit">Edit</button><button class="btn btn-ghost" data-act="archive">' + (c.status === 'Archived' ? 'Restore' : 'Archive') + '</button></div></div>' +
    '<section class="adm-sec"><div class="adm-sec-h"><h2 class="adm-h2">Launches</h2></div><div class="tsecs">' + testSecs + '</div></section>' +
    '<section class="adm-sec"><div class="adm-sec-h"><h2 class="adm-h2">Employees <span class="muted">(' + employeesOf(cid).length + ')</span></h2>' +
    '<div class="adm-btns"><label class="chk"><input type="checkbox" data-arch' + (UI.showArchived ? ' checked' : '') + '> Show archived</label>' +
    '<button class="btn btn-line" data-act="import">Import list</button><button class="btn btn-dark" data-act="new-emp">+ Add employee</button></div></div>' +
    (areaChips ? '<div class="pills"><span class="muted small">Areas:</span> ' + areaChips + '</div>' : '') +
    '<div class="card">' + (eRows ? '<table class="tbl"><thead><tr><th>Name</th><th>Email</th><th>Area</th><th>Position</th><th class="num">Launches</th><th></th></tr></thead><tbody>' + eRows + '</tbody></table>'
      : '<div class="empty"><b>No employees yet</b>Add them one by one or paste a list from Excel.</div>') + '</div></section>');
  APP.querySelector('[data-act="edit"]').addEventListener('click', function () { companyForm(c); });
  APP.querySelector('[data-act="archive"]').addEventListener('click', function () { run('archiveCompany', { id: cid, archived: c.status !== 'Archived' }, c.status === 'Archived' ? 'Company restored' : 'Company archived'); });
  APP.querySelectorAll('[data-new-launch]').forEach(function (b) { b.addEventListener('click', function () { launchForm(cid, null, b.getAttribute('data-new-launch')); }); });
  APP.querySelector('[data-act="new-emp"]').addEventListener('click', function () { employeeForm(cid); });
  APP.querySelector('[data-act="import"]').addEventListener('click', function () { importForm(cid); });
  APP.querySelector('[data-arch]').addEventListener('change', function (e) { UI.showArchived = e.target.checked; render(); });
  APP.querySelectorAll('[data-go]').forEach(function (tr) { tr.addEventListener('click', function () { go(tr.getAttribute('data-go')); }); });
  APP.querySelectorAll('[data-edit-emp]').forEach(function (b) { b.addEventListener('click', function () { employeeForm(cid, byId(S.employees, b.getAttribute('data-edit-emp'))); }); });
  APP.querySelectorAll('[data-arch-emp]').forEach(function (b) {
    b.addEventListener('click', function () { var e = byId(S.employees, b.getAttribute('data-arch-emp')); run('archiveEmployee', { id: e.id, archived: e.status !== 'Archived' }, e.status === 'Archived' ? 'Employee restored' : 'Employee archived'); });
  });
}
function areasList(cid) {
  var seen = {}; employeesOf(cid, true).forEach(function (e) { if (e.area) seen[e.area] = 1; });
  return '<datalist id="areas">' + Object.keys(seen).sort().map(function (a) { return '<option value="' + h(a) + '">'; }).join('') + '</datalist>';
}
function employeeForm(cid, e) {
  e = e || {};
  modal({
    title: e.id ? 'Edit employee' : 'Add employee', ok: e.id ? 'Save changes' : 'Add employee',
    body: grid('2', field('Full name', inp('name', e.name, 'text', 'e.g. Ana López')) + field('Email', inp('email', e.email, 'email', 'name@company.com'))) +
      grid('2', field('Area / division', '<input class="input" name="area" list="areas" value="' + h(e.area || '') + '" placeholder="e.g. Sales">') + field('Position', inp('position', e.position, 'text', 'e.g. Sales manager'))) +
      '<p class="hint hint-row">The area is used for the Engagement Survey results by area (an area is only shown with 5 or more answers). Pick an existing one to keep names consistent.</p>' + areasList(cid),
    onOk: function (form) { var v = vals(form); v.id = e.id; v.companyId = cid; return run('saveEmployee', v, e.id ? 'Employee updated' : 'Employee added'); },
  });
}
// Accepts rows pasted from Excel/Sheets (tabs) or typed with commas: Name, email, area, position
function parseRows(text) {
  return String(text || '').split(/\r?\n/).map(function (line) {
    var cells = line.indexOf('\t') >= 0 ? line.split('\t') : line.split(/[,;]/);
    cells = cells.map(function (c) { return c.trim(); });
    var ei = -1; cells.forEach(function (c, i) { if (ei < 0 && /@/.test(c)) ei = i; });
    if (ei < 0) return null;
    var rest = cells.filter(function (c, i) { return i !== ei; });
    return { name: rest[0] || '', email: cells[ei], area: rest[1] || '', position: rest[2] || '' };
  }).filter(function (r) { return r && r.name; });
}
function importForm(cid) {
  modal({
    title: 'Import employees', ok: 'Import', wide: true,
    body: '<p class="lead-p">Paste one row per person, copied from Excel/Google Sheets or separated by commas, in this order: <b>Name, email, area, position</b>. Emails that already exist in this company are skipped.</p>' +
      '<textarea class="textarea linkbox" name="rows" rows="10" placeholder="Ana López, ana@company.com, Sales, Director&#10;Bruno Díaz, bruno@company.com, Operations, Manager"></textarea><p class="small muted" data-count style="margin-top:8px"></p>',
    onOpen: function (form) {
      var ta = form.rows, out = form.querySelector('[data-count]');
      ta.addEventListener('input', function () { var n = parseRows(ta.value).length; out.textContent = n ? n + ' row(s) recognized' : ''; });
    },
    onOk: function (form) {
      var rows = parseRows(form.rows.value);
      if (!rows.length) return 'No rows recognized (each row needs a name and an email).';
      return run('importEmployees', { companyId: cid, rows: rows }, function (r) { return r.imported + ' employee(s) imported'; });
    },
  });
}

/* ------------------------------------------------------------------ launches list */
function renderLaunches() {
  var q = UI.lq.toLowerCase();
  function match(l, ignoreType) {
    if (!ignoreType && UI.ltype && l.type !== UI.ltype) return false;
    if (UI.lstatus === 'active' && (l.status === 'Closed' || l.status === 'Report sent')) return false;
    if (UI.lstatus !== 'active' && UI.lstatus !== 'all' && l.status !== UI.lstatus) return false;
    return !q || l.name.toLowerCase().indexOf(q) >= 0 || company(l.companyId).name.toLowerCase().indexOf(q) >= 0;
  }
  var list = S.launches.filter(function (l) { return match(l); }).sort(function (a, b) { return String(b.createdAt).localeCompare(String(a.createdAt)); });
  var count = function (t) { return S.launches.filter(function (l) { return match(l, true) && (!t || l.type === t); }).length; };
  var tabs = [['', 'All'], ['ED', TYPES.ED], ['ES', TYPES.ES]].map(function (x) {
    return '<button class="tab' + (UI.ltype === x[0] ? ' is-on' : '') + '" data-ty="' + x[0] + '">' + (x[0] ? typeTag(x[0]) + ' ' : '') + h(x[1]) + ' <span class="tab-n">' + count(x[0]) + '</span></button>';
  }).join('');
  var rows = list.map(function (l) {
    return '<tr class="is-click" data-go="#/launch/' + h(l.id) + '"><td class="strong">' + h(company(l.companyId).name) + '</td><td>' + typeTag(l.type) + ' ' + h(l.name) + '</td>' +
      '<td>' + chip(l.status) + '</td><td data-l="Progress">' + progress(l) + '</td><td class="nowrap muted small" data-l="Closes">' + h(fdate(l.closeDate) || '—') + '</td></tr>';
  }).join('');
  var stOpts = { active: 'In progress', all: 'All statuses', Draft: 'Draft', Open: 'Open', Ready: 'Ready', 'Report sent': 'Report sent', Closed: 'Closed' };
  APP.innerHTML = shell('launches',
    '<div class="adm-head"><div><div class="adm-eyebrow">Adizes Assessments</div><h1 class="adm-h1">Launches</h1></div></div>' +
    '<div class="tabs">' + tabs + '</div>' +
    '<div class="toolbar"><input class="input" type="search" placeholder="Search by company or name…" value="' + h(UI.lq) + '" data-q>' + sel('st', UI.lstatus, stOpts, ' data-st') + '</div>' +
    '<div class="card">' + (rows ? '<table class="tbl"><thead><tr><th>Company</th><th>Launch</th><th>Status</th><th>Progress</th><th>Closes</th></tr></thead><tbody>' + rows + '</tbody></table>'
      : '<div class="empty"><b>No launches here</b>Launches are created from each company’s page.</div>') + '</div>');
  var qEl = APP.querySelector('[data-q]');
  qEl.addEventListener('input', function () { UI.lq = qEl.value; render(); var n = APP.querySelector('[data-q]'); n.focus(); n.setSelectionRange(n.value.length, n.value.length); });
  APP.querySelector('[data-st]').addEventListener('change', function (e) { UI.lstatus = e.target.value; render(); });
  APP.querySelectorAll('[data-ty]').forEach(function (b) { b.addEventListener('click', function () { UI.ltype = b.getAttribute('data-ty'); render(); }); });
  APP.querySelectorAll('[data-go]').forEach(function (tr) { tr.addEventListener('click', function () { go(tr.getAttribute('data-go')); }); });
}

/* ------------------------------------------------------------------ launch form */
function pickerHtml(cid, selected, locked) {
  var emps = employeesOf(cid).sort(function (a, b) { return (a.area || '').localeCompare(b.area || '') || a.name.localeCompare(b.name); });
  if (!emps.length) return '<div class="notice is-info">This company has no employees yet. Add them first.</div>';
  var areas = {}; emps.forEach(function (e) { areas[e.area || '—'] = 1; });
  return '<div class="pick-tools"><input class="input" type="search" placeholder="Filter by name, email or area…" data-pf>' +
    '<div class="adm-btns"><button type="button" class="btn btn-line btn-sm" data-all>Select all</button><button type="button" class="btn btn-ghost btn-sm" data-none>None</button>' +
    '<span class="small muted" data-pc></span></div></div><div class="pick">' + emps.map(function (e) {
      var on = selected[e.id], lock = locked[e.id];
      return '<label data-txt="' + h((e.name + ' ' + e.email + ' ' + (e.area || '')).toLowerCase()) + '"><input type="checkbox" name="emp" value="' + h(e.id) + '"' + (on ? ' checked' : '') + (lock ? ' disabled' : '') + '>' +
        '<span class="pick-n"><b>' + h(e.name) + '</b><span class="small muted">' + h(e.email) + '</span></span><span class="pick-a">' + h(e.area || '—') + (lock ? '<br><span class="small">Answered</span>' : '') + '</span></label>';
    }).join('') + '</div>';
}
function bindPicker(form) {
  var boxes = form.querySelectorAll('input[name="emp"]'), pc = form.querySelector('[data-pc]');
  function count() { if (pc) pc.textContent = Array.prototype.filter.call(boxes, function (b) { return b.checked; }).length + ' of ' + boxes.length + ' selected'; }
  boxes.forEach(function (b) { b.addEventListener('change', count); });
  var pf = form.querySelector('[data-pf]');
  if (pf) pf.addEventListener('input', function () { var q = pf.value.toLowerCase(); form.querySelectorAll('.pick label').forEach(function (l) { l.hidden = q && l.getAttribute('data-txt').indexOf(q) < 0; }); });
  var all = form.querySelector('[data-all]'), none = form.querySelector('[data-none]');
  if (all) all.addEventListener('click', function () { boxes.forEach(function (b) { if (!b.closest('label').hidden && !b.disabled) b.checked = true; }); count(); });
  if (none) none.addEventListener('click', function () { boxes.forEach(function (b) { if (!b.disabled) b.checked = false; }); count(); });
  count();
}
function picked(form) { return Array.prototype.filter.call(form.querySelectorAll('input[name="emp"]'), function (b) { return b.checked; }).map(function (b) { return b.value; }); }

function launchForm(cid, l, type) {
  var c = company(cid), isNew = !l;
  l = l || { type: type || 'ED', language: c.language || 'en', recipients: c.contactEmail || '' };
  var sel0 = {}; if (isNew) employeesOf(cid).forEach(function (e) { sel0[e.id] = true; });
  var typeHtml = isNew ? field('Test', '<div class="types">' + ['ED', 'ES'].map(function (t) {
    return '<label><input type="radio" name="type" value="' + t + '"' + (l.type === t ? ' checked' : '') + '><span><b>' + typeTag(t) + ' ' + TYPES[t] + '</b><small>' + TYPE_INFO[t] + '</small></span></label>';
  }).join('') + '</div>') : '';
  modal({
    title: isNew ? 'New launch · ' + c.name : 'Edit launch · ' + l.name, ok: isNew ? 'Create draft' : 'Save changes', wide: true,
    body: typeHtml + field('Launch name', inp('name', l.name, 'text', 'e.g. Leadership team · Nov 2026')) +
      grid('3', field('Language', sel('language', l.language, LANGS)) + field('Closing date (optional)', inp('closeDate', l.closeDate, 'date')) +
        field('Minimum responses', inp('minResponses', l.minResponses || '', 'number', '', ' min="1" step="1" data-min'))) +
      '<p class="hint hint-row">Everything participants see — invitation emails, the survey and the report — uses this language. When the closing date passes with the minimum reached, the launch becomes Ready.</p>' +
      field('Report recipients', inp('recipients', l.recipients, 'text', 'name@company.com, other@company.com'), 'Separate several emails with commas. You can change them before sending.') +
      field('Internal notes', '<textarea class="textarea" name="notes" rows="2" placeholder="Only visible here (optional)">' + h(l.notes || '') + '</textarea>') +
      (isNew ? field('Participants', pickerHtml(cid, sel0, {})) : ''),
    onOpen: function (form) {
      if (isNew) bindPicker(form);
      var minEl = form.querySelector('[data-min]');
      function upd() { var t = (vals(form).type || l.type); minEl.placeholder = String(S.min[t] || 1); minEl.min = String(S.min[t] || 1); }
      form.querySelectorAll('input[name="type"]').forEach(function (r) { r.addEventListener('change', upd); });
      upd();
    },
    onOk: function (form) {
      var v = vals(form);
      if (!v.name) return ERR.name_required;
      var p = { id: l.id, companyId: cid, type: v.type || l.type, name: v.name, language: v.language, closeDate: v.closeDate, minResponses: v.minResponses, recipients: v.recipients, notes: v.notes };
      if (isNew) { p.employeeIds = picked(form); if (!p.employeeIds.length) return ERR.no_participants; }
      if (isNew && p.type === 'ES' && p.employeeIds.length < S.min.ES) return 'The Engagement Survey needs at least ' + S.min.ES + ' participants (minimum for anonymity).';
      return run('saveLaunch', p, isNew ? 'Draft created' : 'Launch updated').then(function (r) { if (isNew && r.savedId) go('#/launch/' + r.savedId); });
    },
  });
}
function participantsForm(l) {
  var inv = invitesOf(l.id), selected = {}, locked = {};
  inv.forEach(function (i) { selected[i.employeeId] = true; if (i.status === 'Completed') locked[i.employeeId] = true; });
  modal({
    title: 'Participants · ' + l.name, ok: 'Save participants', wide: true,
    body: (l.status === 'Open' ? '<div class="notice is-info">New participants don’t get the invitation automatically: send it after saving.</div>' : '') + pickerHtml(l.companyId, selected, locked),
    onOpen: bindPicker,
    onOk: function (form) {
      var ids = picked(form).concat(Object.keys(locked).filter(function (id) { return picked(form).indexOf(id) < 0; }));
      if (!ids.length) return ERR.no_participants;
      return run('setParticipants', { launchId: l.id, employeeIds: ids }, 'Participants updated');
    },
  });
}

/* ------------------------------------------------------------------ launch page */
function renderLaunch(lid) {
  var l = byId(S.launches, lid), c = company(l.companyId), inv = invitesOf(lid);
  var emp = {}; S.employees.forEach(function (e) { emp[e.id] = e; });
  var pend = inv.filter(function (i) { return i.status === 'Pending'; }).length, sent = inv.filter(function (i) { return i.status === 'Sent'; }).length;
  var canReport = l.done >= l.minResponses && l.status !== 'Draft';
  var rows = inv.slice().sort(function (a, b) { return ((emp[a.employeeId] || {}).name || '').localeCompare((emp[b.employeeId] || {}).name || ''); }).map(function (i) {
    var e = emp[i.employeeId] || {};
    var when = i.status === 'Completed' ? fdate(i.completedOn, l.type === 'ED') : i.sentAt ? 'Invited ' + fdate(i.sentAt) + (i.reminders ? ' · ' + i.reminders + ' reminder(s)' : '') : '';
    return '<tr><td class="strong">' + h(e.name || '—') + '<div class="small muted">' + h(e.email || '') + '</div></td><td data-l="Area">' + h(e.area || '—') + '</td>' +
      '<td>' + chip(i.status, IST) + '</td><td class="small muted" data-l="Date">' + h(when) + '</td>' +
      '<td class="act">' + (i.status !== 'Completed' ? '<button class="btn btn-ghost btn-sm" data-copy="' + h(i.link) + '">Copy link</button>' +
        (l.status === 'Open' ? '<button class="btn btn-ghost btn-sm" data-send="' + h(i.id) + '">' + (i.status === 'Pending' ? 'Send' : 'Resend') + '</button>' : '') : '') + '</td></tr>';
  }).join('');

  var actions = [];
  if (l.status === 'Draft') {
    actions.push('<button class="btn btn-red" data-act="open-send">Open & send invitations</button>', '<button class="btn btn-line" data-act="open">Open without sending</button>',
      '<button class="btn btn-line" data-act="participants">Participants</button>', '<button class="btn btn-ghost" data-act="edit">Edit</button>', '<button class="btn btn-ghost btn-danger" data-act="delete">Delete</button>');
  } else if (l.status === 'Open') {
    if (pend) actions.push('<button class="btn btn-red" data-act="invite">Send invitations (' + pend + ')</button>');
    if (sent) actions.push('<button class="btn btn-line" data-act="remind">Send reminder (' + sent + ')</button>');
    actions.push('<button class="btn btn-line" data-act="copy-all">Copy links</button>', '<button class="btn btn-line" data-act="participants">Participants</button>');
    if (l.done >= l.minResponses) actions.push('<button class="btn btn-dark" data-act="finish">Close & mark ready</button>');
    actions.push('<button class="btn btn-ghost" data-act="edit">Edit</button>');
  } else {
    actions.push('<button class="btn btn-line" data-act="reopen">Reopen</button>', '<button class="btn btn-ghost" data-act="edit">Edit</button>');
    if (l.status !== 'Closed') actions.push('<button class="btn btn-ghost" data-act="close">Archive</button>');
  }
  var notice = '';
  if (l.status === 'Draft') notice = '<div class="notice is-info">Draft: check the participants, then open it so they can answer. Send the invitations from info@adizes.com, or copy the personal links and share them yourself.</div>';
  if (l.notice === 'expired' && l.status === 'Open') notice = '<div class="notice">The closing date passed without reaching the minimum (' + l.done + ' of ' + l.minResponses + '). Send a reminder or change the date in “Edit”.</div>';
  if (l.type === 'ES') notice += '<div class="notice is-info">Anonymous survey: you can see who has answered, but answers are stored without names. Areas with fewer than ' + ES.MIN_GROUP + ' answers are never shown on their own in the report.</div>';

  var report = '';
  if (l.status !== 'Draft') {
    report = '<section class="adm-sec"><div class="adm-sec-h"><h2 class="adm-h2">Group report</h2></div><div class="card report">' +
      '<div><div class="adm-eyebrow">1 · Generate</div>' +
      (canReport ? '<p class="small muted" style="margin:6px 0 12px">Built in your browser from the ' + l.done + ' current response(s), in ' + h(LANGS[l.language] || l.language) + ', and saved to Drive.</p>'
        : '<p class="small muted" style="margin:6px 0 12px">Available once the minimum of ' + l.minResponses + ' response(s) is reached. Now: ' + l.done + '.</p>') +
      (l.type === 'ES' ? '<label class="chk" style="margin-bottom:12px"><input type="checkbox" data-comments checked> Include participants’ comments</label>' : '') +
      (l.reportUrl ? '<div class="pdf-ok"><i></i><div><a href="' + h(l.reportUrl) + '" target="_blank" rel="noopener" class="strong">Open PDF in Drive</a><div class="small muted">Generated ' + h(fdate(l.reportGeneratedAt, true)) + '</div></div></div>' : '') +
      '<button class="btn ' + (l.reportUrl ? 'btn-line' : 'btn-dark') + '" data-act="generate"' + (canReport ? '' : ' disabled') + '>' + (l.reportUrl ? 'Generate again' : 'Generate report') + '</button></div>' +
      '<div><div class="adm-eyebrow">2 · Send</div>' +
      '<form data-send-form style="margin-top:10px">' + field('To', inp('to', l.recipients || c.contactEmail || '', 'text', 'name@company.com, other@company.com'), 'Separate several emails with commas.') +
      field('Message (optional)', '<textarea class="textarea" name="note" rows="3" placeholder="Added to the email with the PDF attached."></textarea>') +
      '<div class="adm-btns"><button type="submit" class="btn btn-red"' + (l.reportUrl ? '' : ' disabled') + '>' + (l.reportSentAt ? 'Send again' : 'Send report') + '</button>' +
      (l.reportSentAt ? '<span class="small muted">Sent ' + h(fdate(l.reportSentAt, true)) + ' to ' + h(l.reportSentTo) + '</span>' : '') + '</div></form></div></div></section>';
  }

  APP.innerHTML = shell('launches',
    '<div class="adm-crumbs"><a href="#/">Companies</a> › <a href="#/company/' + h(c.id) + '">' + h(c.name) + '</a> ›</div>' +
    '<div class="adm-head"><div><h1 class="adm-h1">' + typeTag(l.type) + ' ' + h(l.name) + '</h1>' +
    '<div class="adm-sub">' + h(TYPES[l.type]) + ' · ' + h(LANGS[l.language] || l.language) + ' · ' + chip(l.status) + '</div></div>' +
    '<div class="adm-btns">' + actions.join('') + '</div></div>' + notice +
    '<div class="kpis">' +
      '<div class="card kpi"><small>Responses</small><b>' + l.done + ' <span class="muted" style="font-size:15px">of ' + l.total + '</span></b>' + progress(l) + '</div>' +
      '<div class="card kpi"><small>Minimum</small><b>' + l.minResponses + '</b><div class="small muted">' + (l.done >= l.minResponses ? 'Reached' : (l.minResponses - l.done) + ' to go') + '</div></div>' +
      '<div class="card kpi"><small>Closes</small><b style="font-size:17px">' + h(fdate(l.closeDate) || 'No date') + '</b></div>' +
      '<div class="card kpi"><small>' + (l.readyAt ? 'Ready since' : 'Open since') + '</small><b style="font-size:17px">' + h(fdate(l.readyAt || l.openedAt) || '—') + '</b></div>' +
    '</div>' + report +
    '<section class="adm-sec"><div class="adm-sec-h"><h2 class="adm-h2">Participants</h2></div>' +
    '<div class="card">' + (rows ? '<table class="tbl"><thead><tr><th>Name</th><th>Area</th><th>Status</th><th>Date</th><th></th></tr></thead><tbody>' + rows + '</tbody></table>' : '<div class="empty"><b>No participants</b></div>') + '</div></section>');

  function on(act, fn) { var b = APP.querySelector('[data-act="' + act + '"]'); if (b) b.addEventListener('click', fn); }
  on('edit', function () { launchForm(l.companyId, l); });
  on('participants', function () { participantsForm(l); });
  on('delete', function () { confirmBox('Delete draft', 'Delete “' + h(l.name) + '”? This can’t be undone.', 'Delete', function () { return run('deleteLaunch', { id: l.id }, 'Draft deleted').then(function () { go('#/company/' + l.companyId); }); }, true); });
  on('open-send', function () { confirmBox('Open & send invitations', 'The invitation will be sent from info@adizes.com to ' + l.total + ' participant(s) in <b>' + h(LANGS[l.language]) + '</b>, each with a personal link.', 'Open & send', function () { return run('openLaunch', { launchId: l.id, send: true }, function (r) { return 'Open · ' + r.sent + ' invitation(s) sent'; }); }); });
  on('open', function () { run('openLaunch', { launchId: l.id, send: false }, 'Open. Copy the links to share them.'); });
  on('invite', function () { confirmBox('Send invitations', 'The invitation will be sent to the ' + pend + ' participant(s) who don’t have it yet.', 'Send', function () { return run('sendInvites', { launchId: l.id }, function (r) { return r.sent + ' invitation(s) sent'; }); }); });
  on('remind', function () { confirmBox('Send reminder', 'A reminder will be sent to the ' + sent + ' invited participant(s) who haven’t answered yet.', 'Send reminder', function () { return run('remind', { launchId: l.id }, function (r) { return r.sent + ' reminder(s) sent'; }); }); });
  on('copy-all', function () {
    copyText(inv.filter(function (i) { return i.status !== 'Completed'; }).map(function (i) { var e = emp[i.employeeId] || {}; return e.name + '\t' + e.email + '\t' + i.link; }).join('\n'), 'Links copied (name, email, link — paste into Excel)');
  });
  on('finish', function () { confirmBox('Close & mark ready', 'There are ' + l.done + ' of ' + l.total + ' responses. Once closed, the links stop accepting answers (you can reopen later).', 'Close & mark ready', function () { return run('finish', { launchId: l.id }, 'Ready for the report'); }); });
  on('reopen', function () {
    modal({ title: 'Reopen launch', ok: 'Reopen', body: '<p class="lead-p">Participants who haven’t answered will be able to use their link again.</p>' + field('New closing date (optional)', inp('closeDate', '', 'date')),
      onOk: function (form) { return run('reopen', { launchId: l.id, closeDate: form.closeDate.value }, 'Launch reopened'); } });
  });
  on('close', function () { confirmBox('Archive launch', 'It will be marked as closed. The report and the answers are kept.', 'Archive', function () { return run('close', { launchId: l.id }, 'Launch archived'); }); });
  on('generate', function () { var cb = APP.querySelector('[data-comments]'); generateReport(l, cb ? cb.checked : false); });
  APP.querySelectorAll('[data-copy]').forEach(function (b) { b.addEventListener('click', function () { copyText(b.getAttribute('data-copy'), 'Link copied'); }); });
  APP.querySelectorAll('[data-send]').forEach(function (b) { b.addEventListener('click', function () { run('sendInvites', { launchId: l.id, inviteIds: [b.getAttribute('data-send')] }, 'Invitation sent'); }); });
  var sf = APP.querySelector('[data-send-form]');
  if (sf) sf.addEventListener('submit', function (e) {
    e.preventDefault();
    var to = sf.to.value.trim(), note = sf.note.value.trim();
    if (!to) return toast(ERR.no_recipients, true);
    confirmBox('Send report', 'The PDF will be sent from info@adizes.com to: <b>' + h(to) + '</b>' + (l.status === 'Open' ? '<br><br>The launch is still open: more responses can arrive after you send it.' : ''), 'Send report',
      function () { return run('sendReport', { launchId: l.id, to: to, note: note }, 'Report sent'); });
  });
}

/* ------------------------------------------------------------------ reports (generated here, saved in Drive) */
function slug(s) { return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^\w]+/g, '-').replace(/^-|-$/g, ''); }
function generateReport(l, comments) {
  busy(true);
  call('reportData', { launchId: l.id }).then(function (d) {
    return getPdfAssets(CFG.assetsBase).then(function (A) {
      var doc, base;
      if (d.type === 'ED') {
        doc = renderEdPdf(A, d.lang, { result: ED.score(d.responses), company: d.company, participants: d.names, dateIso: d.dateIso });
        base = d.lang === 'es' ? 'Diagnostico-Expres' : 'Express-Diagnostics';
      } else {
        doc = renderEsPdf(A, d.lang, { agg: ES.aggregate(d.responses), company: d.company, launchName: d.launchName, invited: d.total, dateIso: d.dateIso, comments: comments });
        base = d.lang === 'es' ? 'Encuesta-de-Compromiso' : 'Engagement-Survey';
      }
      var name = base + '-' + slug(d.company) + '-' + d.dateIso.slice(0, 10) + '.pdf';
      return call('saveReport', { launchId: l.id, pdf: doc.output('datauristring').split(',')[1], fileName: name });
    });
  }).then(function (r) { S = r; busy(false); render(); toast('Report generated and saved to Drive'); },
    function (e) { busy(false); toast(e.message || 'The report couldn’t be generated', true); if (window.console) console.error(e); });
}

/* ------------------------------------------------------------------ boot */
// With a valid session (or a Google account the server recognizes) this loads the admin; otherwise → sign-in.
call('state').then(function (r) { S = r; render(); }, function (e) {
  if (e.code === 'forbidden') return;
  APP.innerHTML = '<div class="adm-boot"><div class="card card-pad" style="max-width:420px;text-align:center"><b>The admin couldn’t load</b><p class="muted" style="margin-top:6px">' + h(e.message) + '</p></div></div>';
});
