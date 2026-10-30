# 1 · System overview

## The two tests at a glance

| | Express Diagnostics (ED) | Engagement Survey (ES) |
|---|---|---|
| Purpose | Diagnose systemic organizational problems (Adizes methodology) | Measure employee engagement |
| Who answers | Leadership / management team | Any employees |
| Items | 67 statements | 50 questions |
| Answer | 4-point scale + “I cannot answer” | 4-point scale + “Don’t know” (Q50: 5-point, no “Don’t know”) **and** an importance level per question (+ optional comment) |
| Identity | Named: the report lists who took part | **Anonymous:** answers are stored without any link to the person |
| Minimum to produce a report | 1 response (the admin may raise it per launch) | **5 responses (fixed)** |
| Minimum to create a launch | 1 participant | **5 active employees in the company and 5 participants** |
| Result per person | none (only group) | Engagement level: fully engaged / engaged / somewhat engaged / disengaged |
| Group report | 16 factors, 2 radars, causal diagram, every statement worded by its score | Levels, levels by area, 15 factors, what matters most, all questions, comments |
| Languages | English, Spanish, Latvian, Lithuanian (extensible) | English, Spanish, Latvian, Lithuanian (extensible) |

Participants **never see results**. They answer and get a thank-you screen. Adizes staff generate the group report in the admin and email it to the people they choose.

## Entities and flow

```
Company ──< Employee (name, email, area, position)
   │
   └──< Launch (type ED|ES, language, close date, minimum, recipients, status)
            │
            └──< Invitation (employee, secret token, status) ──1:1── Response (answers)
                                                                        │
                                       Group report (PDF) ◄── all responses of the launch
```

1. **Admin creates a company** and its **employees** (one by one or by pasting a list). Area matters for the ES (results by area).
2. **Admin creates a launch** for one test: name, **language**, optional closing date, report recipients, and participants (chosen from the company's employees). The launch starts as a **Draft**.
3. **Admin opens the launch.** Either the system emails every participant their personal link (from info@adizes.com), or the admin copies the links and shares them however they want. Both can be combined.
4. **Participants answer** through their personal link (`…/express-diagnostics?t=TOKEN` or `…/engagement-survey?t=TOKEN`). A link works once: after submitting, it shows “You have already answered”.
5. When **everyone has answered**, or the **closing date has passed** with the minimum reached, the launch becomes **Ready** and admins get an internal notice. The admin can also close it manually once the minimum is reached.
6. **Admin generates the group report** (PDF), which is saved (Google Drive in the reference), and **sends it** by email to the chosen recipients. It can be regenerated and resent.

## Launch life cycle

```
Draft ──open──► Open ──(all answered | close date passed, with minimum) or "Close & mark ready"──► Ready ──send report──► Report sent
  │               ▲                                                                                    │                    │
delete            └──────────────────────────────── reopen (optionally with a new close date) ◄────────┴────────────────────┘
                                                                                                         archive ──► Closed
```

| Status | Meaning | Participants can answer? |
|---|---|---|
| Draft | Being prepared; participants can be changed; can be deleted | No (“not open yet”) |
| Open | Collecting answers. Participants can still be added or removed; people who already answered are never removed | Yes |
| Ready | Minimum reached and collection finished. Report can be generated | No (“closed”) |
| Report sent | Report emailed at least once | No |
| Closed | Archived | No |

Rules:
- **Automatic Ready** is checked after every submission and once an hour:
  - If all participants answered and the count is at least the minimum, the launch becomes Ready.
  - If the close date has passed and the count is at least the minimum, the launch becomes Ready.
  - If the close date has passed **below** the minimum, the launch stays Open. Admins get **one** notice (“closing date passed without the minimum”) and can send reminders or extend the date.
- A report can be generated and sent while the launch is still Open, as long as the minimum is reached (useful for previews). Sending it then does not change the status.
- **Minimum responses:**
  - ED: default 1. The admin can raise it per launch.
  - ES: always 5. It is not editable, and the admin does not show the field for ES.

## Invitation life cycle

| Status | Meaning |
|---|---|
| Pending | Created, email not sent (the link already works once the launch is Open) |
| Sent | Invitation email sent (reminders keep this status and add 1 to the reminder count) |
| Completed | Answers received |
| Removed | Participant removed from the launch before answering (link stops working) |

Reminders go only to people with status **Sent** who have not answered yet.

## Language rule

The **launch language** governs everything participants see: invitation and reminder emails, the survey (there is no language switch for participants), the thank-you page, and the group report. The admin itself is in English. Internal notices to Adizes staff are in Spanish in the reference implementation; this is free to change.

Available languages: **English (`en`), Spanish (`es`), Latvian (`lv`), Lithuanian (`lt`)**.

- The Latvian Engagement Survey questions are based on the official Latvian question bank of the legacy platform, with grammar fixes.
- Everything else in Latvian and Lithuanian was translated for this version. The legacy platform had no Lithuanian questions and no Latvian Express Diagnostics.
- The legacy platform also had Engagement Survey questions in Russian, Turkish and Chinese. These can be added the same way.

**All texts of both tests (UI, questions, report and emails) live in one workbook, `translations/Adizes-Translations.xlsx`:**
- one sheet per test plus an Emails sheet;
- one column per language;
- yellow cells are missing texts.

Add a language by adding a column `Name [code]`, then run `python3 tools/translations.py import` to regenerate the language files. The same keys appear in `data/*.json` → `texts.<lang>`. Keys, question order and raw values must not change.

## Anonymity rules (Engagement Survey) — must be enforced server-side

1. The stored response has **no employee ID, invitation ID, name or email**. It keeps:
   - the launch ID
   - the **day** of submission (no time)
   - the language
   - the employee's **area** (copied at submission time)
   - the computed level
   - the answers, importance levels and comments
2. The invitation is marked Completed with **only the day** (no time), so timestamps can't be matched to responses.
3. Responses are stored in **random order** (the reference inserts each new row at a random position), so row order doesn't reveal who answered.
4. No report below **5 responses**.
5. **Areas with fewer than 5 responses are never shown on their own.** They are pooled into “Other areas” if together they reach 5; otherwise they only count in the company total.
6. A launch needs **5 active employees** in the company and **5 participants**, and participants can't be reduced below 5.
7. Comments are shown word for word and anonymously (participants are told this before answering). The admin can leave them out of the report.
8. The admin can see **who has answered** (to send reminders) but never **what** they answered.

In the Express Diagnostics, names are visible in the report and stored with the answers (by design).

## Emails

All texts per language are in `data/emails.json`. Placeholders: `{company}`, `{test}`, `{first}` (first name), `{date}` (close date, formatted in the launch language), `{launch}`, `{n}`.

| Email | To | When | Content |
|---|---|---|---|
| Invitation | Each participant | Admin opens the launch with sending, or clicks Send / Send invitations | Greeting with first name, short intro, privacy line (different for ED/ES), deadline (if any), **Start** button with the personal link, “this link is personal” |
| Reminder | Invited participants who haven't answered | Admin clicks Send reminder | Same layout, reminder wording and subject |
| Report | Recipients chosen by the admin (default: launch recipients → company contact) | Admin clicks Send report | Short note + optional admin message + **PDF attached** |
| Ready notice (internal) | Admins + it@adizes.com | Launch becomes Ready | Company, test, launch, counts, link to admin |
| Expired notice (internal) | Same | Close date passed below minimum (once) | Counts and minimum |
| Sign-in code (internal) | The admin signing in | Admin requests a code | 6-digit code, valid 10 minutes |

Sender in the reference: info@adizes.com (“Adizes Institute”).
