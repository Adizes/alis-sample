# Adizes Assessments — Developer Handoff

This package documents the Adizes assessments you will rebuild on your own platform and database:

- **Express Diagnostics (ED):** 67 statements, rated by a company's leadership. You get a group report with the participants' names, 16 organizational factors, radar charts and a wording for each statement chosen by score.
- **Engagement Survey (ES):** 50 questions, anonymous. Each participant is classified into one of 4 engagement levels, and you get a group report by area with factors, the questions that matter most, and comments.

A working reference implementation is live, and the source code is public at **github.com/Adizes/alis-sample**. Everything in this package was produced from that code, so the documents, the data files and the live system agree.

> **What must be identical:** questions, answer values, scoring rules, minimums/anonymity rules and report content. The scoring and anonymity rules reproduce the legacy platform (s.adizes.com) exactly and are verified against a real legacy report.
> **What you are free to change:** look and feel, storage, how invitations and emails are sent, how PDFs are produced, and the admin.

## How to use this package

| Read | What it gives you |
|---|---|
| `01-system-overview.md` | Concepts (company → employees → launch → invitations → answers → report), life cycle, rules, languages, emails |
| `02-express-diagnostics.md` | Answer scale, exact scoring algorithm with pseudo-code, statement wording rules, report contents |
| `03-engagement-survey.md` | Scales per question, importance, engagement classification, aggregation, anonymity rules, report contents |
| `04-reports.md` | How the PDFs are built, recommended technology, page-by-page layout, colours, fonts, assets |
| `05-participant-experience.md` | The answering flow screen by screen: personal link, resume, keyboard, review, submit, states |
| `06-admin-and-data.md` | Admin features, data model, API (request/response), error codes, security |
| `07-verification.md` | How to prove your implementation matches: test vectors and acceptance checklist |
| `questions-express-diagnostics.md` | All 67 statements × 3 wordings, in every language |
| `questions-engagement-survey.md` | All 50 questions, their scale and factor, every answer option, in every language |

### Data files (use these, don't retype)

| File | Content |
|---|---|
| `data/express-diagnostics.json` | Model (cells, question→cell map, norms, radars) + **every text** in every language (UI, questions, report) |
| `data/engagement-survey.json` | Model (factors, groups, scale per question, thresholds) + every text in every language, with the answer options already resolved per question |
| `data/emails.json` | Invitation, reminder and report-email texts per language |
| `data/test-vectors/*.json` | Inputs and expected outputs to test your scoring (see `07-verification.md`) |

### Samples and visuals

| Folder | Content |
|---|---|
| `samples/` | Real group reports produced by the reference implementation: ED and ES in English and Spanish, plus the exact inputs used (`sample-report-inputs.json`) |
| `screens/` | Screenshots of the participant flow (desktop + mobile) and the admin |
| `source/` | A copy of the reference implementation (the scoring engines and report renderers are plain JavaScript and can be reused as-is, see `04-reports.md`) |

## Try it interactively

- **Admin:** use the link you received together with this package. Sign in with an allowed email; you will get a 6-digit code from info@adizes.com. Create a company, add at least 5 employees, create a launch of each test, open it and use **Copy links** to answer as different participants.
- **Participant pages:** www.adizes.com/express-diagnostics and www.adizes.com/engagement-survey, each needing a personal link (`?t=TOKEN`) from a launch.

## Recommended approach (summary)

1. **Load the content from `data/*.json`** into your database (questions, wordings, labels per language). Keep the question order and the raw answer values: they are what is stored and scored.
2. **Port or reuse the two scoring engines** (`source/shared/ed-engine.js`, `source/shared/es-engine.js`). They are about 100 lines each, have no dependencies, and are pure functions: input arrays → result object. If your backend is JavaScript/TypeScript, use them directly. Otherwise, port them and verify with the test vectors.
3. **Store raw answers per participant.** Compute results when the report is generated, not when answers come in. This is how the reference works.
4. **Reports:** either reuse the reference renderers (jsPDF, run in the browser or in Node; inputs are plain JSON), or rebuild them as HTML templates and print them to PDF with a headless browser. See `04-reports.md` for the trade-offs. The sample PDFs are the visual reference.
5. **Enforce the anonymity rules on the server** for the Engagement Survey: no link between answers and people, 5-answer minimums, and small areas never shown alone.
6. **Verify** with `07-verification.md` before going live.

## Glossary

| Term | Meaning |
|---|---|
| Company | Client organization |
| Employee | A person of the company (name, email, **area**, position). Area is used by ES results |
| Launch | One run of one test for one company (e.g. "Leadership team · Nov 2026"). A company can have many launches of both tests |
| Invitation | One employee in one launch, with a personal secret link (token) |
| Response | The answers submitted through one invitation |
| Cell / factor | One of the organizational dimensions the questions are grouped into (16 in ED, 15 in ES) |
| Raw value | The number stored for an answer (1–5). Never translated, never re-ordered |

Version of the reference implementation documented here: **v1.2.0**.
