# 3 · Engagement Survey (ES)

Reference code: `source/shared/es-engine.js` (scoring and aggregation; it reuses `ED.questionStats` from `ed-engine.js` for the factor scores) and `source/shared/es-report.js` (PDF).
Content: `data/engagement-survey.json` and `questions-engagement-survey.md`. The questions JSON already includes the resolved answer options per question and language.

## 3.1 Questionnaire

For each of the **50 questions**, the participant gives:

1. **An answer**, stored as a raw value from 1 to 5. **5 is always the most positive answer.**
2. **An importance level:**
   - `1` Less important (default)
   - `2` Medium
   - `3` Most important

   Between **1 and 15** questions must be marked *Most important*. The UI blocks a 16th and shows a message. Sending is blocked with 0.
3. **An optional comment** (free text, up to 1000 characters, single line when stored). It is shown word for word and anonymously in the report.

### Scales

Each question uses one of six scales. Every option shows both a primary label and a secondary hint, because the legacy data doesn't record which questions were phrased as frequency and which as agreement. Scoring is unaffected.

| Scale | Questions | Options top → bottom (raw value) |
|---|---|---|
| F — frequency | 1–4, 6, 7, 9, 11, 13, 14, 19–25, 27, 31, 32, 34–40, 43, 44, 46, 48 | Never (2) · Sometimes (3) · Often (4) · Always (5) · *Don't know (1)* |
| A — agreement | 8, 10, 12, 15–18, 26, 28–30, 33, 41, 47, 49 | Absolutely disagree (2) · Mostly disagree (3) · Mostly agree (4) · Absolutely agree (5) · *Don't know (1)* |
| FR — frequency **reversed** | 5 | Never (**5**) · Sometimes (4) · Often (3) · Always (**2**) · *Don't know (1)* |
| AR — agreement **reversed** | 45 | Absolutely disagree (**5**) · Mostly disagree (4) · Mostly agree (3) · Absolutely agree (**2**) · *Don't know (1)* |
| S — satisfaction | 42 | Absolutely dissatisfied (2) … Absolutely satisfied (5) · *Don't know (1)* |
| C — change (last 12 months) | 50 | Significantly deteriorated (1) · Slightly deteriorated (2) · No tangible changes (3) · Slightly improved (4) · Significantly improved (5). **No “Don't know”** |

Q5 and Q45 are negative statements, so their labels run backwards. Storing “Never” as 5 keeps “5 = good” true for every question. This matches the legacy platform. *Don't know* is shown as a separate link under the options.

### Factors (15) and groups (5)

| ID | Key | Group | English | Spanish | Questions |
|---|---|---|---|---|---|
| 17 | values | culture | Values | Valores | 1–3 |
| 18 | climate | culture | Climate | Clima | 4–7 |
| 19 | styles | culture | Styles | Estilos | 8 |
| 20 | responsibility | structure | Responsibility Structure | Estructura de responsabilidad | 9–11 |
| 21 | authority | structure | Authority Structure | Estructura de autoridad | 12–14 |
| 22 | reward | structure | Reward Structure | Estructura de recompensas | 15–18 |
| 34 | supervisor | functions | Supervisor | Supervisor | 19–27 |
| 23 | planning | process | Planning | Planificación | 28–30 |
| 24 | information | process | Information flow | Flujo de información | 31–32 |
| 26 | client | functions | Client interface | Interfaz con el cliente | 33–34 |
| 27 | transformation | functions | Transformation | Transformación | 35–38 |
| 28 | human | functions | Human factors | Factores humanos | 39–41 |
| 30 | behaviour | effects | Behaviour | Comportamiento | 42–47 |
| 31 | changes | effects | Changes | Cambios | 48, 50 |
| 32 | inefficiency | effects | Inefficiency | Ineficiencia | 49 |

Group names:
- culture: Organizational culture
- structure: Structure
- process: Process
- functions: Organizational functions
- effects: Effects

## 3.2 Engagement level per participant — exact rule (legacy `calculateInvolvement`)

```
all[k]  = % of the participant's answers equal to k (k = 1..5), over ALL 50 answers ("Don't know" = 1 is included in the denominator)
most[k] = same, but only over the questions the participant marked "Most important" (importance = 3)

all45 = all[4] + all[5]     all23 = all[2] + all[3]
most45 = most[4] + most[5]  most23 = most[2] + most[3]          (0 if no "Most important" question)

checked in THIS order:
  if all45 >= 70 and most45 == 100  → "fully"       (Fully engaged)
  if all45 >= 60 and most45 >= 70   → "engaged"     (Engaged)
  if all23 >= 70 and most23 >= 70   → "disengaged"  (Disengaged)
  otherwise                         → "somewhat"    (Somewhat engaged)
```

Q50 is included like any other question (raw 1–5).

The level descriptions shown in the report (`texts.<lang>.levels`) are:
- **Fully engaged:** passionate about their work and the organization, …
- **Engaged:** focused on achieving results, …
- **Somewhat engaged:** selective about where they put their energy, …
- **Disengaged:** work only when they have to, …

## 3.3 Aggregation for the group report

Input: every response of the launch, as `{ answers[50], importance[50], area, comments[50] }`.

1. **Overall levels:** count and % of respondents in each level. KPI: **Fully engaged + Engaged %** (“positive”).
2. **By area:**
   - group respondents by the area stored with their response;
   - an area with **≥ 5** responses gets its own column;
   - all smaller areas, and respondents without an area, are pooled into **“Other areas”**, shown only if the pool has **≥ 5** and at least one real area is shown;
   - otherwise those answers only count in the company total, and the report says how many were left out;
   - areas are sorted alphabetically.
3. **Per question:**
   - distribution `dist[1..5]` (counts);
   - **most-important %** = respondents who marked it 3 ÷ respondents;
   - comments (non-empty ones).
4. **Factors:** the same statistic as the Express Diagnostics (section 2.3 of `02-express-diagnostics.md`).
   - Each question's `middle` is computed from its raw answers: 1 (Don't know) is dropped, 2–5 map to 1–4, then the mode or mean − σ/2.
   - A factor's middle is the average of its questions' middles; percent = middle / 4 × 100.
   - Colour: ≥ 75% green (“All OK”), ≥ 50% yellow (“Attention zone”), else red (“Anomaly zone”).
   - **Q50 is left out of the factors** (its scale means something else, and its 1 is not “don't know”). So *Changes* = Q48 only.
5. **What matters most:** questions with most-important % > 0, sorted by that % descending (ties: question order). Keep the top 10.
6. **Minimums:** no report below 5 responses.

## 3.4 Report (PDF) contents

Letter size, Montserrat, about 9 pages. Visual reference: `samples/sample-report-engagement-survey-en.pdf` / `-es.pdf`.

1. **Cover**
   - Logo, title “Engagement Survey / Report”
   - Company, survey (launch name), date of the report
   - Responses “n of N invited”
   - Anonymity note
   - Four level tiles with %, and the **Fully engaged + Engaged** KPI
   - Contents
2. **Distribution by engagement level:** one coloured block per level with %, number of people, a bar and the level description. A dark bar at the end shows the positive KPI.
3. **Engagement by area:** a table with columns Company, each area (≥5) and Other areas (if shown), and these rows:
   - Respondents
   - one row per level, with %
   - Fully engaged + Engaged

   Groups of 5 columns per table, with the Company column repeated in each. A note says how many answers come from hidden small areas, or that no area reaches 5.
4. **Organizational factors:** a grid with 5 group columns (black headers). Each factor is a box with its name and %, filled with its colour tint. A legend explains the 3 colours.
5. **What matters most to employees:** the top-10 list. Each item shows:
   - the most-important % (in red);
   - the question text;
   - a horizontal stacked bar of how it was answered.
6. **All questions:** grouped by factor in questionnaire order. Each question has a stacked bar of its answer distribution (%) and the most-important % on the right in red.
   - Bar colours: 5 green · 4 blue · 3 yellow · 2 red · 1 (Don't know) grey. For Q50, 1 (significantly deteriorated) is dark red.
   - A note explains that green is always the most positive answer, including for the reversed Q5/Q45, and that Q50 uses its own scale.
7. **Comments** (optional; the admin decides when generating): grouped by question number and text, each comment quoted word for word. If there are none, “No comments were left.”
8. Footer on every page.

## 3.5 What gets stored (reference) — anonymous

One row per response:

| Field | Value |
|---|---|
| Response ID | random |
| Launch ID | — |
| Submitted On | **date only** (yyyy-mm-dd) |
| Language | launch language |
| Area | copied from the employee at submission time |
| Result | computed level |
| Q1…Q50 | raw answers |
| I1…I50 | importance |
| C1…C50 | comments |

The reference inserts rows at a random position. No employee or invitation identifiers are stored.
