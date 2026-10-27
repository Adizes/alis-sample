# Adizes · Express Diagnostics, Engagement Survey & Admin

Interactive assessments for adizes.com (Webflow). Each one is **a single JavaScript file** served by
jsDelivr from this repo, plus one shared Google Apps Script backend that saves responses to Google
Sheets and emails the PDF reports. No Zapier / HubSpot. Founder Dependency lives in
[Adizes/assessments](https://github.com/Adizes/assessments); the admin reads its sheet (read-only).

| Assessment | Folder | Backend | Status |
|---|---|---|---|
| Express Diagnostics | `express-diagnostics/` | shared project `apps-script/Code.gs` (no HubSpot) | v1.0.0 — individual, free report |
| Engagement Survey | `engagement-survey/` | shared project `apps-script/Code.gs` | stage 2 |
| Admin | `admin/` | shared project `apps-script/Code.gs` | stage 2–3 |

Express Diagnostics, Engagement Survey and the admin share one Apps Script project (`apps-script/`)
and one data spreadsheet, created by `setup()`. Deployment steps: `apps-script/README.md`.

## Structure

```
shared/                   ← code used by several tools
  core.js, ui.css         ← browser utilities + base styles (white / black / Adizes red, Montserrat)
  ed-engine.js            ← Express Diagnostics scoring (same file runs in the widget, admin and Apps Script)
  pdfkit.js, ed-report.js ← jsPDF helpers + Express Diagnostics report
  assets/                 ← logos (two-tone), arrows, Montserrat
  test/                   ← Apps Script simulator + browser-test harness
express-diagnostics/
  src/i18n/en.js, es.js   ← all texts incl. the 67 statements (+ zone wordings)
  src/app.js, styles.css  ← widget
  dist/                   ← built file that Webflow loads (don't edit by hand)
  LEGACY.md               ← legacy scoring rules, golden case, content changes
  EMBED.html              ← code to paste into Webflow
apps-script/
  src/*.gs                ← backend sources
  Code.gs                 ← GENERATED backend to paste into Apps Script (npm run build)
```

## Developing

```bash
npm install
npm run build     # Express Diagnostics bundle + apps-script/Code.gs
npm test          # engine golden case + backend tests + Playwright desktop/mobile (screenshots/PDFs in express-diagnostics/test/out)
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
