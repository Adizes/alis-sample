# Express Diagnostics — legacy rules, golden case and content changes

Source: legacy extraction of s.adizes.com (questionnaire ID 33, table_type 1) + the real PDF
“Company Express Diagnostics Report 2023” generated on 27.10.2026 for “IT Magnificent Company”.

## Scoring (exact port — `shared/ed-engine.js`)

- Raw answers 1–5. **1 = “I cannot answer”** is excluded from every statistic; 2–5 become 1–4.
- Per statement: dispersion = sample standard deviation (n − 1; 0 when n ≤ 1).
  middle = the mode when exactly one value is the most frequent, otherwise **mean − dispersion / 2**.
- Statement with no valid answers (everyone chose “I cannot answer”): middle 0 → red, and the report shows
  the base statement. Confirmed in the legacy PDF (e.g. Q1, Q8, Q13 red with the positive wording).
- Wording: middle ≥ 3 → base statement, < 2 → zone 3, otherwise zone 2.
- Colour: ≥ 3 green, ≥ 2 yellow, < 2 red. Frame: 1 participant → dotted; dispersion ≥ 1 → thick; ≥ 0.7 → thin; else dotted.
- Factor (cell) = mean of its statements’ middles (**statements with no answer count as 0**), percent = middle / 4 × 100,
  participants = minimum n among its statements. Radar reference rings: 75% (normal) and 50% (abnormal).
- Section order = categoryID ascending (17 → 33). Radar 1: 17,18,20,21,22,23,24,25 · Radar 2: 26…33.

## Golden case

`test/engine.test.mjs` rebuilds the legacy respondent’s 72 answers from the PDF (colour + wording of every
statement, radar values measured from the PDF’s vector paths) and checks all 72 statements and all 16 radar
values. The legacy run still included the 5 blank questions 68–72; the product uses 1–67, so only
Planning (72.5% vs 70.5%) and Transformation (70% vs 58.3%) differ for that same person.

## Content changes vs. the legacy text

Obvious typos and broken sentences were fixed (meaning unchanged). Q14 and Q16 were kept as in the original
(their “good” direction is a methodological question for Adizes).

| Lang | Q | Part | Legacy | New |
|---|---|---|---|---|
| EN | 1 | zone 3 | Our value system is not clearly articulated | Our value system is not articulated |
| EN | 10 | statement | Our organizational structure is well supports current business model | Our organizational structure supports the current business model well |
| EN | 19 | statement | Our reward system contributes to the achievement of the our goals | Our reward system contributes to the achievement of our goals |
| EN | 30 | zone 2 | We not always base our annual plans on our long-term objectives / strategies | We do not always base our annual plans on our long-term objectives / strategies |
| EN | 36 | zone 2 | We do not always carry out control / analysis of tour company's performance at least once a month | We do not always carry out control / analysis of our company's performance at least once a month |
| EN | 39 | zone 2 | We not always control and analyse the performance of our company with the identification and fixation of systemic problems | We do not always control and analyse the performance of our company with the identification and fixation of systemic problems |
| EN | 41 | statement | Our selling proposition and promotion and sales models are competitive is highly responsive to the needs of our customers | Our selling proposition and our promotion and sales models are highly responsive to the needs of our customers |
| EN | 41 | zone 2 | Our selling proposition and promotion and sales models are competitive does not fully meet the needs of our customers | Our selling proposition and our promotion and sales models do not fully meet the needs of our customers |
| EN | 41 | zone 3 | Our selling proposition and promotion and sales models are competitive meets the needs of our clients to a small extent | Our selling proposition and our promotion and sales models meet the needs of our customers only to a small extent |
| EN | 45 | zone 2 | Not all standard processes and procedures are documented here | Not all of our standard processes and procedures are documented |
| EN | 49 | zone 2 | Our activity in developing and launching new products is not effictive enough | Our activity in developing and launching new products is not effective enough |
| ES | 1 | statement | Nuestro sistema de valor está claramente articulado en unas pocas palabras/frases | Nuestro sistema de valores está claramente articulado en unas pocas palabras/frases |
| ES | 1 | zone 3 | Nuestro sistema de valores no está claramente articulado | Nuestro sistema de valores no está articulado |
| ES | 2 | zone 2 | Nuestro sistema de valores no siempre es respetado en nuestra práctica empresarial diaria, los valores declarados corresponden a los demostrados | Nuestro sistema de valores no siempre es respetado en nuestra práctica empresarial diaria, los valores declarados no siempre corresponden a los demostrados |
| ES | 8 | zone 2 | Nuestra cultura corporativa se caracteriza por una insuficiente alta iniciativa de los empleados | Nuestra cultura corporativa se caracteriza por una iniciativa insuficiente de los empleados |
| ES | 15 | zone 2 | Algunos de nuestros líderes carecen de la autoridad para enfrentar los desafíos que enfrentan. | Algunos de nuestros líderes carecen de la autoridad para afrontar los desafíos que enfrentan |
| ES | 15 | zone 3 | Muchos de nuestros líderes carecen de la autoridad para enfrentar los desafíos que enfrentan. | Muchos de nuestros líderes carecen de la autoridad para afrontar los desafíos que enfrentan |
| ES | 31 | zone 3 | A menudo no tengo suficiente información para tomar decisiones clave de manera habitual. | A menudo no tengo suficiente información para tomar decisiones gerenciales clave de manera habitual |
| ES | 41 | statement | Nuestra propuesta de venta y los modelos de promoción y venta son competitivos y responden en gran medida a las necesidades de nuestros clientes. | Nuestra propuesta de venta y nuestros modelos de promoción y venta responden en gran medida a las necesidades de nuestros clientes |
| ES | 41 | zone 2 | Nuestra propuesta de venta y modelos de promoción y venta son competitivos no satisfacen plenamente las necesidades de nuestros clientes | Nuestra propuesta de venta y nuestros modelos de promoción y venta no satisfacen plenamente las necesidades de nuestros clientes |
| ES | 41 | zone 3 | Nuestra propuesta de venta y modelos de promoción y venta son competitivos satisfacen en pequeña medida las necesidades de nuestros clientes | Nuestra propuesta de venta y nuestros modelos de promoción y venta satisfacen en pequeña medida las necesidades de nuestros clientes |
| ES | 45 | zone 2 | No todos los procesos y procedimientos estándar están documentados aquí. | No todos nuestros procesos y procedimientos estándar están documentados |
| ES | 50 | zone 2 | Nuestro enfoque la capacitación y el desarrollo no es lo suficientemente sistemático. | Nuestro enfoque de capacitación y desarrollo no es lo suficientemente sistemático |
| ES | 55 | statement | Hemos implementado una gestión de contabilidad. | Hemos implementado una contabilidad de gestión y funciona |
| ES | 55 | zone 2 | Hemos implementado parcialmente una gestión de contabilidad. | Hemos implementado parcialmente una contabilidad de gestión |
| ES | 55 | zone 3 | No hemos implementado una gestión de contabilidad. | No hemos implementado una contabilidad de gestión |

Also: trailing periods removed and quotes normalised to “ ” in both languages.
