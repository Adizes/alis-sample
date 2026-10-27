// Browser-test harness: a local "Webflow" page + a fake script.google.com that answers like Apps Script
// (POST → 302 → GET googleusercontent), both cross-origin, with the REAL Code.gs behind it.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import http from 'node:http';
import { loadGas } from './gas-mock.mjs';
import { existsSync, readdirSync } from 'node:fs';

const here = dirname(fileURLToPath(import.meta.url));
export const ROOT = join(here, '..', '..');
export const CDN = 'https://cdn.jsdelivr.net/gh/Adizes/alis-sample@v-test/';

export async function startServers() {
  const S = { gas: null, pending: {}, seq: 0, netErrors: [], failNext: false, html: '' };
  S.gasServer = http.createServer((req, res) => {
    res.setHeader('access-control-allow-origin', '*');
    if (req.method === 'OPTIONS') { S.netErrors.push('unexpected CORS preflight'); res.writeHead(405); return res.end(); }
    if (req.url.startsWith('/macros/s/TEST/exec') && req.method === 'POST') {
      const ct = req.headers['content-type'] || '';
      if (!ct.startsWith('text/plain')) S.netErrors.push('content-type should be text/plain: ' + ct);
      let body = ''; req.on('data', c => (body += c)); req.on('end', () => {
        if (S.failNext) { res.writeHead(500); return res.end('boom'); }
        const key = 'r' + (++S.seq); S.pending[key] = S.gas.post(JSON.parse(body));
        res.writeHead(302, { location: 'http://127.0.0.1:' + S.gasServer.address().port + '/macros/echo?user_content_key=' + key }); res.end();
      });
      return;
    }
    if (req.url.startsWith('/macros/echo')) {
      const key = new URL(req.url, 'http://x').searchParams.get('user_content_key');
      res.writeHead(200, { 'content-type': 'application/json' }); return res.end(JSON.stringify(S.pending[key]));
    }
    res.writeHead(404); res.end();
  });
  S.pageServer = http.createServer((req, res) => { res.writeHead(200, { 'content-type': 'text/html' }); res.end(S.html); });
  await new Promise(r => S.gasServer.listen(0, '127.0.0.1', r));
  await new Promise(r => S.pageServer.listen(0, '127.0.0.1', r));
  S.ENDPOINT = 'http://127.0.0.1:' + S.gasServer.address().port + '/macros/s/TEST/exec';
  S.SITE = 'http://127.0.0.1:' + S.pageServer.address().port + '/page';
  S.close = () => { S.gasServer.close(); S.pageServer.close(); };
  return S;
}

// Page that imitates Webflow's global CSS (normalize + webflow.css defaults that usually break embeds)
export function webflowPage({ title, mountId, configVar, cfg, script }) {
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title} | Adizes</title>
<style>
  html{font-size:16px} body{margin:0;font-family:Arial,sans-serif;font-size:14px;line-height:20px;color:#333;background:#fff}
  *{box-sizing:border-box} h1{font-size:38px;line-height:44px;margin:20px 0 10px;font-weight:bold} h2{font-size:32px;line-height:36px;margin:20px 0 10px}
  h3{font-size:24px;margin:20px 0 10px} p{margin:0 0 10px} a{color:#3898ec;text-decoration:underline} ul,ol{margin:0 0 10px;padding-left:40px}
  li{margin-bottom:6px} button,input,select,textarea{font-family:inherit;font-size:100%;margin:0} button{background:#3898ec;color:#fff;border:0;padding:9px 15px;border-radius:0}
  input,select{display:block;width:100%;height:38px;padding:8px 12px;margin-bottom:10px;font-size:14px;line-height:1.4;color:#333;background:#fff;border:1px solid #ccc}
  img{max-width:100%;vertical-align:middle;display:inline-block} label{display:block;margin-bottom:5px;font-weight:bold}
  svg text{font-family:Arial} figure{margin:0 0 10px}
  .nav{height:72px;background:#111;color:#fff;display:flex;align-items:center;padding:0 24px;font-weight:bold}
  .wrap{max-width:1100px;margin:0 auto;padding:40px 20px} .footer{height:200px;background:#111}
  @media (max-width:640px){.wrap{padding:0}}
</style></head><body>
<div class="nav">adizes.com (Webflow nav)</div>
<div class="wrap"><div id="${mountId}"></div></div>
<div class="footer"></div>
<script>window.${configVar} = ${JSON.stringify(cfg)};</script>
<script src="${CDN}${script}" defer></script>
</body></html>`;
}

const fontCss = ['Light:300', 'Regular:400', 'SemiBold:600', 'Bold:700', 'Bold:800', 'SemiBold:500'].map(x => {
  const [n, w] = x.split(':');
  return `@font-face{font-family:'Montserrat';font-weight:${w};src:url(${CDN}shared/assets/fonts/Montserrat-${n}.ttf) format('truetype')}`;
}).join('\n');

export async function newPage(S, browser, device, html, gasOpts) {
  const ctx = await browser.newContext(device);
  S.gas = loadGas(gasOpts); S.html = html; S.netErrors.length = 0;
  const errors = S.netErrors;
  await ctx.route('**/*', async (route) => {
    const url = route.request().url();
    if (url.startsWith('http://127.0.0.1')) return route.fallback();
    if (url.startsWith(CDN)) {
      const rel = url.slice(CDN.length).split('?')[0];
      const type = rel.endsWith('.js') ? 'application/javascript' : rel.endsWith('.png') ? 'image/png' : 'font/ttf';
      return route.fulfill({ contentType: type, body: readFileSync(join(ROOT, rel)), headers: { 'access-control-allow-origin': '*' } });
    }
    if (url.includes('cdnjs.cloudflare.com/ajax/libs/jspdf/')) return route.fulfill({ contentType: 'application/javascript', body: readFileSync(join(ROOT, 'node_modules/jspdf/dist/jspdf.umd.min.js')) });
    if (url.startsWith('https://fonts.googleapis.com/')) return route.fulfill({ contentType: 'text/css', body: fontCss });
    return route.abort();
  });
  const p = await ctx.newPage();
  p.on('pageerror', e => errors.push('pageerror: ' + e.message));
  p.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
  return { ctx, p, gas: S.gas, errors };
}

export const DESKTOP = { viewport: { width: 1280, height: 860 }, acceptDownloads: true };
export const MOBILE = { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, acceptDownloads: true };
export const pdfBytes = (blob) => Buffer.from(blob.bytes.map(b => (b < 0 ? b + 256 : b)));

// Launch Chromium; if the browser for this Playwright version isn't installed, fall back to any
// headless shell found in PLAYWRIGHT_BROWSERS_PATH (CI / sandbox convenience).
export async function launchBrowser(chromium) {
  try { return await chromium.launch(); } catch (e) {
    const base = process.env.PLAYWRIGHT_BROWSERS_PATH || '/opt/pw-browsers';
    const dirs = existsSync(base) ? readdirSync(base).filter(d => d.startsWith('chromium_headless_shell-')).sort().reverse() : [];
    for (const d of dirs) {
      for (const sub of ['chrome-linux', 'chrome-headless-shell-linux64']) {
        for (const exe of ['headless_shell', 'chrome-headless-shell']) {
          const p = join(base, d, sub, exe);
          if (existsSync(p)) return chromium.launch({ executablePath: p });
        }
      }
    }
    throw e;
  }
}
