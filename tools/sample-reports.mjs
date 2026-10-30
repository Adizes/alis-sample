// Renders sample group reports (both tests × every language) with the SAME renderers the admin uses,
// into handoff/samples/. Uses the local jsPDF copy and assets, so it needs no internet.
// Run: node tools/sample-reports.mjs
import http from 'node:http';
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'node:fs';
import { dirname, join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { launchBrowser } from '../shared/test/harness.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'handoff/samples'); mkdirSync(out, { recursive: true });
const langs = (dir) => readdirSync(join(root, dir)).filter(f => f.endsWith('.js')).map(f => '/' + dir + '/' + f);
const scripts = ['/node_modules/jspdf/dist/jspdf.umd.min.js']
  .concat(langs('express-diagnostics/src/i18n'), langs('engagement-survey/src/i18n'))
  .concat(['core', 'ed-engine', 'es-engine', 'pdfkit', 'ed-report', 'es-report'].map(n => '/shared/' + n + '.js'));
const html = '<!doctype html><meta charset="utf-8"><script>var ED_I18N = {}, ES_I18N = {};</script>' + scripts.map(s => `<script src="${s}"></script>`).join('');
const TYPES = { '.js': 'text/javascript', '.png': 'image/png', '.ttf': 'font/ttf' };
const srv = http.createServer((q, r) => {
  const u = decodeURIComponent(q.url.split('?')[0]);
  if (u === '/') { r.setHeader('content-type', 'text/html; charset=utf-8'); return r.end(html); }
  const f = join(root, u);
  if (!f.startsWith(root) || !existsSync(f)) { r.statusCode = 404; return r.end(); }
  r.setHeader('content-type', TYPES[extname(f)] || 'application/octet-stream'); r.end(readFileSync(f));
}).listen(0);
const base = `http://localhost:${srv.address().port}`;

// deterministic sample data
let seed = 3; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
const edNames = ['Ana López', 'Bruno Díaz', 'Carla Méndez', 'Diego Ruiz', 'Eva Soto', 'Fernando Gil'];
const edResponses = edNames.map((_, p) => Array.from({ length: 67 }, (_, q) => { const x = rnd(); return x < 0.05 ? 1 : Math.max(2, Math.min(5, 2 + ((q * 7 + p) % 4) + (x < 0.3 ? -1 : x > 0.8 ? 1 : 0))); }));
const esAreas = [].concat(Array(10).fill('Sales'), Array(8).fill('Operations'), Array(6).fill('Finance'), Array(3).fill('HR'), Array(3).fill(''));
const esResponses = esAreas.map((area, p) => {
  const bias = [5, 4, 4, 3, 2][p % 5];
  const answers = Array.from({ length: 50 }, (_, q) => { const x = rnd(); if (q !== 49 && x < 0.04) return 1; return Math.max(2, Math.min(5, bias + (x < 0.25 ? -1 : x > 0.85 ? 1 : 0) - (q % 11 === 3 ? 1 : 0))); });
  const most = new Set(); while (most.size < 3 + (p % 10)) most.add(Math.floor(rnd() * 50) % 50);
  const importance = Array.from({ length: 50 }, (_, q) => (most.has(q) ? 3 : rnd() < 0.4 ? 2 : 1));
  const comments = Array(50).fill('');
  if (p % 4 === 0) comments[(p * 3) % 50] = ['More regular feedback from my supervisor would help.', 'Meetings start late and run long.', 'Great team spirit in our area.', 'Not clear who decides on budget changes.', 'Onboarding for new people should be longer.', 'We need better tools for reporting.', 'Recognition is mostly informal.', 'Priorities change every week.'][p / 4];
  return { answers, importance, area, comments };
});

const browser = await launchBrowser(chromium);
const page = await browser.newPage();
page.on('pageerror', e => console.error('page error:', e.message));
await page.goto(base + '/');
await page.waitForFunction(() => window.jspdf && window.renderEsPdf);
for (const lang of ['en', 'es']) {
  const files = await page.evaluate(async ({ lang, edResponses, edNames, esResponses }) => {
    const A = await getPdfAssets('/shared/assets/');
    const date = '2026-10-30T12:00:00.000Z';
    const ed = renderEdPdf(A, lang, { result: ED.score(edResponses), company: 'Sample Company', participants: edNames, dateIso: date });
    const es = renderEsPdf(A, lang, { agg: ES.aggregate(esResponses), company: 'Sample Company', launchName: lang === 'es' ? 'Encuesta anual 2026' : 'Annual survey 2026', invited: 34, dateIso: date, comments: true });
    return { ed: ed.output('datauristring').split(',')[1], es: es.output('datauristring').split(',')[1] };
  }, { lang, edResponses, edNames, esResponses });
  writeFileSync(join(out, `sample-report-express-diagnostics-${lang}.pdf`), Buffer.from(files.ed, 'base64'));
  writeFileSync(join(out, `sample-report-engagement-survey-${lang}.pdf`), Buffer.from(files.es, 'base64'));
}
writeFileSync(join(out, 'sample-report-inputs.json'), JSON.stringify({
  note: 'The exact inputs used for the sample PDFs (6 Express Diagnostics participants; 30 Engagement Survey respondents, 34 invited).',
  expressDiagnostics: { company: 'Sample Company', participants: edNames, responses: edResponses },
  engagementSurvey: { company: 'Sample Company', invited: 34, includeComments: true, responses: esResponses },
}, null, 1));
await browser.close(); srv.close();
console.log('samples →', readdirSync(out).join(', '));
