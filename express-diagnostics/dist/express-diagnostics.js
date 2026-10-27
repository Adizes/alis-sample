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
    start: 'Start',
    back: 'Back',
    next: 'Next',
    pressEnter: 'press Enter ↵',
    keyboardHint: 'Keys 1–4 · 0 = I cannot answer',
    of: 'of',
    section: 'Area',
    language: 'Language',
    resume: 'Welcome back. Your answers so far are saved.',
    resumeYes: 'Continue where I left off',
    resumeNo: 'Start over',
    loading: 'Loading…',
    sending: 'Sending your answers…',
    errorGeneric: 'Something went wrong. Please check your connection and try again.',
    retry: 'Try again',
  },

  intro: {
    eyebrow: 'Express Diagnostics',
    hello: 'Hi, {first}',
    title: '{company} wants your view of the organization',
    body: '{company} is running an organizational diagnostic with the Adizes Institute. You will rate 67 statements about how the company works today, across the 16 factors of the Adizes methodology.',
    bullets: [
      'It takes about 10 minutes. You can pause and come back later with the same link.',
      'Your answers are combined with those of the other participants in a group report.',
      'Answer for how things actually work today, not how they are supposed to work.',
    ],
    note: 'If you have no basis to judge a statement, choose “I cannot answer”.',
    deadline: 'Open until {date}',
    meta: '67 statements · about 10 minutes',
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
    yours: 'The company',
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

  review: {
    eyebrow: 'Last step',
    title: 'Ready to send',
    body: 'You rated all 67 statements.',
    cannot: '{n} marked as “I cannot answer”.',
    warn: 'Once sent, your answers can’t be changed.',
    submit: 'Send my answers',
    edit: 'Review my answers',
  },
  thanks: {
    title: 'Thank you, {first}',
    body: 'Your answers have been recorded. {company} will receive the group report through the Adizes Institute. You can close this window.',
  },
  states: {
    noToken: { title: 'You need your personal link', body: 'To answer, open the link you received in your invitation email.' },
    invalid_link: { title: 'This link isn’t valid', body: 'Make sure you opened the complete link from your invitation email. If the problem continues, write to info@adizes.com.' },
    completed: { title: 'You have already answered', body: 'Your answers were recorded. Thank you for participating.' },
    closed: { title: 'This diagnostic is closed', body: 'Answers are no longer being collected. If you think this is a mistake, contact the person who invited you.' },
    not_open: { title: 'This diagnostic isn’t open yet', body: 'Please try again later from the same link.' },
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
    howBody: 'Each of the 16 factors is rated from the participants’ answers on a 4-point scale (“I cannot answer” is not counted as an answer and lowers the factor’s score). The causal map shows where problems originate, the radar charts compare the company with a normal and an abnormal situation, and the last section lists every statement with its rating.',
    summary: 'At a glance',
    keyFactors: 'Key organizational factors',
    keyFactorsHelp: 'Each statement is shown in the wording that matches its rating.',
    colorsTitle: 'Colour decoding',
    footer: 'Adizes Institute · Express Diagnostics',
    page: 'Page',
    cont: 'cont.',
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
    start: 'Comenzar',
    back: 'Atrás',
    next: 'Siguiente',
    pressEnter: 'presiona Enter ↵',
    keyboardHint: 'Teclas 1–4 · 0 = No puedo responder',
    of: 'de',
    section: 'Área',
    language: 'Idioma',
    resume: 'Qué bueno que volviste. Tus respuestas hasta ahora están guardadas.',
    resumeYes: 'Continuar donde me quedé',
    resumeNo: 'Empezar de nuevo',
    loading: 'Cargando…',
    sending: 'Enviando tus respuestas…',
    errorGeneric: 'Algo salió mal. Revisa tu conexión e inténtalo de nuevo.',
    retry: 'Intentar de nuevo',
  },

  intro: {
    eyebrow: 'Diagnóstico Exprés',
    hello: 'Hola, {first}',
    title: '{company} quiere conocer tu visión de la organización',
    body: '{company} está realizando un diagnóstico organizacional con el Instituto Adizes. Calificarás 67 afirmaciones sobre cómo funciona hoy la empresa, en los 16 factores de la metodología Adizes.',
    bullets: [
      'Toma alrededor de 10 minutos. Puedes pausar y continuar después con el mismo enlace.',
      'Tus respuestas se combinan con las de los demás participantes en un reporte grupal.',
      'Responde según cómo funcionan las cosas hoy, no cómo deberían funcionar.',
    ],
    note: 'Si no tienes elementos para juzgar una afirmación, elige “No puedo responder”.',
    deadline: 'Disponible hasta el {date}',
    meta: '67 afirmaciones · alrededor de 10 minutos',
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
    yours: 'La empresa',
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

  review: {
    eyebrow: 'Último paso',
    title: 'Listo para enviar',
    body: 'Calificaste las 67 afirmaciones.',
    cannot: '{n} como “No puedo responder”.',
    warn: 'Una vez enviadas, tus respuestas ya no se pueden cambiar.',
    submit: 'Enviar mis respuestas',
    edit: 'Revisar mis respuestas',
  },
  thanks: {
    title: 'Gracias, {first}',
    body: 'Tus respuestas quedaron registradas. {company} recibirá el reporte grupal a través del Instituto Adizes. Ya puedes cerrar esta ventana.',
  },
  states: {
    noToken: { title: 'Necesitas tu enlace personal', body: 'Para responder, abre el enlace que recibiste en tu correo de invitación.' },
    invalid_link: { title: 'Este enlace no es válido', body: 'Revisa que hayas abierto el enlace completo del correo de invitación. Si el problema sigue, escríbenos a info@adizes.com.' },
    completed: { title: 'Ya respondiste', body: 'Tus respuestas quedaron registradas. Gracias por participar.' },
    closed: { title: 'Este diagnóstico ya cerró', body: 'Ya no se reciben respuestas. Si crees que es un error, contacta a quien te invitó.' },
    not_open: { title: 'Este diagnóstico aún no está abierto', body: 'Inténtalo más tarde con el mismo enlace.' },
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
    howBody: 'Cada uno de los 16 factores se califica con las respuestas de los participantes en una escala de 4 puntos (“No puedo responder” no cuenta como respuesta y baja la calificación del factor). El mapa causal muestra dónde se originan los problemas, las gráficas de radar comparan la empresa con una situación normal y una anormal, y la última sección presenta cada afirmación con su calificación.',
    summary: 'En resumen',
    keyFactors: 'Factores organizacionales clave',
    keyFactorsHelp: 'Cada afirmación aparece con la redacción que corresponde a su calificación.',
    colorsTitle: 'Significado de los colores',
    footer: 'Instituto Adizes · Diagnóstico Exprés',
    page: 'Página',
    cont: 'cont.',
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

/* Express Diagnostics — participant widget (personal invitation link ?t=TOKEN).
 * The participant answers and only sees a thank-you; the group report is generated in the admin.
 * Embed:
 *   <div id="ed-assessment"></div>
 *   <script>window.ED_CONFIG = { endpoint: 'https://script.google.com/macros/s/XXX/exec' };</script>
 *   <script src="https://cdn.jsdelivr.net/gh/Adizes/alis-sample@vX/express-diagnostics/dist/express-diagnostics.min.js" defer></script>
 * Bundled by build.mjs together with: i18n files, shared/core.js, shared/ed-engine.js.
 */
var VERSION = "1.0.0";
var CSS = "__ROOT__ {\n--ink: #111111;\n--ink-2: #3a3a3a;\n--muted: #6b6f76;\n--soft: #9aa0a6;\n--line: #e6e6e6;\n--paper: #f6f6f6;\n--white: #ffffff;\n--red: #d7141a;\n--red-dark: #b10f14;\n--red-tint: #fdecec;\n--green: #1e8e4e; --green-t: #dcf2e5;\n--yellow: #d9a400; --yellow-ink: #8a6500; --yellow-t: #fff0bf;\n--red-t: #fbd6d7;\ndisplay: block; width: 100%;\nfont-family: 'Montserrat', system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif;\ncolor: var(--ink); line-height: 1.5; text-align: left;\n-webkit-font-smoothing: antialiased;\n}\n__ROOT__ *, __ROOT__ *::before, __ROOT__ *::after {\nbox-sizing: border-box; margin: 0; padding: 0; border: 0;\nfont: inherit; color: inherit; letter-spacing: normal; text-transform: none;\nbackground: none; box-shadow: none; text-decoration: none; list-style: none;\n}\n__ROOT__ strong, __ROOT__ b { font-weight: 700; }\n__ROOT__ em { font-style: normal; color: var(--soft); }\n__ROOT__ button { cursor: pointer; -webkit-appearance: none; appearance: none; line-height: 1.3; }\n__ROOT__ button:focus-visible, __ROOT__ a:focus-visible, __ROOT__ input:focus-visible, __ROOT__ textarea:focus-visible, __ROOT__ select:focus-visible {\noutline: 3px solid rgba(215, 20, 26, .35); outline-offset: 2px;\n}\n__ROOT__ a { color: inherit; }\n__ROOT__ [hidden] { display: none !important; }\n__ROOT__ .adz-stage {\nbackground: var(--white); border: 1px solid var(--line); border-radius: 10px;\nmin-height: min(720px, 100svh); display: flex; flex-direction: column; overflow: hidden;\n}\n__ROOT__ .adz-top { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 22px 32px 14px; }\n__ROOT__ .adz-logo { display: block; height: 38px; width: auto; max-width: none; }\n__ROOT__ .adz-logo-txt { font-weight: 800; letter-spacing: .06em; color: var(--red); }\n__ROOT__ .adz-lang { display: inline-flex; border: 1px solid var(--line); border-radius: 6px; overflow: hidden; }\n__ROOT__ .adz-lang button { padding: 6px 11px; font-size: 12px; font-weight: 600; color: var(--muted); }\n__ROOT__ .adz-lang button[aria-pressed=\"true\"] { background: var(--ink); color: var(--white); }\n__ROOT__ .adz-progress { display: flex; gap: 3px; padding: 4px 32px 0; }\n__ROOT__ .adz-progress span { height: 3px; background: var(--line); border-radius: 2px; overflow: hidden; }\n__ROOT__ .adz-progress i { display: block; height: 100%; background: var(--red); transition: width .35s ease; }\n__ROOT__ .adz-body { flex: 1; display: flex; align-items: center; padding: 32px 32px 40px; }\n__ROOT__ .adz-screen { width: 100%; max-width: 760px; margin: 0 auto; animation: adzIn .35s ease both; }\n__ROOT__ .adz-screen.is-back { animation-name: adzBack; }\n@keyframes adzIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }\n@keyframes adzBack { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: none; } }\n__ROOT__ .adz-eyebrow { font-size: 12px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: var(--red); }\n__ROOT__ .adz-h1 { font-size: clamp(30px, 4.6vw, 46px); line-height: 1.12; font-weight: 700; margin: 12px 0 16px; letter-spacing: -.01em; }\n__ROOT__ .adz-h1--sm { font-size: clamp(26px, 3.6vw, 36px); }\n__ROOT__ .adz-lead { font-size: 17px; line-height: 1.6; color: var(--ink-2); max-width: 640px; }\n__ROOT__ .adz-list { margin: 22px 0; display: grid; gap: 10px; }\n__ROOT__ .adz-list li { position: relative; padding-left: 26px; font-size: 15.5px; color: var(--ink-2); }\n__ROOT__ .adz-list li::before { content: ''; position: absolute; left: 0; top: .62em; width: 12px; height: 2px; background: var(--red); }\n__ROOT__ .adz-note { font-size: 14px; color: var(--muted); max-width: 620px; border-left: 2px solid var(--line); padding-left: 14px; }\n__ROOT__ .adz-meta { margin-top: 18px; font-size: 13px; color: var(--soft); }\n__ROOT__ .adz-help { font-size: 14.5px; color: var(--muted); max-width: 680px; margin: 4px 0 18px; }\n__ROOT__ .adz-actions { display: flex; flex-wrap: wrap; align-items: center; gap: 14px; margin-top: 28px; }\n__ROOT__ .adz-actions--tight { margin-top: 0; }\n__ROOT__ .adz-btn {\ndisplay: inline-flex; align-items: center; justify-content: center; gap: 8px; min-height: 46px;\npadding: 12px 24px; border-radius: 6px; background: var(--red); color: var(--white);\nfont-size: 15px; font-weight: 600; transition: background .15s ease, transform .15s ease;\n}\n__ROOT__ .adz-btn:hover { background: var(--red-dark); }\n__ROOT__ .adz-btn:active { transform: translateY(1px); }\n__ROOT__ .adz-btn:disabled { opacity: .55; cursor: default; }\n__ROOT__ .adz-btn--ghost { background: transparent; color: var(--ink); border: 1px solid var(--ink); }\n__ROOT__ .adz-btn--ghost:hover { background: var(--ink); color: var(--white); }\n__ROOT__ .adz-btn--dark { background: var(--ink); }\n__ROOT__ .adz-btn--dark:hover { background: #000; }\n__ROOT__ .adz-hint { font-size: 12.5px; color: var(--soft); }\n__ROOT__ .adz-back { font-size: 14px; font-weight: 600; color: var(--muted); padding: 10px 2px; }\n__ROOT__ .adz-back:hover { color: var(--ink); }\n__ROOT__ .adz-nav { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-top: 28px; }\n__ROOT__ .adz-form { margin-top: 24px; display: grid; gap: 14px; max-width: 520px; }\n__ROOT__ .adz-field label { display: block; font-size: 13px; font-weight: 600; margin-bottom: 6px; color: var(--ink); }\n__ROOT__ .adz-field input[type=\"text\"], __ROOT__ .adz-field input[type=\"email\"], __ROOT__ .adz-field input:not([type]), __ROOT__ .adz-field select, __ROOT__ .adz-field textarea {\ndisplay: block; width: 100%; height: 48px; padding: 0 14px; border: 1px solid #cfcfcf; border-radius: 6px;\nbackground: var(--white); font-size: 16px; color: var(--ink); margin: 0;\n}\n__ROOT__ .adz-field textarea { height: auto; min-height: 96px; padding: 12px 14px; line-height: 1.5; resize: vertical; }\n__ROOT__ .adz-field input:focus, __ROOT__ .adz-field textarea:focus { border-color: var(--ink); outline: none; }\n__ROOT__ .adz-field input::placeholder, __ROOT__ .adz-field textarea::placeholder { color: #a5a5a5; }\n__ROOT__ .adz-err { display: none; font-size: 12.5px; color: var(--red); margin-top: 5px; }\n__ROOT__ .adz-field.has-error input { border-color: var(--red); }\n__ROOT__ .adz-field.has-error .adz-err { display: block; }\n__ROOT__ .adz-consent { display: flex !important; gap: 10px; align-items: flex-start; font-weight: 400 !important; font-size: 13.5px !important; color: var(--ink-2) !important; cursor: pointer; }\n__ROOT__ .adz-consent input { width: 18px; height: 18px; margin: 2px 0 0 !important; flex: none; accent-color: var(--red); -webkit-appearance: auto; appearance: auto; }\n__ROOT__ .adz-consent a { text-decoration: underline; }\n__ROOT__ .adz-loading { display: grid; justify-items: center; gap: 18px; text-align: center; padding: 40px 0; }\n__ROOT__ .adz-spinner { width: 40px; height: 40px; border-radius: 50%; border: 3px solid var(--line); border-top-color: var(--red); animation: adzSpin .8s linear infinite; }\n@keyframes adzSpin { to { transform: rotate(360deg); } }\n__ROOT__ .adz-card { background: var(--white); border: 1px solid var(--line); border-radius: 10px; padding: 28px; }\n__ROOT__ .adz-card h2 { font-size: 21px; font-weight: 700; line-height: 1.25; margin: 6px 0 10px; }\n__ROOT__ .adz-card p { font-size: 15px; color: var(--ink-2); margin-bottom: 20px; }\n__ROOT__ .adz-card--dark { background: var(--ink); border-color: var(--ink); color: var(--white); }\n__ROOT__ .adz-card--dark p { color: #cfcfcf; }\n@media (max-width: 640px) {\n__ROOT__ .adz-stage { border-radius: 0; border-left: 0; border-right: 0; }\n__ROOT__ .adz-top { padding: 16px 18px 12px; }\n__ROOT__ .adz-logo { height: 30px; }\n__ROOT__ .adz-progress { padding: 0 18px; gap: 2px; }\n__ROOT__ .adz-body { padding: 24px 18px 32px; align-items: flex-start; }\n__ROOT__ .adz-lead { font-size: 16px; }\n__ROOT__ .adz-card { padding: 22px; }\n}\n@media (prefers-reduced-motion: reduce) {\n__ROOT__ *, __ROOT__ *::before, __ROOT__ *::after { animation: none !important; transition: none !important; }\n}\n__ROOT__ .adz-qhead { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; }\n__ROOT__ .adz-count { font-size: 13px; font-weight: 600; color: var(--soft); white-space: nowrap; font-variant-numeric: tabular-nums; }\n__ROOT__ .adz-q { font-size: clamp(22px, 3vw, 30px); line-height: 1.3; font-weight: 600; margin: 16px 0 26px; min-height: 2.6em; }\n__ROOT__ .adz-scale { display: grid; gap: 10px; }\n__ROOT__ .adz-opt {\ndisplay: flex; align-items: center; gap: 16px; width: 100%; padding: 13px 16px; text-align: left;\nborder: 1px solid #d6d6d6; border-radius: 8px; background: var(--white); transition: border-color .15s, background .15s;\n}\n__ROOT__ .adz-opt:hover { border-color: var(--ink); }\n__ROOT__ .adz-opt[aria-checked=\"true\"] { border-color: var(--red); background: var(--red-tint); box-shadow: inset 0 0 0 1px var(--red); }\n__ROOT__ .adz-key {\nflex: none; width: 28px; height: 28px; border-radius: 6px; border: 1px solid #d6d6d6; display: grid; place-items: center;\nfont-size: 12.5px; font-weight: 700; color: var(--muted);\n}\n__ROOT__ .adz-opt[aria-checked=\"true\"] .adz-key { background: var(--red); border-color: var(--red); color: var(--white); }\n__ROOT__ .adz-opt-t { display: flex; flex-wrap: wrap; align-items: baseline; gap: 4px 12px; }\n__ROOT__ .adz-opt-t b { font-size: 16px; font-weight: 600; }\n__ROOT__ .adz-opt-t small { font-size: 13px; color: var(--muted); }\n__ROOT__ .adz-opt.is-pop { animation: adzPop .28s ease; }\n@keyframes adzPop { 50% { transform: scale(.985); } }\n__ROOT__ .adz-cannot {\nmargin-top: 14px; font-size: 14px; font-weight: 600; color: var(--muted); padding: 6px 2px;\nborder-bottom: 1px dashed #c4c4c4;\n}\n__ROOT__ .adz-cannot:hover { color: var(--ink); border-bottom-color: var(--ink); }\n__ROOT__ .adz-cannot[aria-pressed=\"true\"] { color: var(--red); border-bottom-color: var(--red); }\n__ROOT__ .adz-cannot[aria-pressed=\"true\"]::before { content: '● '; }\n__ROOT__ .adz-hello { font-size: 18px; font-weight: 600; margin-top: 14px; }\n__ROOT__ .adz-hello + .adz-h1 { margin-top: 4px; }\n__ROOT__ .adz-msg { max-width: 640px; }\n__ROOT__ .adz-msg--done { text-align: center; margin: 0 auto; }\n__ROOT__ .adz-msg--done .adz-lead { margin: 0 auto; }\n__ROOT__ .adz-check { width: 56px; height: 56px; border-radius: 50%; background: var(--red); margin: 0 auto 8px; position: relative; }\n__ROOT__ .adz-check::after { content: ''; position: absolute; left: 20px; top: 14px; width: 12px; height: 22px; border: solid #fff; border-width: 0 3px 3px 0; transform: rotate(45deg); }\n@media (max-width: 640px) {\n__ROOT__ .adz-hint--keys { display: none; }\n__ROOT__ .adz-q { min-height: 0; }\n__ROOT__ .adz-opt { padding: 12px 14px; }\n}";
var I18N = ED_I18N;
var N = ED.COUNT;

var DEFAULTS = {
  mount: '#ed-assessment',
  endpoint: '',            // Apps Script web app URL ('' = demo mode: nothing is saved)
  lang: 'auto',            // 'auto' = the language chosen for the launch
  languages: Object.keys(I18N),
  assetsBase: '',
  loadFont: true,
};

function sectionOf(q) { var cat = ED.QUESTION_CATS[q]; for (var i = 0; i < ED.CELLS.length; i++) if (ED.CELLS[i].id === cat) return i; return 0; }
var FIRST_OF_SECTION = {};
for (var qi = 0; qi < N; qi++) { var s0 = sectionOf(qi); if (FIRST_OF_SECTION[s0] == null) FIRST_OF_SECTION[s0] = qi; }

function App(el, cfg) {
  this.el = el; this.cfg = cfg;
  this.token = (qs('t') || '').replace(/[^A-Za-z0-9]/g, '');
  this.skey = 'adz-ed:' + (this.token || 'demo');
  this.info = null;
  this.lang = this.pickLang();
  this.state = { step: 0, answers: [] };
  this.busy = false; this.dir = 1;
  this.root = document.createElement('div');
  this.root.className = 'adz';
  el.innerHTML = ''; el.appendChild(this.root);
  var self = this;
  this.onKey = function (e) { self.key(e); };
  document.addEventListener('keydown', this.onKey);
  this.boot();
}
App.prototype.t = function () { return I18N[this.lang] || I18N.en; };
App.prototype.pickLang = function (launchLang) {
  var avail = this.cfg.languages.filter(function (l) { return I18N[l]; });
  var saved = load(this.skey) || {};
  var want = qs('lang') || saved.lang || (this.cfg.lang !== 'auto' ? this.cfg.lang : '') || launchLang ||
    ((navigator.language || 'en').slice(0, 2).toLowerCase());
  return avail.indexOf(want) >= 0 ? want : (avail.indexOf('en') >= 0 ? 'en' : avail[0]);
};
App.prototype.save = function () { this.state.lang = this.lang; store(this.skey, this.state); };
App.prototype.vars = function () {
  var i = this.info || {};
  return { company: esc(i.company || ''), first: esc(i.firstName || ''), date: esc(i.closeDate ? formatDate(i.closeDate + 'T12:00:00', this.t().locale) : '') };
};

/* ---------- loading the invitation ---------- */
App.prototype.boot = function () {
  var self = this;
  if (!this.token && this.cfg.endpoint) return this.renderState('noToken');
  this.frame('<div class="adz-loading"><div class="adz-spinner"></div><p class="adz-lead">' + esc(this.t().ui.loading) + '</p></div>', { lang: false });
  var req = this.cfg.endpoint ? api(this.cfg.endpoint, { action: 'p_load', t: this.token }, 20000)
    : Promise.resolve({ ok: true, state: 'open', type: 'ED', lang: this.lang, company: 'Demo Company', firstName: 'Demo', closeDate: '' });
  req.then(function (info) {
    self.info = info;
    if (!qs('lang') && !(load(self.skey) || {}).lang) self.lang = self.pickLang(info.lang);
    if (info.state !== 'open') { store(self.skey, null); return self.renderState(info.state); }
    var saved = load(self.skey);
    if (saved && (saved.answers || []).some(Boolean)) { self.saved = saved; self.renderResume(); }
    else self.renderIntro();
  }).catch(function (e) {
    if (e && e.code === 'invalid_link') return self.renderState('invalid_link');
    self.frame('<div class="adz-loading"><p class="adz-lead">' + esc(self.t().ui.errorGeneric) + '</p>' +
      '<button type="button" class="adz-btn" data-act="retry">' + esc(self.t().ui.retry) + '</button></div>', { lang: false });
    self.root.querySelector('[data-act="retry"]').addEventListener('click', function () { self.boot(); });
  });
};

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
  var answered = this.state.step;
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
      var fn = { intro: 'renderIntro', resume: 'renderResume', step: 'renderStep', review: 'renderReview', state: 'renderState', thanks: 'renderThanks' }[self.view];
      if (fn) self[fn](self.stateKey);
    });
  });
};

/* ---------- screens ---------- */
App.prototype.renderState = function (key) {
  var s = this.t().states[key] || this.t().states.invalid_link;
  this.view = 'state'; this.stateKey = key;
  this.frame('<div class="adz-msg"><div class="adz-eyebrow">' + esc(this.t().intro.eyebrow) + '</div>' +
    '<h1 class="adz-h1 adz-h1--sm">' + esc(s.title) + '</h1><p class="adz-lead">' + esc(s.body) + '</p></div>');
};
App.prototype.renderIntro = function () {
  var t = this.t(), v = this.vars(), self = this, i = this.info || {};
  this.view = 'intro';
  this.frame(
    '<div class="adz-eyebrow">' + esc(t.intro.eyebrow) + (v.company ? ' · ' + v.company : '') + '</div>' +
    (v.first ? '<p class="adz-hello">' + fill(esc(t.intro.hello), v) + '</p>' : '') +
    '<h1 class="adz-h1">' + fill(esc(t.intro.title), v) + '</h1>' +
    '<p class="adz-lead">' + fill(esc(t.intro.body), v) + '</p>' +
    '<ul class="adz-list">' + t.intro.bullets.map(function (b) { return '<li>' + esc(b) + '</li>'; }).join('') + '</ul>' +
    '<p class="adz-note">' + esc(t.intro.note) + '</p>' +
    '<div class="adz-actions"><button type="button" class="adz-btn" data-act="start">' + esc(t.ui.start) + ' →</button>' +
    '<span class="adz-hint">' + esc(t.ui.pressEnter) + '</span></div>' +
    '<p class="adz-meta">' + esc(t.intro.meta) + (i.closeDate ? ' · ' + fill(esc(t.intro.deadline), v) : '') + '</p>');
  this.root.querySelector('[data-act="start"]').addEventListener('click', function () { self.start(); });
};
App.prototype.start = function () { this.state = { step: 0, answers: [] }; this.dir = 1; this.save(); this.renderStep(); };
App.prototype.renderResume = function () {
  var t = this.t(), self = this;
  this.view = 'resume';
  this.frame(
    '<div class="adz-eyebrow">' + esc(t.intro.eyebrow) + '</div>' +
    '<h1 class="adz-h1 adz-h1--sm">' + esc(t.ui.resume) + '</h1>' +
    '<div class="adz-actions"><button type="button" class="adz-btn" data-act="yes">' + esc(t.ui.resumeYes) + ' →</button>' +
    '<button type="button" class="adz-btn adz-btn--ghost" data-act="no">' + esc(t.ui.resumeNo) + '</button></div>');
  this.root.querySelector('[data-act="yes"]').addEventListener('click', function () { self.state = self.saved; self.renderStep(); });
  this.root.querySelector('[data-act="no"]').addEventListener('click', function () { store(self.skey, null); self.renderIntro(); });
};

/* ---------- statements ---------- */
App.prototype.renderStep = function () {
  if (this.state.step >= N) return this.renderReview();
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

/* ---------- review + submit + thanks ---------- */
App.prototype.renderReview = function () {
  var t = this.t(), R = t.review, self = this;
  var cannot = this.state.answers.slice(0, N).filter(function (v) { return v === 1; }).length;
  this.view = 'review';
  this.frame(
    '<div class="adz-eyebrow">' + esc(R.eyebrow) + '</div>' +
    '<h1 class="adz-h1 adz-h1--sm">' + esc(R.title) + '</h1>' +
    '<p class="adz-lead">' + esc(R.body) + (cannot ? ' ' + fill(esc(R.cannot), { n: cannot }) : '') + '</p>' +
    '<p class="adz-note">' + esc(R.warn) + '</p>' +
    '<div class="adz-actions"><button type="button" class="adz-btn" data-act="submit">' + esc(R.submit) + ' →</button>' +
    '<button type="button" class="adz-btn adz-btn--ghost" data-act="edit">' + esc(R.edit) + '</button></div>', { progress: true });
  this.root.querySelector('[data-act="submit"]').addEventListener('click', function () { self.submit(); });
  this.root.querySelector('[data-act="edit"]').addEventListener('click', function () { self.state.step = 0; self.dir = -1; self.save(); self.renderStep(); });
};
App.prototype.submit = function () {
  var t = this.t(), self = this;
  this.view = 'sending';
  this.frame('<div class="adz-loading"><div class="adz-spinner"></div><p class="adz-lead">' + esc(t.ui.sending) + '</p></div>', { lang: false });
  var started = Date.now();
  api(this.cfg.endpoint, { action: 'p_submit', v: VERSION, t: this.token, lang: this.lang, answers: this.state.answers.slice(0, N) }, 30000).then(function () {
    setTimeout(function () { store(self.skey, null); self.renderThanks(); }, Math.max(0, 900 - (Date.now() - started)));
  }).catch(function (e) {
    if (e && (e.code === 'already_completed' || e.code === 'closed' || e.code === 'invalid_link')) { store(self.skey, null); return self.renderState(e.code === 'already_completed' ? 'completed' : e.code); }
    self.frame('<div class="adz-loading"><p class="adz-lead">' + esc(t.ui.errorGeneric) + '</p>' +
      '<button type="button" class="adz-btn" data-act="retry">' + esc(t.ui.retry) + '</button></div>', { lang: false });
    self.root.querySelector('[data-act="retry"]').addEventListener('click', function () { self.submit(); });
  });
};
App.prototype.renderThanks = function () {
  var t = this.t(), v = this.vars();
  this.view = 'thanks';
  this.frame('<div class="adz-msg adz-msg--done"><div class="adz-check" aria-hidden="true"></div>' +
    '<h1 class="adz-h1 adz-h1--sm">' + fill(esc(t.thanks.title), v).replace(/,\s*$/, '') + '</h1>' +
    '<p class="adz-lead">' + fill(esc(t.thanks.body), v) + '</p></div>');
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
  window.EDA = { app: new App(el, cfg), version: VERSION };
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();

})();
