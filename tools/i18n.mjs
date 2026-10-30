// Translations as flat key → text tables, so they can be edited in a spreadsheet.
//   node tools/i18n.mjs dump  <out.json>   language files → { sets: { ed, es, emails } }
//   node tools/i18n.mjs build <in.json>    flat tables → express-diagnostics/src/i18n/<lang>.js,
//                                          engagement-survey/src/i18n/<lang>.js, apps-script/src/01-labels.gs
// English is the structural template: a language only needs texts; numbers (answer values) and
// structure always come from English. A missing text falls back to English (and is reported).
// Normally used through tools/translations.py (the Excel workbook).
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import vm from 'node:vm';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(join(root, p), 'utf8');
const SETS = {
  ed: { dir: 'express-diagnostics/src/i18n', v: 'ED_I18N', title: 'Express Diagnostics' },
  es: { dir: 'engagement-survey/src/i18n', v: 'ES_I18N', title: 'Engagement Survey' },
};
const LABELS_FILE = 'apps-script/src/01-labels.gs';
const SKIP = new Set(['code']); // never translated

function loadSet(s) {
  const ctx = {}; vm.createContext(ctx);
  const files = readdirSync(join(root, s.dir)).filter(f => f.endsWith('.js'));
  vm.runInContext(`var ${s.v} = {};\n` + files.map(f => read(s.dir + '/' + f)).join('\n') + `\nthis.X = ${s.v};`, ctx);
  return JSON.parse(JSON.stringify(ctx.X));
}
function loadLabels() {
  const ctx = {}; vm.createContext(ctx);
  vm.runInContext(read(LABELS_FILE) + '\nthis.X = LABELS;', ctx);
  return JSON.parse(JSON.stringify(ctx.X));
}
// { a: { b: ['x'] } } → { 'a.b.0': 'x' } (strings only; numbers/booleans are structure)
function flat(o, pre = '', out = {}) {
  if (typeof o === 'string') { out[pre] = o; return out; }
  if (o && typeof o === 'object') for (const k of Object.keys(o)) { if (!pre && SKIP.has(k)) continue; flat(o[k], pre ? pre + '.' + k : k, out); }
  return out;
}
function fillFrom(template, table, lang, missing, pre = '') {
  if (typeof template === 'string') {
    const v = table[pre];
    if (v == null || String(v).trim() === '') { missing.push(pre); return template; }
    return String(v);
  }
  if (Array.isArray(template)) return template.map((x, i) => fillFrom(x, table, lang, missing, pre ? pre + '.' + i : String(i)));
  if (template && typeof template === 'object') {
    const o = {};
    for (const k of Object.keys(template)) o[k] = !pre && k === 'code' ? lang : fillFrom(template[k], table, lang, missing, pre ? pre + '.' + k : k);
    return o;
  }
  return template;
}
const js = (o) => JSON.stringify(o, null, 2).replace(/^( *)"([A-Za-z_$][\w$]*)":/gm, '$1$2:');

const [cmd, file] = process.argv.slice(2);
if (cmd === 'dump') {
  const out = { sets: {} };
  for (const [id, s] of Object.entries(SETS)) {
    const all = loadSet(s), langs = Object.keys(all);
    out.sets[id] = { title: s.title, keys: Object.keys(flat(all.en)), langs: Object.fromEntries(langs.map(l => [l, flat(all[l])])) };
  }
  const L = loadLabels();
  out.sets.emails = { title: 'Emails', keys: Object.keys(flat(L.en)), langs: Object.fromEntries(Object.keys(L).map(l => [l, flat(L[l])])) };
  writeFileSync(file, JSON.stringify(out, null, 1));
  console.log('dumped', Object.entries(out.sets).map(([k, v]) => `${k}: ${v.keys.length} texts × ${Object.keys(v.langs).join('/')}`).join(' · '));
} else if (cmd === 'build') {
  const input = JSON.parse(readFileSync(file, 'utf8'));
  const report = [];
  for (const [id, s] of Object.entries(SETS)) {
    const en = loadSet(s).en, tables = input.sets[id].langs;
    for (const lang of Object.keys(tables)) {
      const missing = [];
      const obj = lang === 'en' ? fillFrom(en, tables.en, 'en', missing) : fillFrom(en, tables[lang], lang, missing);
      const name = obj.langName || lang;
      writeFileSync(join(root, s.dir, lang + '.js'),
        `/* ${s.title} — ${name}\n * GENERATED from the translations workbook (tools/translations.py). Edit the workbook, not this file.\n` +
        ` * Answer values and the order of questions come from English and never change.\n */\n${s.v}.${lang} = ${js(obj)};\n`);
      report.push(`${id}/${lang}: ${missing.length ? missing.length + ' missing → English (' + missing.slice(0, 4).join(', ') + (missing.length > 4 ? '…' : '') + ')' : 'complete'}`);
    }
  }
  const tables = input.sets.emails.langs, enL = loadLabels().en, labels = {};
  for (const lang of Object.keys(tables)) {
    const missing = [];
    labels[lang] = fillFrom(enL, tables[lang], lang, missing);
    report.push(`emails/${lang}: ${missing.length ? missing.length + ' missing → English' : 'complete'}`);
  }
  writeFileSync(join(root, LABELS_FILE),
    `/* Texts sent by the server (invitations, reminders, report email) per language.\n` +
    ` * GENERATED from the translations workbook (tools/translations.py). Edit the workbook, not this file.\n` +
    ` * {placeholders} are filled by the server. Internal notices to admins are in Spanish (50-mail.gs). */\nconst LABELS = ${js(labels)};\n`);
  console.log(report.join('\n'));
} else {
  console.log('usage: node tools/i18n.mjs dump <out.json> | build <in.json>');
  process.exit(1);
}
