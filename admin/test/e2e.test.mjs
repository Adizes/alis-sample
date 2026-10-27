// End-to-end (Playwright/Chromium), desktop + mobile, against the REAL Code.gs (simulated Google services):
// admin creates a company, employees and an Express Diagnostics launch → participants answer with their
// personal links → the launch becomes Ready → the admin generates the group PDF and sends it.
// node admin/test/e2e.test.mjs   → screenshots + PDFs in admin/test/out/
import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import { startServers, webflowPage, newPage, launchBrowser, adminPage, DESKTOP, MOBILE, pdfBytes } from '../../shared/test/harness.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, 'out'); mkdirSync(out, { recursive: true });
const S = await startServers();
const edPage = (cfg) => webflowPage({ title: 'Express Diagnostics', mountId: 'ed-assessment', configVar: 'ED_CONFIG', cfg, script: 'express-diagnostics/dist/express-diagnostics.min.js' });
const GOLDEN = [
  1, 4, 4, 3, 4, 3, 2, 1, 2, 4, 3, 2, 1, 3, 4, 4, 1, 3, 2, 2,
  2, 5, 5, 3, 5, 4, 3, 4, 4, 4, 2, 5, 3, 3, 2, 5, 3, 4, 4,
  2, 4, 3, 5, 2, 5, 3, 5, 4, 2, 1, 2, 5, 3, 3, 3, 5, 1, 2,
  4, 2, 5, 3, 2, 1, 2, 4, 3,
];
const TEAM = [GOLDEN, GOLDEN.map(v => (v === 1 ? 3 : v)), GOLDEN.map((v, i) => (i % 2 ? 5 : 2)), GOLDEN.map((v, i) => (i % 3 ? 4 : 3))];
const browser = await launchBrowser(chromium);
const shot = (p, name, full) => p.screenshot({ path: join(out, name + '.png'), fullPage: !!full });
const noErrors = (errors) => assert.equal(errors.filter(e => !/favicon/.test(e)).length, 0, errors.join('\n'));
const settle = (p) => p.waitForFunction(() => !document.querySelector('.busy')).then(() => p.waitForTimeout(250));

console.log('Admin + Express Diagnostics journey (Chromium, Webflow-like CSS for the participant page)');

/* ---------------- 1) admin: company, employees, launch ---------------- */
let links = [];
{
  const { ctx, p, errors } = await newPage(S, browser, DESKTOP, adminPage());
  await p.goto(S.SITE + '/admin');
  await p.waitForSelector('.adm-main'); await p.evaluate(() => document.fonts.ready);
  await shot(p, 'admin-1-empty');
  await p.click('[data-act="new-company"]');
  await p.fill('.modal [name="name"]', 'Grupo Ñandú');
  await p.fill('.modal [name="country"]', 'México');
  await p.fill('.modal [name="contactName"]', 'Laura Ríos');
  await p.fill('.modal [name="contactEmail"]', 'laura@nandu.mx');
  await p.click('.modal button[type="submit"]');
  await p.waitForSelector('[data-act="new-launch"]'); await settle(p);
  await p.click('[data-act="import"]');
  await p.fill('.modal [name="rows"]', [
    'Ana López\tana@nandu.mx\tVentas\tDirectora',
    'Bruno Díaz\tbruno@nandu.mx\tOperaciones\tGerente',
    'Carla Méndez, carla@nandu.mx, Finanzas, CFO',
    'Diego Ruiz, diego@nandu.mx, Ventas',
    'Eva Soto, eva@nandu.mx, Recursos Humanos, Directora',
    'sin correo, Ventas',
  ].join('\n'));
  assert.match(await p.textContent('.modal [data-count]'), /5 fila/);
  await p.click('.modal button[type="submit"]'); await settle(p);
  assert.equal(await p.locator('[data-edit-emp]').count(), 5);
  await shot(p, 'admin-2-company');
  // new launch: Express Diagnostics, 4 of the 5 employees
  await p.click('[data-act="new-launch"]');
  await p.fill('.modal [name="name"]', 'Equipo directivo · Nov 2026');
  await p.fill('.modal [name="closeDate"]', '2099-11-30');
  assert.equal(await p.inputValue('.modal [name="recipients"]'), 'laura@nandu.mx');
  await p.uncheck('.modal .pick label:has-text("Eva Soto") input');
  await p.waitForTimeout(150);
  await shot(p, 'admin-3-new-launch');
  await p.click('.modal button[type="submit"]');
  await p.waitForSelector('[data-act="open-send"]'); await settle(p);
  await shot(p, 'admin-4-draft');
  await p.click('[data-act="open-send"]'); await p.click('.modal button[type="submit"]');
  await p.waitForSelector('[data-act="remind"]'); await settle(p);
  await shot(p, 'admin-5-open', true);
  links = await p.$$eval('[data-copy]', bs => bs.map(b => b.getAttribute('data-copy')));
  assert.equal(links.length, 4);
  assert.equal(S.gas.state.emails.length, 4);
  assert.ok(S.gas.state.emails.every(m => m.options.from === 'info@adizes.com'));
  noErrors(errors);
  await ctx.close();
  console.log('  ✓ admin: company, 5 employees imported, launch for 4, invitations sent');
}
const tokenOf = (link) => new URL(link).searchParams.get('t');

/* ---------------- 2) participants ---------------- */
async function participant(device, link, answers, name, lang) {
  const { ctx, p, errors } = await newPage(S, browser, device, edPage({ endpoint: S.ENDPOINT }), null, true);
  await p.goto(S.SITE + '/express-diagnostics?t=' + tokenOf(link) + (lang ? '&lang=' + lang : ''));
  await p.waitForSelector('[data-act="start"]'); await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(400);
  await shot(p, name + '-1-intro');
  await p.click('[data-act="start"]');
  for (let i = 0; i < 67; i++) {
    try { await p.waitForFunction((n) => window.EDA.app.state.step === n && !window.EDA.app.busy, i, { timeout: 8000 }); }
    catch (e) { await shot(p, name + '-FAIL-' + i); console.log('state', await p.evaluate(() => JSON.stringify({ s: window.EDA.app.state, v: window.EDA.app.view })), errors); throw e; }
    const v = answers[i];
    if (v === 1) await p.keyboard.press('0');
    else if (i % 2) await p.keyboard.press(String(v - 1));
    else await p.click(`.adz-opt[data-v="${v}"]`);
    if (i === 30) { await p.waitForTimeout(350); await shot(p, name + '-2-statement'); }
  }
  await p.waitForSelector('[data-act="submit"]'); await p.waitForTimeout(350);
  await shot(p, name + '-3-review');
  await p.click('[data-act="submit"]');
  await p.waitForSelector('.adz-msg--done'); await p.waitForTimeout(350);
  await shot(p, name + '-4-thanks');
  // the same link again → "already answered"
  await p.reload(); await p.waitForSelector('.adz-msg'); await p.waitForTimeout(300);
  assert.match(await p.textContent('.adz-msg'), /Ya respondiste|already answered/);
  noErrors(errors);
  await ctx.close();
}
await participant(DESKTOP, links[0], TEAM[0], 'participant-desktop-es');
console.log('  ✓ participant (desktop, ES): intro with name/company → 67 statements → review → thanks; link then shows "already answered"');
await participant(MOBILE, links[1], TEAM[1], 'participant-mobile-en', 'en');
console.log('  ✓ participant (mobile, EN)');
// the other two answer through the API (same calls the widget makes)
for (const i of [2, 3]) assert.equal(S.gas.post({ action: 'p_submit', t: tokenOf(links[i]), answers: TEAM[i] }).ok, true);
assert.equal(S.gas.admin('state').launches[0].status, 'Ready');
assert.ok(S.gas.state.emails.some(m => /^\[Listo para reporte\]/.test(m.subject)));
console.log('  ✓ 4/4 answered → Ready, admins notified');

/* participant edge cases */
{
  const { ctx, p, errors } = await newPage(S, browser, MOBILE, edPage({ endpoint: S.ENDPOINT }), null, true);
  await p.goto(S.SITE + '/express-diagnostics');
  await p.waitForSelector('.adz-msg'); assert.match(await p.textContent('.adz-msg'), /personal link|enlace personal/);
  await p.goto(S.SITE + '/express-diagnostics?t=ZZZZZZZZZZZZZZZZZZZZZZZZ&lang=es');
  await p.waitForSelector('.adz-msg'); await p.waitForTimeout(300);
  assert.match(await p.textContent('.adz-msg'), /no es válido/);
  await shot(p, 'participant-invalid-link');
  noErrors(errors.filter(e => !/invalid_link/.test(e)));
  await ctx.close();
  console.log('  ✓ participant: no link / invalid link messages');
}

/* ---------------- 3) admin: report ---------------- */
for (const [device, tag] of [[DESKTOP, 'desktop'], [MOBILE, 'mobile']]) {
  const { ctx, p, errors } = await newPage(S, browser, device, adminPage(), null, true);
  await p.goto(S.SITE + '/admin#/launches');
  await p.waitForSelector('[data-st]');
  if (tag === 'mobile') await p.selectOption('[data-st]', 'all'); // the report was already sent → not "in progress"
  await p.waitForSelector('.tbl'); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(300);
  await shot(p, 'admin-6-launches-' + tag);
  await p.click('.tbl tr.is-click');
  await p.waitForSelector('[data-act="generate"]'); await settle(p);
  if (tag === 'desktop') {
    await shot(p, 'admin-7-ready-desktop', true);
    await p.click('[data-act="generate"]');
    await p.waitForSelector('.pdf-ok', { timeout: 30000 }); await settle(p);
    const pdf = pdfBytes(S.gas.state.files[0].blob);
    writeFileSync(join(out, 'team-report.pdf'), pdf);
    assert.equal(pdf.slice(0, 4).toString(), '%PDF');
    await p.fill('[data-send-form] [name="note"]', 'Lo revisamos juntos el jueves.');
    await p.click('[data-send-form] button[type="submit"]');
    await p.click('.modal button[type="submit"]'); await settle(p);
    await shot(p, 'admin-8-sent-desktop', true);
    const mail = S.gas.state.emails[S.gas.state.emails.length - 1];
    assert.equal(mail.to, 'laura@nandu.mx'); assert.equal(mail.options.attachments.length, 1);
    assert.equal(S.gas.admin('state').launches[0].status, 'Report sent');
    console.log(`  ✓ admin (desktop): report generated in the browser (${(pdf.length / 1024).toFixed(0)} KB), saved to Drive, emailed to laura@nandu.mx`);
  } else {
    await shot(p, 'admin-7-launch-mobile', true);
    await p.click('.adm-crumbs a:nth-child(2)'); await p.waitForSelector('[data-act="new-emp"]'); await p.waitForTimeout(300);
    await shot(p, 'admin-9-company-mobile', true);
    console.log('  ✓ admin (mobile): launches, launch and company pages');
  }
  noErrors(errors);
  await ctx.close();
}

/* ---------------- 4) access control in the page ---------------- */
{
  const { ctx, p } = await newPage(S, browser, DESKTOP, adminPage(), null, true);
  S.gas.state.activeUser = 'otro@adizes.com';
  await p.goto(S.SITE + '/admin');
  await p.waitForSelector('.adm-boot .card');
  assert.match(await p.textContent('.adm-boot'), /No tienes acceso/);
  S.gas.state.activeUser = 'dario@adizes.com';
  await ctx.close();
  console.log('  ✓ a non-admin account gets nothing from the server');
}

await browser.close();
S.close();
console.log('\nAll browser tests passed. Screenshots and PDFs in admin/test/out/');
