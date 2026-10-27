// Runs the REAL apps-script/Code.gs inside Node with in-memory fakes of the Google services it uses.
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
export const CODE_PATH = join(here, '..', '..', 'apps-script', 'Code.gs');

function colRange(sheet, r, c, nr = 1, nc = 1) {
  const api = {
    getValues: () => Array.from({ length: nr }, (_, i) => Array.from({ length: nc }, (_, j) => sheet.get(r + i, c + j))),
    getValue: () => sheet.get(r, c),
    setValues: (vals) => { vals.forEach((row, i) => row.forEach((v, j) => sheet.set(r + i, c + j, v))); return api; },
    setValue: (v) => { sheet.set(r, c, v); return api; },
    setNumberFormat: (f) => { for (let j = 0; j < nc; j++) sheet.formats[c + j] = f; return api; },
    setFontWeight: () => api, setBackground: () => api, setFontColor: () => api,
  };
  return api;
}

export class FakeSheet {
  constructor(name) { this.name = name; this.rows = []; this.formats = {}; this.maxRows = 1000; }
  get(r, c) { return (this.rows[r - 1] || [])[c - 1] ?? ''; }
  set(r, c, v) {
    while (this.rows.length < r) this.rows.push([]);
    const row = this.rows[r - 1];
    while (row.length < c) row.push('');
    // emulate Sheets: plain-text columns keep text; otherwise "=..." would become a formula
    if (typeof v === 'string' && /^=/.test(v) && this.formats[c] !== '@') throw new Error('FORMULA INJECTION at col ' + c + ': ' + v);
    row[c - 1] = v;
  }
  getRange(r, c, nr, nc) { return colRange(this, r, c, nr, nc); }
  appendRow(vals) { this.rows.push([]); vals.forEach((v, j) => this.set(this.rows.length, j + 1, v)); }
  getLastRow() { return this.rows.length; }
  getLastColumn() { return Math.max(0, ...this.rows.map(r => r.length)); }
  getMaxRows() { return this.maxRows; }
  setFrozenRows() {}
  // helpers for tests
  heads() { return this.rows[0]; }
  obj(rowNum) { const o = {}; this.rows[0].forEach((h, i) => (o[h] = this.rows[rowNum - 1][i])); return o; }
}

function blob(bytes, type, name) {
  return {
    bytes, type, name,
    setName(n) { this.name = n; return this; }, getName() { return this.name; }, getBytes() { return this.bytes; },
    copyBlob() { return blob(this.bytes, this.type, this.name); },
  };
}

export function loadGas(opts = {}) {
  const state = {
    sheets: {}, files: [], folders: [], emails: [], fetches: [], triggers: [], props: { ...(opts.props || {}) },
    emailFail: !!opts.emailFail, activeUser: opts.activeUser ?? 'dario@adizes.com', spreadsheets: 0,
  };
  const ss = {
    getId: () => 'SS1', getUrl: () => 'https://docs.google.com/spreadsheets/d/SS1',
    getSheetByName: (n) => state.sheets[n] || null,
    insertSheet: (n) => (state.sheets[n] = new FakeSheet(n)),
  };
  function folder(id, name) {
    const f = {
      id, name, getId: () => id, getName: () => name, getUrl: () => 'https://drive.google.com/drive/folders/' + id,
      createFolder: (n) => { const sub = folder('F' + state.folders.length, n); state.folders.push(sub); return sub; },
      createFile: (b) => {
        const fid = 'file' + state.files.length; const copy = b.copyBlob ? b.copyBlob() : b;
        state.files.push({ id: fid, blob: copy, folder: name });
        return { getUrl: () => 'https://drive.google.com/file/d/' + fid + '/view', getId: () => fid };
      },
    };
    return f;
  }
  const lock = () => ({ waitLock() {}, tryLock() { return true; }, releaseLock() {}, hasLock() { return false; } });
  const ctx = {
    console: { log() {}, error: (...a) => (state.lastError = a.join(' ')) },
    Logger: { log: (m) => (state.log = m) },
    SpreadsheetApp: {
      openById: (id) => { if (id !== 'SS1') throw new Error('no spreadsheet ' + id); return ss; },
      create: () => { state.spreadsheets++; return ss; },
    },
    PropertiesService: {
      getScriptProperties: () => ({
        getProperty: (k) => state.props[k] ?? null,
        setProperty: (k, v) => { state.props[k] = String(v); },
      }),
    },
    LockService: { getScriptLock: lock },
    ContentService: {
      MimeType: { JSON: 'json' },
      createTextOutput: (s) => ({ _s: s, setMimeType() { return this; }, getContent() { return this._s; } }),
    },
    Utilities: {
      base64Decode: (b64) => Array.from(Buffer.from(b64, 'base64')).map(x => (x > 127 ? x - 256 : x)),
      newBlob: (bytes, type, name) => blob(bytes, type, name),
      formatDate: (d) => d.toISOString().slice(2, 10).replace(/-/g, ''),
    },
    DriveApp: {
      createFolder: (n) => { const f = folder('F' + state.folders.length, n); state.folders.push(f); return f; },
      getFolderById: (id) => state.folders.find(f => f.id === id) || (() => { throw new Error('no folder ' + id); })(),
    },
    GmailApp: {
      getAliases: () => ['info@adizes.com'],
      sendEmail: (to, subject, body, options) => { if (state.emailFail) throw new Error('mail down'); state.emails.push({ to, subject, body, options }); },
    },
    UrlFetchApp: { fetch: (url, o) => { state.fetches.push({ url, o }); return { getResponseCode: () => 200, getContentText: () => 'ok' }; } },
    ScriptApp: {
      getProjectTriggers: () => state.triggers,
      deleteTrigger: (t) => { state.triggers.splice(state.triggers.indexOf(t), 1); },
      newTrigger: (fn) => ({ timeBased: () => ({ everyMinutes: (m) => ({ create: () => state.triggers.push({ fn, m, getHandlerFunction: () => fn }) }) }) }),
    },
    Session: { getActiveUser: () => ({ getEmail: () => state.activeUser }) },
    Date, Math, JSON, String, Number, Array, Object, Error, RegExp, Infinity, encodeURIComponent, parseInt, isFinite,
  };
  vm.createContext(ctx);
  const code = readFileSync(CODE_PATH, 'utf8');
  vm.runInContext(code + '\n;globalThis.__gas = { doPost, doGet, backupDeliver, setup, testEmailToMe, CONFIG, ED, ED_TABLE };', ctx);
  const gas = ctx.__gas;
  const post = (obj) => JSON.parse(gas.doPost({ postData: { contents: JSON.stringify(obj) } }).getContent());
  if (opts.setup !== false) gas.setup();
  return { gas, state, post, sheet: (n) => state.sheets[n] };
}
