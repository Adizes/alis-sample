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
