/*************************************************************************************
 * ADIZES ASSESSMENTS — BACKEND (Google Apps Script web app)
 * Express Diagnostics · Engagement Survey · Admin
 * -----------------------------------------------------------------------------------
 * GENERATED FILE: edit apps-script/src/*.gs and shared/ed-engine.js, then `npm run build`.
 *
 * The Webflow widgets send POST requests here (Content-Type text/plain, JSON body):
 *   ed_submit  → validates, scores on the server, saves a row in "ED Responses"
 *   ed_deliver → receives the PDF (base64), saves it in Drive, emails it, notifies it@adizes.com
 *   ed_event   → small events (booking click, PDF download)
 * Backup: a time trigger (every 10 min) emails a summary to anyone whose PDF never arrived.
 *
 * First time: run setup() once from the editor (creates the data spreadsheet, the Drive
 * folders and the trigger, and asks for permissions).
 * Deploy: Deploy → New deployment → Web app → Execute as: Me · Who has access: Anyone.
 *************************************************************************************/

const CONFIG = {
  EMAIL: {
    FROM_ADDRESS: 'info@adizes.com',  // "Send mail as" alias of the account that owns this script
    FROM_NAME: 'Adizes Institute',
    NOTIFY_TO: 'it@adizes.com',       // internal notifications (same domain → sent WITHOUT Reply-To)
  },
  CALENDLY_URL: 'https://calendly.com/jaime-morales/30min',
  ASSETS_BASE: 'https://cdn.jsdelivr.net/gh/Adizes/alis-sample@v1.0.0/shared/assets/',
  // Optional: leave '' and setup() creates them (IDs are then kept in Script Properties).
  DATA_SPREADSHEET_ID: '',
  PDF_FOLDER_ID: '',
  // Founder Dependency (read-only, used by the admin)
  FD_SPREADSHEET_ID: '1RpJO1pDpnBgS_XlhsA2KsABw36N9XaHA-lsDjdMgpt4',
  BACKUP_AFTER_MIN: 15,
  MAX_PDF_BYTES: 8 * 1024 * 1024,
};
const VERSION = "1.0.0";

/* ----------------------------------------------------------------------------------
 * Labels used by the server (emails, Sheet). To add a language, copy a block.
 * ---------------------------------------------------------------------------------- */
const LABELS = {
  en: {
    cells: {
      values: 'Values', climate: 'Climate', responsibility: 'Responsibility Structure', authority: 'Authority Structure',
      reward: 'Reward Structure', planning: 'Planning', information: 'Information flow', corrective: 'Corrective Actions',
      client: 'Client interface', transformation: 'Transformation', human: 'Human factors', financial: 'Financial factors',
      behaviour: 'Behaviour', changes: 'Changes', inefficiency: 'Inefficiency', ineffectiveness: 'Ineffectiveness',
    },
    colors: { green: 'Healthy', yellow: 'Needs improvement', red: 'Key focus zone' },
    ed: {
      subject: 'Your Express Diagnostics report',
      hi: 'Hi {first},',
      intro: 'Thank you for completing the Express Diagnostics. Your full report is attached as a PDF.',
      introNoPdf: 'Thank you for completing the Express Diagnostics. Here is a summary of your results.',
      glance: 'At a glance',
      count: { red: 'key focus zones', yellow: 'areas to improve', green: 'healthy' },
      focus: 'Where to look first',
      factors: 'All 16 factors',
      sessionTitle: 'Turn this diagnosis into a plan',
      sessionBody: 'In a free 30-minute session, a Certified Adizes Associate reviews your diagnostic with you and helps you decide where to start.',
      sessionCta: 'Book my free session',
      sign: 'The Adizes Institute team',
      footer: 'You received this email because you completed the Express Diagnostics at adizes.com.',
    },
  },
  es: {
    cells: {
      values: 'Valores', climate: 'Clima', responsibility: 'Estructura de responsabilidad', authority: 'Estructura de autoridad',
      reward: 'Estructura de recompensas', planning: 'Planificación', information: 'Flujo de información', corrective: 'Acciones correctivas',
      client: 'Interfaz con el cliente', transformation: 'Transformación', human: 'Factores humanos', financial: 'Factores financieros',
      behaviour: 'Comportamiento', changes: 'Cambios', inefficiency: 'Ineficiencia', ineffectiveness: 'Inefectividad',
    },
    colors: { green: 'Sano', yellow: 'Por mejorar', red: 'Zona de enfoque clave' },
    ed: {
      subject: 'Tu reporte de Diagnóstico Exprés',
      hi: 'Hola, {first}:',
      intro: 'Gracias por completar el Diagnóstico Exprés. Adjuntamos tu reporte completo en PDF.',
      introNoPdf: 'Gracias por completar el Diagnóstico Exprés. Aquí tienes un resumen de tus resultados.',
      glance: 'En resumen',
      count: { red: 'zonas de enfoque clave', yellow: 'áreas por mejorar', green: 'sanas' },
      focus: 'Por dónde empezar',
      factors: 'Los 16 factores',
      sessionTitle: 'Convierte este diagnóstico en un plan',
      sessionBody: 'En una sesión gratuita de 30 minutos, un Asociado Certificado de Adizes revisa tu diagnóstico contigo y te ayuda a decidir por dónde empezar.',
      sessionCta: 'Agendar mi sesión gratuita',
      sign: 'El equipo del Instituto Adizes',
      footer: 'Recibiste este correo porque completaste el Diagnóstico Exprés en adizes.com.',
    },
  },
};
function L_(lang) { return LABELS[lang] || LABELS.en; }


/* ===== shared/ed-engine.js (same file the widget uses) ===== */
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
  ed_submit: (b) => edSubmit_(b),
  ed_deliver: (b) => edDeliver_(b),
  ed_event: (b) => edEvent_(b),
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

function doGet() {
  return json_({ ok: true, service: 'adizes-assessments', version: VERSION, time: new Date().toISOString() });
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
function ctaBlock_(title, body, cta, url) {
  return '<div style="background:#111111;border-radius:10px;padding:24px;margin:26px 0 8px">' +
    '<div style="font:700 18px Arial,sans-serif;color:#ffffff">' + esc_(title) + '</div>' +
    '<p style="font:14px/1.6 Arial,sans-serif;color:#cfcfcf;margin:8px 0 18px">' + esc_(body) + '</p>' +
    '<a href="' + esc_(url) + '" style="display:inline-block;background:#d7141a;color:#ffffff;font:700 15px Arial,sans-serif;text-decoration:none;padding:12px 22px;border-radius:6px">' + esc_(cta) + ' &rarr;</a></div>';
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
function newId_(prefix) {
  const d = Utilities.formatDate(new Date(), 'UTC', 'yyMMdd');
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let r = ''; for (let i = 0; i < 6; i++) r += chars[Math.floor(Math.random() * chars.length)];
  return prefix + '-' + d + '-' + r;
}
function splitName_(name) { const p = name.split(/\s+/); return { first: p[0], last: p.slice(1).join(' ') }; }
function meta_(m) {
  m = m || {};
  return {
    'Page': clean_(m.page, 500), 'Referrer': clean_(m.referrer, 500),
    'UTM Source': clean_(m.utm_source, 120), 'UTM Medium': clean_(m.utm_medium, 120), 'UTM Campaign': clean_(m.utm_campaign, 200),
    'UTM Content': clean_(m.utm_content, 200), 'UTM Term': clean_(m.utm_term, 200),
    'Started At': clean_(m.startedAt, 40), 'Time Zone': clean_(m.tz, 60),
  };
}
const META_COLS = ['Page', 'Referrer', 'UTM Source', 'UTM Medium', 'UTM Campaign', 'UTM Content', 'UTM Term', 'Started At', 'Time Zone'];


/* =================================================================================
 *  EXPRESS DIAGNOSTICS (individual)
 * ================================================================================= */
const ED_CELL_COLS = ED.CELLS.map(c => c.code + ' ' + LABELS.en.cells[c.key] + ' %');
const ED_Q_COLS = ED.QUESTION_CATS.map((c, i) => 'Q' + (i + 1));
const ED_TABLE = {
  name: 'ED Responses',
  cols: [
    'ID', 'Submitted At', 'Status', 'Mode', 'Group Code', 'Language',
    'Full Name', 'First Name', 'Last Name', 'Email', 'Company',
    'Key Focus Zones', 'To Improve', 'Healthy', 'Key Focus Areas',
  ].concat(ED_CELL_COLS, ED_Q_COLS, [
    'Report URL', 'Emailed At', 'Notified', 'Session Click', 'PDF Downloads',
    'Consent'], META_COLS, ['Widget Version', 'Error']),
  text: ['ID', 'Group Code', 'Full Name', 'First Name', 'Last Name', 'Email', 'Company', 'Key Focus Areas', 'Error'].concat(META_COLS),
};
const ED_STATUS = { SUBMITTED: 'Submitted', DONE: 'Done', DONE_NO_PDF: 'Done (no PDF)', ERROR: 'Error' };

function edSubmit_(b) {
  const answers = (b.answers || []).map(Number);
  if (!ED.validAnswers(answers)) throw new Error('invalid_answers');
  const c = b.contact || {};
  const name = clean_(c.name, 120).replace(/\s+/g, ' '), email = clean_(c.email, 160).toLowerCase(), company = clean_(c.company, 160);
  if (name.length < 2) throw new Error('invalid_name');
  if (!validEmail_(email)) throw new Error('invalid_email');
  if (!company) throw new Error('invalid_company');
  if (c.consent !== true) throw new Error('consent_required');
  const lang = LABELS[b.lang] ? b.lang : 'en';

  const r = ED.score([answers]);
  const counts = edCounts_(r);
  const id = newId_('ED');
  const nm = splitName_(name);
  const row = Object.assign({
    'ID': id, 'Submitted At': new Date(), 'Status': ED_STATUS.SUBMITTED, 'Mode': 'Individual', 'Language': lang,
    'Full Name': name, 'First Name': nm.first, 'Last Name': nm.last, 'Email': email, 'Company': company,
    'Key Focus Zones': counts.red, 'To Improve': counts.yellow, 'Healthy': counts.green,
    'Key Focus Areas': r.cells.filter(x => x.color === 'red').map(x => LABELS.en.cells[x.key]).join(' | '),
    'Consent': 'Yes', 'PDF Downloads': 0, 'Widget Version': clean_(b.v, 20),
  }, meta_(b.meta));
  r.cells.forEach((x, i) => { row[ED_CELL_COLS[i]] = Math.round(x.percent * 10) / 10; });
  answers.forEach((v, i) => { row[ED_Q_COLS[i]] = v; });
  appendRecord_(ED_TABLE, row);
  return { ok: true, id: id, counts: counts };
}

function edDeliver_(b) {
  const found = findRecord_(ED_TABLE, 'ID', clean_(b.id, 40));
  if (!found) throw new Error('not_found');
  const { sh, rowNum, rec, map } = found;
  if (rec['Status'] === ED_STATUS.DONE) return { ok: true, already: true };
  const blob = pdfBlob_(b.pdf, b.fileName, 'Express-Diagnostics.pdf');
  const nice = blob.getName();
  const file = folder_('ED').createFile(blob.setName(nice.replace(/\.pdf$/i, '') + ' - ' + rec['ID'] + '.pdf'));
  blob.setName(nice);
  const url = file.getUrl();
  setCells_(sh, rowNum, map, { 'Report URL': url });
  rec['Report URL'] = url;
  try {
    edSendUserEmail_(rec, blob);
    setCells_(sh, rowNum, map, { 'Emailed At': new Date() });
  } catch (err) {
    setCells_(sh, rowNum, map, { 'Status': ED_STATUS.ERROR, 'Error': 'email: ' + err });
    throw err;
  }
  edFinish_(sh, rowNum, map, rec, ED_STATUS.DONE);
  return { ok: true };
}

function edFinish_(sh, rowNum, map, rec, status) {
  const upd = { 'Status': status };
  if (CONFIG.EMAIL.NOTIFY_TO && !rec['Notified']) {
    try { edNotify_(rec); upd['Notified'] = new Date(); }
    catch (err) { upd['Notified'] = 'ERROR ' + String(err).slice(0, 200); }
  }
  setCells_(sh, rowNum, map, upd);
}

function edEvent_(b) {
  const found = findRecord_(ED_TABLE, 'ID', clean_(b.id, 40));
  if (!found) return { ok: true };
  const { sh, rowNum, rec, map } = found;
  if (b.type === 'book_click' && !rec['Session Click']) setCells_(sh, rowNum, map, { 'Session Click': new Date() });
  if (b.type === 'pdf_download') setCells_(sh, rowNum, map, { 'PDF Downloads': (Number(rec['PDF Downloads']) || 0) + 1 });
  return { ok: true };
}

// Time trigger: rows whose PDF never arrived (person closed the tab) get the summary email.
function edBackup_() {
  const { sh, map, rows } = allRecords_(ED_TABLE);
  const cutoff = Date.now() - CONFIG.BACKUP_AFTER_MIN * 60 * 1000;
  rows.forEach(rec => {
    if (rec['Status'] !== ED_STATUS.SUBMITTED || rec['Mode'] !== 'Individual') return;
    const at = rec['Submitted At'] instanceof Date ? rec['Submitted At'].getTime() : Date.parse(rec['Submitted At']);
    if (!(at < cutoff)) return;
    try {
      edSendUserEmail_(rec, null);
      setCells_(sh, rec._row, map, { 'Emailed At': new Date() });
      edFinish_(sh, rec._row, map, rec, ED_STATUS.DONE_NO_PDF);
    } catch (err) {
      setCells_(sh, rec._row, map, { 'Status': ED_STATUS.ERROR, 'Error': 'backup: ' + err });
    }
  });
}

/* ---------------- helpers ---------------- */
function edCounts_(r) { const c = { red: 0, yellow: 0, green: 0 }; r.cells.forEach(x => c[x.color]++); return c; }
function edRecScore_(rec) { return ED.score([ED_Q_COLS.map(h => Number(rec[h]))]); }
function edCalendly_(rec, src) {
  return CONFIG.CALENDLY_URL + '?name=' + encodeURIComponent(rec['Full Name'] || '') + '&email=' + encodeURIComponent(rec['Email'] || '') +
    '&utm_source=' + (src || 'express-diagnostics-email') + '&utm_content=' + encodeURIComponent(rec['ID']);
}
const ED_HEX = { green: '#1e8e4e', yellow: '#9a7200', red: '#d7141a' };
const ED_TINT = { green: '#dcf2e5', yellow: '#fff0bf', red: '#fbd6d7' };

function edSendUserEmail_(rec, pdfBlob) {
  const lang = LABELS[rec['Language']] ? rec['Language'] : 'en';
  const T = L_(lang), E = T.ed, r = edRecScore_(rec), counts = edCounts_(r);
  const first = esc_(rec['First Name'] || '');
  const cal = edCalendly_(rec);
  const boxes = ['red', 'yellow', 'green'].map(c =>
    '<td width="33%" style="padding:0 4px"><div style="background:#f6f6f6;border-left:4px solid ' + ED_HEX[c] + ';padding:12px 14px">' +
    '<div style="font:700 26px Arial,sans-serif;color:#111111">' + counts[c] + '</div>' +
    '<div style="font:600 12px Arial,sans-serif;color:#6b6f76">' + esc_(E.count[c]) + '</div></div></td>').join('');
  const rows = r.cells.slice().sort((a, b) => a.percent - b.percent).map(x =>
    '<tr><td style="padding:8px 0;border-bottom:1px solid #eeeeee;font:600 14px Arial,sans-serif;color:#111111">' + esc_(T.cells[x.key]) + '</td>' +
    '<td style="padding:8px 0;border-bottom:1px solid #eeeeee;text-align:right;white-space:nowrap"><span style="display:inline-block;padding:2px 8px;border-radius:3px;background:' + ED_TINT[x.color] + ';color:' + ED_HEX[x.color] + ';font:700 12px Arial,sans-serif">' + Math.round(x.percent) + '% · ' + esc_(T.colors[x.color]) + '</span></td></tr>').join('');
  const inner =
    '<p style="margin:0 0 14px">' + fill_(E.hi, { first: first }) + '</p>' +
    '<p style="margin:0 0 22px">' + esc_(pdfBlob ? E.intro : E.introNoPdf) + '</p>' +
    '<div style="font:700 11px Arial,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:#d7141a;margin-bottom:8px">' + esc_(E.glance) + '</div>' +
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 -4px"><tr>' + boxes + '</tr></table>' +
    '<div style="font:700 16px Arial,sans-serif;color:#111111;margin:26px 0 4px">' + esc_(E.factors) + '</div>' +
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0">' + rows + '</table>' +
    ctaBlock_(E.sessionTitle, E.sessionBody, E.sessionCta, cal) +
    '<p style="margin:22px 0 0">' + esc_(E.sign) + '</p>';
  const plain = fill_(E.hi, { first: rec['First Name'] || '' }) + '\n\n' + (pdfBlob ? E.intro : E.introNoPdf) + '\n\n' +
    ['red', 'yellow', 'green'].map(c => counts[c] + ' ' + E.count[c]).join(' · ') + '\n\n' +
    r.cells.map(x => T.cells[x.key] + ': ' + Math.round(x.percent) + '% (' + T.colors[x.color] + ')').join('\n') +
    '\n\n' + E.sessionTitle + ': ' + cal + '\n\n' + E.sign;
  sendMail_(rec['Email'], E.subject, plain, emailShell_(inner, E.footer), pdfBlob ? [pdfBlob] : null);
}

function edNotify_(rec) {
  const r = edRecScore_(rec), counts = edCounts_(r);
  const lines = [
    ['ID', rec['ID']], ['Name', rec['Full Name']], ['Email', rec['Email']], ['Company', rec['Company']], ['Language', rec['Language']],
    ['Result', counts.red + ' key focus · ' + counts.yellow + ' to improve · ' + counts.green + ' healthy'],
    ['Key focus areas', rec['Key Focus Areas'] || '(none)'],
    ['Report', rec['Report URL'] || '(no PDF — sent by backup)'],
    ['Source', [rec['UTM Source'], rec['UTM Medium'], rec['UTM Campaign']].filter(String).join(' / ') || '(none)'],
  ];
  const html = '<table style="font:14px Arial,sans-serif;border-collapse:collapse">' + lines.map(l =>
    '<tr><td style="padding:4px 14px 4px 0;color:#6b6f76;vertical-align:top">' + esc_(l[0]) + '</td><td style="padding:4px 0;color:#111111">' + esc_(l[1]) + '</td></tr>').join('') + '</table>';
  const subject = '[Express Diagnostics] ' + rec['Full Name'] + ' · ' + rec['Company'] + ' · ' + counts.red + ' key focus';
  sendMail_(CONFIG.EMAIL.NOTIFY_TO, subject, lines.map(l => l[0] + ': ' + l[1]).join('\n'), html);
}


/* =================================================================================
 *  TIME TRIGGER (every 10 minutes)
 * ================================================================================= */
function backupDeliver() {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(5000)) return;
  LOCK_DEPTH_++;
  try {
    edBackup_();
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
  // 1) Data spreadsheet (only admins should have access to it)
  if (!CONFIG.DATA_SPREADSHEET_ID && !props.getProperty('DATA_SPREADSHEET_ID')) {
    const ss = SpreadsheetApp.create('Adizes Assessments — Data');
    props.setProperty('DATA_SPREADSHEET_ID', ss.getId());
  }
  // 2) Drive folder for the PDFs
  if (!CONFIG.PDF_FOLDER_ID && !props.getProperty('PDF_FOLDER_ID')) {
    const f = DriveApp.createFolder('Adizes Assessments — PDFs');
    props.setProperty('PDF_FOLDER_ID', f.getId());
  }
  table_(ED_TABLE);
  folder_('ED');
  // 3) Admin list (used from stage 2 on)
  if (!props.getProperty('ADMIN_EMAILS')) props.setProperty('ADMIN_EMAILS', 'dario@adizes.com');
  // 4) Trigger
  ScriptApp.getProjectTriggers().forEach(t => { if (t.getHandlerFunction() === 'backupDeliver') ScriptApp.deleteTrigger(t); });
  ScriptApp.newTrigger('backupDeliver').timeBased().everyMinutes(10).create();
  // 5) Touch Gmail once so Google asks for that permission now
  GmailApp.getAliases();
  const ss = dataSS_();
  Logger.log('Ready.\nData spreadsheet: ' + ss.getUrl() + '\nPDF folder: ' + DriveApp.getFolderById(CONFIG.PDF_FOLDER_ID || props.getProperty('PDF_FOLDER_ID')).getUrl());
}

// Optional: run from the editor to send yourself a test summary email.
function testEmailToMe() {
  const me = Session.getActiveUser().getEmail();
  const rec = { 'ID': 'ED-TEST', 'Language': 'es', 'First Name': 'Prueba', 'Full Name': 'Prueba Adizes', 'Email': me, 'Company': 'Adizes' };
  ED_Q_COLS.forEach((h, i) => rec[h] = [5, 4, 3, 2, 1][i % 5]);
  edSendUserEmail_(rec, null);
  Logger.log('Sent to ' + me);
}
