// Browser tests (Playwright/Chromium), desktop + mobile, against the REAL Code.gs (simulated).
// node express-diagnostics/test/e2e.test.mjs   → screenshots + PDFs in express-diagnostics/test/out/
import { chromium } from 'playwright';
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import { startServers, webflowPage, newPage, launchBrowser, DESKTOP, MOBILE, pdfBytes } from '../../shared/test/harness.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, 'out'); mkdirSync(out, { recursive: true });
const S = await startServers();
const html = (cfg) => webflowPage({ title: 'Express Diagnostics', mountId: 'ed-assessment', configVar: 'ED_CONFIG', cfg, script: 'express-diagnostics/dist/express-diagnostics.min.js' });

// Same person as the legacy golden PDF (1 = cannot answer)
const GOLDEN = [
  1, 4, 4, 3, 4, 3, 2, 1, 2, 4, 3, 2, 1, 3, 4, 4, 1, 3, 2, 2,
  2, 5, 5, 3, 5, 4, 3, 4, 4, 4, 2, 5, 3, 3, 2, 5, 3, 4, 4,
  2, 4, 3, 5, 2, 5, 3, 5, 4, 2, 1, 2, 5, 3, 3, 3, 5, 1, 2,
  4, 2, 5, 3, 2, 1, 2, 4, 3,
];
const HEALTHY = GOLDEN.map((v, i) => (i % 7 === 3 ? 4 : 5));

async function waitStep(p, n) { await p.waitForFunction((n) => window.EDA && window.EDA.app.state.step === n && !window.EDA.app.busy, n); await p.waitForTimeout(30); }

async function runFlow(browser, { name, device, lang, answers, shots = true }) {
  const { ctx, p, gas, errors } = await newPage(S, browser, device, html({ endpoint: S.ENDPOINT }));
  await p.goto(S.SITE + '?utm_source=linkedin&utm_campaign=q4');
  await p.waitForSelector('.adz-stage');
  await p.evaluate(() => document.fonts.ready);
  await p.click(`.adz-lang [data-lang="${lang}"]`);
  await p.waitForTimeout(450);
  if (shots) await p.screenshot({ path: join(out, `${name}-1-intro.png`) });
  await p.click('[data-act="start"]');
  await waitStep(p, 0); await p.waitForTimeout(400);
  if (shots) await p.screenshot({ path: join(out, `${name}-2-first.png`) });
  for (let i = 0; i < 67; i++) {
    const v = answers[i];
    if (v === 1) { if (i % 2) await p.keyboard.press('0'); else await p.click('.adz-cannot'); }
    else if (i % 3 === 1) await p.keyboard.press(String(v - 1));
    else await p.click(`.adz-opt[data-v="${v}"]`);
    await waitStep(p, i + 1);
    if (i === 20 && shots) { await p.click('[data-act="back"]'); await waitStep(p, 20); await p.waitForTimeout(400); await p.screenshot({ path: join(out, `${name}-3-answered.png`) });
      assert.equal(await p.getAttribute('.adz-opt[aria-checked="true"]', 'data-v'), String(answers[20])); await p.click('[data-act="next"]'); await waitStep(p, 21); }
  }
  await p.waitForSelector('form.adz-form');
  await p.click('form.adz-form button[type="submit"]');
  assert.equal(await p.locator('.adz-field.has-error').count(), 4);
  await p.waitForTimeout(350);
  if (shots) await p.screenshot({ path: join(out, `${name}-4-gate-errors.png`) });
  await p.fill('#adz-name', lang === 'es' ? 'María José Pérez' : 'John Carter');
  await p.fill('#adz-email', lang === 'es' ? 'maria@empresa.mx' : 'john@acme.com');
  await p.fill('#adz-company', lang === 'es' ? 'Grupo Ñandú' : 'Acme Corp');
  await p.check('input[name="consent"]');
  await p.click('form.adz-form button[type="submit"]');
  await p.waitForSelector('.adz-spinner');
  await p.waitForSelector('.adz-results', { timeout: 15000 });
  await p.waitForFunction(() => ['sent', 'error'].includes(window.EDA.app.state.pdf), null, { timeout: 30000 });
  await p.waitForTimeout(800);
  if (shots) await p.screenshot({ path: join(out, `${name}-5-results.png`), fullPage: true });
  const st = await p.evaluate(() => window.EDA.app.state);
  assert.equal(st.pdf, 'sent');
  assert.deepEqual(st.answers.slice(0, 67), answers);
  assert.equal(await p.locator('[data-act="book"], a[href*="calendly"]').count(), 0);
  const [dl] = await Promise.all([p.waitForEvent('download'), p.click('[data-act="download"]')]);
  writeFileSync(join(out, `${name}-downloaded.pdf`), readFileSync(await dl.path()));
  await p.waitForTimeout(500);
  await p.reload(); await p.waitForSelector('.adz-results');
  assert.equal(errors.filter(e => !/favicon/.test(e)).length, 0, errors.join('\n'));
  await ctx.close();
  return { gas, st };
}

const browser = await launchBrowser(chromium);
console.log('Browser flows (Chromium, Webflow-like CSS)');
for (const f of [
  { name: 'desktop-es', device: DESKTOP, lang: 'es', answers: GOLDEN },
  { name: 'mobile-en', device: MOBILE, lang: 'en', answers: GOLDEN },
  { name: 'desktop-en-healthy', device: DESKTOP, lang: 'en', answers: HEALTHY, shots: true },
]) {
  const { gas } = await runFlow(browser, f);
  const row = gas.state.sheets['ED Responses'].obj(2);
  assert.equal(row['Status'], 'Done'); assert.equal(row['Language'], f.lang); assert.equal(row['UTM Source'], 'linkedin');
  assert.equal(row['PDF Downloads'], 1);
  assert.equal(gas.state.emails.length, 2);
  const pdf = pdfBytes(gas.state.files[0].blob);
  writeFileSync(join(out, `${f.name}-emailed.pdf`), pdf);
  console.log(`  ✓ ${f.name}: ${row['Key Focus Zones']} focus / ${row['To Improve']} improve / ${row['Healthy']} healthy · row Done · emailed PDF ${(pdf.length / 1024).toFixed(0)} KB`);
}

// resume after reload
{
  const { ctx, p, errors } = await newPage(S, browser, DESKTOP, html({ endpoint: S.ENDPOINT }));
  await p.goto(S.SITE);
  await p.click('[data-act="start"]'); await waitStep(p, 0);
  await p.keyboard.press('4'); await waitStep(p, 1);
  await p.keyboard.press('0'); await waitStep(p, 2);
  await p.reload(); await p.waitForSelector('[data-act="yes"]');
  await p.screenshot({ path: join(out, 'desktop-resume.png') });
  await p.click('[data-act="yes"]'); await waitStep(p, 2);
  assert.deepEqual(await p.evaluate(() => window.EDA.app.state.answers), [5, 1]);
  assert.equal(errors.length, 0, errors.join('\n'));
  await ctx.close();
  console.log('  ✓ resume after reload');
}

// server down → retry, then works
{
  const { ctx, p } = await newPage(S, browser, DESKTOP, html({ endpoint: S.ENDPOINT }));
  await p.goto(S.SITE + '?lang=en');
  await p.evaluate((a) => localStorage.setItem('adz-ed:v1', JSON.stringify({ step: 67, answers: a, contact: { name: 'Test User', email: 't@t.co', company: 'T', consent: true }, lang: 'en' })), GOLDEN);
  S.failNext = true;
  await p.reload(); await p.click('[data-act="yes"]');
  await p.click('form.adz-form button[type="submit"]');
  await p.waitForSelector('[data-act="retry"]');
  S.failNext = false;
  await p.click('[data-act="retry"]');
  await p.waitForSelector('.adz-results', { timeout: 15000 });
  await ctx.close();
  console.log('  ✓ server error → retry → results');
}

// demo mode (no endpoint): works end to end, nothing saved
{
  const { ctx, p, errors } = await newPage(S, browser, MOBILE, html({}));
  await p.goto(S.SITE + '?lang=es');
  await p.evaluate((a) => localStorage.setItem('adz-ed:v1', JSON.stringify({ step: 67, answers: a, contact: { name: 'Demo', email: 'd@d.co', company: 'Demo SA', consent: true }, lang: 'es' })), HEALTHY);
  await p.reload(); await p.click('[data-act="yes"]'); await p.click('form.adz-form button[type="submit"]');
  await p.waitForSelector('.adz-results', { timeout: 15000 });
  await p.waitForFunction(() => window.EDA.app.state.pdf === 'sent');
  await p.waitForTimeout(600);
  await p.screenshot({ path: join(out, 'mobile-es-demo-top.png') });
  assert.equal(errors.length, 0, errors.join('\n'));
  await ctx.close();
  console.log('  ✓ demo mode (no backend)');
}

// team report (what the admin will generate): 4 participants with diverging answers → frame styles
{
  const { ctx, p, errors } = await newPage(S, browser, DESKTOP, html({}));
  await p.goto(S.SITE + '?lang=en');
  const team = [GOLDEN, HEALTHY, GOLDEN.map(v => (v === 1 ? 3 : Math.max(2, v - 1))), GOLDEN.map((v, i) => (i % 2 ? 5 : 2))];
  const b64 = await p.evaluate(async (team) => {
    const doc = await window.EDA.teamPdf(team, 'Acme Corp', ['John Carter', 'Ana López', 'Wei Chen', 'Olga Ivanova'], 'en', '2026-10-27T12:00:00Z');
    return doc.output('datauristring').split(',')[1];
  }, team);
  writeFileSync(join(out, 'team-en.pdf'), Buffer.from(b64, 'base64'));
  assert.equal(errors.length, 0, errors.join('\n'));
  await ctx.close();
  console.log('  ✓ team report PDF (4 participants)');
}

await browser.close();
S.close();
console.log('\nAll browser tests passed. Screenshots and PDFs in express-diagnostics/test/out/');
