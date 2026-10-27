# Adizes · Express Diagnostics, Engagement Survey & Admin

Organizational assessments run by the Adizes Institute for client companies. In the **admin** (an Apps Script
web app, adizes.com accounts only) we create a company, its employees and a **launch** of a test; each
participant answers on adizes.com with a **personal link** and only sees a thank-you. When enough people have
answered, the admin generates the **group report** (PDF, in the browser), saves it to Drive and emails it.
No Zapier / HubSpot. Founder Dependency is unrelated and lives in [Adizes/assessments](https://github.com/Adizes/assessments).

| Assessment | Folder | Backend | Status |
|---|---|---|---|
| Express Diagnostics | `express-diagnostics/` | `apps-script/Code.gs` | v1.0.0 — 67 statements, group report with names, min. 1 |
| Engagement Survey | `engagement-survey/` | `apps-script/Code.gs` | next stage — anonymous, min. 5, results by area |
| Admin | `admin/` | embedded in `apps-script/Code.gs` | v1.0.0 — companies, employees, launches, invitations, reports |

Express Diagnostics, Engagement Survey and the admin share one Apps Script project (`apps-script/`)
and one data spreadsheet, created by `setup()`. Deployment steps: `apps-script/README.md`.

## Structure

```
shared/                   ← code used by several tools
  core.js, ui.css         ← browser utilities + base styles (white / black / Adizes red, Montserrat)
  ed-engine.js            ← Express Diagnostics scoring (same file runs in the widget, admin and Apps Script)
  pdfkit.js, ed-report.js ← jsPDF helpers + Express Diagnostics group report (rendered in the admin)
  assets/                 ← logos (two-tone), arrows, Montserrat
  test/                   ← Apps Script simulator + browser-test harness
express-diagnostics/
  src/i18n/en.js, es.js   ← all texts incl. the 67 statements (+ zone wordings)
  src/app.js, styles.css  ← participant widget (personal link → statements → thank-you)
  dist/                   ← built file that Webflow loads (don't edit by hand)
  LEGACY.md               ← legacy scoring rules, golden case, content changes
  EMBED.html              ← code to paste into Webflow
admin/
  src/admin.html/.css/.js ← admin single-page app (Spanish), served by Apps Script
  test/e2e.test.mjs       ← full journey: admin → participants → report (desktop + mobile)
apps-script/
  src/*.gs                ← backend sources (model, participant API, admin API, emails, setup)
  Code.gs                 ← GENERATED: backend + admin page, to paste into Apps Script (npm run build)
  test/gas.test.mjs       ← the real Code.gs in Node with simulated Google services
```

## Developing

```bash
npm install
npm run build     # participant bundle(s) + apps-script/Code.gs (with the admin inside)
npm test          # engine golden case + backend tests + Playwright desktop/mobile (screenshots/PDFs in admin/test/out)
```

### Add a language
1. Copy `express-diagnostics/src/i18n/en.js` to e.g. `pt.js`, change `ED_I18N.en` to `ED_I18N.pt` and
   translate the texts (keep the order of `questions`).
2. In `apps-script/src/00-config.gs`, copy the `en` block inside `LABELS` as `pt` and translate it (emails).
3. `npm run build`, commit, create a new release and update the version in the Webflow embed.

### Publish a new version
1. Change `version` in `package.json`, run `npm run build` and `npm test`, then commit.
2. Create a release/tag on GitHub (e.g. `v1.0.1`).
3. In Webflow, change the version in the script URL (`@v1.0.1`) and publish.
4. If `apps-script/Code.gs` changed: paste it into Apps Script → Deploy → Manage deployments → ✏️ → New version
   (see `apps-script/README.md`).
