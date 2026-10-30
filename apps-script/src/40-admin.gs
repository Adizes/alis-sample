/* =================================================================================
 *  ADMIN — the page is served by doGet; every call is checked on the server.
 *  Access: ADMIN_EMAILS (Script Properties, comma separated; "@domain.com" entries allow a whole domain)
 *  plus CONFIG.ADMIN_DOMAINS. Sign-in with a one-time code sent by email (works for any domain);
 *  adizes.com accounts already signed in to Google get in directly when Google shares their email.
 *  Only `adminApi` is meant to be called from the page (functions ending in "_" are private).
 * ================================================================================= */
function doGet(e) {
  const p = (e && e.parameter) || {};
  if (p.health) return json_({ ok: true, service: 'adizes-assessments', version: VERSION, time: new Date().toISOString() });
  const me = currentEmail_();
  const auto = isAdmin_(me) ? issueSession_(me) : '';
  try { const url = ScriptApp.getService().getUrl(); if (url && url !== prop_('ADMIN_URL')) setProp_('ADMIN_URL', url); } catch (err) {}
  return HtmlService.createHtmlOutput(ADMIN_HTML.replace('__AUTO_SESSION__', auto))
    .setTitle('Adizes · Admin')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function currentEmail_() {
  try { return String(Session.getActiveUser().getEmail() || '').trim().toLowerCase(); } catch (err) { return ''; }
}
function adminList_() { return prop_('ADMIN_EMAILS').split(/[,;\s]+/).map(s => s.trim().toLowerCase()).filter(Boolean); }
function adminDomains_() {
  return (CONFIG.ADMIN_DOMAINS || []).concat(adminList_().filter(x => x.charAt(0) === '@').map(x => x.slice(1)))
    .map(d => String(d).toLowerCase().replace(/^@/, '')).filter(Boolean);
}
function isAdmin_(email) {
  email = String(email || '').trim().toLowerCase();
  if (!validEmail_(email)) return false;
  if (adminList_().indexOf(email) >= 0) return true;
  return adminDomains_().indexOf(email.split('@')[1]) >= 0;
}
// People who get the internal notices: listed emails (not whole domains) + it@
function noticeList_() { return adminList_().filter(x => x.charAt(0) !== '@'); }

/* ---------------- sessions (signed tokens, 7 days) ---------------- */
const SESSION_DAYS = 7;
function secret_() {
  let s = prop_('ADMIN_SECRET');
  if (!s) { s = Utilities.getUuid() + randStr_(24); setProp_('ADMIN_SECRET', s); }
  return s;
}
function b64u_(bytesOrStr) { return Utilities.base64EncodeWebSafe(bytesOrStr).replace(/=+$/, ''); }
function sign_(text) { return b64u_(Utilities.computeHmacSha256Signature(text, secret_())); }
function issueSession_(email) {
  const body = email + '|' + (Date.now() + SESSION_DAYS * 864e5);
  return b64u_(body) + '.' + sign_(body);
}
function sessionEmail_(token) {
  const parts = String(token || '').split('.');
  if (parts.length !== 2) return '';
  let body = '';
  try { body = Utilities.newBlob(Utilities.base64DecodeWebSafe(parts[0] + '==='.slice((parts[0].length + 3) % 4))).getDataAsString(); } catch (err) { return ''; }
  if (sign_(body) !== parts[1]) return '';
  const i = body.lastIndexOf('|'), email = body.slice(0, i), exp = Number(body.slice(i + 1));
  if (!(exp > Date.now()) || !isAdmin_(email)) return '';
  return email;
}

/* ---------------- one-time sign-in codes ---------------- */
function codeHash_(email, code) { return b64u_(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, email + '|' + code + '|' + secret_())); }
function loginStart_(p) {
  const email = clean_(p.email, 160).toLowerCase();
  if (!validEmail_(email)) throw new Error('invalid_email');
  // Same answer whether or not the email is allowed (nobody can probe the list).
  if (!isAdmin_(email)) return { ok: true };
  const cache = CacheService.getScriptCache(), key = 'login:' + email;
  const prev = JSON.parse(cache.get(key) || 'null');
  if (prev && Date.now() - prev.at < 30000) return { ok: true, wait: true };
  const code = String(Math.floor(100000 + Math.random() * 900000));
  cache.put(key, JSON.stringify({ h: codeHash_(email, code), at: Date.now(), tries: 0 }), 600);
  const inner = '<p style="margin:0 0 14px">Use this code to sign in to the Adizes Assessments admin:</p>' +
    '<p style="margin:0 0 18px;font:700 32px/1 Arial,sans-serif;letter-spacing:.18em;color:#111111">' + code + '</p>' +
    '<p style="margin:0;color:#6b6f76">It expires in 10 minutes. If you didn’t try to sign in, you can ignore this email.</p>';
  sendMail_(email, 'Your Adizes admin sign-in code: ' + code, 'Your sign-in code: ' + code + '\n\nIt expires in 10 minutes.', emailShell_(inner, 'Adizes Assessments · Admin'));
  return { ok: true };
}
function loginVerify_(p) {
  const email = clean_(p.email, 160).toLowerCase(), code = String(p.code || '').replace(/\D/g, '');
  const cache = CacheService.getScriptCache(), key = 'login:' + email;
  const rec = JSON.parse(cache.get(key) || 'null');
  if (!rec || !isAdmin_(email)) throw new Error('invalid_code');
  if (rec.tries >= 5) { cache.remove(key); throw new Error('too_many_attempts'); }
  if (codeHash_(email, code) !== rec.h) { rec.tries++; cache.put(key, JSON.stringify(rec), 600); throw new Error('invalid_code'); }
  cache.remove(key);
  return { ok: true, token: issueSession_(email), me: email };
}
const PUBLIC_ADMIN_ACTIONS = { loginStart: loginStart_, loginVerify: loginVerify_ };

// Single entry point for the admin page. Returns a JSON string (Dates become ISO strings).
function adminApi(action, payload, token) {
  let out;
  try {
    if (PUBLIC_ADMIN_ACTIONS[action]) {
      out = PUBLIC_ADMIN_ACTIONS[action](payload || {});
    } else {
      const g = currentEmail_();
      const me = sessionEmail_(token) || (isAdmin_(g) ? g : '');
      if (!me) throw new Error('forbidden');
      const fn = ADMIN_ACTIONS[action];
      if (!fn) throw new Error('unknown_action');
      out = fn(payload || {}, me);
      if (out === undefined) out = { ok: true };
    }
    if (out.ok === undefined) out.ok = true;
  } catch (err) {
    console.error('adminApi ' + action, err && err.stack || err);
    out = { ok: false, error: String(err && err.message || err) };
  }
  return JSON.stringify(out);
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
    row['Min Responses'] = minFor_(cur.rec['Type'], p.minResponses);
    update_(LAUNCHES, p.id, row);
    if (cur.rec['Status'] === L_STATUS.OPEN) checkReady_(p.id);
    return p.id;
  }
  if (TESTS.indexOf(p.type) < 0) throw new Error('invalid_type');
  if (!byId_(COMPANIES, p.companyId)) throw new Error('company_not_found');
  if (p.type === 'ES') {
    // Anonymity: an Engagement Survey needs at least 5 active employees in the company and 5 participants.
    const active = rows_(EMPLOYEES).filter(r => r['Company ID'] === p.companyId && r['Status'] !== 'Archived').length;
    if (active < CONFIG.MIN_RESPONSES.ES) throw new Error('es_min_employees');
    if (!p.employeeIds || p.employeeIds.length < CONFIG.MIN_RESPONSES.ES) throw new Error('es_min_participants');
  }
  const id = newId_('L');
  row['Min Responses'] = minFor_(p.type, p.minResponses);
  appendRecord_(LAUNCHES, Object.assign({ 'ID': id, 'Company ID': p.companyId, 'Type': p.type, 'Status': L_STATUS.DRAFT, 'Created At': new Date() }, row));
  if (p.employeeIds) setParticipants_(id, p.employeeIds);
  return id;
}
// ED: at least 1, the admin may ask for more. ES: always exactly 5 (fixed by the anonymity rule).
function minFor_(type, asked) {
  if (type === 'ES') return CONFIG.MIN_RESPONSES.ES;
  return Math.max(CONFIG.MIN_RESPONSES[type] || 1, Math.floor(Number(asked) || 0));
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
  if (l.rec['Type'] === 'ES') {
    const kept = rows_(INVITES).filter(r => r['Launch ID'] === launchId && r['Status'] === I_STATUS.DONE && !want[r['Employee ID']]).length;
    if (Object.keys(want).length + kept < CONFIG.MIN_RESPONSES.ES) throw new Error('es_min_participants');
  }
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
  if (l['Type'] === 'ES') {
    base.responses = rows_(ES_ANSWERS).filter(r => r['Launch ID'] === launchId).map(r => ({
      answers: ES_Q_COLS.map(h => Number(r[h])), importance: ES_I_COLS.map(h => Number(r[h]) || 1),
      area: String(r['Area'] || ''), comments: ES_C_COLS.map(h => String(r[h] || '')),
    }));
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
  if (l['Status'] === L_STATUS.DRAFT) throw new Error('not_ready');
  const list = recipientsList_(to || l['Recipients']);
  if (!list.length) throw new Error('no_recipients');
  if (list.some(x => !validEmail_(x))) throw new Error('invalid_recipients');
  const pdf = DriveApp.getFileById(l['Report File ID']).getBlob();
  pdf.setName(String(pdf.getName()).replace(/ - L-[A-Z0-9]+\.pdf$/, '.pdf'));
  sendReportEmail_(l, list, clean_(note, 2000), pdf, launchCounts_(launchId).done);
  update_(LAUNCHES, launchId, {
    'Status': l['Status'] === L_STATUS.READY ? L_STATUS.SENT : l['Status'],
    'Report Sent At': new Date(), 'Report Sent To': list.join(', '), 'Recipients': list.join(', '), 'Updated At': new Date(),
  });
}
