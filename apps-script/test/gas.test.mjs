// Backend tests: node apps-script/test/gas.test.mjs  (real apps-script/Code.gs, simulated Google services)
import assert from 'node:assert/strict';
import { loadGas } from '../../shared/test/gas-mock.mjs';

const fakePdf = Buffer.concat([Buffer.from('%PDF-1.3\n'), Buffer.alloc(4000, 65)]).toString('base64');
// Same person as the legacy golden PDF (67-question bank)
export const GOLDEN = [
  1, 4, 4, 3, 4, 3, 2, 1, 2, 4, 3, 2, 1, 3, 4, 4, 1, 3, 2, 2,
  2, 5, 5, 3, 5, 4, 3, 4, 4, 4, 2, 5, 3, 3, 2, 5, 3, 4, 4,
  2, 4, 3, 5, 2, 5, 3, 5, 4, 2, 1, 2, 5, 3, 3, 3, 5, 1, 2,
  4, 2, 5, 3, 2, 1, 2, 4, 3,
];
let n = 0;
const t = (name, fn) => { fn(); n++; console.log('  ✓ ' + name); };
const tokenOf = (link) => new URL(link).searchParams.get('t');

// Company with 4 employees + an open Express Diagnostics launch for 3 of them
function world(opts) {
  const g = loadGas(opts);
  const { admin } = g;
  let s = admin('saveCompany', { name: 'Grupo Ñandú', country: 'México', language: 'es', contactName: 'Laura Ríos', contactEmail: 'laura@nandu.mx' });
  const company = s.companies[0];
  s = admin('importEmployees', { companyId: company.id, rows: [
    { name: 'Ana López', email: 'ana@nandu.mx', area: 'Ventas', position: 'Directora' },
    { name: 'Bruno Díaz', email: 'BRUNO@nandu.mx', area: 'Operaciones', position: 'Gerente' },
    { name: 'Carla Méndez', email: 'carla@nandu.mx', area: 'Finanzas', position: 'CFO' },
    { name: 'Diego Ruiz', email: 'diego@nandu.mx', area: 'Ventas' },
  ] });
  const emp = s.employees;
  s = admin('saveLaunch', { companyId: company.id, type: 'ED', name: 'Dirección 2026', language: 'es', closeDate: '2099-12-31', recipients: 'laura@nandu.mx', employeeIds: emp.slice(0, 3).map(e => e.id) });
  const launchId = s.savedId;
  return Object.assign(g, { company, emp, launchId });
}

console.log('Apps Script — companies, launches, invitations, Express Diagnostics (real Code.gs)');

t('setup: spreadsheet, tabs, report folders, admin list, one hourly trigger (idempotent)', () => {
  const { gas, state } = loadGas();
  assert.equal(state.props.DATA_SPREADSHEET_ID, 'SS1');
  assert.equal(state.props.ADMIN_EMAILS, 'dario@adizes.com');
  assert.deepEqual(Object.keys(state.sheets).sort(), ['Companies', 'ED Answers', 'ES Answers', 'Employees', 'Invitations', 'Launches']);
  assert.ok(state.props.PDF_FOLDER_ED && state.props.PDF_FOLDER_ES);
  assert.equal(state.triggers.length, 1); assert.equal(state.triggers[0].fn, 'tick'); assert.equal(state.triggers[0].h, 1);
  gas.setup();
  assert.equal(state.spreadsheets, 1); assert.equal(state.triggers.length, 1);
});

t('admin access: everyone gets the sign-in page; every call needs an admin session', () => {
  const g = loadGas();
  const page = g.gas.doGet({ parameter: {} });
  assert.equal(page.title, 'Adizes · Admin'); assert.match(page.getContent(), /<html/i);
  assert.doesNotMatch(page.getContent(), /__AUTO_SESSION__/, 'Google-recognized admin gets an automatic session');
  g.state.activeUser = 'intruso@adizes.com';
  assert.match(g.gas.doGet({ parameter: {} }).getContent(), /autoSession: ''/);
  assert.equal(g.admin('state').error, 'forbidden');
  assert.equal(g.admin('saveCompany', { name: 'X' }).error, 'forbidden');
  assert.equal(JSON.parse(g.gas.adminApi('state', {}, 'forged.token')).error, 'forbidden');
  g.state.activeUser = '';
  assert.equal(g.admin('state').error, 'forbidden');
  assert.throws(() => g.gas.setup(), /forbidden/);
  g.state.activeUser = 'DARIO@adizes.com';
  assert.equal(g.admin('state').ok, true);
  assert.equal(JSON.parse(g.gas.doGet({ parameter: { health: '1' } }).getContent()).ok, true);
});

t('sign-in with an emailed code: whitelisted emails and domains (@nuclea.solutions), 7-day session', () => {
  const g = loadGas();
  g.state.activeUser = '';   // e.g. an account from another domain: Google doesn't share the email
  const api = (a, p, tk) => JSON.parse(g.gas.adminApi(a, p, tk));
  // not allowed → same answer, but no email is sent
  assert.equal(api('loginStart', { email: 'random@gmail.com' }).ok, true);
  assert.equal(g.state.emails.length, 0);
  assert.equal(api('loginStart', { email: 'nope' }).error, 'invalid_email');
  // whitelisted domain
  assert.equal(api('loginStart', { email: 'Ana@Nuclea.Solutions' }).ok, true);
  const mail = g.state.emails[0];
  assert.equal(mail.to, 'ana@nuclea.solutions'); assert.equal(mail.options.from, 'info@adizes.com');
  const code = mail.subject.match(/(\d{6})$/)[1];
  assert.equal(api('loginStart', { email: 'ana@nuclea.solutions' }).wait, true, '30 s between codes');
  assert.equal(api('loginVerify', { email: 'ana@nuclea.solutions', code: '000000' === code ? '111111' : '000000' }).error, 'invalid_code');
  const ok = api('loginVerify', { email: 'ana@nuclea.solutions', code });
  assert.equal(ok.ok, true); assert.equal(ok.me, 'ana@nuclea.solutions');
  assert.equal(api('loginVerify', { email: 'ana@nuclea.solutions', code }).error, 'invalid_code', 'codes work once');
  const st = api('state', {}, ok.token);
  assert.equal(st.ok, true); assert.equal(st.me, 'ana@nuclea.solutions');
  // tampered token
  const [b, sig] = ok.token.split('.');
  assert.equal(api('state', {}, b + '.' + sig.slice(0, -2) + 'xx').error, 'forbidden');
  // removing the domain revokes existing sessions
  g.gas.CONFIG.ADMIN_DOMAINS = [];
  assert.equal(api('state', {}, ok.token).error, 'forbidden');
  // single emails and "@domain" entries in ADMIN_EMAILS
  g.state.props.ADMIN_EMAILS = 'dario@adizes.com, @partner.com';
  api('loginStart', { email: 'lu@partner.com' });
  const c2 = g.state.emails[g.state.emails.length - 1].subject.match(/(\d{6})$/)[1];
  assert.equal(api('loginVerify', { email: 'lu@partner.com', code: c2 }).ok, true);
  // 5 wrong attempts burn the code
  api('loginStart', { email: 'dario@adizes.com' });
  const c3 = g.state.emails[g.state.emails.length - 1].subject.match(/(\d{6})$/)[1];
  for (let i = 0; i < 5; i++) api('loginVerify', { email: 'dario@adizes.com', code: c3 === '999999' ? '888888' : '999999' });
  assert.equal(api('loginVerify', { email: 'dario@adizes.com', code: c3 }).error, 'too_many_attempts');
});

t('companies + employees: create, edit, import (dedupe by email), validation, archive', () => {
  const { admin, company, emp, sheet } = world();
  assert.equal(emp.length, 4);
  assert.equal(emp[1].email, 'bruno@nandu.mx');
  let s = admin('importEmployees', { companyId: company.id, rows: [{ name: 'Ana Otra', email: 'ana@nandu.mx' }, { name: 'X', email: 'bad' }, { name: '=CMD()', email: 'eva@nandu.mx' }] });
  assert.equal(s.imported, 1);
  assert.equal(sheet('Employees').obj(6)['Full Name'], "'=CMD()");
  assert.equal(admin('saveEmployee', { companyId: company.id, name: 'Dup', email: 'diego@nandu.mx' }).error, 'duplicate_email');
  assert.equal(admin('saveEmployee', { companyId: company.id, name: 'Sin correo', email: '' }).error, 'invalid_email');
  s = admin('saveEmployee', { id: emp[3].id, companyId: company.id, name: 'Diego Ruiz Soto', email: 'diego@nandu.mx', area: 'Ventas' });
  assert.equal(s.employees.find(e => e.id === emp[3].id).name, 'Diego Ruiz Soto');
  s = admin('archiveEmployee', { id: emp[3].id, archived: true });
  assert.equal(s.employees.find(e => e.id === emp[3].id).status, 'Archived');
  s = admin('saveCompany', { id: company.id, name: 'Grupo Ñandú SA', language: 'en' });
  assert.equal(s.companies[0].name, 'Grupo Ñandú SA'); assert.equal(s.companies[0].language, 'en');
  assert.equal(admin('saveCompany', { name: '' }).error, 'name_required');
});

t('launch: draft with participants → open + invitations from info@ with personal links', () => {
  const { admin, launchId, state } = world();
  let s = admin('state');
  let l = s.launches[0];
  assert.equal(l.status, 'Draft'); assert.equal(l.total, 3); assert.equal(l.done, 0); assert.equal(l.minResponses, 1);
  const links = s.invites.map(i => i.link);
  assert.ok(links.every(x => /^https:\/\/www\.adizes\.com\/express-diagnostics\?t=[A-Za-z0-9]{24}$/.test(x)));
  assert.equal(new Set(links).size, 3);
  // participants can't answer a draft
  assert.equal(world().post({ action: 'p_load', t: 'x'.repeat(24) }).error, 'invalid_link');
  s = admin('openLaunch', { launchId, send: true });
  assert.equal(s.sent, 3);
  assert.equal(s.launches[0].status, 'Open');
  assert.ok(s.invites.every(i => i.status === 'Sent' && i.sentAt));
  const mail = state.emails[0];
  assert.equal(mail.to, 'ana@nandu.mx');
  assert.equal(mail.subject, 'Grupo Ñandú: Diagnóstico Exprés');
  assert.equal(mail.options.from, 'info@adizes.com');
  assert.match(mail.options.htmlBody, /Hola, Ana:/);
  assert.match(mail.options.htmlBody, /31 de diciembre de 2099/);
  assert.ok(mail.options.htmlBody.includes(s.invites[0].link));
  assert.match(mail.body, /reporte grupal/);
  assert.equal(admin('openLaunch', { launchId }).error, 'not_draft');
});

t('participant: load → submit once → thank you; nobody else can reuse the link', () => {
  const { admin, post, launchId, sheet } = world();
  let s = admin('openLaunch', { launchId, send: false });
  assert.equal(s.invites[0].status, 'Pending');
  const tk = tokenOf(s.invites[0].link);
  const info = post({ action: 'p_load', t: tk });
  assert.deepEqual({ ...info }, { ok: true, state: 'open', type: 'ED', lang: 'es', company: 'Grupo Ñandú', closeDate: '2099-12-31', firstName: 'Ana' });
  assert.equal(post({ action: 'p_submit', t: tk, answers: [1, 2] }).error, 'invalid_answers');
  assert.equal(post({ action: 'p_submit', t: tk, answers: GOLDEN, lang: 'es' }).ok, true);
  assert.equal(post({ action: 'p_submit', t: tk, answers: GOLDEN }).error, 'already_completed');
  assert.equal(post({ action: 'p_load', t: tk }).state, 'completed');
  const row = sheet('ED Answers').obj(2);
  assert.equal(row['Full Name'], 'Ana López'); assert.equal(row['Launch ID'], launchId);
  assert.equal(row['1.1 V values %'], 50); assert.equal(row['3.1 P planning %'], 72.5); assert.equal(row['Q67'], 3);
  s = admin('state');
  assert.equal(s.launches[0].done, 1); assert.equal(s.launches[0].status, 'Open');
  assert.equal(post({ action: 'p_load', t: 'nope' }).error, 'invalid_link');
  assert.equal(post({ action: 'zzz' }).error, 'unknown_action');
});

t('ready: last participant → Ready + notice to admins and it@; report data, Drive, email to recipients', () => {
  const { admin, post, launchId, state } = world();
  let s = admin('openLaunch', { launchId, send: true });
  const team = [GOLDEN, GOLDEN.map(v => (v === 1 ? 3 : v)), GOLDEN.map((v, i) => (i % 2 ? 5 : 2))];
  s.invites.forEach((inv, i) => assert.equal(post({ action: 'p_submit', t: tokenOf(inv.link), answers: team[i] }).ok, true));
  s = admin('state');
  assert.equal(s.launches[0].status, 'Ready'); assert.equal(s.launches[0].done, 3); assert.ok(s.launches[0].readyAt);
  const notice = state.emails.find(m => /^\[Listo para reporte\]/.test(m.subject));
  assert.equal(notice.to, 'dario@adizes.com,it@adizes.com');  // whole domains never get internal notices
  assert.match(notice.subject, /Grupo Ñandú · Diagnóstico Exprés · Dirección 2026/);
  assert.match(notice.options.htmlBody, /3 de 3 respuestas/);
  // closed for anyone else
  assert.equal(post({ action: 'p_load', t: tokenOf(s.invites[0].link) }).state, 'completed');
  // report data = the 3 responses with names
  const d = admin('reportData', { launchId });
  assert.equal(d.type, 'ED'); assert.equal(d.company, 'Grupo Ñandú'); assert.deepEqual(d.names, ['Ana López', 'Bruno Díaz', 'Carla Méndez']);
  assert.deepEqual(d.responses[0], GOLDEN);
  assert.equal(admin('sendReport', { launchId }).error, 'no_report');
  s = admin('saveReport', { launchId, pdf: fakePdf, fileName: 'Diagnostico-Expres-Grupo-Nandu.pdf' });
  assert.match(s.launches[0].reportUrl, /drive\.google\.com/);
  assert.equal(state.files[0].folder, 'Express Diagnostics');
  assert.equal(admin('sendReport', { launchId, to: 'mal' }).error, 'invalid_recipients');
  s = admin('sendReport', { launchId, note: 'Comentarios en la sesión del jueves.' });
  const mail = state.emails[state.emails.length - 1];
  assert.equal(mail.to, 'laura@nandu.mx');
  assert.equal(mail.subject, 'Reporte de Diagnóstico Exprés — Grupo Ñandú');
  assert.equal(mail.options.attachments[0].name, 'Diagnostico-Expres-Grupo-Nandu.pdf');
  assert.match(mail.options.htmlBody, /con base en 3 respuestas/);
  assert.match(mail.options.htmlBody, /sesión del jueves/);
  assert.equal(s.launches[0].status, 'Report sent'); assert.equal(s.launches[0].reportSentTo, 'laura@nandu.mx');
});

t('dates that Sheets turned into Date objects still format correctly (no "NaN" in emails)', () => {
  const g = world();
  const sh = g.sheet('Launches'); const col = sh.heads().indexOf('Close Date') + 1;
  sh.set(2, col, new Date(2026, 10, 19));            // what Sheets returned in production
  const s = g.admin('openLaunch', { launchId: g.launchId, send: true });
  assert.equal(s.launches[0].closeDate, '2026-11-19');
  assert.match(g.state.emails[0].options.htmlBody, /antes del 19 de noviembre de 2026/);
  assert.doesNotMatch(g.state.emails[0].options.htmlBody, /NaN|undefined/);
});

t('a report can be sent while the launch is still open (status stays Open)', () => {
  const g = world();
  let s = g.admin('openLaunch', { launchId: g.launchId, send: false });
  g.post({ action: 'p_submit', t: tokenOf(s.invites[0].link), answers: GOLDEN });
  g.admin('saveReport', { launchId: g.launchId, pdf: fakePdf, fileName: 'r.pdf' });
  s = g.admin('sendReport', { launchId: g.launchId, to: 'laura@nandu.mx' });
  assert.equal(s.ok, true); assert.equal(s.launches[0].status, 'Open'); assert.ok(s.launches[0].reportSentAt);
});

t('participants can be added/removed while open; completed ones are kept', () => {
  const { admin, post, launchId, emp } = world();
  let s = admin('openLaunch', { launchId, send: false });
  post({ action: 'p_submit', t: tokenOf(s.invites[0].link), answers: GOLDEN });
  s = admin('setParticipants', { launchId, employeeIds: [emp[1].id, emp[3].id] });
  const l = s.launches[0];
  assert.equal(l.total, 3); // Ana (completed, kept) + Bruno + Diego; Carla removed
  assert.deepEqual(s.invites.map(i => i.employeeId).sort(), [emp[0].id, emp[1].id, emp[3].id].sort());
  const carla = s.invites.find(i => i.employeeId === emp[2].id);
  assert.equal(carla, undefined);
});

t('force finish (≥ minimum), reopen with a new date, close, delete only drafts', () => {
  const { admin, post, launchId, company, emp } = world();
  let s = admin('openLaunch', { launchId, send: false });
  assert.equal(admin('finish', { launchId }).error, 'below_minimum');
  assert.equal(admin('reportData', { launchId }).error, 'below_minimum');
  post({ action: 'p_submit', t: tokenOf(s.invites[0].link), answers: GOLDEN });
  s = admin('finish', { launchId });
  assert.equal(s.launches[0].status, 'Ready');
  assert.equal(post({ action: 'p_load', t: tokenOf(s.invites[1].link) }).state, 'closed');
  assert.equal(post({ action: 'p_submit', t: tokenOf(s.invites[1].link), answers: GOLDEN }).error, 'closed');
  s = admin('reopen', { launchId, closeDate: '2099-01-31' });
  assert.equal(s.launches[0].status, 'Open'); assert.equal(s.launches[0].closeDate, '2099-01-31');
  s = admin('close', { launchId });
  assert.equal(s.launches[0].status, 'Closed');
  assert.equal(admin('deleteLaunch', { id: launchId }).error, 'only_drafts');
  // ES needs 5 active employees in the company (it has 4) and 5 participants
  assert.equal(admin('saveLaunch', { companyId: company.id, type: 'ES', name: 'Borrador', language: 'es', employeeIds: emp.map(e => e.id) }).error, 'es_min_employees');
  s = admin('saveEmployee', { companyId: company.id, name: 'Eva Soto', email: 'eva@nandu.mx', area: 'Ventas' });
  const all = s.employees.map(e => e.id);
  assert.equal(admin('saveLaunch', { companyId: company.id, type: 'ES', name: 'Borrador', language: 'es', employeeIds: all.slice(0, 4) }).error, 'es_min_participants');
  s = admin('saveLaunch', { companyId: company.id, type: 'ES', name: 'Borrador', language: 'es', minResponses: 9, employeeIds: all });
  const esId = s.savedId;
  assert.equal(s.launches.find(l => l.id === esId).minResponses, 5, 'ES minimum is always 5 (the field does not apply)');
  assert.equal(admin('saveLaunch', { id: esId, name: 'Borrador', language: 'es', minResponses: 2 }).launches.find(l => l.id === esId).minResponses, 5);
  assert.equal(admin('setParticipants', { launchId: esId, employeeIds: all.slice(0, 3) }).error, 'es_min_participants');
  s = admin('deleteLaunch', { id: esId });
  assert.equal(s.launches.length, 1);
  assert.equal(admin('saveLaunch', { companyId: company.id, type: 'XX', name: 'x' }).error, 'invalid_type');
  assert.equal(admin('saveLaunch', { companyId: company.id, type: 'ED', name: 'x', recipients: 'a@b.co, nope' }).error, 'invalid_recipients');
});

t('reminders go only to invited people who have not answered', () => {
  const { admin, post, launchId, state } = world();
  let s = admin('openLaunch', { launchId, send: true });
  post({ action: 'p_submit', t: tokenOf(s.invites[0].link), answers: GOLDEN });
  const before = state.emails.length;
  s = admin('remind', { launchId });
  assert.equal(s.sent, 2);
  const sent = state.emails.slice(before);
  assert.deepEqual(sent.map(m => m.to), ['bruno@nandu.mx', 'carla@nandu.mx']);
  assert.match(sent[0].subject, /^Recordatorio — Grupo Ñandú/);
  assert.match(sent[0].options.htmlBody, /siguen pendientes/);
  assert.equal(s.invites.find(i => i.employeeId !== s.invites[0].employeeId && i.status === 'Sent').reminders, 1);
});

t('hourly tick: close date passed → Ready with the minimum; otherwise one notice', () => {
  const { admin, post, launchId, gas, state, company, emp } = world();
  let s = admin('saveLaunch', { id: launchId, name: 'Dirección 2026', language: 'es', closeDate: '2020-01-01' });
  s = admin('openLaunch', { launchId, send: false });
  gas.tick();
  assert.equal(admin('state').launches[0].status, 'Open');
  assert.equal(state.emails.filter(m => /Fecha de cierre sin el mínimo/.test(m.subject)).length, 1);
  gas.tick();
  assert.equal(state.emails.filter(m => /Fecha de cierre sin el mínimo/.test(m.subject)).length, 1, 'only once');
  // can't submit? still open → someone answers late → Ready on submit because the date passed
  post({ action: 'p_submit', t: tokenOf(s.invites[0].link), answers: GOLDEN });
  assert.equal(admin('state').launches[0].status, 'Ready');
});

t('email failure while inviting → error returned, nothing marked as sent', () => {
  const g = world({ emailFail: true });
  const s = g.admin('openLaunch', { launchId: g.launchId, send: true });
  assert.equal(s.ok, false); assert.match(s.error, /mail down/);
  assert.ok(g.admin('state').invites.every(i => i.status === 'Pending'));
});

/* ---------------- Engagement Survey ---------------- */
function esWorld(n = 6) {
  const g = loadGas();
  let s = g.admin('saveCompany', { name: 'Acme', language: 'en', contactEmail: 'hr@acme.com' });
  const cid = s.companies[0].id;
  const areas = ['Sales', 'Sales', 'Sales', 'Sales', 'Sales', 'Ops', 'Ops', 'Finance'];
  s = g.admin('importEmployees', { companyId: cid, rows: areas.slice(0, n).map((a, i) => ({ name: 'Person ' + i, email: 'p' + i + '@acme.com', area: a })) });
  s = g.admin('saveLaunch', { companyId: cid, type: 'ES', name: 'Engagement 2026', language: 'en', employeeIds: s.employees.map(e => e.id) });
  const launchId = s.savedId;
  s = g.admin('openLaunch', { launchId, send: true });
  return Object.assign(g, { launchId, invites: s.invites });
}
const esAnswers = (v) => { const a = Array(50).fill(v); a[49] = 4; return a; };
const esImp = (k) => Array.from({ length: 50 }, (_, i) => (i < k ? 3 : i % 2 ? 2 : 1));

t('ES: minimum 5, invitation in the launch language with anonymity text, link to /engagement-survey', () => {
  const g = esWorld();
  const s = g.admin('state');
  assert.equal(s.launches[0].minResponses, 5);
  assert.match(g.invites[0].link, /^https:\/\/www\.adizes\.com\/engagement-survey\?t=/);
  const m = g.state.emails[0];
  assert.equal(m.subject, 'Acme: Engagement Survey');
  assert.match(m.options.htmlBody, /The survey is anonymous/);
  const info = g.post({ action: 'p_load', t: tokenOf(g.invites[0].link) });
  assert.equal(info.type, 'ES'); assert.equal(info.lang, 'en'); assert.equal(info.firstName, undefined, 'no name for an anonymous survey');
});

t('ES: answers validated (importance 1–15 "most important"), stored without names, area kept, random order', () => {
  const g = esWorld();
  const tk = tokenOf(g.invites[0].link);
  assert.equal(g.post({ action: 'p_submit', t: tk, answers: esAnswers(5), importance: esImp(0) }).error, 'invalid_importance');
  assert.equal(g.post({ action: 'p_submit', t: tk, answers: esAnswers(5), importance: esImp(16) }).error, 'invalid_importance');
  assert.equal(g.post({ action: 'p_submit', t: tk, answers: esAnswers(7), importance: esImp(3) }).error, 'invalid_answers');
  const com = Array(50).fill(''); com[3] = '=Better coffee\nplease';
  assert.equal(g.post({ action: 'p_submit', t: tk, answers: esAnswers(5), importance: esImp(3), comments: com }).ok, true);
  const sh = g.sheet('ES Answers'); const row = sh.obj(2);
  assert.equal(row['Area'], 'Sales'); assert.equal(row['Result'], 'fully');
  assert.match(row['Submitted On'], /^\d{4}-\d{2}-\d{2}$/);
  assert.equal(row['C4'], "'=Better coffee please");
  assert.ok(!sh.heads().some(h => /Employee|Invitation|Name/.test(h)), 'no identifying columns');
  const inv = g.sheet('Invitations').obj(2);
  assert.match(inv['Completed On'], /^\d{4}-\d{2}-\d{2}$/, 'only the day, not the time');
  for (let i = 1; i < 6; i++) g.post({ action: 'p_submit', t: tokenOf(g.invites[i].link), answers: esAnswers(i % 2 ? 2 : 4), importance: esImp(2) });
  assert.equal(sh.rows.length, 7);
  assert.equal(g.admin('state').launches[0].status, 'Ready');
  const d = g.admin('reportData', { launchId: g.launchId });
  assert.equal(d.type, 'ES'); assert.equal(d.responses.length, 6); assert.equal(d.total, 6);
  assert.deepEqual(d.responses.map(r => r.area).sort(), ['Ops', 'Sales', 'Sales', 'Sales', 'Sales', 'Sales']);
  assert.ok(d.responses.some(r => r.comments[3] === "'=Better coffee please" || r.comments[3] === '=Better coffee please'));
});

t('ES: below 5 answers no report; a launch can never have fewer than 5 participants', () => {
  const g = esWorld(6);
  g.invites.slice(0, 4).forEach(i => g.post({ action: 'p_submit', t: tokenOf(i.link), answers: esAnswers(4), importance: esImp(1) }));
  // removing pending people below 5 participants is refused (the 4 who answered always stay)
  const ids = g.admin('state').invites.filter(i => i.status === 'Completed').map(i => i.employeeId);
  assert.equal(g.admin('setParticipants', { launchId: g.launchId, employeeIds: ids }).error, 'es_min_participants');
  const s = g.admin('state');
  assert.equal(s.launches[0].done, 4); assert.equal(s.launches[0].status, 'Open');
  assert.equal(g.admin('reportData', { launchId: g.launchId }).error, 'below_minimum');
  assert.equal(g.admin('finish', { launchId: g.launchId }).error, 'below_minimum');
});

t('Latvian and Lithuanian launches: invitation texts and dates in the launch language', () => {
  for (const [lang, subject, date, body] of [
    ['lv', 'Acme: Iesaistes aptauja', '2099. gada 30. novembris', /aicina jūs piedalīties aptaujā “Iesaistes aptauja”/],
    ['lt', 'Acme: Įsitraukimo apklausa', '2099 m. lapkričio 30 d.', /kviečia jus dalyvauti apklausoje „Įsitraukimo apklausa“/],
  ]) {
    const g = loadGas();
    let s = g.admin('saveCompany', { name: 'Acme', language: lang, contactEmail: 'hr@acme.com' });
    const cid = s.companies[0].id;
    s = g.admin('importEmployees', { companyId: cid, rows: [0, 1, 2, 3, 4].map(i => ({ name: 'Persona ' + i, email: 'p' + i + '@acme.com', area: 'A' })) });
    s = g.admin('saveLaunch', { companyId: cid, type: 'ES', name: 'X', language: lang, closeDate: '2099-11-30', employeeIds: s.employees.map(e => e.id) });
    assert.equal(s.launches[0].language, lang);
    s = g.admin('openLaunch', { launchId: s.savedId, send: true });
    const m = g.state.emails[0];
    assert.equal(m.subject, subject);
    assert.match(m.options.htmlBody, body);
    assert.ok(m.options.htmlBody.includes(date), date);
    assert.equal(g.post({ action: 'p_load', t: tokenOf(s.invites[0].link) }).lang, lang);
  }
});

console.log(`\n${n} backend tests passed`);
