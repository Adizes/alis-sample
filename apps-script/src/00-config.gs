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

/* ----------------------------------------------------------------------------------
 * Texts sent by the server (emails to participants and report recipients) per language.
 * To add a language, copy the "en" block. Internal notices to admins are in Spanish.
 * ---------------------------------------------------------------------------------- */
const LABELS = {
  en: {
    tests: { ED: 'Express Diagnostics', ES: 'Engagement Survey' },
    invite: {
      subject: '{company}: {test}',
      reminderSubject: 'Reminder — {company}: {test}',
      hi: 'Hi {first},',
      body: '{company} has invited you to take part in the {test}, conducted together with the Adizes Institute. It takes about 10 minutes.',
      reminder: 'This is a friendly reminder: your answers to the {test} for {company} are still pending.',
      privacy: {
        ED: 'Your answers are combined with those of the other participants in a group report for {company}.',
        ES: 'The survey is anonymous: {company} only receives aggregated results, never individual answers.',
      },
      deadline: 'Please complete it by {date}.',
      cta: 'Start',
      personal: 'This link is personal. Please do not share it.',
      sign: 'The Adizes Institute team',
      footer: 'You received this email because {company} invited you to participate.',
    },
    report: {
      subject: '{test} report — {company}',
      hi: 'Hello,',
      body: 'Attached is the {test} report for {company} ({launch}), based on {n} responses.',
      sign: 'The Adizes Institute team',
      footer: 'Adizes Institute · www.adizes.com',
    },
  },
  es: {
    tests: { ED: 'Diagnóstico Exprés', ES: 'Encuesta de Compromiso' },
    invite: {
      subject: '{company}: {test}',
      reminderSubject: 'Recordatorio — {company}: {test}',
      hi: 'Hola, {first}:',
      body: '{company} te invita a participar en el {test}, que realiza junto con el Instituto Adizes. Toma alrededor de 10 minutos.',
      reminder: 'Te recordamos que tus respuestas al {test} de {company} siguen pendientes.',
      privacy: {
        ED: 'Tus respuestas se combinan con las de los demás participantes en un reporte grupal para {company}.',
        ES: 'La encuesta es anónima: {company} solo recibe resultados agregados, nunca respuestas individuales.',
      },
      deadline: 'Por favor respóndela antes del {date}.',
      cta: 'Comenzar',
      personal: 'Este enlace es personal. Por favor no lo compartas.',
      sign: 'El equipo del Instituto Adizes',
      footer: 'Recibiste este correo porque {company} te invitó a participar.',
    },
    report: {
      subject: 'Reporte de {test} — {company}',
      hi: 'Hola:',
      body: 'Adjuntamos el reporte de {test} de {company} ({launch}), con base en {n} respuestas.',
      sign: 'El equipo del Instituto Adizes',
      footer: 'Instituto Adizes · www.adizes.com',
    },
  },
};
function L_(lang) { return LABELS[lang] || LABELS.en; }
