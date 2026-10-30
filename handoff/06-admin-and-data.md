# 6 · Admin, data model and API

The reference runs on Google Apps Script with Google Sheets as the database (`source/apps-script/`). You will replace both with your platform and database. This chapter lists what the admin must do, the data you need to store, and the API contract the participant pages use.

## 6.1 Admin features (what to rebuild)

Screenshots: `screens/admin-*.png`.

| Area | Features |
|---|---|
| Sign-in | Admin-only. The reference uses an emailed 6-digit code (10 min, 5 attempts, 30 s between requests) and a 7-day signed session. The allow-list holds exact emails plus whole domains (e.g. `@nuclea.solutions`). **Checks are done on the server for every call.** Use your platform's own auth |
| Companies | List with launch/employee counts; create / edit (name, country, default language, contact name and email, notes); archive / restore |
| Employees | Per company: list with area chips; add / edit (name, email, area, position); **bulk paste** of rows `name, email, area, position` (tab- or comma-separated, de-duplicated by email); archive / restore. Email must be unique within the company |
| Launches | Per company, separated by test (ED / ES), plus a global list with tabs All / ED / ES and a status filter |
| New launch | Test type, name, **language**, optional close date, minimum responses (**ED only**; ES is fixed at 5 and the field is hidden), report recipients, internal notes, participants picker (search; select all / none). **ES requires ≥ 5 active employees in the company** (otherwise it explains why and offers no form) **and ≥ 5 participants** |
| Launch page | Status, actions per status (open & send invitations / open without sending / send pending invitations / send reminder / copy all links / edit participants / close & mark ready / reopen / archive / edit / delete draft); KPIs (responses x of y with progress and minimum marker, minimum, close date, open/ready since); participants table (name, email, area, status, date, copy link / send / resend) |
| Report | **Generate** (enabled once the minimum is reached; ES has an “Include participants' comments” option) → PDF saved and linked; **Send** to recipients (comma-separated) with an optional message; shows when and to whom it was last sent; can regenerate and resend |
| Anonymity notice | ES launch pages state that answers are stored without names and small areas are never shown alone |

## 6.2 Data model (reference — adapt to your database)

**Company:** id, name, country, language (`en`/`es`), contact name, contact email, notes, status (Active/Archived), created/updated.

**Employee:** id, company id, full name, email, **area**, position, status (Active/Archived), created/updated.

**Launch:**
- id, company id, **type** (`ED`/`ES`), name, **language**, status (Draft/Open/Ready/Report sent/Closed);
- min responses (ED ≥ 1; ES = 5), close date (`yyyy-mm-dd`, optional), recipients (comma-separated emails);
- created/opened/ready/closed at;
- report URL, report file id, report generated at, report sent at, report sent to;
- notice (`expired` once the date passes below the minimum), notes, updated at.

**Invitation:** id, launch id, employee id, **token** (24 random alphanumeric characters, unique), status (Pending/Sent/Completed/Removed), sent at, reminded at, reminders (count), completed on (ED: timestamp; **ES: date only**), created at.

**ED response:** response id, launch id, invitation id, employee id, full name, submitted at, language, the 16 cell percents (optional convenience), **Q1…Q67** (raw 1–5).

**ES response (anonymous):** response id, launch id, **submitted on (date only)**, language, **area**, result (level), **Q1…Q50** (raw 1–5), **I1…I50** (importance 1–3), **C1…C50** (comments). **No employee, invitation or name columns.** Store them so that row order or timestamps can't be linked to invitations (the reference inserts at a random position).

## 6.3 Participant API (used by the answering pages)

Single endpoint, `POST`, JSON body (sent as `text/plain` to avoid a CORS preflight), JSON response. All responses carry `ok: true|false`. Errors are `{ ok:false, error:'<code>' }`.

### `p_load`

```json
// request
{ "action": "p_load", "t": "<token>" }
// response
{ "ok": true, "state": "open|completed|closed|not_open", "type": "ED|ES", "lang": "en|es",
  "company": "Acme", "closeDate": "2026-11-30", "firstName": "Ana" }      // firstName only for ED
// errors: invalid_link
```

### `p_submit`

```json
// request — ED
{ "action": "p_submit", "t": "<token>", "lang": "es", "v": "1.2.0", "answers": [67 integers 1..5] }
// request — ES
{ "action": "p_submit", "t": "<token>", "lang": "en", "v": "1.2.0",
  "answers": [50 integers 1..5], "importance": [50 integers 1..3], "comments": [50 strings, "" if none] }
// response
{ "ok": true }
// errors: invalid_link, already_completed, closed, invalid_answers, invalid_importance, unknown_type
```

On success the server:
1. saves the response;
2. marks the invitation Completed;
3. runs the **ready check**: if everyone has answered, or the close date has passed, and the minimum is met, the launch becomes **Ready** and admins are notified.

The whole submission runs under a lock so double clicks can't create two responses.

## 6.4 Admin API (reference)

One authenticated entry point, `adminApi(action, payload, sessionToken)`. Each call returns the full refreshed state, plus `savedId` / `sent` when relevant. Your platform will have its own endpoints. The list below is the behaviour to keep.

| Action | Payload | Rules |
|---|---|---|
| `state` | — | Companies, employees, launches (with `total`/`done` counts), invitations (with links) |
| `saveCompany` | id?, name, country, language, contactName, contactEmail, notes | name required; valid email |
| `archiveCompany` | id, archived | — |
| `saveEmployee` | id?, companyId, name, email, area, position | email unique per company (`duplicate_email`) |
| `importEmployees` | companyId, rows[] | skips existing emails |
| `archiveEmployee` | id, archived | — |
| `saveLaunch` | id?, companyId, type, name, language, closeDate, minResponses, recipients, notes, employeeIds[] | ES: `es_min_employees` if the company has < 5 active employees, `es_min_participants` if < 5 participants; ES minimum forced to 5 |
| `deleteLaunch` | id | drafts only |
| `setParticipants` | launchId, employeeIds[] | Draft/Open only; people who already answered are always kept; ES never below 5 |
| `openLaunch` | launchId, send | Draft → Open (needs ≥ 1 participant); optionally sends invitations |
| `sendInvites` | launchId, inviteIds? | Open only; to Pending (or the given ones) |
| `remind` | launchId | to Sent and not completed; reminders +1 |
| `finish` | launchId | Open → Ready if ≥ minimum (`below_minimum`) |
| `reopen` | launchId, closeDate? | Ready/Report sent/Closed → Open |
| `close` | launchId | → Closed (archive) |
| `reportData` | launchId | needs ≥ minimum. ED: `{type, lang, company, launchName, dateIso, total, done, names[], responses[][]}`. ES: same header + `responses[{answers, importance, area, comments}]` (no names) |
| `saveReport` | launchId, pdf (base64), fileName | stores the PDF, records URL / id / time |
| `sendReport` | launchId, to, note | needs a saved report; not for Drafts; Ready → Report sent |

Error codes and the admin's messages (English):

| Code | Message |
|---|---|
| `forbidden` | Session expired / not an admin |
| `invalid_code` | Code not valid or expired |
| `too_many_attempts` | Request a new code |
| `name_required` | The name is required |
| `invalid_email` | Check the email |
| `duplicate_email` | Employee already exists in this company |
| `invalid_recipients` | Check recipients' emails |
| `invalid_date` | Check the date |
| `below_minimum` | Minimum not reached |
| `no_participants` | Add at least one participant |
| `not_draft` | — |
| `not_open` | — |
| `no_report` | Generate the report first |
| `no_recipients` | — |
| `only_drafts` | Only drafts can be deleted |
| `not_ready` | Open the launch first |
| `launch_not_editable` | — |
| `company_not_found` | — |
| `not_found` | — |
| `not_reopenable` | — |
| `invalid_type` | — |
| `es_min_employees` | Needs at least 5 active employees |
| `es_min_participants` | Needs at least 5 participants |

## 6.5 Scheduled job

Once an hour, the job checks every Open launch with the ready rule. This is how close dates take effect, and how the single “closed below minimum” notice is sent.

## 6.6 Security checklist

- Admin authorization on the **server** for every admin call. Never rely on the page alone.
- Participant tokens:
  - random and unguessable (at least 24 characters);
  - only reveal what `p_load` returns (no other people's data, never answers);
  - invalid after completion or removal.
- ES anonymity rules (`01-system-overview.md`) enforced on the server, including the 5-response, 5-per-area and 5-employee minimums.
- Sanitize free text:
  - strip control characters;
  - limit lengths;
  - escape HTML in emails and pages;
  - neutralize leading `= + - @` if data is ever exported to spreadsheets.
- Only admins can reach reports.
