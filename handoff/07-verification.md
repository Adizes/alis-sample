# 7 · Verifying your implementation

## Test vectors

`data/test-vectors/` holds inputs with the exact outputs of the reference engines. Numbers are rounded to 6 decimals, so compare with a tolerance of 1e-6.

### `express-diagnostics.json`

| Case | Input | Check |
|---|---|---|
| Golden | One real respondent (67 raw answers) reconstructed from a legacy s.adizes.com PDF | Every statement's `color`, `zone`, `border`; every cell's `percent`, `color` |
| Group of 5 | 5 deterministic respondents | All question and cell fields, including dispersion and borders |
| Mode rule | Q1 answers `[5,5,4,1]` | n = 3, middle = 4 (unique mode), dispersion 0.57735 |
| No unique mode | Q1 answers `[5,4]` | middle = 3.146447 (mean − σ/2), dispersion 0.707107 |

Golden cell values (67-statement bank):

| Cell | Value | Cell | Value |
|---|---|---|---|
| Values | 50.0% yellow | Client interface | 55.0% yellow |
| Climate | 37.5% red | Transformation | 70.0% yellow |
| Responsibility | 40.0% red | Human factors | 41.7% red |
| Authority | 50.0% yellow | Financial factors | 62.5% yellow |
| Reward | 25.0% red | Behaviour | 12.5% red |
| Planning | 72.5% yellow | Changes | 62.5% yellow |
| Information | 50.0% yellow | Inefficiency | 12.5% red |
| Corrective | 75.0% green | Ineffectiveness | 50.0% yellow |

The legacy PDF was produced when blank slots 68–72 still existed, so its Planning (70.5%) and Transformation (58.3%) differ from the values above. With those 5 extra answers, the reference reproduces the legacy PDF exactly (`source/express-diagnostics/test/engine.test.mjs`).

### `engagement-survey.json`

- `classification`: 6 respondents, one for each branch of the rule (fully, engaged, somewhat ×2, disengaged, and a case where “Don't know” dilutes the percentages). Compare `level`, `all45`, `all23`, `most45`, `most23`.
- `aggregate`: 15 respondents (Sales 6, Operations 5, Finance 2, HR 1, no area 1). Compare:
  - `overall` (counts, %, positive KPI);
  - `areas`: only Operations and Sales;
  - `other`: not shown, 4 hidden;
  - `cats`: 15 factors with middle, dispersion, percent, colour;
  - `top`;
  - per-question `dist` and `mostPct`.

## Acceptance checklist

**Content**
- [ ] ED 67 statements and ES 50 questions in the original order, in every language (English, Spanish, Latvian, Lithuanian), matching `data/*.json`
- [ ] Raw values stored exactly as specified (ED 1–5 with 1 = cannot answer; ES 5 = always positive, Q5/Q45 reversed, Q50 no don't-know)
- [ ] ES importance stored 1–3; between 1 and 15 marked “Most important”

**Scoring**
- [ ] Both test-vector files pass
- [ ] ED report wording: statement / zone 2 / zone 3 chosen by the statement's middle; zone 0 shows the base wording with “no answer”
- [ ] ES factors exclude Q50

**Rules**
- [ ] ED report from 1 response (or the launch minimum); ES only from 5
- [ ] ES launch requires ≥ 5 active employees and ≥ 5 participants; participants can't drop below 5
- [ ] ES areas with < 5 responses never shown alone; pooled “Other areas” only if ≥ 5
- [ ] ES responses contain no person or invitation identifiers; no time of day; order not traceable
- [ ] A token can submit once; only while the launch is Open
- [ ] The launch language drives invitation, survey, thank-you and report
- [ ] Auto-Ready on last answer or close date (with minimum); a single notice when the date passes below the minimum

**Reports**
- [ ] ED and ES PDFs match the structure of `samples/` in both languages
- [ ] Generated reports are stored and can be emailed to chosen recipients with an optional message

**Participant UI**
- [ ] One item per screen, progress by section, keyboard shortcuts, autosave/resume, review list with click-to-edit, thank-you only (no results)

## Re-running the reference locally

```bash
git clone https://github.com/Adizes/alis-sample && cd alis-sample
npm install
npm test                          # engines, backend (Apps Script mocked) and full browser journey
node tools/export-handoff.mjs     # regenerates data/, question tables and test vectors
node tools/sample-reports.mjs     # regenerates the sample PDFs
```
