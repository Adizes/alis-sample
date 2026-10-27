/*************************************************************************************
 * ADIZES ASSESSMENTS — BACKEND (Google Apps Script web app)
 * Express Diagnostics · Engagement Survey · Admin
 * -----------------------------------------------------------------------------------
 * GENERATED FILE: edit apps-script/src/*.gs and shared/ed-engine.js, then `npm run build`.
 *
 * The Webflow widgets send POST requests here (Content-Type text/plain, JSON body):
 *   ed_submit  → validates, scores on the server, saves a row in "ED Responses"
 *   ed_deliver → receives the PDF (base64), saves it in Drive, emails it, notifies it@adizes.com
 *   ed_event   → small events (PDF download)
 * Backup: a time trigger (every 10 min) emails a summary to anyone whose PDF never arrived.
 *
 * First time: run setup() once from the editor (creates the data spreadsheet, the Drive
 * folders and the trigger, and asks for permissions).
 * Deploy: Deploy → New deployment → Web app → Execute as: Me · Who has access: Anyone.
 *************************************************************************************/

const CONFIG = {
  EMAIL: {
    FROM_ADDRESS: 'info@adizes.com',  // "Send mail as" alias of the account that owns this script
    FROM_NAME: 'Adizes Institute',
    NOTIFY_TO: 'it@adizes.com',       // internal notifications (same domain → sent WITHOUT Reply-To)
  },
  ASSETS_BASE: 'https://cdn.jsdelivr.net/gh/Adizes/alis-sample@__RELEASE__/shared/assets/',
  // Optional: leave '' and setup() creates them (IDs are then kept in Script Properties).
  DATA_SPREADSHEET_ID: '',
  PDF_FOLDER_ID: '',
  // Founder Dependency (read-only, used by the admin)
  FD_SPREADSHEET_ID: '1RpJO1pDpnBgS_XlhsA2KsABw36N9XaHA-lsDjdMgpt4',
  BACKUP_AFTER_MIN: 15,
  MAX_PDF_BYTES: 8 * 1024 * 1024,
};
const VERSION = '__VERSION__';

/* ----------------------------------------------------------------------------------
 * Labels used by the server (emails, Sheet). To add a language, copy a block.
 * ---------------------------------------------------------------------------------- */
const LABELS = {
  en: {
    cells: {
      values: 'Values', climate: 'Climate', responsibility: 'Responsibility Structure', authority: 'Authority Structure',
      reward: 'Reward Structure', planning: 'Planning', information: 'Information flow', corrective: 'Corrective Actions',
      client: 'Client interface', transformation: 'Transformation', human: 'Human factors', financial: 'Financial factors',
      behaviour: 'Behaviour', changes: 'Changes', inefficiency: 'Inefficiency', ineffectiveness: 'Ineffectiveness',
    },
    colors: { green: 'Healthy', yellow: 'Needs improvement', red: 'Key focus zone' },
    ed: {
      subject: 'Your Express Diagnostics report',
      hi: 'Hi {first},',
      intro: 'Thank you for completing the Express Diagnostics. Your full report is attached as a PDF.',
      introNoPdf: 'Thank you for completing the Express Diagnostics. Here is a summary of your results.',
      glance: 'At a glance',
      count: { red: 'key focus zones', yellow: 'areas to improve', green: 'healthy' },
      focus: 'Where to look first',
      factors: 'All 16 factors',
      sign: 'The Adizes Institute team',
      footer: 'You received this email because you completed the Express Diagnostics at adizes.com.',
    },
  },
  es: {
    cells: {
      values: 'Valores', climate: 'Clima', responsibility: 'Estructura de responsabilidad', authority: 'Estructura de autoridad',
      reward: 'Estructura de recompensas', planning: 'Planificación', information: 'Flujo de información', corrective: 'Acciones correctivas',
      client: 'Interfaz con el cliente', transformation: 'Transformación', human: 'Factores humanos', financial: 'Factores financieros',
      behaviour: 'Comportamiento', changes: 'Cambios', inefficiency: 'Ineficiencia', ineffectiveness: 'Inefectividad',
    },
    colors: { green: 'Sano', yellow: 'Por mejorar', red: 'Zona de enfoque clave' },
    ed: {
      subject: 'Tu reporte de Diagnóstico Exprés',
      hi: 'Hola, {first}:',
      intro: 'Gracias por completar el Diagnóstico Exprés. Adjuntamos tu reporte completo en PDF.',
      introNoPdf: 'Gracias por completar el Diagnóstico Exprés. Aquí tienes un resumen de tus resultados.',
      glance: 'En resumen',
      count: { red: 'zonas de enfoque clave', yellow: 'áreas por mejorar', green: 'sanas' },
      focus: 'Por dónde empezar',
      factors: 'Los 16 factores',
      sign: 'El equipo del Instituto Adizes',
      footer: 'Recibiste este correo porque completaste el Diagnóstico Exprés en adizes.com.',
    },
  },
};
function L_(lang) { return LABELS[lang] || LABELS.en; }
