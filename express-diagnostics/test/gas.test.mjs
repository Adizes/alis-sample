// Backend tests: node express-diagnostics/test/gas.test.mjs  (real apps-script/Code.gs, simulated Google services)
import assert from 'node:assert/strict';
import { loadGas } from '../../shared/test/gas-mock.mjs';

const fakePdf = Buffer.concat([Buffer.from('%PDF-1.3\n'), Buffer.alloc(4000, 65)]).toString('base64');
// Same person as the legacy golden PDF (67-question bank)
const ANSWERS = [
  1, 4, 4, 3, 4, 3, 2, 1, 2, 4, 3, 2, 1, 3, 4, 4, 1, 3, 2, 2,
  2, 5, 5, 3, 5, 4, 3, 4, 4, 4, 2, 5, 3, 3, 2, 5, 3, 4, 4,
  2, 4, 3, 5, 2, 5, 3, 5, 4, 2, 1, 2, 5, 3, 3, 3, 5, 1, 2,
  4, 2, 5, 3, 2, 1, 2, 4, 3,
];
const base = (over = {}) => ({
  action: 'ed_submit', v: 'test', lang: 'es', answers: ANSWERS,
  contact: { name: 'María José  Pérez', email: 'MJ@Example.com', company: '=HYPERLINK("x")', consent: true },
  meta: { page: 'https://www.adizes.com/express-diagnostics?utm_source=linkedin', utm_source: 'linkedin', utm_campaign: 'q4', startedAt: '2026-10-27T15:00:00Z', tz: 'America/Mexico_City' },
  ...over,
});
let n = 0; const t = (name, fn) => { fn(); n++; console.log('  ✓ ' + name); };
const ED_SHEET = 'ED Responses';

console.log('Apps Script — Express Diagnostics (real Code.gs, simulated Google services)');

t('setup: creates spreadsheet, PDF folders, admin list and one 10-minute trigger (idempotent)', () => {
  const { gas, state } = loadGas();
  assert.equal(state.props.DATA_SPREADSHEET_ID, 'SS1');
  assert.ok(state.props.PDF_FOLDER_ID && state.props.PDF_FOLDER_ED);
  assert.equal(state.props.ADMIN_EMAILS, 'dario@adizes.com');
  assert.equal(state.triggers.length, 1); assert.equal(state.triggers[0].m, 10);
  assert.ok(state.sheets[ED_SHEET]);
  gas.setup();
  assert.equal(state.spreadsheets, 1); assert.equal(state.triggers.length, 1);
  assert.equal(state.folders.filter(f => f.name === 'Express Diagnostics').length, 1);
});

t('not set up → clear error', () => {
  const { post } = loadGas({ setup: false });
  assert.equal(post(base()).error, 'not_setup');
});

t('doGet health check', () => {
  const { gas } = loadGas();
  const h = JSON.parse(gas.doGet().getContent());
  assert.equal(h.ok, true); assert.equal(h.service, 'adizes-assessments');
});

t('submit: saves row, scores on the server, text stays literal', () => {
  const { post, sheet } = loadGas();
  const r = post(base());
  assert.equal(r.ok, true);
  assert.match(r.id, /^ED-\d{6}-[A-Z2-9]{6}$/);
  const row = sheet(ED_SHEET).obj(2);
  assert.equal(row['Status'], 'Submitted'); assert.equal(row['Mode'], 'Individual');
  assert.equal(row['Email'], 'mj@example.com');
  assert.equal(row['Full Name'], 'María José Pérez'); assert.equal(row['First Name'], 'María'); assert.equal(row['Last Name'], 'José Pérez');
  assert.equal(row['Company'], '\'=HYPERLINK("x")');
  assert.equal(row['1.1 V Values %'], 50);
  assert.equal(row['3.1 P Planning %'], 72.5);
  assert.equal(row['3.3 CA Corrective Actions %'], 75);
  assert.equal(row['6.1 I Behaviour %'], 12.5);
  assert.equal(row['Q1'], 1); assert.equal(row['Q67'], 3);
  // legacy golden: red = Climate, Responsibility, Reward, Human, Behaviour, Inefficiency
  assert.equal(row['Key Focus Zones'], 6);
  assert.equal(row['Key Focus Areas'], 'Climate | Responsibility Structure | Reward Structure | Human factors | Behaviour | Inefficiency');
  assert.equal(row['Key Focus Zones'] + row['To Improve'] + row['Healthy'], 16);
  assert.equal(row['UTM Source'], 'linkedin'); assert.equal(row['Time Zone'], 'America/Mexico_City');
});

t('submit: rejects bad input', () => {
  const { post } = loadGas();
  assert.equal(post(base({ answers: [1, 2, 3] })).error, 'invalid_answers');
  assert.equal(post(base({ answers: Array(67).fill(6) })).error, 'invalid_answers');
  assert.equal(post(base({ answers: Array(67).fill(null) })).error, 'invalid_answers');
  assert.equal(post(base({ contact: { name: 'Ana', email: 'nope', company: 'X', consent: true } })).error, 'invalid_email');
  assert.equal(post(base({ contact: { name: 'Ana', email: 'a@b.co', company: '', consent: true } })).error, 'invalid_company');
  assert.equal(post(base({ contact: { name: 'Ana', email: 'a@b.co', company: 'X', consent: false } })).error, 'consent_required');
  assert.equal(post({ action: 'zzz' }).error, 'unknown_action');
  assert.equal(JSON.parse(loadGas().gas.doPost({ postData: { contents: '{bad' } }).getContent()).error, 'bad_json');
});

t('deliver: PDF to Drive, email from info@ with attachment, notification to it@ — no Zapier', () => {
  const { post, sheet, state } = loadGas();
  const { id } = post(base());
  const r = post({ action: 'ed_deliver', id, lang: 'es', fileName: 'Diagnostico-Expres-Acme.pdf', pdf: fakePdf });
  assert.equal(r.ok, true);
  assert.equal(state.files.length, 1);
  assert.equal(state.files[0].folder, 'Express Diagnostics');
  assert.equal(state.files[0].blob.name, 'Diagnostico-Expres-Acme - ' + id + '.pdf');
  const [user, notify] = state.emails;
  assert.equal(user.to, 'mj@example.com');
  assert.equal(user.subject, 'Tu reporte de Diagnóstico Exprés');
  assert.equal(user.options.from, 'info@adizes.com');
  assert.equal(user.options.attachments[0].name, 'Diagnostico-Expres-Acme.pdf');
  assert.ok(!('replyTo' in user.options));
  assert.match(user.options.htmlBody, /Zona de enfoque clave/);
  assert.doesNotMatch(user.options.htmlBody + user.body, /calendly|sesi[oó]n|session/i);
  assert.match(user.options.htmlBody, /@v1\.\d+\.\d+\/shared\/assets\/adizes-logo-color\.png/);
  assert.match(user.body, /6 zonas de enfoque clave/);
  assert.equal(notify.to, 'it@adizes.com');
  assert.match(notify.subject, /^\[Express Diagnostics\] María José Pérez · .* · 6 key focus$/);
  assert.ok(!('replyTo' in notify.options));
  assert.equal(state.fetches.length, 0, 'no Zapier / HubSpot');
  const row = sheet(ED_SHEET).obj(2);
  assert.equal(row['Status'], 'Done'); assert.ok(row['Emailed At'] instanceof Date); assert.ok(row['Notified'] instanceof Date);
  assert.match(row['Report URL'], /drive\.google\.com/);
  // idempotent
  assert.equal(post({ action: 'ed_deliver', id, pdf: fakePdf }).already, true);
  assert.equal(state.emails.length, 2);
});

t('deliver: rejects non-PDF, tiny files and unknown id', () => {
  const { post } = loadGas();
  const { id } = post(base());
  assert.equal(post({ action: 'ed_deliver', id, pdf: Buffer.alloc(5000, 66).toString('base64') }).error, 'not_a_pdf');
  assert.equal(post({ action: 'ed_deliver', id, pdf: Buffer.from('%PDF').toString('base64') }).error, 'bad_pdf_size');
  assert.equal(post({ action: 'ed_deliver', id: 'ED-NOPE', pdf: fakePdf }).error, 'not_found');
});

t('deliver: email failure → error returned, row marked Error', () => {
  const { post, sheet } = loadGas({ emailFail: true });
  const { id } = post(base());
  assert.equal(post({ action: 'ed_deliver', id, pdf: fakePdf }).ok, false);
  assert.equal(sheet(ED_SHEET).obj(2)['Status'], 'Error');
});

t('events: PDF downloads', () => {
  const { post, sheet } = loadGas();
  const { id } = post(base());
  post({ action: 'ed_event', id, type: 'pdf_download' });
  post({ action: 'ed_event', id, type: 'pdf_download' });
  assert.equal(post({ action: 'ed_event', id: 'nope', type: 'pdf_download' }).ok, true);
  const row = sheet(ED_SHEET).obj(2);
  assert.equal(row['PDF Downloads'], 2); assert.ok(!('Session Click' in row));
});

t('backup: old rows without PDF get the summary email; recent ones wait', () => {
  const { post, sheet, state, gas } = loadGas();
  post(base({ lang: 'en' })); post(base());
  const sh = sheet(ED_SHEET); const c = sh.heads().indexOf('Submitted At') + 1;
  sh.set(2, c, new Date(Date.now() - 20 * 60 * 1000));
  gas.backupDeliver();
  assert.equal(sh.obj(2)['Status'], 'Done (no PDF)');
  assert.equal(sh.obj(3)['Status'], 'Submitted');
  assert.equal(state.emails[0].subject, 'Your Express Diagnostics report');
  assert.ok(!state.emails[0].options.attachments);
  assert.match(state.emails[0].options.htmlBody, /Here is a summary/);
  assert.match(state.emails[1].options.htmlBody, /no PDF/);
  gas.backupDeliver();
  assert.equal(state.emails.length, 2, 'not sent twice');
});

t('columns added in a new version appear at the end without breaking old rows', () => {
  const { post, sheet } = loadGas();
  post(base());
  const sh = sheet(ED_SHEET);
  // simulate an old sheet that lacks a column: drop "Widget Version"
  const i = sh.heads().indexOf('Widget Version');
  sh.rows.forEach(r => r.splice(i, 1));
  post(base());
  assert.equal(sh.heads()[sh.heads().length - 1], 'Widget Version');
  assert.equal(sh.obj(3)['Widget Version'], 'test');
});

console.log(`\n${n} backend tests passed`);
