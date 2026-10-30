/*************************************************************************************
 * ADIZES ASSESSMENTS — BACKEND + ADMIN (Google Apps Script)
 * Express Diagnostics · Engagement Survey
 * -----------------------------------------------------------------------------------
 * GENERATED FILE: edit apps-script/src/*.gs, admin/src/* and shared/*, then `npm run build`.
 *
 * Companies → employees → launches (one test run) → invitations (one personal link each).
 * Participants answer on adizes.com with their link (?t=TOKEN) and only see a thank-you page.
 * The admin (this same project, a second deployment restricted to adizes.com) manages
 * everything, generates the group report (PDF, in the browser) and emails it.
 *
 * Public API (POST, Content-Type text/plain, JSON body) used by the Webflow widgets:
 *   p_load   → { t }                       → launch info for that invitation
 *   p_submit → { t, answers, ... }         → saves the answers (once per invitation)
 *
 * First time: run setup() once from the editor. Deploy → New deployment → Web app:
 *   Execute as: Me · Who has access: Anyone. The same URL is used by the Webflow embeds (POST)
 *   and is the admin page (open it in the browser; sign in with a code sent to your email).
 * Admins: Project Settings → Script Properties → ADMIN_EMAILS (comma separated; "@domain.com" = whole domain)
 * and CONFIG.ADMIN_DOMAINS below.
 *************************************************************************************/

const CONFIG = {
  EMAIL: {
    FROM_ADDRESS: 'info@adizes.com',  // "Send mail as" alias of the account that owns this script
    FROM_NAME: 'Adizes Institute',
    NOTIFY_TO: 'it@adizes.com',       // internal notifications (same domain → sent WITHOUT Reply-To)
  },
  // Webflow pages where participants answer (the personal link adds ?t=TOKEN)
  PAGES: {
    ED: 'https://www.adizes.com/express-diagnostics',
    ES: 'https://www.adizes.com/engagement-survey',
  },
  ASSETS_BASE: 'https://cdn.jsdelivr.net/gh/Adizes/alis-sample@__RELEASE__/shared/assets/',
  // Optional: leave '' and setup() creates them (IDs are then kept in Script Properties).
  DATA_SPREADSHEET_ID: '',
  PDF_FOLDER_ID: '',
  MIN_RESPONSES: { ED: 1, ES: 5 },
  // Whole email domains allowed in the admin (besides ADMIN_EMAILS in Script Properties)
  ADMIN_DOMAINS: ['nuclea.solutions'],
  MAX_PDF_BYTES: 8 * 1024 * 1024,
};
const VERSION = '__VERSION__';
const TESTS = ['ED', 'ES'];

// Texts of the emails per language: apps-script/src/01-labels.gs (generated from the translations workbook).
function L_(lang) { return LABELS[lang] || LABELS.en; }
