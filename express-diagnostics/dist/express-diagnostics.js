/*! Adizes · Express Diagnostics v1.0.0 · github.com/Adizes/alis-sample */
(function(){
'use strict';
var ED_I18N = {};
/* Express Diagnostics — English
 * To add a language: copy this file (e.g. pt.js), change `ED_I18N.en` to `ED_I18N.pt`, translate every
 * string and keep the keys. The order of `questions` must not change (it is the scoring order).
 * Answer values (1–5) are never translated: they are what is stored and scored.
 */
ED_I18N.en = {
  code: 'en',
  langName: 'English',
  locale: 'en-US',

  ui: {
    start: 'Start the diagnostic',
    back: 'Back',
    next: 'Next',
    pressEnter: 'press Enter ↵',
    keyboardHint: 'Keys 1–4 · 0 = I cannot answer',
    question: 'Statement',
    of: 'of',
    section: 'Area',
    minutes: '≈ 10 minutes · 67 statements · free PDF report',
    resume: 'You have a diagnostic in progress.',
    resumeYes: 'Continue where I left off',
    resumeNo: 'Start over',
    language: 'Language',
    loading: 'Building your diagnostic…',
    errorGeneric: 'Something went wrong. Please try again.',
    retry: 'Try again',
  },

  intro: {
    eyebrow: 'Express Diagnostics',
    title: 'Where is your organization losing energy?',
    body: 'Most organizational problems are symptoms. This diagnostic, built on the Adizes methodology, looks underneath them: 67 statements across the 16 factors that shape how a company is led, structured and run.',
    bullets: [
      'A causal map of your organization’s systemic problems',
      'Two radar charts that compare your company with a healthy one',
      'Every factor rated as healthy, needing improvement or a key focus zone',
    ],
    note: 'Answer for how things actually work today, not how they are supposed to work. If you have no basis to judge a statement, choose “I cannot answer”.',
  },

  // Raw values 2–5 (1 = cannot answer). Shown top to bottom.
  scale: [
    { value: 2, label: 'Never', sub: 'Totally disagree' },
    { value: 3, label: 'Sometimes', sub: 'Partially disagree' },
    { value: 4, label: 'Often', sub: 'Partially agree' },
    { value: 5, label: 'Always', sub: 'Totally agree' },
  ],
  cannot: 'I cannot answer',

  cells: {
    values: 'Values', climate: 'Climate', responsibility: 'Responsibility Structure', authority: 'Authority Structure',
    reward: 'Reward Structure', planning: 'Planning', information: 'Information flow', corrective: 'Corrective Actions',
    client: 'Client interface', transformation: 'Transformation', human: 'Human factors', financial: 'Financial factors',
    behaviour: 'Behaviour', changes: 'Changes', inefficiency: 'Inefficiency', ineffectiveness: 'Ineffectiveness',
  },

  diagram: {
    title: 'Causal factors of systemic organizational problems',
    external: 'External Factors',
    internal: 'Internal Factors',
    causes: 'Systemic Organizational Causes',
    culture: 'Organizational Culture',
    subsystems: 'Subsystems Symptoms',
    manifestations: 'Systemic Manifestations',
    labels: {
      values: 'Values', climate: 'Climate', planning: 'Strategic Planning', responsibility: 'Organizational Structure',
      authority: 'Authority', information: 'Information Flow', corrective: 'Corrective Actions', reward: 'Rewards',
      client: 'Client Interface', transformation: 'Transformation', human: 'Human Resources', financial: 'Finance',
      inefficiency: 'Inefficiency', behaviour: 'Behavior', changes: 'Change', ineffectiveness: 'Ineffectiveness',
    },
  },

  radar: {
    title1: 'Systemic organizational problems',
    title2: 'Operational problems and systemic manifestations (consequences)',
    normal: 'Normal situation',
    abnormal: 'Abnormal situation',
    yours: 'Your company',
  },

  colors: {
    green: 'The process is healthy',
    yellow: 'There are some areas for improvement',
    red: 'Key focus zone',
  },
  colorShort: { green: 'Healthy', yellow: 'Needs improvement', red: 'Key focus zone' },
  frames: {
    title: 'Type of frame',
    sub: 'Depending on how much the participants’ opinions vary, a different frame is displayed',
    dotted: 'Dotted frame — participants’ opinions largely coincide',
    thin: 'Thin frame — noticeable divergence of opinion',
    thick: 'Thick frame — the participants’ opinions do not coincide at all',
  },
  noAnswer: 'no answer',

  gate: {
    eyebrow: 'Almost done',
    title: 'Where should we send your report?',
    body: 'Your results appear on the next screen, and we’ll email you the full PDF report.',
    name: 'Full name', namePh: 'Jane Smith',
    email: 'Work email', emailPh: 'jane@company.com',
    company: 'Company', companyPh: 'Company name',
    consent: 'I agree to the Adizes Institute processing my data to send me this report. {privacy}',
    privacy: 'Privacy policy',
    submit: 'See my results',
    errName: 'Please enter your name.',
    errEmail: 'Please enter a valid email.',
    errCompany: 'Please enter your company.',
    errConsent: 'Please accept to continue.',
  },

  results: {
    eyebrow: 'Express Diagnostics',
    lead: 'This is how your answers map onto the 16 factors of the Adizes organizational diagnostic.',
    count: { red: 'key focus zones', yellow: 'areas to improve', green: 'healthy' },
    diagramTitle: 'Causal map',
    diagramHelp: 'Problems flow downward: systemic causes produce symptoms in the subsystems, which show up as manifestations. Fixing the causes is what makes the symptoms go away.',
    radarTitle: 'Your company against a healthy one',
    radarHelp: 'The green ring marks a normal situation (75%), the red ring an abnormal one (50%).',
    focusTitle: 'Where to look first',
    focusHelp: 'The factors in your key focus zone, with the statements behind them.',
    focusNone: 'No factor fell into the key focus zone. The areas closest to it are listed below.',
    sessionEyebrow: 'Next step',
    sessionTitle: 'Turn this diagnosis into a plan',
    sessionBody: 'In a free 30-minute session, a Certified Adizes Associate reviews your diagnostic with you and helps you decide where to start.',
    sessionCta: 'Book my free session',
    pdfTitle: 'Your full report',
    pdfSending: 'Sending the PDF to {email}…',
    pdfSent: 'We sent the PDF to {email}. Check your spam folder if you don’t see it.',
    pdfError: 'We couldn’t email the PDF. Download it here.',
    download: 'Download PDF',
    preparing: 'Preparing…',
    retake: 'Start a new diagnostic',
  },

  pdf: {
    title: 'Express Diagnostics',
    subtitle: 'Report',
    company: 'Company',
    date: 'Date of the report',
    design: 'Survey design: distance survey of top management',
    participants: 'Participants',
    participantsCount: 'Participants surveyed',
    howTitle: 'How to read this report',
    howBody: 'Each of the 16 factors is rated from your answers on a 4-point scale (“I cannot answer” is not counted as an answer and lowers the factor’s score). The causal map shows where problems originate, the radar charts compare your company with a normal and an abnormal situation, and the last section lists every statement with its rating.',
    summary: 'At a glance',
    keyFactors: 'Key organizational factors',
    keyFactorsHelp: 'Each statement is shown in the wording that matches its rating.',
    colorsTitle: 'Colour decoding',
    footer: 'Adizes Institute · Express Diagnostics',
    page: 'Page',
    nextStep: 'Turn this diagnosis into a plan',
    nextBody: 'The diagnostic shows where the organization is losing energy. The next step is deciding what to fix first, in which order and with whom.',
    nextCta: 'Book a free session',
    cont: 'cont.',
    sign: 'Adizes Institute',
  },

  questions: [
    { t: "Our value system is clearly articulated in a few words / phrases", z2: "Our value system is not clearly articulated", z3: "Our value system is not articulated" },
    { t: "Our value system is respected in our daily business practice, the declared values correspond to the demonstrated ones", z2: "Our value system is not always respected in everyday business practice, the declared values do not always correspond to the demonstrated ones", z3: "Our value system is often not adhered to in our daily business practice, the declared values often do not correspond to the demonstrated ones" },
    { t: "Our value system is the same across all divisions", z2: "Our value system is not the same in some departments", z3: "Our value system is not the same for many departments" },
    { t: "Our corporate culture is very similar in most departments", z2: "Our corporate culture is not similar enough in most departments", z3: "Our corporate culture is not the same in most departments" },
    { t: "Our corporate culture is characterized by a high level of collaboration between divisions", z2: "Our corporate culture is characterized by a lack of cooperation between departments", z3: "Our corporate culture is characterized by a low level of cooperation between divisions" },
    { t: "Our corporate culture is characterized by a high level of performance discipline", z2: "Our corporate culture is characterized by a lack of performance discipline", z3: "Our corporate culture is characterized by a low level of performance discipline" },
    { t: "Our corporate culture is characterized by the ability to fearlessly express our own opinions", z2: "Our corporate culture is not always characterized by the ability to fearlessly express our own opinions", z3: "Our corporate culture is not characterized by the ability to fearlessly express our own opinions" },
    { t: "Our corporate culture is characterized by high employee initiative", z2: "Our corporate culture is characterized by insufficiently high employee initiative", z3: "Our corporate culture is characterized by low employee initiative" },
    { t: "Our corporate culture is characterized by a low level of conflict", z2: "Our corporate culture is not always characterized by low levels of conflict", z3: "Our corporate culture is not characterized by a low level of conflict" },
    { t: "Our organizational structure supports the current business model well", z2: "Our organizational structure does not support the current business model well enough", z3: "Our organizational structure does not fully support the current business model" },
    { t: "Our organizational structure supports the long-term goals of the company well", z2: "Our organizational structure does not support the long-term goals of the company well enough", z3: "Our organizational structure has little support for the long-term goals of the company" },
    { t: "Our organizational structure contains all the necessary functions", z2: "Our organizational structure does not contain all the necessary functions", z3: "Our organizational structure lacks many essential functions" },
    { t: "There are no unclear/overlapping areas of responsibility in our organizational structure", z2: "There are sometimes unclear/overlapping areas of responsibility in our organizational structure", z3: "There are many unclear/overlapping areas of responsibility in our organizational structure" },
    { t: "Our organizational structure is highly “around functions” rather than “around people”", z2: "Our organizational structure is somewhat “around functions” rather than “around people”", z3: "Our organizational structure is highly “around people” rather than “around functions”" },
    { t: "Most of our leaders have enough authority to handle the challenges they face", z2: "Some of our leaders lack the authority to meet the challenges they face", z3: "Many of our leaders lack the authority to meet the challenges they face" },
    { t: "In our company, the biggest authority is held by commercial divisions", z2: "In our company, only part of the authority is held by commercial divisions", z3: "In our company, a small part of the authority is held by commercial divisions" },
    { t: "Our authority structure allows for quick decision making", z2: "Our authority structure does not always allow for quick decision making", z3: "Our authority structure does not allow for quick decision making" },
    { t: "Our structure of authority does not cause conflicts in the decision-making process", z2: "Our structure of authority sometimes causes conflicts in the decision-making process", z3: "Our structure of authority often causes conflicts in the decision-making process" },
    { t: "Our reward system contributes to the achievement of our goals", z2: "Our reward system does not fully contribute to the achievement of our goals", z3: "Our reward system rarely helps us achieve our goals" },
    { t: "Our employees are satisfied with the existing motivation system", z2: "Our employees are not always satisfied with the existing motivation system", z3: "Our employees are often not satisfied with the existing motivation system" },
    { t: "Our long term goals / strategy are clearly defined", z2: "Our long term goals / strategy are not well defined", z3: "Our long term goals / strategy are not defined" },
    { t: "Our long term goals / strategy are documented", z2: "Our long term goals / strategy are not fully documented", z3: "Our long term goals / strategy are not documented" },
    { t: "Our long-term goals / strategy are known to management", z2: "Not all of our long-term goals / strategy are known to management", z3: "Our long-term goals / strategy are not known to management" },
    { t: "Our long-term goals / strategy were developed with the participation of management", z2: "Our long-term goals / strategy were developed with insufficient management involvement", z3: "Our long-term goals / strategy were developed without management involvement" },
    { t: "Our long term goals / strategy are supported by management", z2: "Our long-term goals / strategy are not fully supported by management", z3: "Our long-term goals / strategy are not supported by management" },
    { t: "Our long term goals / strategy are backed up by a detailed action plan", z2: "Our long term goals / strategy are not fully backed by a detailed action plan", z3: "Our long term goals / strategy are not backed up by a specific action plan" },
    { t: "Our long-term goals / strategy are backed by the necessary resources", z2: "Our long-term goals / strategy are not fully resourced", z3: "Our long-term goals / strategy are not resourced" },
    { t: "We regularly evaluate the implementation of long-term goals / strategies", z2: "We do not regularly evaluate the implementation of long-term goals / strategies", z3: "We rarely evaluate the implementation of long-term goals / strategies" },
    { t: "Our long-term goals / strategy are regularly / if necessary revised", z2: "Our long-term goals / strategy are not reviewed regularly enough", z3: "Our long-term goals / strategy are rarely revised" },
    { t: "We base our annual plans on our long-term objectives / strategies", z2: "We do not always base our annual plans on our long-term objectives / strategies", z3: "We do not base our annual plans on our long-term objectives / strategies" },
    { t: "I have enough information to make key regular management decisions", z2: "I do not always have enough information to make key regular management decisions", z3: "I often do not have enough information to make key regular management decisions" },
    { t: "Information for taking management decisions usually contains reliable information", z2: "Information for taking management decisions does not always contain reliable information", z3: "Information for taking management decisions often does not contain reliable information" },
    { t: "Information for taking management decisions is usually collected in a timely manner", z2: "Information for taking management decisions is not always collected in a timely manner", z3: "Information for taking management decisions is usually not collected in a timely manner" },
    { t: "Information for taking management decisions does not contain redundant unnecessary information", z2: "Information for taking management decisions sometimes contains redundant unnecessary information", z3: "Information for taking management decisions often contains redundant unnecessary information" },
    { t: "The collection of information for taking management decisions is automated in our company", z2: "The collection of information for taking management decisions is not fully automated in our company", z3: "The collection of information for taking management decisions is not automated in our company" },
    { t: "We carry out control / analysis of our company's performance at least once a month", z2: "We do not always carry out control / analysis of our company's performance at least once a month", z3: "We rarely monitor / analyze our company's performance" },
    { t: "We carry out control / analysis of our company's performance in a team of key managers", z2: "We do not always monitor / analyze our company's performance in a team of key managers", z3: "We do not monitor / analyze the performance of the company in a team of key managers" },
    { t: "We control and analyse the performance of our company with discussion, fixation and subsequent control of the implementation of corrective measures", z2: "We do not always control and analyse the performance of our company with discussion, fixation and subsequent control of the implementation of corrective measures", z3: "We do not control and analyse the performance of our company with discussion, fixation and subsequent control of the implementation of corrective measures" },
    { t: "We control and analyse the performance of our company with the identification and fixation of systemic problems", z2: "We do not always control and analyse the performance of our company with the identification and fixation of systemic problems", z3: "We do not control and analyse the performance of our company with the identification and fixation of systemic problems" },
    { t: "We know our target customers and their needs well", z2: "We do not always know the target customers and their needs well", z3: "We do not know the target customers and their needs well" },
    { t: "Our selling proposition and our promotion and sales models are highly responsive to the needs of our customers", z2: "Our selling proposition and our promotion and sales models do not fully meet the needs of our customers", z3: "Our selling proposition and our promotion and sales models meet the needs of our customers only to a small extent" },
    { t: "Our selling proposition and promotion and sales models are competitive", z2: "Our selling proposition and promotion and sales models are not always competitive", z3: "Our selling proposition and promotion and sales models are not fully competitive" },
    { t: "Our annual / quarterly production / operating unit plans are based on the sales plan", z2: "Our annual / quarterly production / operating unit plans are partially based on the sales plan", z3: "Our annual / quarterly production / operating unit plans are not based on sales plans" },
    { t: "The activities of commercial and operational (production) functions are well coordinated with each other", z2: "The actions of commercial and operational (production) functions are not always well coordinated with each other", z3: "The actions of commercial and operational (production) functions are poorly coordinated with each other" },
    { t: "Most of our standard processes and procedures are documented", z2: "Not all of our standard processes and procedures are documented", z3: "Most of our standard processes and procedures are not documented" },
    { t: "We follow most of our standard processes and procedures", z2: "We follow some of our standard processes and procedures", z3: "We rarely follow our standard processes and procedures" },
    { t: "Most of our standard processes and procedures are subject to periodic adjustments", z2: "Only a subset of our standard processes and procedures are subject to periodic adjustments", z3: "A small part of our standard processes and procedures are subject to periodic adjustments" },
    { t: "Most of our standard processes and procedures are automated", z2: "Only part of our standard processes and procedures are automated", z3: "A small part of our standard processes and procedures are automated" },
    { t: "Our work on the development and release of new products is effective", z2: "Our activity in developing and launching new products is not effective enough", z3: "Our activity on the development and release of new products is ineffective" },
    { t: "We take a systematic approach to training and development", z2: "Our approach to training and development is not systematic enough", z3: "We do not approach training and development systematically" },
    { t: "We handle hiring challenges", z2: "We do not fully cope with the tasks of hiring", z3: "We are bad at hiring tasks" },
    { t: "We do not experience a shortage of qualified personnel", z2: "Sometimes we experience a shortage of qualified personnel", z3: "We are experiencing a shortage of qualified personnel" },
    { t: "We know the break-even point", z2: "We roughly know the break-even point", z3: "We don't know the break-even point" },
    { t: "We have implemented a budgeting process and follow it", z2: "Our budgeting process is not fully implemented", z3: "We do not have a budgeting process implemented" },
    { t: "We have implemented management accounting and it operates", z2: "We have partially implemented management accounting", z3: "We have not implemented management accounting" },
    { t: "Payment requests (to suppliers / contractors) in most cases are paid quickly / within a specified time frame", z2: "Payment requests (to suppliers / contractors) are not always paid quickly / within a specified time frame", z3: "Payment requests (to suppliers / contractors) are rarely paid quickly / within a stipulated time frame" },
    { t: "We have a low level of key personnel turnover", z2: "We have an average level of key personnel turnover", z3: "We have a high level of key personnel turnover" },
    { t: "Our employees recommend the company to their friends", z2: "Not all of our employees recommend the company to their friends", z3: "Our employees do not recommend the company to their friends" },
    { t: "Our product line is changing rapidly", z2: "Our product line is not changing fast enough", z3: "Our product line is slowly changing" },
    { t: "Changes in our company are not met with resistance", z2: "Changes in our company are sometimes met with resistance", z3: "Changes in our company are often resisted" },
    { t: "Our development budget has been growing for the past three years", z2: "Our development budget has slightly grown for the past three years", z3: "Our development budget has not been growing for the last three years" },
    { t: "The share of our income from new areas of activity (markets, products) has been growing over the past three years", z2: "The share of our income from new areas of activity (markets, products) has slightly grown over the past three years", z3: "The share of our income from new areas of activity (markets, products) has not been growing for the last three years" },
    { t: "Our profits have been growing for the last three years", z2: "Our profits have slightly grown over the past three years", z3: "Our profits have not grown for the last three years" },
    { t: "Our profitability has been growing for the past three years", z2: "Our profitability has slightly increased over the past three years", z3: "Our profitability has not increased for the past three years" },
    { t: "Our market share has been growing for the past three years", z2: "Our market share has grown little over the past three years", z3: "Our market share has not been growing for the last three years" },
    { t: "Our sales volume has been growing for the last three years", z2: "Our sales volume has grown little for the last three years", z3: "Our sales volume has not grown for the last three years" },
    { t: "Our clients recommend us", z2: "Our clients do not always recommend us", z3: "Our clients rarely recommend us" },
  ],
};

/* Express Diagnostics — Español
 * Para agregar un idioma: copia en.js (por ejemplo pt.js), cambia `ED_I18N.en` por `ED_I18N.pt`,
 * traduce cada texto y conserva las claves. No cambies el orden de `questions` (es el orden del cálculo).
 */
ED_I18N.es = {
  code: 'es',
  langName: 'Español',
  locale: 'es-MX',

  ui: {
    start: 'Comenzar el diagnóstico',
    back: 'Atrás',
    next: 'Siguiente',
    pressEnter: 'presiona Enter ↵',
    keyboardHint: 'Teclas 1–4 · 0 = No puedo responder',
    question: 'Afirmación',
    of: 'de',
    section: 'Área',
    minutes: '≈ 10 minutos · 67 afirmaciones · reporte PDF gratuito',
    resume: 'Tienes un diagnóstico en curso.',
    resumeYes: 'Continuar donde me quedé',
    resumeNo: 'Empezar de nuevo',
    language: 'Idioma',
    loading: 'Preparando tu diagnóstico…',
    errorGeneric: 'Algo salió mal. Inténtalo de nuevo.',
    retry: 'Intentar de nuevo',
  },

  intro: {
    eyebrow: 'Diagnóstico Exprés',
    title: '¿Dónde está perdiendo energía tu organización?',
    body: 'La mayoría de los problemas organizacionales son síntomas. Este diagnóstico, basado en la metodología Adizes, mira lo que hay debajo: 67 afirmaciones sobre los 16 factores que definen cómo se dirige, se estructura y se opera una empresa.',
    bullets: [
      'Un mapa causal de los problemas sistémicos de tu organización',
      'Dos gráficas de radar que comparan tu empresa con una sana',
      'Cada factor calificado como sano, con áreas de mejora o zona de enfoque clave',
    ],
    note: 'Responde según cómo funcionan las cosas hoy, no cómo deberían funcionar. Si no tienes elementos para juzgar una afirmación, elige “No puedo responder”.',
  },

  scale: [
    { value: 2, label: 'Nunca', sub: 'Totalmente en desacuerdo' },
    { value: 3, label: 'A veces', sub: 'Parcialmente en desacuerdo' },
    { value: 4, label: 'A menudo', sub: 'Parcialmente de acuerdo' },
    { value: 5, label: 'Siempre', sub: 'Totalmente de acuerdo' },
  ],
  cannot: 'No puedo responder',

  cells: {
    values: 'Valores', climate: 'Clima', responsibility: 'Estructura de responsabilidad', authority: 'Estructura de autoridad',
    reward: 'Estructura de recompensas', planning: 'Planificación', information: 'Flujo de información', corrective: 'Acciones correctivas',
    client: 'Interfaz con el cliente', transformation: 'Transformación', human: 'Factores humanos', financial: 'Factores financieros',
    behaviour: 'Comportamiento', changes: 'Cambios', inefficiency: 'Ineficiencia', ineffectiveness: 'Inefectividad',
  },

  diagram: {
    title: 'Factores causales de los problemas organizacionales sistémicos',
    external: 'Factores externos',
    internal: 'Factores internos',
    causes: 'Causas organizacionales sistémicas',
    culture: 'Cultura organizacional',
    subsystems: 'Síntomas en los subsistemas',
    manifestations: 'Manifestaciones sistémicas',
    labels: {
      values: 'Valores', climate: 'Clima', planning: 'Planeación estratégica', responsibility: 'Estructura organizacional',
      authority: 'Autoridad', information: 'Flujo de información', corrective: 'Acciones correctivas', reward: 'Recompensas',
      client: 'Interfaz con el cliente', transformation: 'Transformación', human: 'Recursos humanos', financial: 'Finanzas',
      inefficiency: 'Ineficiencia', behaviour: 'Comportamiento', changes: 'Cambio', ineffectiveness: 'Inefectividad',
    },
  },

  radar: {
    title1: 'Problemas organizacionales sistémicos',
    title2: 'Problemas operativos y manifestaciones sistémicas (consecuencias)',
    normal: 'Situación normal',
    abnormal: 'Situación anormal',
    yours: 'Tu empresa',
  },

  colors: {
    green: 'El proceso está sano',
    yellow: 'Hay áreas de mejora',
    red: 'Zona de enfoque clave',
  },
  colorShort: { green: 'Sano', yellow: 'Por mejorar', red: 'Zona de enfoque clave' },
  frames: {
    title: 'Tipo de marco',
    sub: 'Según cuánto varían las opiniones de los participantes, se muestra un marco distinto',
    dotted: 'Marco punteado: las opiniones de los participantes coinciden en gran medida',
    thin: 'Marco delgado: hay una divergencia de opinión notable',
    thick: 'Marco grueso: las opiniones de los participantes no coinciden en absoluto',
  },
  noAnswer: 'sin respuesta',

  gate: {
    eyebrow: 'Ya casi',
    title: '¿A dónde te enviamos tu reporte?',
    body: 'Tus resultados aparecen en la siguiente pantalla y te enviamos por correo el reporte completo en PDF.',
    name: 'Nombre completo', namePh: 'Ana López',
    email: 'Correo de trabajo', emailPh: 'ana@empresa.com',
    company: 'Empresa', companyPh: 'Nombre de la empresa',
    consent: 'Acepto que el Instituto Adizes procese mis datos para enviarme este reporte. {privacy}',
    privacy: 'Aviso de privacidad',
    submit: 'Ver mis resultados',
    errName: 'Escribe tu nombre.',
    errEmail: 'Escribe un correo válido.',
    errCompany: 'Escribe tu empresa.',
    errConsent: 'Acepta para continuar.',
  },

  results: {
    eyebrow: 'Diagnóstico Exprés',
    lead: 'Así se reflejan tus respuestas en los 16 factores del diagnóstico organizacional Adizes.',
    count: { red: 'zonas de enfoque clave', yellow: 'áreas por mejorar', green: 'sanas' },
    diagramTitle: 'Mapa causal',
    diagramHelp: 'Los problemas fluyen hacia abajo: las causas sistémicas producen síntomas en los subsistemas, que se ven como manifestaciones. Atender las causas es lo que hace desaparecer los síntomas.',
    radarTitle: 'Tu empresa frente a una sana',
    radarHelp: 'El anillo verde marca una situación normal (75%) y el rojo una anormal (50%).',
    focusTitle: 'Por dónde empezar',
    focusHelp: 'Los factores en zona de enfoque clave, con las afirmaciones que los explican.',
    focusNone: 'Ningún factor quedó en zona de enfoque clave. Abajo están las áreas más cercanas a ella.',
    sessionEyebrow: 'Siguiente paso',
    sessionTitle: 'Convierte este diagnóstico en un plan',
    sessionBody: 'En una sesión gratuita de 30 minutos, un Asociado Certificado de Adizes revisa tu diagnóstico contigo y te ayuda a decidir por dónde empezar.',
    sessionCta: 'Agendar mi sesión gratuita',
    pdfTitle: 'Tu reporte completo',
    pdfSending: 'Enviando el PDF a {email}…',
    pdfSent: 'Enviamos el PDF a {email}. Si no lo ves, revisa tu carpeta de spam.',
    pdfError: 'No pudimos enviar el PDF por correo. Descárgalo aquí.',
    download: 'Descargar PDF',
    preparing: 'Preparando…',
    retake: 'Hacer un nuevo diagnóstico',
  },

  pdf: {
    title: 'Diagnóstico Exprés',
    subtitle: 'Reporte',
    company: 'Empresa',
    date: 'Fecha del reporte',
    design: 'Diseño del estudio: encuesta a distancia a la alta dirección',
    participants: 'Participantes',
    participantsCount: 'Participantes encuestados',
    howTitle: 'Cómo leer este reporte',
    howBody: 'Cada uno de los 16 factores se califica con tus respuestas en una escala de 4 puntos (“No puedo responder” no cuenta como respuesta y baja la calificación del factor). El mapa causal muestra dónde se originan los problemas, las gráficas de radar comparan tu empresa con una situación normal y una anormal, y la última sección presenta cada afirmación con su calificación.',
    summary: 'En resumen',
    keyFactors: 'Factores organizacionales clave',
    keyFactorsHelp: 'Cada afirmación aparece con la redacción que corresponde a su calificación.',
    colorsTitle: 'Significado de los colores',
    footer: 'Instituto Adizes · Diagnóstico Exprés',
    page: 'Página',
    nextStep: 'Convierte este diagnóstico en un plan',
    nextBody: 'El diagnóstico muestra dónde pierde energía la organización. El siguiente paso es decidir qué corregir primero, en qué orden y con quién.',
    nextCta: 'Agendar una sesión gratuita',
    cont: 'cont.',
    sign: 'Instituto Adizes',
  },

  questions: [
    { t: "Nuestro sistema de valores está claramente articulado en unas pocas palabras/frases", z2: "Nuestro sistema de valores no está claramente articulado", z3: "Nuestro sistema de valores no está articulado" },
    { t: "Nuestro sistema de valores es respetado en nuestra práctica empresarial diaria, los valores declarados corresponden a los demostrados", z2: "Nuestro sistema de valores no siempre es respetado en nuestra práctica empresarial diaria, los valores declarados no siempre corresponden a los demostrados", z3: "Nuestro sistema de valores a menudo no se cumple en nuestra práctica empresarial diaria, los valores declarados a menudo no corresponden con los demostrados" },
    { t: "Nuestro sistema de valores es el mismo en todas las divisiones", z2: "Nuestro sistema de valores no es el mismo en algunos departamentos", z3: "Nuestro sistema de valores no es el mismo en muchos departamentos" },
    { t: "Nuestra cultura corporativa es muy similar en la mayoría de los departamentos", z2: "Nuestra cultura corporativa no es lo suficientemente similar en la mayoría de los departamentos", z3: "Nuestra cultura corporativa no es la misma en la mayoría de los departamentos" },
    { t: "Nuestra cultura corporativa se caracteriza por un alto nivel de colaboración entre las divisiones", z2: "Nuestra cultura corporativa se caracteriza por la falta de cooperación entre departamentos", z3: "Nuestra cultura corporativa se caracteriza por un bajo nivel de cooperación entre las divisiones" },
    { t: "Nuestra cultura corporativa se caracteriza por un alto nivel de disciplina en el desempeño", z2: "Nuestra cultura corporativa se caracteriza por la falta de disciplina en el desempeño", z3: "Nuestra cultura corporativa se caracteriza por un bajo nivel de disciplina en el desempeño" },
    { t: "Nuestra cultura corporativa se caracteriza por la capacidad de expresar sin temor nuestras propias opiniones", z2: "Nuestra cultura corporativa no siempre se caracteriza por la capacidad de expresar sin miedo nuestras propias opiniones", z3: "Nuestra cultura corporativa no se caracteriza por la capacidad de expresar sin temor nuestras propias opiniones" },
    { t: "Nuestra cultura corporativa se caracteriza por una alta iniciativa de los empleados", z2: "Nuestra cultura corporativa se caracteriza por una iniciativa insuficiente de los empleados", z3: "Nuestra cultura corporativa se caracteriza por la baja iniciativa de los empleados" },
    { t: "Nuestra cultura corporativa se caracteriza por un bajo nivel de conflictividad", z2: "Nuestra cultura corporativa no siempre se caracteriza por bajos niveles de conflicto", z3: "Nuestra cultura corporativa no se caracteriza por un bajo nivel de conflictividad" },
    { t: "Nuestra estructura organizativa es compatible con el modelo de negocio actual", z2: "Nuestra estructura organizativa no es lo suficientemente compatible con el modelo de negocio actual", z3: "Nuestra estructura organizativa no es totalmente compatible con el modelo de negocio actual" },
    { t: "Nuestra estructura organizacional apoya bien los objetivos a largo plazo de la empresa", z2: "Nuestra estructura organizacional no respalda suficientemente los objetivos a largo plazo de la empresa", z3: "Nuestra estructura organizacional tiene poco apoyo para los objetivos a largo plazo de la empresa" },
    { t: "Nuestra estructura organizacional contiene todas las funciones necesarias", z2: "Nuestra estructura organizacional no contiene todas las funciones necesarias", z3: "Nuestra estructura organizacional carece de muchas funciones esenciales" },
    { t: "No hay áreas de responsabilidad poco claras o superpuestas en nuestra estructura organizacional", z2: "A veces hay áreas de responsabilidad poco claras o superpuestas en nuestra estructura organizacional", z3: "Hay muchas áreas de responsabilidad poco claras o superpuestas en nuestra estructura organizacional" },
    { t: "Nuestra estructura organizacional se basa en gran medida “en torno a las funciones” en lugar de “en torno a las personas”", z2: "Nuestra estructura organizacional es un poco “alrededor de funciones” en lugar de “alrededor de personas”", z3: "Nuestra estructura organizacional está más “en torno a las personas” que “en torno a las funciones”" },
    { t: "La mayoría de nuestros líderes tienen suficiente autoridad para manejar los desafíos que enfrentan", z2: "Algunos de nuestros líderes carecen de la autoridad para afrontar los desafíos que enfrentan", z3: "Muchos de nuestros líderes carecen de la autoridad para afrontar los desafíos que enfrentan" },
    { t: "En nuestra empresa, la mayor autoridad la tienen las divisiones comerciales", z2: "En nuestra empresa, solo una parte de la autoridad está en manos de las divisiones comerciales", z3: "En nuestra empresa, una pequeña parte de la autoridad la tienen las divisiones comerciales" },
    { t: "Nuestra estructura de autoridad permite una rápida toma de decisiones", z2: "Nuestra estructura de autoridad no siempre permite una rápida toma de decisiones", z3: "Nuestra estructura de autoridad no permite una toma de decisiones rápida" },
    { t: "Nuestra estructura de autoridad no genera conflictos en el proceso de toma de decisiones", z2: "Nuestra estructura de autoridad a veces provoca conflictos en el proceso de toma de decisiones", z3: "Nuestra estructura de autoridad a menudo causa conflictos en el proceso de toma de decisiones" },
    { t: "Nuestro sistema de recompensas contribuye al logro de nuestros objetivos", z2: "Nuestro sistema de recompensas no contribuye completamente al logro de nuestros objetivos", z3: "Nuestro sistema de recompensas rara vez nos ayuda a alcanzar nuestros objetivos" },
    { t: "Nuestros empleados están satisfechos con el sistema de motivación existente", z2: "Nuestros empleados no siempre están satisfechos con el sistema de motivación existente", z3: "Nuestros empleados a menudo no están satisfechos con el sistema de motivación existente" },
    { t: "Nuestros objetivos/estrategia a largo plazo están claramente definidos", z2: "Nuestros objetivos/estrategia a largo plazo no están bien definidos", z3: "Nuestros objetivos/estrategia a largo plazo no están definidos" },
    { t: "Nuestros objetivos/estrategia a largo plazo están documentados", z2: "Nuestros objetivos/estrategia a largo plazo no están completamente documentados", z3: "Nuestros objetivos/estrategia a largo plazo no están documentados" },
    { t: "Nuestros objetivos/estrategia a largo plazo son conocidos por la gerencia", z2: "No todos nuestros objetivos/estrategias a largo plazo son conocidos por la gerencia", z3: "Nuestros objetivos/estrategia a largo plazo no son conocidos por la gerencia" },
    { t: "Nuestras metas/estrategia a largo plazo fueron desarrolladas con la participación de la gerencia", z2: "Nuestras metas/estrategia a largo plazo se desarrollaron con una participación gerencial insuficiente", z3: "Nuestros objetivos/estrategia a largo plazo se desarrollaron sin la participación de la gerencia" },
    { t: "Nuestros objetivos/estrategia a largo plazo están respaldados por la dirección", z2: "Nuestros objetivos/estrategia a largo plazo no están totalmente respaldados por la dirección", z3: "Nuestros objetivos/estrategia a largo plazo no están respaldados por la dirección" },
    { t: "Nuestros objetivos/estrategia a largo plazo están respaldados por un plan de acción detallado", z2: "Nuestros objetivos/estrategia a largo plazo no están totalmente respaldados por un plan de acción detallado", z3: "Nuestros objetivos/estrategia a largo plazo no están respaldados por un plan de acción específico" },
    { t: "Nuestros objetivos/estrategia a largo plazo están respaldados por los recursos necesarios", z2: "Nuestros objetivos/estrategia a largo plazo no cuentan con todos los recursos", z3: "Nuestros objetivos/estrategia a largo plazo no cuentan con recursos" },
    { t: "Evaluamos regularmente la implementación de objetivos/estrategias a largo plazo", z2: "No evaluamos regularmente la implementación de objetivos/estrategias a largo plazo", z3: "Rara vez evaluamos la implementación de objetivos/estrategias a largo plazo" },
    { t: "Nuestros objetivos/estrategia a largo plazo se revisan regularmente/si es necesario", z2: "Nuestros objetivos/estrategia a largo plazo no se revisan con la suficiente regularidad", z3: "Nuestras metas/estrategia a largo plazo rara vez se revisan" },
    { t: "Basamos nuestros planes anuales en nuestros objetivos/estrategias a largo plazo", z2: "No siempre basamos nuestros planes anuales en nuestros objetivos/estrategias a largo plazo", z3: "No basamos nuestros planes anuales en nuestros objetivos/estrategias a largo plazo" },
    { t: "Tengo suficiente información para tomar decisiones gerenciales clave de manera habitual", z2: "No siempre tengo suficiente información para tomar decisiones gerenciales clave de manera habitual", z3: "A menudo no tengo suficiente información para tomar decisiones gerenciales clave de manera habitual" },
    { t: "La información para la toma de decisiones gerenciales suele contener información fiable", z2: "La información para la toma de decisiones gerenciales no siempre contiene información confiable", z3: "La información para la toma de decisiones gerenciales a menudo no contiene información fiable" },
    { t: "La información para la toma de decisiones gerenciales suele recopilarse en el momento oportuno", z2: "La información para la toma de decisiones gerenciales no siempre se recopila de manera oportuna", z3: "La información para la toma de decisiones gerenciales generalmente no se recopila de manera oportuna" },
    { t: "La información para la toma de decisiones gerenciales no contiene información redundante innecesaria", z2: "La información para la toma de decisiones gerenciales a veces contiene información innecesaria y redundante", z3: "La información para la toma de decisiones gerenciales a menudo contiene información innecesaria y redundante" },
    { t: "La recolección de información para la toma de decisiones gerenciales está automatizada en nuestra empresa", z2: "La recolección de información para la toma de decisiones de gestión no está totalmente automatizada en nuestra empresa", z3: "La recolección de información para la toma de decisiones de gestión no está automatizada en nuestra empresa" },
    { t: "Realizamos control/análisis del desempeño de nuestra empresa al menos una vez al mes", z2: "No siempre llevamos a cabo un control/análisis del rendimiento de la empresa al menos una vez al mes", z3: "Raramente monitoreamos/analizamos el desempeño de nuestra empresa" },
    { t: "Realizamos control/análisis del desempeño de nuestra empresa en un equipo de directivos clave", z2: "No siempre monitoreamos/analizamos el desempeño de nuestra empresa en un equipo de directores clave", z3: "No monitoreamos/analizamos el desempeño de la empresa en un equipo de directores clave" },
    { t: "Controlamos y analizamos el desempeño de nuestra empresa con discusión, fijación y control posterior de la implementación de medidas correctivas", z2: "No siempre controlamos y analizamos el desempeño de nuestra empresa con discusión, fijación y control posterior de la implementación de medidas correctivas", z3: "No controlamos y analizamos el desempeño de nuestra empresa con discusión, fijación y control posterior de la implementación de medidas correctivas" },
    { t: "Controlamos y analizamos el desempeño de nuestra empresa con la identificación y solución de problemas sistémicos", z2: "No siempre controlamos y analizamos el desempeño de nuestra empresa con la identificación y solución de problemas sistémicos", z3: "No controlamos y analizamos el desempeño de nuestra empresa con la identificación y solución de problemas sistémicos" },
    { t: "Conocemos bien a nuestros clientes objetivo y sus necesidades", z2: "No siempre conocemos bien a los clientes objetivo y sus necesidades", z3: "No conocemos bien a los clientes objetivo y sus necesidades" },
    { t: "Nuestra propuesta de venta y nuestros modelos de promoción y venta responden en gran medida a las necesidades de nuestros clientes", z2: "Nuestra propuesta de venta y nuestros modelos de promoción y venta no satisfacen plenamente las necesidades de nuestros clientes", z3: "Nuestra propuesta de venta y nuestros modelos de promoción y venta satisfacen en pequeña medida las necesidades de nuestros clientes" },
    { t: "Nuestra propuesta de valor y modelos de promoción y venta son competitivos", z2: "Nuestra propuesta de valor y modelos de promoción y venta no siempre son competitivos", z3: "Nuestra propuesta de valor y modelos de promoción y venta no son totalmente competitivos" },
    { t: "Nuestros planes anuales/trimestrales de producción/unidades operativas se basan en el plan de ventas", z2: "Nuestros planes anuales/trimestrales de producción/unidades operativas se basan parcialmente en el plan de ventas", z3: "Nuestros planes anuales/trimestrales de producción/unidades operativas no se basan en planes de ventas" },
    { t: "Las actividades de las funciones comerciales y operativas (producción) están bien coordinadas entre sí", z2: "Las acciones de las funciones comercial y operativa (producción) no siempre están bien coordinadas entre sí", z3: "Las acciones de las funciones comerciales y operativas (producción) están mal coordinadas entre sí" },
    { t: "La mayoría de nuestros procesos y procedimientos estándar están documentados", z2: "No todos nuestros procesos y procedimientos estándar están documentados", z3: "La mayoría de nuestros procesos y procedimientos estándar no están documentados" },
    { t: "Seguimos la mayoría de nuestros procesos y procedimientos estándar", z2: "Seguimos algunos de nuestros procesos y procedimientos estándar", z3: "Rara vez seguimos nuestros procesos y procedimientos estándar" },
    { t: "La mayoría de nuestros procesos y procedimientos estándar están sujetos a ajustes periódicos", z2: "Solo un subconjunto de nuestros procesos y procedimientos estándar está sujeto a ajustes periódicos", z3: "Una pequeña parte de nuestros procesos y procedimientos estándar están sujetos a ajustes periódicos" },
    { t: "La mayoría de nuestros procesos y procedimientos estándar están automatizados", z2: "Solo una parte de nuestros procesos y procedimientos estándar están automatizados", z3: "Una pequeña parte de nuestros procesos y procedimientos estándar están automatizados" },
    { t: "Nuestro trabajo en el desarrollo y lanzamiento de nuevos productos es efectivo", z2: "Nuestra actividad en el desarrollo y lanzamiento de nuevos productos no es lo suficientemente eficaz", z3: "Nuestra actividad en el desarrollo y lanzamiento de nuevos productos es ineficaz" },
    { t: "Adoptamos un enfoque sistemático para la capacitación y el desarrollo", z2: "Nuestro enfoque de capacitación y desarrollo no es lo suficientemente sistemático", z3: "No abordamos la capacitación y el desarrollo de forma sistemática" },
    { t: "Manejamos desafíos de contratación", z2: "No hacemos frente completamente a las tareas de contratación", z3: "Somos malos en las tareas de contratación" },
    { t: "No experimentamos escasez de personal calificado", z2: "A veces experimentamos escasez de personal cualificado", z3: "Estamos experimentando una escasez de personal calificado" },
    { t: "Conocemos el punto de equilibrio", z2: "Aproximadamente conocemos el punto de equilibrio", z3: "No conocemos el punto de equilibrio" },
    { t: "Hemos implementado un proceso de presupuestación y lo seguimos", z2: "Nuestro proceso de presupuestación no está completamente implementado", z3: "No tenemos un proceso de presupuestación implementado" },
    { t: "Hemos implementado una contabilidad de gestión y funciona", z2: "Hemos implementado parcialmente una contabilidad de gestión", z3: "No hemos implementado una contabilidad de gestión" },
    { t: "Las solicitudes de pago (a proveedores/contratistas) en la mayoría de los casos se pagan rápidamente/dentro de un plazo específico", z2: "Las solicitudes de pago (a proveedores/contratistas) no siempre se pagan rápidamente/dentro de un plazo específico", z3: "Las solicitudes de pago (a proveedores/contratistas) rara vez se pagan rápidamente/dentro de un plazo estipulado" },
    { t: "Tenemos un bajo nivel de rotación de personal clave", z2: "Tenemos un nivel medio de rotación de personal clave", z3: "Tenemos un alto nivel de rotación de personal clave" },
    { t: "Nuestros empleados recomiendan la empresa a sus amigos", z2: "No todos nuestros empleados recomiendan la empresa a sus amigos", z3: "Nuestros empleados no recomiendan la empresa a sus amigos" },
    { t: "Nuestra línea de productos está cambiando rápidamente", z2: "Nuestra línea de productos no está cambiando lo suficientemente rápido", z3: "Nuestra línea de productos está cambiando lentamente" },
    { t: "Los cambios en nuestra empresa no encuentran resistencia", z2: "Los cambios en nuestra empresa a veces encuentran resistencia", z3: "Los cambios en nuestra empresa a menudo encuentran resistencia" },
    { t: "Nuestro presupuesto de desarrollo ha estado creciendo durante los últimos tres años", z2: "Nuestro presupuesto de desarrollo ha crecido ligeramente durante los últimos tres años", z3: "Nuestro presupuesto de desarrollo no ha estado creciendo durante los últimos tres años" },
    { t: "La participación de nuestros ingresos de nuevas áreas de actividad (mercados, productos) ha ido creciendo en los últimos tres años", z2: "La participación de nuestros ingresos de nuevas áreas de actividad (mercados, productos) ha crecido ligeramente en los últimos tres años", z3: "La participación de nuestros ingresos de nuevas áreas de actividad (mercados, productos) no ha estado creciendo durante los últimos tres años" },
    { t: "Nuestras ganancias han estado creciendo durante los últimos tres años", z2: "Nuestras ganancias han crecido ligeramente en los últimos tres años", z3: "Nuestras ganancias no han crecido en los últimos tres años" },
    { t: "Nuestra rentabilidad ha estado creciendo durante los últimos tres años", z2: "Nuestra rentabilidad ha aumentado ligeramente en los últimos tres años", z3: "Nuestra rentabilidad no ha aumentado en los últimos tres años" },
    { t: "Nuestra participación de mercado ha estado creciendo durante los últimos tres años", z2: "Nuestra participación de mercado ha crecido poco en los últimos tres años", z3: "Nuestra participación de mercado no ha estado creciendo durante los últimos tres años" },
    { t: "Nuestro volumen de ventas ha estado creciendo durante los últimos tres años", z2: "Nuestro volumen de ventas ha crecido poco en los últimos tres años", z3: "Nuestro volumen de ventas no ha crecido en los últimos tres años" },
    { t: "Nuestros clientes nos recomiendan", z2: "Nuestros clientes no siempre nos recomiendan", z3: "Nuestros clientes raramente nos recomiendan" },
  ],
};

/* Shared browser utilities (bundled inside each widget's private scope). */
function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
function md(s) { return esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>'); }
function fill(s, map) { return String(s).replace(/\{(\w+)\}/g, function (m, k) { return map[k] != null ? map[k] : m; }); }
function store(key, val) { try { if (val === null) localStorage.removeItem(key); else localStorage.setItem(key, JSON.stringify(val)); } catch (e) {} }
function load(key) { try { var v = localStorage.getItem(key); return v ? JSON.parse(v) : null; } catch (e) { return null; } }
function qs(name) { try { return new URLSearchParams(location.search).get(name); } catch (e) { return null; } }

var SCRIPT_SRC = (document.currentScript && document.currentScript.src) || '';
// .../<tool>/dist/<file>.js  →  .../shared/assets/
function detectAssets() { return SCRIPT_SRC ? SCRIPT_SRC.replace(/\/[^\/]+\/dist\/[^\/]*$/, '/shared/assets/') : ''; }

function loadScript(src) {
  return new Promise(function (res, rej) {
    var s = document.createElement('script');
    s.src = src; s.async = true; s.onload = res; s.onerror = function () { rej(new Error('load ' + src)); };
    document.head.appendChild(s);
  });
}
function fetchB64(url) {
  return fetch(url).then(function (r) { if (!r.ok) throw new Error(url + ' ' + r.status); return r.arrayBuffer(); }).then(function (buf) {
    var bytes = new Uint8Array(buf), bin = '', chunk = 0x8000;
    for (var i = 0; i < bytes.length; i += chunk) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk));
    return btoa(bin);
  });
}

// POST to the Apps Script web app. text/plain avoids the CORS preflight.
function api(endpoint, payload, timeoutMs) {
  if (!endpoint) return Promise.resolve({ ok: true, demo: true, id: 'DEMO-' + Date.now().toString(36).toUpperCase() });
  var ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
  var t = ctrl ? setTimeout(function () { ctrl.abort(); }, timeoutMs || 30000) : null;
  return fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(payload),
    redirect: 'follow',
    signal: ctrl ? ctrl.signal : undefined,
  }).then(function (r) { return r.json(); }).then(function (j) {
    if (t) clearTimeout(t);
    if (!j || !j.ok) { var e = new Error((j && j.error) || 'server'); e.code = j && j.error; throw e; }
    return j;
  }, function (e) { if (t) clearTimeout(t); throw e; });
}

function injectStyle(id, css, rootSel) {
  if (document.getElementById(id)) return;
  var st = document.createElement('style');
  st.id = id;
  st.textContent = css.split('__ROOT__').join(rootSel);
  document.head.appendChild(st);
}
function loadFontCss() {
  if (document.querySelector('link[data-adz-font]')) return;
  var l = document.createElement('link');
  l.rel = 'stylesheet'; l.setAttribute('data-adz-font', '1');
  l.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800&display=swap';
  document.head.appendChild(l);
}
function utmMeta(startedAt) {
  return {
    page: location.href.split('#')[0], referrer: document.referrer || '',
    utm_source: qs('utm_source') || '', utm_medium: qs('utm_medium') || '', utm_campaign: qs('utm_campaign') || '',
    utm_content: qs('utm_content') || '', utm_term: qs('utm_term') || '',
    startedAt: startedAt || '', tz: (Intl.DateTimeFormat().resolvedOptions().timeZone || ''),
  };
}
function formatDate(iso, locale) {
  try { return new Date(iso || Date.now()).toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' }); }
  catch (e) { return String(iso || '').slice(0, 10); }
}

/* Express Diagnostics — scoring engine (exact port of the legacy s.adizes.com algorithm).
 * Plain ES5 so the SAME file runs in the browser widget, in the admin and in Apps Script.
 *
 * Legacy rules (see express-diagnostics/LEGACY.md):
 *  - Raw answers 1..5. 1 = "cannot answer" → excluded. 2..5 → 1..4.
 *  - Per question: dispersion = sample std dev (n-1); n<=1 → 0.
 *    middle = the mode if exactly one value is the most frequent; otherwise mean − dispersion/2.
 *    No valid answers (n = 0) → middle 0, dispersion 0, and the report shows the base statement.
 *  - Text: middle ≥ 3 → zone 1 (base), < 2 → zone 3, else zone 2.
 *  - Colour: ≥ 3 green, ≥ 2 yellow, else red. Border: 1 participant → dotted;
 *    dispersion ≥ 1 → thick; ≥ 0.7 → thin; else dotted.
 *  - Category (cell): mean of its questions' middles (n=0 questions count as 0), mean of dispersions,
 *    percent = middle / 4 * 100, participants = the minimum n of its questions.
 */
var ED = (function () {
  var NORMS = { upperMiddle: 3, lowerMiddle: 2, upperDispersion: 1, lowerDispersion: 0.7, scale: 4 };

  // The 16 matrix cells, in report order (categoryID ascending). `key` is used by the language files.
  var CELLS = [
    { id: 17, code: '1.1 V', key: 'values' },
    { id: 18, code: '1.2 C', key: 'climate' },
    { id: 20, code: '2.1 H', key: 'responsibility' },
    { id: 21, code: '2.2 V', key: 'authority' },
    { id: 22, code: '2.3 R', key: 'reward' },
    { id: 23, code: '3.1 P', key: 'planning' },
    { id: 24, code: '3.2 I', key: 'information' },
    { id: 25, code: '3.3 CA', key: 'corrective' },
    { id: 26, code: '4/5 1 CI', key: 'client' },
    { id: 27, code: '4/5 2 T', key: 'transformation' },
    { id: 28, code: '4/5 3 HR', key: 'human' },
    { id: 29, code: '4/5 4 F', key: 'financial' },
    { id: 30, code: '6.1 I', key: 'behaviour' },
    { id: 31, code: '6.2 E', key: 'changes' },
    { id: 32, code: '6.3 A', key: 'inefficiency' },
    { id: 33, code: '6.4 P', key: 'ineffectiveness' },
  ];

  // Category of each of the 67 questions (questions 68–72 were blank in production and are not used).
  var QUESTION_CATS = [].concat(
    rep(17, 3), rep(18, 6), rep(20, 5), rep(21, 4), rep(22, 2), rep(23, 10), rep(24, 5), rep(25, 4),
    rep(26, 5), rep(27, 5), rep(28, 3), rep(29, 4), rep(30, 2), rep(31, 4), rep(32, 2), rep(33, 3)
  );

  // Radar charts (8 axes each, clockwise from the top) and the causal-factors diagram.
  var RADARS = [[17, 18, 20, 21, 22, 23, 24, 25], [26, 27, 28, 29, 30, 31, 32, 33]];

  function rep(v, n) { var a = []; for (var i = 0; i < n; i++) a.push(v); return a; }

  function questionStats(raws) {
    var xs = [];
    for (var i = 0; i < raws.length; i++) { var r = Number(raws[i]); if (r > 1 && r <= 5) xs.push(r - 1); }
    var n = xs.length;
    if (!n) return { n: 0, middle: 0, dispersion: 0, mean: 0, mode: null };
    var sum = 0; for (var j = 0; j < n; j++) sum += xs[j];
    var mean = sum / n;
    var sq = 0; for (var k = 0; k < n; k++) sq += (xs[k] - mean) * (xs[k] - mean);
    var dispersion = n > 1 ? Math.sqrt(sq / (n - 1)) : 0;
    var freq = {}, max = 0;
    for (var m = 0; m < n; m++) { freq[xs[m]] = (freq[xs[m]] || 0) + 1; if (freq[xs[m]] > max) max = freq[xs[m]]; }
    var tops = []; for (var v in freq) if (freq[v] === max) tops.push(Number(v));
    var mode = tops.length === 1 ? tops[0] : null;
    return { n: n, middle: mode !== null ? mode : mean - dispersion / 2, dispersion: dispersion, mean: mean, mode: mode };
  }

  function colorOf(middle) { return middle >= NORMS.upperMiddle ? 'green' : middle >= NORMS.lowerMiddle ? 'yellow' : 'red'; }
  function borderOf(n, dispersion) {
    if (n === 1) return 'dotted';
    if (dispersion >= NORMS.upperDispersion) return 'thick';
    if (dispersion >= NORMS.lowerDispersion) return 'thin';
    return 'dotted';
  }
  function zoneOf(st) {
    if (!st.n) return 0; // no valid answers: legacy shows the base statement
    return st.middle >= NORMS.upperMiddle ? 1 : st.middle < NORMS.lowerMiddle ? 3 : 2;
  }
  function pct(middle) { return middle / NORMS.scale * 100; }

  /**
   * responses: array of respondents, each an array of raw answers (1..5) in question order.
   * opts.cats: optional per-question category list (defaults to the 67-question bank).
   */
  function score(responses, opts) {
    opts = opts || {};
    var cats = opts.cats || QUESTION_CATS;
    var questions = [];
    for (var q = 0; q < cats.length; q++) {
      var raws = [];
      for (var r = 0; r < responses.length; r++) raws.push(responses[r][q]);
      var st = questionStats(raws);
      questions.push({
        i: q, cat: cats[q], n: st.n, middle: st.middle, dispersion: st.dispersion,
        color: colorOf(st.middle), border: borderOf(st.n, st.dispersion), zone: zoneOf(st),
      });
    }
    var cells = [];
    for (var c = 0; c < CELLS.length; c++) {
      var qs = questions.filter(function (x) { return x.cat === CELLS[c].id; });
      if (!qs.length) continue;
      var mid = 0, disp = 0, n = Infinity;
      qs.forEach(function (x) { mid += x.middle; disp += x.dispersion; if (x.n < n) n = x.n; });
      mid /= qs.length; disp /= qs.length;
      cells.push({
        id: CELLS[c].id, code: CELLS[c].code, key: CELLS[c].key,
        middle: mid, dispersion: disp, percent: pct(mid), n: n,
        color: colorOf(mid), border: borderOf(n, disp),
        questions: qs.map(function (x) { return x.i; }),
      });
    }
    return {
      participants: responses.length,
      questions: questions,
      cells: cells,
      norms: { upperMiddle: NORMS.upperMiddle, lowerMiddle: NORMS.lowerMiddle, upperPercent: pct(NORMS.upperMiddle), lowerPercent: pct(NORMS.lowerMiddle) },
    };
  }

  function validAnswers(a) {
    if (!a || a.length !== QUESTION_CATS.length) return false;
    for (var i = 0; i < a.length; i++) { var v = Number(a[i]); if (!(v >= 1 && v <= 5 && Math.floor(v) === v)) return false; }
    return true;
  }
  function cellById(result, id) { for (var i = 0; i < result.cells.length; i++) if (result.cells[i].id === id) return result.cells[i]; return null; }

  return {
    NORMS: NORMS, CELLS: CELLS, QUESTION_CATS: QUESTION_CATS, RADARS: RADARS, COUNT: QUESTION_CATS.length,
    questionStats: questionStats, score: score, validAnswers: validAnswers, cellById: cellById,
    colorOf: colorOf, borderOf: borderOf,
  };
})();

/* Shared PDF helpers (jsPDF + Montserrat). Bundled inside each widget and the admin. */
var JSPDF_URL = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
var PDF_ASSETS = {};
function getPdfAssets(base) {
  if (PDF_ASSETS[base]) return PDF_ASSETS[base];
  var jsp = (window.jspdf && window.jspdf.jsPDF) ? Promise.resolve() : loadScript(JSPDF_URL);
  var f = function (n) { return fetchB64(base + 'fonts/Montserrat-' + n + '.ttf'); };
  var img = function (n) { return fetchB64(base + n).then(function (b) { return 'data:image/png;base64,' + b; }).catch(function () { return null; }); };
  var p = Promise.all([jsp, f('Light'), f('Regular'), f('SemiBold'), f('Bold'), img('adizes-logo-color.png'), img('adizes-logo-color-white.png'), img('arrow-red.png'), img('arrow-white.png')])
    .then(function (a) { return { fonts: { Light: a[1], Regular: a[2], SemiBold: a[3], Bold: a[4] }, logo: a[5], logoWhite: a[6], arrowRed: a[7], arrowWhite: a[8] }; });
  p.catch(function () { delete PDF_ASSETS[base]; });
  PDF_ASSETS[base] = p;
  return p;
}

function hexRgb(hex) { var n = parseInt(hex.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }

var PDF_C = {
  INK: '#111111', MUTED: '#5f6368', SOFT: '#8a8f96', LINE: '#e4e4e4', PAPER: '#f5f5f5', RED: '#d7141a', WHITE: '#ffffff',
  green: '#1e8e4e', yellow: '#d9a400', red: '#d7141a', yellowText: '#9a7200',
  greenT: '#dcf2e5', yellowT: '#fff0bf', redT: '#fbd6d7',
};

// New letter-size document with Montserrat registered as family 'M' (light/regular/semibold/bold).
function newPdf(A) {
  var doc = new window.jspdf.jsPDF({ unit: 'pt', format: 'letter', compress: true });
  ['Light', 'Regular', 'SemiBold', 'Bold'].forEach(function (w) {
    doc.addFileToVFS('M-' + w + '.ttf', A.fonts[w]);
    doc.addFont('M-' + w + '.ttf', 'M', w.toLowerCase());
  });
  return doc;
}

function pdfKit(doc) {
  var K = {};
  K.font = function (w, size, color) { doc.setFont('M', w); doc.setFontSize(size); doc.setTextColor.apply(doc, hexRgb(color || PDF_C.INK)); };
  K.fill = function (c) { doc.setFillColor.apply(doc, hexRgb(c)); };
  K.stroke = function (c, w) { doc.setDrawColor.apply(doc, hexRgb(c)); if (w != null) doc.setLineWidth(w); };
  K.dash = function (arr) { if (doc.setLineDashPattern) doc.setLineDashPattern(arr || [], 0); };
  K.alpha = function (a) { if (doc.setGState) doc.setGState(new doc.GState({ opacity: a })); };
  K.split = function (text, width, w, size) { doc.setFont('M', w); doc.setFontSize(size); return doc.splitTextToSize(String(text), width); };
  // Wrapped text with **bold** spans. Returns the y after the last line.
  K.rich = function (text, x, y, width, size, opts) {
    opts = opts || {};
    var lh = size * (opts.lh || 1.5), color = opts.color || PDF_C.INK, bcolor = opts.bold || color;
    var reg = opts.weight || 'regular', bw = opts.boldWeight || 'bold';
    var tokens = [];
    String(text).split(/(\*\*.+?\*\*)/).forEach(function (part) {
      if (!part) return;
      var b = /^\*\*.+\*\*$/.test(part); if (b) part = part.slice(2, -2);
      part.split(/(\s+)/).forEach(function (w) { if (w) tokens.push({ w: w, b: b }); });
    });
    var lines = [[]], lw = 0;
    tokens.forEach(function (tk) {
      doc.setFont('M', tk.b ? bw : reg); doc.setFontSize(size);
      var tw = doc.getTextWidth(tk.w), space = /^\s+$/.test(tk.w);
      if (!space && lw + tw > width && lines[lines.length - 1].length) { lines.push([]); lw = 0; }
      if (space && !lines[lines.length - 1].length) return;
      lines[lines.length - 1].push({ w: tk.w, b: tk.b, tw: tw }); lw += tw;
    });
    lines.forEach(function (ln) {
      while (ln.length && /^\s+$/.test(ln[ln.length - 1].w)) ln.pop();
      var cx = x;
      if (opts.align === 'center') { var tot = ln.reduce(function (a, b) { return a + b.tw; }, 0); cx = x + (width - tot) / 2; }
      ln.forEach(function (tk) {
        K.font(tk.b ? bw : reg, size, tk.b ? bcolor : color);
        if (!/^\s+$/.test(tk.w)) doc.text(tk.w, cx, y);
        cx += tk.tw;
      });
      y += lh;
    });
    return y;
  };
  K.richHeight = function (text, width, size, opts) {
    opts = opts || {};
    return K.split(String(text).replace(/\*\*/g, ''), width, opts.weight || 'regular', size).length * size * (opts.lh || 1.5);
  };
  // Down arrow (line + head)
  K.arrowDown = function (x, y1, y2, color, w) {
    K.stroke(color || PDF_C.INK, w || 1.4); K.dash([]); doc.line(x, y1, x, y2 - 4);
    K.fill(color || PDF_C.INK); doc.triangle(x - 4, y2 - 5, x + 4, y2 - 5, x, y2, 'F');
  };
  return K;
}

/* Radar chart: values in 0–100 (%), labels per axis, clockwise from the top. */
function pdfRadar(doc, K, cx, cy, R, values, labels, opts) {
  opts = opts || {};
  var n = values.length;
  function pt(i, pct) { var a = (-90 + i * 360 / n) * Math.PI / 180; return [cx + R * pct / 100 * Math.cos(a), cy + R * pct / 100 * Math.sin(a)]; }
  function poly(pct) { var p = []; for (var i = 0; i < n; i++) p.push(pt(i, pct)); return p; }
  function path(points, style) {
    var rel = []; for (var i = 1; i < points.length; i++) rel.push([points[i][0] - points[i - 1][0], points[i][1] - points[i - 1][1]]);
    doc.lines(rel, points[0][0], points[0][1], [1, 1], style, true);
  }
  // grid
  K.dash([]);
  [25, 50, 75, 100].forEach(function (g) { K.stroke(PDF_C.LINE, 0.7); path(poly(g), 'S'); });
  for (var i = 0; i < n; i++) { var e = pt(i, 100); K.stroke(PDF_C.LINE, 0.7); doc.line(cx, cy, e[0], e[1]); }
  K.font('regular', 6.5, PDF_C.SOFT);
  [25, 50, 75, 100].forEach(function (g) { doc.text(g + '%', cx + 3, cy - R * g / 100 + 8); });
  // reference rings
  [[opts.normal || 75, PDF_C.green], [opts.abnormal || 50, PDF_C.red]].forEach(function (rf) {
    K.stroke(rf[1], 1); K.dash([2.5, 2]); path(poly(rf[0]), 'S'); K.dash([]);
    poly(rf[0]).forEach(function (p) { K.fill(rf[1]); doc.circle(p[0], p[1], 1.6, 'F'); });
  });
  // company
  var pts = values.map(function (v, k) { return pt(k, Math.max(0, Math.min(100, v))); });
  K.alpha(0.12); K.fill(PDF_C.INK); path(pts, 'F'); K.alpha(1);
  K.stroke(PDF_C.INK, 1.6); path(pts, 'S');
  pts.forEach(function (p, k) { K.fill(PDF_C.WHITE); K.stroke(PDF_C.INK, 1.2); doc.circle(p[0], p[1], 2.8, 'FD'); });
  // labels + values
  for (var j = 0; j < n; j++) {
    var a = (-90 + j * 360 / n) * Math.PI / 180, lx = cx + (R + 14) * Math.cos(a), ly = cy + (R + 14) * Math.sin(a);
    var align = Math.abs(Math.cos(a)) < 0.2 ? 'center' : Math.cos(a) > 0 ? 'left' : 'right';
    var lines = K.split(labels[j], 104, 'semibold', 8);
    var top = Math.sin(a) < -0.2 ? ly - (lines.length - 1) * 10 - 9 : Math.sin(a) > 0.2 ? ly + 6 : ly - (lines.length * 10) / 2 + 3;
    K.font('semibold', 8, PDF_C.INK);
    lines.forEach(function (l, k) { doc.text(l, lx, top + k * 10, { align: align }); });
    K.font('bold', 8, (opts.colors && opts.colors[j]) || PDF_C.RED);
    doc.text(Math.round(values[j]) + '%', lx, top + lines.length * 10, { align: align });
  }
}

/* Express Diagnostics — PDF report (jsPDF). Used by the widget (one person) and the admin (team).
 * d = { result: ED.score(...), company, participants: [names], dateIso, calendlyUrl }
 */
var ED_DIAGRAM = {
  culture: ['values', 'climate'],
  causes: [['planning', 'responsibility', 'authority'], ['information', 'corrective', 'reward']],
  subsystems: [['client', 'transformation'], ['human', 'financial']],
  manifestations: [['inefficiency', 'behaviour'], ['changes', 'ineffectiveness']],
};
function edCellByKey(result, key) { for (var i = 0; i < result.cells.length; i++) if (result.cells[i].key === key) return result.cells[i]; return null; }
function edQuestionText(t, q) { var x = t.questions[q.i]; return q.zone === 2 ? (x.z2 || x.t) : q.zone === 3 ? (x.z3 || x.t) : x.t; }
function edCounts(result) { var c = { red: 0, yellow: 0, green: 0 }; result.cells.forEach(function (x) { c[x.color]++; }); return c; }

function renderEdPdf(A, lang, d) {
  var t = ED_I18N[lang] || ED_I18N.en, r = d.result, team = r.participants > 1;
  var doc = newPdf(A), K = pdfKit(doc), C = PDF_C;
  var W = 612, H = 792, M = 54, CW = W - 2 * M;
  var dateStr = formatDate(d.dateIso, t.locale);
  var page = 1;
  var textColor = { green: C.green, yellow: C.yellowText, red: C.red };

  function footer() {
    K.font('regular', 7.5, C.SOFT);
    doc.text(t.pdf.footer + (d.company ? '  ·  ' + d.company : ''), M, H - 30);
    doc.text(t.pdf.page + ' ' + page, W - M, H - 30, { align: 'right' });
    K.stroke(C.LINE, 0.6); K.dash([]); doc.line(M, H - 44, W - M, H - 44);
  }
  function newPage() { footer(); doc.addPage(); page++; }
  function heading(text, y, size) {
    K.fill(C.RED); doc.rect(M, y - (size || 20) + 2, 3, (size || 20) + 2, 'F');
    K.font('bold', size || 20, C.INK); doc.text(text, M + 12, y);
    return y;
  }
  // Coloured box with frame style
  function swatch(x, y, w, h, color, border, n) {
    K.fill(C[color + 'T']); doc.rect(x, y, w, h, 'F');
    K.dash([]);
    if (!team) { K.stroke(C[color], 0.8); doc.rect(x, y, w, h, 'S'); return; }
    if (border === 'thick') { K.stroke(C.INK, 2.2); doc.rect(x + 1.1, y + 1.1, w - 2.2, h - 2.2, 'S'); }
    else if (border === 'thin') { K.stroke(C.INK, 0.8); doc.rect(x, y, w, h, 'S'); }
    else { K.stroke(C.INK, 0.8); K.dash([1, 1.6]); doc.rect(x, y, w, h, 'S'); K.dash([]); }
  }
  function legend(y) {
    K.font('bold', 9.5, C.INK); doc.text(t.pdf.colorsTitle, M, y); y += 16;
    ['green', 'yellow', 'red'].forEach(function (c, i) {
      var x = M + i * (CW / 3);
      swatch(x, y - 9, 18, 12, c, 'dotted');
      K.font('regular', 8.5, C.INK); doc.text(K.split(t.colors[c], CW / 3 - 30, 'regular', 8.5), x + 24, y);
    });
    y += 24;
    if (team) {
      K.font('bold', 9.5, C.INK); doc.text(t.frames.title, M, y);
      var ftw = doc.getTextWidth(t.frames.title);
      K.font('regular', 8, C.MUTED); doc.text('  ·  ' + t.frames.sub, M + ftw, y);
      y += 16;
      ['dotted', 'thin', 'thick'].forEach(function (b, i) {
        var x = M + i * (CW / 3);
        swatch(x, y - 9, 18, 13, 'green', b);
        K.font('regular', 8, C.INK); doc.text(K.split(t.frames[b], CW / 3 - 30, 'regular', 8), x + 24, y);
      });
      y += 30;
    }
    return y;
  }

  /* ---------------- Page 1: cover ---------------- */
  if (A.logo) doc.addImage(A.logo, 'PNG', M, 50, 150, 50);
  var y = 200;
  K.font('bold', 38, C.INK); doc.text(t.pdf.title, M, y);
  K.font('light', 38, C.INK); doc.text(t.pdf.subtitle, M, y + 44);
  K.fill(C.RED); doc.rect(M, y + 64, 60, 4, 'F');
  y += 110;
  function meta(label, value) {
    K.font('semibold', 8, C.RED); doc.text(label.toUpperCase(), M, y);
    K.font('bold', 15, C.INK); doc.text(K.split(value, CW, 'bold', 15)[0] || '', M, y + 19);
    y += 44;
  }
  meta(t.pdf.company, d.company || '');
  meta(t.pdf.date, dateStr);
  K.font('semibold', 8, C.RED); doc.text((team ? t.pdf.participantsCount + ': ' + r.participants : t.pdf.participants).toUpperCase(), M, y);
  y += 17;
  var names = (d.participants || []).slice(0, 14);
  K.font('regular', 10.5, C.INK);
  names.forEach(function (nm, i) { doc.text((i + 1) + '.  ' + nm, M, y); y += 15; });
  if ((d.participants || []).length > names.length) { K.font('regular', 9.5, C.MUTED); doc.text('+ ' + (d.participants.length - names.length), M, y); y += 15; }
  K.font('regular', 9, C.MUTED); doc.text(t.pdf.design, M, y + 6);
  // at a glance
  var counts = edCounts(r), by = Math.max(y + 48, 470), bw = (CW - 16) / 3;
  K.font('bold', 9.5, C.INK); doc.text(t.pdf.summary, M, by - 10);
  ['red', 'yellow', 'green'].forEach(function (c, i) {
    var bx = M + i * (bw + 8);
    K.fill(C.PAPER); doc.rect(bx, by, bw, 62, 'F');
    K.fill(C[c]); doc.rect(bx, by, 4, 62, 'F');
    K.font('bold', 26, C.INK); doc.text(String(counts[c]), bx + 16, by + 34);
    K.font('semibold', 8.5, C.MUTED); doc.text(K.split(t.colorShort[c], bw - 60, 'semibold', 8.5), bx + 52, by + 25);
  });
  y = by + 90;
  K.font('bold', 9.5, C.INK); doc.text(t.pdf.howTitle, M, y);
  K.rich(t.pdf.howBody, M, y + 15, CW, 8.5, { color: C.MUTED, lh: 1.5 });

  /* ---------------- Page 2: causal diagram ---------------- */
  newPage();
  heading(t.diagram.title, 74, 15);
  y = 104;
  var bh = 32, gap = 6;
  function cellBox(key, x, yy, w) {
    var c = edCellByKey(r, key);
    swatch(x, yy, w, bh, c ? c.color : 'yellow', c ? c.border : 'dotted');
    var label = t.diagram.labels[key];
    var lines = K.split(label, w - 12, 'semibold', 8.5);
    K.font('semibold', 8.5, C.INK);
    var ty = yy + bh / 2 - (lines.length - 1) * 5 - 1;
    lines.forEach(function (l, i) { doc.text(l, x + w / 2, ty + i * 10, { align: 'center' }); });
    if (c) { K.font('bold', 7.5, textColor[c.color]); doc.text(Math.round(c.percent) + '%', x + w / 2, ty + lines.length * 10 - 0.5, { align: 'center' }); }
  }
  function frame(x, yy, w, h, title, fillc, dotted) {
    if (fillc) { K.fill(fillc); doc.rect(x, yy, w, h, 'F'); }
    K.stroke(dotted ? C.SOFT : C.INK, dotted ? 0.6 : 0.9); K.dash(dotted ? [1, 1.6] : []); doc.rect(x, yy, w, h, 'S'); K.dash([]);
    if (title) { K.font('bold', 9.5, C.INK); doc.text(title, x + w / 2, yy + 15, { align: 'center' }); }
  }
  // External
  frame(M, y, CW, 28, '', C.PAPER); K.font('bold', 10.5, C.INK); doc.text(t.diagram.external, W / 2, y + 18, { align: 'center' });
  K.arrowDown(W / 2, y + 28, y + 42);
  // Internal container
  var iy = y + 42, ih = 482;
  frame(M, iy, CW, ih, '', C.PAPER); K.font('bold', 10.5, C.INK); doc.text(t.diagram.internal, W / 2, iy + 18, { align: 'center' });
  var ix = M + 18, iw = CW - 36;
  // Systemic causes
  var sy = iy + 30, sh = 192;
  frame(ix, sy, iw, sh, t.diagram.causes, C.WHITE);
  var cx0 = ix + 12, cw0 = iw - 24;
  frame(cx0, sy + 24, cw0, 64, t.diagram.culture, null, true);
  var half = (cw0 - 12 - gap) / 2;
  cellBox('values', cx0 + 6, sy + 46, half);
  cellBox('climate', cx0 + 6 + half + gap, sy + 46, half);
  var third = (cw0 - 2 * gap) / 3;
  [0, 1, 2].forEach(function (k) { K.arrowDown(cx0 + third * k + gap * k + third / 2, sy + 92, sy + 106, C.SOFT, 1.2); });
  ED_DIAGRAM.causes.forEach(function (row, ri) {
    row.forEach(function (key, k) { cellBox(key, cx0 + k * (third + gap), sy + 110 + ri * (bh + gap), third); });
  });
  K.arrowDown(W / 2, sy + sh, sy + sh + 14);
  function block(title, rows, yy) {
    var hh = 30 + rows.length * (bh + gap) + 6;
    frame(ix, yy, iw, hh, title, C.WHITE);
    var w2 = (cw0 - gap) / 2;
    rows.forEach(function (row, ri) { row.forEach(function (key, k) { cellBox(key, cx0 + k * (w2 + gap), yy + 26 + ri * (bh + gap), w2); }); });
    return yy + hh;
  }
  var ny = block(t.diagram.subsystems, ED_DIAGRAM.subsystems, sy + sh + 14);
  K.arrowDown(W / 2, ny, ny + 14);
  block(t.diagram.manifestations, ED_DIAGRAM.manifestations, ny + 14);
  legend(iy + ih + 26);

  /* ---------------- Page 3: radars ---------------- */
  newPage();
  var titles = [t.radar.title1, t.radar.title2];
  ED.RADARS.forEach(function (ids, k) {
    var top = k === 0 ? 74 : 392;
    K.font('bold', 13, C.INK);
    var tl = K.split(titles[k], CW, 'bold', 13);
    tl.forEach(function (l, i) { doc.text(l, W / 2, top + i * 16, { align: 'center' }); });
    var cells = ids.map(function (id) { return ED.cellById(r, id); });
    pdfRadar(doc, K, W / 2, top + 150, 100, cells.map(function (c) { return c.percent; }), cells.map(function (c) { return t.cells[c.key]; }),
      { normal: r.norms.upperPercent, abnormal: r.norms.lowerPercent, colors: cells.map(function (c) { return textColor[c.color]; }) });
  });
  var ly = 722, items = [[C.green, t.radar.normal, true], [C.red, t.radar.abnormal, true], [C.INK, t.radar.yours, false]];
  items.forEach(function (it, i) {
    var lx = M + 30 + i * (CW / 3);
    K.stroke(it[0], it[2] ? 1 : 1.6); K.dash(it[2] ? [2.5, 2] : []); doc.line(lx, ly - 3, lx + 22, ly - 3); K.dash([]);
    K.font('regular', 9, C.INK); doc.text(it[1], lx + 30, ly);
  });

  /* ---------------- Pages 4+: key organizational factors ---------------- */
  newPage();
  heading(t.pdf.keyFactors, 74, 18);
  K.font('regular', 9, C.MUTED); doc.text(t.pdf.keyFactorsHelp, M, 96);
  y = legend(122) + 6;
  var textW = CW - 40;
  r.cells.forEach(function (c, ci) {
    var rows = c.questions.map(function (qi) {
      var q = r.questions[qi], txt = edQuestionText(t, q);
      var lines = K.split(txt, textW, 'regular', 9.5), extra = 0;
      if (q.zone === 0) {
        K.font('regular', 9.5, C.INK); var lw = doc.getTextWidth(lines[lines.length - 1]);
        K.font('regular', 8, C.SOFT); if (lw + doc.getTextWidth('  ·  ' + t.noAnswer) > textW) extra = 12;
      }
      return { q: q, lines: lines, h: Math.max(20, lines.length * 12.5 + 7 + extra) };
    });
    if (y + 30 + rows[0].h > H - 60) { newPage(); y = 70; }
    K.font('bold', 11.5, C.INK); doc.text((ci + 1) + '. ' + t.cells[c.key], M, y);
    var pct = Math.round(c.percent) + '%  ·  ' + t.colorShort[c.color];
    K.font('semibold', 8.5, textColor[c.color]); doc.text(pct, W - M, y, { align: 'right' });
    y += 10;
    rows.forEach(function (row) {
      if (y + row.h > H - 60) {
        newPage(); y = 70;
        K.font('bold', 11.5, C.SOFT); doc.text((ci + 1) + '. ' + t.cells[c.key] + ' (' + t.pdf.cont + ')', M, y); y += 10;
      }
      swatch(M, y + 2, 24, 16, row.q.color, row.q.border);
      K.font('regular', 9.5, C.INK);
      var ty = y + 13;
      row.lines.forEach(function (l, i) { doc.text(l, M + 36, ty + i * 12.5); });
      if (row.q.zone === 0) {
        K.font('regular', 9.5, C.INK);
        var lw = doc.getTextWidth(row.lines[row.lines.length - 1]), sfx = '  ·  ' + t.noAnswer;
        K.font('regular', 8, C.SOFT);
        if (lw + doc.getTextWidth(sfx) > textW) doc.text(t.noAnswer, M + 36, ty + row.lines.length * 12.5);
        else doc.text(sfx, M + 36 + lw, ty + (row.lines.length - 1) * 12.5);
      }
      y += row.h + 3;
    });
    y += 16;
  });

  /* ---------------- Last page: next step ---------------- */
  newPage();
  var top = 96;
  if (A.arrowRed) doc.addImage(A.arrowRed, 'PNG', M, top - 36, 44, 31);
  K.font('bold', 24, C.INK); doc.text(K.split(t.pdf.nextStep, CW, 'bold', 24), M, top + 30);
  y = K.rich(t.pdf.nextBody, M, top + 70, CW, 11, { color: C.INK, lh: 1.6 }) + 6;
  y = K.rich(t.results.sessionBody, M, y, CW, 11, { color: C.INK, lh: 1.6 }) + 22;
  var cta = t.pdf.nextCta + '  →';
  K.font('bold', 12, C.WHITE); var cw = doc.getTextWidth(cta) + 44;
  K.fill(C.RED); doc.roundedRect(M, y, cw, 40, 6, 6, 'F');
  K.font('bold', 12, C.WHITE); doc.text(cta, M + 22, y + 25);
  if (d.calendlyUrl) doc.link(M, y, cw, 40, { url: d.calendlyUrl });
  // black closing band
  K.fill(C.INK); doc.rect(0, H - 250, W, 250, 'F');
  if (A.logoWhite) doc.addImage(A.logoWhite, 'PNG', M, H - 200, 135, 45);
  K.font('regular', 9.5, '#bdbdbd'); doc.text('www.adizes.com', M, H - 130);
  if (A.arrowWhite) { K.alpha(0.08); doc.addImage(A.arrowWhite, 'PNG', W - 260, H - 230, 240, 170); K.alpha(1); }
  K.font('regular', 7.5, '#8a8a8a');
  doc.text(t.pdf.footer, M, H - 30); doc.text(t.pdf.page + ' ' + page, W - M, H - 30, { align: 'right' });

  doc.setProperties({ title: t.pdf.title + ' — ' + (d.company || ''), author: 'Adizes Institute', creator: 'Adizes Institute' });
  return doc;
}

/* Express Diagnostics — on-screen visuals (HTML causal map + SVG radar). Class names use the "adz-" prefix. */
function edDiagramHtml(t, r) {
  function cell(key) {
    var c = edCellByKey(r, key);
    return '<div class="adz-cell is-' + c.color + (r.participants > 1 ? ' is-' + c.border : '') + '">' +
      '<span>' + esc(t.diagram.labels[key]) + '</span><b>' + Math.round(c.percent) + '%</b></div>';
  }
  function rows(list, cls) { return list.map(function (row) { return '<div class="adz-row ' + cls + '">' + row.map(cell).join('') + '</div>'; }).join(''); }
  var D = ED_DIAGRAM, arrow = '<div class="adz-arrow" aria-hidden="true"></div>';
  return '<div class="adz-diagram">' +
    '<div class="adz-box adz-box--ext">' + esc(t.diagram.external) + '</div>' + arrow +
    '<div class="adz-box adz-box--int"><div class="adz-box-t">' + esc(t.diagram.internal) + '</div>' +
      '<div class="adz-box adz-box--white"><div class="adz-box-t">' + esc(t.diagram.causes) + '</div>' +
        '<div class="adz-culture"><div class="adz-box-t">' + esc(t.diagram.culture) + '</div>' + rows([D.culture], 'adz-row--2') + '</div>' +
        rows(D.causes, 'adz-row--3') +
      '</div>' + arrow +
      '<div class="adz-box adz-box--white"><div class="adz-box-t">' + esc(t.diagram.subsystems) + '</div>' + rows(D.subsystems, 'adz-row--2') + '</div>' + arrow +
      '<div class="adz-box adz-box--white"><div class="adz-box-t">' + esc(t.diagram.manifestations) + '</div>' + rows(D.manifestations, 'adz-row--2') + '</div>' +
    '</div></div>';
}

function edRadarSvg(t, r, ids, title) {
  var n = ids.length, S = 360, cx = S / 2, cy = S / 2, R = 112;
  var cells = ids.map(function (id) { return ED.cellById(r, id); });
  function pt(i, pct) { var a = (-90 + i * 360 / n) * Math.PI / 180; return [cx + R * pct / 100 * Math.cos(a), cy + R * pct / 100 * Math.sin(a)]; }
  function poly(pct) { var p = []; for (var i = 0; i < n; i++) p.push(pt(i, pct).map(function (v) { return v.toFixed(1); }).join(',')); return p.join(' '); }
  var g = '';
  [25, 50, 75, 100].forEach(function (v) { g += '<polygon points="' + poly(v) + '" class="adz-grid"/>'; });
  for (var i = 0; i < n; i++) { var e = pt(i, 100); g += '<line x1="' + cx + '" y1="' + cy + '" x2="' + e[0].toFixed(1) + '" y2="' + e[1].toFixed(1) + '" class="adz-grid"/>'; }
  g += '<polygon points="' + poly(r.norms.upperPercent) + '" class="adz-ref adz-ref--ok"/>';
  g += '<polygon points="' + poly(r.norms.lowerPercent) + '" class="adz-ref adz-ref--bad"/>';
  var you = cells.map(function (c, k) { return pt(k, Math.max(0, Math.min(100, c.percent))).map(function (v) { return v.toFixed(1); }).join(','); }).join(' ');
  g += '<polygon points="' + you + '" class="adz-you"/>';
  cells.forEach(function (c, k) { var p = pt(k, Math.max(0, Math.min(100, c.percent))); g += '<circle cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="3.5" class="adz-dot"/>'; });
  cells.forEach(function (c, k) {
    var a = (-90 + k * 360 / n) * Math.PI / 180, lx = cx + (R + 16) * Math.cos(a), ly = cy + (R + 16) * Math.sin(a);
    var anchor = Math.abs(Math.cos(a)) < 0.2 ? 'middle' : Math.cos(a) > 0 ? 'start' : 'end';
    var dy = Math.sin(a) < -0.2 ? -8 : Math.sin(a) > 0.2 ? 12 : 2;
    var words = t.cells[c.key].split(' '), lines = [], cur = '';
    words.forEach(function (w) { if ((cur + ' ' + w).trim().length > 14 && cur) { lines.push(cur); cur = w; } else cur = (cur + ' ' + w).trim(); });
    lines.push(cur);
    var base = ly + dy - (Math.sin(a) < -0.2 ? (lines.length - 1) * 12 : 0);
    g += '<text x="' + lx.toFixed(1) + '" y="' + base.toFixed(1) + '" text-anchor="' + anchor + '" class="adz-lbl">' +
      lines.map(function (l, j) { return '<tspan x="' + lx.toFixed(1) + '" dy="' + (j ? 12 : 0) + '">' + esc(l) + '</tspan>'; }).join('') +
      '<tspan x="' + lx.toFixed(1) + '" dy="12" class="adz-val is-' + c.color + '">' + Math.round(c.percent) + '%</tspan></text>';
  });
  return '<figure class="adz-radar"><figcaption>' + esc(title) + '</figcaption><svg viewBox="-60 -10 ' + (S + 120) + ' ' + (S + 30) + '" role="img" aria-label="' + esc(title) + '">' + g + '</svg></figure>';
}

/* Express Diagnostics — widget (individual mode).
 * Embed:
 *   <div id="ed-assessment"></div>
 *   <script>window.ED_CONFIG = { endpoint: 'https://script.google.com/macros/s/XXX/exec' };</script>
 *   <script src="https://cdn.jsdelivr.net/gh/Adizes/alis-sample@vX/express-diagnostics/dist/express-diagnostics.min.js" defer></script>
 * Bundled by build.mjs together with: i18n files, shared/core.js, shared/ed-engine.js, shared/pdfkit.js,
 * shared/ed-report.js, shared/ed-visuals.js.
 */
var VERSION = "1.0.0";
var CSS = "__ROOT__ {\n--ink: #111111;\n--ink-2: #3a3a3a;\n--muted: #6b6f76;\n--soft: #9aa0a6;\n--line: #e6e6e6;\n--paper: #f6f6f6;\n--white: #ffffff;\n--red: #d7141a;\n--red-dark: #b10f14;\n--red-tint: #fdecec;\n--green: #1e8e4e; --green-t: #dcf2e5;\n--yellow: #d9a400; --yellow-ink: #8a6500; --yellow-t: #fff0bf;\n--red-t: #fbd6d7;\ndisplay: block; width: 100%;\nfont-family: 'Montserrat', system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif;\ncolor: var(--ink); line-height: 1.5; text-align: left;\n-webkit-font-smoothing: antialiased;\n}\n__ROOT__ *, __ROOT__ *::before, __ROOT__ *::after {\nbox-sizing: border-box; margin: 0; padding: 0; border: 0;\nfont: inherit; color: inherit; letter-spacing: normal; text-transform: none;\nbackground: none; box-shadow: none; text-decoration: none; list-style: none;\n}\n__ROOT__ strong, __ROOT__ b { font-weight: 700; }\n__ROOT__ em { font-style: normal; color: var(--soft); }\n__ROOT__ button { cursor: pointer; -webkit-appearance: none; appearance: none; line-height: 1.3; }\n__ROOT__ button:focus-visible, __ROOT__ a:focus-visible, __ROOT__ input:focus-visible, __ROOT__ textarea:focus-visible, __ROOT__ select:focus-visible {\noutline: 3px solid rgba(215, 20, 26, .35); outline-offset: 2px;\n}\n__ROOT__ a { color: inherit; }\n__ROOT__ [hidden] { display: none !important; }\n__ROOT__ .adz-stage {\nbackground: var(--white); border: 1px solid var(--line); border-radius: 10px;\nmin-height: min(720px, 100svh); display: flex; flex-direction: column; overflow: hidden;\n}\n__ROOT__ .adz-top { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 22px 32px 14px; }\n__ROOT__ .adz-logo { display: block; height: 38px; width: auto; max-width: none; }\n__ROOT__ .adz-logo-txt { font-weight: 800; letter-spacing: .06em; color: var(--red); }\n__ROOT__ .adz-lang { display: inline-flex; border: 1px solid var(--line); border-radius: 6px; overflow: hidden; }\n__ROOT__ .adz-lang button { padding: 6px 11px; font-size: 12px; font-weight: 600; color: var(--muted); }\n__ROOT__ .adz-lang button[aria-pressed=\"true\"] { background: var(--ink); color: var(--white); }\n__ROOT__ .adz-progress { display: flex; gap: 3px; padding: 4px 32px 0; }\n__ROOT__ .adz-progress span { height: 3px; background: var(--line); border-radius: 2px; overflow: hidden; }\n__ROOT__ .adz-progress i { display: block; height: 100%; background: var(--red); transition: width .35s ease; }\n__ROOT__ .adz-body { flex: 1; display: flex; align-items: center; padding: 32px 32px 40px; }\n__ROOT__ .adz-screen { width: 100%; max-width: 760px; margin: 0 auto; animation: adzIn .35s ease both; }\n__ROOT__ .adz-screen.is-back { animation-name: adzBack; }\n@keyframes adzIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }\n@keyframes adzBack { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: none; } }\n__ROOT__ .adz-eyebrow { font-size: 12px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: var(--red); }\n__ROOT__ .adz-h1 { font-size: clamp(30px, 4.6vw, 46px); line-height: 1.12; font-weight: 700; margin: 12px 0 16px; letter-spacing: -.01em; }\n__ROOT__ .adz-h1--sm { font-size: clamp(26px, 3.6vw, 36px); }\n__ROOT__ .adz-lead { font-size: 17px; line-height: 1.6; color: var(--ink-2); max-width: 640px; }\n__ROOT__ .adz-list { margin: 22px 0; display: grid; gap: 10px; }\n__ROOT__ .adz-list li { position: relative; padding-left: 26px; font-size: 15.5px; color: var(--ink-2); }\n__ROOT__ .adz-list li::before { content: ''; position: absolute; left: 0; top: .62em; width: 12px; height: 2px; background: var(--red); }\n__ROOT__ .adz-note { font-size: 14px; color: var(--muted); max-width: 620px; border-left: 2px solid var(--line); padding-left: 14px; }\n__ROOT__ .adz-meta { margin-top: 18px; font-size: 13px; color: var(--soft); }\n__ROOT__ .adz-help { font-size: 14.5px; color: var(--muted); max-width: 680px; margin: 4px 0 18px; }\n__ROOT__ .adz-actions { display: flex; flex-wrap: wrap; align-items: center; gap: 14px; margin-top: 28px; }\n__ROOT__ .adz-actions--tight { margin-top: 0; }\n__ROOT__ .adz-btn {\ndisplay: inline-flex; align-items: center; justify-content: center; gap: 8px; min-height: 46px;\npadding: 12px 24px; border-radius: 6px; background: var(--red); color: var(--white);\nfont-size: 15px; font-weight: 600; transition: background .15s ease, transform .15s ease;\n}\n__ROOT__ .adz-btn:hover { background: var(--red-dark); }\n__ROOT__ .adz-btn:active { transform: translateY(1px); }\n__ROOT__ .adz-btn:disabled { opacity: .55; cursor: default; }\n__ROOT__ .adz-btn--ghost { background: transparent; color: var(--ink); border: 1px solid var(--ink); }\n__ROOT__ .adz-btn--ghost:hover { background: var(--ink); color: var(--white); }\n__ROOT__ .adz-btn--dark { background: var(--ink); }\n__ROOT__ .adz-btn--dark:hover { background: #000; }\n__ROOT__ .adz-hint { font-size: 12.5px; color: var(--soft); }\n__ROOT__ .adz-back { font-size: 14px; font-weight: 600; color: var(--muted); padding: 10px 2px; }\n__ROOT__ .adz-back:hover { color: var(--ink); }\n__ROOT__ .adz-nav { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-top: 28px; }\n__ROOT__ .adz-form { margin-top: 24px; display: grid; gap: 14px; max-width: 520px; }\n__ROOT__ .adz-field label { display: block; font-size: 13px; font-weight: 600; margin-bottom: 6px; color: var(--ink); }\n__ROOT__ .adz-field input[type=\"text\"], __ROOT__ .adz-field input[type=\"email\"], __ROOT__ .adz-field input:not([type]), __ROOT__ .adz-field select, __ROOT__ .adz-field textarea {\ndisplay: block; width: 100%; height: 48px; padding: 0 14px; border: 1px solid #cfcfcf; border-radius: 6px;\nbackground: var(--white); font-size: 16px; color: var(--ink); margin: 0;\n}\n__ROOT__ .adz-field textarea { height: auto; min-height: 96px; padding: 12px 14px; line-height: 1.5; resize: vertical; }\n__ROOT__ .adz-field input:focus, __ROOT__ .adz-field textarea:focus { border-color: var(--ink); outline: none; }\n__ROOT__ .adz-field input::placeholder, __ROOT__ .adz-field textarea::placeholder { color: #a5a5a5; }\n__ROOT__ .adz-err { display: none; font-size: 12.5px; color: var(--red); margin-top: 5px; }\n__ROOT__ .adz-field.has-error input { border-color: var(--red); }\n__ROOT__ .adz-field.has-error .adz-err { display: block; }\n__ROOT__ .adz-consent { display: flex !important; gap: 10px; align-items: flex-start; font-weight: 400 !important; font-size: 13.5px !important; color: var(--ink-2) !important; cursor: pointer; }\n__ROOT__ .adz-consent input { width: 18px; height: 18px; margin: 2px 0 0 !important; flex: none; accent-color: var(--red); -webkit-appearance: auto; appearance: auto; }\n__ROOT__ .adz-consent a { text-decoration: underline; }\n__ROOT__ .adz-loading { display: grid; justify-items: center; gap: 18px; text-align: center; padding: 40px 0; }\n__ROOT__ .adz-spinner { width: 40px; height: 40px; border-radius: 50%; border: 3px solid var(--line); border-top-color: var(--red); animation: adzSpin .8s linear infinite; }\n@keyframes adzSpin { to { transform: rotate(360deg); } }\n__ROOT__ .adz-card { background: var(--white); border: 1px solid var(--line); border-radius: 10px; padding: 28px; }\n__ROOT__ .adz-card h2 { font-size: 21px; font-weight: 700; line-height: 1.25; margin: 6px 0 10px; }\n__ROOT__ .adz-card p { font-size: 15px; color: var(--ink-2); margin-bottom: 20px; }\n__ROOT__ .adz-card--dark { background: var(--ink); border-color: var(--ink); color: var(--white); }\n__ROOT__ .adz-card--dark p { color: #cfcfcf; }\n@media (max-width: 640px) {\n__ROOT__ .adz-stage { border-radius: 0; border-left: 0; border-right: 0; }\n__ROOT__ .adz-top { padding: 16px 18px 12px; }\n__ROOT__ .adz-logo { height: 30px; }\n__ROOT__ .adz-progress { padding: 0 18px; gap: 2px; }\n__ROOT__ .adz-body { padding: 24px 18px 32px; align-items: flex-start; }\n__ROOT__ .adz-lead { font-size: 16px; }\n__ROOT__ .adz-card { padding: 22px; }\n}\n@media (prefers-reduced-motion: reduce) {\n__ROOT__ *, __ROOT__ *::before, __ROOT__ *::after { animation: none !important; transition: none !important; }\n}\n__ROOT__ .adz-qhead { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; }\n__ROOT__ .adz-count { font-size: 13px; font-weight: 600; color: var(--soft); white-space: nowrap; font-variant-numeric: tabular-nums; }\n__ROOT__ .adz-q { font-size: clamp(22px, 3vw, 30px); line-height: 1.3; font-weight: 600; margin: 16px 0 26px; min-height: 2.6em; }\n__ROOT__ .adz-scale { display: grid; gap: 10px; }\n__ROOT__ .adz-opt {\ndisplay: flex; align-items: center; gap: 16px; width: 100%; padding: 13px 16px; text-align: left;\nborder: 1px solid #d6d6d6; border-radius: 8px; background: var(--white); transition: border-color .15s, background .15s;\n}\n__ROOT__ .adz-opt:hover { border-color: var(--ink); }\n__ROOT__ .adz-opt[aria-checked=\"true\"] { border-color: var(--red); background: var(--red-tint); box-shadow: inset 0 0 0 1px var(--red); }\n__ROOT__ .adz-key {\nflex: none; width: 28px; height: 28px; border-radius: 6px; border: 1px solid #d6d6d6; display: grid; place-items: center;\nfont-size: 12.5px; font-weight: 700; color: var(--muted);\n}\n__ROOT__ .adz-opt[aria-checked=\"true\"] .adz-key { background: var(--red); border-color: var(--red); color: var(--white); }\n__ROOT__ .adz-opt-t { display: flex; flex-wrap: wrap; align-items: baseline; gap: 4px 12px; }\n__ROOT__ .adz-opt-t b { font-size: 16px; font-weight: 600; }\n__ROOT__ .adz-opt-t small { font-size: 13px; color: var(--muted); }\n__ROOT__ .adz-opt.is-pop { animation: adzPop .28s ease; }\n@keyframes adzPop { 50% { transform: scale(.985); } }\n__ROOT__ .adz-cannot {\nmargin-top: 14px; font-size: 14px; font-weight: 600; color: var(--muted); padding: 6px 2px;\nborder-bottom: 1px dashed #c4c4c4;\n}\n__ROOT__ .adz-cannot:hover { color: var(--ink); border-bottom-color: var(--ink); }\n__ROOT__ .adz-cannot[aria-pressed=\"true\"] { color: var(--red); border-bottom-color: var(--red); }\n__ROOT__ .adz-cannot[aria-pressed=\"true\"]::before { content: '● '; }\n__ROOT__ .adz-results { background: var(--white); border: 1px solid var(--line); border-radius: 10px; overflow: hidden; }\n__ROOT__ .adz-hero { padding: 26px 32px 34px; border-bottom: 1px solid var(--line); }\n__ROOT__ .adz-counts { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; margin-top: 26px; max-width: 640px; }\n__ROOT__ .adz-countbox { background: var(--paper); border-left: 4px solid; padding: 14px 16px; border-radius: 4px; }\n__ROOT__ .adz-countbox b { display: block; font-size: 30px; line-height: 1; font-weight: 700; }\n__ROOT__ .adz-countbox span { display: block; margin-top: 6px; font-size: 13px; color: var(--muted); font-weight: 600; }\n__ROOT__ .adz-countbox.is-red { border-color: var(--red); }\n__ROOT__ .adz-countbox.is-yellow { border-color: var(--yellow); }\n__ROOT__ .adz-countbox.is-green { border-color: var(--green); }\n__ROOT__ .adz-sec { padding: 34px 32px; border-bottom: 1px solid var(--line); }\n__ROOT__ .adz-sec h2 { font-size: 24px; font-weight: 700; line-height: 1.25; }\n__ROOT__ .adz-diagram { max-width: 760px; font-size: 13px; }\n__ROOT__ .adz-box { border: 1px solid var(--ink); padding: 10px; text-align: center; }\n__ROOT__ .adz-box--ext { background: var(--paper); font-weight: 700; padding: 10px; }\n__ROOT__ .adz-box--int { background: var(--paper); padding: 10px 14px 14px; }\n__ROOT__ .adz-box--white { background: var(--white); margin-top: 8px; padding: 8px 10px 10px; }\n__ROOT__ .adz-box-t { font-weight: 700; margin-bottom: 8px; font-size: 13px; }\n__ROOT__ .adz-culture { border: 1px dashed var(--soft); padding: 8px; margin-bottom: 8px; }\n__ROOT__ .adz-row { display: grid; gap: 6px; margin-top: 6px; }\n__ROOT__ .adz-row:first-of-type { margin-top: 0; }\n__ROOT__ .adz-row--2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }\n__ROOT__ .adz-row--3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }\n__ROOT__ .adz-cell { min-height: 46px; padding: 6px 8px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1px; border: 1px solid; line-height: 1.25; }\n__ROOT__ .adz-cell span { font-weight: 600; font-size: 12.5px; }\n__ROOT__ .adz-cell b { font-size: 11.5px; }\n__ROOT__ .adz-cell.is-green { background: var(--green-t); border-color: var(--green); }\n__ROOT__ .adz-cell.is-green b { color: var(--green); }\n__ROOT__ .adz-cell.is-yellow { background: var(--yellow-t); border-color: var(--yellow); }\n__ROOT__ .adz-cell.is-yellow b { color: var(--yellow-ink); }\n__ROOT__ .adz-cell.is-red { background: var(--red-t); border-color: var(--red); }\n__ROOT__ .adz-cell.is-red b { color: var(--red); }\n__ROOT__ .adz-cell.is-dotted { border: 1px dotted var(--ink); }\n__ROOT__ .adz-cell.is-thin { border: 1px solid var(--ink); }\n__ROOT__ .adz-cell.is-thick { border: 3px solid var(--ink); }\n__ROOT__ .adz-arrow { width: 2px; height: 16px; background: var(--ink); margin: 0 auto; position: relative; }\n__ROOT__ .adz-arrow::after { content: ''; position: absolute; left: -4px; bottom: -2px; border: 5px solid transparent; border-top: 6px solid var(--ink); border-bottom: 0; }\n__ROOT__ .adz-box--int > .adz-arrow { margin-top: 8px; margin-bottom: -6px; }\n__ROOT__ .adz-legend { display: flex; flex-wrap: wrap; gap: 10px 22px; margin-top: 18px; font-size: 13px; color: var(--ink-2); }\n__ROOT__ .adz-legend span { display: inline-flex; align-items: center; gap: 8px; }\n__ROOT__ .adz-legend i { width: 18px; height: 12px; border: 1px solid; }\n__ROOT__ .adz-legend .is-green i { background: var(--green-t); border-color: var(--green); }\n__ROOT__ .adz-legend .is-yellow i { background: var(--yellow-t); border-color: var(--yellow); }\n__ROOT__ .adz-legend .is-red i { background: var(--red-t); border-color: var(--red); }\n__ROOT__ .adz-legend--lines i { height: 0; border: 0; border-top: 2px dashed; }\n__ROOT__ .adz-legend--lines .is-ok i { border-color: var(--green); }\n__ROOT__ .adz-legend--lines .is-bad i { border-color: var(--red); }\n__ROOT__ .adz-legend--lines .is-you i { border-top: 2.5px solid var(--ink); }\n__ROOT__ .adz-radars { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 24px; }\n__ROOT__ .adz-radar figcaption { font-size: 14px; font-weight: 700; text-align: center; min-height: 2.8em; }\n__ROOT__ .adz-radar svg { display: block; width: 100%; height: auto; overflow: visible; }\n__ROOT__ .adz-grid { fill: none; stroke: #e2e2e2; stroke-width: 1; }\n__ROOT__ .adz-ref { fill: none; stroke-width: 1.4; stroke-dasharray: 4 3; }\n__ROOT__ .adz-ref--ok { stroke: var(--green); }\n__ROOT__ .adz-ref--bad { stroke: var(--red); }\n__ROOT__ .adz-you { fill: rgba(17, 17, 17, .09); stroke: var(--ink); stroke-width: 2.2; stroke-linejoin: round; }\n__ROOT__ .adz-dot { fill: var(--white); stroke: var(--ink); stroke-width: 2; }\n__ROOT__ .adz-lbl { font: 600 11.5px Montserrat, Arial, sans-serif; fill: var(--ink); }\n__ROOT__ .adz-val { font-weight: 700; }\n__ROOT__ .adz-val.is-green { fill: var(--green); }\n__ROOT__ .adz-val.is-yellow { fill: var(--yellow-ink); }\n__ROOT__ .adz-val.is-red { fill: var(--red); }\n__ROOT__ .adz-focus { border: 1px solid var(--line); border-left: 4px solid var(--red); border-radius: 4px; padding: 16px 18px; margin-top: 12px; }\n__ROOT__ .adz-focus.is-yellow { border-left-color: var(--yellow); }\n__ROOT__ .adz-focus-h { display: flex; justify-content: space-between; gap: 12px; font-size: 16px; }\n__ROOT__ .adz-focus-h span { font-weight: 700; color: var(--red); }\n__ROOT__ .adz-focus.is-yellow .adz-focus-h span { color: var(--yellow-ink); }\n__ROOT__ .adz-focus ul { margin-top: 10px; display: grid; gap: 7px; }\n__ROOT__ .adz-focus li { position: relative; padding-left: 18px; font-size: 14.5px; color: var(--ink-2); }\n__ROOT__ .adz-focus li::before { content: ''; position: absolute; left: 0; top: .5em; width: 8px; height: 8px; border-radius: 2px; background: var(--red); }\n__ROOT__ .adz-focus li.is-yellow::before { background: var(--yellow); }\n__ROOT__ .adz-split { display: grid; grid-template-columns: 1.3fr 1fr; gap: 16px; padding: 32px; }\n__ROOT__ .adz-status { min-height: 3em; }\n__ROOT__ .adz-foot { padding: 0 32px 30px; text-align: center; }\n__ROOT__ .adz-foot button { font-size: 13.5px; font-weight: 600; color: var(--muted); text-decoration: underline; }\n@media (max-width: 760px) {\n__ROOT__ .adz-radars { grid-template-columns: 1fr; }\n__ROOT__ .adz-split { grid-template-columns: 1fr; padding: 22px 18px; }\n}\n@media (max-width: 640px) {\n__ROOT__ .adz-results { border-radius: 0; border-left: 0; border-right: 0; }\n__ROOT__ .adz-hero, __ROOT__ .adz-sec { padding-left: 18px; padding-right: 18px; }\n__ROOT__ .adz-counts { gap: 8px; }\n__ROOT__ .adz-countbox { padding: 12px; }\n__ROOT__ .adz-countbox b { font-size: 24px; }\n__ROOT__ .adz-countbox span { font-size: 11.5px; }\n__ROOT__ .adz-hint--keys { display: none; }\n__ROOT__ .adz-q { min-height: 0; }\n__ROOT__ .adz-opt { padding: 12px 14px; }\n__ROOT__ .adz-cell span { font-size: 11px; }\n__ROOT__ .adz-box--int { padding: 8px; }\n__ROOT__ .adz-box--white { padding: 6px; }\n__ROOT__ .adz-row--3 { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 4px; }\n__ROOT__ .adz-cell { padding: 5px 3px; min-height: 44px; }\n__ROOT__ .adz-lbl { font-size: 14px; }\n__ROOT__ .adz-radar svg { margin: 0 -8px; width: calc(100% + 16px); }\n}";
var I18N = ED_I18N;
var N = ED.COUNT;

var DEFAULTS = {
  mount: '#ed-assessment',
  endpoint: '',                         // Apps Script web app URL ('' = demo mode, nothing is saved)
  lang: 'auto',
  languages: Object.keys(I18N),
  calendlyUrl: 'https://calendly.com/jaime-morales/30min',
  privacyUrl: { en: 'https://www.adizes.com/privacy-policy', es: 'https://www.adizes.com/privacy-policy' },
  assetsBase: '',
  storageKey: 'adz-ed:v1',
  loadFont: true,
};

// Step list: one step per statement, then the contact gate.
function sectionOf(q) { var cat = ED.QUESTION_CATS[q]; for (var i = 0; i < ED.CELLS.length; i++) if (ED.CELLS[i].id === cat) return i; return 0; }
var FIRST_OF_SECTION = {};
for (var qi = 0; qi < N; qi++) { var s0 = sectionOf(qi); if (FIRST_OF_SECTION[s0] == null) FIRST_OF_SECTION[s0] = qi; }

function App(el, cfg) {
  this.el = el; this.cfg = cfg;
  this.lang = this.pickLang();
  this.state = this.fresh();
  this.busy = false; this.dir = 1;
  this.root = document.createElement('div');
  this.root.className = 'adz';
  el.innerHTML = ''; el.appendChild(this.root);
  var saved = load(cfg.storageKey);
  if (saved && saved.result) { this.state = saved; this.renderResults(); }
  else if (saved && (saved.step > 0 || (saved.answers || []).some(Boolean))) { this.saved = saved; this.renderResume(); }
  else this.renderIntro();
  var self = this;
  this.onKey = function (e) { self.key(e); };
  document.addEventListener('keydown', this.onKey);
}
App.prototype.fresh = function () { return { step: 0, answers: [], contact: {}, startedAt: new Date().toISOString() }; };
App.prototype.t = function () { return I18N[this.lang] || I18N.en; };
App.prototype.pickLang = function () {
  var avail = this.cfg.languages.filter(function (l) { return I18N[l]; });
  var want = qs('lang') || (this.cfg.lang !== 'auto' ? this.cfg.lang : '') || ((load(this.cfg.storageKey) || {}).lang) ||
    ((navigator.language || 'en').slice(0, 2).toLowerCase());
  return avail.indexOf(want) >= 0 ? want : (avail.indexOf('en') >= 0 ? 'en' : avail[0]);
};
App.prototype.save = function () { this.state.lang = this.lang; store(this.cfg.storageKey, this.state); };

/* ---------- chrome ---------- */
App.prototype.logo = function () {
  var b = this.cfg.assetsBase;
  return b ? '<img class="adz-logo" alt="Adizes Institute" src="' + esc(b + 'adizes-logo-color.png') + '">' : '<span class="adz-logo-txt">ADIZES</span>';
};
App.prototype.langSwitch = function () {
  var self = this, langs = this.cfg.languages.filter(function (l) { return I18N[l]; });
  if (langs.length < 2) return '';
  return '<div class="adz-lang" role="group" aria-label="' + esc(this.t().ui.language) + '">' + langs.map(function (l) {
    return '<button type="button" data-lang="' + l + '" aria-pressed="' + (l === self.lang) + '">' + l.toUpperCase() + '</button>';
  }).join('') + '</div>';
};
App.prototype.progress = function () {
  var answered = this.state.step; // statements already passed
  return '<div class="adz-progress" aria-hidden="true">' + ED.CELLS.map(function (c, i) {
    var start = FIRST_OF_SECTION[i], len = ED.QUESTION_CATS.filter(function (x) { return x === c.id; }).length;
    var f = Math.max(0, Math.min(1, (answered - start) / len));
    return '<span style="flex:' + len + '"><i style="width:' + (f * 100) + '%"></i></span>';
  }).join('') + '</div>';
};
App.prototype.frame = function (inner, opts) {
  opts = opts || {};
  this.root.innerHTML =
    '<div class="adz-stage">' +
      '<div class="adz-top">' + this.logo() + (opts.lang !== false ? this.langSwitch() : '') + '</div>' +
      (opts.progress ? this.progress() : '') +
      '<div class="adz-body"><div class="adz-screen' + (this.dir < 0 ? ' is-back' : '') + '">' + inner + '</div></div>' +
    '</div>';
  this.bindLang();
  this.scrollTop();
};
App.prototype.scrollTop = function () {
  if (!this.mounted) { this.mounted = true; return; }
  var r = this.el.getBoundingClientRect();
  if (r.top < 0 || r.top > window.innerHeight * 0.4) {
    try { window.scrollTo({ top: window.pageYOffset + r.top - 10, behavior: 'smooth' }); } catch (e) { window.scrollTo(0, window.pageYOffset + r.top - 10); }
  }
};
App.prototype.bindLang = function () {
  var self = this;
  this.root.querySelectorAll('[data-lang]').forEach(function (b) {
    b.addEventListener('click', function () {
      self.lang = b.getAttribute('data-lang'); self.save(); self.dir = 1; self.mounted = false;
      if (self.state.result) self.renderResults();
      else if (self.view === 'intro') self.renderIntro();
      else if (self.view === 'resume') self.renderResume();
      else self.renderStep();
    });
  });
};

/* ---------- intro / resume ---------- */
App.prototype.renderIntro = function () {
  var t = this.t(), self = this;
  this.view = 'intro';
  this.frame(
    '<div class="adz-eyebrow">' + esc(t.intro.eyebrow) + '</div>' +
    '<h1 class="adz-h1">' + esc(t.intro.title) + '</h1>' +
    '<p class="adz-lead">' + esc(t.intro.body) + '</p>' +
    '<ul class="adz-list">' + t.intro.bullets.map(function (b) { return '<li>' + esc(b) + '</li>'; }).join('') + '</ul>' +
    '<p class="adz-note">' + esc(t.intro.note) + '</p>' +
    '<div class="adz-actions"><button type="button" class="adz-btn" data-act="start">' + esc(t.ui.start) + ' →</button>' +
    '<span class="adz-hint">' + esc(t.ui.pressEnter) + '</span></div>' +
    '<p class="adz-meta">' + esc(t.ui.minutes) + '</p>');
  this.root.querySelector('[data-act="start"]').addEventListener('click', function () { self.start(); });
};
App.prototype.start = function () { this.state = this.fresh(); this.dir = 1; this.save(); this.renderStep(); };
App.prototype.renderResume = function () {
  var t = this.t(), self = this;
  this.view = 'resume';
  this.frame(
    '<div class="adz-eyebrow">' + esc(t.intro.eyebrow) + '</div>' +
    '<h1 class="adz-h1 adz-h1--sm">' + esc(t.ui.resume) + '</h1>' +
    '<div class="adz-actions"><button type="button" class="adz-btn" data-act="yes">' + esc(t.ui.resumeYes) + ' →</button>' +
    '<button type="button" class="adz-btn adz-btn--ghost" data-act="no">' + esc(t.ui.resumeNo) + '</button></div>');
  this.root.querySelector('[data-act="yes"]').addEventListener('click', function () { self.state = self.saved; self.renderStep(); });
  this.root.querySelector('[data-act="no"]').addEventListener('click', function () { store(self.cfg.storageKey, null); self.renderIntro(); });
};

/* ---------- statements ---------- */
App.prototype.renderStep = function () {
  if (this.state.step >= N) return this.renderGate();
  var t = this.t(), self = this, q = this.state.step, sec = sectionOf(q), cell = ED.CELLS[sec];
  var cur = this.state.answers[q];
  this.view = 'step';
  var html =
    '<div class="adz-qhead"><div class="adz-eyebrow">' + esc(t.ui.section) + ' ' + (sec + 1) + '/16 · ' + esc(t.cells[cell.key]) + '</div>' +
    '<span class="adz-count">' + (q + 1) + ' ' + esc(t.ui.of) + ' ' + N + '</span></div>' +
    '<h2 class="adz-q">' + esc(t.questions[q].t) + '</h2>' +
    '<div class="adz-scale" role="radiogroup">' + t.scale.map(function (o, i) {
      return '<button type="button" role="radio" class="adz-opt" data-v="' + o.value + '" aria-checked="' + (cur === o.value) + '">' +
        '<span class="adz-key">' + (i + 1) + '</span><span class="adz-opt-t"><b>' + esc(o.label) + '</b><small>' + esc(o.sub) + '</small></span></button>';
    }).join('') + '</div>' +
    '<button type="button" class="adz-cannot" data-v="1" aria-pressed="' + (cur === 1) + '">' + esc(t.cannot) + '</button>' +
    '<div class="adz-nav">' +
      '<button type="button" class="adz-back" data-act="back"' + (q === 0 ? ' hidden' : '') + '>← ' + esc(t.ui.back) + '</button>' +
      '<div class="adz-actions adz-actions--tight"><span class="adz-hint adz-hint--keys">' + esc(t.ui.keyboardHint) + '</span>' +
      (cur ? '<button type="button" class="adz-btn adz-btn--ghost" data-act="next">' + esc(t.ui.next) + ' →</button>' : '') + '</div>' +
    '</div>';
  this.frame(html, { progress: true, lang: q === 0 });
  this.root.querySelectorAll('[data-v]').forEach(function (b) { b.addEventListener('click', function () { self.choose(Number(b.getAttribute('data-v')), b); }); });
  var back = this.root.querySelector('[data-act="back"]'); if (back) back.addEventListener('click', function () { self.back(); });
  var nxt = this.root.querySelector('[data-act="next"]'); if (nxt) nxt.addEventListener('click', function () { self.next(); });
};
App.prototype.choose = function (v, btn) {
  if (this.busy) return;
  this.state.answers[this.state.step] = v;
  this.root.querySelectorAll('.adz-opt').forEach(function (b) { b.setAttribute('aria-checked', String(Number(b.getAttribute('data-v')) === v)); });
  var c = this.root.querySelector('.adz-cannot'); if (c) c.setAttribute('aria-pressed', String(v === 1));
  if (btn) { btn.classList.remove('is-pop'); void btn.offsetWidth; btn.classList.add('is-pop'); }
  this.save();
  var self = this; this.busy = true;
  setTimeout(function () { self.busy = false; self.next(); }, 280);
};
App.prototype.next = function () {
  if (this.state.step < N && !this.state.answers[this.state.step]) return;
  this.state.step = Math.min(this.state.step + 1, N); this.dir = 1; this.save(); this.renderStep();
};
App.prototype.back = function () {
  if (this.state.step === 0) return;
  this.state.step--; this.dir = -1; this.save(); this.renderStep();
};
App.prototype.key = function (e) {
  if (!this.root.isConnected) { document.removeEventListener('keydown', this.onKey); return; }
  var tag = (e.target && e.target.tagName) || '';
  if (tag === 'INPUT' || tag === 'TEXTAREA' || e.metaKey || e.ctrlKey || e.altKey) return;
  if (this.view === 'intro' && e.key === 'Enter') {
    var r = this.el.getBoundingClientRect();
    if (r.top < window.innerHeight && r.bottom > 0) { e.preventDefault(); this.start(); }
    return;
  }
  if (this.view !== 'step') return;
  var t = this.t();
  if (/^[1-4]$/.test(e.key)) { e.preventDefault(); var v = t.scale[Number(e.key) - 1].value; this.choose(v, this.root.querySelector('.adz-opt[data-v="' + v + '"]')); return; }
  if (e.key === '0') { e.preventDefault(); this.choose(1, this.root.querySelector('.adz-cannot')); return; }
  if (e.key === 'Enter') { e.preventDefault(); this.next(); }
  if (e.key === 'Backspace') { e.preventDefault(); this.back(); }
};

/* ---------- gate ---------- */
App.prototype.renderGate = function () {
  var t = this.t(), g = t.gate, c = this.state.contact || {}, self = this;
  var privacy = (this.cfg.privacyUrl && (this.cfg.privacyUrl[this.lang] || this.cfg.privacyUrl.en)) || '#';
  var consent = esc(g.consent).replace('{privacy}', '<a href="' + esc(privacy) + '" target="_blank" rel="noopener">' + esc(g.privacy) + '</a>');
  this.view = 'gate';
  function field(n, type, label, ph, val, err, ac) {
    return '<div class="adz-field" data-f="' + n + '"><label for="adz-' + n + '">' + esc(label) + '</label>' +
      '<input id="adz-' + n + '" name="' + n + '" type="' + type + '" placeholder="' + esc(ph) + '" value="' + esc(val || '') + '" autocomplete="' + ac + '"' + (n === 'email' ? ' inputmode="email"' : '') + '>' +
      '<div class="adz-err">' + esc(err) + '</div></div>';
  }
  this.frame(
    '<div class="adz-eyebrow">' + esc(g.eyebrow) + '</div>' +
    '<h1 class="adz-h1 adz-h1--sm">' + esc(g.title) + '</h1>' +
    '<p class="adz-lead">' + esc(g.body) + '</p>' +
    '<form class="adz-form" novalidate>' +
      field('name', 'text', g.name, g.namePh, c.name, g.errName, 'name') +
      field('email', 'email', g.email, g.emailPh, c.email, g.errEmail, 'email') +
      field('company', 'text', g.company, g.companyPh, c.company, g.errCompany, 'organization') +
      '<div class="adz-field" data-f="consent"><label class="adz-consent"><input type="checkbox" name="consent"' + (c.consent ? ' checked' : '') + '><span>' + consent + '</span></label><div class="adz-err">' + esc(g.errConsent) + '</div></div>' +
      '<div class="adz-nav"><button type="button" class="adz-back" data-act="back">← ' + esc(t.ui.back) + '</button>' +
      '<button type="submit" class="adz-btn">' + esc(g.submit) + ' →</button></div>' +
    '</form>', { progress: true, lang: false });
  var form = this.root.querySelector('form');
  this.root.querySelector('[data-act="back"]').addEventListener('click', function () { self.back(); });
  form.addEventListener('input', function (e) { var f = e.target.closest('.adz-field'); if (f) f.classList.remove('has-error'); });
  form.addEventListener('submit', function (e) { e.preventDefault(); self.submit(form); });
};
App.prototype.submit = function (form) {
  var v = { name: form.name.value.trim().replace(/\s+/g, ' '), email: form.email.value.trim(), company: form.company.value.trim().replace(/\s+/g, ' '), consent: form.consent.checked };
  var bad = [];
  if (v.name.length < 2) bad.push('name');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email)) bad.push('email');
  if (!v.company) bad.push('company');
  if (!v.consent) bad.push('consent');
  form.querySelectorAll('.adz-field').forEach(function (f) { f.classList.toggle('has-error', bad.indexOf(f.getAttribute('data-f')) >= 0); });
  if (bad.length) { var el = form.querySelector('[name="' + bad[0] + '"]'); if (el) el.focus(); return; }
  this.state.contact = v; this.save(); this.send();
};
App.prototype.send = function () {
  var t = this.t(), self = this, s = this.state;
  this.view = 'loading';
  this.frame('<div class="adz-loading"><div class="adz-spinner"></div><p class="adz-lead">' + esc(t.ui.loading) + '</p></div>', { lang: false });
  var answers = s.answers.slice(0, N);
  var payload = { action: 'ed_submit', v: VERSION, lang: this.lang, answers: answers, contact: s.contact, meta: utmMeta(s.startedAt) };
  var started = Date.now();
  api(this.cfg.endpoint, payload, 30000).then(function (res) {
    setTimeout(function () {
      s.id = res.id; s.result = true; s.submittedAt = new Date().toISOString(); s.pdf = 'pending';
      self.save(); self.renderResults();
    }, Math.max(0, 1200 - (Date.now() - started)));
  }).catch(function () {
    self.frame('<div class="adz-loading"><p class="adz-lead">' + esc(t.ui.errorGeneric) + '</p>' +
      '<button type="button" class="adz-btn" data-act="retry">' + esc(t.ui.retry) + '</button></div>', { lang: false });
    self.root.querySelector('[data-act="retry"]').addEventListener('click', function () { self.send(); });
  });
};

/* ---------- results ---------- */
App.prototype.result = function () { return ED.score([this.state.answers.slice(0, N)]); };
App.prototype.renderResults = function () {
  var t = this.t(), R = t.results, s = this.state, r = this.result(), self = this;
  this.view = 'results';
  var counts = edCounts(r);
  var focus = r.cells.filter(function (c) { return c.color === 'red'; });
  var focusNote = '';
  if (!focus.length) { focus = r.cells.filter(function (c) { return c.color === 'yellow'; }).sort(function (a, b) { return a.percent - b.percent; }).slice(0, 3); focusNote = R.focusNone; }
  var focusHtml = focus.map(function (c) {
    var qs2 = c.questions.map(function (i) { return r.questions[i]; }).filter(function (q) { return q.color !== 'green'; });
    return '<div class="adz-focus is-' + c.color + '"><div class="adz-focus-h"><b>' + esc(t.cells[c.key]) + '</b><span>' + Math.round(c.percent) + '%</span></div>' +
      '<ul>' + qs2.map(function (q) { return '<li class="is-' + q.color + '">' + esc(edQuestionText(t, q)) + (q.zone === 0 ? ' <em>· ' + esc(t.noAnswer) + '</em>' : '') + '</li>'; }).join('') + '</ul></div>';
  }).join('');
  var email = '<b>' + esc(s.contact && s.contact.email || '') + '</b>';
  var pdfStatus = s.pdf === 'sent' ? fill(esc(R.pdfSent), { email: email }) : s.pdf === 'error' ? esc(R.pdfError) : fill(esc(R.pdfSending), { email: email });

  this.root.innerHTML =
    '<div class="adz-results">' +
      '<div class="adz-top">' + this.logo() + this.langSwitch() + '</div>' +
      '<header class="adz-hero">' +
        '<div class="adz-eyebrow">' + esc(R.eyebrow) + '</div>' +
        '<h1 class="adz-h1">' + esc(s.contact.company || '') + '</h1>' +
        '<p class="adz-lead">' + esc(R.lead) + '</p>' +
        '<div class="adz-counts">' + ['red', 'yellow', 'green'].map(function (c) {
          return '<div class="adz-countbox is-' + c + '"><b>' + counts[c] + '</b><span>' + esc(R.count[c]) + '</span></div>';
        }).join('') + '</div>' +
      '</header>' +
      '<section class="adz-sec"><h2>' + esc(R.diagramTitle) + '</h2><p class="adz-help">' + esc(R.diagramHelp) + '</p>' + edDiagramHtml(t, r) +
        '<div class="adz-legend">' + ['green', 'yellow', 'red'].map(function (c) { return '<span class="is-' + c + '"><i></i>' + esc(t.colors[c]) + '</span>'; }).join('') + '</div></section>' +
      '<section class="adz-sec"><h2>' + esc(R.radarTitle) + '</h2><p class="adz-help">' + esc(R.radarHelp) + '</p>' +
        '<div class="adz-radars">' + edRadarSvg(t, r, ED.RADARS[0], t.radar.title1) + edRadarSvg(t, r, ED.RADARS[1], t.radar.title2) + '</div>' +
        '<div class="adz-legend adz-legend--lines"><span class="is-ok"><i></i>' + esc(t.radar.normal) + '</span><span class="is-bad"><i></i>' + esc(t.radar.abnormal) + '</span><span class="is-you"><i></i>' + esc(t.radar.yours) + '</span></div></section>' +
      '<section class="adz-sec"><h2>' + esc(R.focusTitle) + '</h2><p class="adz-help">' + esc(focusNote || R.focusHelp) + '</p>' + focusHtml + '</section>' +
      '<div class="adz-split">' +
        '<section class="adz-card adz-card--dark">' +
          '<div class="adz-eyebrow">' + esc(R.sessionEyebrow) + '</div><h2>' + esc(R.sessionTitle) + '</h2><p>' + esc(R.sessionBody) + '</p>' +
          '<a class="adz-btn" data-act="book" href="' + esc(this.calendlyLink()) + '" target="_blank" rel="noopener">' + esc(R.sessionCta) + ' →</a>' +
        '</section>' +
        '<section class="adz-card">' +
          '<h2>' + esc(R.pdfTitle) + '</h2><p class="adz-status" data-pdf-status>' + pdfStatus + '</p>' +
          '<button type="button" class="adz-btn adz-btn--ghost" data-act="download">' + esc(R.download) + '</button>' +
        '</section>' +
      '</div>' +
      '<div class="adz-foot"><button type="button" data-act="retake">' + esc(R.retake) + '</button></div>' +
    '</div>';
  this.bindLang(); this.scrollTop();
  this.root.querySelector('[data-act="book"]').addEventListener('click', function () { self.event('book_click'); });
  this.root.querySelector('[data-act="download"]').addEventListener('click', function (e) { self.download(e.currentTarget); });
  this.root.querySelector('[data-act="retake"]').addEventListener('click', function () { store(self.cfg.storageKey, null); self.state = self.fresh(); self.dir = 1; self.renderIntro(); });
  if (s.pdf === 'pending' && !this.delivering) this.deliver();
};
App.prototype.calendlyLink = function () {
  var c = this.state.contact || {}, u = this.cfg.calendlyUrl, sep = u.indexOf('?') >= 0 ? '&' : '?';
  return u + sep + 'name=' + encodeURIComponent(c.name || '') + '&email=' + encodeURIComponent(c.email || '') +
    '&utm_source=express-diagnostics&utm_content=' + encodeURIComponent(this.state.id || '');
};
App.prototype.event = function (type) { if (this.state.id) api(this.cfg.endpoint, { action: 'ed_event', id: this.state.id, type: type }, 15000).catch(function () {}); };
App.prototype.setPdfStatus = function (kind) {
  var R = this.t().results, el = this.root.querySelector('[data-pdf-status]'), email = '<b>' + esc(this.state.contact.email) + '</b>';
  if (el) el.innerHTML = kind === 'sent' ? fill(esc(R.pdfSent), { email: email }) : kind === 'error' ? esc(R.pdfError) : fill(esc(R.pdfSending), { email: email });
};
App.prototype.pdfData = function () {
  var c = this.state.contact || {};
  return { result: this.result(), company: c.company, participants: [c.name], dateIso: this.state.submittedAt, calendlyUrl: this.calendlyLink() };
};
App.prototype.buildPdf = function (lang) {
  var self = this;
  return getPdfAssets(this.cfg.assetsBase).then(function (A) { return renderEdPdf(A, lang, self.pdfData()); });
};
App.prototype.fileName = function () {
  var n = (this.state.contact.company || '').replace(/[^\wÀ-ſ ]+/g, '').trim().replace(/\s+/g, '-');
  return (this.lang === 'es' ? 'Diagnostico-Expres' : 'Express-Diagnostics') + (n ? '-' + n : '') + '.pdf';
};
App.prototype.deliver = function () {
  var self = this, s = this.state, lang = this.lang;
  this.delivering = true;
  this.buildPdf(lang).then(function (doc) {
    return api(self.cfg.endpoint, { action: 'ed_deliver', id: s.id, lang: lang, fileName: self.fileName(), pdf: doc.output('datauristring').split(',')[1] }, 60000);
  }).then(function () { s.pdf = 'sent'; self.save(); self.setPdfStatus('sent'); })
    .catch(function (e) { if (window.console) console.warn('[ED] deliver', e); s.pdf = 'error'; self.save(); self.setPdfStatus('error'); })
    .then(function () { self.delivering = false; });
};
App.prototype.download = function (btn) {
  var self = this, R = this.t().results, label = btn.textContent;
  btn.disabled = true; btn.textContent = R.preparing;
  this.buildPdf(this.lang).then(function (doc) { doc.save(self.fileName()); self.event('pdf_download'); })
    .catch(function (e) { if (window.console) console.error(e); alert(self.t().ui.errorGeneric); })
    .then(function () { btn.disabled = false; btn.textContent = label; });
};

/* ---------- boot ---------- */
function boot() {
  var cfg = {}, user = window.ED_CONFIG || {};
  for (var k in DEFAULTS) cfg[k] = DEFAULTS[k];
  for (var k2 in user) cfg[k2] = user[k2];
  if (!cfg.assetsBase) cfg.assetsBase = detectAssets();
  var el = typeof cfg.mount === 'string' ? document.querySelector(cfg.mount) : cfg.mount;
  if (!el) { if (window.console) console.error('[ED] mount element not found: ' + cfg.mount); return; }
  if (!el.id) el.id = 'ed-assessment';
  injectStyle('adz-style-' + el.id, CSS, '#' + el.id);
  if (cfg.loadFont) loadFontCss();
  window.EDA = {
    app: new App(el, cfg), version: VERSION, score: ED.score,
    // Team report (used by the admin): responses = [[67 raw answers], ...]
    teamPdf: function (responses, company, names, lang, dateIso) {
      return getPdfAssets(cfg.assetsBase).then(function (A) {
        return renderEdPdf(A, lang || 'en', { result: ED.score(responses), company: company, participants: names || [], dateIso: dateIso, calendlyUrl: cfg.calendlyUrl });
      });
    },
  };
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();

})();
