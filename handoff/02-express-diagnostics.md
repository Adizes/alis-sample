# 2 · Express Diagnostics (ED)

Reference code: `source/shared/ed-engine.js` (scoring, about 100 lines, no dependencies) and `source/shared/ed-report.js` (PDF).
Content: `data/express-diagnostics.json` and `questions-express-diagnostics.md`.

## 2.1 Questionnaire

- **67 statements**, always in the same order (the order is part of the scoring: statement *n* belongs to a fixed cell).
- Each statement has **three wordings** per language:
  - `statement`: the zone-1 wording. It is the only one shown to participants and describes the healthy situation.
  - `zone2`: the attention-zone wording.
  - `zone3`: the anomaly-zone wording.
  The report prints one of the three depending on the group's score for that statement.
- One question per screen. Answer options, top to bottom:

| Raw value stored | English | Spanish |
|---|---|---|
| 2 | Never · *Totally disagree* | Nunca · *Totalmente en desacuerdo* |
| 3 | Sometimes · *Partially disagree* | A veces · *Parcialmente en desacuerdo* |
| 4 | Often · *Partially agree* | A menudo · *Parcialmente de acuerdo* |
| 5 | Always · *Totally agree* | Siempre · *Totalmente de acuerdo* |
| 1 | I cannot answer (shown as a separate link under the options) | No puedo responder |

All 67 must be answered (1–5) before sending.

> Note: the legacy questionnaire had 72 slots, but 68–72 were blank in production. The product uses 1–67.

## 2.2 The 16 cells (factors)

`id` is the legacy category ID; report order is ascending ID.

| ID | Code | Key | English | Spanish | Statements |
|---|---|---|---|---|---|
| 17 | 1.1 V | values | Values | Valores | 1–3 (3) |
| 18 | 1.2 C | climate | Climate | Clima | 4–9 (6) |
| 20 | 2.1 H | responsibility | Responsibility Structure | Estructura de responsabilidad | 10–14 (5) |
| 21 | 2.2 V | authority | Authority Structure | Estructura de autoridad | 15–18 (4) |
| 22 | 2.3 R | reward | Reward Structure | Estructura de recompensas | 19–20 (2) |
| 23 | 3.1 P | planning | Planning | Planificación | 21–30 (10) |
| 24 | 3.2 I | information | Information flow | Flujo de información | 31–35 (5) |
| 25 | 3.3 CA | corrective | Corrective Actions | Acciones correctivas | 36–39 (4) |
| 26 | 4/5 1 CI | client | Client interface | Interfaz con el cliente | 40–44 (5) |
| 27 | 4/5 2 T | transformation | Transformation | Transformación | 45–49 (5) |
| 28 | 4/5 3 HR | human | Human factors | Factores humanos | 50–52 (3) |
| 29 | 4/5 4 F | financial | Financial factors | Factores financieros | 53–56 (4) |
| 30 | 6.1 I | behaviour | Behaviour | Comportamiento | 57–58 (2) |
| 31 | 6.2 E | changes | Changes | Cambios | 59–62 (4) |
| 32 | 6.3 A | inefficiency | Inefficiency | Ineficiencia | 63–64 (2) |
| 33 | 6.4 P | ineffectiveness | Ineffectiveness | Inefectividad | 65–67 (3) |

## 2.3 Scoring — exact algorithm

Constants (`NORMS`): `upperMiddle = 3`, `lowerMiddle = 2`, `upperDispersion = 1`, `lowerDispersion = 0.7`, `scale = 4`.

### Per statement (over all participants of the launch)

```
xs = [ raw − 1  for raw in answers_to_this_statement  if raw in {2,3,4,5} ]   # "cannot answer" (1) is dropped
n  = len(xs)
if n == 0:
    middle = 0; dispersion = 0; zone = 0                # nobody could answer
else:
    mean       = sum(xs) / n
    dispersion = sqrt( Σ(x − mean)² / (n − 1) )  if n > 1 else 0      # SAMPLE standard deviation
    mode       = the value with the highest frequency, ONLY if exactly one value has that frequency
    middle     = mode  if mode exists  else  mean − dispersion / 2
    zone       = 1 if middle >= 3  else  3 if middle < 2  else  2

color  = green if middle >= 3  else  yellow if middle >= 2  else  red        # middle 0 → red
border = dotted if n == 1
         else thick  if dispersion >= 1
         else thin   if dispersion >= 0.7
         else dotted
wording shown in the report:  zone 1 or 0 → statement · zone 2 → zone2 · zone 3 → zone3
                              (zone 0 also prints the suffix "· no answer")
```

### Per cell (factor)

```
questions = statements of the cell
middle     = average of the statements' middles        # statements with n = 0 count as 0 (lowers the cell)
dispersion = average of the statements' dispersions
percent    = middle / 4 × 100
n          = minimum n among its statements
color      = same thresholds on middle (≥3 green, ≥2 yellow, else red)  →  ≥75% green, ≥50% yellow
border     = same rule as statements, with the cell's n and dispersion
```

Worked example: 4 participants answer statement 1 with raw `5, 5, 4, 1`.
- “1” is dropped, so the values are `[4, 4, 3]` and n = 3.
- The mode is 4 (unique), so middle = 4: zone 1, green.
- Dispersion = 0.577 (sample standard deviation), so the border is dotted.

If raw were `5, 4`, then:
- the values are `[4, 3]`, with no unique mode;
- mean = 3.5 and dispersion = 0.7071;
- middle = 3.5 − 0.354 = 3.146, which gives green, and the border is thin.

These rules were verified against a real legacy PDF: every statement's colour and wording, and all 16 radar values (`07-verification.md`).

## 2.4 Report (PDF) contents

Letter size, Montserrat, about 7 pages. Visual reference: `samples/sample-report-express-diagnostics-en.pdf` / `-es.pdf`.

1. **Cover**
   - Logo, title “Express Diagnostics / Report”
   - Company and date of the report
   - Participants surveyed: the count and the list of names
   - “Survey design: distance survey of top management”
   - **At a glance:** number of cells that are red (*Key focus zone*), yellow (*Needs improvement*) and green (*Healthy*)
   - “How to read this report” paragraph
2. **Causal factors of systemic organizational problems:** a fixed diagram with nested boxes.
   - Structure:
     - External Factors
     - Internal Factors
       - Systemic Organizational Causes
         - Organizational Culture: Values, Climate
         - Strategic Planning · Organizational Structure · Authority
         - Information Flow · Corrective Actions · Rewards
     - Subsystems Symptoms: Client Interface · Transformation / Human Resources · Finance
     - Systemic Manifestations: Inefficiency · Behavior / Change · Ineffectiveness
   - Each cell box shows its label and **percent**, filled with the tint of the cell colour and framed by the cell border.
   - Legend: colour decoding (3 colours) and frame types (3 borders).
3. **Two radar charts (8 axes each, clockwise from the top)**
   - Chart 1, “Systemic organizational problems”: Values, Climate, Responsibility, Authority, Reward, Planning, Information, Corrective.
   - Chart 2, “Operational problems and systemic manifestations (consequences)”: Client, Transformation, Human, Financial, Behaviour, Changes, Inefficiency, Ineffectiveness.
   - Each chart draws the company polygon (solid), a green dotted ring at **75%** (“Normal situation”) and a red dotted ring at **50%** (“Abnormal situation”).
   - Axis labels show the percent in the cell colour.
4. **Key organizational factors (pages 4+):** colour and frame legend, then for each of the 16 cells in order:
   - a heading: “n. Name”, with “xx% · Healthy / Needs improvement / Key focus zone” on the right in the cell colour;
   - its statements, each with a small swatch (fill = statement colour, border = statement frame) and the **wording that matches its zone**;
   - statements nobody could answer, which show the base wording + “· no answer”;
   - long cells continue on the next page with “(cont.)”.
5. Footer on every page: “Adizes Institute · Express Diagnostics · Company” + page number.

The report uses the launch language for every label (`texts.<lang>.pdf`, `cells`, `diagram`, `radar`, `colors`, `colorShort`, `frames`).

## 2.5 What gets stored (reference)

One row per response:
- Response ID, Launch ID, Invitation ID, Employee ID, Full Name
- Submitted At (timestamp) and Language
- the 16 cell percents of that individual (a convenience only; the report uses the raw answers)
- **Q1…Q67 raw values**

Only the raw values are needed to regenerate any report.
