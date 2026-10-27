/* Adizes Admin — single-page app served by Apps Script (HtmlService).
 * Talks to the server only through google.script.run.adminApi(action, payload) → JSON string.
 * Bundled with: express-diagnostics i18n, shared/core.js, ed-engine.js, pdfkit.js, ed-report.js.
 */
var CFG = window.ADM_CONFIG || {};
var S = null;          // last state from the server
var APP = document.getElementById('app');
var MODAL = document.getElementById('modal-root');

var ST = { Draft: 'Borrador', Open: 'Abierto', Ready: 'Listo', 'Report sent': 'Reporte enviado', Closed: 'Cerrado' };
var IST = { Pending: 'Sin enviar', Sent: 'Invitado', Completed: 'Respondió' };
var TYPES = { ED: 'Diagnóstico Exprés', ES: 'Encuesta de Compromiso' };
var LANGS = { es: 'Español', en: 'English' };
var ERR = {
  forbidden: 'No tienes acceso. Entra con una cuenta autorizada.',
  name_required: 'Falta el nombre.', invalid_email: 'Revisa el correo.', duplicate_email: 'Ya existe un empleado con ese correo en esta empresa.',
  invalid_recipients: 'Revisa los correos de los destinatarios.', invalid_date: 'Revisa la fecha.', below_minimum: 'Aún no se alcanza el mínimo de respuestas.',
  no_participants: 'Agrega al menos un participante.', not_draft: 'El lanzamiento ya no es borrador.', not_open: 'El lanzamiento no está abierto.',
  no_report: 'Primero genera el reporte.', no_recipients: 'Agrega al menos un destinatario.', only_drafts: 'Solo se pueden eliminar borradores.',
  launch_not_editable: 'Este lanzamiento ya no admite cambios de participantes.', company_not_found: 'No se encontró la empresa.', not_found: 'No se encontró el registro.',
  not_setup: 'Falta ejecutar setup() en Apps Script.', not_reopenable: 'Este lanzamiento no se puede reabrir.', invalid_type: 'Tipo de test inválido.',
};

/* ------------------------------------------------------------------ server */
function call(action, payload) {
  return new Promise(function (resolve, reject) {
    if (!window.google || !google.script || !google.script.run) return reject(new Error('Sin conexión con Apps Script'));
    google.script.run
      .withSuccessHandler(function (txt) {
        var r; try { r = JSON.parse(txt); } catch (e) { return reject(new Error('Respuesta inválida')); }
        if (!r.ok) { var e2 = new Error(ERR[r.error] || r.error || 'Error'); e2.code = r.error; return reject(e2); }
        resolve(r);
      })
      .withFailureHandler(function (e) { reject(new Error((e && e.message) || 'Error de conexión')); })
      .adminApi(action, payload || {});
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
  }, function (e) { busy(false); toast(e.message, true); throw e; });
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
function typeTag(t) { return '<span class="type type-' + t + '">' + t + '</span>'; }
function fdate(iso, withTime) {
  if (!iso) return '';
  var d = new Date(String(iso).length === 10 ? iso + 'T12:00:00' : iso);
  if (isNaN(d)) return String(iso);
  var o = { day: 'numeric', month: 'short', year: 'numeric' };
  if (withTime) { o.hour = '2-digit'; o.minute = '2-digit'; }
  return d.toLocaleDateString('es-MX', o);
}
function progress(l) {
  var pct = l.total ? Math.round(l.done / l.total * 100) : 0, minPct = l.total ? Math.min(100, l.minResponses / l.total * 100) : 0;
  return '<div class="prog"><div class="prog-bar' + (l.done >= l.minResponses ? ' is-ok' : '') + '"><i style="width:' + pct + '%"></i>' +
    (l.minResponses > 1 && minPct < 100 ? '<b style="left:' + minPct + '%" title="Mínimo"></b>' : '') + '</div><span>' + l.done + ' de ' + l.total + '</span></div>';
}
function go(hash) { if (location.hash === hash) render(); else location.hash = hash; }
function copyText(text) {
  function fallback() {
    var ta = document.createElement('textarea'); ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select(); var ok = false; try { ok = document.execCommand('copy'); } catch (e) {} ta.remove();
    return ok;
  }
  var p = (navigator.clipboard && navigator.clipboard.writeText) ? navigator.clipboard.writeText(text).then(function () { return true; }, fallback) : Promise.resolve(fallback());
  return p.then(function (ok) {
    if (ok) toast('Copiado');
    else modal({ title: 'Copia el texto', body: '<textarea class="textarea linkbox" rows="8" readonly>' + h(text) + '</textarea>', ok: null });
  });
}

/* ------------------------------------------------------------------ modal */
function modal(o) {
  MODAL.innerHTML = '<div class="modal-bg"><div class="modal' + (o.wide ? ' is-wide' : '') + '" role="dialog" aria-modal="true">' +
    '<div class="modal-h"><h3>' + h(o.title) + '</h3><button type="button" class="x" data-x aria-label="Cerrar">×</button></div>' +
    '<form class="modal-form" novalidate><div class="modal-b">' + o.body + '<div class="err" data-err></div></div>' +
    '<div class="modal-f"><button type="button" class="btn btn-ghost" data-x>' + (o.ok === null ? 'Cerrar' : 'Cancelar') + '</button>' +
    (o.ok === null ? '' : '<button type="submit" class="btn ' + (o.danger ? 'btn-red' : 'btn-dark') + '">' + h(o.ok || 'Guardar') + '</button>') + '</div></form></div></div>';
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
  var first = form.querySelector('input:not([type=checkbox]):not([type=radio]),textarea,select'); if (first) first.focus();
  return form;
}
function confirmBox(title, text, okLabel, fn, danger) {
  modal({ title: title, body: '<p>' + text + '</p>', ok: okLabel, danger: danger, onOk: function () { return fn(); } });
}
function field(label, inner, hint) { return '<div class="field"><label>' + h(label) + '</label>' + inner + (hint ? '<div class="hint">' + h(hint) + '</div>' : '') + '</div>'; }
function inp(name, val, type, ph) { return '<input class="input" name="' + name + '" type="' + (type || 'text') + '" value="' + h(val || '') + '"' + (ph ? ' placeholder="' + h(ph) + '"' : '') + '>'; }
function sel(name, val, opts) { return '<select class="select" name="' + name + '">' + Object.keys(opts).map(function (k) { return '<option value="' + h(k) + '"' + (k === val ? ' selected' : '') + '>' + h(opts[k]) + '</option>'; }).join('') + '</select>'; }
function vals(form) { var o = {}; Array.prototype.forEach.call(form.elements, function (el) { if (el.name && el.type !== 'checkbox' && el.type !== 'radio') o[el.name] = el.value.trim(); if (el.type === 'radio' && el.checked) o[el.name] = el.value; }); return o; }

/* ------------------------------------------------------------------ layout */
function shell(active, inner) {
  return '<header class="adm-top"><div class="adm-top-in">' +
    '<a class="adm-brand" href="#/"><img class="adm-logo" alt="Adizes" src="' + h(CFG.assetsBase + 'adizes-logo-color.png') + '"><span>Admin</span></a>' +
    '<nav class="adm-nav"><a href="#/" class="' + (active === 'companies' ? 'is-on' : '') + '">Empresas</a>' +
    '<a href="#/launches" class="' + (active === 'launches' ? 'is-on' : '') + '">Lanzamientos</a></nav>' +
    '<div class="adm-me" title="' + h(S.me) + '">' + h(S.me) + '</div></div></header>' +
    '<main class="adm-main">' + inner + '</main>';
}
var UI = { showArchived: false, q: '', lq: '', lstatus: 'active', ltype: '' };

function render() {
  if (!S) return;
  var parts = location.hash.replace(/^#\/?/, '').split('/');
  var view = parts[0] || '', id = parts[1];
  if (view === 'company' && byId(S.companies, id)) return renderCompany(id);
  if (view === 'launch' && byId(S.launches, id)) return renderLaunch(id);
  if (view === 'launches') return renderLaunches();
  return renderCompanies();
}
window.addEventListener('hashchange', function () { MODAL.innerHTML = ''; render(); window.scrollTo(0, 0); });

/* ------------------------------------------------------------------ companies */
function renderCompanies() {
  var q = UI.q.toLowerCase();
  var list = S.companies.filter(function (c) { return (UI.showArchived || c.status !== 'Archived') && (!q || c.name.toLowerCase().indexOf(q) >= 0 || String(c.country || '').toLowerCase().indexOf(q) >= 0); })
    .sort(function (a, b) { return a.name.localeCompare(b.name, 'es'); });
  var cards = list.map(function (c) {
    var ls = launchesOf(c.id), open = ls.filter(function (l) { return l.status === 'Open'; }).length, ready = ls.filter(function (l) { return l.status === 'Ready'; }).length;
    return '<a class="card co-card" href="#/company/' + h(c.id) + '"><h3>' + h(c.name) + '</h3><div class="muted small">' + h(c.country || '') + (c.contactName ? ' · ' + h(c.contactName) : '') + '</div>' +
      '<div class="co-meta"><span><b>' + employeesOf(c.id).length + '</b> empleados</span><span><b>' + ls.length + '</b> lanzamientos</span>' +
      (open ? '<span>' + chip('Open') + ' ' + open + '</span>' : '') + (ready ? '<span>' + chip('Ready') + ' ' + ready + '</span>' : '') +
      (c.status === 'Archived' ? chip('Archived', { Archived: 'Archivada' }) : '') + '</div></a>';
  }).join('');
  APP.innerHTML = shell('companies',
    '<div class="adm-head"><div><div class="adm-eyebrow">Adizes Assessments</div><h1 class="adm-h1">Empresas</h1></div>' +
    '<div class="adm-btns"><button class="btn btn-red" data-act="new-company">+ Nueva empresa</button></div></div>' +
    '<div class="toolbar"><input class="input" type="search" placeholder="Buscar empresa…" value="' + h(UI.q) + '" data-q>' +
    '<label class="chk"><input type="checkbox" data-arch' + (UI.showArchived ? ' checked' : '') + '> Ver archivadas</label></div>' +
    (cards ? '<div class="grid">' + cards + '</div>' : '<div class="card empty"><b>' + (S.companies.length ? 'Sin resultados' : 'Aún no hay empresas') + '</b>' + (S.companies.length ? '' : 'Crea la primera para agregar sus empleados y lanzar un test.') + '</div>'));
  APP.querySelector('[data-act="new-company"]').addEventListener('click', function () { companyForm(); });
  var qEl = APP.querySelector('[data-q]');
  qEl.addEventListener('input', function () { UI.q = qEl.value; renderCompanies(); var n = APP.querySelector('[data-q]'); n.focus(); n.setSelectionRange(n.value.length, n.value.length); });
  APP.querySelector('[data-arch]').addEventListener('change', function (e) { UI.showArchived = e.target.checked; renderCompanies(); });
}
function companyForm(c) {
  c = c || {};
  modal({
    title: c.id ? 'Editar empresa' : 'Nueva empresa', ok: c.id ? 'Guardar' : 'Crear empresa',
    body: field('Nombre', inp('name', c.name)) +
      '<div class="row2">' + field('País', inp('country', c.country)) + field('Idioma de los tests', sel('language', c.language || 'es', LANGS)) + '</div>' +
      '<div class="row2">' + field('Contacto', inp('contactName', c.contactName)) + field('Correo del contacto', inp('contactEmail', c.contactEmail, 'email'), 'Se propone como destinatario del reporte.') + '</div>' +
      field('Notas', '<textarea class="textarea" name="notes" rows="3">' + h(c.notes || '') + '</textarea>'),
    onOk: function (form) {
      var v = vals(form); v.id = c.id;
      if (!v.name) return 'Falta el nombre.';
      return run('saveCompany', v, c.id ? 'Empresa actualizada' : 'Empresa creada').then(function (r) {
        if (!c.id) { var nw = r.companies.filter(function (x) { return x.name === v.name; }).pop(); if (nw) go('#/company/' + nw.id); }
      });
    },
  });
}

/* ------------------------------------------------------------------ company */
function renderCompany(cid) {
  var c = company(cid), ls = launchesOf(cid).sort(function (a, b) { return String(b.createdAt).localeCompare(String(a.createdAt)); });
  var emps = employeesOf(cid, UI.showArchived).sort(function (a, b) { return a.name.localeCompare(b.name, 'es'); });
  var lRows = ls.map(function (l) {
    return '<tr class="is-click" data-go="#/launch/' + h(l.id) + '"><td>' + typeTag(l.type) + '</td><td class="strong">' + h(l.name) + '</td><td>' + chip(l.status) + '</td>' +
      '<td data-l="Avance">' + progress(l) + '</td><td class="nowrap muted small" data-l="Cierre">' + h(fdate(l.closeDate) || '—') + '</td></tr>';
  }).join('');
  var eRows = emps.map(function (e) {
    var n = S.invites.filter(function (i) { return i.employeeId === e.id; }).length;
    return '<tr><td class="strong">' + h(e.name) + (e.status === 'Archived' ? ' ' + chip('Archived', { Archived: 'Archivado' }) : '') + '</td><td data-l="Correo">' + h(e.email) + '</td>' +
      '<td data-l="Área">' + h(e.area || '—') + '</td><td data-l="Puesto">' + h(e.position || '—') + '</td><td class="num muted small" data-l="Tests">' + n + '</td>' +
      '<td class="act"><button class="btn btn-ghost btn-sm" data-edit-emp="' + h(e.id) + '">Editar</button>' +
      '<button class="btn btn-ghost btn-sm" data-arch-emp="' + h(e.id) + '">' + (e.status === 'Archived' ? 'Restaurar' : 'Archivar') + '</button></td></tr>';
  }).join('');
  APP.innerHTML = shell('companies',
    '<div class="adm-crumbs"><a href="#/">Empresas</a> ›</div>' +
    '<div class="adm-head"><div><h1 class="adm-h1">' + h(c.name) + (c.status === 'Archived' ? ' ' + chip('Archived', { Archived: 'Archivada' }) : '') + '</h1>' +
    '<div class="adm-sub">' + [c.country, LANGS[c.language], c.contactName && (c.contactName + (c.contactEmail ? ' · ' + c.contactEmail : ''))].filter(Boolean).map(h).join(' · ') + '</div></div>' +
    '<div class="adm-btns"><button class="btn btn-line" data-act="edit">Editar</button><button class="btn btn-ghost" data-act="archive">' + (c.status === 'Archived' ? 'Restaurar' : 'Archivar') + '</button></div></div>' +
    '<section class="adm-sec"><div class="adm-sec-h"><h2 class="adm-h2">Lanzamientos</h2><button class="btn btn-red" data-act="new-launch">+ Nuevo lanzamiento</button></div>' +
    '<div class="card">' + (lRows ? '<table class="tbl"><thead><tr><th>Tipo</th><th>Nombre</th><th>Estado</th><th>Avance</th><th>Cierre</th></tr></thead><tbody>' + lRows + '</tbody></table>'
      : '<div class="empty"><b>Sin lanzamientos</b>Crea uno para invitar a los empleados a un test.</div>') + '</div></section>' +
    '<section class="adm-sec"><div class="adm-sec-h"><h2 class="adm-h2">Empleados <span class="muted">(' + employeesOf(cid).length + ')</span></h2>' +
    '<div class="adm-btns"><label class="chk"><input type="checkbox" data-arch' + (UI.showArchived ? ' checked' : '') + '> Ver archivados</label>' +
    '<button class="btn btn-line" data-act="import">Importar lista</button><button class="btn btn-dark" data-act="new-emp">+ Agregar empleado</button></div></div>' +
    '<div class="card">' + (eRows ? '<table class="tbl"><thead><tr><th>Nombre</th><th>Correo</th><th>Área</th><th>Puesto</th><th class="num">Tests</th><th></th></tr></thead><tbody>' + eRows + '</tbody></table>'
      : '<div class="empty"><b>Sin empleados</b>Agrégalos uno por uno o pega una lista desde Excel.</div>') + '</div></section>');
  APP.querySelector('[data-act="edit"]').addEventListener('click', function () { companyForm(c); });
  APP.querySelector('[data-act="archive"]').addEventListener('click', function () { run('archiveCompany', { id: cid, archived: c.status !== 'Archived' }, c.status === 'Archived' ? 'Empresa restaurada' : 'Empresa archivada'); });
  APP.querySelector('[data-act="new-launch"]').addEventListener('click', function () { launchForm(cid); });
  APP.querySelector('[data-act="new-emp"]').addEventListener('click', function () { employeeForm(cid); });
  APP.querySelector('[data-act="import"]').addEventListener('click', function () { importForm(cid); });
  APP.querySelector('[data-arch]').addEventListener('change', function (e) { UI.showArchived = e.target.checked; renderCompany(cid); });
  APP.querySelectorAll('[data-go]').forEach(function (tr) { tr.addEventListener('click', function () { go(tr.getAttribute('data-go')); }); });
  APP.querySelectorAll('[data-edit-emp]').forEach(function (b) { b.addEventListener('click', function () { employeeForm(cid, byId(S.employees, b.getAttribute('data-edit-emp'))); }); });
  APP.querySelectorAll('[data-arch-emp]').forEach(function (b) {
    b.addEventListener('click', function () { var e = byId(S.employees, b.getAttribute('data-arch-emp')); run('archiveEmployee', { id: e.id, archived: e.status !== 'Archived' }, e.status === 'Archived' ? 'Empleado restaurado' : 'Empleado archivado'); });
  });
}
function areasOf(cid) {
  var seen = {}; employeesOf(cid, true).forEach(function (e) { if (e.area) seen[e.area] = 1; });
  return '<datalist id="areas">' + Object.keys(seen).sort().map(function (a) { return '<option value="' + h(a) + '">'; }).join('') + '</datalist>';
}
function employeeForm(cid, e) {
  e = e || {};
  modal({
    title: e.id ? 'Editar empleado' : 'Agregar empleado', ok: e.id ? 'Guardar' : 'Agregar',
    body: field('Nombre completo', inp('name', e.name)) + field('Correo', inp('email', e.email, 'email')) +
      '<div class="row2">' + field('Área', '<input class="input" name="area" list="areas" value="' + h(e.area || '') + '">', 'Se usa para los resultados por área de la Encuesta de Compromiso.') + field('Puesto', inp('position', e.position)) + '</div>' + areasOf(cid),
    onOk: function (form) { var v = vals(form); v.id = e.id; v.companyId = cid; return run('saveEmployee', v, e.id ? 'Empleado actualizado' : 'Empleado agregado'); },
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
    title: 'Importar empleados', ok: 'Importar', wide: true,
    body: '<p class="muted small" style="margin-bottom:10px">Pega una fila por persona, copiada de Excel o separada por comas: <b>Nombre, correo, área, puesto</b>. Se omiten los correos que ya existen en la empresa.</p>' +
      '<textarea class="textarea linkbox" name="rows" rows="10" placeholder="Ana López, ana@empresa.com, Ventas, Directora&#10;Bruno Díaz, bruno@empresa.com, Operaciones, Gerente"></textarea><p class="small muted" data-count style="margin-top:8px"></p>',
    onOpen: function (form) {
      var ta = form.rows, out = form.querySelector('[data-count]');
      ta.addEventListener('input', function () { var n = parseRows(ta.value).length; out.textContent = n ? n + ' fila(s) reconocida(s)' : ''; });
    },
    onOk: function (form) {
      var rows = parseRows(form.rows.value);
      if (!rows.length) return 'No se reconoció ninguna fila (cada fila necesita nombre y correo).';
      return run('importEmployees', { companyId: cid, rows: rows }, function (r) { return r.imported + ' empleado(s) importado(s)'; });
    },
  });
}

/* ------------------------------------------------------------------ launches list */
function renderLaunches() {
  var q = UI.lq.toLowerCase();
  var list = S.launches.filter(function (l) {
    if (UI.ltype && l.type !== UI.ltype) return false;
    if (UI.lstatus === 'active' && (l.status === 'Closed' || l.status === 'Report sent')) return false;
    if (UI.lstatus !== 'active' && UI.lstatus !== 'all' && l.status !== UI.lstatus) return false;
    return !q || l.name.toLowerCase().indexOf(q) >= 0 || company(l.companyId).name.toLowerCase().indexOf(q) >= 0;
  }).sort(function (a, b) { return String(b.createdAt).localeCompare(String(a.createdAt)); });
  var rows = list.map(function (l) {
    return '<tr class="is-click" data-go="#/launch/' + h(l.id) + '"><td class="strong">' + h(company(l.companyId).name) + '</td><td>' + typeTag(l.type) + ' ' + h(l.name) + '</td>' +
      '<td>' + chip(l.status) + '</td><td data-l="Avance">' + progress(l) + '</td><td class="nowrap muted small" data-l="Cierre">' + h(fdate(l.closeDate) || '—') + '</td></tr>';
  }).join('');
  var stOpts = { active: 'En curso', all: 'Todos', Draft: 'Borrador', Open: 'Abierto', Ready: 'Listo', 'Report sent': 'Reporte enviado', Closed: 'Cerrado' };
  APP.innerHTML = shell('launches',
    '<div class="adm-head"><div><div class="adm-eyebrow">Adizes Assessments</div><h1 class="adm-h1">Lanzamientos</h1></div></div>' +
    '<div class="toolbar"><input class="input" type="search" placeholder="Buscar por empresa o nombre…" value="' + h(UI.lq) + '" data-q>' +
    sel('st', UI.lstatus, stOpts).replace('class="select"', 'class="select" data-st') + sel('ty', UI.ltype, { '': 'Todos los tipos', ED: TYPES.ED, ES: TYPES.ES }).replace('class="select"', 'class="select" data-ty') + '</div>' +
    '<div class="card">' + (rows ? '<table class="tbl"><thead><tr><th>Empresa</th><th>Lanzamiento</th><th>Estado</th><th>Avance</th><th>Cierre</th></tr></thead><tbody>' + rows + '</tbody></table>'
      : '<div class="empty"><b>Sin lanzamientos</b>Los lanzamientos se crean desde cada empresa.</div>') + '</div>');
  var qEl = APP.querySelector('[data-q]');
  qEl.addEventListener('input', function () { UI.lq = qEl.value; renderLaunches(); var n = APP.querySelector('[data-q]'); n.focus(); n.setSelectionRange(n.value.length, n.value.length); });
  APP.querySelector('[data-st]').addEventListener('change', function (e) { UI.lstatus = e.target.value; renderLaunches(); });
  APP.querySelector('[data-ty]').addEventListener('change', function (e) { UI.ltype = e.target.value; renderLaunches(); });
  APP.querySelectorAll('[data-go]').forEach(function (tr) { tr.addEventListener('click', function () { go(tr.getAttribute('data-go')); }); });
}

/* ------------------------------------------------------------------ launch form */
function pickerHtml(cid, selected, locked) {
  var emps = employeesOf(cid).sort(function (a, b) { return (a.area || '').localeCompare(b.area || '', 'es') || a.name.localeCompare(b.name, 'es'); });
  if (!emps.length) return '<div class="notice is-info">Esta empresa aún no tiene empleados. Agrégalos primero.</div>';
  return '<div class="toolbar" style="margin-bottom:8px"><input class="input" type="search" placeholder="Filtrar…" data-pf>' +
    '<button type="button" class="btn btn-line btn-sm" data-all>Todos</button><button type="button" class="btn btn-ghost btn-sm" data-none>Ninguno</button>' +
    '<span class="small muted" data-pc></span></div><div class="pick">' + emps.map(function (e) {
      var on = selected[e.id], lock = locked[e.id];
      return '<label data-txt="' + h((e.name + ' ' + e.email + ' ' + (e.area || '')).toLowerCase()) + '"><input type="checkbox" name="emp" value="' + h(e.id) + '"' + (on ? ' checked' : '') + (lock ? ' disabled' : '') + '>' +
        '<span><b>' + h(e.name) + '</b><br><span class="small muted">' + h(e.email) + '</span></span><span class="small muted">' + h(e.area || '') + (lock ? '<br>Ya respondió' : '') + '</span></label>';
    }).join('') + '</div>';
}
function bindPicker(form) {
  var boxes = form.querySelectorAll('input[name="emp"]'), pc = form.querySelector('[data-pc]');
  function count() { if (pc) pc.textContent = Array.prototype.filter.call(boxes, function (b) { return b.checked; }).length + ' seleccionados'; }
  boxes.forEach(function (b) { b.addEventListener('change', count); });
  var pf = form.querySelector('[data-pf]');
  if (pf) pf.addEventListener('input', function () { var q = pf.value.toLowerCase(); form.querySelectorAll('.pick label').forEach(function (l) { l.hidden = q && l.getAttribute('data-txt').indexOf(q) < 0; }); });
  var all = form.querySelector('[data-all]'), none = form.querySelector('[data-none]');
  if (all) all.addEventListener('click', function () { boxes.forEach(function (b) { if (!b.closest('label').hidden && !b.disabled) b.checked = true; }); count(); });
  if (none) none.addEventListener('click', function () { boxes.forEach(function (b) { if (!b.disabled) b.checked = false; }); count(); });
  count();
}
function picked(form) { return Array.prototype.filter.call(form.querySelectorAll('input[name="emp"]'), function (b) { return b.checked; }).map(function (b) { return b.value; }); }

function launchForm(cid, l) {
  var c = company(cid), isNew = !l;
  l = l || { type: 'ED', language: c.language || 'es', recipients: c.contactEmail || '' };
  var sel0 = {}; if (isNew) employeesOf(cid).forEach(function (e) { sel0[e.id] = true; });
  var typeHtml = isNew ? field('Test', '<div class="types">' +
    '<label><input type="radio" name="type" value="ED" checked><b>' + TYPES.ED + '</b><small>67 afirmaciones · reporte grupal con nombres · mínimo 1 respuesta</small></label>' +
    '<label style="opacity:.55;cursor:default"><input type="radio" name="type" value="ES" disabled><b>' + TYPES.ES + '</b><small>50 preguntas · anónima · mínimo 5 · por área. Disponible en la siguiente versión.</small></label></div>') : '';
  modal({
    title: isNew ? 'Nuevo lanzamiento · ' + c.name : 'Editar lanzamiento', ok: isNew ? 'Crear borrador' : 'Guardar', wide: isNew,
    body: typeHtml + field('Nombre', inp('name', l.name, 'text', 'p. ej. Equipo directivo · Nov 2026')) +
      '<div class="row2">' + field('Idioma', sel('language', l.language, LANGS)) + field('Fecha de cierre', inp('closeDate', l.closeDate, 'date'), 'Opcional. Al pasar esta fecha, si hay el mínimo, queda listo para reporte.') + '</div>' +
      '<div class="row2">' + field('Mínimo de respuestas', inp('minResponses', l.minResponses || '', 'number'), 'Express: 1 o más · Encuesta: 5 o más.') +
      field('Destinatarios del reporte', inp('recipients', l.recipients, 'text', 'correo@empresa.com, otro@empresa.com')) + '</div>' +
      field('Notas internas', '<textarea class="textarea" name="notes" rows="2">' + h(l.notes || '') + '</textarea>') +
      (isNew ? field('Participantes', pickerHtml(cid, sel0, {})) : ''),
    onOpen: function (form) { if (isNew) bindPicker(form); },
    onOk: function (form) {
      var v = vals(form);
      if (!v.name) return 'Falta el nombre.';
      var p = { id: l.id, companyId: cid, type: v.type || l.type, name: v.name, language: v.language, closeDate: v.closeDate, minResponses: v.minResponses, recipients: v.recipients, notes: v.notes };
      if (isNew) { p.employeeIds = picked(form); if (!p.employeeIds.length) return 'Elige al menos un participante.'; }
      return run('saveLaunch', p, isNew ? 'Borrador creado' : 'Lanzamiento actualizado').then(function (r) { if (isNew && r.savedId) go('#/launch/' + r.savedId); });
    },
  });
}
function participantsForm(l) {
  var inv = invitesOf(l.id), selected = {}, locked = {};
  inv.forEach(function (i) { selected[i.employeeId] = true; if (i.status === 'Completed') locked[i.employeeId] = true; });
  modal({
    title: 'Participantes · ' + l.name, ok: 'Guardar participantes', wide: true,
    body: (l.status === 'Open' ? '<div class="notice is-info">A los nuevos participantes envíales la invitación después de guardar.</div>' : '') + pickerHtml(l.companyId, selected, locked),
    onOpen: bindPicker,
    onOk: function (form) {
      var ids = picked(form).concat(Object.keys(locked).filter(function (id) { return picked(form).indexOf(id) < 0; }));
      if (!ids.length) return 'Elige al menos un participante.';
      return run('setParticipants', { launchId: l.id, employeeIds: ids }, 'Participantes actualizados');
    },
  });
}

/* ------------------------------------------------------------------ launch page */
function renderLaunch(lid) {
  var l = byId(S.launches, lid), c = company(l.companyId), inv = invitesOf(lid);
  var emp = {}; S.employees.forEach(function (e) { emp[e.id] = e; });
  var pend = inv.filter(function (i) { return i.status === 'Pending'; }).length, sent = inv.filter(function (i) { return i.status === 'Sent'; }).length;
  var canReport = l.done >= l.minResponses && l.status !== 'Draft';
  var rows = inv.slice().sort(function (a, b) { return ((emp[a.employeeId] || {}).name || '').localeCompare((emp[b.employeeId] || {}).name || '', 'es'); }).map(function (i) {
    var e = emp[i.employeeId] || {};
    var when = i.status === 'Completed' ? fdate(i.completedOn, l.type === 'ED') : i.sentAt ? 'Invitado ' + fdate(i.sentAt) + (i.reminders ? ' · ' + i.reminders + ' recordatorio(s)' : '') : '';
    return '<tr><td class="strong">' + h(e.name || '—') + '<div class="small muted">' + h(e.email || '') + '</div></td><td data-l="Área">' + h(e.area || '—') + '</td>' +
      '<td>' + chip(i.status, IST) + '</td><td class="small muted" data-l="Fecha">' + h(when) + '</td>' +
      '<td class="act">' + (i.status !== 'Completed' ? '<button class="btn btn-ghost btn-sm" data-copy="' + h(i.link) + '">Copiar enlace</button>' +
        (l.status === 'Open' ? '<button class="btn btn-ghost btn-sm" data-send="' + h(i.id) + '">' + (i.status === 'Pending' ? 'Enviar' : 'Reenviar') + '</button>' : '') : '') + '</td></tr>';
  }).join('');

  var actions = [];
  if (l.status === 'Draft') {
    actions.push('<button class="btn btn-red" data-act="open-send">Abrir y enviar invitaciones</button>', '<button class="btn btn-line" data-act="open">Abrir sin enviar</button>',
      '<button class="btn btn-line" data-act="participants">Participantes</button>', '<button class="btn btn-ghost" data-act="edit">Editar</button>', '<button class="btn btn-ghost btn-danger" data-act="delete">Eliminar</button>');
  } else if (l.status === 'Open') {
    if (pend) actions.push('<button class="btn btn-red" data-act="invite">Enviar invitaciones (' + pend + ')</button>');
    if (sent) actions.push('<button class="btn btn-line" data-act="remind">Recordatorio (' + sent + ')</button>');
    actions.push('<button class="btn btn-line" data-act="copy-all">Copiar enlaces</button>', '<button class="btn btn-line" data-act="participants">Participantes</button>');
    if (l.done >= l.minResponses) actions.push('<button class="btn btn-dark" data-act="finish">Cerrar y marcar listo</button>');
    actions.push('<button class="btn btn-ghost" data-act="edit">Editar</button>');
  } else {
    actions.push('<button class="btn btn-line" data-act="reopen">Reabrir</button>', '<button class="btn btn-ghost" data-act="edit">Editar</button>');
    if (l.status !== 'Closed') actions.push('<button class="btn btn-ghost" data-act="close">Archivar</button>');
  }
  var notice = '';
  if (l.status === 'Draft') notice = '<div class="notice is-info">Borrador: revisa los participantes y ábrelo para que puedan responder. Puedes enviar las invitaciones desde info@ o copiar los enlaces para repartirlos tú.</div>';
  if (l.notice === 'expired' && l.status === 'Open') notice = '<div class="notice">La fecha de cierre pasó sin alcanzar el mínimo (' + l.done + ' de ' + l.minResponses + '). Envía un recordatorio o cambia la fecha en “Editar”.</div>';
  if (l.type === 'ES' && l.status !== 'Draft') notice += '<div class="notice is-info">La Encuesta de Compromiso (formulario y reporte) se activa en la siguiente versión.</div>';

  var report = '';
  if (l.status !== 'Draft') {
    report = '<section class="adm-sec"><div class="adm-sec-h"><h2 class="adm-h2">Reporte grupal</h2></div><div class="card report">' +
      '<div><div class="adm-eyebrow">1 · Generar</div>' +
      (canReport ? '<p class="small muted" style="margin:6px 0 12px">Se genera en tu navegador con las ' + l.done + ' respuestas actuales y se guarda en Drive.</p>' : '<p class="small muted" style="margin:6px 0 12px">Disponible al llegar al mínimo de ' + l.minResponses + ' respuesta(s). Hoy: ' + l.done + '.</p>') +
      (l.reportUrl ? '<div class="pdf-ok"><i></i><div><a href="' + h(l.reportUrl) + '" target="_blank" rel="noopener" class="strong">Ver PDF en Drive</a><div class="small muted">Generado ' + h(fdate(l.reportGeneratedAt, true)) + '</div></div></div>' : '') +
      '<button class="btn ' + (l.reportUrl ? 'btn-line' : 'btn-dark') + '" data-act="generate"' + (canReport && l.type === 'ED' ? '' : ' disabled') + '>' + (l.reportUrl ? 'Volver a generar' : 'Generar reporte') + '</button></div>' +
      '<div><div class="adm-eyebrow">2 · Enviar</div>' +
      '<form data-send-form style="margin-top:10px">' + field('Para', inp('to', l.recipients || c.contactEmail || '', 'text', 'correo@empresa.com, otro@empresa.com'), 'Separa varios correos con comas.') +
      field('Mensaje (opcional)', '<textarea class="textarea" name="note" rows="3" placeholder="Se agrega al correo con el PDF adjunto."></textarea>') +
      '<div class="adm-btns"><button type="submit" class="btn btn-red"' + (l.reportUrl ? '' : ' disabled') + '>Enviar reporte</button>' +
      (l.reportSentAt ? '<span class="small muted">Enviado ' + h(fdate(l.reportSentAt, true)) + ' a ' + h(l.reportSentTo) + '</span>' : '') + '</div></form></div></div></section>';
  }

  APP.innerHTML = shell('companies',
    '<div class="adm-crumbs"><a href="#/">Empresas</a> › <a href="#/company/' + h(c.id) + '">' + h(c.name) + '</a> ›</div>' +
    '<div class="adm-head"><div><h1 class="adm-h1">' + typeTag(l.type) + ' ' + h(l.name) + '</h1>' +
    '<div class="adm-sub">' + h(TYPES[l.type]) + ' · ' + h(LANGS[l.language] || l.language) + ' · ' + chip(l.status) + '</div></div>' +
    '<div class="adm-btns">' + actions.join('') + '</div></div>' + notice +
    '<div class="kpis">' +
      '<div class="card kpi"><small>Respuestas</small><b>' + l.done + ' <span class="muted" style="font-size:15px">de ' + l.total + '</span></b>' + progress(l) + '</div>' +
      '<div class="card kpi"><small>Mínimo</small><b>' + l.minResponses + '</b><div class="small muted">' + (l.done >= l.minResponses ? 'Alcanzado' : 'Faltan ' + (l.minResponses - l.done)) + '</div></div>' +
      '<div class="card kpi"><small>Cierre</small><b style="font-size:17px">' + h(fdate(l.closeDate) || 'Sin fecha') + '</b></div>' +
      '<div class="card kpi"><small>' + (l.readyAt ? 'Listo desde' : 'Abierto desde') + '</small><b style="font-size:17px">' + h(fdate(l.readyAt || l.openedAt) || '—') + '</b></div>' +
    '</div>' + report +
    '<section class="adm-sec"><div class="adm-sec-h"><h2 class="adm-h2">Participantes</h2>' +
    (l.type === 'ES' ? '<span class="small muted">Las respuestas son anónimas: aquí solo se ve quién ya respondió.</span>' : '') + '</div>' +
    '<div class="card">' + (rows ? '<table class="tbl"><thead><tr><th>Nombre</th><th>Área</th><th>Estado</th><th>Fecha</th><th></th></tr></thead><tbody>' + rows + '</tbody></table>' : '<div class="empty"><b>Sin participantes</b></div>') + '</div></section>');

  function on(act, fn) { var b = APP.querySelector('[data-act="' + act + '"]'); if (b) b.addEventListener('click', fn); }
  on('edit', function () { launchForm(l.companyId, l); });
  on('participants', function () { participantsForm(l); });
  on('delete', function () { confirmBox('Eliminar borrador', '¿Eliminar “' + h(l.name) + '”? No se puede deshacer.', 'Eliminar', function () { return run('deleteLaunch', { id: l.id }, 'Borrador eliminado').then(function () { go('#/company/' + l.companyId); }); }, true); });
  on('open-send', function () { confirmBox('Abrir y enviar', 'Se enviará la invitación desde info@adizes.com a ' + l.total + ' participante(s), cada uno con su enlace personal.', 'Abrir y enviar', function () { return run('openLaunch', { launchId: l.id, send: true }, function (r) { return 'Abierto · ' + r.sent + ' invitación(es) enviada(s)'; }); }); });
  on('open', function () { run('openLaunch', { launchId: l.id, send: false }, 'Abierto. Copia los enlaces para repartirlos.'); });
  on('invite', function () { confirmBox('Enviar invitaciones', 'Se enviará la invitación a ' + pend + ' participante(s) que aún no la tienen.', 'Enviar', function () { return run('sendInvites', { launchId: l.id }, function (r) { return r.sent + ' invitación(es) enviada(s)'; }); }); });
  on('remind', function () { confirmBox('Enviar recordatorio', 'Se enviará un recordatorio a ' + sent + ' participante(s) invitados que aún no responden.', 'Enviar recordatorio', function () { return run('remind', { launchId: l.id }, function (r) { return r.sent + ' recordatorio(s) enviado(s)'; }); }); });
  on('copy-all', function () {
    copyText(inv.filter(function (i) { return i.status !== 'Completed'; }).map(function (i) { var e = emp[i.employeeId] || {}; return e.name + '\t' + e.email + '\t' + i.link; }).join('\n'));
  });
  on('finish', function () { confirmBox('Cerrar y marcar listo', 'Ya hay ' + l.done + ' de ' + l.total + ' respuestas. Al cerrar, los enlaces dejan de aceptar respuestas (puedes reabrir después).', 'Cerrar y marcar listo', function () { return run('finish', { launchId: l.id }, 'Listo para reporte'); }); });
  on('reopen', function () {
    modal({ title: 'Reabrir lanzamiento', ok: 'Reabrir', body: '<p style="margin-bottom:12px">Los participantes que no han respondido podrán hacerlo de nuevo con su enlace.</p>' + field('Nueva fecha de cierre (opcional)', inp('closeDate', '', 'date')),
      onOk: function (form) { return run('reopen', { launchId: l.id, closeDate: form.closeDate.value }, 'Lanzamiento reabierto'); } });
  });
  on('close', function () { confirmBox('Archivar lanzamiento', 'Quedará como cerrado. El reporte y las respuestas se conservan.', 'Archivar', function () { return run('close', { launchId: l.id }, 'Lanzamiento archivado'); }); });
  on('generate', function () { generateReport(l); });
  APP.querySelectorAll('[data-copy]').forEach(function (b) { b.addEventListener('click', function () { copyText(b.getAttribute('data-copy')); }); });
  APP.querySelectorAll('[data-send]').forEach(function (b) { b.addEventListener('click', function () { run('sendInvites', { launchId: l.id, inviteIds: [b.getAttribute('data-send')] }, 'Invitación enviada'); }); });
  var sf = APP.querySelector('[data-send-form]');
  if (sf) sf.addEventListener('submit', function (e) {
    e.preventDefault();
    var to = sf.to.value.trim(), note = sf.note.value.trim();
    if (!to) return toast('Agrega al menos un destinatario.', true);
    confirmBox('Enviar reporte', 'Se enviará el PDF desde info@adizes.com a: <b>' + h(to) + '</b>', 'Enviar reporte', function () { return run('sendReport', { launchId: l.id, to: to, note: note }, 'Reporte enviado'); });
  });
}

/* ------------------------------------------------------------------ reports (generated here, saved in Drive) */
function slug(s) { return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^\w]+/g, '-').replace(/^-|-$/g, ''); }
function generateReport(l) {
  busy(true);
  call('reportData', { launchId: l.id }).then(function (d) {
    if (d.type !== 'ED') throw new Error('Este tipo de reporte aún no está disponible.');
    return getPdfAssets(CFG.assetsBase).then(function (A) {
      var doc = renderEdPdf(A, d.lang, { result: ED.score(d.responses), company: d.company, participants: d.names, dateIso: d.dateIso });
      var name = (d.lang === 'es' ? 'Diagnostico-Expres' : 'Express-Diagnostics') + '-' + slug(d.company) + '-' + d.dateIso.slice(0, 10) + '.pdf';
      return call('saveReport', { launchId: l.id, pdf: doc.output('datauristring').split(',')[1], fileName: name });
    });
  }).then(function (r) { S = r; busy(false); render(); toast('Reporte generado y guardado en Drive'); },
    function (e) { busy(false); toast(e.message || 'No se pudo generar el reporte', true); if (window.console) console.error(e); });
}

/* ------------------------------------------------------------------ boot */
call('state').then(function (r) { S = r; render(); }, function (e) {
  APP.innerHTML = '<div class="adm-boot"><div class="card card-pad" style="max-width:420px;text-align:center"><b>No se pudo cargar el admin</b><p class="muted" style="margin-top:6px">' + h(e.message) + '</p></div></div>';
});
