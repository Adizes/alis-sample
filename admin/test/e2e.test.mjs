// End-to-end (Playwright/Chromium), desktop + mobile, against the REAL Code.gs (simulated Google services):
// sign-in with an emailed code → company + employees → one launch of each test → participants answer with
// their personal links (review screen, importance, comments) → Ready → group PDFs generated in the admin and sent.
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
const esPage = (cfg) => webflowPage({ title: 'Engagement Survey', mountId: 'es-survey', configVar: 'ES_CONFIG', cfg, script: 'engagement-survey/dist/engagement-survey.min.js' });
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
const tokenOf = (link) => new URL(link).searchParams.get('t');

console.log('Admin + both tests (Chromium; participant pages with Webflow-like CSS)');

/* ---------------- 1) sign in + company + employees + launches ---------------- */
let edLinks = [], esLinks = [];
{
  const { ctx, p, errors } = await newPage(S, browser, DESKTOP, adminPage());
  S.gas.state.activeUser = '';   // like an account Google doesn't identify → code sign-in
  await p.goto(S.SITE + '/admin');
  await p.waitForSelector('.login-card'); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(200);
  await shot(p, 'admin-0-signin');
  await p.fill('.login-card [name="email"]', 'Dario@Adizes.com');
  await p.click('.login-card button[type="submit"]');
  await p.waitForSelector('.login-card [name="code"]');
  const code = S.gas.state.emails[0].subject.match(/(\d{6})$/)[1];
  await p.fill('.login-card [name="code"]', code);
  await p.click('.login-card button[type="submit"]');
  await p.waitForSelector('.adm-main'); await settle(p);
  assert.match(await p.textContent('.adm-me'), /dario@adizes\.com/);
  await shot(p, 'admin-1-empty');
  await p.click('[data-act="new-company"]');
  await p.fill('.modal [name="name"]', 'Grupo Ñandú');
  await p.fill('.modal [name="country"]', 'Mexico');
  await p.selectOption('.modal [name="language"]', 'es');
  await p.fill('.modal [name="contactName"]', 'Laura Ríos');
  await p.fill('.modal [name="contactEmail"]', 'laura@nandu.mx');
  await p.waitForTimeout(150); await shot(p, 'admin-2-company-form');
  await p.click('.modal button[type="submit"]');
  await p.waitForSelector('[data-new-launch="ED"]'); await settle(p);
  // no employees yet → the Engagement Survey can't be launched (needs 5 for anonymity)
  await p.click('[data-new-launch="ES"]'); await p.waitForTimeout(150);
  assert.match(await p.textContent('.modal'), /at least 5 active employees/);
  assert.equal(await p.locator('.modal [name="name"]').count(), 0);
  await shot(p, 'admin-3-es-needs-5'); await p.click('.modal [data-x]');
  await p.click('[data-act="new-emp"]'); await p.waitForTimeout(150); await shot(p, 'admin-3-employee-form'); await p.click('.modal [data-x]');
  await p.click('[data-act="import"]');
  await p.fill('.modal [name="rows"]', [
    'Ana López\tana@nandu.mx\tVentas\tDirectora', 'Bruno Díaz\tbruno@nandu.mx\tOperaciones\tGerente',
    'Carla Méndez, carla@nandu.mx, Finanzas, CFO', 'Diego Ruiz, diego@nandu.mx, Ventas', 'Eva Soto, eva@nandu.mx, Ventas, Ejecutiva',
    'Fer Gil, fer@nandu.mx, Ventas', 'Gabi Paz, gabi@nandu.mx, Ventas', 'Hugo Rey, hugo@nandu.mx, Operaciones', 'no email, Ventas',
  ].join('\n'));
  assert.match(await p.textContent('.modal [data-count]'), /8 row/);
  await p.click('.modal button[type="submit"]'); await settle(p);
  assert.equal(await p.locator('[data-edit-emp]').count(), 8);
  await shot(p, 'admin-4-company', true);
  // Express Diagnostics (Spanish) for the 4 directors/managers
  await p.click('[data-new-launch="ED"]');
  assert.equal(await p.isChecked('.modal input[name="type"][value="ED"]'), true);
  await p.fill('.modal [name="name"]', 'Equipo directivo · Nov 2026');
  await p.fill('.modal [name="closeDate"]', '2099-11-30');
  assert.equal(await p.inputValue('.modal [name="recipients"]'), 'laura@nandu.mx');
  await p.click('.modal [data-none]');
  for (const n of ['Ana López', 'Bruno Díaz', 'Carla Méndez', 'Diego Ruiz']) await p.check(`.modal .pick label:has-text("${n}") input`);
  await p.waitForTimeout(150); await shot(p, 'admin-5-launch-form');
  await p.click('.modal button[type="submit"]');
  await p.waitForSelector('[data-act="open-send"]'); await settle(p);
  await p.click('[data-act="open-send"]'); await p.click('.modal button[type="submit"]');
  await p.waitForSelector('[data-act="remind"]'); await settle(p);
  edLinks = await p.$$eval('[data-copy]', bs => bs.map(b => b.getAttribute('data-copy')));
  assert.equal(edLinks.length, 4);
  // Engagement Survey (English) for all 8
  await p.click('.adm-crumbs a:nth-child(2)'); await p.waitForSelector('[data-new-launch="ES"]');
  await p.click('[data-new-launch="ES"]');
  await p.selectOption('.modal [name="language"]', 'en');
  await p.fill('.modal [name="name"]', 'Engagement 2026');
  assert.equal(await p.isHidden('.modal [data-min]'), true, 'minimum responses does not apply to ES');
  await p.waitForTimeout(150); await shot(p, 'admin-5-es-launch-form');
  await p.click('.modal button[type="submit"]');
  await p.waitForSelector('[data-act="open-send"]'); await settle(p);
  await p.click('[data-act="open-send"]'); await p.click('.modal button[type="submit"]');
  await p.waitForSelector('[data-act="remind"]'); await settle(p);
  await shot(p, 'admin-5-es-open', true);
  esLinks = await p.$$eval('[data-copy]', bs => bs.map(b => b.getAttribute('data-copy')));
  assert.equal(esLinks.length, 8);
  assert.ok(esLinks.every(l => /engagement-survey\?t=/.test(l)));
  const inv = S.gas.state.emails.filter(m => /^Grupo Ñandú:/.test(m.subject));
  assert.equal(inv.filter(m => m.subject === 'Grupo Ñandú: Diagnóstico Exprés').length, 4, 'ED invitations in Spanish');
  assert.equal(inv.filter(m => m.subject === 'Grupo Ñandú: Engagement Survey').length, 8, 'ES invitations in English');
  await p.click('.adm-nav a[href="#/launches"]'); await p.waitForSelector('.tabs'); await settle(p);
  await shot(p, 'admin-6-launches');
  noErrors(errors);
  await ctx.close();
  S.gas.state.activeUser = 'dario@adizes.com';
  console.log('  ✓ admin: code sign-in, company, 8 employees, ED launch (es, 4 people) + ES launch (en, 8 people), invitations sent');
}

/* ---------------- 2) Express Diagnostics participants ---------------- */
async function edParticipant(device, link, answers, name) {
  const { ctx, p, errors } = await newPage(S, browser, device, edPage({ endpoint: S.ENDPOINT }), null, true);
  await p.goto(S.SITE + '/express-diagnostics?t=' + tokenOf(link));
  await p.waitForSelector('[data-act="start"]'); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(300);
  assert.match(await p.textContent('.adz-h1'), /quiere conocer tu visión/, 'launch language (es) wins over the browser');
  await shot(p, name + '-1-intro');
  await p.click('[data-act="start"]');
  for (let i = 0; i < 67; i++) {
    await p.waitForFunction((n) => window.EDA.app.state.step === n && !window.EDA.app.busy, i);
    const v = answers[i];
    if (v === 1) await p.keyboard.press('0'); else if (i % 2) await p.keyboard.press(String(v - 1)); else await p.click(`.adz-opt[data-v="${v}"]`);
  }
  await p.waitForSelector('.adz-rv'); await p.waitForTimeout(300);
  await shot(p, name + '-2-review', true);
  // change Q3 from the review list and come straight back
  await p.click('.adz-rv-row[data-q="2"]');
  await p.waitForSelector('[data-act="toreview"]');
  await p.click('.adz-opt[data-v="2"]');
  await p.waitForSelector('.adz-rv'); await p.waitForTimeout(200);
  assert.equal(await p.evaluate(() => window.EDA.app.state.answers[2]), 2);
  assert.match(await p.textContent('.adz-rv-row[data-q="2"] .adz-rv-a'), /Nunca/);
  await p.click('.adz-rv-actions [data-act="submit"] >> nth=0');
  await p.waitForSelector('.adz-msg--done'); await p.waitForTimeout(300);
  await shot(p, name + '-3-thanks');
  noErrors(errors);
  await ctx.close();
}
await edParticipant(DESKTOP, edLinks[0], TEAM[0], 'ed-desktop');
await edParticipant(MOBILE, edLinks[1], TEAM[1], 'ed-mobile');
for (const i of [2, 3]) assert.equal(S.gas.post({ action: 'p_submit', t: tokenOf(edLinks[i]), answers: TEAM[i] }).ok, true);
console.log('  ✓ Express Diagnostics: 2 participants in the browser (desktop/mobile) with review → edit → back to review; 4/4 → Ready');

/* ---------------- 3) Engagement Survey participants ---------------- */
async function esParticipant(device, link, name, pattern) {
  const { ctx, p, errors } = await newPage(S, browser, device, esPage({ endpoint: S.ENDPOINT }), null, true);
  await p.goto(S.SITE + '/engagement-survey?t=' + tokenOf(link));
  await p.waitForSelector('[data-act="start"]'); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(300);
  assert.match(await p.textContent('.adz-h1'), /wants to hear from you/);
  await shot(p, name + '-1-intro');
  await p.click('[data-act="start"]');
  for (let i = 0; i < 50; i++) {
    await p.waitForFunction((n) => window.ESA.app.state.step === n, i);
    const nOpts = await p.locator('.adz-opt').count();
    const k = pattern(i, nOpts);
    if (k === 0) await p.keyboard.press('0'); else await p.keyboard.press(String(k));
    await p.waitForSelector('[data-act="next"]');
    if (i < 3 || i === 45) await p.click('[data-imp="3"]');
    if (i === 6) { await p.click('[data-act="comment"]'); await p.fill('.adz-com-ta', 'More recognition between teams would help.'); }
    if (i === 6 || i === 4) { await p.waitForTimeout(250); await shot(p, name + '-2-q' + (i + 1)); }
    await p.click('[data-act="next"]');
  }
  await p.waitForSelector('.adz-rv'); await p.waitForTimeout(300);
  await shot(p, name + '-3-review', true);
  assert.equal(await p.locator('.adz-tag.is-most').count(), 4);
  await p.click('.adz-rv-actions [data-act="submit"] >> nth=0');
  await p.waitForSelector('.adz-msg--done'); await p.waitForTimeout(300);
  await shot(p, name + '-4-thanks');
  noErrors(errors);
  await ctx.close();
}
await esParticipant(DESKTOP, esLinks[0], 'es-desktop', (i, n) => (n === 5 ? 4 : i % 7 === 0 ? 0 : 4));
await esParticipant(MOBILE, esLinks[1], 'es-mobile', (i, n) => (n === 5 ? 3 : (i % 3) + 2));
// Q5 is reversed: the 4th option ("Always") must be stored as 2
{
  const sh = S.gas.state.sheets['ES Answers'];
  const vals = sh.rows.slice(1).map(r => r[sh.heads().indexOf('Q5')]);
  assert.ok(vals.includes(2), 'Q5 "Always" stored as 2 (negative statement)');
}
const imp = (k) => Array.from({ length: 50 }, (_, i) => (i < k ? 3 : 1));
const es = (v) => { const a = Array(50).fill(v); a[49] = 4; return a; };
[[5, 2], [4, 3], [2, 2], [5, 5], [4, 1], [3, 2]].forEach(([v, k], j) => {
  const com = Array(50).fill(''); if (j === 1) com[0] = 'Leaders should explain decisions more often.';
  assert.equal(S.gas.post({ action: 'p_submit', t: tokenOf(esLinks[j + 2]), answers: es(v), importance: imp(k), comments: com }).ok, true);
});
console.log('  ✓ Engagement Survey: 2 participants in the browser (importance, comment, review), 6 by API → 8/8 → Ready');
assert.equal(S.gas.admin('state').launches.filter(l => l.status === 'Ready').length, 2);

/* ---------------- 4) admin: both reports ---------------- */
{
  const { ctx, p, errors } = await newPage(S, browser, DESKTOP, adminPage(), null, true);
  await p.goto(S.SITE + '/admin#/launches');
  await p.waitForSelector('.tabs'); await settle(p);
  for (const [type, file] of [['ED', 'report-express-diagnostics.pdf'], ['ES', 'report-engagement-survey.pdf']]) {
    await p.click(`.tab[data-ty="${type}"]`); await p.waitForTimeout(200);
    await p.click('.tbl tr.is-click');
    await p.waitForSelector('[data-act="generate"]'); await settle(p);
    const before = S.gas.state.files.length;
    await p.click('[data-act="generate"]');
    await p.waitForSelector('.pdf-ok', { timeout: 30000 }); await settle(p);
    assert.equal(S.gas.state.files.length, before + 1);
    writeFileSync(join(out, file), pdfBytes(S.gas.state.files[before].blob));
    await p.fill('[data-send-form] [name="note"]', 'See you on Thursday.');
    await p.click('[data-send-form] button[type="submit"]');
    await p.click('.modal button[type="submit"]'); await settle(p);
    await shot(p, 'admin-7-' + type + '-sent', true);
    const mail = S.gas.state.emails[S.gas.state.emails.length - 1];
    assert.equal(mail.to, 'laura@nandu.mx'); assert.equal(mail.options.attachments.length, 1);
    assert.equal(mail.subject, type === 'ED' ? 'Reporte de Diagnóstico Exprés — Grupo Ñandú' : 'Engagement Survey report — Grupo Ñandú');
    await p.click('.adm-nav a[href="#/launches"]'); await p.waitForSelector('.tabs'); await settle(p);
  }
  noErrors(errors);
  await ctx.close();
  console.log('  ✓ admin: both group reports generated in the browser, saved to Drive and emailed in the launch language');
}

/* ---------------- 5) mobile admin + access control ---------------- */
{
  const { ctx, p, errors } = await newPage(S, browser, MOBILE, adminPage(), null, true);
  await p.goto(S.SITE + '/admin#/');
  await p.waitForSelector('.co-card'); await settle(p);
  await p.click('.co-card'); await p.waitForSelector('[data-act="new-emp"]'); await settle(p);
  await shot(p, 'admin-8-company-mobile', true);
  await p.click('[data-new-launch="ES"]'); await p.waitForTimeout(250);
  await shot(p, 'admin-9-launch-form-mobile');
  noErrors(errors);
  await ctx.close();
}
{
  const { ctx, p } = await newPage(S, browser, DESKTOP, adminPage(), null, true);
  S.gas.state.activeUser = 'otro@adizes.com';
  await p.goto(S.SITE + '/admin');
  await p.waitForSelector('.login-card');
  S.gas.state.activeUser = 'dario@adizes.com';
  await ctx.close();
  console.log('  ✓ mobile admin pages; a non-admin account only gets the sign-in page');
}

await browser.close();
S.close();
console.log('\nAll browser tests passed. Screenshots and PDFs in admin/test/out/');
