# 5 · Participant experience

Reference: `source/shared/survey.js` (shared by both tests), `source/express-diagnostics/src/app.js`, `source/engagement-survey/src/app.js`, styles in `source/shared/ui.css` + `survey.css`.
Screenshots: `screens/` (desktop and mobile, both tests).

## Entry: the personal link

`https://www.adizes.com/express-diagnostics?t=TOKEN` or `…/engagement-survey?t=TOKEN`.

- The token is a random 24-character alphanumeric string, one per invitation.
- The page calls `p_load` with the token and gets the state, the test type, the **launch language**, the company name and the close date. For ED it also gets the participant's first name.

| State | Screen |
|---|---|
| no `t` in the URL | “You need your personal link” |
| unknown or removed token | “This link isn't valid” (mentions info@adizes.com) |
| launch is Draft | “This … isn't open yet” |
| launch not Open (Ready / Report sent / Closed) | “This … is closed” |
| invitation already Completed | “You have already answered” |
| open | Intro (or Resume) |

All texts are under `texts.<lang>.states` / `intro` / `ui` / `review` / `thanks` in `data/*.json`.

## Screens

1. **Intro:**
   - eyebrow with the test name and company;
   - ED only: “Hi, {first}”;
   - title, body and 3–4 bullets (ES bullets explain anonymity, importance and comments);
   - a note about “I cannot answer / Don't know”;
   - meta line (number of items, time, and “Open until {date}” if there is a close date);
   - **Start** button (Enter also starts).
2. **Resume:** if answers were saved earlier in this browser for this token, the participant chooses “Continue where I left off” or “Start over”.
3. **One item per screen:**
   - header: “Area x/y · Factor name”, with “n of N” on the right;
   - a progress bar split into one segment per section;
   - the item text;
   - the options as large buttons numbered 1–4 (ES Q50: 1–5);
   - “I cannot answer” / “Don't know” as a separate link;
   - **ES only:**
     - an importance control: three segments, **Less important (grey) · Medium (yellow) · Most important (green)**, defaulting to Less important;
     - a counter “Most important: n of 15”;
     - “+ Add a comment (optional)”.
   - Navigation: **Back** and **Next**. Next is disabled until the item is answered.
   - **ED auto-advances** about 0.3 s after an answer is chosen. ES doesn't, because importance and comment may follow.
   - Keyboard:
     - `1`–`n` choose an option;
     - `0` chooses cannot-answer / don't-know;
     - `Enter` goes to the next item.
   - Changing an answer or the importance updates the screen in place, without re-rendering.
4. **Review** (after the last item):
   - every item grouped by section, with the chosen answer;
   - ES also shows a “★ Most important” tag and a “Comment” tag;
   - missing answers are highlighted;
   - a summary line, e.g. “You answered all 50 questions. 2 as ‘Don't know’. Most important: 7 of 15.”
   - Clicking any row opens that item, with a **Back to review** button.
   - **Send my answers** (top and bottom) is disabled while answers are missing or, for ES, while no question is marked Most important.
5. **Sending → Thank you:**
   - ED: “Thank you, {first}” + the group report is sent to the company through Adizes.
   - ES: “Thank you” + answers recorded anonymously.
   - Participants never see scores.

## Rules to keep

- **Autosave:** progress (current item, answers, importance, comments) is stored on the device under a key per token: `adz-ed:<token>` / `adz-es:<token>` in localStorage. It is cleared after a successful submit or when the link is no longer open.
- **Language:** always the launch language from `p_load`. There is no language switch for participants.
- **Single submission:** the server rejects a second submit for the same token (`already_completed`). The page then shows “You have already answered”.
- **Validation on the server** (never trust the page):
  - ED: exactly 67 integers between 1 and 5.
  - ES: exactly 50 answers between 1 and 5 and 50 importance values between 1 and 3, with between 1 and 15 marked 3. Comments are trimmed to 1000 characters, newlines are collapsed, and values that start with `= + - @` are made safe for spreadsheets.
- Submissions are accepted only while the launch is **Open**.
- Layout target: the longest item (ES Q34 in Spanish) with all controls fits a 1366 × 768 laptop screen at 100% zoom without scrolling. On phones the page scrolls normally.
