/* =================================================================================
 *  ADMIN — served by doGet to admins only; every call is re-checked on the server.
 *  Only `adminApi` is callable from the page (functions ending in "_" are private).
 * ================================================================================= */
function doGet(e) {
  const p = (e && e.parameter) || {};
  if (p.health) return json_({ ok: true, service: 'adizes-assessments', version: VERSION, time: new Date().toISOString() });
  const me = currentEmail_();
  if (!isAdmin_(me)) {
    // Plain text, so the page never gets google.script.run.
    return ContentService.createTextOutput('Acceso restringido. Entra con una cuenta autorizada de adizes.com.' + (me ? ' (' + me + ')' : ''));
  }
  try { const url = ScriptApp.getService().getUrl(); if (url) setProp_('ADMIN_URL', url); } catch (err) {}
  return HtmlService.createHtmlOutput(ADMIN_HTML)
    .setTitle('Adizes · Admin')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function currentEmail_() {
  try { return String(Session.getActiveUser().getEmail() || '').trim().toLowerCase(); } catch (err) { return ''; }
}
function adminList_() { return prop_('ADMIN_EMAILS').split(/[,;\s]+/).map(s => s.trim().toLowerCase()).filter(Boolean); }
function isAdmin_(email) { return !!email && adminList_().indexOf(email) >= 0; }
function requireAdmin_() {
  const me = currentEmail_();
  if (!isAdmin_(me)) throw new Error('forbidden');
  return me;
}

// Single entry point for the admin page. Returns a JSON string (Dates become ISO strings).
function adminApi(action, payload) {
  let out;
  try {
    const me = requireAdmin_();
    const fn = ADMIN_ACTIONS[action];
    if (!fn) throw new Error('unknown_action');
    out = fn(payload || {}, me);
    if (out === undefined) out = { ok: true };
    if (out.ok === undefined) out.ok = true;
  } catch (err) {
    console.error('adminApi ' + action, err && err.stack || err);
    out = { ok: false, error: String(err && err.message || err) };
  }
  return JSON.stringify(out, (k, v) => v);
}

const ADMIN_ACTIONS = {
  state: (p, me) => adminState_(me),
  saveCompany: (p, me) => { saveCompany_(p); return adminState_(me); },
  archiveCompany: (p, me) => { update_(COMPANIES, p.id, { 'Status': p.archived ? 'Archived' : 'Active', 'Updated At': new Date() }); return adminState_(me); },
  saveEmployee: (p, me) => { saveEmployee_(p); return adminState_(me); },
  importEmployees: (p, me) => { const n = importEmployees_(p); const s = adminState_(me); s.imported = n; return s; },
  archiveEmployee: (p, me) => { update_(EMPLOYEES, p.id, { 'Status': p.archived ? 'Archived' : 'Active', 'Updated At': new Date() }); return adminState_(me); },
  saveLaunch: (p, me) => { const id = saveLaunch_(p); const s = adminState_(me); s.savedId = id; return s; },
  deleteLaunch: (p, me) => { deleteLaunch_(p.id); return adminState_(me); },
  setParticipants: (p, me) => { setParticipants_(p.launchId, p.employeeIds || []); return adminState_(me); },
  openLaunch: (p, me) => { const n = openLaunch_(p.launchId, !!p.send); const s = adminState_(me); s.sent = n; return s; },
  sendInvites: (p, me) => { const n = sendInvites_(p.launchId, p.inviteIds, false); const s = adminState_(me); s.sent = n; return s; },
  remind: (p, me) => { const n = sendInvites_(p.launchId, null, true); const s = adminState_(me); s.sent = n; return s; },
  finish: (p, me) => { finishLaunch_(p.launchId); return adminState_(me); },
  reopen: (p, me) => { reopenLaunch_(p.launchId, p.closeDate); return adminState_(me); },
  close: (p, me) => { update_(LAUNCHES, p.launchId, { 'Status': L_STATUS.CLOSED, 'Closed At': new Date(), 'Updated At': new Date() }); return adminState_(me); },
  reportData: (p) => reportData_(p.launchId),
  saveReport: (p, me) => { saveReport_(p.launchId, p.pdf, p.fileName); return adminState_(me); },
  sendReport: (p, me) => { sendReport_(p.launchId, p.to, p.note); return adminState_(me); },
};

/* ---------------- state for the page ---------------- */
function plain_(rec, keys) { const o = {}; keys.forEach(k => { const v = rec[k]; o[k] = v instanceof Date ? v.toISOString() : v; }); return o; }
function adminState_(me) {
  const companies = rows_(COMPANIES).map(r => ({
    id: r['ID'], name: r['Name'], country: r['Country'], language: r['Language'], contactName: r['Contact Name'],
    contactEmail: r['Contact Email'], notes: r['Notes'], status: r['Status'] || 'Active', createdAt: iso_(r['Created At']),
  }));
  const employees = rows_(EMPLOYEES).map(r => ({
    id: r['ID'], companyId: r['Company ID'], name: r['Full Name'], email: r['Email'], area: r['Area'], position: r['Position'],
    status: r['Status'] || 'Active',
  }));
  const invRows = rows_(INVITES);
  const launches = rows_(LAUNCHES).filter(r => r['Status'] !== 'Deleted').map(r => {
    const c = launchCounts_(r['ID'], invRows);
    return {
      id: r['ID'], companyId: r['Company ID'], type: r['Type'], name: r['Name'], language: r['Language'], status: r['Status'],
      minResponses: Number(r['Min Responses']) || CONFIG.MIN_RESPONSES[r['Type']], closeDate: dateStr_(r['Close Date']),
      recipients: r['Recipients'], notes: r['Notes'], notice: r['Notice'], createdAt: iso_(r['Created At']), openedAt: iso_(r['Opened At']),
      readyAt: iso_(r['Ready At']), reportUrl: r['Report URL'], reportGeneratedAt: iso_(r['Report Generated At']),
      reportSentAt: iso_(r['Report Sent At']), reportSentTo: r['Report Sent To'], closedAt: iso_(r['Closed At']),
      total: c.total, done: c.done,
    };
  });
  const lType = {}; launches.forEach(l => lType[l.id] = l.type);
  const invites = invRows.filter(r => r['Status'] !== I_STATUS.REMOVED).map(r => ({
    id: r['ID'], launchId: r['Launch ID'], employeeId: r['Employee ID'], status: r['Status'],
    sentAt: iso_(r['Sent At']), remindedAt: iso_(r['Reminded At']), reminders: Number(r['Reminders']) || 0,
    completedOn: r['Completed On'] instanceof Date ? r['Completed On'].toISOString() : String(r['Completed On'] || ''),
    link: lType[r['Launch ID']] ? inviteLink_(lType[r['Launch ID']], r['Token']) : '',
  }));
  return { me: me, version: VERSION, today: today_(), pages: CONFIG.PAGES, min: CONFIG.MIN_RESPONSES, companies, employees, launches, invites };
}

/* ---------------- companies & employees ---------------- */
function saveCompany_(p) {
  const name = clean_(p.name, 160);
  if (!name) throw new Error('name_required');
  const email = clean_(p.contactEmail, 160).toLowerCase();
  if (email && !validEmail_(email)) throw new Error('invalid_email');
  const row = {
    'Name': name, 'Country': clean_(p.country, 80), 'Language': LABELS[p.language] ? p.language : 'es',
    'Contact Name': clean_(p.contactName, 120), 'Contact Email': email, 'Notes': clean_(p.notes, 1000), 'Updated At': new Date(),
  };
  if (p.id) return update_(COMPANIES, p.id, row)['ID'];
  const id = newId_('C');
  appendRecord_(COMPANIES, Object.assign({ 'ID': id, 'Status': 'Active', 'Created At': new Date() }, row));
  return id;
}
function employeeRow_(p) {
  const name = clean_(p.name, 120).replace(/\s+/g, ' '), email = clean_(p.email, 160).toLowerCase();
  if (name.length < 2) throw new Error('name_required');
  if (!validEmail_(email)) throw new Error('invalid_email');
  return { 'Full Name': name, 'Email': email, 'Area': clean_(p.area, 80), 'Position': clean_(p.position, 80), 'Updated At': new Date() };
}
function saveEmployee_(p) {
  if (!byId_(COMPANIES, p.companyId)) throw new Error('company_not_found');
  const row = employeeRow_(p);
  const dup = rows_(EMPLOYEES).find(r => r['Company ID'] === p.companyId && r['Email'] === row['Email'] && r['ID'] !== p.id && r['Status'] !== 'Archived');
  if (dup) throw new Error('duplicate_email');
  if (p.id) return update_(EMPLOYEES, p.id, row)['ID'];
  const id = newId_('E');
  appendRecord_(EMPLOYEES, Object.assign({ 'ID': id, 'Company ID': p.companyId, 'Status': 'Active', 'Created At': new Date() }, row));
  return id;
}
// rows: [{ name, email, area, position }] — skips invalid rows and emails already in the company
function importEmployees_(p) {
  if (!byId_(COMPANIES, p.companyId)) throw new Error('company_not_found');
  const seen = {};
  rows_(EMPLOYEES).forEach(r => { if (r['Company ID'] === p.companyId && r['Status'] !== 'Archived') seen[r['Email']] = true; });
  let n = 0;
  (p.rows || []).slice(0, 2000).forEach(x => {
    let row; try { row = employeeRow_(x); } catch (err) { return; }
    if (seen[row['Email']]) return;
    seen[row['Email']] = true;
    appendRecord_(EMPLOYEES, Object.assign({ 'ID': newId_('E'), 'Company ID': p.companyId, 'Status': 'Active', 'Created At': new Date() }, row));
    n++;
  });
  return n;
}

/* ---------------- launches ---------------- */
function recipientsList_(s) {
  return String(s || '').split(/[,;\s]+/).map(x => x.trim().toLowerCase()).filter(Boolean);
}
function saveLaunch_(p) {
  const name = clean_(p.name, 160);
  if (!name) throw new Error('name_required');
  const rec = recipientsList_(p.recipients);
  if (rec.some(x => !validEmail_(x))) throw new Error('invalid_recipients');
  const close = clean_(p.closeDate, 10);
  if (close && !/^\d{4}-\d{2}-\d{2}$/.test(close)) throw new Error('invalid_date');
  const row = {
    'Name': name, 'Language': LABELS[p.language] ? p.language : 'es', 'Close Date': close,
    'Recipients': rec.join(', '), 'Notes': clean_(p.notes, 1000), 'Updated At': new Date(),
  };
  if (p.id) {
    const cur = byId_(LAUNCHES, p.id);
    if (!cur) throw new Error('not_found');
    const min = Math.max(CONFIG.MIN_RESPONSES[cur.rec['Type']], Math.floor(Number(p.minResponses) || 0));
    row['Min Responses'] = min;
    update_(LAUNCHES, p.id, row);
    if (cur.rec['Status'] === L_STATUS.OPEN) checkReady_(p.id);
    return p.id;
  }
  if (TESTS.indexOf(p.type) < 0) throw new Error('invalid_type');
  if (!byId_(COMPANIES, p.companyId)) throw new Error('company_not_found');
  const id = newId_('L');
  row['Min Responses'] = Math.max(CONFIG.MIN_RESPONSES[p.type], Math.floor(Number(p.minResponses) || 0));
  appendRecord_(LAUNCHES, Object.assign({ 'ID': id, 'Company ID': p.companyId, 'Type': p.type, 'Status': L_STATUS.DRAFT, 'Created At': new Date() }, row));
  if (p.employeeIds) setParticipants_(id, p.employeeIds);
  return id;
}
function deleteLaunch_(id) {
  const f = byId_(LAUNCHES, id);
  if (!f) throw new Error('not_found');
  if (f.rec['Status'] !== L_STATUS.DRAFT) throw new Error('only_drafts');
  // Drafts never had answers: mark the row and its invitations as removed.
  setCells_(f.sh, f.rowNum, f.map, { 'Status': 'Deleted', 'Updated At': new Date() });
  allRecords_(INVITES).rows.forEach(r => { if (r['Launch ID'] === id) update_(INVITES, r['ID'], { 'Status': I_STATUS.REMOVED }); });
}
// Makes the launch's participants exactly `employeeIds` (completed ones are never removed).
function setParticipants_(launchId, employeeIds) {
  const l = byId_(LAUNCHES, launchId);
  if (!l) throw new Error('not_found');
  if ([L_STATUS.DRAFT, L_STATUS.OPEN].indexOf(l.rec['Status']) < 0) throw new Error('launch_not_editable');
  const want = {}; employeeIds.forEach(id => want[id] = true);
  const emp = {}; rows_(EMPLOYEES).forEach(r => { if (r['Company ID'] === l.rec['Company ID']) emp[r['ID']] = r; });
  const have = {};
  rows_(INVITES).filter(r => r['Launch ID'] === launchId).forEach(r => {
    if (r['Status'] === I_STATUS.REMOVED) return;
    have[r['Employee ID']] = true;
    if (!want[r['Employee ID']] && r['Status'] !== I_STATUS.DONE) update_(INVITES, r['ID'], { 'Status': I_STATUS.REMOVED });
  });
  employeeIds.forEach(eid => {
    if (have[eid] || !emp[eid]) return;
    appendRecord_(INVITES, {
      'ID': newId_('I'), 'Launch ID': launchId, 'Employee ID': eid, 'Token': randStr_(24),
      'Status': I_STATUS.PENDING, 'Reminders': 0, 'Created At': new Date(),
    });
  });
  if (l.rec['Status'] === L_STATUS.OPEN) checkReady_(launchId);
}
function openLaunch_(launchId, send) {
  const l = byId_(LAUNCHES, launchId);
  if (!l) throw new Error('not_found');
  if (l.rec['Status'] !== L_STATUS.DRAFT) throw new Error('not_draft');
  if (!launchCounts_(launchId).total) throw new Error('no_participants');
  update_(LAUNCHES, launchId, { 'Status': L_STATUS.OPEN, 'Opened At': new Date(), 'Updated At': new Date() });
  return send ? sendInvites_(launchId, null, false) : 0;
}
function finishLaunch_(launchId) {
  const l = byId_(LAUNCHES, launchId);
  if (!l) throw new Error('not_found');
  if (l.rec['Status'] !== L_STATUS.OPEN) throw new Error('not_open');
  const c = launchCounts_(launchId), min = Number(l.rec['Min Responses']) || 1;
  if (c.done < min) throw new Error('below_minimum');
  update_(LAUNCHES, launchId, { 'Status': L_STATUS.READY, 'Ready At': new Date(), 'Notice': '', 'Updated At': new Date() });
}
function reopenLaunch_(launchId, closeDate) {
  const l = byId_(LAUNCHES, launchId);
  if (!l) throw new Error('not_found');
  if ([L_STATUS.READY, L_STATUS.SENT, L_STATUS.CLOSED].indexOf(l.rec['Status']) < 0) throw new Error('not_reopenable');
  const upd = { 'Status': L_STATUS.OPEN, 'Notice': '', 'Updated At': new Date() };
  if (closeDate) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(closeDate)) throw new Error('invalid_date');
    upd['Close Date'] = closeDate;
  }
  update_(LAUNCHES, launchId, upd);
}

/* ---------------- reports ---------------- */
function launchCompany_(l) { const c = byId_(COMPANIES, l['Company ID']); return c ? c.rec : {}; }
function reportData_(launchId) {
  const f = byId_(LAUNCHES, launchId);
  if (!f) throw new Error('not_found');
  const l = f.rec, c = launchCounts_(launchId);
  if (c.done < (Number(l['Min Responses']) || 1)) throw new Error('below_minimum');
  const base = {
    type: l['Type'], lang: l['Language'] || 'en', company: launchCompany_(l)['Name'] || '', launchName: l['Name'],
    dateIso: new Date().toISOString(), total: c.total, done: c.done,
  };
  if (l['Type'] === 'ED') {
    const rows = rows_(ED_ANSWERS).filter(r => r['Launch ID'] === launchId);
    base.names = rows.map(r => r['Full Name']);
    base.responses = rows.map(r => ED_Q_COLS.map(h => Number(r[h])));
  }
  return base;
}
function saveReport_(launchId, pdfB64, fileName) {
  const f = byId_(LAUNCHES, launchId);
  if (!f) throw new Error('not_found');
  const blob = pdfBlob_(pdfB64, fileName, 'Report.pdf');
  blob.setName(blob.getName().replace(/\.pdf$/i, '') + ' - ' + launchId + '.pdf');
  const file = folder_(f.rec['Type']).createFile(blob);
  update_(LAUNCHES, launchId, { 'Report URL': file.getUrl(), 'Report File ID': file.getId(), 'Report Generated At': new Date(), 'Updated At': new Date() });
}
function sendReport_(launchId, to, note) {
  const f = byId_(LAUNCHES, launchId);
  if (!f) throw new Error('not_found');
  const l = f.rec;
  if (!l['Report File ID']) throw new Error('no_report');
  if ([L_STATUS.READY, L_STATUS.SENT, L_STATUS.CLOSED].indexOf(l['Status']) < 0) throw new Error('not_ready');
  const list = recipientsList_(to || l['Recipients']);
  if (!list.length) throw new Error('no_recipients');
  if (list.some(x => !validEmail_(x))) throw new Error('invalid_recipients');
  const pdf = DriveApp.getFileById(l['Report File ID']).getBlob();
  pdf.setName(String(pdf.getName()).replace(/ - L-[A-Z0-9]+\.pdf$/, '.pdf'));
  sendReportEmail_(l, list, clean_(note, 2000), pdf, launchCounts_(launchId).done);
  update_(LAUNCHES, launchId, {
    'Status': l['Status'] === L_STATUS.CLOSED ? L_STATUS.CLOSED : L_STATUS.SENT,
    'Report Sent At': new Date(), 'Report Sent To': list.join(', '), 'Recipients': list.join(', '), 'Updated At': new Date(),
  });
}
