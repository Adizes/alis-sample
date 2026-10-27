/*************************************************************************************
 * ADIZES ASSESSMENTS — BACKEND + ADMIN (Google Apps Script)
 * Express Diagnostics · Engagement Survey
 * -----------------------------------------------------------------------------------
 * GENERATED FILE: edit apps-script/src/*.gs, admin/src/* and shared/*, then `npm run build`.
 *
 * Companies → employees → launches (one test run) → invitations (one personal link each).
 * Participants answer on adizes.com with their link (?t=TOKEN) and only see a thank-you page.
 * The admin (this same project, a second deployment restricted to adizes.com) manages
 * everything, generates the group report (PDF, in the browser) and emails it.
 *
 * Public API (POST, Content-Type text/plain, JSON body) used by the Webflow widgets:
 *   p_load   → { t }                       → launch info for that invitation
 *   p_submit → { t, answers, ... }         → saves the answers (once per invitation)
 *
 * First time: run setup() once from the editor. Deployments (Deploy → New deployment → Web app):
 *   "Public": Execute as Me · Who has access: Anyone                  → URL for the Webflow embeds
 *   "Admin":  Execute as Me · Who has access: Anyone within adizes.com → URL of the admin
 * Admins: Project Settings → Script Properties → ADMIN_EMAILS (comma separated).
 *************************************************************************************/

const CONFIG = {
  EMAIL: {
    FROM_ADDRESS: 'info@adizes.com',  // "Send mail as" alias of the account that owns this script
    FROM_NAME: 'Adizes Institute',
    NOTIFY_TO: 'it@adizes.com',       // internal notifications (same domain → sent WITHOUT Reply-To)
  },
  // Webflow pages where participants answer (the personal link adds ?t=TOKEN)
  PAGES: {
    ED: 'https://www.adizes.com/express-diagnostics',
    ES: 'https://www.adizes.com/engagement-survey',
  },
  ASSETS_BASE: 'https://cdn.jsdelivr.net/gh/Adizes/alis-sample@v1.0.0/shared/assets/',
  // Optional: leave '' and setup() creates them (IDs are then kept in Script Properties).
  DATA_SPREADSHEET_ID: '',
  PDF_FOLDER_ID: '',
  MIN_RESPONSES: { ED: 1, ES: 5 },
  MAX_PDF_BYTES: 8 * 1024 * 1024,
};
const VERSION = "1.0.0";
const TESTS = ['ED', 'ES'];

/* ----------------------------------------------------------------------------------
 * Texts sent by the server (emails to participants and report recipients) per language.
 * To add a language, copy the "en" block. Internal notices to admins are in Spanish.
 * ---------------------------------------------------------------------------------- */
const LABELS = {
  en: {
    tests: { ED: 'Express Diagnostics', ES: 'Engagement Survey' },
    invite: {
      subject: '{company}: {test}',
      reminderSubject: 'Reminder — {company}: {test}',
      hi: 'Hi {first},',
      body: '{company} has invited you to take part in the {test}, conducted together with the Adizes Institute. It takes about 10 minutes.',
      reminder: 'This is a friendly reminder: your answers to the {test} for {company} are still pending.',
      privacy: {
        ED: 'Your answers are combined with those of the other participants in a group report for {company}.',
        ES: 'The survey is anonymous: {company} only receives aggregated results, never individual answers.',
      },
      deadline: 'Please complete it by {date}.',
      cta: 'Start',
      personal: 'This link is personal. Please do not share it.',
      sign: 'The Adizes Institute team',
      footer: 'You received this email because {company} invited you to participate.',
    },
    report: {
      subject: '{test} report — {company}',
      hi: 'Hello,',
      body: 'Attached is the {test} report for {company} ({launch}), based on {n} responses.',
      sign: 'The Adizes Institute team',
      footer: 'Adizes Institute · www.adizes.com',
    },
  },
  es: {
    tests: { ED: 'Diagnóstico Exprés', ES: 'Encuesta de Compromiso' },
    invite: {
      subject: '{company}: {test}',
      reminderSubject: 'Recordatorio — {company}: {test}',
      hi: 'Hola, {first}:',
      body: '{company} te invita a participar en el {test}, que realiza junto con el Instituto Adizes. Toma alrededor de 10 minutos.',
      reminder: 'Te recordamos que tus respuestas al {test} de {company} siguen pendientes.',
      privacy: {
        ED: 'Tus respuestas se combinan con las de los demás participantes en un reporte grupal para {company}.',
        ES: 'La encuesta es anónima: {company} solo recibe resultados agregados, nunca respuestas individuales.',
      },
      deadline: 'Por favor respóndela antes del {date}.',
      cta: 'Comenzar',
      personal: 'Este enlace es personal. Por favor no lo compartas.',
      sign: 'El equipo del Instituto Adizes',
      footer: 'Recibiste este correo porque {company} te invitó a participar.',
    },
    report: {
      subject: 'Reporte de {test} — {company}',
      hi: 'Hola:',
      body: 'Adjuntamos el reporte de {test} de {company} ({launch}), con base en {n} respuestas.',
      sign: 'El equipo del Instituto Adizes',
      footer: 'Instituto Adizes · www.adizes.com',
    },
  },
};
function L_(lang) { return LABELS[lang] || LABELS.en; }


/* ===== shared/ed-engine.js (same file the widgets and the admin use) ===== */
/* Express Diagnostics — scoring engine (exact port of the legacy s.adizes.com algorithm).
 * Plain ES5 so the SAME file runs in the browser widget, in the admin and in Apps Script.
 *
 * Legacy rules (see express-diagnostics/LEGACY.md):
 *  - Raw answers 1..5. 1 = "cannot answer" → excluded. 2..5 → 1..4.
 *  - Per question: dispersion = sample std dev (n-1); n<=1 → 0.
 *    middle = the mode if exactly one value is the most frequent; otherwise mean − dispersion/2.
 *    No valid answers (n = 0) → middle 0, dispersion 0, and the report shows the base statement.
 *  - Text: middle ≥ 3 → zone 1 (base), < 2 → zone 3, else zone 2.
 *  - Colour: ≥ 3 green, ≥ 2 yellow, else red. Border: 1 participant → dotted;
 *    dispersion ≥ 1 → thick; ≥ 0.7 → thin; else dotted.
 *  - Category (cell): mean of its questions' middles (n=0 questions count as 0), mean of dispersions,
 *    percent = middle / 4 * 100, participants = the minimum n of its questions.
 */
var ED = (function () {
  var NORMS = { upperMiddle: 3, lowerMiddle: 2, upperDispersion: 1, lowerDispersion: 0.7, scale: 4 };

  // The 16 matrix cells, in report order (categoryID ascending). `key` is used by the language files.
  var CELLS = [
    { id: 17, code: '1.1 V', key: 'values' },
    { id: 18, code: '1.2 C', key: 'climate' },
    { id: 20, code: '2.1 H', key: 'responsibility' },
    { id: 21, code: '2.2 V', key: 'authority' },
    { id: 22, code: '2.3 R', key: 'reward' },
    { id: 23, code: '3.1 P', key: 'planning' },
    { id: 24, code: '3.2 I', key: 'information' },
    { id: 25, code: '3.3 CA', key: 'corrective' },
    { id: 26, code: '4/5 1 CI', key: 'client' },
    { id: 27, code: '4/5 2 T', key: 'transformation' },
    { id: 28, code: '4/5 3 HR', key: 'human' },
    { id: 29, code: '4/5 4 F', key: 'financial' },
    { id: 30, code: '6.1 I', key: 'behaviour' },
    { id: 31, code: '6.2 E', key: 'changes' },
    { id: 32, code: '6.3 A', key: 'inefficiency' },
    { id: 33, code: '6.4 P', key: 'ineffectiveness' },
  ];

  // Category of each of the 67 questions (questions 68–72 were blank in production and are not used).
  var QUESTION_CATS = [].concat(
    rep(17, 3), rep(18, 6), rep(20, 5), rep(21, 4), rep(22, 2), rep(23, 10), rep(24, 5), rep(25, 4),
    rep(26, 5), rep(27, 5), rep(28, 3), rep(29, 4), rep(30, 2), rep(31, 4), rep(32, 2), rep(33, 3)
  );

  // Radar charts (8 axes each, clockwise from the top) and the causal-factors diagram.
  var RADARS = [[17, 18, 20, 21, 22, 23, 24, 25], [26, 27, 28, 29, 30, 31, 32, 33]];

  function rep(v, n) { var a = []; for (var i = 0; i < n; i++) a.push(v); return a; }

  function questionStats(raws) {
    var xs = [];
    for (var i = 0; i < raws.length; i++) { var r = Number(raws[i]); if (r > 1 && r <= 5) xs.push(r - 1); }
    var n = xs.length;
    if (!n) return { n: 0, middle: 0, dispersion: 0, mean: 0, mode: null };
    var sum = 0; for (var j = 0; j < n; j++) sum += xs[j];
    var mean = sum / n;
    var sq = 0; for (var k = 0; k < n; k++) sq += (xs[k] - mean) * (xs[k] - mean);
    var dispersion = n > 1 ? Math.sqrt(sq / (n - 1)) : 0;
    var freq = {}, max = 0;
    for (var m = 0; m < n; m++) { freq[xs[m]] = (freq[xs[m]] || 0) + 1; if (freq[xs[m]] > max) max = freq[xs[m]]; }
    var tops = []; for (var v in freq) if (freq[v] === max) tops.push(Number(v));
    var mode = tops.length === 1 ? tops[0] : null;
    return { n: n, middle: mode !== null ? mode : mean - dispersion / 2, dispersion: dispersion, mean: mean, mode: mode };
  }

  function colorOf(middle) { return middle >= NORMS.upperMiddle ? 'green' : middle >= NORMS.lowerMiddle ? 'yellow' : 'red'; }
  function borderOf(n, dispersion) {
    if (n === 1) return 'dotted';
    if (dispersion >= NORMS.upperDispersion) return 'thick';
    if (dispersion >= NORMS.lowerDispersion) return 'thin';
    return 'dotted';
  }
  function zoneOf(st) {
    if (!st.n) return 0; // no valid answers: legacy shows the base statement
    return st.middle >= NORMS.upperMiddle ? 1 : st.middle < NORMS.lowerMiddle ? 3 : 2;
  }
  function pct(middle) { return middle / NORMS.scale * 100; }

  /**
   * responses: array of respondents, each an array of raw answers (1..5) in question order.
   * opts.cats: optional per-question category list (defaults to the 67-question bank).
   */
  function score(responses, opts) {
    opts = opts || {};
    var cats = opts.cats || QUESTION_CATS;
    var questions = [];
    for (var q = 0; q < cats.length; q++) {
      var raws = [];
      for (var r = 0; r < responses.length; r++) raws.push(responses[r][q]);
      var st = questionStats(raws);
      questions.push({
        i: q, cat: cats[q], n: st.n, middle: st.middle, dispersion: st.dispersion,
        color: colorOf(st.middle), border: borderOf(st.n, st.dispersion), zone: zoneOf(st),
      });
    }
    var cells = [];
    for (var c = 0; c < CELLS.length; c++) {
      var qs = questions.filter(function (x) { return x.cat === CELLS[c].id; });
      if (!qs.length) continue;
      var mid = 0, disp = 0, n = Infinity;
      qs.forEach(function (x) { mid += x.middle; disp += x.dispersion; if (x.n < n) n = x.n; });
      mid /= qs.length; disp /= qs.length;
      cells.push({
        id: CELLS[c].id, code: CELLS[c].code, key: CELLS[c].key,
        middle: mid, dispersion: disp, percent: pct(mid), n: n,
        color: colorOf(mid), border: borderOf(n, disp),
        questions: qs.map(function (x) { return x.i; }),
      });
    }
    return {
      participants: responses.length,
      questions: questions,
      cells: cells,
      norms: { upperMiddle: NORMS.upperMiddle, lowerMiddle: NORMS.lowerMiddle, upperPercent: pct(NORMS.upperMiddle), lowerPercent: pct(NORMS.lowerMiddle) },
    };
  }

  function validAnswers(a) {
    if (!a || a.length !== QUESTION_CATS.length) return false;
    for (var i = 0; i < a.length; i++) { var v = Number(a[i]); if (!(v >= 1 && v <= 5 && Math.floor(v) === v)) return false; }
    return true;
  }
  function cellById(result, id) { for (var i = 0; i < result.cells.length; i++) if (result.cells[i].id === id) return result.cells[i]; return null; }

  return {
    NORMS: NORMS, CELLS: CELLS, QUESTION_CATS: QUESTION_CATS, RADARS: RADARS, COUNT: QUESTION_CATS.length,
    questionStats: questionStats, score: score, validAnswers: validAnswers, cellById: cellById,
    colorOf: colorOf, borderOf: borderOf,
  };
})();


/* =================================================================================
 *  ENTRY POINTS
 * ================================================================================= */
const ACTIONS = {
  p_load: (b) => pLoad_(b),
  p_submit: (b) => pSubmit_(b),
};

function doPost(e) {
  let body;
  try {
    body = JSON.parse((e && e.postData && e.postData.contents) || '{}');
  } catch (err) {
    return json_({ ok: false, error: 'bad_json' });
  }
  const fn = ACTIONS[body.action];
  if (!fn) return json_({ ok: false, error: 'unknown_action' });
  try {
    return json_(fn(body));
  } catch (err) {
    console.error(body.action, err && err.stack || err);
    return json_({ ok: false, error: String(err && err.message || err) });
  }
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

/* =================================================================================
 *  STORAGE: data spreadsheet + Drive folders (IDs in CONFIG or Script Properties)
 * ================================================================================= */
function prop_(key) { return PropertiesService.getScriptProperties().getProperty(key) || ''; }
function setProp_(key, val) { PropertiesService.getScriptProperties().setProperty(key, val); }

let SS_CACHE_ = null;
function dataSS_() {
  if (SS_CACHE_) return SS_CACHE_;
  const id = CONFIG.DATA_SPREADSHEET_ID || prop_('DATA_SPREADSHEET_ID');
  if (!id) throw new Error('not_setup');
  SS_CACHE_ = SpreadsheetApp.openById(id);
  return SS_CACHE_;
}
function folder_(key) {
  // key: 'ED' | 'ES'  → subfolder of the main PDF folder
  const pid = 'PDF_FOLDER_' + key;
  const id = prop_(pid);
  if (id) return DriveApp.getFolderById(id);
  const parentId = CONFIG.PDF_FOLDER_ID || prop_('PDF_FOLDER_ID');
  if (!parentId) throw new Error('not_setup');
  const names = { ED: 'Express Diagnostics', ES: 'Engagement Survey' };
  const f = DriveApp.getFolderById(parentId).createFolder(names[key] || key);
  setProp_(pid, f.getId());
  return f;
}

/* =================================================================================
 *  SHEET HELPERS — tables are { name, cols, text } and columns are matched by header
 * ================================================================================= */
function table_(T) {
  const ss = dataSS_();
  let sh = ss.getSheetByName(T.name);
  if (!sh) {
    sh = ss.insertSheet(T.name);
    sh.getRange(1, 1, 1, T.cols.length).setValues([T.cols]).setFontWeight('bold').setBackground('#111111').setFontColor('#ffffff');
    sh.setFrozenRows(1);
    (T.text || []).forEach(h => sh.getRange(2, T.cols.indexOf(h) + 1, sh.getMaxRows() - 1, 1).setNumberFormat('@'));
  }
  return sh;
}
function headerMap_(sh, T) {
  const heads = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
  const map = {};
  heads.forEach((h, i) => { if (h !== '') map[String(h).trim()] = i; });
  const missing = T.cols.filter(c => map[c] == null);
  if (missing.length) {
    const start = heads.length + 1;
    sh.getRange(1, start, 1, missing.length).setValues([missing]).setFontWeight('bold').setBackground('#111111').setFontColor('#ffffff');
    missing.forEach((c, k) => { map[c] = start - 1 + k; if ((T.text || []).indexOf(c) >= 0) sh.getRange(2, start + k, sh.getMaxRows() - 1, 1).setNumberFormat('@'); });
  }
  return map;
}
function appendRecord_(T, row) {
  return withLock_(() => {
    const sh = table_(T);
    const map = headerMap_(sh, T);
    const out = new Array(sh.getLastColumn()).fill('');
    Object.keys(row).forEach(k => { if (map[k] != null) out[map[k]] = safe_(row[k]); });
    sh.appendRow(out);
    return sh.getLastRow();
  });
}
function findRecord_(T, key, value) {
  if (!value) return null;
  const sh = table_(T);
  const map = headerMap_(sh, T);
  const last = sh.getLastRow();
  if (last < 2) return null;
  const ids = sh.getRange(2, map[key] + 1, last - 1, 1).getValues();
  for (let i = ids.length - 1; i >= 0; i--) {
    if (String(ids[i][0]) === String(value)) {
      const rowNum = i + 2;
      const vals = sh.getRange(rowNum, 1, 1, sh.getLastColumn()).getValues()[0];
      const rec = {}; Object.keys(map).forEach(h => rec[h] = vals[map[h]]);
      return { sh, rowNum, rec, map };
    }
  }
  return null;
}
function allRecords_(T) {
  const sh = table_(T);
  const map = headerMap_(sh, T);
  const last = sh.getLastRow();
  if (last < 2) return { sh, map, rows: [] };
  const data = sh.getRange(2, 1, last - 1, sh.getLastColumn()).getValues();
  const heads = Object.keys(map);
  const rows = data.map((vals, i) => { const rec = {}; heads.forEach(h => rec[h] = vals[map[h]]); rec._row = i + 2; return rec; });
  return { sh, map, rows };
}
function setCells_(sh, rowNum, map, obj) {
  withLock_(() => Object.keys(obj).forEach(k => {
    if (map[k] != null) sh.getRange(rowNum, map[k] + 1).setValue(safe_(obj[k]));
  }));
}
let LOCK_DEPTH_ = 0; // re-entrant: nested calls reuse the lock already held
function withLock_(fn) {
  if (LOCK_DEPTH_ > 0) return fn();
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  LOCK_DEPTH_++;
  try { return fn(); } finally { LOCK_DEPTH_--; lock.releaseLock(); }
}

/* =================================================================================
 *  PDF + EMAIL HELPERS
 * ================================================================================= */
function pdfBlob_(b64, fileName, fallback) {
  const bytes = Utilities.base64Decode(String(b64 || ''));
  if (bytes.length < 1000 || bytes.length > CONFIG.MAX_PDF_BYTES) throw new Error('bad_pdf_size');
  if (String.fromCharCode(bytes[0], bytes[1], bytes[2], bytes[3]) !== '%PDF') throw new Error('not_a_pdf');
  const name = (clean_(fileName, 120).replace(/[^\wÀ-ſ.\- ]+/g, '') || fallback).replace(/(\.pdf)?$/i, '.pdf');
  return Utilities.newBlob(bytes, 'application/pdf', name);
}
function sendMail_(to, subject, plain, html, attachments, replyTo) {
  const options = { name: CONFIG.EMAIL.FROM_NAME, htmlBody: html };
  if (CONFIG.EMAIL.FROM_ADDRESS) options.from = CONFIG.EMAIL.FROM_ADDRESS;
  if (attachments && attachments.length) options.attachments = attachments;
  if (replyTo) options.replyTo = replyTo;
  GmailApp.sendEmail(String(to), subject, plain, options);
}
// Minimal email shell: white card, black header with the logo, red accents.
function emailShell_(inner, footer) {
  return '<div style="background:#f4f4f4;padding:24px 12px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:10px;overflow:hidden;border:1px solid #e6e6e6">' +
    '<tr><td style="padding:26px 32px 18px;border-bottom:3px solid #d7141a"><img src="' + CONFIG.ASSETS_BASE + 'adizes-logo-color.png" alt="Adizes Institute" width="140" style="display:block;width:140px;height:auto"></td></tr>' +
    '<tr><td style="padding:28px 32px 8px;font:15px/1.6 Arial,sans-serif;color:#111111">' + inner + '</td></tr>' +
    '<tr><td style="padding:16px 32px;background:#f6f6f6;font:12px/1.5 Arial,sans-serif;color:#8a8a8a">' + esc_(footer) + '</td></tr>' +
    '</table></div>';
}
/* =================================================================================
 *  SMALL UTILITIES
 * ================================================================================= */
// Text that starts like a formula is written as literal text (apostrophe prefix).
function safe_(v) {
  if (typeof v !== 'string') return v;
  return /^[=+\-@]/.test(v) ? "'" + v : v;
}
function clean_(v, max) { return String(v == null ? '' : v).replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, max || 200); }
function esc_(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
function fill_(tpl, map) { return String(tpl).replace(/\{(\w+)\}/g, (m, k) => map[k] != null ? map[k] : m); }
function validEmail_(e) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e); }
function randStr_(n) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
  let r = ''; for (let i = 0; i < n; i++) r += chars[Math.floor(Math.random() * chars.length)];
  return r;
}
function newId_(prefix) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let r = ''; for (let i = 0; i < 6; i++) r += chars[Math.floor(Math.random() * chars.length)];
  return prefix + '-' + r;
}
function today_() { return Utilities.formatDate(new Date(), 'America/Mexico_City', 'yyyy-MM-dd'); }
function dateStr_(v) {
  if (!v) return '';
  if (v instanceof Date) return Utilities.formatDate(v, 'America/Mexico_City', 'yyyy-MM-dd');
  return String(v).slice(0, 10);
}
function iso_(v) { return v instanceof Date ? v.toISOString() : (v ? String(v) : ''); }
function firstName_(name) { return String(name || '').trim().split(/\s+/)[0] || ''; }


/* =================================================================================
 *  DATA MODEL — one tab per table in the data spreadsheet (columns matched by header)
 * ================================================================================= */
const COMPANIES = {
  name: 'Companies',
  cols: ['ID', 'Name', 'Country', 'Language', 'Contact Name', 'Contact Email', 'Notes', 'Status', 'Created At', 'Updated At'],
  text: ['ID', 'Name', 'Country', 'Contact Name', 'Contact Email', 'Notes'],
};
const EMPLOYEES = {
  name: 'Employees',
  cols: ['ID', 'Company ID', 'Full Name', 'Email', 'Area', 'Position', 'Status', 'Created At', 'Updated At'],
  text: ['ID', 'Company ID', 'Full Name', 'Email', 'Area', 'Position'],
};
const LAUNCHES = {
  name: 'Launches',
  cols: ['ID', 'Company ID', 'Type', 'Name', 'Language', 'Status', 'Min Responses', 'Close Date', 'Recipients',
    'Created At', 'Opened At', 'Ready At', 'Report URL', 'Report File ID', 'Report Generated At', 'Report Sent At', 'Report Sent To',
    'Closed At', 'Notice', 'Notes', 'Updated At'],
  text: ['ID', 'Company ID', 'Name', 'Close Date', 'Recipients', 'Report Sent To', 'Notes'],
};
const INVITES = {
  name: 'Invitations',
  cols: ['ID', 'Launch ID', 'Employee ID', 'Token', 'Status', 'Sent At', 'Reminded At', 'Reminders', 'Completed On', 'Created At'],
  text: ['ID', 'Launch ID', 'Employee ID', 'Token', 'Completed On'],
};
const ED_CELL_COLS = ED.CELLS.map(c => c.code + ' ' + c.key + ' %');
const ED_Q_COLS = ED.QUESTION_CATS.map((c, i) => 'Q' + (i + 1));
const ED_ANSWERS = {
  name: 'ED Answers',
  cols: ['Response ID', 'Launch ID', 'Invitation ID', 'Employee ID', 'Full Name', 'Submitted At', 'Language'].concat(ED_CELL_COLS, ED_Q_COLS),
  text: ['Response ID', 'Launch ID', 'Invitation ID', 'Employee ID', 'Full Name'],
};

const L_STATUS = { DRAFT: 'Draft', OPEN: 'Open', READY: 'Ready', SENT: 'Report sent', CLOSED: 'Closed' };
const I_STATUS = { PENDING: 'Pending', SENT: 'Sent', DONE: 'Completed', REMOVED: 'Removed' };

/* ---------------- generic record helpers ---------------- */
function rows_(T) { return allRecords_(T).rows; }
function byId_(T, id) { return findRecord_(T, 'ID', id); }
function update_(T, id, obj) {
  const f = byId_(T, id);
  if (!f) throw new Error('not_found');
  setCells_(f.sh, f.rowNum, f.map, obj);
  Object.keys(obj).forEach(k => f.rec[k] = obj[k]);
  return f.rec;
}

/* ---------------- launches: counts + "ready" rule ---------------- */
function launchCounts_(launchId, invites) {
  const list = (invites || rows_(INVITES)).filter(i => i['Launch ID'] === launchId && i['Status'] !== I_STATUS.REMOVED);
  return { total: list.length, done: list.filter(i => i['Status'] === I_STATUS.DONE).length };
}
function closeDatePassed_(l) {
  const d = dateStr_(l['Close Date']);
  return !!d && today_() > d;
}
/**
 * Open → Ready when everybody invited has answered, or the close date has passed, and the minimum
 * is met. If the date passed without the minimum, admins are told once ("Notice").
 */
function checkReady_(launchId) {
  return withLock_(() => {
    const f = byId_(LAUNCHES, launchId);
    if (!f || f.rec['Status'] !== L_STATUS.OPEN) return null;
    const l = f.rec, c = launchCounts_(launchId);
    const min = Number(l['Min Responses']) || CONFIG.MIN_RESPONSES[l['Type']] || 1;
    const all = c.total > 0 && c.done >= c.total, late = closeDatePassed_(l);
    if (c.done >= min && (all || late)) {
      setCells_(f.sh, f.rowNum, f.map, { 'Status': L_STATUS.READY, 'Ready At': new Date(), 'Notice': '' });
      l['Status'] = L_STATUS.READY;
      try { notifyAdmins_('ready', l, c); } catch (err) { console.error('notify', err); }
      return 'ready';
    }
    if (late && c.done < min && !l['Notice']) {
      setCells_(f.sh, f.rowNum, f.map, { 'Notice': 'expired' });
      try { notifyAdmins_('expired', l, c); } catch (err) { console.error('notify', err); }
      return 'expired';
    }
    return null;
  });
}

/* ---------------- invitation links ---------------- */
function inviteLink_(type, token) { return CONFIG.PAGES[type] + '?t=' + encodeURIComponent(token); }


/* =================================================================================
 *  PARTICIPANTS (public API used by the Webflow widgets)
 * ================================================================================= */
function inviteByToken_(t) {
  const token = clean_(t, 64);
  if (!/^[A-Za-z0-9]{16,64}$/.test(token)) return null;
  return findRecord_(INVITES, 'Token', token);
}

// { t } → what the widget needs to show (no answers, no other people's data)
function pLoad_(b) {
  const inv = inviteByToken_(b.t);
  if (!inv || inv.rec['Status'] === I_STATUS.REMOVED) return { ok: false, error: 'invalid_link' };
  const l = byId_(LAUNCHES, inv.rec['Launch ID']);
  if (!l) return { ok: false, error: 'invalid_link' };
  const L = l.rec, c = byId_(COMPANIES, L['Company ID']);
  let state = 'open';
  if (inv.rec['Status'] === I_STATUS.DONE) state = 'completed';
  else if (L['Status'] !== L_STATUS.OPEN) state = L['Status'] === L_STATUS.DRAFT ? 'not_open' : 'closed';
  const out = {
    ok: true, state: state, type: L['Type'], lang: L['Language'] || 'en',
    company: c ? c.rec['Name'] : '', closeDate: dateStr_(L['Close Date']),
  };
  if (L['Type'] === 'ED') {
    const e = byId_(EMPLOYEES, inv.rec['Employee ID']);
    out.firstName = e ? firstName_(e.rec['Full Name']) : '';
  }
  return out;
}

// { t, answers, lang } → saves once; the participant only gets a thank-you.
function pSubmit_(b) {
  return withLock_(() => {
    const inv = inviteByToken_(b.t);
    if (!inv || inv.rec['Status'] === I_STATUS.REMOVED) throw new Error('invalid_link');
    if (inv.rec['Status'] === I_STATUS.DONE) throw new Error('already_completed');
    const l = byId_(LAUNCHES, inv.rec['Launch ID']);
    if (!l) throw new Error('invalid_link');
    if (l.rec['Status'] !== L_STATUS.OPEN) throw new Error('closed');
    const type = l.rec['Type'];
    if (type === 'ED') saveEdAnswers_(inv.rec, l.rec, b);
    else throw new Error('unknown_type');
    setCells_(inv.sh, inv.rowNum, inv.map, { 'Status': I_STATUS.DONE, 'Completed On': type === 'ES' ? today_() : new Date().toISOString() });
    checkReady_(l.rec['ID']);
    return { ok: true };
  });
}

function saveEdAnswers_(inv, launch, b) {
  const answers = (b.answers || []).map(Number);
  if (!ED.validAnswers(answers)) throw new Error('invalid_answers');
  const e = byId_(EMPLOYEES, inv['Employee ID']);
  const r = ED.score([answers]);
  const row = {
    'Response ID': newId_('R'), 'Launch ID': launch['ID'], 'Invitation ID': inv['ID'], 'Employee ID': inv['Employee ID'],
    'Full Name': e ? e.rec['Full Name'] : '', 'Submitted At': new Date(), 'Language': LABELS[b.lang] ? b.lang : launch['Language'],
  };
  r.cells.forEach((x, i) => { row[ED_CELL_COLS[i]] = Math.round(x.percent * 10) / 10; });
  answers.forEach((v, i) => { row[ED_Q_COLS[i]] = v; });
  appendRecord_(ED_ANSWERS, row);
}


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


/* =================================================================================
 *  EMAILS — invitations / reminders (participants), report (recipients), notices (admins)
 * ================================================================================= */
function fmtDate_(d, lang) {
  if (!d) return '';
  const p = String(d).slice(0, 10).split('-');
  const months = {
    es: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
    en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  };
  const m = (months[lang] || months.en)[Number(p[1]) - 1];
  return lang === 'es' ? Number(p[2]) + ' de ' + m + ' de ' + p[0] : m + ' ' + Number(p[2]) + ', ' + p[0];
}
function button_(label, url) {
  return '<a href="' + esc_(url) + '" style="display:inline-block;background:#d7141a;color:#ffffff;font:700 15px Arial,sans-serif;text-decoration:none;padding:13px 26px;border-radius:6px">' + esc_(label) + ' &rarr;</a>';
}

/**
 * Sends the invitation (or a reminder) to every participant that hasn't answered.
 * inviteIds: optional subset. Invitations are only sent while the launch is open.
 */
function sendInvites_(launchId, inviteIds, reminder) {
  const lf = byId_(LAUNCHES, launchId);
  if (!lf) throw new Error('not_found');
  const l = lf.rec;
  if (l['Status'] !== L_STATUS.OPEN) throw new Error('not_open');
  const lang = LABELS[l['Language']] ? l['Language'] : 'en', T = L_(lang), I = T.invite;
  const company = launchCompany_(l)['Name'] || '';
  const test = T.tests[l['Type']];
  const emp = {}; rows_(EMPLOYEES).forEach(r => emp[r['ID']] = r);
  const only = inviteIds && inviteIds.length ? inviteIds.reduce((o, id) => (o[id] = true, o), {}) : null;
  let n = 0;
  allRecords_(INVITES).rows.forEach(r => {
    if (r['Launch ID'] !== launchId || r['Status'] === I_STATUS.REMOVED || r['Status'] === I_STATUS.DONE) return;
    if (only && !only[r['ID']]) return;
    if (reminder && r['Status'] !== I_STATUS.SENT) return;   // reminders only to people already invited
    const e = emp[r['Employee ID']];
    if (!e || !validEmail_(e['Email'])) return;
    const map = { company: company, test: test, first: firstName_(e['Full Name']), date: fmtDate_(l['Close Date'], lang) };
    const link = inviteLink_(l['Type'], r['Token']);
    const inner =
      '<p style="margin:0 0 14px">' + esc_(fill_(I.hi, map)) + '</p>' +
      '<p style="margin:0 0 14px">' + esc_(fill_(reminder ? I.reminder : I.body, map)) + '</p>' +
      '<p style="margin:0 0 14px;color:#3a3a3a">' + esc_(fill_(I.privacy[l['Type']], map)) + '</p>' +
      (l['Close Date'] ? '<p style="margin:0 0 22px"><b>' + esc_(fill_(I.deadline, map)) + '</b></p>' : '') +
      '<p style="margin:0 0 22px">' + button_(I.cta, link) + '</p>' +
      '<p style="margin:0 0 18px;font-size:12px;color:#8a8a8a">' + esc_(I.personal) + '<br>' + esc_(link) + '</p>' +
      '<p style="margin:0">' + esc_(I.sign) + '</p>';
    const plain = [fill_(I.hi, map), fill_(reminder ? I.reminder : I.body, map), fill_(I.privacy[l['Type']], map),
      l['Close Date'] ? fill_(I.deadline, map) : '', I.cta + ': ' + link, I.personal, I.sign].filter(Boolean).join('\n\n');
    sendMail_(e['Email'], fill_(reminder ? I.reminderSubject : I.subject, map), plain, emailShell_(inner, fill_(I.footer, map)));
    const upd = reminder ? { 'Reminded At': new Date(), 'Reminders': (Number(r['Reminders']) || 0) + 1 } : { 'Status': I_STATUS.SENT, 'Sent At': new Date() };
    update_(INVITES, r['ID'], upd);
    n++;
  });
  return n;
}

function sendReportEmail_(l, to, note, pdf, n) {
  const lang = LABELS[l['Language']] ? l['Language'] : 'en', T = L_(lang), R = T.report;
  const map = { company: launchCompany_(l)['Name'] || '', test: T.tests[l['Type']], launch: l['Name'], n: n };
  const inner =
    '<p style="margin:0 0 14px">' + esc_(R.hi) + '</p>' +
    '<p style="margin:0 0 14px">' + esc_(fill_(R.body, map)) + '</p>' +
    (note ? '<p style="margin:0 0 14px;white-space:pre-line">' + esc_(note) + '</p>' : '') +
    '<p style="margin:22px 0 0">' + esc_(R.sign) + '</p>';
  const plain = [R.hi, fill_(R.body, map), note, R.sign].filter(Boolean).join('\n\n');
  sendMail_(to.join(','), fill_(R.subject, map), plain, emailShell_(inner, R.footer), [pdf]);
}

// Internal notices (Spanish) to the admins + it@adizes.com
function notifyAdmins_(kind, l, c) {
  const to = adminList_().concat(CONFIG.EMAIL.NOTIFY_TO ? [CONFIG.EMAIL.NOTIFY_TO] : []).filter((x, i, a) => x && a.indexOf(x) === i);
  if (!to.length) return;
  const company = launchCompany_(l)['Name'] || '';
  const test = LABELS.es.tests[l['Type']];
  const url = prop_('ADMIN_URL');
  const head = kind === 'ready' ? 'Listo para reporte' : 'Fecha de cierre sin el mínimo';
  const text = kind === 'ready'
    ? 'El lanzamiento ya tiene ' + c.done + ' de ' + c.total + ' respuestas. Ya puedes revisar y generar el reporte en el admin.'
    : 'La fecha de cierre pasó con ' + c.done + ' de ' + c.total + ' respuestas (mínimo ' + (l['Min Responses'] || '') + '). Puedes enviar recordatorios o extender la fecha desde el admin.';
  const inner =
    '<div style="font:700 11px Arial,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:#d7141a;margin-bottom:8px">' + esc_(head) + '</div>' +
    '<p style="margin:0 0 6px;font:700 18px Arial,sans-serif">' + esc_(company) + ' · ' + esc_(test) + '</p>' +
    '<p style="margin:0 0 14px;color:#6b6f76">' + esc_(l['Name']) + ' (' + esc_(l['ID']) + ')</p>' +
    '<p style="margin:0 0 20px">' + esc_(text) + '</p>' +
    (url ? '<p style="margin:0">' + button_('Abrir el admin', url) + '</p>' : '');
  sendMail_(to.join(','), '[' + head + '] ' + company + ' · ' + test + ' · ' + l['Name'], text + (url ? '\n\n' + url : ''), emailShell_(inner, 'Aviso interno · Adizes Assessments'));
}


/* =================================================================================
 *  TIME TRIGGER (every hour): launches whose close date passed become "Ready"
 *  (or admins are told the minimum wasn't reached).
 * ================================================================================= */
function tick() {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(10000)) return;
  LOCK_DEPTH_++;
  try {
    rows_(LAUNCHES).forEach(l => { if (l['Status'] === L_STATUS.OPEN) checkReady_(l['ID']); });
  } finally {
    LOCK_DEPTH_--;
    lock.releaseLock();
  }
}

/* =================================================================================
 *  SETUP — run once from the editor: choose "setup" in the toolbar and press ▶ Run
 * ================================================================================= */
function setup() {
  const props = PropertiesService.getScriptProperties();
  if (!props.getProperty('ADMIN_EMAILS')) props.setProperty('ADMIN_EMAILS', 'dario@adizes.com');
  // From the editor the active user is the owner; from a web page it must be an admin.
  if (!isAdmin_(currentEmail_())) throw new Error('forbidden');
  // 1) Data spreadsheet (share it only with admins)
  if (!CONFIG.DATA_SPREADSHEET_ID && !props.getProperty('DATA_SPREADSHEET_ID')) {
    props.setProperty('DATA_SPREADSHEET_ID', SpreadsheetApp.create('Adizes Assessments — Data').getId());
  }
  // 2) Drive folder for the reports
  if (!CONFIG.PDF_FOLDER_ID && !props.getProperty('PDF_FOLDER_ID')) {
    props.setProperty('PDF_FOLDER_ID', DriveApp.createFolder('Adizes Assessments — Reports').getId());
  }
  [COMPANIES, EMPLOYEES, LAUNCHES, INVITES, ED_ANSWERS].forEach(T => headerMap_(table_(T), T));
  TESTS.forEach(t => folder_(t));
  // 3) Trigger
  ScriptApp.getProjectTriggers().forEach(t => { if (['tick', 'backupDeliver'].indexOf(t.getHandlerFunction()) >= 0) ScriptApp.deleteTrigger(t); });
  ScriptApp.newTrigger('tick').timeBased().everyHours(1).create();
  // 4) Touch Gmail once so Google asks for that permission now
  GmailApp.getAliases();
  Logger.log('Ready.\nData spreadsheet: ' + dataSS_().getUrl() +
    '\nReports folder: ' + DriveApp.getFolderById(CONFIG.PDF_FOLDER_ID || props.getProperty('PDF_FOLDER_ID')).getUrl() +
    '\nAdmins: ' + props.getProperty('ADMIN_EMAILS'));
}


/* ===== Admin page (generated from admin/src) ===== */
const ADMIN_HTML = "<!doctype html>\n<html lang=\"es\">\n<head>\n<meta charset=\"utf-8\">\n<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n<title>Adizes · Admin</title>\n<link rel=\"preconnect\" href=\"https://fonts.googleapis.com\">\n<link href=\"https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap\" rel=\"stylesheet\">\n<style>:root {\n--ink: #111111; --ink-2: #3a3a3a; --muted: #6b6f76; --soft: #9aa0a6; --line: #e6e6e6; --line-2: #f0f0f0;\n--paper: #f6f6f6; --white: #ffffff; --red: #d7141a; --red-dark: #b10f14; --red-tint: #fdecec;\n--green: #1e8e4e; --green-t: #e3f4ea; --yellow: #a87b00; --yellow-t: #fff4cf; --blue: #2457c5; --blue-t: #e8eefb;\n}\n* { box-sizing: border-box; margin: 0; padding: 0; }\nhtml, body { background: var(--paper); }\nbody { font: 14px/1.5 Montserrat, system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif; color: var(--ink); -webkit-font-smoothing: antialiased; }\nbutton, input, select, textarea { font: inherit; color: inherit; }\nbutton { cursor: pointer; background: none; border: 0; }\na { color: inherit; }\n[hidden] { display: none !important; }\n:focus-visible { outline: 3px solid rgba(215, 20, 26, .3); outline-offset: 2px; }\n.adm-top { position: sticky; top: 0; z-index: 20; background: var(--white); border-bottom: 1px solid var(--line); }\n.adm-top-in { max-width: 1180px; margin: 0 auto; display: flex; align-items: center; gap: 24px; padding: 12px 24px; }\n.adm-logo { height: 30px; width: auto; display: block; }\n.adm-brand { display: flex; align-items: center; gap: 10px; text-decoration: none; }\n.adm-brand span { font-size: 11px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: var(--muted); border-left: 1px solid var(--line); padding-left: 10px; }\n.adm-nav { display: flex; gap: 4px; flex: 1; }\n.adm-nav a { text-decoration: none; padding: 8px 12px; border-radius: 6px; font-weight: 600; color: var(--muted); }\n.adm-nav a:hover { color: var(--ink); background: var(--paper); }\n.adm-nav a.is-on { color: var(--ink); background: var(--paper); box-shadow: inset 0 -2px 0 var(--red); }\n.adm-me { font-size: 12px; color: var(--soft); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 220px; }\n.adm-main { max-width: 1180px; margin: 0 auto; padding: 28px 24px 80px; }\n.adm-boot { min-height: 60vh; display: grid; place-items: center; }\n.adm-spinner { width: 34px; height: 34px; border-radius: 50%; border: 3px solid var(--line); border-top-color: var(--red); animation: spin .8s linear infinite; }\n@keyframes spin { to { transform: rotate(360deg); } }\n.adm-crumbs { font-size: 12.5px; color: var(--muted); margin-bottom: 6px; }\n.adm-crumbs a { text-decoration: none; font-weight: 600; }\n.adm-crumbs a:hover { color: var(--red); }\n.adm-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; flex-wrap: wrap; margin-bottom: 22px; }\n.adm-h1 { font-size: 26px; line-height: 1.2; font-weight: 700; letter-spacing: -.01em; }\n.adm-sub { color: var(--muted); margin-top: 4px; }\n.adm-h2 { font-size: 16px; font-weight: 700; }\n.adm-sec { margin-top: 28px; }\n.adm-sec-h { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 12px; flex-wrap: wrap; }\n.adm-eyebrow { font-size: 11px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: var(--red); }\n.adm-btns { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }\n.btn { display: inline-flex; align-items: center; justify-content: center; gap: 6px; min-height: 38px; padding: 8px 16px; border-radius: 6px; font-weight: 600; font-size: 13.5px; white-space: nowrap; text-decoration: none; transition: background .15s, color .15s, border-color .15s; }\n.btn-red { background: var(--red); color: var(--white); }\n.btn-red:hover { background: var(--red-dark); }\n.btn-dark { background: var(--ink); color: var(--white); }\n.btn-dark:hover { background: #000; }\n.btn-line { border: 1px solid #cfcfcf; background: var(--white); }\n.btn-line:hover { border-color: var(--ink); }\n.btn-ghost { color: var(--muted); padding: 8px 10px; }\n.btn-ghost:hover { color: var(--ink); background: var(--paper); }\n.btn-danger { color: var(--red); }\n.btn-danger:hover { background: var(--red-tint); }\n.btn-sm { min-height: 30px; padding: 5px 10px; font-size: 12.5px; }\n.btn[disabled] { opacity: .45; cursor: default; pointer-events: none; }\n.card { background: var(--white); border: 1px solid var(--line); border-radius: 10px; }\n.card-pad { padding: 20px; }\n.grid { display: grid; gap: 12px; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); }\n.co-card { display: block; text-decoration: none; padding: 18px 20px; transition: border-color .15s, box-shadow .15s; }\n.co-card:hover { border-color: var(--ink); }\n.co-card h3 { font-size: 16px; font-weight: 700; margin-bottom: 2px; }\n.co-meta { display: flex; flex-wrap: wrap; gap: 6px 14px; font-size: 12.5px; color: var(--muted); margin-top: 10px; }\n.co-meta b { color: var(--ink); }\n.empty { padding: 34px 20px; text-align: center; color: var(--muted); }\n.empty b { display: block; color: var(--ink); font-size: 15px; margin-bottom: 4px; }\n.toolbar { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; margin-bottom: 14px; }\n.input, .select, .textarea { width: 100%; min-height: 40px; padding: 8px 12px; border: 1px solid #cfcfcf; border-radius: 6px; background: var(--white); }\n.input:focus, .select:focus, .textarea:focus { border-color: var(--ink); outline: none; }\n.textarea { min-height: 96px; resize: vertical; line-height: 1.5; }\n.toolbar .input { max-width: 300px; }\n.toolbar .select { width: auto; }\n.chk { display: inline-flex; align-items: center; gap: 8px; font-size: 13px; color: var(--muted); cursor: pointer; }\n.chk input { accent-color: var(--red); width: 16px; height: 16px; }\n.tbl { width: 100%; border-collapse: collapse; }\n.tbl th { text-align: left; font-size: 11px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: var(--muted); padding: 10px 14px; border-bottom: 1px solid var(--line); background: #fafafa; }\n.tbl td { padding: 11px 14px; border-bottom: 1px solid var(--line-2); vertical-align: middle; }\n.tbl tr:last-child td { border-bottom: 0; }\n.tbl tr.is-click { cursor: pointer; }\n.tbl tr.is-click:hover td { background: #fafafa; }\n.tbl .num { text-align: right; white-space: nowrap; font-variant-numeric: tabular-nums; }\n.tbl .act { text-align: right; white-space: nowrap; }\n.muted { color: var(--muted); }\n.small { font-size: 12.5px; }\n.strong { font-weight: 600; }\n.nowrap { white-space: nowrap; }\n.chip { display: inline-flex; align-items: center; gap: 6px; padding: 2px 9px; border-radius: 20px; font-size: 11.5px; font-weight: 700; white-space: nowrap; background: var(--paper); color: var(--ink-2); }\n.chip::before { content: ''; width: 6px; height: 6px; border-radius: 50%; background: currentColor; opacity: .8; }\n.chip-Draft { color: var(--muted); }\n.chip-Open { background: var(--blue-t); color: var(--blue); }\n.chip-Ready { background: var(--yellow-t); color: var(--yellow); }\n.chip-Reportsent { background: var(--green-t); color: var(--green); }\n.chip-Closed { color: var(--soft); }\n.chip-Pending { color: var(--muted); }\n.chip-Sent { background: var(--blue-t); color: var(--blue); }\n.chip-Completed { background: var(--green-t); color: var(--green); }\n.chip-Archived { color: var(--soft); }\n.type { display: inline-block; font-size: 10.5px; font-weight: 800; letter-spacing: .06em; padding: 2px 7px; border-radius: 4px; border: 1px solid var(--ink); }\n.type-ES { border-color: var(--red); color: var(--red); }\n.prog { display: flex; align-items: center; gap: 10px; min-width: 150px; }\n.prog-bar { flex: 1; height: 6px; border-radius: 3px; background: var(--line); overflow: hidden; position: relative; }\n.prog-bar i { position: absolute; inset: 0 auto 0 0; background: var(--ink); border-radius: 3px; }\n.prog-bar.is-ok i { background: var(--green); }\n.prog-bar b { position: absolute; top: -3px; bottom: -3px; width: 2px; background: var(--red); }\n.prog span { font-size: 12.5px; font-weight: 600; white-space: nowrap; font-variant-numeric: tabular-nums; }\n.kpis { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; }\n.kpi { padding: 16px 18px; }\n.kpi small { display: block; font-size: 11px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: var(--muted); }\n.kpi b { display: block; font-size: 22px; font-weight: 700; margin-top: 4px; }\n.kpi .prog { margin-top: 10px; }\n.kpi .prog span { display: none; }\n.notice { border-left: 4px solid var(--red); background: var(--red-tint); padding: 12px 16px; border-radius: 4px; margin-bottom: 16px; font-size: 13.5px; }\n.notice.is-info { border-color: var(--ink); background: var(--paper); }\n.report { display: grid; grid-template-columns: 1fr 1.2fr; gap: 0; }\n.report > div { padding: 20px; }\n.report > div + div { border-left: 1px solid var(--line); }\n.field { display: grid; gap: 6px; margin-bottom: 14px; }\n.field label { font-size: 12.5px; font-weight: 600; }\n.field .hint { font-size: 12px; color: var(--soft); }\n.row2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }\n.pdf-ok { display: flex; align-items: center; gap: 10px; padding: 12px 14px; border: 1px solid var(--line); border-radius: 8px; margin: 10px 0 14px; }\n.pdf-ok i { width: 34px; height: 40px; border-radius: 4px; background: var(--red); position: relative; flex: none; }\n.pdf-ok i::after { content: 'PDF'; position: absolute; bottom: 5px; left: 0; right: 0; text-align: center; color: #fff; font: 800 9px Montserrat, Arial; }\n.modal-bg { position: fixed; inset: 0; background: rgba(17, 17, 17, .45); z-index: 50; display: flex; align-items: flex-start; justify-content: center; padding: 6vh 16px 16px; overflow-y: auto; animation: fade .15s ease; }\n.modal { background: var(--white); border-radius: 12px; width: 100%; max-width: 560px; box-shadow: 0 20px 60px rgba(0, 0, 0, .25); }\n.modal.is-wide { max-width: 760px; }\n.modal-h { display: flex; justify-content: space-between; align-items: center; padding: 18px 22px; border-bottom: 1px solid var(--line); }\n.modal-h h3 { font-size: 17px; font-weight: 700; }\n.modal-b { padding: 20px 22px; max-height: 66vh; overflow-y: auto; }\n.modal-f { display: flex; justify-content: flex-end; gap: 8px; padding: 14px 22px; border-top: 1px solid var(--line); background: #fafafa; border-radius: 0 0 12px 12px; }\n.x { width: 32px; height: 32px; border-radius: 6px; font-size: 20px; line-height: 1; color: var(--muted); }\n.x:hover { background: var(--paper); color: var(--ink); }\n@keyframes fade { from { opacity: 0; } }\n.pick { border: 1px solid var(--line); border-radius: 8px; max-height: 320px; overflow-y: auto; }\n.pick label { display: flex; align-items: center; gap: 10px; padding: 9px 12px; border-bottom: 1px solid var(--line-2); cursor: pointer; }\n.pick label:last-child { border-bottom: 0; }\n.pick label:hover { background: #fafafa; }\n.pick input { accent-color: var(--red); width: 16px; height: 16px; flex: none; }\n.pick .small { margin-left: auto; text-align: right; }\n.err { color: var(--red); font-size: 12.5px; }\n.types { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }\n.types label { border: 1px solid #cfcfcf; border-radius: 8px; padding: 12px 14px; cursor: pointer; display: block; }\n.types label:has(input:checked) { border-color: var(--red); box-shadow: inset 0 0 0 1px var(--red); background: var(--red-tint); }\n.types input { accent-color: var(--red); margin-right: 6px; }\n.types small { display: block; color: var(--muted); margin-top: 4px; }\n.linkbox { font-family: ui-monospace, Menlo, Consolas, monospace; font-size: 12px; }\n.adm-toast { position: fixed; left: 50%; bottom: 24px; transform: translate(-50%, 30px); opacity: 0; background: var(--ink); color: var(--white); padding: 11px 18px; border-radius: 8px; font-weight: 600; font-size: 13.5px; z-index: 60; transition: all .2s ease; pointer-events: none; max-width: calc(100vw - 32px); }\n.adm-toast.is-on { opacity: 1; transform: translate(-50%, 0); }\n.adm-toast.is-err { background: var(--red); }\n.busy { position: fixed; inset: 0; z-index: 70; background: rgba(255, 255, 255, .55); display: grid; place-items: center; }\n@media (max-width: 760px) {\n.adm-top-in { padding: 10px 14px; gap: 10px; flex-wrap: wrap; }\n.adm-me { display: none; }\n.adm-nav { order: 3; width: 100%; flex: none; }\n.adm-main { padding: 20px 14px 70px; }\n.adm-h1 { font-size: 22px; }\n.kpis { grid-template-columns: 1fr 1fr; }\n.report { grid-template-columns: 1fr; }\n.report > div + div { border-left: 0; border-top: 1px solid var(--line); }\n.row2 { grid-template-columns: 1fr; }\n.toolbar .input { max-width: none; }\n.tbl thead { display: none; }\n.tbl, .tbl tbody, .tbl tr, .tbl td { display: block; width: 100%; }\n.tbl tr { padding: 10px 14px; border-bottom: 1px solid var(--line-2); }\n.tbl td { padding: 2px 0; border: 0; }\n.tbl td[data-l]::before { content: attr(data-l) ': '; color: var(--soft); font-size: 11.5px; }\n.tbl .num, .tbl .act { text-align: left; }\n.tbl .act { padding-top: 8px; }\n.types { grid-template-columns: 1fr; }\n}</style>\n</head>\n<body>\n<div id=\"app\" class=\"adm\">\n  <div class=\"adm-boot\"><div class=\"adm-spinner\"></div></div>\n</div>\n<div id=\"modal-root\"></div>\n<div id=\"toast\" class=\"adm-toast\" role=\"status\" aria-live=\"polite\"></div>\n<script>\n  window.ADM_CONFIG = {\n    version: '1.0.0',\n    assetsBase: 'https://cdn.jsdelivr.net/gh/Adizes/alis-sample@v1.0.0/shared/assets/'\n  };\n</script>\n<script>(function(){\n'use strict';\nvar ED_I18N = {};\n/* Express Diagnostics — English\n * To add a language: copy this file (e.g. pt.js), change `ED_I18N.en` to `ED_I18N.pt`, translate every\n * string and keep the keys. The order of `questions` must not change (it is the scoring order).\n * Answer values (1–5) are never translated: they are what is stored and scored.\n */\nED_I18N.en = {\n  code: 'en',\n  langName: 'English',\n  locale: 'en-US',\n\n  ui: {\n    start: 'Start',\n    back: 'Back',\n    next: 'Next',\n    pressEnter: 'press Enter ↵',\n    keyboardHint: 'Keys 1–4 · 0 = I cannot answer',\n    of: 'of',\n    section: 'Area',\n    language: 'Language',\n    resume: 'Welcome back. Your answers so far are saved.',\n    resumeYes: 'Continue where I left off',\n    resumeNo: 'Start over',\n    loading: 'Loading…',\n    sending: 'Sending your answers…',\n    errorGeneric: 'Something went wrong. Please check your connection and try again.',\n    retry: 'Try again',\n  },\n\n  intro: {\n    eyebrow: 'Express Diagnostics',\n    hello: 'Hi, {first}',\n    title: '{company} wants your view of the organization',\n    body: '{company} is running an organizational diagnostic with the Adizes Institute. You will rate 67 statements about how the company works today, across the 16 factors of the Adizes methodology.',\n    bullets: [\n      'It takes about 10 minutes. You can pause and come back later with the same link.',\n      'Your answers are combined with those of the other participants in a group report.',\n      'Answer for how things actually work today, not how they are supposed to work.',\n    ],\n    note: 'If you have no basis to judge a statement, choose “I cannot answer”.',\n    deadline: 'Open until {date}',\n    meta: '67 statements · about 10 minutes',\n  },\n\n  // Raw values 2–5 (1 = cannot answer). Shown top to bottom.\n  scale: [\n    { value: 2, label: 'Never', sub: 'Totally disagree' },\n    { value: 3, label: 'Sometimes', sub: 'Partially disagree' },\n    { value: 4, label: 'Often', sub: 'Partially agree' },\n    { value: 5, label: 'Always', sub: 'Totally agree' },\n  ],\n  cannot: 'I cannot answer',\n\n  cells: {\n    values: 'Values', climate: 'Climate', responsibility: 'Responsibility Structure', authority: 'Authority Structure',\n    reward: 'Reward Structure', planning: 'Planning', information: 'Information flow', corrective: 'Corrective Actions',\n    client: 'Client interface', transformation: 'Transformation', human: 'Human factors', financial: 'Financial factors',\n    behaviour: 'Behaviour', changes: 'Changes', inefficiency: 'Inefficiency', ineffectiveness: 'Ineffectiveness',\n  },\n\n  diagram: {\n    title: 'Causal factors of systemic organizational problems',\n    external: 'External Factors',\n    internal: 'Internal Factors',\n    causes: 'Systemic Organizational Causes',\n    culture: 'Organizational Culture',\n    subsystems: 'Subsystems Symptoms',\n    manifestations: 'Systemic Manifestations',\n    labels: {\n      values: 'Values', climate: 'Climate', planning: 'Strategic Planning', responsibility: 'Organizational Structure',\n      authority: 'Authority', information: 'Information Flow', corrective: 'Corrective Actions', reward: 'Rewards',\n      client: 'Client Interface', transformation: 'Transformation', human: 'Human Resources', financial: 'Finance',\n      inefficiency: 'Inefficiency', behaviour: 'Behavior', changes: 'Change', ineffectiveness: 'Ineffectiveness',\n    },\n  },\n\n  radar: {\n    title1: 'Systemic organizational problems',\n    title2: 'Operational problems and systemic manifestations (consequences)',\n    normal: 'Normal situation',\n    abnormal: 'Abnormal situation',\n    yours: 'The company',\n  },\n\n  colors: {\n    green: 'The process is healthy',\n    yellow: 'There are some areas for improvement',\n    red: 'Key focus zone',\n  },\n  colorShort: { green: 'Healthy', yellow: 'Needs improvement', red: 'Key focus zone' },\n  frames: {\n    title: 'Type of frame',\n    sub: 'Depending on how much the participants’ opinions vary, a different frame is displayed',\n    dotted: 'Dotted frame — participants’ opinions largely coincide',\n    thin: 'Thin frame — noticeable divergence of opinion',\n    thick: 'Thick frame — the participants’ opinions do not coincide at all',\n  },\n  noAnswer: 'no answer',\n\n  review: {\n    eyebrow: 'Last step',\n    title: 'Ready to send',\n    body: 'You rated all 67 statements.',\n    cannot: '{n} marked as “I cannot answer”.',\n    warn: 'Once sent, your answers can’t be changed.',\n    submit: 'Send my answers',\n    edit: 'Review my answers',\n  },\n  thanks: {\n    title: 'Thank you, {first}',\n    body: 'Your answers have been recorded. {company} will receive the group report through the Adizes Institute. You can close this window.',\n  },\n  states: {\n    noToken: { title: 'You need your personal link', body: 'To answer, open the link you received in your invitation email.' },\n    invalid_link: { title: 'This link isn’t valid', body: 'Make sure you opened the complete link from your invitation email. If the problem continues, write to info@adizes.com.' },\n    completed: { title: 'You have already answered', body: 'Your answers were recorded. Thank you for participating.' },\n    closed: { title: 'This diagnostic is closed', body: 'Answers are no longer being collected. If you think this is a mistake, contact the person who invited you.' },\n    not_open: { title: 'This diagnostic isn’t open yet', body: 'Please try again later from the same link.' },\n  },\n\n  pdf: {\n    title: 'Express Diagnostics',\n    subtitle: 'Report',\n    company: 'Company',\n    date: 'Date of the report',\n    design: 'Survey design: distance survey of top management',\n    participants: 'Participants',\n    participantsCount: 'Participants surveyed',\n    howTitle: 'How to read this report',\n    howBody: 'Each of the 16 factors is rated from the participants’ answers on a 4-point scale (“I cannot answer” is not counted as an answer and lowers the factor’s score). The causal map shows where problems originate, the radar charts compare the company with a normal and an abnormal situation, and the last section lists every statement with its rating.',\n    summary: 'At a glance',\n    keyFactors: 'Key organizational factors',\n    keyFactorsHelp: 'Each statement is shown in the wording that matches its rating.',\n    colorsTitle: 'Colour decoding',\n    footer: 'Adizes Institute · Express Diagnostics',\n    page: 'Page',\n    cont: 'cont.',\n  },\n\n  questions: [\n    { t: \"Our value system is clearly articulated in a few words / phrases\", z2: \"Our value system is not clearly articulated\", z3: \"Our value system is not articulated\" },\n    { t: \"Our value system is respected in our daily business practice, the declared values correspond to the demonstrated ones\", z2: \"Our value system is not always respected in everyday business practice, the declared values do not always correspond to the demonstrated ones\", z3: \"Our value system is often not adhered to in our daily business practice, the declared values often do not correspond to the demonstrated ones\" },\n    { t: \"Our value system is the same across all divisions\", z2: \"Our value system is not the same in some departments\", z3: \"Our value system is not the same for many departments\" },\n    { t: \"Our corporate culture is very similar in most departments\", z2: \"Our corporate culture is not similar enough in most departments\", z3: \"Our corporate culture is not the same in most departments\" },\n    { t: \"Our corporate culture is characterized by a high level of collaboration between divisions\", z2: \"Our corporate culture is characterized by a lack of cooperation between departments\", z3: \"Our corporate culture is characterized by a low level of cooperation between divisions\" },\n    { t: \"Our corporate culture is characterized by a high level of performance discipline\", z2: \"Our corporate culture is characterized by a lack of performance discipline\", z3: \"Our corporate culture is characterized by a low level of performance discipline\" },\n    { t: \"Our corporate culture is characterized by the ability to fearlessly express our own opinions\", z2: \"Our corporate culture is not always characterized by the ability to fearlessly express our own opinions\", z3: \"Our corporate culture is not characterized by the ability to fearlessly express our own opinions\" },\n    { t: \"Our corporate culture is characterized by high employee initiative\", z2: \"Our corporate culture is characterized by insufficiently high employee initiative\", z3: \"Our corporate culture is characterized by low employee initiative\" },\n    { t: \"Our corporate culture is characterized by a low level of conflict\", z2: \"Our corporate culture is not always characterized by low levels of conflict\", z3: \"Our corporate culture is not characterized by a low level of conflict\" },\n    { t: \"Our organizational structure supports the current business model well\", z2: \"Our organizational structure does not support the current business model well enough\", z3: \"Our organizational structure does not fully support the current business model\" },\n    { t: \"Our organizational structure supports the long-term goals of the company well\", z2: \"Our organizational structure does not support the long-term goals of the company well enough\", z3: \"Our organizational structure has little support for the long-term goals of the company\" },\n    { t: \"Our organizational structure contains all the necessary functions\", z2: \"Our organizational structure does not contain all the necessary functions\", z3: \"Our organizational structure lacks many essential functions\" },\n    { t: \"There are no unclear/overlapping areas of responsibility in our organizational structure\", z2: \"There are sometimes unclear/overlapping areas of responsibility in our organizational structure\", z3: \"There are many unclear/overlapping areas of responsibility in our organizational structure\" },\n    { t: \"Our organizational structure is highly “around functions” rather than “around people”\", z2: \"Our organizational structure is somewhat “around functions” rather than “around people”\", z3: \"Our organizational structure is highly “around people” rather than “around functions”\" },\n    { t: \"Most of our leaders have enough authority to handle the challenges they face\", z2: \"Some of our leaders lack the authority to meet the challenges they face\", z3: \"Many of our leaders lack the authority to meet the challenges they face\" },\n    { t: \"In our company, the biggest authority is held by commercial divisions\", z2: \"In our company, only part of the authority is held by commercial divisions\", z3: \"In our company, a small part of the authority is held by commercial divisions\" },\n    { t: \"Our authority structure allows for quick decision making\", z2: \"Our authority structure does not always allow for quick decision making\", z3: \"Our authority structure does not allow for quick decision making\" },\n    { t: \"Our structure of authority does not cause conflicts in the decision-making process\", z2: \"Our structure of authority sometimes causes conflicts in the decision-making process\", z3: \"Our structure of authority often causes conflicts in the decision-making process\" },\n    { t: \"Our reward system contributes to the achievement of our goals\", z2: \"Our reward system does not fully contribute to the achievement of our goals\", z3: \"Our reward system rarely helps us achieve our goals\" },\n    { t: \"Our employees are satisfied with the existing motivation system\", z2: \"Our employees are not always satisfied with the existing motivation system\", z3: \"Our employees are often not satisfied with the existing motivation system\" },\n    { t: \"Our long term goals / strategy are clearly defined\", z2: \"Our long term goals / strategy are not well defined\", z3: \"Our long term goals / strategy are not defined\" },\n    { t: \"Our long term goals / strategy are documented\", z2: \"Our long term goals / strategy are not fully documented\", z3: \"Our long term goals / strategy are not documented\" },\n    { t: \"Our long-term goals / strategy are known to management\", z2: \"Not all of our long-term goals / strategy are known to management\", z3: \"Our long-term goals / strategy are not known to management\" },\n    { t: \"Our long-term goals / strategy were developed with the participation of management\", z2: \"Our long-term goals / strategy were developed with insufficient management involvement\", z3: \"Our long-term goals / strategy were developed without management involvement\" },\n    { t: \"Our long term goals / strategy are supported by management\", z2: \"Our long-term goals / strategy are not fully supported by management\", z3: \"Our long-term goals / strategy are not supported by management\" },\n    { t: \"Our long term goals / strategy are backed up by a detailed action plan\", z2: \"Our long term goals / strategy are not fully backed by a detailed action plan\", z3: \"Our long term goals / strategy are not backed up by a specific action plan\" },\n    { t: \"Our long-term goals / strategy are backed by the necessary resources\", z2: \"Our long-term goals / strategy are not fully resourced\", z3: \"Our long-term goals / strategy are not resourced\" },\n    { t: \"We regularly evaluate the implementation of long-term goals / strategies\", z2: \"We do not regularly evaluate the implementation of long-term goals / strategies\", z3: \"We rarely evaluate the implementation of long-term goals / strategies\" },\n    { t: \"Our long-term goals / strategy are regularly / if necessary revised\", z2: \"Our long-term goals / strategy are not reviewed regularly enough\", z3: \"Our long-term goals / strategy are rarely revised\" },\n    { t: \"We base our annual plans on our long-term objectives / strategies\", z2: \"We do not always base our annual plans on our long-term objectives / strategies\", z3: \"We do not base our annual plans on our long-term objectives / strategies\" },\n    { t: \"I have enough information to make key regular management decisions\", z2: \"I do not always have enough information to make key regular management decisions\", z3: \"I often do not have enough information to make key regular management decisions\" },\n    { t: \"Information for taking management decisions usually contains reliable information\", z2: \"Information for taking management decisions does not always contain reliable information\", z3: \"Information for taking management decisions often does not contain reliable information\" },\n    { t: \"Information for taking management decisions is usually collected in a timely manner\", z2: \"Information for taking management decisions is not always collected in a timely manner\", z3: \"Information for taking management decisions is usually not collected in a timely manner\" },\n    { t: \"Information for taking management decisions does not contain redundant unnecessary information\", z2: \"Information for taking management decisions sometimes contains redundant unnecessary information\", z3: \"Information for taking management decisions often contains redundant unnecessary information\" },\n    { t: \"The collection of information for taking management decisions is automated in our company\", z2: \"The collection of information for taking management decisions is not fully automated in our company\", z3: \"The collection of information for taking management decisions is not automated in our company\" },\n    { t: \"We carry out control / analysis of our company's performance at least once a month\", z2: \"We do not always carry out control / analysis of our company's performance at least once a month\", z3: \"We rarely monitor / analyze our company's performance\" },\n    { t: \"We carry out control / analysis of our company's performance in a team of key managers\", z2: \"We do not always monitor / analyze our company's performance in a team of key managers\", z3: \"We do not monitor / analyze the performance of the company in a team of key managers\" },\n    { t: \"We control and analyse the performance of our company with discussion, fixation and subsequent control of the implementation of corrective measures\", z2: \"We do not always control and analyse the performance of our company with discussion, fixation and subsequent control of the implementation of corrective measures\", z3: \"We do not control and analyse the performance of our company with discussion, fixation and subsequent control of the implementation of corrective measures\" },\n    { t: \"We control and analyse the performance of our company with the identification and fixation of systemic problems\", z2: \"We do not always control and analyse the performance of our company with the identification and fixation of systemic problems\", z3: \"We do not control and analyse the performance of our company with the identification and fixation of systemic problems\" },\n    { t: \"We know our target customers and their needs well\", z2: \"We do not always know the target customers and their needs well\", z3: \"We do not know the target customers and their needs well\" },\n    { t: \"Our selling proposition and our promotion and sales models are highly responsive to the needs of our customers\", z2: \"Our selling proposition and our promotion and sales models do not fully meet the needs of our customers\", z3: \"Our selling proposition and our promotion and sales models meet the needs of our customers only to a small extent\" },\n    { t: \"Our selling proposition and promotion and sales models are competitive\", z2: \"Our selling proposition and promotion and sales models are not always competitive\", z3: \"Our selling proposition and promotion and sales models are not fully competitive\" },\n    { t: \"Our annual / quarterly production / operating unit plans are based on the sales plan\", z2: \"Our annual / quarterly production / operating unit plans are partially based on the sales plan\", z3: \"Our annual / quarterly production / operating unit plans are not based on sales plans\" },\n    { t: \"The activities of commercial and operational (production) functions are well coordinated with each other\", z2: \"The actions of commercial and operational (production) functions are not always well coordinated with each other\", z3: \"The actions of commercial and operational (production) functions are poorly coordinated with each other\" },\n    { t: \"Most of our standard processes and procedures are documented\", z2: \"Not all of our standard processes and procedures are documented\", z3: \"Most of our standard processes and procedures are not documented\" },\n    { t: \"We follow most of our standard processes and procedures\", z2: \"We follow some of our standard processes and procedures\", z3: \"We rarely follow our standard processes and procedures\" },\n    { t: \"Most of our standard processes and procedures are subject to periodic adjustments\", z2: \"Only a subset of our standard processes and procedures are subject to periodic adjustments\", z3: \"A small part of our standard processes and procedures are subject to periodic adjustments\" },\n    { t: \"Most of our standard processes and procedures are automated\", z2: \"Only part of our standard processes and procedures are automated\", z3: \"A small part of our standard processes and procedures are automated\" },\n    { t: \"Our work on the development and release of new products is effective\", z2: \"Our activity in developing and launching new products is not effective enough\", z3: \"Our activity on the development and release of new products is ineffective\" },\n    { t: \"We take a systematic approach to training and development\", z2: \"Our approach to training and development is not systematic enough\", z3: \"We do not approach training and development systematically\" },\n    { t: \"We handle hiring challenges\", z2: \"We do not fully cope with the tasks of hiring\", z3: \"We are bad at hiring tasks\" },\n    { t: \"We do not experience a shortage of qualified personnel\", z2: \"Sometimes we experience a shortage of qualified personnel\", z3: \"We are experiencing a shortage of qualified personnel\" },\n    { t: \"We know the break-even point\", z2: \"We roughly know the break-even point\", z3: \"We don't know the break-even point\" },\n    { t: \"We have implemented a budgeting process and follow it\", z2: \"Our budgeting process is not fully implemented\", z3: \"We do not have a budgeting process implemented\" },\n    { t: \"We have implemented management accounting and it operates\", z2: \"We have partially implemented management accounting\", z3: \"We have not implemented management accounting\" },\n    { t: \"Payment requests (to suppliers / contractors) in most cases are paid quickly / within a specified time frame\", z2: \"Payment requests (to suppliers / contractors) are not always paid quickly / within a specified time frame\", z3: \"Payment requests (to suppliers / contractors) are rarely paid quickly / within a stipulated time frame\" },\n    { t: \"We have a low level of key personnel turnover\", z2: \"We have an average level of key personnel turnover\", z3: \"We have a high level of key personnel turnover\" },\n    { t: \"Our employees recommend the company to their friends\", z2: \"Not all of our employees recommend the company to their friends\", z3: \"Our employees do not recommend the company to their friends\" },\n    { t: \"Our product line is changing rapidly\", z2: \"Our product line is not changing fast enough\", z3: \"Our product line is slowly changing\" },\n    { t: \"Changes in our company are not met with resistance\", z2: \"Changes in our company are sometimes met with resistance\", z3: \"Changes in our company are often resisted\" },\n    { t: \"Our development budget has been growing for the past three years\", z2: \"Our development budget has slightly grown for the past three years\", z3: \"Our development budget has not been growing for the last three years\" },\n    { t: \"The share of our income from new areas of activity (markets, products) has been growing over the past three years\", z2: \"The share of our income from new areas of activity (markets, products) has slightly grown over the past three years\", z3: \"The share of our income from new areas of activity (markets, products) has not been growing for the last three years\" },\n    { t: \"Our profits have been growing for the last three years\", z2: \"Our profits have slightly grown over the past three years\", z3: \"Our profits have not grown for the last three years\" },\n    { t: \"Our profitability has been growing for the past three years\", z2: \"Our profitability has slightly increased over the past three years\", z3: \"Our profitability has not increased for the past three years\" },\n    { t: \"Our market share has been growing for the past three years\", z2: \"Our market share has grown little over the past three years\", z3: \"Our market share has not been growing for the last three years\" },\n    { t: \"Our sales volume has been growing for the last three years\", z2: \"Our sales volume has grown little for the last three years\", z3: \"Our sales volume has not grown for the last three years\" },\n    { t: \"Our clients recommend us\", z2: \"Our clients do not always recommend us\", z3: \"Our clients rarely recommend us\" },\n  ],\n};\n\n/* Express Diagnostics — Español\n * Para agregar un idioma: copia en.js (por ejemplo pt.js), cambia `ED_I18N.en` por `ED_I18N.pt`,\n * traduce cada texto y conserva las claves. No cambies el orden de `questions` (es el orden del cálculo).\n */\nED_I18N.es = {\n  code: 'es',\n  langName: 'Español',\n  locale: 'es-MX',\n\n  ui: {\n    start: 'Comenzar',\n    back: 'Atrás',\n    next: 'Siguiente',\n    pressEnter: 'presiona Enter ↵',\n    keyboardHint: 'Teclas 1–4 · 0 = No puedo responder',\n    of: 'de',\n    section: 'Área',\n    language: 'Idioma',\n    resume: 'Qué bueno que volviste. Tus respuestas hasta ahora están guardadas.',\n    resumeYes: 'Continuar donde me quedé',\n    resumeNo: 'Empezar de nuevo',\n    loading: 'Cargando…',\n    sending: 'Enviando tus respuestas…',\n    errorGeneric: 'Algo salió mal. Revisa tu conexión e inténtalo de nuevo.',\n    retry: 'Intentar de nuevo',\n  },\n\n  intro: {\n    eyebrow: 'Diagnóstico Exprés',\n    hello: 'Hola, {first}',\n    title: '{company} quiere conocer tu visión de la organización',\n    body: '{company} está realizando un diagnóstico organizacional con el Instituto Adizes. Calificarás 67 afirmaciones sobre cómo funciona hoy la empresa, en los 16 factores de la metodología Adizes.',\n    bullets: [\n      'Toma alrededor de 10 minutos. Puedes pausar y continuar después con el mismo enlace.',\n      'Tus respuestas se combinan con las de los demás participantes en un reporte grupal.',\n      'Responde según cómo funcionan las cosas hoy, no cómo deberían funcionar.',\n    ],\n    note: 'Si no tienes elementos para juzgar una afirmación, elige “No puedo responder”.',\n    deadline: 'Disponible hasta el {date}',\n    meta: '67 afirmaciones · alrededor de 10 minutos',\n  },\n\n  scale: [\n    { value: 2, label: 'Nunca', sub: 'Totalmente en desacuerdo' },\n    { value: 3, label: 'A veces', sub: 'Parcialmente en desacuerdo' },\n    { value: 4, label: 'A menudo', sub: 'Parcialmente de acuerdo' },\n    { value: 5, label: 'Siempre', sub: 'Totalmente de acuerdo' },\n  ],\n  cannot: 'No puedo responder',\n\n  cells: {\n    values: 'Valores', climate: 'Clima', responsibility: 'Estructura de responsabilidad', authority: 'Estructura de autoridad',\n    reward: 'Estructura de recompensas', planning: 'Planificación', information: 'Flujo de información', corrective: 'Acciones correctivas',\n    client: 'Interfaz con el cliente', transformation: 'Transformación', human: 'Factores humanos', financial: 'Factores financieros',\n    behaviour: 'Comportamiento', changes: 'Cambios', inefficiency: 'Ineficiencia', ineffectiveness: 'Inefectividad',\n  },\n\n  diagram: {\n    title: 'Factores causales de los problemas organizacionales sistémicos',\n    external: 'Factores externos',\n    internal: 'Factores internos',\n    causes: 'Causas organizacionales sistémicas',\n    culture: 'Cultura organizacional',\n    subsystems: 'Síntomas en los subsistemas',\n    manifestations: 'Manifestaciones sistémicas',\n    labels: {\n      values: 'Valores', climate: 'Clima', planning: 'Planeación estratégica', responsibility: 'Estructura organizacional',\n      authority: 'Autoridad', information: 'Flujo de información', corrective: 'Acciones correctivas', reward: 'Recompensas',\n      client: 'Interfaz con el cliente', transformation: 'Transformación', human: 'Recursos humanos', financial: 'Finanzas',\n      inefficiency: 'Ineficiencia', behaviour: 'Comportamiento', changes: 'Cambio', ineffectiveness: 'Inefectividad',\n    },\n  },\n\n  radar: {\n    title1: 'Problemas organizacionales sistémicos',\n    title2: 'Problemas operativos y manifestaciones sistémicas (consecuencias)',\n    normal: 'Situación normal',\n    abnormal: 'Situación anormal',\n    yours: 'La empresa',\n  },\n\n  colors: {\n    green: 'El proceso está sano',\n    yellow: 'Hay áreas de mejora',\n    red: 'Zona de enfoque clave',\n  },\n  colorShort: { green: 'Sano', yellow: 'Por mejorar', red: 'Zona de enfoque clave' },\n  frames: {\n    title: 'Tipo de marco',\n    sub: 'Según cuánto varían las opiniones de los participantes, se muestra un marco distinto',\n    dotted: 'Marco punteado: las opiniones de los participantes coinciden en gran medida',\n    thin: 'Marco delgado: hay una divergencia de opinión notable',\n    thick: 'Marco grueso: las opiniones de los participantes no coinciden en absoluto',\n  },\n  noAnswer: 'sin respuesta',\n\n  review: {\n    eyebrow: 'Último paso',\n    title: 'Listo para enviar',\n    body: 'Calificaste las 67 afirmaciones.',\n    cannot: '{n} como “No puedo responder”.',\n    warn: 'Una vez enviadas, tus respuestas ya no se pueden cambiar.',\n    submit: 'Enviar mis respuestas',\n    edit: 'Revisar mis respuestas',\n  },\n  thanks: {\n    title: 'Gracias, {first}',\n    body: 'Tus respuestas quedaron registradas. {company} recibirá el reporte grupal a través del Instituto Adizes. Ya puedes cerrar esta ventana.',\n  },\n  states: {\n    noToken: { title: 'Necesitas tu enlace personal', body: 'Para responder, abre el enlace que recibiste en tu correo de invitación.' },\n    invalid_link: { title: 'Este enlace no es válido', body: 'Revisa que hayas abierto el enlace completo del correo de invitación. Si el problema sigue, escríbenos a info@adizes.com.' },\n    completed: { title: 'Ya respondiste', body: 'Tus respuestas quedaron registradas. Gracias por participar.' },\n    closed: { title: 'Este diagnóstico ya cerró', body: 'Ya no se reciben respuestas. Si crees que es un error, contacta a quien te invitó.' },\n    not_open: { title: 'Este diagnóstico aún no está abierto', body: 'Inténtalo más tarde con el mismo enlace.' },\n  },\n\n  pdf: {\n    title: 'Diagnóstico Exprés',\n    subtitle: 'Reporte',\n    company: 'Empresa',\n    date: 'Fecha del reporte',\n    design: 'Diseño del estudio: encuesta a distancia a la alta dirección',\n    participants: 'Participantes',\n    participantsCount: 'Participantes encuestados',\n    howTitle: 'Cómo leer este reporte',\n    howBody: 'Cada uno de los 16 factores se califica con las respuestas de los participantes en una escala de 4 puntos (“No puedo responder” no cuenta como respuesta y baja la calificación del factor). El mapa causal muestra dónde se originan los problemas, las gráficas de radar comparan la empresa con una situación normal y una anormal, y la última sección presenta cada afirmación con su calificación.',\n    summary: 'En resumen',\n    keyFactors: 'Factores organizacionales clave',\n    keyFactorsHelp: 'Cada afirmación aparece con la redacción que corresponde a su calificación.',\n    colorsTitle: 'Significado de los colores',\n    footer: 'Instituto Adizes · Diagnóstico Exprés',\n    page: 'Página',\n    cont: 'cont.',\n  },\n\n  questions: [\n    { t: \"Nuestro sistema de valores está claramente articulado en unas pocas palabras/frases\", z2: \"Nuestro sistema de valores no está claramente articulado\", z3: \"Nuestro sistema de valores no está articulado\" },\n    { t: \"Nuestro sistema de valores es respetado en nuestra práctica empresarial diaria, los valores declarados corresponden a los demostrados\", z2: \"Nuestro sistema de valores no siempre es respetado en nuestra práctica empresarial diaria, los valores declarados no siempre corresponden a los demostrados\", z3: \"Nuestro sistema de valores a menudo no se cumple en nuestra práctica empresarial diaria, los valores declarados a menudo no corresponden con los demostrados\" },\n    { t: \"Nuestro sistema de valores es el mismo en todas las divisiones\", z2: \"Nuestro sistema de valores no es el mismo en algunos departamentos\", z3: \"Nuestro sistema de valores no es el mismo en muchos departamentos\" },\n    { t: \"Nuestra cultura corporativa es muy similar en la mayoría de los departamentos\", z2: \"Nuestra cultura corporativa no es lo suficientemente similar en la mayoría de los departamentos\", z3: \"Nuestra cultura corporativa no es la misma en la mayoría de los departamentos\" },\n    { t: \"Nuestra cultura corporativa se caracteriza por un alto nivel de colaboración entre las divisiones\", z2: \"Nuestra cultura corporativa se caracteriza por la falta de cooperación entre departamentos\", z3: \"Nuestra cultura corporativa se caracteriza por un bajo nivel de cooperación entre las divisiones\" },\n    { t: \"Nuestra cultura corporativa se caracteriza por un alto nivel de disciplina en el desempeño\", z2: \"Nuestra cultura corporativa se caracteriza por la falta de disciplina en el desempeño\", z3: \"Nuestra cultura corporativa se caracteriza por un bajo nivel de disciplina en el desempeño\" },\n    { t: \"Nuestra cultura corporativa se caracteriza por la capacidad de expresar sin temor nuestras propias opiniones\", z2: \"Nuestra cultura corporativa no siempre se caracteriza por la capacidad de expresar sin miedo nuestras propias opiniones\", z3: \"Nuestra cultura corporativa no se caracteriza por la capacidad de expresar sin temor nuestras propias opiniones\" },\n    { t: \"Nuestra cultura corporativa se caracteriza por una alta iniciativa de los empleados\", z2: \"Nuestra cultura corporativa se caracteriza por una iniciativa insuficiente de los empleados\", z3: \"Nuestra cultura corporativa se caracteriza por la baja iniciativa de los empleados\" },\n    { t: \"Nuestra cultura corporativa se caracteriza por un bajo nivel de conflictividad\", z2: \"Nuestra cultura corporativa no siempre se caracteriza por bajos niveles de conflicto\", z3: \"Nuestra cultura corporativa no se caracteriza por un bajo nivel de conflictividad\" },\n    { t: \"Nuestra estructura organizativa es compatible con el modelo de negocio actual\", z2: \"Nuestra estructura organizativa no es lo suficientemente compatible con el modelo de negocio actual\", z3: \"Nuestra estructura organizativa no es totalmente compatible con el modelo de negocio actual\" },\n    { t: \"Nuestra estructura organizacional apoya bien los objetivos a largo plazo de la empresa\", z2: \"Nuestra estructura organizacional no respalda suficientemente los objetivos a largo plazo de la empresa\", z3: \"Nuestra estructura organizacional tiene poco apoyo para los objetivos a largo plazo de la empresa\" },\n    { t: \"Nuestra estructura organizacional contiene todas las funciones necesarias\", z2: \"Nuestra estructura organizacional no contiene todas las funciones necesarias\", z3: \"Nuestra estructura organizacional carece de muchas funciones esenciales\" },\n    { t: \"No hay áreas de responsabilidad poco claras o superpuestas en nuestra estructura organizacional\", z2: \"A veces hay áreas de responsabilidad poco claras o superpuestas en nuestra estructura organizacional\", z3: \"Hay muchas áreas de responsabilidad poco claras o superpuestas en nuestra estructura organizacional\" },\n    { t: \"Nuestra estructura organizacional se basa en gran medida “en torno a las funciones” en lugar de “en torno a las personas”\", z2: \"Nuestra estructura organizacional es un poco “alrededor de funciones” en lugar de “alrededor de personas”\", z3: \"Nuestra estructura organizacional está más “en torno a las personas” que “en torno a las funciones”\" },\n    { t: \"La mayoría de nuestros líderes tienen suficiente autoridad para manejar los desafíos que enfrentan\", z2: \"Algunos de nuestros líderes carecen de la autoridad para afrontar los desafíos que enfrentan\", z3: \"Muchos de nuestros líderes carecen de la autoridad para afrontar los desafíos que enfrentan\" },\n    { t: \"En nuestra empresa, la mayor autoridad la tienen las divisiones comerciales\", z2: \"En nuestra empresa, solo una parte de la autoridad está en manos de las divisiones comerciales\", z3: \"En nuestra empresa, una pequeña parte de la autoridad la tienen las divisiones comerciales\" },\n    { t: \"Nuestra estructura de autoridad permite una rápida toma de decisiones\", z2: \"Nuestra estructura de autoridad no siempre permite una rápida toma de decisiones\", z3: \"Nuestra estructura de autoridad no permite una toma de decisiones rápida\" },\n    { t: \"Nuestra estructura de autoridad no genera conflictos en el proceso de toma de decisiones\", z2: \"Nuestra estructura de autoridad a veces provoca conflictos en el proceso de toma de decisiones\", z3: \"Nuestra estructura de autoridad a menudo causa conflictos en el proceso de toma de decisiones\" },\n    { t: \"Nuestro sistema de recompensas contribuye al logro de nuestros objetivos\", z2: \"Nuestro sistema de recompensas no contribuye completamente al logro de nuestros objetivos\", z3: \"Nuestro sistema de recompensas rara vez nos ayuda a alcanzar nuestros objetivos\" },\n    { t: \"Nuestros empleados están satisfechos con el sistema de motivación existente\", z2: \"Nuestros empleados no siempre están satisfechos con el sistema de motivación existente\", z3: \"Nuestros empleados a menudo no están satisfechos con el sistema de motivación existente\" },\n    { t: \"Nuestros objetivos/estrategia a largo plazo están claramente definidos\", z2: \"Nuestros objetivos/estrategia a largo plazo no están bien definidos\", z3: \"Nuestros objetivos/estrategia a largo plazo no están definidos\" },\n    { t: \"Nuestros objetivos/estrategia a largo plazo están documentados\", z2: \"Nuestros objetivos/estrategia a largo plazo no están completamente documentados\", z3: \"Nuestros objetivos/estrategia a largo plazo no están documentados\" },\n    { t: \"Nuestros objetivos/estrategia a largo plazo son conocidos por la gerencia\", z2: \"No todos nuestros objetivos/estrategias a largo plazo son conocidos por la gerencia\", z3: \"Nuestros objetivos/estrategia a largo plazo no son conocidos por la gerencia\" },\n    { t: \"Nuestras metas/estrategia a largo plazo fueron desarrolladas con la participación de la gerencia\", z2: \"Nuestras metas/estrategia a largo plazo se desarrollaron con una participación gerencial insuficiente\", z3: \"Nuestros objetivos/estrategia a largo plazo se desarrollaron sin la participación de la gerencia\" },\n    { t: \"Nuestros objetivos/estrategia a largo plazo están respaldados por la dirección\", z2: \"Nuestros objetivos/estrategia a largo plazo no están totalmente respaldados por la dirección\", z3: \"Nuestros objetivos/estrategia a largo plazo no están respaldados por la dirección\" },\n    { t: \"Nuestros objetivos/estrategia a largo plazo están respaldados por un plan de acción detallado\", z2: \"Nuestros objetivos/estrategia a largo plazo no están totalmente respaldados por un plan de acción detallado\", z3: \"Nuestros objetivos/estrategia a largo plazo no están respaldados por un plan de acción específico\" },\n    { t: \"Nuestros objetivos/estrategia a largo plazo están respaldados por los recursos necesarios\", z2: \"Nuestros objetivos/estrategia a largo plazo no cuentan con todos los recursos\", z3: \"Nuestros objetivos/estrategia a largo plazo no cuentan con recursos\" },\n    { t: \"Evaluamos regularmente la implementación de objetivos/estrategias a largo plazo\", z2: \"No evaluamos regularmente la implementación de objetivos/estrategias a largo plazo\", z3: \"Rara vez evaluamos la implementación de objetivos/estrategias a largo plazo\" },\n    { t: \"Nuestros objetivos/estrategia a largo plazo se revisan regularmente/si es necesario\", z2: \"Nuestros objetivos/estrategia a largo plazo no se revisan con la suficiente regularidad\", z3: \"Nuestras metas/estrategia a largo plazo rara vez se revisan\" },\n    { t: \"Basamos nuestros planes anuales en nuestros objetivos/estrategias a largo plazo\", z2: \"No siempre basamos nuestros planes anuales en nuestros objetivos/estrategias a largo plazo\", z3: \"No basamos nuestros planes anuales en nuestros objetivos/estrategias a largo plazo\" },\n    { t: \"Tengo suficiente información para tomar decisiones gerenciales clave de manera habitual\", z2: \"No siempre tengo suficiente información para tomar decisiones gerenciales clave de manera habitual\", z3: \"A menudo no tengo suficiente información para tomar decisiones gerenciales clave de manera habitual\" },\n    { t: \"La información para la toma de decisiones gerenciales suele contener información fiable\", z2: \"La información para la toma de decisiones gerenciales no siempre contiene información confiable\", z3: \"La información para la toma de decisiones gerenciales a menudo no contiene información fiable\" },\n    { t: \"La información para la toma de decisiones gerenciales suele recopilarse en el momento oportuno\", z2: \"La información para la toma de decisiones gerenciales no siempre se recopila de manera oportuna\", z3: \"La información para la toma de decisiones gerenciales generalmente no se recopila de manera oportuna\" },\n    { t: \"La información para la toma de decisiones gerenciales no contiene información redundante innecesaria\", z2: \"La información para la toma de decisiones gerenciales a veces contiene información innecesaria y redundante\", z3: \"La información para la toma de decisiones gerenciales a menudo contiene información innecesaria y redundante\" },\n    { t: \"La recolección de información para la toma de decisiones gerenciales está automatizada en nuestra empresa\", z2: \"La recolección de información para la toma de decisiones de gestión no está totalmente automatizada en nuestra empresa\", z3: \"La recolección de información para la toma de decisiones de gestión no está automatizada en nuestra empresa\" },\n    { t: \"Realizamos control/análisis del desempeño de nuestra empresa al menos una vez al mes\", z2: \"No siempre llevamos a cabo un control/análisis del rendimiento de la empresa al menos una vez al mes\", z3: \"Raramente monitoreamos/analizamos el desempeño de nuestra empresa\" },\n    { t: \"Realizamos control/análisis del desempeño de nuestra empresa en un equipo de directivos clave\", z2: \"No siempre monitoreamos/analizamos el desempeño de nuestra empresa en un equipo de directores clave\", z3: \"No monitoreamos/analizamos el desempeño de la empresa en un equipo de directores clave\" },\n    { t: \"Controlamos y analizamos el desempeño de nuestra empresa con discusión, fijación y control posterior de la implementación de medidas correctivas\", z2: \"No siempre controlamos y analizamos el desempeño de nuestra empresa con discusión, fijación y control posterior de la implementación de medidas correctivas\", z3: \"No controlamos y analizamos el desempeño de nuestra empresa con discusión, fijación y control posterior de la implementación de medidas correctivas\" },\n    { t: \"Controlamos y analizamos el desempeño de nuestra empresa con la identificación y solución de problemas sistémicos\", z2: \"No siempre controlamos y analizamos el desempeño de nuestra empresa con la identificación y solución de problemas sistémicos\", z3: \"No controlamos y analizamos el desempeño de nuestra empresa con la identificación y solución de problemas sistémicos\" },\n    { t: \"Conocemos bien a nuestros clientes objetivo y sus necesidades\", z2: \"No siempre conocemos bien a los clientes objetivo y sus necesidades\", z3: \"No conocemos bien a los clientes objetivo y sus necesidades\" },\n    { t: \"Nuestra propuesta de venta y nuestros modelos de promoción y venta responden en gran medida a las necesidades de nuestros clientes\", z2: \"Nuestra propuesta de venta y nuestros modelos de promoción y venta no satisfacen plenamente las necesidades de nuestros clientes\", z3: \"Nuestra propuesta de venta y nuestros modelos de promoción y venta satisfacen en pequeña medida las necesidades de nuestros clientes\" },\n    { t: \"Nuestra propuesta de valor y modelos de promoción y venta son competitivos\", z2: \"Nuestra propuesta de valor y modelos de promoción y venta no siempre son competitivos\", z3: \"Nuestra propuesta de valor y modelos de promoción y venta no son totalmente competitivos\" },\n    { t: \"Nuestros planes anuales/trimestrales de producción/unidades operativas se basan en el plan de ventas\", z2: \"Nuestros planes anuales/trimestrales de producción/unidades operativas se basan parcialmente en el plan de ventas\", z3: \"Nuestros planes anuales/trimestrales de producción/unidades operativas no se basan en planes de ventas\" },\n    { t: \"Las actividades de las funciones comerciales y operativas (producción) están bien coordinadas entre sí\", z2: \"Las acciones de las funciones comercial y operativa (producción) no siempre están bien coordinadas entre sí\", z3: \"Las acciones de las funciones comerciales y operativas (producción) están mal coordinadas entre sí\" },\n    { t: \"La mayoría de nuestros procesos y procedimientos estándar están documentados\", z2: \"No todos nuestros procesos y procedimientos estándar están documentados\", z3: \"La mayoría de nuestros procesos y procedimientos estándar no están documentados\" },\n    { t: \"Seguimos la mayoría de nuestros procesos y procedimientos estándar\", z2: \"Seguimos algunos de nuestros procesos y procedimientos estándar\", z3: \"Rara vez seguimos nuestros procesos y procedimientos estándar\" },\n    { t: \"La mayoría de nuestros procesos y procedimientos estándar están sujetos a ajustes periódicos\", z2: \"Solo un subconjunto de nuestros procesos y procedimientos estándar está sujeto a ajustes periódicos\", z3: \"Una pequeña parte de nuestros procesos y procedimientos estándar están sujetos a ajustes periódicos\" },\n    { t: \"La mayoría de nuestros procesos y procedimientos estándar están automatizados\", z2: \"Solo una parte de nuestros procesos y procedimientos estándar están automatizados\", z3: \"Una pequeña parte de nuestros procesos y procedimientos estándar están automatizados\" },\n    { t: \"Nuestro trabajo en el desarrollo y lanzamiento de nuevos productos es efectivo\", z2: \"Nuestra actividad en el desarrollo y lanzamiento de nuevos productos no es lo suficientemente eficaz\", z3: \"Nuestra actividad en el desarrollo y lanzamiento de nuevos productos es ineficaz\" },\n    { t: \"Adoptamos un enfoque sistemático para la capacitación y el desarrollo\", z2: \"Nuestro enfoque de capacitación y desarrollo no es lo suficientemente sistemático\", z3: \"No abordamos la capacitación y el desarrollo de forma sistemática\" },\n    { t: \"Manejamos desafíos de contratación\", z2: \"No hacemos frente completamente a las tareas de contratación\", z3: \"Somos malos en las tareas de contratación\" },\n    { t: \"No experimentamos escasez de personal calificado\", z2: \"A veces experimentamos escasez de personal cualificado\", z3: \"Estamos experimentando una escasez de personal calificado\" },\n    { t: \"Conocemos el punto de equilibrio\", z2: \"Aproximadamente conocemos el punto de equilibrio\", z3: \"No conocemos el punto de equilibrio\" },\n    { t: \"Hemos implementado un proceso de presupuestación y lo seguimos\", z2: \"Nuestro proceso de presupuestación no está completamente implementado\", z3: \"No tenemos un proceso de presupuestación implementado\" },\n    { t: \"Hemos implementado una contabilidad de gestión y funciona\", z2: \"Hemos implementado parcialmente una contabilidad de gestión\", z3: \"No hemos implementado una contabilidad de gestión\" },\n    { t: \"Las solicitudes de pago (a proveedores/contratistas) en la mayoría de los casos se pagan rápidamente/dentro de un plazo específico\", z2: \"Las solicitudes de pago (a proveedores/contratistas) no siempre se pagan rápidamente/dentro de un plazo específico\", z3: \"Las solicitudes de pago (a proveedores/contratistas) rara vez se pagan rápidamente/dentro de un plazo estipulado\" },\n    { t: \"Tenemos un bajo nivel de rotación de personal clave\", z2: \"Tenemos un nivel medio de rotación de personal clave\", z3: \"Tenemos un alto nivel de rotación de personal clave\" },\n    { t: \"Nuestros empleados recomiendan la empresa a sus amigos\", z2: \"No todos nuestros empleados recomiendan la empresa a sus amigos\", z3: \"Nuestros empleados no recomiendan la empresa a sus amigos\" },\n    { t: \"Nuestra línea de productos está cambiando rápidamente\", z2: \"Nuestra línea de productos no está cambiando lo suficientemente rápido\", z3: \"Nuestra línea de productos está cambiando lentamente\" },\n    { t: \"Los cambios en nuestra empresa no encuentran resistencia\", z2: \"Los cambios en nuestra empresa a veces encuentran resistencia\", z3: \"Los cambios en nuestra empresa a menudo encuentran resistencia\" },\n    { t: \"Nuestro presupuesto de desarrollo ha estado creciendo durante los últimos tres años\", z2: \"Nuestro presupuesto de desarrollo ha crecido ligeramente durante los últimos tres años\", z3: \"Nuestro presupuesto de desarrollo no ha estado creciendo durante los últimos tres años\" },\n    { t: \"La participación de nuestros ingresos de nuevas áreas de actividad (mercados, productos) ha ido creciendo en los últimos tres años\", z2: \"La participación de nuestros ingresos de nuevas áreas de actividad (mercados, productos) ha crecido ligeramente en los últimos tres años\", z3: \"La participación de nuestros ingresos de nuevas áreas de actividad (mercados, productos) no ha estado creciendo durante los últimos tres años\" },\n    { t: \"Nuestras ganancias han estado creciendo durante los últimos tres años\", z2: \"Nuestras ganancias han crecido ligeramente en los últimos tres años\", z3: \"Nuestras ganancias no han crecido en los últimos tres años\" },\n    { t: \"Nuestra rentabilidad ha estado creciendo durante los últimos tres años\", z2: \"Nuestra rentabilidad ha aumentado ligeramente en los últimos tres años\", z3: \"Nuestra rentabilidad no ha aumentado en los últimos tres años\" },\n    { t: \"Nuestra participación de mercado ha estado creciendo durante los últimos tres años\", z2: \"Nuestra participación de mercado ha crecido poco en los últimos tres años\", z3: \"Nuestra participación de mercado no ha estado creciendo durante los últimos tres años\" },\n    { t: \"Nuestro volumen de ventas ha estado creciendo durante los últimos tres años\", z2: \"Nuestro volumen de ventas ha crecido poco en los últimos tres años\", z3: \"Nuestro volumen de ventas no ha crecido en los últimos tres años\" },\n    { t: \"Nuestros clientes nos recomiendan\", z2: \"Nuestros clientes no siempre nos recomiendan\", z3: \"Nuestros clientes raramente nos recomiendan\" },\n  ],\n};\n\n/* Shared browser utilities (bundled inside each widget's private scope). */\nfunction esc(s) { return String(s == null ? '' : s).replace(/[&<>\"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '\"': '&quot;', \"'\": '&#39;' }[c]; }); }\nfunction md(s) { return esc(s).replace(/\\*\\*(.+?)\\*\\*/g, '<strong>$1</strong>'); }\nfunction fill(s, map) { return String(s).replace(/\\{(\\w+)\\}/g, function (m, k) { return map[k] != null ? map[k] : m; }); }\nfunction store(key, val) { try { if (val === null) localStorage.removeItem(key); else localStorage.setItem(key, JSON.stringify(val)); } catch (e) {} }\nfunction load(key) { try { var v = localStorage.getItem(key); return v ? JSON.parse(v) : null; } catch (e) { return null; } }\nfunction qs(name) { try { return new URLSearchParams(location.search).get(name); } catch (e) { return null; } }\n\nvar SCRIPT_SRC = (document.currentScript && document.currentScript.src) || '';\n// .../<tool>/dist/<file>.js  →  .../shared/assets/\nfunction detectAssets() { return SCRIPT_SRC ? SCRIPT_SRC.replace(/\\/[^\\/]+\\/dist\\/[^\\/]*$/, '/shared/assets/') : ''; }\n\nfunction loadScript(src) {\n  return new Promise(function (res, rej) {\n    var s = document.createElement('script');\n    s.src = src; s.async = true; s.onload = res; s.onerror = function () { rej(new Error('load ' + src)); };\n    document.head.appendChild(s);\n  });\n}\nfunction fetchB64(url) {\n  return fetch(url).then(function (r) { if (!r.ok) throw new Error(url + ' ' + r.status); return r.arrayBuffer(); }).then(function (buf) {\n    var bytes = new Uint8Array(buf), bin = '', chunk = 0x8000;\n    for (var i = 0; i < bytes.length; i += chunk) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk));\n    return btoa(bin);\n  });\n}\n\n// POST to the Apps Script web app. text/plain avoids the CORS preflight.\nfunction api(endpoint, payload, timeoutMs) {\n  if (!endpoint) return Promise.resolve({ ok: true, demo: true, id: 'DEMO-' + Date.now().toString(36).toUpperCase() });\n  var ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null;\n  var t = ctrl ? setTimeout(function () { ctrl.abort(); }, timeoutMs || 30000) : null;\n  return fetch(endpoint, {\n    method: 'POST',\n    headers: { 'Content-Type': 'text/plain;charset=utf-8' },\n    body: JSON.stringify(payload),\n    redirect: 'follow',\n    signal: ctrl ? ctrl.signal : undefined,\n  }).then(function (r) { return r.json(); }).then(function (j) {\n    if (t) clearTimeout(t);\n    if (!j || !j.ok) { var e = new Error((j && j.error) || 'server'); e.code = j && j.error; throw e; }\n    return j;\n  }, function (e) { if (t) clearTimeout(t); throw e; });\n}\n\nfunction injectStyle(id, css, rootSel) {\n  if (document.getElementById(id)) return;\n  var st = document.createElement('style');\n  st.id = id;\n  st.textContent = css.split('__ROOT__').join(rootSel);\n  document.head.appendChild(st);\n}\nfunction loadFontCss() {\n  if (document.querySelector('link[data-adz-font]')) return;\n  var l = document.createElement('link');\n  l.rel = 'stylesheet'; l.setAttribute('data-adz-font', '1');\n  l.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800&display=swap';\n  document.head.appendChild(l);\n}\nfunction utmMeta(startedAt) {\n  return {\n    page: location.href.split('#')[0], referrer: document.referrer || '',\n    utm_source: qs('utm_source') || '', utm_medium: qs('utm_medium') || '', utm_campaign: qs('utm_campaign') || '',\n    utm_content: qs('utm_content') || '', utm_term: qs('utm_term') || '',\n    startedAt: startedAt || '', tz: (Intl.DateTimeFormat().resolvedOptions().timeZone || ''),\n  };\n}\nfunction formatDate(iso, locale) {\n  try { return new Date(iso || Date.now()).toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' }); }\n  catch (e) { return String(iso || '').slice(0, 10); }\n}\n\n/* Express Diagnostics — scoring engine (exact port of the legacy s.adizes.com algorithm).\n * Plain ES5 so the SAME file runs in the browser widget, in the admin and in Apps Script.\n *\n * Legacy rules (see express-diagnostics/LEGACY.md):\n *  - Raw answers 1..5. 1 = \"cannot answer\" → excluded. 2..5 → 1..4.\n *  - Per question: dispersion = sample std dev (n-1); n<=1 → 0.\n *    middle = the mode if exactly one value is the most frequent; otherwise mean − dispersion/2.\n *    No valid answers (n = 0) → middle 0, dispersion 0, and the report shows the base statement.\n *  - Text: middle ≥ 3 → zone 1 (base), < 2 → zone 3, else zone 2.\n *  - Colour: ≥ 3 green, ≥ 2 yellow, else red. Border: 1 participant → dotted;\n *    dispersion ≥ 1 → thick; ≥ 0.7 → thin; else dotted.\n *  - Category (cell): mean of its questions' middles (n=0 questions count as 0), mean of dispersions,\n *    percent = middle / 4 * 100, participants = the minimum n of its questions.\n */\nvar ED = (function () {\n  var NORMS = { upperMiddle: 3, lowerMiddle: 2, upperDispersion: 1, lowerDispersion: 0.7, scale: 4 };\n\n  // The 16 matrix cells, in report order (categoryID ascending). `key` is used by the language files.\n  var CELLS = [\n    { id: 17, code: '1.1 V', key: 'values' },\n    { id: 18, code: '1.2 C', key: 'climate' },\n    { id: 20, code: '2.1 H', key: 'responsibility' },\n    { id: 21, code: '2.2 V', key: 'authority' },\n    { id: 22, code: '2.3 R', key: 'reward' },\n    { id: 23, code: '3.1 P', key: 'planning' },\n    { id: 24, code: '3.2 I', key: 'information' },\n    { id: 25, code: '3.3 CA', key: 'corrective' },\n    { id: 26, code: '4/5 1 CI', key: 'client' },\n    { id: 27, code: '4/5 2 T', key: 'transformation' },\n    { id: 28, code: '4/5 3 HR', key: 'human' },\n    { id: 29, code: '4/5 4 F', key: 'financial' },\n    { id: 30, code: '6.1 I', key: 'behaviour' },\n    { id: 31, code: '6.2 E', key: 'changes' },\n    { id: 32, code: '6.3 A', key: 'inefficiency' },\n    { id: 33, code: '6.4 P', key: 'ineffectiveness' },\n  ];\n\n  // Category of each of the 67 questions (questions 68–72 were blank in production and are not used).\n  var QUESTION_CATS = [].concat(\n    rep(17, 3), rep(18, 6), rep(20, 5), rep(21, 4), rep(22, 2), rep(23, 10), rep(24, 5), rep(25, 4),\n    rep(26, 5), rep(27, 5), rep(28, 3), rep(29, 4), rep(30, 2), rep(31, 4), rep(32, 2), rep(33, 3)\n  );\n\n  // Radar charts (8 axes each, clockwise from the top) and the causal-factors diagram.\n  var RADARS = [[17, 18, 20, 21, 22, 23, 24, 25], [26, 27, 28, 29, 30, 31, 32, 33]];\n\n  function rep(v, n) { var a = []; for (var i = 0; i < n; i++) a.push(v); return a; }\n\n  function questionStats(raws) {\n    var xs = [];\n    for (var i = 0; i < raws.length; i++) { var r = Number(raws[i]); if (r > 1 && r <= 5) xs.push(r - 1); }\n    var n = xs.length;\n    if (!n) return { n: 0, middle: 0, dispersion: 0, mean: 0, mode: null };\n    var sum = 0; for (var j = 0; j < n; j++) sum += xs[j];\n    var mean = sum / n;\n    var sq = 0; for (var k = 0; k < n; k++) sq += (xs[k] - mean) * (xs[k] - mean);\n    var dispersion = n > 1 ? Math.sqrt(sq / (n - 1)) : 0;\n    var freq = {}, max = 0;\n    for (var m = 0; m < n; m++) { freq[xs[m]] = (freq[xs[m]] || 0) + 1; if (freq[xs[m]] > max) max = freq[xs[m]]; }\n    var tops = []; for (var v in freq) if (freq[v] === max) tops.push(Number(v));\n    var mode = tops.length === 1 ? tops[0] : null;\n    return { n: n, middle: mode !== null ? mode : mean - dispersion / 2, dispersion: dispersion, mean: mean, mode: mode };\n  }\n\n  function colorOf(middle) { return middle >= NORMS.upperMiddle ? 'green' : middle >= NORMS.lowerMiddle ? 'yellow' : 'red'; }\n  function borderOf(n, dispersion) {\n    if (n === 1) return 'dotted';\n    if (dispersion >= NORMS.upperDispersion) return 'thick';\n    if (dispersion >= NORMS.lowerDispersion) return 'thin';\n    return 'dotted';\n  }\n  function zoneOf(st) {\n    if (!st.n) return 0; // no valid answers: legacy shows the base statement\n    return st.middle >= NORMS.upperMiddle ? 1 : st.middle < NORMS.lowerMiddle ? 3 : 2;\n  }\n  function pct(middle) { return middle / NORMS.scale * 100; }\n\n  /**\n   * responses: array of respondents, each an array of raw answers (1..5) in question order.\n   * opts.cats: optional per-question category list (defaults to the 67-question bank).\n   */\n  function score(responses, opts) {\n    opts = opts || {};\n    var cats = opts.cats || QUESTION_CATS;\n    var questions = [];\n    for (var q = 0; q < cats.length; q++) {\n      var raws = [];\n      for (var r = 0; r < responses.length; r++) raws.push(responses[r][q]);\n      var st = questionStats(raws);\n      questions.push({\n        i: q, cat: cats[q], n: st.n, middle: st.middle, dispersion: st.dispersion,\n        color: colorOf(st.middle), border: borderOf(st.n, st.dispersion), zone: zoneOf(st),\n      });\n    }\n    var cells = [];\n    for (var c = 0; c < CELLS.length; c++) {\n      var qs = questions.filter(function (x) { return x.cat === CELLS[c].id; });\n      if (!qs.length) continue;\n      var mid = 0, disp = 0, n = Infinity;\n      qs.forEach(function (x) { mid += x.middle; disp += x.dispersion; if (x.n < n) n = x.n; });\n      mid /= qs.length; disp /= qs.length;\n      cells.push({\n        id: CELLS[c].id, code: CELLS[c].code, key: CELLS[c].key,\n        middle: mid, dispersion: disp, percent: pct(mid), n: n,\n        color: colorOf(mid), border: borderOf(n, disp),\n        questions: qs.map(function (x) { return x.i; }),\n      });\n    }\n    return {\n      participants: responses.length,\n      questions: questions,\n      cells: cells,\n      norms: { upperMiddle: NORMS.upperMiddle, lowerMiddle: NORMS.lowerMiddle, upperPercent: pct(NORMS.upperMiddle), lowerPercent: pct(NORMS.lowerMiddle) },\n    };\n  }\n\n  function validAnswers(a) {\n    if (!a || a.length !== QUESTION_CATS.length) return false;\n    for (var i = 0; i < a.length; i++) { var v = Number(a[i]); if (!(v >= 1 && v <= 5 && Math.floor(v) === v)) return false; }\n    return true;\n  }\n  function cellById(result, id) { for (var i = 0; i < result.cells.length; i++) if (result.cells[i].id === id) return result.cells[i]; return null; }\n\n  return {\n    NORMS: NORMS, CELLS: CELLS, QUESTION_CATS: QUESTION_CATS, RADARS: RADARS, COUNT: QUESTION_CATS.length,\n    questionStats: questionStats, score: score, validAnswers: validAnswers, cellById: cellById,\n    colorOf: colorOf, borderOf: borderOf,\n  };\n})();\n\n/* Shared PDF helpers (jsPDF + Montserrat). Bundled inside each widget and the admin. */\nvar JSPDF_URL = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';\nvar PDF_ASSETS = {};\nfunction getPdfAssets(base) {\n  if (PDF_ASSETS[base]) return PDF_ASSETS[base];\n  var jsp = (window.jspdf && window.jspdf.jsPDF) ? Promise.resolve() : loadScript(JSPDF_URL);\n  var f = function (n) { return fetchB64(base + 'fonts/Montserrat-' + n + '.ttf'); };\n  var img = function (n) { return fetchB64(base + n).then(function (b) { return 'data:image/png;base64,' + b; }).catch(function () { return null; }); };\n  var p = Promise.all([jsp, f('Light'), f('Regular'), f('SemiBold'), f('Bold'), img('adizes-logo-color.png'), img('adizes-logo-color-white.png'), img('arrow-red.png'), img('arrow-white.png')])\n    .then(function (a) { return { fonts: { Light: a[1], Regular: a[2], SemiBold: a[3], Bold: a[4] }, logo: a[5], logoWhite: a[6], arrowRed: a[7], arrowWhite: a[8] }; });\n  p.catch(function () { delete PDF_ASSETS[base]; });\n  PDF_ASSETS[base] = p;\n  return p;\n}\n\nfunction hexRgb(hex) { var n = parseInt(hex.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }\n\nvar PDF_C = {\n  INK: '#111111', MUTED: '#5f6368', SOFT: '#8a8f96', LINE: '#e4e4e4', PAPER: '#f5f5f5', RED: '#d7141a', WHITE: '#ffffff',\n  green: '#1e8e4e', yellow: '#d9a400', red: '#d7141a', yellowText: '#9a7200',\n  greenT: '#dcf2e5', yellowT: '#fff0bf', redT: '#fbd6d7',\n};\n\n// New letter-size document with Montserrat registered as family 'M' (light/regular/semibold/bold).\nfunction newPdf(A) {\n  var doc = new window.jspdf.jsPDF({ unit: 'pt', format: 'letter', compress: true });\n  ['Light', 'Regular', 'SemiBold', 'Bold'].forEach(function (w) {\n    doc.addFileToVFS('M-' + w + '.ttf', A.fonts[w]);\n    doc.addFont('M-' + w + '.ttf', 'M', w.toLowerCase());\n  });\n  return doc;\n}\n\nfunction pdfKit(doc) {\n  var K = {};\n  K.font = function (w, size, color) { doc.setFont('M', w); doc.setFontSize(size); doc.setTextColor.apply(doc, hexRgb(color || PDF_C.INK)); };\n  K.fill = function (c) { doc.setFillColor.apply(doc, hexRgb(c)); };\n  K.stroke = function (c, w) { doc.setDrawColor.apply(doc, hexRgb(c)); if (w != null) doc.setLineWidth(w); };\n  K.dash = function (arr) { if (doc.setLineDashPattern) doc.setLineDashPattern(arr || [], 0); };\n  K.alpha = function (a) { if (doc.setGState) doc.setGState(new doc.GState({ opacity: a })); };\n  K.split = function (text, width, w, size) { doc.setFont('M', w); doc.setFontSize(size); return doc.splitTextToSize(String(text), width); };\n  // Wrapped text with **bold** spans. Returns the y after the last line.\n  K.rich = function (text, x, y, width, size, opts) {\n    opts = opts || {};\n    var lh = size * (opts.lh || 1.5), color = opts.color || PDF_C.INK, bcolor = opts.bold || color;\n    var reg = opts.weight || 'regular', bw = opts.boldWeight || 'bold';\n    var tokens = [];\n    String(text).split(/(\\*\\*.+?\\*\\*)/).forEach(function (part) {\n      if (!part) return;\n      var b = /^\\*\\*.+\\*\\*$/.test(part); if (b) part = part.slice(2, -2);\n      part.split(/(\\s+)/).forEach(function (w) { if (w) tokens.push({ w: w, b: b }); });\n    });\n    var lines = [[]], lw = 0;\n    tokens.forEach(function (tk) {\n      doc.setFont('M', tk.b ? bw : reg); doc.setFontSize(size);\n      var tw = doc.getTextWidth(tk.w), space = /^\\s+$/.test(tk.w);\n      if (!space && lw + tw > width && lines[lines.length - 1].length) { lines.push([]); lw = 0; }\n      if (space && !lines[lines.length - 1].length) return;\n      lines[lines.length - 1].push({ w: tk.w, b: tk.b, tw: tw }); lw += tw;\n    });\n    lines.forEach(function (ln) {\n      while (ln.length && /^\\s+$/.test(ln[ln.length - 1].w)) ln.pop();\n      var cx = x;\n      if (opts.align === 'center') { var tot = ln.reduce(function (a, b) { return a + b.tw; }, 0); cx = x + (width - tot) / 2; }\n      ln.forEach(function (tk) {\n        K.font(tk.b ? bw : reg, size, tk.b ? bcolor : color);\n        if (!/^\\s+$/.test(tk.w)) doc.text(tk.w, cx, y);\n        cx += tk.tw;\n      });\n      y += lh;\n    });\n    return y;\n  };\n  K.richHeight = function (text, width, size, opts) {\n    opts = opts || {};\n    return K.split(String(text).replace(/\\*\\*/g, ''), width, opts.weight || 'regular', size).length * size * (opts.lh || 1.5);\n  };\n  // Down arrow (line + head)\n  K.arrowDown = function (x, y1, y2, color, w) {\n    K.stroke(color || PDF_C.INK, w || 1.4); K.dash([]); doc.line(x, y1, x, y2 - 4);\n    K.fill(color || PDF_C.INK); doc.triangle(x - 4, y2 - 5, x + 4, y2 - 5, x, y2, 'F');\n  };\n  return K;\n}\n\n/* Radar chart: values in 0–100 (%), labels per axis, clockwise from the top. */\nfunction pdfRadar(doc, K, cx, cy, R, values, labels, opts) {\n  opts = opts || {};\n  var n = values.length;\n  function pt(i, pct) { var a = (-90 + i * 360 / n) * Math.PI / 180; return [cx + R * pct / 100 * Math.cos(a), cy + R * pct / 100 * Math.sin(a)]; }\n  function poly(pct) { var p = []; for (var i = 0; i < n; i++) p.push(pt(i, pct)); return p; }\n  function path(points, style) {\n    var rel = []; for (var i = 1; i < points.length; i++) rel.push([points[i][0] - points[i - 1][0], points[i][1] - points[i - 1][1]]);\n    doc.lines(rel, points[0][0], points[0][1], [1, 1], style, true);\n  }\n  // grid\n  K.dash([]);\n  [25, 50, 75, 100].forEach(function (g) { K.stroke(PDF_C.LINE, 0.7); path(poly(g), 'S'); });\n  for (var i = 0; i < n; i++) { var e = pt(i, 100); K.stroke(PDF_C.LINE, 0.7); doc.line(cx, cy, e[0], e[1]); }\n  K.font('regular', 6.5, PDF_C.SOFT);\n  [25, 50, 75, 100].forEach(function (g) { doc.text(g + '%', cx + 3, cy - R * g / 100 + 8); });\n  // reference rings\n  [[opts.normal || 75, PDF_C.green], [opts.abnormal || 50, PDF_C.red]].forEach(function (rf) {\n    K.stroke(rf[1], 1); K.dash([2.5, 2]); path(poly(rf[0]), 'S'); K.dash([]);\n    poly(rf[0]).forEach(function (p) { K.fill(rf[1]); doc.circle(p[0], p[1], 1.6, 'F'); });\n  });\n  // company\n  var pts = values.map(function (v, k) { return pt(k, Math.max(0, Math.min(100, v))); });\n  K.alpha(0.12); K.fill(PDF_C.INK); path(pts, 'F'); K.alpha(1);\n  K.stroke(PDF_C.INK, 1.6); path(pts, 'S');\n  pts.forEach(function (p, k) { K.fill(PDF_C.WHITE); K.stroke(PDF_C.INK, 1.2); doc.circle(p[0], p[1], 2.8, 'FD'); });\n  // labels + values\n  for (var j = 0; j < n; j++) {\n    var a = (-90 + j * 360 / n) * Math.PI / 180, lx = cx + (R + 14) * Math.cos(a), ly = cy + (R + 14) * Math.sin(a);\n    var align = Math.abs(Math.cos(a)) < 0.2 ? 'center' : Math.cos(a) > 0 ? 'left' : 'right';\n    var lines = K.split(labels[j], 104, 'semibold', 8);\n    var top = Math.sin(a) < -0.2 ? ly - (lines.length - 1) * 10 - 9 : Math.sin(a) > 0.2 ? ly + 6 : ly - (lines.length * 10) / 2 + 3;\n    K.font('semibold', 8, PDF_C.INK);\n    lines.forEach(function (l, k) { doc.text(l, lx, top + k * 10, { align: align }); });\n    K.font('bold', 8, (opts.colors && opts.colors[j]) || PDF_C.RED);\n    doc.text(Math.round(values[j]) + '%', lx, top + lines.length * 10, { align: align });\n  }\n}\n\n/* Express Diagnostics — PDF report (jsPDF). Used by the widget (one person) and the admin (team).\n * d = { result: ED.score(...), company, participants: [names], dateIso }\n */\nvar ED_DIAGRAM = {\n  culture: ['values', 'climate'],\n  causes: [['planning', 'responsibility', 'authority'], ['information', 'corrective', 'reward']],\n  subsystems: [['client', 'transformation'], ['human', 'financial']],\n  manifestations: [['inefficiency', 'behaviour'], ['changes', 'ineffectiveness']],\n};\nfunction edCellByKey(result, key) { for (var i = 0; i < result.cells.length; i++) if (result.cells[i].key === key) return result.cells[i]; return null; }\nfunction edQuestionText(t, q) { var x = t.questions[q.i]; return q.zone === 2 ? (x.z2 || x.t) : q.zone === 3 ? (x.z3 || x.t) : x.t; }\nfunction edCounts(result) { var c = { red: 0, yellow: 0, green: 0 }; result.cells.forEach(function (x) { c[x.color]++; }); return c; }\n\nfunction renderEdPdf(A, lang, d) {\n  var t = ED_I18N[lang] || ED_I18N.en, r = d.result, team = r.participants > 1;\n  var doc = newPdf(A), K = pdfKit(doc), C = PDF_C;\n  var W = 612, H = 792, M = 54, CW = W - 2 * M;\n  var dateStr = formatDate(d.dateIso, t.locale);\n  var page = 1;\n  var textColor = { green: C.green, yellow: C.yellowText, red: C.red };\n\n  function footer() {\n    K.font('regular', 7.5, C.SOFT);\n    doc.text(t.pdf.footer + (d.company ? '  ·  ' + d.company : ''), M, H - 30);\n    doc.text(t.pdf.page + ' ' + page, W - M, H - 30, { align: 'right' });\n    K.stroke(C.LINE, 0.6); K.dash([]); doc.line(M, H - 44, W - M, H - 44);\n  }\n  function newPage() { footer(); doc.addPage(); page++; }\n  function heading(text, y, size) {\n    K.fill(C.RED); doc.rect(M, y - (size || 20) + 2, 3, (size || 20) + 2, 'F');\n    K.font('bold', size || 20, C.INK); doc.text(text, M + 12, y);\n    return y;\n  }\n  // Coloured box with frame style\n  function swatch(x, y, w, h, color, border, n) {\n    K.fill(C[color + 'T']); doc.rect(x, y, w, h, 'F');\n    K.dash([]);\n    if (!team) { K.stroke(C[color], 0.8); doc.rect(x, y, w, h, 'S'); return; }\n    if (border === 'thick') { K.stroke(C.INK, 2.2); doc.rect(x + 1.1, y + 1.1, w - 2.2, h - 2.2, 'S'); }\n    else if (border === 'thin') { K.stroke(C.INK, 0.8); doc.rect(x, y, w, h, 'S'); }\n    else { K.stroke(C.INK, 0.8); K.dash([1, 1.6]); doc.rect(x, y, w, h, 'S'); K.dash([]); }\n  }\n  function legend(y) {\n    K.font('bold', 9.5, C.INK); doc.text(t.pdf.colorsTitle, M, y); y += 16;\n    ['green', 'yellow', 'red'].forEach(function (c, i) {\n      var x = M + i * (CW / 3);\n      swatch(x, y - 9, 18, 12, c, 'dotted');\n      K.font('regular', 8.5, C.INK); doc.text(K.split(t.colors[c], CW / 3 - 30, 'regular', 8.5), x + 24, y);\n    });\n    y += 24;\n    if (team) {\n      K.font('bold', 9.5, C.INK); doc.text(t.frames.title, M, y);\n      var ftw = doc.getTextWidth(t.frames.title);\n      K.font('regular', 8, C.MUTED); doc.text('  ·  ' + t.frames.sub, M + ftw, y);\n      y += 16;\n      ['dotted', 'thin', 'thick'].forEach(function (b, i) {\n        var x = M + i * (CW / 3);\n        swatch(x, y - 9, 18, 13, 'green', b);\n        K.font('regular', 8, C.INK); doc.text(K.split(t.frames[b], CW / 3 - 30, 'regular', 8), x + 24, y);\n      });\n      y += 30;\n    }\n    return y;\n  }\n\n  /* ---------------- Page 1: cover ---------------- */\n  if (A.logo) doc.addImage(A.logo, 'PNG', M, 50, 150, 50);\n  var y = 200;\n  K.font('bold', 38, C.INK); doc.text(t.pdf.title, M, y);\n  K.font('light', 38, C.INK); doc.text(t.pdf.subtitle, M, y + 44);\n  K.fill(C.RED); doc.rect(M, y + 64, 60, 4, 'F');\n  y += 110;\n  function meta(label, value) {\n    K.font('semibold', 8, C.RED); doc.text(label.toUpperCase(), M, y);\n    K.font('bold', 15, C.INK); doc.text(K.split(value, CW, 'bold', 15)[0] || '', M, y + 19);\n    y += 44;\n  }\n  meta(t.pdf.company, d.company || '');\n  meta(t.pdf.date, dateStr);\n  K.font('semibold', 8, C.RED); doc.text((team ? t.pdf.participantsCount + ': ' + r.participants : t.pdf.participants).toUpperCase(), M, y);\n  y += 17;\n  var names = (d.participants || []).slice(0, 14);\n  K.font('regular', 10.5, C.INK);\n  names.forEach(function (nm, i) { doc.text((i + 1) + '.  ' + nm, M, y); y += 15; });\n  if ((d.participants || []).length > names.length) { K.font('regular', 9.5, C.MUTED); doc.text('+ ' + (d.participants.length - names.length), M, y); y += 15; }\n  K.font('regular', 9, C.MUTED); doc.text(t.pdf.design, M, y + 6);\n  // at a glance\n  var counts = edCounts(r), by = Math.max(y + 48, 470), bw = (CW - 16) / 3;\n  K.font('bold', 9.5, C.INK); doc.text(t.pdf.summary, M, by - 10);\n  ['red', 'yellow', 'green'].forEach(function (c, i) {\n    var bx = M + i * (bw + 8);\n    K.fill(C.PAPER); doc.rect(bx, by, bw, 62, 'F');\n    K.fill(C[c]); doc.rect(bx, by, 4, 62, 'F');\n    K.font('bold', 26, C.INK); doc.text(String(counts[c]), bx + 16, by + 34);\n    K.font('semibold', 8.5, C.MUTED); doc.text(K.split(t.colorShort[c], bw - 60, 'semibold', 8.5), bx + 52, by + 25);\n  });\n  y = by + 90;\n  K.font('bold', 9.5, C.INK); doc.text(t.pdf.howTitle, M, y);\n  K.rich(t.pdf.howBody, M, y + 15, CW, 8.5, { color: C.MUTED, lh: 1.5 });\n\n  /* ---------------- Page 2: causal diagram ---------------- */\n  newPage();\n  heading(t.diagram.title, 74, 15);\n  y = 104;\n  var bh = 32, gap = 6;\n  function cellBox(key, x, yy, w) {\n    var c = edCellByKey(r, key);\n    swatch(x, yy, w, bh, c ? c.color : 'yellow', c ? c.border : 'dotted');\n    var label = t.diagram.labels[key];\n    var lines = K.split(label, w - 12, 'semibold', 8.5);\n    K.font('semibold', 8.5, C.INK);\n    var ty = yy + bh / 2 - (lines.length - 1) * 5 - 1;\n    lines.forEach(function (l, i) { doc.text(l, x + w / 2, ty + i * 10, { align: 'center' }); });\n    if (c) { K.font('bold', 7.5, textColor[c.color]); doc.text(Math.round(c.percent) + '%', x + w / 2, ty + lines.length * 10 - 0.5, { align: 'center' }); }\n  }\n  function frame(x, yy, w, h, title, fillc, dotted) {\n    if (fillc) { K.fill(fillc); doc.rect(x, yy, w, h, 'F'); }\n    K.stroke(dotted ? C.SOFT : C.INK, dotted ? 0.6 : 0.9); K.dash(dotted ? [1, 1.6] : []); doc.rect(x, yy, w, h, 'S'); K.dash([]);\n    if (title) { K.font('bold', 9.5, C.INK); doc.text(title, x + w / 2, yy + 15, { align: 'center' }); }\n  }\n  // External\n  frame(M, y, CW, 28, '', C.PAPER); K.font('bold', 10.5, C.INK); doc.text(t.diagram.external, W / 2, y + 18, { align: 'center' });\n  K.arrowDown(W / 2, y + 28, y + 42);\n  // Internal container\n  var iy = y + 42, ih = 482;\n  frame(M, iy, CW, ih, '', C.PAPER); K.font('bold', 10.5, C.INK); doc.text(t.diagram.internal, W / 2, iy + 18, { align: 'center' });\n  var ix = M + 18, iw = CW - 36;\n  // Systemic causes\n  var sy = iy + 30, sh = 192;\n  frame(ix, sy, iw, sh, t.diagram.causes, C.WHITE);\n  var cx0 = ix + 12, cw0 = iw - 24;\n  frame(cx0, sy + 24, cw0, 64, t.diagram.culture, null, true);\n  var half = (cw0 - 12 - gap) / 2;\n  cellBox('values', cx0 + 6, sy + 46, half);\n  cellBox('climate', cx0 + 6 + half + gap, sy + 46, half);\n  var third = (cw0 - 2 * gap) / 3;\n  [0, 1, 2].forEach(function (k) { K.arrowDown(cx0 + third * k + gap * k + third / 2, sy + 92, sy + 106, C.SOFT, 1.2); });\n  ED_DIAGRAM.causes.forEach(function (row, ri) {\n    row.forEach(function (key, k) { cellBox(key, cx0 + k * (third + gap), sy + 110 + ri * (bh + gap), third); });\n  });\n  K.arrowDown(W / 2, sy + sh, sy + sh + 14);\n  function block(title, rows, yy) {\n    var hh = 30 + rows.length * (bh + gap) + 6;\n    frame(ix, yy, iw, hh, title, C.WHITE);\n    var w2 = (cw0 - gap) / 2;\n    rows.forEach(function (row, ri) { row.forEach(function (key, k) { cellBox(key, cx0 + k * (w2 + gap), yy + 26 + ri * (bh + gap), w2); }); });\n    return yy + hh;\n  }\n  var ny = block(t.diagram.subsystems, ED_DIAGRAM.subsystems, sy + sh + 14);\n  K.arrowDown(W / 2, ny, ny + 14);\n  block(t.diagram.manifestations, ED_DIAGRAM.manifestations, ny + 14);\n  legend(iy + ih + 26);\n\n  /* ---------------- Page 3: radars ---------------- */\n  newPage();\n  var titles = [t.radar.title1, t.radar.title2];\n  ED.RADARS.forEach(function (ids, k) {\n    var top = k === 0 ? 74 : 392;\n    K.font('bold', 13, C.INK);\n    var tl = K.split(titles[k], CW, 'bold', 13);\n    tl.forEach(function (l, i) { doc.text(l, W / 2, top + i * 16, { align: 'center' }); });\n    var cells = ids.map(function (id) { return ED.cellById(r, id); });\n    pdfRadar(doc, K, W / 2, top + 150, 100, cells.map(function (c) { return c.percent; }), cells.map(function (c) { return t.cells[c.key]; }),\n      { normal: r.norms.upperPercent, abnormal: r.norms.lowerPercent, colors: cells.map(function (c) { return textColor[c.color]; }) });\n  });\n  var ly = 722, items = [[C.green, t.radar.normal, true], [C.red, t.radar.abnormal, true], [C.INK, t.radar.yours, false]];\n  items.forEach(function (it, i) {\n    var lx = M + 30 + i * (CW / 3);\n    K.stroke(it[0], it[2] ? 1 : 1.6); K.dash(it[2] ? [2.5, 2] : []); doc.line(lx, ly - 3, lx + 22, ly - 3); K.dash([]);\n    K.font('regular', 9, C.INK); doc.text(it[1], lx + 30, ly);\n  });\n\n  /* ---------------- Pages 4+: key organizational factors ---------------- */\n  newPage();\n  heading(t.pdf.keyFactors, 74, 18);\n  K.font('regular', 9, C.MUTED); doc.text(t.pdf.keyFactorsHelp, M, 96);\n  y = legend(122) + 6;\n  var textW = CW - 40;\n  r.cells.forEach(function (c, ci) {\n    var rows = c.questions.map(function (qi) {\n      var q = r.questions[qi], txt = edQuestionText(t, q);\n      var lines = K.split(txt, textW, 'regular', 9.5), extra = 0;\n      if (q.zone === 0) {\n        K.font('regular', 9.5, C.INK); var lw = doc.getTextWidth(lines[lines.length - 1]);\n        K.font('regular', 8, C.SOFT); if (lw + doc.getTextWidth('  ·  ' + t.noAnswer) > textW) extra = 12;\n      }\n      return { q: q, lines: lines, h: Math.max(20, lines.length * 12.5 + 7 + extra) };\n    });\n    if (y + 30 + rows[0].h > H - 60) { newPage(); y = 70; }\n    K.font('bold', 11.5, C.INK); doc.text((ci + 1) + '. ' + t.cells[c.key], M, y);\n    var pct = Math.round(c.percent) + '%  ·  ' + t.colorShort[c.color];\n    K.font('semibold', 8.5, textColor[c.color]); doc.text(pct, W - M, y, { align: 'right' });\n    y += 10;\n    rows.forEach(function (row) {\n      if (y + row.h > H - 60) {\n        newPage(); y = 70;\n        K.font('bold', 11.5, C.SOFT); doc.text((ci + 1) + '. ' + t.cells[c.key] + ' (' + t.pdf.cont + ')', M, y); y += 10;\n      }\n      swatch(M, y + 2, 24, 16, row.q.color, row.q.border);\n      K.font('regular', 9.5, C.INK);\n      var ty = y + 13;\n      row.lines.forEach(function (l, i) { doc.text(l, M + 36, ty + i * 12.5); });\n      if (row.q.zone === 0) {\n        K.font('regular', 9.5, C.INK);\n        var lw = doc.getTextWidth(row.lines[row.lines.length - 1]), sfx = '  ·  ' + t.noAnswer;\n        K.font('regular', 8, C.SOFT);\n        if (lw + doc.getTextWidth(sfx) > textW) doc.text(t.noAnswer, M + 36, ty + row.lines.length * 12.5);\n        else doc.text(sfx, M + 36 + lw, ty + (row.lines.length - 1) * 12.5);\n      }\n      y += row.h + 3;\n    });\n    y += 16;\n  });\n\n  footer();\n\n  doc.setProperties({ title: t.pdf.title + ' — ' + (d.company || ''), author: 'Adizes Institute', creator: 'Adizes Institute' });\n  return doc;\n}\n\n/* Adizes Admin — single-page app served by Apps Script (HtmlService).\n * Talks to the server only through google.script.run.adminApi(action, payload) → JSON string.\n * Bundled with: express-diagnostics i18n, shared/core.js, ed-engine.js, pdfkit.js, ed-report.js.\n */\nvar CFG = window.ADM_CONFIG || {};\nvar S = null;          // last state from the server\nvar APP = document.getElementById('app');\nvar MODAL = document.getElementById('modal-root');\n\nvar ST = { Draft: 'Borrador', Open: 'Abierto', Ready: 'Listo', 'Report sent': 'Reporte enviado', Closed: 'Cerrado' };\nvar IST = { Pending: 'Sin enviar', Sent: 'Invitado', Completed: 'Respondió' };\nvar TYPES = { ED: 'Diagnóstico Exprés', ES: 'Encuesta de Compromiso' };\nvar LANGS = { es: 'Español', en: 'English' };\nvar ERR = {\n  forbidden: 'No tienes acceso. Entra con una cuenta autorizada.',\n  name_required: 'Falta el nombre.', invalid_email: 'Revisa el correo.', duplicate_email: 'Ya existe un empleado con ese correo en esta empresa.',\n  invalid_recipients: 'Revisa los correos de los destinatarios.', invalid_date: 'Revisa la fecha.', below_minimum: 'Aún no se alcanza el mínimo de respuestas.',\n  no_participants: 'Agrega al menos un participante.', not_draft: 'El lanzamiento ya no es borrador.', not_open: 'El lanzamiento no está abierto.',\n  no_report: 'Primero genera el reporte.', no_recipients: 'Agrega al menos un destinatario.', only_drafts: 'Solo se pueden eliminar borradores.',\n  launch_not_editable: 'Este lanzamiento ya no admite cambios de participantes.', company_not_found: 'No se encontró la empresa.', not_found: 'No se encontró el registro.',\n  not_setup: 'Falta ejecutar setup() en Apps Script.', not_reopenable: 'Este lanzamiento no se puede reabrir.', invalid_type: 'Tipo de test inválido.',\n};\n\n/* ------------------------------------------------------------------ server */\nfunction call(action, payload) {\n  return new Promise(function (resolve, reject) {\n    if (!window.google || !google.script || !google.script.run) return reject(new Error('Sin conexión con Apps Script'));\n    google.script.run\n      .withSuccessHandler(function (txt) {\n        var r; try { r = JSON.parse(txt); } catch (e) { return reject(new Error('Respuesta inválida')); }\n        if (!r.ok) { var e2 = new Error(ERR[r.error] || r.error || 'Error'); e2.code = r.error; return reject(e2); }\n        resolve(r);\n      })\n      .withFailureHandler(function (e) { reject(new Error((e && e.message) || 'Error de conexión')); })\n      .adminApi(action, payload || {});\n  });\n}\nvar busyEl = null;\nfunction busy(on) {\n  if (on && !busyEl) { busyEl = document.createElement('div'); busyEl.className = 'busy'; busyEl.innerHTML = '<div class=\"adm-spinner\"></div>'; document.body.appendChild(busyEl); }\n  if (!on && busyEl) { busyEl.remove(); busyEl = null; }\n}\n// Mutating call: shows a spinner, refreshes the state and re-renders.\nfunction run(action, payload, okMsg) {\n  busy(true);\n  return call(action, payload).then(function (r) {\n    if (r.companies) S = r;\n    busy(false); render();\n    if (okMsg) toast(typeof okMsg === 'function' ? okMsg(r) : okMsg);\n    return r;\n  }, function (e) { busy(false); toast(e.message, true); throw e; });\n}\nvar toastT = null;\nfunction toast(msg, isErr) {\n  var el = document.getElementById('toast');\n  el.textContent = msg; el.className = 'adm-toast is-on' + (isErr ? ' is-err' : '');\n  clearTimeout(toastT); toastT = setTimeout(function () { el.className = 'adm-toast' + (isErr ? ' is-err' : ''); }, isErr ? 5000 : 2600);\n}\n\n/* ------------------------------------------------------------------ helpers */\nfunction h(s) { return esc(s); }\nfunction byId(list, id) { for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i]; return null; }\nfunction company(id) { return byId(S.companies, id) || { name: '—' }; }\nfunction launchesOf(cid) { return S.launches.filter(function (l) { return l.companyId === cid; }); }\nfunction employeesOf(cid, all) { return S.employees.filter(function (e) { return e.companyId === cid && (all || e.status !== 'Archived'); }); }\nfunction invitesOf(lid) { return S.invites.filter(function (i) { return i.launchId === lid; }); }\nfunction chip(status, map) { return '<span class=\"chip chip-' + String(status).replace(/\\s/g, '') + '\">' + h((map || ST)[status] || status) + '</span>'; }\nfunction typeTag(t) { return '<span class=\"type type-' + t + '\">' + t + '</span>'; }\nfunction fdate(iso, withTime) {\n  if (!iso) return '';\n  var d = new Date(String(iso).length === 10 ? iso + 'T12:00:00' : iso);\n  if (isNaN(d)) return String(iso);\n  var o = { day: 'numeric', month: 'short', year: 'numeric' };\n  if (withTime) { o.hour = '2-digit'; o.minute = '2-digit'; }\n  return d.toLocaleDateString('es-MX', o);\n}\nfunction progress(l) {\n  var pct = l.total ? Math.round(l.done / l.total * 100) : 0, minPct = l.total ? Math.min(100, l.minResponses / l.total * 100) : 0;\n  return '<div class=\"prog\"><div class=\"prog-bar' + (l.done >= l.minResponses ? ' is-ok' : '') + '\"><i style=\"width:' + pct + '%\"></i>' +\n    (l.minResponses > 1 && minPct < 100 ? '<b style=\"left:' + minPct + '%\" title=\"Mínimo\"></b>' : '') + '</div><span>' + l.done + ' de ' + l.total + '</span></div>';\n}\nfunction go(hash) { if (location.hash === hash) render(); else location.hash = hash; }\nfunction copyText(text) {\n  function fallback() {\n    var ta = document.createElement('textarea'); ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';\n    document.body.appendChild(ta); ta.select(); var ok = false; try { ok = document.execCommand('copy'); } catch (e) {} ta.remove();\n    return ok;\n  }\n  var p = (navigator.clipboard && navigator.clipboard.writeText) ? navigator.clipboard.writeText(text).then(function () { return true; }, fallback) : Promise.resolve(fallback());\n  return p.then(function (ok) {\n    if (ok) toast('Copiado');\n    else modal({ title: 'Copia el texto', body: '<textarea class=\"textarea linkbox\" rows=\"8\" readonly>' + h(text) + '</textarea>', ok: null });\n  });\n}\n\n/* ------------------------------------------------------------------ modal */\nfunction modal(o) {\n  MODAL.innerHTML = '<div class=\"modal-bg\"><div class=\"modal' + (o.wide ? ' is-wide' : '') + '\" role=\"dialog\" aria-modal=\"true\">' +\n    '<div class=\"modal-h\"><h3>' + h(o.title) + '</h3><button type=\"button\" class=\"x\" data-x aria-label=\"Cerrar\">×</button></div>' +\n    '<form class=\"modal-form\" novalidate><div class=\"modal-b\">' + o.body + '<div class=\"err\" data-err></div></div>' +\n    '<div class=\"modal-f\"><button type=\"button\" class=\"btn btn-ghost\" data-x>' + (o.ok === null ? 'Cerrar' : 'Cancelar') + '</button>' +\n    (o.ok === null ? '' : '<button type=\"submit\" class=\"btn ' + (o.danger ? 'btn-red' : 'btn-dark') + '\">' + h(o.ok || 'Guardar') + '</button>') + '</div></form></div></div>';\n  var bg = MODAL.firstChild, form = MODAL.querySelector('form');\n  function close() { MODAL.innerHTML = ''; document.removeEventListener('keydown', onEsc); }\n  function onEsc(e) { if (e.key === 'Escape') close(); }\n  document.addEventListener('keydown', onEsc);\n  MODAL.querySelectorAll('[data-x]').forEach(function (b) { b.addEventListener('click', close); });\n  bg.addEventListener('mousedown', function (e) { if (e.target === bg) close(); });\n  form.addEventListener('submit', function (e) {\n    e.preventDefault();\n    var err = form.querySelector('[data-err]'); err.textContent = '';\n    var res = o.onOk && o.onOk(form, close);\n    if (res && res.then) res.then(function () { close(); }, function (ex) { err.textContent = ex.message; });\n    else if (typeof res === 'string') err.textContent = res;\n    else if (res !== false) close();\n  });\n  if (o.onOpen) o.onOpen(form);\n  var first = form.querySelector('input:not([type=checkbox]):not([type=radio]),textarea,select'); if (first) first.focus();\n  return form;\n}\nfunction confirmBox(title, text, okLabel, fn, danger) {\n  modal({ title: title, body: '<p>' + text + '</p>', ok: okLabel, danger: danger, onOk: function () { return fn(); } });\n}\nfunction field(label, inner, hint) { return '<div class=\"field\"><label>' + h(label) + '</label>' + inner + (hint ? '<div class=\"hint\">' + h(hint) + '</div>' : '') + '</div>'; }\nfunction inp(name, val, type, ph) { return '<input class=\"input\" name=\"' + name + '\" type=\"' + (type || 'text') + '\" value=\"' + h(val || '') + '\"' + (ph ? ' placeholder=\"' + h(ph) + '\"' : '') + '>'; }\nfunction sel(name, val, opts) { return '<select class=\"select\" name=\"' + name + '\">' + Object.keys(opts).map(function (k) { return '<option value=\"' + h(k) + '\"' + (k === val ? ' selected' : '') + '>' + h(opts[k]) + '</option>'; }).join('') + '</select>'; }\nfunction vals(form) { var o = {}; Array.prototype.forEach.call(form.elements, function (el) { if (el.name && el.type !== 'checkbox' && el.type !== 'radio') o[el.name] = el.value.trim(); if (el.type === 'radio' && el.checked) o[el.name] = el.value; }); return o; }\n\n/* ------------------------------------------------------------------ layout */\nfunction shell(active, inner) {\n  return '<header class=\"adm-top\"><div class=\"adm-top-in\">' +\n    '<a class=\"adm-brand\" href=\"#/\"><img class=\"adm-logo\" alt=\"Adizes\" src=\"' + h(CFG.assetsBase + 'adizes-logo-color.png') + '\"><span>Admin</span></a>' +\n    '<nav class=\"adm-nav\"><a href=\"#/\" class=\"' + (active === 'companies' ? 'is-on' : '') + '\">Empresas</a>' +\n    '<a href=\"#/launches\" class=\"' + (active === 'launches' ? 'is-on' : '') + '\">Lanzamientos</a></nav>' +\n    '<div class=\"adm-me\" title=\"' + h(S.me) + '\">' + h(S.me) + '</div></div></header>' +\n    '<main class=\"adm-main\">' + inner + '</main>';\n}\nvar UI = { showArchived: false, q: '', lq: '', lstatus: 'active', ltype: '' };\n\nfunction render() {\n  if (!S) return;\n  var parts = location.hash.replace(/^#\\/?/, '').split('/');\n  var view = parts[0] || '', id = parts[1];\n  if (view === 'company' && byId(S.companies, id)) return renderCompany(id);\n  if (view === 'launch' && byId(S.launches, id)) return renderLaunch(id);\n  if (view === 'launches') return renderLaunches();\n  return renderCompanies();\n}\nwindow.addEventListener('hashchange', function () { MODAL.innerHTML = ''; render(); window.scrollTo(0, 0); });\n\n/* ------------------------------------------------------------------ companies */\nfunction renderCompanies() {\n  var q = UI.q.toLowerCase();\n  var list = S.companies.filter(function (c) { return (UI.showArchived || c.status !== 'Archived') && (!q || c.name.toLowerCase().indexOf(q) >= 0 || String(c.country || '').toLowerCase().indexOf(q) >= 0); })\n    .sort(function (a, b) { return a.name.localeCompare(b.name, 'es'); });\n  var cards = list.map(function (c) {\n    var ls = launchesOf(c.id), open = ls.filter(function (l) { return l.status === 'Open'; }).length, ready = ls.filter(function (l) { return l.status === 'Ready'; }).length;\n    return '<a class=\"card co-card\" href=\"#/company/' + h(c.id) + '\"><h3>' + h(c.name) + '</h3><div class=\"muted small\">' + h(c.country || '') + (c.contactName ? ' · ' + h(c.contactName) : '') + '</div>' +\n      '<div class=\"co-meta\"><span><b>' + employeesOf(c.id).length + '</b> empleados</span><span><b>' + ls.length + '</b> lanzamientos</span>' +\n      (open ? '<span>' + chip('Open') + ' ' + open + '</span>' : '') + (ready ? '<span>' + chip('Ready') + ' ' + ready + '</span>' : '') +\n      (c.status === 'Archived' ? chip('Archived', { Archived: 'Archivada' }) : '') + '</div></a>';\n  }).join('');\n  APP.innerHTML = shell('companies',\n    '<div class=\"adm-head\"><div><div class=\"adm-eyebrow\">Adizes Assessments</div><h1 class=\"adm-h1\">Empresas</h1></div>' +\n    '<div class=\"adm-btns\"><button class=\"btn btn-red\" data-act=\"new-company\">+ Nueva empresa</button></div></div>' +\n    '<div class=\"toolbar\"><input class=\"input\" type=\"search\" placeholder=\"Buscar empresa…\" value=\"' + h(UI.q) + '\" data-q>' +\n    '<label class=\"chk\"><input type=\"checkbox\" data-arch' + (UI.showArchived ? ' checked' : '') + '> Ver archivadas</label></div>' +\n    (cards ? '<div class=\"grid\">' + cards + '</div>' : '<div class=\"card empty\"><b>' + (S.companies.length ? 'Sin resultados' : 'Aún no hay empresas') + '</b>' + (S.companies.length ? '' : 'Crea la primera para agregar sus empleados y lanzar un test.') + '</div>'));\n  APP.querySelector('[data-act=\"new-company\"]').addEventListener('click', function () { companyForm(); });\n  var qEl = APP.querySelector('[data-q]');\n  qEl.addEventListener('input', function () { UI.q = qEl.value; renderCompanies(); var n = APP.querySelector('[data-q]'); n.focus(); n.setSelectionRange(n.value.length, n.value.length); });\n  APP.querySelector('[data-arch]').addEventListener('change', function (e) { UI.showArchived = e.target.checked; renderCompanies(); });\n}\nfunction companyForm(c) {\n  c = c || {};\n  modal({\n    title: c.id ? 'Editar empresa' : 'Nueva empresa', ok: c.id ? 'Guardar' : 'Crear empresa',\n    body: field('Nombre', inp('name', c.name)) +\n      '<div class=\"row2\">' + field('País', inp('country', c.country)) + field('Idioma de los tests', sel('language', c.language || 'es', LANGS)) + '</div>' +\n      '<div class=\"row2\">' + field('Contacto', inp('contactName', c.contactName)) + field('Correo del contacto', inp('contactEmail', c.contactEmail, 'email'), 'Se propone como destinatario del reporte.') + '</div>' +\n      field('Notas', '<textarea class=\"textarea\" name=\"notes\" rows=\"3\">' + h(c.notes || '') + '</textarea>'),\n    onOk: function (form) {\n      var v = vals(form); v.id = c.id;\n      if (!v.name) return 'Falta el nombre.';\n      return run('saveCompany', v, c.id ? 'Empresa actualizada' : 'Empresa creada').then(function (r) {\n        if (!c.id) { var nw = r.companies.filter(function (x) { return x.name === v.name; }).pop(); if (nw) go('#/company/' + nw.id); }\n      });\n    },\n  });\n}\n\n/* ------------------------------------------------------------------ company */\nfunction renderCompany(cid) {\n  var c = company(cid), ls = launchesOf(cid).sort(function (a, b) { return String(b.createdAt).localeCompare(String(a.createdAt)); });\n  var emps = employeesOf(cid, UI.showArchived).sort(function (a, b) { return a.name.localeCompare(b.name, 'es'); });\n  var lRows = ls.map(function (l) {\n    return '<tr class=\"is-click\" data-go=\"#/launch/' + h(l.id) + '\"><td>' + typeTag(l.type) + '</td><td class=\"strong\">' + h(l.name) + '</td><td>' + chip(l.status) + '</td>' +\n      '<td data-l=\"Avance\">' + progress(l) + '</td><td class=\"nowrap muted small\" data-l=\"Cierre\">' + h(fdate(l.closeDate) || '—') + '</td></tr>';\n  }).join('');\n  var eRows = emps.map(function (e) {\n    var n = S.invites.filter(function (i) { return i.employeeId === e.id; }).length;\n    return '<tr><td class=\"strong\">' + h(e.name) + (e.status === 'Archived' ? ' ' + chip('Archived', { Archived: 'Archivado' }) : '') + '</td><td data-l=\"Correo\">' + h(e.email) + '</td>' +\n      '<td data-l=\"Área\">' + h(e.area || '—') + '</td><td data-l=\"Puesto\">' + h(e.position || '—') + '</td><td class=\"num muted small\" data-l=\"Tests\">' + n + '</td>' +\n      '<td class=\"act\"><button class=\"btn btn-ghost btn-sm\" data-edit-emp=\"' + h(e.id) + '\">Editar</button>' +\n      '<button class=\"btn btn-ghost btn-sm\" data-arch-emp=\"' + h(e.id) + '\">' + (e.status === 'Archived' ? 'Restaurar' : 'Archivar') + '</button></td></tr>';\n  }).join('');\n  APP.innerHTML = shell('companies',\n    '<div class=\"adm-crumbs\"><a href=\"#/\">Empresas</a> ›</div>' +\n    '<div class=\"adm-head\"><div><h1 class=\"adm-h1\">' + h(c.name) + (c.status === 'Archived' ? ' ' + chip('Archived', { Archived: 'Archivada' }) : '') + '</h1>' +\n    '<div class=\"adm-sub\">' + [c.country, LANGS[c.language], c.contactName && (c.contactName + (c.contactEmail ? ' · ' + c.contactEmail : ''))].filter(Boolean).map(h).join(' · ') + '</div></div>' +\n    '<div class=\"adm-btns\"><button class=\"btn btn-line\" data-act=\"edit\">Editar</button><button class=\"btn btn-ghost\" data-act=\"archive\">' + (c.status === 'Archived' ? 'Restaurar' : 'Archivar') + '</button></div></div>' +\n    '<section class=\"adm-sec\"><div class=\"adm-sec-h\"><h2 class=\"adm-h2\">Lanzamientos</h2><button class=\"btn btn-red\" data-act=\"new-launch\">+ Nuevo lanzamiento</button></div>' +\n    '<div class=\"card\">' + (lRows ? '<table class=\"tbl\"><thead><tr><th>Tipo</th><th>Nombre</th><th>Estado</th><th>Avance</th><th>Cierre</th></tr></thead><tbody>' + lRows + '</tbody></table>'\n      : '<div class=\"empty\"><b>Sin lanzamientos</b>Crea uno para invitar a los empleados a un test.</div>') + '</div></section>' +\n    '<section class=\"adm-sec\"><div class=\"adm-sec-h\"><h2 class=\"adm-h2\">Empleados <span class=\"muted\">(' + employeesOf(cid).length + ')</span></h2>' +\n    '<div class=\"adm-btns\"><label class=\"chk\"><input type=\"checkbox\" data-arch' + (UI.showArchived ? ' checked' : '') + '> Ver archivados</label>' +\n    '<button class=\"btn btn-line\" data-act=\"import\">Importar lista</button><button class=\"btn btn-dark\" data-act=\"new-emp\">+ Agregar empleado</button></div></div>' +\n    '<div class=\"card\">' + (eRows ? '<table class=\"tbl\"><thead><tr><th>Nombre</th><th>Correo</th><th>Área</th><th>Puesto</th><th class=\"num\">Tests</th><th></th></tr></thead><tbody>' + eRows + '</tbody></table>'\n      : '<div class=\"empty\"><b>Sin empleados</b>Agrégalos uno por uno o pega una lista desde Excel.</div>') + '</div></section>');\n  APP.querySelector('[data-act=\"edit\"]').addEventListener('click', function () { companyForm(c); });\n  APP.querySelector('[data-act=\"archive\"]').addEventListener('click', function () { run('archiveCompany', { id: cid, archived: c.status !== 'Archived' }, c.status === 'Archived' ? 'Empresa restaurada' : 'Empresa archivada'); });\n  APP.querySelector('[data-act=\"new-launch\"]').addEventListener('click', function () { launchForm(cid); });\n  APP.querySelector('[data-act=\"new-emp\"]').addEventListener('click', function () { employeeForm(cid); });\n  APP.querySelector('[data-act=\"import\"]').addEventListener('click', function () { importForm(cid); });\n  APP.querySelector('[data-arch]').addEventListener('change', function (e) { UI.showArchived = e.target.checked; renderCompany(cid); });\n  APP.querySelectorAll('[data-go]').forEach(function (tr) { tr.addEventListener('click', function () { go(tr.getAttribute('data-go')); }); });\n  APP.querySelectorAll('[data-edit-emp]').forEach(function (b) { b.addEventListener('click', function () { employeeForm(cid, byId(S.employees, b.getAttribute('data-edit-emp'))); }); });\n  APP.querySelectorAll('[data-arch-emp]').forEach(function (b) {\n    b.addEventListener('click', function () { var e = byId(S.employees, b.getAttribute('data-arch-emp')); run('archiveEmployee', { id: e.id, archived: e.status !== 'Archived' }, e.status === 'Archived' ? 'Empleado restaurado' : 'Empleado archivado'); });\n  });\n}\nfunction areasOf(cid) {\n  var seen = {}; employeesOf(cid, true).forEach(function (e) { if (e.area) seen[e.area] = 1; });\n  return '<datalist id=\"areas\">' + Object.keys(seen).sort().map(function (a) { return '<option value=\"' + h(a) + '\">'; }).join('') + '</datalist>';\n}\nfunction employeeForm(cid, e) {\n  e = e || {};\n  modal({\n    title: e.id ? 'Editar empleado' : 'Agregar empleado', ok: e.id ? 'Guardar' : 'Agregar',\n    body: field('Nombre completo', inp('name', e.name)) + field('Correo', inp('email', e.email, 'email')) +\n      '<div class=\"row2\">' + field('Área', '<input class=\"input\" name=\"area\" list=\"areas\" value=\"' + h(e.area || '') + '\">', 'Se usa para los resultados por área de la Encuesta de Compromiso.') + field('Puesto', inp('position', e.position)) + '</div>' + areasOf(cid),\n    onOk: function (form) { var v = vals(form); v.id = e.id; v.companyId = cid; return run('saveEmployee', v, e.id ? 'Empleado actualizado' : 'Empleado agregado'); },\n  });\n}\n// Accepts rows pasted from Excel/Sheets (tabs) or typed with commas: Name, email, area, position\nfunction parseRows(text) {\n  return String(text || '').split(/\\r?\\n/).map(function (line) {\n    var cells = line.indexOf('\\t') >= 0 ? line.split('\\t') : line.split(/[,;]/);\n    cells = cells.map(function (c) { return c.trim(); });\n    var ei = -1; cells.forEach(function (c, i) { if (ei < 0 && /@/.test(c)) ei = i; });\n    if (ei < 0) return null;\n    var rest = cells.filter(function (c, i) { return i !== ei; });\n    return { name: rest[0] || '', email: cells[ei], area: rest[1] || '', position: rest[2] || '' };\n  }).filter(function (r) { return r && r.name; });\n}\nfunction importForm(cid) {\n  modal({\n    title: 'Importar empleados', ok: 'Importar', wide: true,\n    body: '<p class=\"muted small\" style=\"margin-bottom:10px\">Pega una fila por persona, copiada de Excel o separada por comas: <b>Nombre, correo, área, puesto</b>. Se omiten los correos que ya existen en la empresa.</p>' +\n      '<textarea class=\"textarea linkbox\" name=\"rows\" rows=\"10\" placeholder=\"Ana López, ana@empresa.com, Ventas, Directora&#10;Bruno Díaz, bruno@empresa.com, Operaciones, Gerente\"></textarea><p class=\"small muted\" data-count style=\"margin-top:8px\"></p>',\n    onOpen: function (form) {\n      var ta = form.rows, out = form.querySelector('[data-count]');\n      ta.addEventListener('input', function () { var n = parseRows(ta.value).length; out.textContent = n ? n + ' fila(s) reconocida(s)' : ''; });\n    },\n    onOk: function (form) {\n      var rows = parseRows(form.rows.value);\n      if (!rows.length) return 'No se reconoció ninguna fila (cada fila necesita nombre y correo).';\n      return run('importEmployees', { companyId: cid, rows: rows }, function (r) { return r.imported + ' empleado(s) importado(s)'; });\n    },\n  });\n}\n\n/* ------------------------------------------------------------------ launches list */\nfunction renderLaunches() {\n  var q = UI.lq.toLowerCase();\n  var list = S.launches.filter(function (l) {\n    if (UI.ltype && l.type !== UI.ltype) return false;\n    if (UI.lstatus === 'active' && (l.status === 'Closed' || l.status === 'Report sent')) return false;\n    if (UI.lstatus !== 'active' && UI.lstatus !== 'all' && l.status !== UI.lstatus) return false;\n    return !q || l.name.toLowerCase().indexOf(q) >= 0 || company(l.companyId).name.toLowerCase().indexOf(q) >= 0;\n  }).sort(function (a, b) { return String(b.createdAt).localeCompare(String(a.createdAt)); });\n  var rows = list.map(function (l) {\n    return '<tr class=\"is-click\" data-go=\"#/launch/' + h(l.id) + '\"><td class=\"strong\">' + h(company(l.companyId).name) + '</td><td>' + typeTag(l.type) + ' ' + h(l.name) + '</td>' +\n      '<td>' + chip(l.status) + '</td><td data-l=\"Avance\">' + progress(l) + '</td><td class=\"nowrap muted small\" data-l=\"Cierre\">' + h(fdate(l.closeDate) || '—') + '</td></tr>';\n  }).join('');\n  var stOpts = { active: 'En curso', all: 'Todos', Draft: 'Borrador', Open: 'Abierto', Ready: 'Listo', 'Report sent': 'Reporte enviado', Closed: 'Cerrado' };\n  APP.innerHTML = shell('launches',\n    '<div class=\"adm-head\"><div><div class=\"adm-eyebrow\">Adizes Assessments</div><h1 class=\"adm-h1\">Lanzamientos</h1></div></div>' +\n    '<div class=\"toolbar\"><input class=\"input\" type=\"search\" placeholder=\"Buscar por empresa o nombre…\" value=\"' + h(UI.lq) + '\" data-q>' +\n    sel('st', UI.lstatus, stOpts).replace('class=\"select\"', 'class=\"select\" data-st') + sel('ty', UI.ltype, { '': 'Todos los tipos', ED: TYPES.ED, ES: TYPES.ES }).replace('class=\"select\"', 'class=\"select\" data-ty') + '</div>' +\n    '<div class=\"card\">' + (rows ? '<table class=\"tbl\"><thead><tr><th>Empresa</th><th>Lanzamiento</th><th>Estado</th><th>Avance</th><th>Cierre</th></tr></thead><tbody>' + rows + '</tbody></table>'\n      : '<div class=\"empty\"><b>Sin lanzamientos</b>Los lanzamientos se crean desde cada empresa.</div>') + '</div>');\n  var qEl = APP.querySelector('[data-q]');\n  qEl.addEventListener('input', function () { UI.lq = qEl.value; renderLaunches(); var n = APP.querySelector('[data-q]'); n.focus(); n.setSelectionRange(n.value.length, n.value.length); });\n  APP.querySelector('[data-st]').addEventListener('change', function (e) { UI.lstatus = e.target.value; renderLaunches(); });\n  APP.querySelector('[data-ty]').addEventListener('change', function (e) { UI.ltype = e.target.value; renderLaunches(); });\n  APP.querySelectorAll('[data-go]').forEach(function (tr) { tr.addEventListener('click', function () { go(tr.getAttribute('data-go')); }); });\n}\n\n/* ------------------------------------------------------------------ launch form */\nfunction pickerHtml(cid, selected, locked) {\n  var emps = employeesOf(cid).sort(function (a, b) { return (a.area || '').localeCompare(b.area || '', 'es') || a.name.localeCompare(b.name, 'es'); });\n  if (!emps.length) return '<div class=\"notice is-info\">Esta empresa aún no tiene empleados. Agrégalos primero.</div>';\n  return '<div class=\"toolbar\" style=\"margin-bottom:8px\"><input class=\"input\" type=\"search\" placeholder=\"Filtrar…\" data-pf>' +\n    '<button type=\"button\" class=\"btn btn-line btn-sm\" data-all>Todos</button><button type=\"button\" class=\"btn btn-ghost btn-sm\" data-none>Ninguno</button>' +\n    '<span class=\"small muted\" data-pc></span></div><div class=\"pick\">' + emps.map(function (e) {\n      var on = selected[e.id], lock = locked[e.id];\n      return '<label data-txt=\"' + h((e.name + ' ' + e.email + ' ' + (e.area || '')).toLowerCase()) + '\"><input type=\"checkbox\" name=\"emp\" value=\"' + h(e.id) + '\"' + (on ? ' checked' : '') + (lock ? ' disabled' : '') + '>' +\n        '<span><b>' + h(e.name) + '</b><br><span class=\"small muted\">' + h(e.email) + '</span></span><span class=\"small muted\">' + h(e.area || '') + (lock ? '<br>Ya respondió' : '') + '</span></label>';\n    }).join('') + '</div>';\n}\nfunction bindPicker(form) {\n  var boxes = form.querySelectorAll('input[name=\"emp\"]'), pc = form.querySelector('[data-pc]');\n  function count() { if (pc) pc.textContent = Array.prototype.filter.call(boxes, function (b) { return b.checked; }).length + ' seleccionados'; }\n  boxes.forEach(function (b) { b.addEventListener('change', count); });\n  var pf = form.querySelector('[data-pf]');\n  if (pf) pf.addEventListener('input', function () { var q = pf.value.toLowerCase(); form.querySelectorAll('.pick label').forEach(function (l) { l.hidden = q && l.getAttribute('data-txt').indexOf(q) < 0; }); });\n  var all = form.querySelector('[data-all]'), none = form.querySelector('[data-none]');\n  if (all) all.addEventListener('click', function () { boxes.forEach(function (b) { if (!b.closest('label').hidden && !b.disabled) b.checked = true; }); count(); });\n  if (none) none.addEventListener('click', function () { boxes.forEach(function (b) { if (!b.disabled) b.checked = false; }); count(); });\n  count();\n}\nfunction picked(form) { return Array.prototype.filter.call(form.querySelectorAll('input[name=\"emp\"]'), function (b) { return b.checked; }).map(function (b) { return b.value; }); }\n\nfunction launchForm(cid, l) {\n  var c = company(cid), isNew = !l;\n  l = l || { type: 'ED', language: c.language || 'es', recipients: c.contactEmail || '' };\n  var sel0 = {}; if (isNew) employeesOf(cid).forEach(function (e) { sel0[e.id] = true; });\n  var typeHtml = isNew ? field('Test', '<div class=\"types\">' +\n    '<label><input type=\"radio\" name=\"type\" value=\"ED\" checked><b>' + TYPES.ED + '</b><small>67 afirmaciones · reporte grupal con nombres · mínimo 1 respuesta</small></label>' +\n    '<label style=\"opacity:.55;cursor:default\"><input type=\"radio\" name=\"type\" value=\"ES\" disabled><b>' + TYPES.ES + '</b><small>50 preguntas · anónima · mínimo 5 · por área. Disponible en la siguiente versión.</small></label></div>') : '';\n  modal({\n    title: isNew ? 'Nuevo lanzamiento · ' + c.name : 'Editar lanzamiento', ok: isNew ? 'Crear borrador' : 'Guardar', wide: isNew,\n    body: typeHtml + field('Nombre', inp('name', l.name, 'text', 'p. ej. Equipo directivo · Nov 2026')) +\n      '<div class=\"row2\">' + field('Idioma', sel('language', l.language, LANGS)) + field('Fecha de cierre', inp('closeDate', l.closeDate, 'date'), 'Opcional. Al pasar esta fecha, si hay el mínimo, queda listo para reporte.') + '</div>' +\n      '<div class=\"row2\">' + field('Mínimo de respuestas', inp('minResponses', l.minResponses || '', 'number'), 'Express: 1 o más · Encuesta: 5 o más.') +\n      field('Destinatarios del reporte', inp('recipients', l.recipients, 'text', 'correo@empresa.com, otro@empresa.com')) + '</div>' +\n      field('Notas internas', '<textarea class=\"textarea\" name=\"notes\" rows=\"2\">' + h(l.notes || '') + '</textarea>') +\n      (isNew ? field('Participantes', pickerHtml(cid, sel0, {})) : ''),\n    onOpen: function (form) { if (isNew) bindPicker(form); },\n    onOk: function (form) {\n      var v = vals(form);\n      if (!v.name) return 'Falta el nombre.';\n      var p = { id: l.id, companyId: cid, type: v.type || l.type, name: v.name, language: v.language, closeDate: v.closeDate, minResponses: v.minResponses, recipients: v.recipients, notes: v.notes };\n      if (isNew) { p.employeeIds = picked(form); if (!p.employeeIds.length) return 'Elige al menos un participante.'; }\n      return run('saveLaunch', p, isNew ? 'Borrador creado' : 'Lanzamiento actualizado').then(function (r) { if (isNew && r.savedId) go('#/launch/' + r.savedId); });\n    },\n  });\n}\nfunction participantsForm(l) {\n  var inv = invitesOf(l.id), selected = {}, locked = {};\n  inv.forEach(function (i) { selected[i.employeeId] = true; if (i.status === 'Completed') locked[i.employeeId] = true; });\n  modal({\n    title: 'Participantes · ' + l.name, ok: 'Guardar participantes', wide: true,\n    body: (l.status === 'Open' ? '<div class=\"notice is-info\">A los nuevos participantes envíales la invitación después de guardar.</div>' : '') + pickerHtml(l.companyId, selected, locked),\n    onOpen: bindPicker,\n    onOk: function (form) {\n      var ids = picked(form).concat(Object.keys(locked).filter(function (id) { return picked(form).indexOf(id) < 0; }));\n      if (!ids.length) return 'Elige al menos un participante.';\n      return run('setParticipants', { launchId: l.id, employeeIds: ids }, 'Participantes actualizados');\n    },\n  });\n}\n\n/* ------------------------------------------------------------------ launch page */\nfunction renderLaunch(lid) {\n  var l = byId(S.launches, lid), c = company(l.companyId), inv = invitesOf(lid);\n  var emp = {}; S.employees.forEach(function (e) { emp[e.id] = e; });\n  var pend = inv.filter(function (i) { return i.status === 'Pending'; }).length, sent = inv.filter(function (i) { return i.status === 'Sent'; }).length;\n  var canReport = l.done >= l.minResponses && l.status !== 'Draft';\n  var rows = inv.slice().sort(function (a, b) { return ((emp[a.employeeId] || {}).name || '').localeCompare((emp[b.employeeId] || {}).name || '', 'es'); }).map(function (i) {\n    var e = emp[i.employeeId] || {};\n    var when = i.status === 'Completed' ? fdate(i.completedOn, l.type === 'ED') : i.sentAt ? 'Invitado ' + fdate(i.sentAt) + (i.reminders ? ' · ' + i.reminders + ' recordatorio(s)' : '') : '';\n    return '<tr><td class=\"strong\">' + h(e.name || '—') + '<div class=\"small muted\">' + h(e.email || '') + '</div></td><td data-l=\"Área\">' + h(e.area || '—') + '</td>' +\n      '<td>' + chip(i.status, IST) + '</td><td class=\"small muted\" data-l=\"Fecha\">' + h(when) + '</td>' +\n      '<td class=\"act\">' + (i.status !== 'Completed' ? '<button class=\"btn btn-ghost btn-sm\" data-copy=\"' + h(i.link) + '\">Copiar enlace</button>' +\n        (l.status === 'Open' ? '<button class=\"btn btn-ghost btn-sm\" data-send=\"' + h(i.id) + '\">' + (i.status === 'Pending' ? 'Enviar' : 'Reenviar') + '</button>' : '') : '') + '</td></tr>';\n  }).join('');\n\n  var actions = [];\n  if (l.status === 'Draft') {\n    actions.push('<button class=\"btn btn-red\" data-act=\"open-send\">Abrir y enviar invitaciones</button>', '<button class=\"btn btn-line\" data-act=\"open\">Abrir sin enviar</button>',\n      '<button class=\"btn btn-line\" data-act=\"participants\">Participantes</button>', '<button class=\"btn btn-ghost\" data-act=\"edit\">Editar</button>', '<button class=\"btn btn-ghost btn-danger\" data-act=\"delete\">Eliminar</button>');\n  } else if (l.status === 'Open') {\n    if (pend) actions.push('<button class=\"btn btn-red\" data-act=\"invite\">Enviar invitaciones (' + pend + ')</button>');\n    if (sent) actions.push('<button class=\"btn btn-line\" data-act=\"remind\">Recordatorio (' + sent + ')</button>');\n    actions.push('<button class=\"btn btn-line\" data-act=\"copy-all\">Copiar enlaces</button>', '<button class=\"btn btn-line\" data-act=\"participants\">Participantes</button>');\n    if (l.done >= l.minResponses) actions.push('<button class=\"btn btn-dark\" data-act=\"finish\">Cerrar y marcar listo</button>');\n    actions.push('<button class=\"btn btn-ghost\" data-act=\"edit\">Editar</button>');\n  } else {\n    actions.push('<button class=\"btn btn-line\" data-act=\"reopen\">Reabrir</button>', '<button class=\"btn btn-ghost\" data-act=\"edit\">Editar</button>');\n    if (l.status !== 'Closed') actions.push('<button class=\"btn btn-ghost\" data-act=\"close\">Archivar</button>');\n  }\n  var notice = '';\n  if (l.status === 'Draft') notice = '<div class=\"notice is-info\">Borrador: revisa los participantes y ábrelo para que puedan responder. Puedes enviar las invitaciones desde info@ o copiar los enlaces para repartirlos tú.</div>';\n  if (l.notice === 'expired' && l.status === 'Open') notice = '<div class=\"notice\">La fecha de cierre pasó sin alcanzar el mínimo (' + l.done + ' de ' + l.minResponses + '). Envía un recordatorio o cambia la fecha en “Editar”.</div>';\n  if (l.type === 'ES' && l.status !== 'Draft') notice += '<div class=\"notice is-info\">La Encuesta de Compromiso (formulario y reporte) se activa en la siguiente versión.</div>';\n\n  var report = '';\n  if (l.status !== 'Draft') {\n    report = '<section class=\"adm-sec\"><div class=\"adm-sec-h\"><h2 class=\"adm-h2\">Reporte grupal</h2></div><div class=\"card report\">' +\n      '<div><div class=\"adm-eyebrow\">1 · Generar</div>' +\n      (canReport ? '<p class=\"small muted\" style=\"margin:6px 0 12px\">Se genera en tu navegador con las ' + l.done + ' respuestas actuales y se guarda en Drive.</p>' : '<p class=\"small muted\" style=\"margin:6px 0 12px\">Disponible al llegar al mínimo de ' + l.minResponses + ' respuesta(s). Hoy: ' + l.done + '.</p>') +\n      (l.reportUrl ? '<div class=\"pdf-ok\"><i></i><div><a href=\"' + h(l.reportUrl) + '\" target=\"_blank\" rel=\"noopener\" class=\"strong\">Ver PDF en Drive</a><div class=\"small muted\">Generado ' + h(fdate(l.reportGeneratedAt, true)) + '</div></div></div>' : '') +\n      '<button class=\"btn ' + (l.reportUrl ? 'btn-line' : 'btn-dark') + '\" data-act=\"generate\"' + (canReport && l.type === 'ED' ? '' : ' disabled') + '>' + (l.reportUrl ? 'Volver a generar' : 'Generar reporte') + '</button></div>' +\n      '<div><div class=\"adm-eyebrow\">2 · Enviar</div>' +\n      '<form data-send-form style=\"margin-top:10px\">' + field('Para', inp('to', l.recipients || c.contactEmail || '', 'text', 'correo@empresa.com, otro@empresa.com'), 'Separa varios correos con comas.') +\n      field('Mensaje (opcional)', '<textarea class=\"textarea\" name=\"note\" rows=\"3\" placeholder=\"Se agrega al correo con el PDF adjunto.\"></textarea>') +\n      '<div class=\"adm-btns\"><button type=\"submit\" class=\"btn btn-red\"' + (l.reportUrl ? '' : ' disabled') + '>Enviar reporte</button>' +\n      (l.reportSentAt ? '<span class=\"small muted\">Enviado ' + h(fdate(l.reportSentAt, true)) + ' a ' + h(l.reportSentTo) + '</span>' : '') + '</div></form></div></div></section>';\n  }\n\n  APP.innerHTML = shell('companies',\n    '<div class=\"adm-crumbs\"><a href=\"#/\">Empresas</a> › <a href=\"#/company/' + h(c.id) + '\">' + h(c.name) + '</a> ›</div>' +\n    '<div class=\"adm-head\"><div><h1 class=\"adm-h1\">' + typeTag(l.type) + ' ' + h(l.name) + '</h1>' +\n    '<div class=\"adm-sub\">' + h(TYPES[l.type]) + ' · ' + h(LANGS[l.language] || l.language) + ' · ' + chip(l.status) + '</div></div>' +\n    '<div class=\"adm-btns\">' + actions.join('') + '</div></div>' + notice +\n    '<div class=\"kpis\">' +\n      '<div class=\"card kpi\"><small>Respuestas</small><b>' + l.done + ' <span class=\"muted\" style=\"font-size:15px\">de ' + l.total + '</span></b>' + progress(l) + '</div>' +\n      '<div class=\"card kpi\"><small>Mínimo</small><b>' + l.minResponses + '</b><div class=\"small muted\">' + (l.done >= l.minResponses ? 'Alcanzado' : 'Faltan ' + (l.minResponses - l.done)) + '</div></div>' +\n      '<div class=\"card kpi\"><small>Cierre</small><b style=\"font-size:17px\">' + h(fdate(l.closeDate) || 'Sin fecha') + '</b></div>' +\n      '<div class=\"card kpi\"><small>' + (l.readyAt ? 'Listo desde' : 'Abierto desde') + '</small><b style=\"font-size:17px\">' + h(fdate(l.readyAt || l.openedAt) || '—') + '</b></div>' +\n    '</div>' + report +\n    '<section class=\"adm-sec\"><div class=\"adm-sec-h\"><h2 class=\"adm-h2\">Participantes</h2>' +\n    (l.type === 'ES' ? '<span class=\"small muted\">Las respuestas son anónimas: aquí solo se ve quién ya respondió.</span>' : '') + '</div>' +\n    '<div class=\"card\">' + (rows ? '<table class=\"tbl\"><thead><tr><th>Nombre</th><th>Área</th><th>Estado</th><th>Fecha</th><th></th></tr></thead><tbody>' + rows + '</tbody></table>' : '<div class=\"empty\"><b>Sin participantes</b></div>') + '</div></section>');\n\n  function on(act, fn) { var b = APP.querySelector('[data-act=\"' + act + '\"]'); if (b) b.addEventListener('click', fn); }\n  on('edit', function () { launchForm(l.companyId, l); });\n  on('participants', function () { participantsForm(l); });\n  on('delete', function () { confirmBox('Eliminar borrador', '¿Eliminar “' + h(l.name) + '”? No se puede deshacer.', 'Eliminar', function () { return run('deleteLaunch', { id: l.id }, 'Borrador eliminado').then(function () { go('#/company/' + l.companyId); }); }, true); });\n  on('open-send', function () { confirmBox('Abrir y enviar', 'Se enviará la invitación desde info@adizes.com a ' + l.total + ' participante(s), cada uno con su enlace personal.', 'Abrir y enviar', function () { return run('openLaunch', { launchId: l.id, send: true }, function (r) { return 'Abierto · ' + r.sent + ' invitación(es) enviada(s)'; }); }); });\n  on('open', function () { run('openLaunch', { launchId: l.id, send: false }, 'Abierto. Copia los enlaces para repartirlos.'); });\n  on('invite', function () { confirmBox('Enviar invitaciones', 'Se enviará la invitación a ' + pend + ' participante(s) que aún no la tienen.', 'Enviar', function () { return run('sendInvites', { launchId: l.id }, function (r) { return r.sent + ' invitación(es) enviada(s)'; }); }); });\n  on('remind', function () { confirmBox('Enviar recordatorio', 'Se enviará un recordatorio a ' + sent + ' participante(s) invitados que aún no responden.', 'Enviar recordatorio', function () { return run('remind', { launchId: l.id }, function (r) { return r.sent + ' recordatorio(s) enviado(s)'; }); }); });\n  on('copy-all', function () {\n    copyText(inv.filter(function (i) { return i.status !== 'Completed'; }).map(function (i) { var e = emp[i.employeeId] || {}; return e.name + '\\t' + e.email + '\\t' + i.link; }).join('\\n'));\n  });\n  on('finish', function () { confirmBox('Cerrar y marcar listo', 'Ya hay ' + l.done + ' de ' + l.total + ' respuestas. Al cerrar, los enlaces dejan de aceptar respuestas (puedes reabrir después).', 'Cerrar y marcar listo', function () { return run('finish', { launchId: l.id }, 'Listo para reporte'); }); });\n  on('reopen', function () {\n    modal({ title: 'Reabrir lanzamiento', ok: 'Reabrir', body: '<p style=\"margin-bottom:12px\">Los participantes que no han respondido podrán hacerlo de nuevo con su enlace.</p>' + field('Nueva fecha de cierre (opcional)', inp('closeDate', '', 'date')),\n      onOk: function (form) { return run('reopen', { launchId: l.id, closeDate: form.closeDate.value }, 'Lanzamiento reabierto'); } });\n  });\n  on('close', function () { confirmBox('Archivar lanzamiento', 'Quedará como cerrado. El reporte y las respuestas se conservan.', 'Archivar', function () { return run('close', { launchId: l.id }, 'Lanzamiento archivado'); }); });\n  on('generate', function () { generateReport(l); });\n  APP.querySelectorAll('[data-copy]').forEach(function (b) { b.addEventListener('click', function () { copyText(b.getAttribute('data-copy')); }); });\n  APP.querySelectorAll('[data-send]').forEach(function (b) { b.addEventListener('click', function () { run('sendInvites', { launchId: l.id, inviteIds: [b.getAttribute('data-send')] }, 'Invitación enviada'); }); });\n  var sf = APP.querySelector('[data-send-form]');\n  if (sf) sf.addEventListener('submit', function (e) {\n    e.preventDefault();\n    var to = sf.to.value.trim(), note = sf.note.value.trim();\n    if (!to) return toast('Agrega al menos un destinatario.', true);\n    confirmBox('Enviar reporte', 'Se enviará el PDF desde info@adizes.com a: <b>' + h(to) + '</b>', 'Enviar reporte', function () { return run('sendReport', { launchId: l.id, to: to, note: note }, 'Reporte enviado'); });\n  });\n}\n\n/* ------------------------------------------------------------------ reports (generated here, saved in Drive) */\nfunction slug(s) { return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^\\w]+/g, '-').replace(/^-|-$/g, ''); }\nfunction generateReport(l) {\n  busy(true);\n  call('reportData', { launchId: l.id }).then(function (d) {\n    if (d.type !== 'ED') throw new Error('Este tipo de reporte aún no está disponible.');\n    return getPdfAssets(CFG.assetsBase).then(function (A) {\n      var doc = renderEdPdf(A, d.lang, { result: ED.score(d.responses), company: d.company, participants: d.names, dateIso: d.dateIso });\n      var name = (d.lang === 'es' ? 'Diagnostico-Expres' : 'Express-Diagnostics') + '-' + slug(d.company) + '-' + d.dateIso.slice(0, 10) + '.pdf';\n      return call('saveReport', { launchId: l.id, pdf: doc.output('datauristring').split(',')[1], fileName: name });\n    });\n  }).then(function (r) { S = r; busy(false); render(); toast('Reporte generado y guardado en Drive'); },\n    function (e) { busy(false); toast(e.message || 'No se pudo generar el reporte', true); if (window.console) console.error(e); });\n}\n\n/* ------------------------------------------------------------------ boot */\ncall('state').then(function (r) { S = r; render(); }, function (e) {\n  APP.innerHTML = '<div class=\"adm-boot\"><div class=\"card card-pad\" style=\"max-width:420px;text-align:center\"><b>No se pudo cargar el admin</b><p class=\"muted\" style=\"margin-top:6px\">' + h(e.message) + '</p></div></div>';\n});\n\n})();</script>\n</body>\n</html>\n";