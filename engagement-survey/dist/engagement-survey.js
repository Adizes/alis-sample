/*! Adizes · Engagement Survey v1.3.0 · github.com/Adizes/alis-sample */
(function(){
'use strict';
var ES_I18N = {};
/* Engagement Survey — English
 * GENERATED from the translations workbook (tools/translations.py). Edit the workbook, not this file.
 * Answer values and the order of questions come from English and never change.
 */
ES_I18N.en = {
  code: "en",
  langName: "English",
  locale: "en-US",
  ui: {
    start: "Start",
    back: "Back",
    next: "Next",
    pressEnter: "press Enter ↵",
    keyboardHint: "Keys 1–{n} · 0 = Don’t know",
    of: "of",
    section: "Area",
    resume: "Welcome back. Your answers so far are saved.",
    resumeYes: "Continue where I left off",
    resumeNo: "Start over",
    loading: "Loading…",
    sending: "Sending your answers…",
    errorGeneric: "Something went wrong. Please check your connection and try again.",
    retry: "Try again",
    importance: "How important is this question for you?",
    imp: [
      "Less important",
      "Medium",
      "Most important"
    ],
    mostCount: "Most important: {n} of {max}",
    mostFull: "You already chose 15 questions as most important. Change one of them to use it here.",
    comment: "Add a comment (optional)",
    commentPh: "Your comment… It is shared anonymously, word for word."
  },
  intro: {
    eyebrow: "Engagement Survey",
    title: "{company} wants to hear from you",
    body: "{company} is running an engagement survey together with the Adizes Institute. You will answer {n} questions about your daily work and the organization.",
    bullets: [
      "The survey is anonymous: answers are combined, and {company} never sees anyone’s individual answers.",
      "For each question, say how important it is to you. Mark up to 15 as “Most important” (at least one).",
      "You can add a comment to any question. Comments are shared word for word without your name, so avoid details that identify you.",
      "It takes about 10–15 minutes. You can pause and continue later with the same link."
    ],
    note: "Answer for how things actually are today. If you have no basis to answer, choose “Don’t know”.",
    deadline: "Open until {date}",
    meta: "{n} questions · about 10–15 minutes · anonymous"
  },
  review: {
    eyebrow: "Last step",
    title: "Review your answers",
    body: "You answered all {n} questions.",
    cannot: "{n} as “Don’t know”.",
    most: "Most important: {n} of {max}.",
    needMost: "Mark at least {min} question as “Most important” before sending (open any question to change it).",
    missingN: "{n} questions still need an answer.",
    missingHelp: "Click any question to answer or change it.",
    missing: "Not answered",
    commented: "Comment",
    warn: "Click any question to change your answer, its importance or your comment. Once sent, your answers can’t be changed.",
    submit: "Send my answers",
    hint: "You can also send from the bottom of the list.",
    back: "Back to review"
  },
  thanks: {
    title: "Thank you",
    body: "Your answers have been recorded anonymously. Thank you for taking the time to participate. You can close this window."
  },
  states: {
    noToken: {
      title: "You need your personal link",
      body: "To answer, open the link you received in your invitation email."
    },
    invalid_link: {
      title: "This link isn’t valid",
      body: "Make sure you opened the complete link from your invitation email. If the problem continues, write to info@adizes.com."
    },
    completed: {
      title: "You have already answered",
      body: "Your answers were recorded. Thank you for participating."
    },
    closed: {
      title: "This survey is closed",
      body: "Answers are no longer being collected. If you think this is a mistake, contact the person who invited you."
    },
    not_open: {
      title: "This survey isn’t open yet",
      body: "Please try again later from the same link."
    }
  },
  dontKnow: "Don’t know",
  scales: {
    F: [
      {
        value: 2,
        label: "Never",
        sub: "Absolutely disagree"
      },
      {
        value: 3,
        label: "Sometimes",
        sub: "Mostly disagree"
      },
      {
        value: 4,
        label: "Often",
        sub: "Mostly agree"
      },
      {
        value: 5,
        label: "Always",
        sub: "Absolutely agree"
      }
    ],
    A: [
      {
        value: 2,
        label: "Absolutely disagree",
        sub: "Never"
      },
      {
        value: 3,
        label: "Mostly disagree",
        sub: "Sometimes"
      },
      {
        value: 4,
        label: "Mostly agree",
        sub: "Often"
      },
      {
        value: 5,
        label: "Absolutely agree",
        sub: "Always"
      }
    ],
    FR: [
      {
        value: 5,
        label: "Never",
        sub: "Absolutely disagree"
      },
      {
        value: 4,
        label: "Sometimes",
        sub: "Mostly disagree"
      },
      {
        value: 3,
        label: "Often",
        sub: "Mostly agree"
      },
      {
        value: 2,
        label: "Always",
        sub: "Absolutely agree"
      }
    ],
    AR: [
      {
        value: 5,
        label: "Absolutely disagree",
        sub: "Never"
      },
      {
        value: 4,
        label: "Mostly disagree",
        sub: "Sometimes"
      },
      {
        value: 3,
        label: "Mostly agree",
        sub: "Often"
      },
      {
        value: 2,
        label: "Absolutely agree",
        sub: "Always"
      }
    ],
    S: [
      {
        value: 2,
        label: "Absolutely dissatisfied"
      },
      {
        value: 3,
        label: "Mostly dissatisfied"
      },
      {
        value: 4,
        label: "Mostly satisfied"
      },
      {
        value: 5,
        label: "Absolutely satisfied"
      }
    ],
    C: [
      {
        value: 1,
        label: "Significantly deteriorated"
      },
      {
        value: 2,
        label: "Slightly deteriorated"
      },
      {
        value: 3,
        label: "No tangible changes"
      },
      {
        value: 4,
        label: "Slightly improved"
      },
      {
        value: 5,
        label: "Significantly improved"
      }
    ]
  },
  cells: {
    values: "Values",
    climate: "Climate",
    styles: "Styles",
    responsibility: "Responsibility Structure",
    authority: "Authority Structure",
    reward: "Reward Structure",
    supervisor: "Supervisor",
    planning: "Planning",
    information: "Information flow",
    client: "Client interface",
    transformation: "Transformation",
    human: "Human factors",
    behaviour: "Behaviour",
    changes: "Changes",
    inefficiency: "Inefficiency"
  },
  levels: {
    fully: {
      name: "Fully engaged",
      desc: [
        "passionate about their work and the organization",
        "will do whatever it takes to deliver results",
        "deliver consistent high quality results",
        "find non-standard and innovative solutions to the toughest problems",
        "seen as a leader and a role model"
      ]
    },
    engaged: {
      name: "Engaged",
      desc: [
        "focused on achieving results, projects, individual responsibilities",
        "deliver good, solid performance",
        "always do their fair share of work",
        "work well with others and help others when asked"
      ]
    },
    somewhat: {
      name: "Somewhat engaged",
      desc: [
        "selective about where they put their energy",
        "spend a lot of time doing things that are not helping clients and/or the organization",
        "deliver when they have to or when you are watching them",
        "have a negative influence on others"
      ]
    },
    disengaged: {
      name: "Disengaged",
      desc: [
        "work only when they have to",
        "would like to be doing something else",
        "results are not meeting the standards",
        "have a “we and they” perspective",
        "are negative about the organization, and in their interactions with clients and colleagues"
      ]
    }
  },
  pdf: {
    file: "Engagement-Survey",
    title: "Engagement Survey",
    subtitle: "Report",
    company: "Company",
    launch: "Survey",
    date: "Date of the report",
    responses: "Responses",
    of: "of",
    invited: "invited",
    anon: "The survey is anonymous. Results are only shown in aggregate, and groups with fewer than 5 answers are never shown on their own.",
    contents: "Contents",
    toc: [
      "Distribution by engagement level",
      "Engagement by area",
      "Organizational factors",
      "What matters most to employees",
      "All questions",
      "Comments"
    ],
    levelsTitle: "Distribution by engagement level",
    levelsHelp: "Each participant is classified from all their answers and from the questions they marked as most important.",
    positive: "Fully engaged + Engaged",
    people: "people",
    byAreaTitle: "Engagement by area",
    byAreaHelp: "Only areas with 5 or more answers are shown. Smaller areas are combined into “Other areas” when together they reach 5.",
    company_col: "Company",
    other: "Other areas",
    hidden: "{n} answers from areas with fewer than 5 people are counted only in the company total.",
    noAreas: "No area has 5 or more answers yet, so results by area are not shown.",
    respondents: "Respondents",
    factorsTitle: "Organizational factors",
    factorsHelp: "Score of each factor from the answers (“Don’t know” not counted), with the same method as the Adizes diagnostic matrix. 75% or more is healthy; under 50% is an anomaly.",
    groups: {
      culture: "Organizational culture",
      structure: "Structure",
      process: "Process",
      functions: "Organizational functions",
      effects: "Effects"
    },
    colors: {
      green: "All OK",
      yellow: "Attention zone",
      red: "Anomaly zone"
    },
    topTitle: "What matters most to employees",
    topHelp: "The questions most often marked as “Most important”, and how they were answered.",
    mostPct: "most important",
    distTitle: "All questions",
    distHelp: "Distribution of answers (%) and, in red on the right, the share of respondents who marked each question as most important.",
    legend: {
      "1": "Don’t know",
      "2": "Never / Absolutely disagree",
      "3": "Sometimes / Mostly disagree",
      "4": "Often / Mostly agree",
      "5": "Always / Absolutely agree"
    },
    q50: "Green is always the most positive answer: for the negative statements 5 and 45 that is “Never” / “Absolutely disagree”. Question 50 uses its own scale (significantly improved → significantly deteriorated).",
    commentsTitle: "Comments",
    commentsHelp: "Written by participants, anonymous and word for word.",
    noComments: "No comments were left.",
    footer: "Adizes Institute · Engagement Survey",
    page: "Page",
    cont: "cont."
  },
  questions: [
    "Our leaders follow the values declared in the Organization",
    "Our Organization fully fulfils its obligations to employees",
    "The Organization values and supports new ideas",
    "I feel comfortable with the atmosphere in the Organization",
    "We have an “every man for himself” culture",
    "I am praised and appreciated when I do good work",
    "We respect each other",
    "The behavior shown by the supervisors in our organization contributes to a healthy working environment, the achievement of goals and the development of the organization",
    "I clearly understand my work tasks and understand my role in the activities of my department",
    "I understand what should guide me in carrying out my work: policies, regulations, rules, professional standards, etc",
    "I know who I can go to with questions",
    "I understand what decisions I have the right to make",
    "Decision-making on issues that affect me takes place in a timely and predictable way",
    "I have enough authority to be responsible for the results of my work",
    "I believe that the level of income that I get in the Organization is competitive",
    "I understand what the variable part of my income depends on",
    "I believe that I am able to influence both my fixed and variable income to a rather high degree",
    "My benefits package is competitive in the market",
    "I can discuss personal issues with my supervisor",
    "My supervisor treats me as an individual",
    "My supervisor encourages my professional development",
    "My supervisor talks to me about my progress on a regular basis",
    "My supervisor gives quality and motivating feedback - I always know what he thinks about me and my work",
    "The tasks that the supervisor sets for me are clear and realistic",
    "I feel comfortable asking clarifying questions to my supervisor",
    "I believe that the decisions made by my supervisor are correct and useful to the Organization",
    "My supervisor carefully listens to me and takes into account my point of view",
    "I know and understand the long-term goals of the Organization",
    "I am inspired by the goals of our Organization. We are engaged in important and useful work",
    "I understand how the results of my work affect the overall result of the Organization",
    "I have the opportunity to be heard",
    "I have enough information about what is happening in the Organization to do my work",
    "I know who the target market is (internal or external customer). I know what needs we can satisfy with what products or services",
    "We know our market (internal or external customers) well, we monitor trends and needs and we constantly think about how we can serve our market (internal or external customers) better",
    "I have a comfortable working environment",
    "I have all the necessary technical resources to do my job well",
    "The work processes which I participate in are systematized and well organized",
    "We are committed to improving our work processes and applied technologies",
    "I am satisfied with the quality of the work that other units provide",
    "My work over the past 12 months has allowed me to improve/develop my knowledge, skills and abilities",
    "I know under what conditions (what to do, what to learn, what to achieve), I can “grow” in the Organization",
    "Does your work, within this Organization, satisfy you?",
    "I feel valued and appreciated in the Organization",
    "The work that I actually do is interesting and enjoyable for me",
    "I plan on leaving the Organization within the next year",
    "I recommend our Organization to my friends and acquaintances as a good employer",
    "I am proud to work in the Organization",
    "Our Organization moves with the times (products, technologies, processes)",
    "I believe that the potential of employees, their skills, knowledge and abilities are effectively used in the Organization",
    "Based on your overall previous answers, do you think the situation in the Organization as a whole has changed over the last year?"
  ]
};

/* Engagement Survey — Español
 * GENERATED from the translations workbook (tools/translations.py). Edit the workbook, not this file.
 * Answer values and the order of questions come from English and never change.
 */
ES_I18N.es = {
  code: "es",
  langName: "Español",
  locale: "es-MX",
  ui: {
    start: "Comenzar",
    back: "Atrás",
    next: "Siguiente",
    pressEnter: "presiona Enter ↵",
    keyboardHint: "Teclas 1–{n} · 0 = No sé",
    of: "de",
    section: "Área",
    resume: "Qué bueno que volviste. Tus respuestas hasta ahora están guardadas.",
    resumeYes: "Continuar donde me quedé",
    resumeNo: "Empezar de nuevo",
    loading: "Cargando…",
    sending: "Enviando tus respuestas…",
    errorGeneric: "Algo salió mal. Revisa tu conexión e inténtalo de nuevo.",
    retry: "Intentar de nuevo",
    importance: "¿Qué tan importante es esta pregunta para ti?",
    imp: [
      "Poco importante",
      "Importante",
      "Lo más importante"
    ],
    mostCount: "Lo más importante: {n} de {max}",
    mostFull: "Ya elegiste 15 preguntas como lo más importante. Cambia una de ellas para usarla aquí.",
    comment: "Agregar un comentario (opcional)",
    commentPh: "Tu comentario… Se comparte de forma anónima, tal cual lo escribas."
  },
  intro: {
    eyebrow: "Encuesta de Compromiso",
    title: "{company} quiere escucharte",
    body: "{company} está realizando una encuesta de compromiso junto con el Instituto Adizes. Responderás {n} preguntas sobre tu trabajo diario y la organización.",
    bullets: [
      "La encuesta es anónima: las respuestas se combinan y {company} nunca ve las respuestas individuales.",
      "En cada pregunta indica qué tan importante es para ti. Marca hasta 15 como “Lo más importante” (al menos una).",
      "Puedes dejar un comentario en cualquier pregunta. Los comentarios se comparten tal cual, sin tu nombre; evita detalles que te identifiquen.",
      "Toma de 10 a 15 minutos. Puedes pausar y continuar después con el mismo enlace."
    ],
    note: "Responde según cómo son las cosas hoy. Si no tienes elementos para responder, elige “No sé”.",
    deadline: "Disponible hasta el {date}",
    meta: "{n} preguntas · 10 a 15 minutos · anónima"
  },
  review: {
    eyebrow: "Último paso",
    title: "Revisa tus respuestas",
    body: "Respondiste las {n} preguntas.",
    cannot: "{n} como “No sé”.",
    most: "Lo más importante: {n} de {max}.",
    needMost: "Marca al menos {min} pregunta como “Lo más importante” antes de enviar (abre cualquier pregunta para cambiarlo).",
    missingN: "Faltan {n} preguntas por responder.",
    missingHelp: "Haz clic en cualquier pregunta para responderla o cambiarla.",
    missing: "Sin responder",
    commented: "Comentario",
    warn: "Haz clic en cualquier pregunta para cambiar tu respuesta, su importancia o tu comentario. Una vez enviadas, ya no se pueden cambiar.",
    submit: "Enviar mis respuestas",
    hint: "También puedes enviarlas al final de la lista.",
    back: "Volver a la revisión"
  },
  thanks: {
    title: "Gracias",
    body: "Tus respuestas quedaron registradas de forma anónima. Gracias por tomarte el tiempo de participar. Ya puedes cerrar esta ventana."
  },
  states: {
    noToken: {
      title: "Necesitas tu enlace personal",
      body: "Para responder, abre el enlace que recibiste en tu correo de invitación."
    },
    invalid_link: {
      title: "Este enlace no es válido",
      body: "Revisa que hayas abierto el enlace completo del correo de invitación. Si el problema sigue, escríbenos a info@adizes.com."
    },
    completed: {
      title: "Ya respondiste",
      body: "Tus respuestas quedaron registradas. Gracias por participar."
    },
    closed: {
      title: "Esta encuesta ya cerró",
      body: "Ya no se reciben respuestas. Si crees que es un error, contacta a quien te invitó."
    },
    not_open: {
      title: "Esta encuesta aún no está abierta",
      body: "Inténtalo más tarde con el mismo enlace."
    }
  },
  dontKnow: "No sé",
  scales: {
    F: [
      {
        value: 2,
        label: "Nunca",
        sub: "Totalmente en desacuerdo"
      },
      {
        value: 3,
        label: "A veces",
        sub: "Mayormente en desacuerdo"
      },
      {
        value: 4,
        label: "A menudo",
        sub: "Mayormente de acuerdo"
      },
      {
        value: 5,
        label: "Siempre",
        sub: "Totalmente de acuerdo"
      }
    ],
    A: [
      {
        value: 2,
        label: "Totalmente en desacuerdo",
        sub: "Nunca"
      },
      {
        value: 3,
        label: "Mayormente en desacuerdo",
        sub: "A veces"
      },
      {
        value: 4,
        label: "Mayormente de acuerdo",
        sub: "A menudo"
      },
      {
        value: 5,
        label: "Totalmente de acuerdo",
        sub: "Siempre"
      }
    ],
    FR: [
      {
        value: 5,
        label: "Nunca",
        sub: "Totalmente en desacuerdo"
      },
      {
        value: 4,
        label: "A veces",
        sub: "Mayormente en desacuerdo"
      },
      {
        value: 3,
        label: "A menudo",
        sub: "Mayormente de acuerdo"
      },
      {
        value: 2,
        label: "Siempre",
        sub: "Totalmente de acuerdo"
      }
    ],
    AR: [
      {
        value: 5,
        label: "Totalmente en desacuerdo",
        sub: "Nunca"
      },
      {
        value: 4,
        label: "Mayormente en desacuerdo",
        sub: "A veces"
      },
      {
        value: 3,
        label: "Mayormente de acuerdo",
        sub: "A menudo"
      },
      {
        value: 2,
        label: "Totalmente de acuerdo",
        sub: "Siempre"
      }
    ],
    S: [
      {
        value: 2,
        label: "Totalmente insatisfecho"
      },
      {
        value: 3,
        label: "Mayormente insatisfecho"
      },
      {
        value: 4,
        label: "Mayormente satisfecho"
      },
      {
        value: 5,
        label: "Totalmente satisfecho"
      }
    ],
    C: [
      {
        value: 1,
        label: "Empeoró significativamente"
      },
      {
        value: 2,
        label: "Empeoró ligeramente"
      },
      {
        value: 3,
        label: "Sin cambios tangibles"
      },
      {
        value: 4,
        label: "Mejoró ligeramente"
      },
      {
        value: 5,
        label: "Mejoró significativamente"
      }
    ]
  },
  cells: {
    values: "Valores",
    climate: "Clima",
    styles: "Estilos",
    responsibility: "Estructura de responsabilidad",
    authority: "Estructura de autoridad",
    reward: "Estructura de recompensas",
    supervisor: "Supervisor",
    planning: "Planificación",
    information: "Flujo de información",
    client: "Interfaz con el cliente",
    transformation: "Transformación",
    human: "Factores humanos",
    behaviour: "Comportamiento",
    changes: "Cambios",
    inefficiency: "Ineficiencia"
  },
  levels: {
    fully: {
      name: "Totalmente comprometido",
      desc: [
        "apasionados por su trabajo y por la organización",
        "hacen lo que sea necesario para lograr resultados",
        "entregan resultados consistentes y de alta calidad",
        "encuentran soluciones innovadoras a los problemas más difíciles",
        "son vistos como líderes y modelos a seguir"
      ]
    },
    engaged: {
      name: "Comprometido",
      desc: [
        "enfocados en lograr resultados, proyectos y responsabilidades individuales",
        "tienen un desempeño bueno y sólido",
        "siempre hacen la parte que les corresponde",
        "trabajan bien con otros y ayudan cuando se les pide"
      ]
    },
    somewhat: {
      name: "Algo comprometido",
      desc: [
        "selectivos sobre dónde ponen su energía",
        "dedican mucho tiempo a cosas que no ayudan a los clientes ni a la organización",
        "cumplen cuando tienen que hacerlo o cuando se les supervisa",
        "tienen una influencia negativa en otros"
      ]
    },
    disengaged: {
      name: "No comprometido",
      desc: [
        "trabajan solo cuando tienen que hacerlo",
        "preferirían estar haciendo otra cosa",
        "sus resultados no cumplen los estándares",
        "tienen una perspectiva de “nosotros contra ellos”",
        "son negativos con la organización y en su trato con clientes y colegas"
      ]
    }
  },
  pdf: {
    file: "Encuesta-de-Compromiso",
    title: "Encuesta de Compromiso",
    subtitle: "Reporte",
    company: "Empresa",
    launch: "Encuesta",
    date: "Fecha del reporte",
    responses: "Respuestas",
    of: "de",
    invited: "invitados",
    anon: "La encuesta es anónima. Los resultados solo se muestran en conjunto y los grupos con menos de 5 respuestas nunca se muestran por separado.",
    contents: "Contenido",
    toc: [
      "Distribución por nivel de compromiso",
      "Compromiso por área",
      "Factores organizacionales",
      "Lo más importante para los colaboradores",
      "Todas las preguntas",
      "Comentarios"
    ],
    levelsTitle: "Distribución por nivel de compromiso",
    levelsHelp: "Cada participante se clasifica con todas sus respuestas y con las preguntas que marcó como lo más importante.",
    positive: "Totalmente comprometido + Comprometido",
    people: "personas",
    byAreaTitle: "Compromiso por área",
    byAreaHelp: "Solo se muestran las áreas con 5 o más respuestas. Las áreas más pequeñas se combinan en “Otras áreas” cuando juntas suman 5.",
    company_col: "Empresa",
    other: "Otras áreas",
    hidden: "{n} respuestas de áreas con menos de 5 personas se cuentan solo en el total de la empresa.",
    noAreas: "Ninguna área tiene todavía 5 o más respuestas, por eso no se muestran resultados por área.",
    respondents: "Respuestas",
    factorsTitle: "Factores organizacionales",
    factorsHelp: "Calificación de cada factor con base en las respuestas (“No sé” no cuenta), con el mismo método de la matriz de diagnóstico Adizes. 75% o más es sano; menos de 50% es una anomalía.",
    groups: {
      culture: "Cultura organizacional",
      structure: "Estructura",
      process: "Procesos",
      functions: "Funciones organizacionales",
      effects: "Efectos"
    },
    colors: {
      green: "Todo bien",
      yellow: "Zona de atención",
      red: "Zona de anomalía"
    },
    topTitle: "Lo más importante para los colaboradores",
    topHelp: "Las preguntas que más veces se marcaron como “Lo más importante” y cómo se respondieron.",
    mostPct: "lo más importante",
    distTitle: "Todas las preguntas",
    distHelp: "Distribución de respuestas (%) y, en rojo a la derecha, el porcentaje de participantes que marcaron cada pregunta como lo más importante.",
    legend: {
      "1": "No sé",
      "2": "Nunca / Totalmente en desacuerdo",
      "3": "A veces / Mayormente en desacuerdo",
      "4": "A menudo / Mayormente de acuerdo",
      "5": "Siempre / Totalmente de acuerdo"
    },
    q50: "El verde siempre es la respuesta más positiva: en las afirmaciones negativas 5 y 45 es “Nunca” / “Totalmente en desacuerdo”. La pregunta 50 usa su propia escala (mejoró significativamente → empeoró significativamente).",
    commentsTitle: "Comentarios",
    commentsHelp: "Escritos por los participantes, anónimos y tal cual.",
    noComments: "No se dejaron comentarios.",
    footer: "Instituto Adizes · Encuesta de Compromiso",
    page: "Página",
    cont: "cont."
  },
  questions: [
    "Nuestros líderes siguen los valores declarados en la empresa",
    "Nuestra empresa cumple plenamente sus obligaciones con los empleados",
    "La empresa valora y apoya nuevas ideas",
    "Me siento cómodo con el ambiente de la empresa",
    "Tenemos una cultura de “cada quien por su lado”",
    "Soy elogiado y apreciado cuando hago un buen trabajo",
    "Nos respetamos entre todos",
    "El comportamiento mostrado por los supervisores en nuestra organización contribuye a un ambiente de trabajo saludable, el logro de objetivos y el desarrollo de la organización",
    "Entiendo claramente mis tareas laborales y entiendo mi papel en las actividades de mi departamento",
    "Entiendo lo que debería guiarme en la realización de mi trabajo: políticas, reglamentos, normas, estándares profesionales, etc",
    "Sé a quién puedo acudir con preguntas",
    "Entiendo qué decisiones tengo derecho a tomar",
    "La toma de decisiones sobre asuntos que me afectan se realiza de manera oportuna y predecible",
    "Tengo suficiente autoridad para ser responsable de los resultados de mi trabajo",
    "Creo que el nivel de ingresos que obtengo en la empresa es competitivo",
    "Entiendo de qué depende la parte variable de mis ingresos",
    "Creo que soy capaz de influir en mis ingresos fijos y variables en un grado bastante alto",
    "Mi paquete de beneficios es competitivo en el mercado",
    "Puedo discutir asuntos personales con mi supervisor",
    "Mi supervisor me trata como un individuo",
    "Mi supervisor fomenta mi desarrollo profesional",
    "Mi supervisor me habla regularmente sobre mi progreso",
    "Mi supervisor ofrece comentarios motivadores y de calidad: siempre sé lo que piensa sobre mí y mi trabajo",
    "Las tareas que el supervisor establece para mí son claras y realistas",
    "Me siento cómodo haciendo preguntas aclaratorias a mi supervisor",
    "Creo que las decisiones tomadas por mi supervisor son correctas y útiles para la empresa",
    "Mi supervisor me escucha atentamente y toma en cuenta mi punto de vista",
    "Conozco y entiendo los objetivos a largo plazo de la empresa",
    "Me inspiran los objetivos de nuestra empresa. Estamos comprometidos en un trabajo importante y útil",
    "Entiendo cómo los resultados de mi trabajo afectan el resultado general de la empresa",
    "Tengo la oportunidad de ser escuchado",
    "Tengo suficiente información sobre lo que está sucediendo en la empresa para hacer mi trabajo",
    "Sé quién es el mercado objetivo (cliente interno o externo). Sé qué necesidades podemos satisfacer con qué productos o servicios",
    "Conocemos bien nuestro mercado (clientes internos o externos), monitoreamos tendencias y necesidades y constantemente pensamos en cómo podemos servir mejor a nuestro mercado (clientes internos o externos)",
    "Tengo un ambiente de trabajo cómodo",
    "Tengo todos los recursos técnicos necesarios para hacer bien mi trabajo",
    "Los procesos de trabajo en los que participo están sistematizados y bien organizados",
    "Estamos comprometidos a mejorar nuestros procesos de trabajo y tecnologías aplicadas",
    "Estoy satisfecho con la calidad del trabajo que ofrecen otras unidades",
    "Mi trabajo durante los últimos 12 meses me ha permitido mejorar / desarrollar mis conocimientos, habilidades y capacidades",
    "Sé bajo qué condiciones (qué hacer, qué aprender, qué lograr), puedo “crecer” en la empresa",
    "¿Tu trabajo en esta empresa te satisface?",
    "Me siento valorado y apreciado en la empresa",
    "El trabajo que realmente hago es interesante y agradable para mí",
    "Planeo dejar la empresa dentro del próximo año",
    "Recomiendo nuestra empresa a mis amigos y conocidos como un buen empleador",
    "Estoy orgulloso de trabajar en la empresa",
    "Nuestra empresa se mueve con los tiempos (productos, tecnologías, procesos)",
    "Creo que el potencial de los empleados, sus capacidades, conocimientos y habilidades se utilizan efectivamente en la empresa",
    "Según todas tus respuestas anteriores, ¿crees que la situación de la empresa en su conjunto ha cambiado durante el último año?"
  ]
};

/* Engagement Survey — Lietuvių
 * GENERATED from the translations workbook (tools/translations.py). Edit the workbook, not this file.
 * Answer values and the order of questions come from English and never change.
 */
ES_I18N.lt = {
  code: "lt",
  langName: "Lietuvių",
  locale: "lt-LT",
  ui: {
    start: "Pradėti",
    back: "Atgal",
    next: "Toliau",
    pressEnter: "paspauskite Enter ↵",
    keyboardHint: "Klavišai 1–{n} · 0 = Nežinau",
    of: "iš",
    section: "Sritis",
    resume: "Sveiki sugrįžę! Jūsų ankstesni atsakymai išsaugoti.",
    resumeYes: "Tęsti nuo ten, kur baigiau",
    resumeNo: "Pradėti iš naujo",
    loading: "Įkeliama…",
    sending: "Siunčiami jūsų atsakymai…",
    errorGeneric: "Įvyko klaida. Patikrinkite interneto ryšį ir bandykite dar kartą.",
    retry: "Bandyti dar kartą",
    importance: "Kiek jums svarbus šis klausimas?",
    imp: [
      "Mažiau svarbus",
      "Vidutiniškai svarbus",
      "Svarbiausias"
    ],
    mostCount: "Svarbiausi: {n} iš {max}",
    mostFull: "Jau pažymėta 15 svarbiausių klausimų. Norėdami pažymėti šį, pirmiau pakeiskite vieną iš jų.",
    comment: "Pridėti komentarą (neprivaloma)",
    commentPh: "Jūsų komentaras… Jis bus pateiktas anonimiškai, pažodžiui."
  },
  intro: {
    eyebrow: "Įsitraukimo apklausa",
    title: "{company} nori išgirsti jūsų nuomonę",
    body: "{company} kartu su Adizes institutu atlieka darbuotojų įsitraukimo apklausą. Atsakysite į {n} klausimų apie savo kasdienį darbą ir organizaciją.",
    bullets: [
      "Apklausa anoniminė: atsakymai apibendrinami, o {company} niekada nemato atskirų žmonių atsakymų.",
      "Prie kiekvieno klausimo nurodykite, kiek jis jums svarbus. Pažymėkite iki 15 klausimų kaip „Svarbiausius“ (bent vieną).",
      "Prie bet kurio klausimo galite pridėti komentarą. Komentarai pateikiami pažodžiui be jūsų vardo, todėl nenurodykite detalių, pagal kurias būtų galima jus atpažinti.",
      "Tai užtruks apie 10–15 minučių. Galite sustoti ir vėliau tęsti naudodami tą pačią nuorodą."
    ],
    note: "Atsakykite, kaip yra iš tikrųjų šiandien. Jei neturite pagrindo atsakyti, pasirinkite „Nežinau“.",
    deadline: "Terminas: {date}",
    meta: "Klausimų: {n} · apie 10–15 minučių · anonimiškai"
  },
  review: {
    eyebrow: "Paskutinis žingsnis",
    title: "Peržiūrėkite savo atsakymus",
    body: "Atsakėte į visus klausimus ({n}).",
    cannot: "Atsakymas „Nežinau“: {n}.",
    most: "Svarbiausi: {n} iš {max}.",
    needMost: "Prieš siųsdami pažymėkite bent {min} klausimą kaip „Svarbiausią“ (atidarykite bet kurį klausimą, kad tai pakeistumėte).",
    missingN: "Neatsakyta klausimų: {n}.",
    missingHelp: "Spustelėkite bet kurį klausimą, kad atsakytumėte arba pakeistumėte atsakymą.",
    missing: "Neatsakyta",
    commented: "Komentaras",
    warn: "Spustelėkite bet kurį klausimą, kad pakeistumėte atsakymą, jo svarbą ar komentarą. Išsiųstų atsakymų pakeisti nebegalėsite.",
    submit: "Siųsti atsakymus",
    hint: "Atsakymus galite išsiųsti ir sąrašo apačioje.",
    back: "Grįžti į peržiūrą"
  },
  thanks: {
    title: "Ačiū",
    body: "Jūsų atsakymai anonimiškai užregistruoti. Dėkojame, kad skyrėte laiko apklausai. Galite uždaryti šį langą."
  },
  states: {
    noToken: {
      title: "Reikalinga jūsų asmeninė nuoroda",
      body: "Norėdami atsakyti, atidarykite nuorodą, kurią gavote kvietimo el. laiške."
    },
    invalid_link: {
      title: "Ši nuoroda negalioja",
      body: "Įsitikinkite, kad atidarėte visą nuorodą iš kvietimo el. laiško. Jei problema kartojasi, rašykite info@adizes.com."
    },
    completed: {
      title: "Jūs jau atsakėte",
      body: "Jūsų atsakymai užregistruoti. Ačiū, kad dalyvavote."
    },
    closed: {
      title: "Ši apklausa baigta",
      body: "Atsakymai nebepriimami. Jei manote, kad tai klaida, kreipkitės į jus pakvietusį asmenį."
    },
    not_open: {
      title: "Ši apklausa dar neprasidėjo",
      body: "Pabandykite vėliau naudodami tą pačią nuorodą."
    }
  },
  dontKnow: "Nežinau",
  scales: {
    F: [
      {
        value: 2,
        label: "Niekada",
        sub: "Visiškai nesutinku"
      },
      {
        value: 3,
        label: "Kartais",
        sub: "Iš esmės nesutinku"
      },
      {
        value: 4,
        label: "Dažnai",
        sub: "Iš esmės sutinku"
      },
      {
        value: 5,
        label: "Visada",
        sub: "Visiškai sutinku"
      }
    ],
    A: [
      {
        value: 2,
        label: "Visiškai nesutinku",
        sub: "Niekada"
      },
      {
        value: 3,
        label: "Iš esmės nesutinku",
        sub: "Kartais"
      },
      {
        value: 4,
        label: "Iš esmės sutinku",
        sub: "Dažnai"
      },
      {
        value: 5,
        label: "Visiškai sutinku",
        sub: "Visada"
      }
    ],
    FR: [
      {
        value: 5,
        label: "Niekada",
        sub: "Visiškai nesutinku"
      },
      {
        value: 4,
        label: "Kartais",
        sub: "Iš esmės nesutinku"
      },
      {
        value: 3,
        label: "Dažnai",
        sub: "Iš esmės sutinku"
      },
      {
        value: 2,
        label: "Visada",
        sub: "Visiškai sutinku"
      }
    ],
    AR: [
      {
        value: 5,
        label: "Visiškai nesutinku",
        sub: "Niekada"
      },
      {
        value: 4,
        label: "Iš esmės nesutinku",
        sub: "Kartais"
      },
      {
        value: 3,
        label: "Iš esmės sutinku",
        sub: "Dažnai"
      },
      {
        value: 2,
        label: "Visiškai sutinku",
        sub: "Visada"
      }
    ],
    S: [
      {
        value: 2,
        label: "Visiškai netenkina"
      },
      {
        value: 3,
        label: "Iš esmės netenkina"
      },
      {
        value: 4,
        label: "Iš esmės tenkina"
      },
      {
        value: 5,
        label: "Visiškai tenkina"
      }
    ],
    C: [
      {
        value: 1,
        label: "Gerokai pablogėjo"
      },
      {
        value: 2,
        label: "Šiek tiek pablogėjo"
      },
      {
        value: 3,
        label: "Esminių pokyčių nėra"
      },
      {
        value: 4,
        label: "Šiek tiek pagerėjo"
      },
      {
        value: 5,
        label: "Gerokai pagerėjo"
      }
    ]
  },
  cells: {
    values: "Vertybės",
    climate: "Klimatas",
    styles: "Vadovavimo stiliai",
    responsibility: "Atsakomybės struktūra",
    authority: "Įgaliojimų struktūra",
    reward: "Atlygio struktūra",
    supervisor: "Vadovas",
    planning: "Planavimas",
    information: "Informacijos srautai",
    client: "Bendravimas su klientais",
    transformation: "Transformacija",
    human: "Žmogiškieji veiksniai",
    behaviour: "Elgsena",
    changes: "Pokyčiai",
    inefficiency: "Neefektyvumas"
  },
  levels: {
    fully: {
      name: "Visiškai įsitraukę",
      desc: [
        "aistringai atsidavę savo darbui ir organizacijai",
        "padarys viską, ko reikia, kad pasiektų rezultatą",
        "nuolat pasiekia aukštos kokybės rezultatus",
        "randa nestandartinių ir inovatyvių sprendimų sudėtingiausioms problemoms",
        "laikomi lyderiais ir pavyzdžiu kitiems"
      ]
    },
    engaged: {
      name: "Įsitraukę",
      desc: [
        "susitelkę į rezultatus, projektus ir savo atsakomybes",
        "dirba gerai ir stabiliai",
        "visada atlieka savo darbo dalį",
        "gerai bendradarbiauja su kitais ir padeda, kai paprašoma"
      ]
    },
    somewhat: {
      name: "Iš dalies įsitraukę",
      desc: [
        "rinkasi, kam skirti savo energiją",
        "daug laiko skiria veiklai, kuri nepadeda klientams ir (arba) organizacijai",
        "padaro darbą, kai būtina arba kai yra prižiūrimi",
        "neigiamai veikia kitus"
      ]
    },
    disengaged: {
      name: "Neįsitraukę",
      desc: [
        "dirba tik tada, kai būtina",
        "mieliau užsiimtų kuo nors kitu",
        "rezultatai neatitinka standartų",
        "mąsto kategorijomis „mes ir jie“",
        "neigiamai atsiliepia apie organizaciją ir taip pat elgiasi su klientais bei kolegomis"
      ]
    }
  },
  pdf: {
    file: "Isitraukimo-apklausa",
    title: "Įsitraukimo apklausa",
    subtitle: "Ataskaita",
    company: "Įmonė",
    launch: "Apklausa",
    date: "Ataskaitos data",
    responses: "Atsakymai",
    of: "iš",
    invited: "pakviestų",
    anon: "Apklausa anoniminė. Rezultatai pateikiami tik apibendrinti, o grupės, kuriose mažiau nei 5 atsakymai, niekada nerodomos atskirai.",
    contents: "Turinys",
    toc: [
      "Pasiskirstymas pagal įsitraukimo lygį",
      "Įsitraukimas pagal sritis",
      "Organizacijos veiksniai",
      "Kas darbuotojams svarbiausia",
      "Visi klausimai",
      "Komentarai"
    ],
    levelsTitle: "Pasiskirstymas pagal įsitraukimo lygį",
    levelsHelp: "Kiekvienas dalyvis priskiriamas lygiui pagal visus jo atsakymus ir pagal klausimus, kuriuos jis pažymėjo kaip svarbiausius.",
    positive: "Visiškai įsitraukę + Įsitraukę",
    people: "žm.",
    byAreaTitle: "Įsitraukimas pagal sritis",
    byAreaHelp: "Rodomos tik sritys, kuriose yra 5 ar daugiau atsakymų. Mažesnės sritys sujungiamos į „Kitas sritis“, jei kartu jose yra bent 5 atsakymai.",
    company_col: "Įmonė",
    other: "Kitos sritys",
    hidden: "Atsakymai iš sričių, kuriose mažiau nei 5 žmonės, įskaičiuoti tik į bendrą įmonės rezultatą ({n}).",
    noAreas: "Nė vienoje srityje dar nėra 5 ar daugiau atsakymų, todėl rezultatai pagal sritis nerodomi.",
    respondents: "Respondentai",
    factorsTitle: "Organizacijos veiksniai",
    factorsHelp: "Kiekvieno veiksnio įvertinimas pagal atsakymus („Nežinau“ neįskaičiuojamas), taikant tą patį metodą kaip Adizes diagnostikos matricoje. 75 % ir daugiau — sveika būklė; mažiau nei 50 % — anomalija.",
    groups: {
      culture: "Organizacijos kultūra",
      structure: "Struktūra",
      process: "Procesai",
      functions: "Organizacijos funkcijos",
      effects: "Pasekmės"
    },
    colors: {
      green: "Viskas gerai",
      yellow: "Dėmesio zona",
      red: "Anomalijų zona"
    },
    topTitle: "Kas darbuotojams svarbiausia",
    topHelp: "Klausimai, kurie dažniausiai pažymėti kaip „Svarbiausi“, ir kaip į juos atsakyta.",
    mostPct: "svarbiausia",
    distTitle: "Visi klausimai",
    distHelp: "Atsakymų pasiskirstymas (%) ir raudonai dešinėje — respondentų, pažymėjusių klausimą kaip svarbiausią, dalis.",
    legend: {
      "1": "Nežinau",
      "2": "Niekada / Visiškai nesutinku",
      "3": "Kartais / Iš esmės nesutinku",
      "4": "Dažnai / Iš esmės sutinku",
      "5": "Visada / Visiškai sutinku"
    },
    q50: "Žalia spalva visada žymi palankiausią atsakymą: neigiamiems teiginiams 5 ir 45 tai „Niekada“ / „Visiškai nesutinku“. 50 klausimas turi savo skalę (gerokai pagerėjo → gerokai pablogėjo).",
    commentsTitle: "Komentarai",
    commentsHelp: "Parašyti dalyvių, anonimiški ir pateikti pažodžiui.",
    noComments: "Komentarų nepalikta.",
    footer: "Adizes institutas · Įsitraukimo apklausa",
    page: "Puslapis",
    cont: "tęsinys"
  },
  questions: [
    "Mūsų vadovai laikosi organizacijoje deklaruojamų vertybių",
    "Mūsų organizacija visiškai vykdo savo įsipareigojimus darbuotojams",
    "Organizacija vertina ir palaiko naujas idėjas",
    "Man gera organizacijoje vyraujančioje atmosferoje",
    "Pas mus galioja principas „kiekvienas už save“",
    "Už gerai atliktą darbą sulaukiu padėkos ir įvertinimo",
    "Mes gerbiame vieni kitus",
    "Mūsų organizacijos vadovų elgesys padeda kurti sveiką darbo aplinką, siekti tikslų ir plėtoti organizaciją",
    "Aiškiai suprantu savo darbo užduotis ir savo vaidmenį skyriaus veikloje",
    "Suprantu, kuo turiu vadovautis atlikdamas savo darbą: politikomis, reglamentais, taisyklėmis, profesiniais standartais ir pan.",
    "Žinau, į ką galiu kreiptis su klausimais",
    "Suprantu, kokius sprendimus turiu teisę priimti",
    "Sprendimai klausimais, kurie liečia mane, priimami laiku ir nuspėjamai",
    "Turiu pakankamai įgaliojimų, kad galėčiau atsakyti už savo darbo rezultatus",
    "Manau, kad pajamos, kurias gaunu organizacijoje, yra konkurencingos",
    "Suprantu, nuo ko priklauso kintamoji mano pajamų dalis",
    "Manau, kad galiu gana stipriai paveikti tiek pastoviąją, tiek kintamąją savo pajamų dalį",
    "Mano socialinių naudų paketas konkurencingas rinkoje",
    "Su savo vadovu galiu aptarti asmeninius klausimus",
    "Mano vadovas elgiasi su manimi kaip su asmenybe",
    "Mano vadovas skatina mano profesinį tobulėjimą",
    "Mano vadovas reguliariai kalbasi su manimi apie mano pažangą",
    "Mano vadovas teikia kokybišką ir motyvuojantį grįžtamąjį ryšį — visada žinau, ką jis mano apie mane ir mano darbą",
    "Vadovo man skiriamos užduotys yra aiškios ir įgyvendinamos",
    "Nesivaržau užduoti savo vadovui patikslinančių klausimų",
    "Manau, kad mano vadovo priimami sprendimai yra teisingi ir naudingi organizacijai",
    "Mano vadovas atidžiai mane išklauso ir atsižvelgia į mano nuomonę",
    "Žinau ir suprantu ilgalaikius organizacijos tikslus",
    "Mane įkvepia mūsų organizacijos tikslai. Mes dirbame svarbų ir naudingą darbą",
    "Suprantu, kaip mano darbo rezultatai veikia bendrą organizacijos rezultatą",
    "Turiu galimybę būti išklausytas",
    "Turiu pakankamai informacijos apie tai, kas vyksta organizacijoje, kad galėčiau atlikti savo darbą",
    "Žinau, kas yra mūsų tiksliniai klientai (vidiniai ar išoriniai). Žinau, kokius poreikius ir kokiais produktais ar paslaugomis galime patenkinti",
    "Gerai pažįstame savo rinką (vidinius ar išorinius klientus), stebime tendencijas ir poreikius ir nuolat galvojame, kaip geriau aptarnauti savo klientus (vidinius ar išorinius)",
    "Mano darbo aplinka patogi",
    "Turiu visas technines priemones, reikalingas gerai atlikti savo darbą",
    "Darbo procesai, kuriuose dalyvauju, yra susisteminti ir gerai organizuoti",
    "Esame pasiryžę tobulinti savo darbo procesus ir taikomas technologijas",
    "Mane tenkina kitų padalinių darbo kokybė",
    "Per pastaruosius 12 mėnesių darbas leido man patobulinti ir išplėsti savo žinias, įgūdžius ir gebėjimus",
    "Žinau, kokiomis sąlygomis (ką daryti, ko mokytis, ką pasiekti) galiu „augti“ organizacijoje",
    "Ar jus tenkina jūsų darbas šioje organizacijoje?",
    "Jaučiu, kad organizacijoje esu vertinamas",
    "Darbas, kurį iš tikrųjų dirbu, man įdomus ir teikia malonumą",
    "Planuoju išeiti iš organizacijos per artimiausius metus",
    "Rekomenduoju mūsų organizaciją savo draugams ir pažįstamiems kaip gerą darbdavį",
    "Didžiuojuosi, kad dirbu šioje organizacijoje",
    "Mūsų organizacija neatsilieka nuo laiko (produktai, technologijos, procesai)",
    "Manau, kad darbuotojų potencialas, jų įgūdžiai, žinios ir gebėjimai organizacijoje panaudojami efektyviai",
    "Atsižvelgiant į visus ankstesnius jūsų atsakymus, kaip, jūsų nuomone, per pastaruosius metus pasikeitė padėtis organizacijoje apskritai?"
  ]
};

/* Engagement Survey — Latviešu
 * GENERATED from the translations workbook (tools/translations.py). Edit the workbook, not this file.
 * Answer values and the order of questions come from English and never change.
 */
ES_I18N.lv = {
  code: "lv",
  langName: "Latviešu",
  locale: "lv-LV",
  ui: {
    start: "Sākt",
    back: "Atpakaļ",
    next: "Tālāk",
    pressEnter: "nospiediet Enter ↵",
    keyboardHint: "Taustiņi 1–{n} · 0 = Nezinu",
    of: "no",
    section: "Joma",
    resume: "Laipni lūdzam atpakaļ! Jūsu līdzšinējās atbildes ir saglabātas.",
    resumeYes: "Turpināt no vietas, kur apstājos",
    resumeNo: "Sākt no jauna",
    loading: "Ielādē…",
    sending: "Sūta jūsu atbildes…",
    errorGeneric: "Kaut kas nogāja greizi. Lūdzu, pārbaudiet interneta savienojumu un mēģiniet vēlreiz.",
    retry: "Mēģināt vēlreiz",
    importance: "Cik svarīgs jums ir šis jautājums?",
    imp: [
      "Mazāk svarīgs",
      "Vidēji svarīgs",
      "Vissvarīgākais"
    ],
    mostCount: "Vissvarīgākie: {n} no {max}",
    mostFull: "Jau ir atzīmēti 15 jautājumi kā vissvarīgākie. Lai atzīmētu šo, vispirms mainiet kādu no tiem.",
    comment: "Pievienot komentāru (nav obligāti)",
    commentPh: "Jūsu komentārs… Tas tiks parādīts anonīmi un vārds vārdā."
  },
  intro: {
    eyebrow: "Iesaistes aptauja",
    title: "{company} vēlas uzzināt jūsu viedokli",
    body: "{company} kopā ar Adizes institūtu veic darbinieku iesaistes aptauju. Jūs atbildēsiet uz {n} jautājumiem par savu ikdienas darbu un organizāciju.",
    bullets: [
      "Aptauja ir anonīma: atbildes tiek apkopotas, un {company} nekad neredz nevienas personas individuālās atbildes.",
      "Pie katra jautājuma norādiet, cik tas jums ir svarīgs. Atzīmējiet līdz 15 jautājumiem kā “Vissvarīgākie” (vismaz vienu).",
      "Pie jebkura jautājuma varat pievienot komentāru. Komentāri tiek parādīti vārds vārdā bez jūsu vārda, tāpēc nenorādiet detaļas, pēc kurām jūs varētu atpazīt.",
      "Tas aizņems apmēram 10–15 minūtes. Varat pārtraukt un vēlāk turpināt ar to pašu saiti."
    ],
    note: "Atbildiet par to, kā lietas ir patiesībā šodien. Ja jums nav pamata atbildēt, izvēlieties “Nezinu”.",
    deadline: "Termiņš: {date}",
    meta: "{n} jautājumi · apmēram 10–15 minūtes · anonīmi"
  },
  review: {
    eyebrow: "Pēdējais solis",
    title: "Pārskatiet savas atbildes",
    body: "Jūs atbildējāt uz visiem {n} jautājumiem.",
    cannot: "Atbilde “Nezinu”: {n}.",
    most: "Vissvarīgākie: {n} no {max}.",
    needMost: "Pirms nosūtīšanas atzīmējiet vismaz {min} jautājumu kā “Vissvarīgākais” (atveriet jebkuru jautājumu, lai to mainītu).",
    missingN: "Neatbildēti jautājumi: {n}.",
    missingHelp: "Noklikšķiniet uz jebkura jautājuma, lai atbildētu vai mainītu atbildi.",
    missing: "Nav atbildes",
    commented: "Komentārs",
    warn: "Noklikšķiniet uz jebkura jautājuma, lai mainītu atbildi, tās svarīgumu vai komentāru. Pēc nosūtīšanas atbildes vairs nevarēs mainīt.",
    submit: "Nosūtīt atbildes",
    hint: "Atbildes var nosūtīt arī saraksta beigās.",
    back: "Atpakaļ uz pārskatu"
  },
  thanks: {
    title: "Paldies",
    body: "Jūsu atbildes ir anonīmi saņemtas. Paldies, ka veltījāt laiku dalībai aptaujā! Varat aizvērt šo logu."
  },
  states: {
    noToken: {
      title: "Nepieciešama jūsu personīgā saite",
      body: "Lai atbildētu, atveriet saiti, ko saņēmāt uzaicinājuma e-pastā."
    },
    invalid_link: {
      title: "Šī saite nav derīga",
      body: "Pārliecinieties, ka atvērāt pilnu saiti no uzaicinājuma e-pasta. Ja problēma atkārtojas, rakstiet uz info@adizes.com."
    },
    completed: {
      title: "Atbildes jau ir iesniegtas",
      body: "Jūsu atbildes ir saņemtas. Paldies par dalību!"
    },
    closed: {
      title: "Šī aptauja ir slēgta",
      body: "Atbildes vairs netiek pieņemtas. Ja uzskatāt, ka tā ir kļūda, sazinieties ar personu, kas jūs uzaicināja."
    },
    not_open: {
      title: "Šī aptauja vēl nav sākusies",
      body: "Lūdzu, mēģiniet vēlāk ar to pašu saiti."
    }
  },
  dontKnow: "Nezinu",
  scales: {
    F: [
      {
        value: 2,
        label: "Nekad",
        sub: "Pilnībā nepiekrītu"
      },
      {
        value: 3,
        label: "Dažreiz",
        sub: "Drīzāk nepiekrītu"
      },
      {
        value: 4,
        label: "Bieži",
        sub: "Drīzāk piekrītu"
      },
      {
        value: 5,
        label: "Vienmēr",
        sub: "Pilnībā piekrītu"
      }
    ],
    A: [
      {
        value: 2,
        label: "Pilnībā nepiekrītu",
        sub: "Nekad"
      },
      {
        value: 3,
        label: "Drīzāk nepiekrītu",
        sub: "Dažreiz"
      },
      {
        value: 4,
        label: "Drīzāk piekrītu",
        sub: "Bieži"
      },
      {
        value: 5,
        label: "Pilnībā piekrītu",
        sub: "Vienmēr"
      }
    ],
    FR: [
      {
        value: 5,
        label: "Nekad",
        sub: "Pilnībā nepiekrītu"
      },
      {
        value: 4,
        label: "Dažreiz",
        sub: "Drīzāk nepiekrītu"
      },
      {
        value: 3,
        label: "Bieži",
        sub: "Drīzāk piekrītu"
      },
      {
        value: 2,
        label: "Vienmēr",
        sub: "Pilnībā piekrītu"
      }
    ],
    AR: [
      {
        value: 5,
        label: "Pilnībā nepiekrītu",
        sub: "Nekad"
      },
      {
        value: 4,
        label: "Drīzāk nepiekrītu",
        sub: "Dažreiz"
      },
      {
        value: 3,
        label: "Drīzāk piekrītu",
        sub: "Bieži"
      },
      {
        value: 2,
        label: "Pilnībā piekrītu",
        sub: "Vienmēr"
      }
    ],
    S: [
      {
        value: 2,
        label: "Pilnīgi neapmierina"
      },
      {
        value: 3,
        label: "Drīzāk neapmierina"
      },
      {
        value: 4,
        label: "Drīzāk apmierina"
      },
      {
        value: 5,
        label: "Pilnīgi apmierina"
      }
    ],
    C: [
      {
        value: 1,
        label: "Būtiski pasliktinājusies"
      },
      {
        value: 2,
        label: "Nedaudz pasliktinājusies"
      },
      {
        value: 3,
        label: "Būtisku pārmaiņu nav"
      },
      {
        value: 4,
        label: "Nedaudz uzlabojusies"
      },
      {
        value: 5,
        label: "Būtiski uzlabojusies"
      }
    ]
  },
  cells: {
    values: "Vērtības",
    climate: "Klimats",
    styles: "Vadības stili",
    responsibility: "Pienākumu struktūra",
    authority: "Pilnvaru struktūra",
    reward: "Atlīdzības struktūra",
    supervisor: "Vadītājs",
    planning: "Plānošana",
    information: "Informācijas plūsma",
    client: "Mijiedarbība ar klientiem",
    transformation: "Transformācija",
    human: "Cilvēkresursi",
    behaviour: "Uzvedība",
    changes: "Pārmaiņas",
    inefficiency: "Neefektivitāte"
  },
  levels: {
    fully: {
      name: "Pilnībā iesaistīti",
      desc: [
        "aizrautīgi attiecībā uz savu darbu un organizāciju",
        "darīs visu nepieciešamo, lai sasniegtu rezultātu",
        "pastāvīgi sasniedz augstas kvalitātes rezultātus",
        "atrod nestandarta un inovatīvus risinājumus vissarežģītākajām problēmām",
        "tiek uztverti kā līderi un paraugs citiem"
      ]
    },
    engaged: {
      name: "Iesaistīti",
      desc: [
        "koncentrējas uz rezultātu, projektu un savu pienākumu izpildi",
        "strādā labi un stabili",
        "vienmēr paveic savu darba daļu",
        "labi sadarbojas ar citiem un palīdz, kad tiek lūgti"
      ]
    },
    somewhat: {
      name: "Daļēji iesaistīti",
      desc: [
        "izvēlīgi attiecībā uz to, kam veltīt savu enerģiju",
        "daudz laika velta lietām, kas nepalīdz klientiem un/vai organizācijai",
        "paveic darbu, kad tas ir nepieciešams vai kad viņus uzrauga",
        "negatīvi ietekmē citus"
      ]
    },
    disengaged: {
      name: "Neiesaistīti",
      desc: [
        "strādā tikai tad, kad tas ir nepieciešams",
        "labprātāk darītu kaut ko citu",
        "rezultāti neatbilst standartiem",
        "domā kategorijās “mēs un viņi”",
        "negatīvi izsakās par organizāciju un saskarsmē ar klientiem un kolēģiem"
      ]
    }
  },
  pdf: {
    file: "Iesaistes-aptauja",
    title: "Iesaistes aptauja",
    subtitle: "Atskaite",
    company: "Uzņēmums",
    launch: "Aptauja",
    date: "Atskaites datums",
    responses: "Atbildes",
    of: "no",
    invited: "uzaicinātajiem",
    anon: "Aptauja ir anonīma. Rezultāti tiek rādīti tikai apkopotā veidā, un grupas ar mazāk nekā 5 atbildēm nekad netiek rādītas atsevišķi.",
    contents: "Saturs",
    toc: [
      "Sadalījums pa iesaistes līmeņiem",
      "Iesaiste pa jomām",
      "Organizācijas faktori",
      "Kas darbiniekiem ir vissvarīgākais",
      "Visi jautājumi",
      "Komentāri"
    ],
    levelsTitle: "Sadalījums pa iesaistes līmeņiem",
    levelsHelp: "Katrs dalībnieks tiek klasificēts pēc visām viņa atbildēm un pēc jautājumiem, ko viņš atzīmēja kā vissvarīgākos.",
    positive: "Pilnībā iesaistīti + Iesaistīti",
    people: "cilv.",
    byAreaTitle: "Iesaiste pa jomām",
    byAreaHelp: "Tiek rādītas tikai jomas ar 5 vai vairāk atbildēm. Mazākas jomas tiek apvienotas grupā “Citas jomas”, ja kopā tās sasniedz 5.",
    company_col: "Uzņēmums",
    other: "Citas jomas",
    hidden: "Atbildes no jomām, kurās ir mazāk nekā 5 cilvēki, ir iekļautas tikai uzņēmuma kopsummā ({n}).",
    noAreas: "Nevienā jomā vēl nav 5 vai vairāk atbilžu, tāpēc rezultāti pa jomām netiek rādīti.",
    respondents: "Respondenti",
    factorsTitle: "Organizācijas faktori",
    factorsHelp: "Katra faktora vērtējums pēc atbildēm (“Nezinu” netiek ņemts vērā), izmantojot to pašu metodi kā Adizes diagnostikas matricā. 75% un vairāk — veselīgs stāvoklis; zem 50% — anomālija.",
    groups: {
      culture: "Organizācijas kultūra",
      structure: "Struktūra",
      process: "Procesi",
      functions: "Organizācijas funkcijas",
      effects: "Sekas"
    },
    colors: {
      green: "Viss kārtībā",
      yellow: "Uzmanības zona",
      red: "Anomāliju zona"
    },
    topTitle: "Kas darbiniekiem ir vissvarīgākais",
    topHelp: "Jautājumi, kas visbiežāk atzīmēti kā “Vissvarīgākie”, un kā uz tiem tika atbildēts.",
    mostPct: "vissvarīgākais",
    distTitle: "Visi jautājumi",
    distHelp: "Atbilžu sadalījums (%) un sarkanā krāsā labajā pusē — to respondentu daļa, kuri šo jautājumu atzīmēja kā vissvarīgāko.",
    legend: {
      "1": "Nezinu",
      "2": "Nekad / Pilnībā nepiekrītu",
      "3": "Dažreiz / Drīzāk nepiekrītu",
      "4": "Bieži / Drīzāk piekrītu",
      "5": "Vienmēr / Pilnībā piekrītu"
    },
    q50: "Zaļā krāsa vienmēr ir pozitīvākā atbilde: negatīvajiem apgalvojumiem 5 un 45 tā ir “Nekad” / “Pilnībā nepiekrītu”. 50. jautājumam ir sava skala (būtiski uzlabojusies → būtiski pasliktinājusies).",
    commentsTitle: "Komentāri",
    commentsHelp: "Dalībnieku rakstīti, anonīmi un vārds vārdā.",
    noComments: "Komentāri netika atstāti.",
    footer: "Adizes institūts · Iesaistes aptauja",
    page: "Lapa",
    cont: "turp."
  },
  questions: [
    "Uzņēmuma vadītāji ievēro tajā deklarētās vērtības",
    "Mūsu uzņēmums pilnībā pilda savas saistības pret darbiniekiem",
    "Uzņēmums novērtē un atbalsta jaunas idejas",
    "Es jūtos labi uzņēmumā valdošajā atmosfērā",
    "Pie mums uzņēmumā katrs ir pats par sevi",
    "Par labi padarītu darbu es saņemu pateicību un novērtējumu",
    "Mēs cienām viens otru",
    "Mūsu uzņēmuma vadītāju uzvedība veicina veselīgu darba vidi, mērķu sasniegšanu un uzņēmuma attīstību",
    "Es skaidri saprotu savus darba uzdevumus un savu lomu nodaļas darbā",
    "Man ir saprotams, kādas procedūras, noteikumi, politikas, profesionālie standarti u. tml. regulē manu darbu",
    "Es zinu, pie kā vērsties ar jautājumiem",
    "Es saprotu, kādus lēmumus man ir tiesības pieņemt",
    "Lēmumi jautājumos, kas skar mani, tiek pieņemti laikus un paredzamā veidā",
    "Man ir pietiekamas pilnvaras, lai uzņemtos atbildību par sava darba rezultātiem",
    "Mans atalgojuma līmenis uzņēmumā ir konkurētspējīgs",
    "Es saprotu, no kā ir atkarīga mana ienākumu mainīgā daļa",
    "Es uzskatu, ka varu diezgan lielā mērā ietekmēt gan fiksēto, gan mainīgo ienākumu daļu",
    "Mana sociālā pakete ir konkurētspējīga tirgū",
    "Es varu pārrunāt personiskus jautājumus ar savu vadītāju",
    "Mans vadītājs izturas pret mani kā pret personību",
    "Mans vadītājs veicina manu profesionālo izaugsmi",
    "Mans vadītājs regulāri runā ar mani par manu progresu",
    "Mans vadītājs sniedz kvalitatīvu un motivējošu atgriezenisko saiti — es vienmēr zinu, ko viņš domā par mani un manu darbu",
    "Uzdevumi, ko man uzdod mans vadītājs, ir skaidri un izpildāmi",
    "Es varu droši uzdot savam vadītājam precizējošus jautājumus",
    "Es uzskatu, ka mana vadītāja pieņemtie lēmumi ir pareizi un noderīgi uzņēmumam",
    "Mans vadītājs uzmanīgi uzklausa mani un ņem vērā manu viedokli",
    "Es zinu un saprotu uzņēmuma ilgtermiņa mērķus",
    "Mani iedvesmo mūsu uzņēmuma mērķi. Mēs darām svarīgu un noderīgu darbu",
    "Es saprotu, kā mana darba rezultāti ietekmē uzņēmuma kopējos rezultātus",
    "Man ir iespēja tikt uzklausītam",
    "Man ir pietiekami daudz informācijas par to, kas notiek uzņēmumā, lai veiktu savu darbu",
    "Es zinu, kuri ir mūsu mērķa klienti (iekšējie vai ārējie). Es zinu, kādas vajadzības mēs varam apmierināt un ar kādiem produktiem vai pakalpojumiem",
    "Mēs labi zinām savu tirgu (iekšējos vai ārējos klientus), sekojam tendencēm un vajadzībām un pastāvīgi domājam, kā labāk apkalpot savus klientus (iekšējos vai ārējos)",
    "Man ir ērta darba vide",
    "Man ir visi nepieciešamie tehniskie resursi, lai labi veiktu savu darbu",
    "Darba procesi, kuros es piedalos, ir sistematizēti un labi organizēti",
    "Mēs apņēmīgi uzlabojam savus darba procesus un izmantotās tehnoloģijas",
    "Mani apmierina darba kvalitāte, ko nodrošina citas nodaļas",
    "Pēdējo 12 mēnešu laikā mans darbs ir ļāvis man uzlabot un attīstīt savas zināšanas, prasmes un iemaņas",
    "Es zinu, ar kādiem nosacījumiem (kas jādara, jāmācās, jāsasniedz) es varu “augt” uzņēmumā",
    "Vai jūs kopumā apmierina darbs šajā uzņēmumā?",
    "Es jūtu, ka uzņēmumā mani novērtē",
    "Darbs, ko es patiesībā daru, man ir interesants un sniedz gandarījumu",
    "Es plānoju aiziet no uzņēmuma tuvākā gada laikā",
    "Es iesaku mūsu uzņēmumu saviem draugiem un paziņām kā labu darba devēju",
    "Es lepojos, ka strādāju šajā uzņēmumā",
    "Uzņēmums attīstās līdzi laikam (produkti, tehnoloģijas, procesi)",
    "Es uzskatu, ka darbinieku potenciāls, viņu prasmes, zināšanas un iemaņas uzņēmumā tiek izmantotas efektīvi",
    "Ņemot vērā visas iepriekšējās atbildes, kā, jūsuprāt, situācija uzņēmumā kopumā ir mainījusies pēdējā gada laikā?"
  ]
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

/* Engagement Survey — scoring engine (legacy s.adizes.com rules, questionnaire 28 / "AA").
 * Plain ES5: the SAME file runs in the participant widget, the admin and Apps Script.
 *
 * Per respondent (legacy CalculateResult::calculateInvolvement, checked in this exact order):
 *   all[k]  = share of answers with raw value k (1..5) over every answered question ("Don't know" = 1 counts)
 *   most[k] = the same, only over the questions marked "most important" (importance level 3)
 *   all4+all5 ≥ 70 and most4+most5 = 100      → fully engaged
 *   all4+all5 ≥ 60 and most4+most5 ≥ 70       → engaged
 *   all2+all3 ≥ 70 and most2+most3 ≥ 70       → disengaged
 *   otherwise                                  → somewhat engaged
 * Raw values always mean the same direction (5 = best): Q5 and Q45 are negative statements and their
 * answer labels are reversed in the data, exactly like the legacy platform (done correctly in every language).
 */
var ES = (function () {
  function rep(v, n) { var a = []; for (var i = 0; i < n; i++) a.push(v); return a; }
  var QUESTION_CATS = [].concat(rep(17, 3), rep(18, 4), [19], rep(20, 3), rep(21, 3), rep(22, 4), rep(34, 9), rep(23, 3), rep(24, 2), rep(26, 2), rep(27, 4), rep(28, 3), rep(30, 6), [31], [32], [31]);
  // Scale of each question: F frequency · A agreement · FR/AR reversed (Q5, Q45) · S satisfaction (Q42) · C change (Q50, no "Don't know")
  var AGREE = [8, 10, 12, 15, 16, 17, 18, 26, 28, 29, 30, 33, 41, 47, 49];
  var SCALES = QUESTION_CATS.map(function (c, i) {
    var q = i + 1;
    return q === 5 ? 'FR' : q === 45 ? 'AR' : q === 42 ? 'S' : q === 50 ? 'C' : AGREE.indexOf(q) >= 0 ? 'A' : 'F';
  });
  var CATS = [
    { id: 17, key: 'values', group: 'culture' }, { id: 18, key: 'climate', group: 'culture' }, { id: 19, key: 'styles', group: 'culture' },
    { id: 20, key: 'responsibility', group: 'structure' }, { id: 21, key: 'authority', group: 'structure' }, { id: 22, key: 'reward', group: 'structure' },
    { id: 23, key: 'planning', group: 'process' }, { id: 24, key: 'information', group: 'process' },
    { id: 26, key: 'client', group: 'functions' }, { id: 27, key: 'transformation', group: 'functions' }, { id: 28, key: 'human', group: 'functions' }, { id: 34, key: 'supervisor', group: 'functions' },
    { id: 30, key: 'behaviour', group: 'effects' }, { id: 31, key: 'changes', group: 'effects' }, { id: 32, key: 'inefficiency', group: 'effects' },
  ];
  var GROUPS = ['culture', 'structure', 'process', 'functions', 'effects'];
  var LEVELS = ['fully', 'engaged', 'somewhat', 'disengaged'];
  var COUNT = QUESTION_CATS.length, MAX_MOST = 15, MIN_MOST = 1, MIN_RESPONSES = 5, MIN_GROUP = 5;

  function hasDontKnow(q) { return SCALES[q] !== 'C'; }

  function classify(answers, importance) {
    var all = [0, 0, 0, 0, 0, 0], most = [0, 0, 0, 0, 0, 0], nAll = 0, nMost = 0;
    for (var i = 0; i < answers.length; i++) {
      var v = Number(answers[i]);
      if (!(v >= 1 && v <= 5)) continue;
      all[v]++; nAll++;
      if (Number(importance && importance[i]) === 3) { most[v]++; nMost++; }
    }
    function p(arr, n, a, b) { return n ? (arr[a] + arr[b]) / n * 100 : 0; }
    var a45 = p(all, nAll, 4, 5), a23 = p(all, nAll, 2, 3), m45 = p(most, nMost, 4, 5), m23 = p(most, nMost, 2, 3);
    var level = (a45 >= 70 && m45 === 100) ? 'fully' : (a45 >= 60 && m45 >= 70) ? 'engaged' : (a23 >= 70 && m23 >= 70) ? 'disengaged' : 'somewhat';
    return { level: level, all45: a45, all23: a23, most45: m45, most23: m23, mostCount: nMost };
  }

  function validResponse(answers, importance) {
    if (!answers || answers.length !== COUNT || !importance || importance.length !== COUNT) return 'invalid_answers';
    var most = 0;
    for (var i = 0; i < COUNT; i++) {
      var v = Number(answers[i]), m = Number(importance[i]);
      if (!(v >= 1 && v <= 5 && Math.floor(v) === v)) return 'invalid_answers';
      if ([1, 2, 3].indexOf(m) < 0) return 'invalid_importance';
      if (m === 3) most++;
    }
    if (most < MIN_MOST || most > MAX_MOST) return 'invalid_importance';
    return '';
  }

  function levelCounts(list) {
    var c = { fully: 0, engaged: 0, somewhat: 0, disengaged: 0 }, n = list.length;
    list.forEach(function (r) { c[r.level]++; });
    var pct = {}; LEVELS.forEach(function (k) { pct[k] = n ? c[k] / n * 100 : 0; });
    return { n: n, count: c, pct: pct, positive: n ? (c.fully + c.engaged) / n * 100 : 0 };
  }

  /**
   * responses: [{ answers:[50], importance:[50], area:'', comments:[50] }]
   * Returns everything the report needs. Areas with fewer than 5 responses are never shown on their own:
   * they are pooled into "other areas" (shown only if that pool has 5 or more).
   */
  function aggregate(responses) {
    var rs = responses.map(function (r) {
      var c = classify(r.answers, r.importance);
      return { answers: r.answers.map(Number), importance: r.importance.map(Number), area: String(r.area || '').trim(), comments: r.comments || [], level: c.level };
    });
    var overall = levelCounts(rs);
    // areas
    var byArea = {};
    rs.forEach(function (r) { var k = r.area || ''; (byArea[k] = byArea[k] || []).push(r); });
    var areas = [], other = [];
    Object.keys(byArea).sort().forEach(function (k) {
      if (k && byArea[k].length >= MIN_GROUP) areas.push({ name: k, levels: levelCounts(byArea[k]) });
      else other = other.concat(byArea[k]);
    });
    var otherGroup = other.length >= MIN_GROUP && areas.length ? { levels: levelCounts(other), hidden: 0 } : { levels: null, hidden: other.length };
    // questions
    var questions = [];
    for (var q = 0; q < COUNT; q++) {
      var dist = [0, 0, 0, 0, 0, 0], most = 0, comments = [];
      rs.forEach(function (r) { dist[r.answers[q]]++; if (r.importance[q] === 3) most++; var cm = String(r.comments[q] || '').trim(); if (cm) comments.push(cm); });
      var st = q === COUNT - 1 ? null : ED.questionStats(rs.map(function (r) { return r.answers[q]; }));
      questions.push({ i: q, cat: QUESTION_CATS[q], scale: SCALES[q], dist: dist, n: rs.length, mostPct: rs.length ? most / rs.length * 100 : 0, stats: st, comments: comments });
    }
    // factors (same statistics as the Express Diagnostics matrix; Q50 is a meta question and is left out)
    var cats = CATS.map(function (c) {
      var qs = questions.filter(function (x) { return x.cat === c.id && x.stats; });
      var mid = 0, disp = 0; qs.forEach(function (x) { mid += x.stats.middle; disp += x.stats.dispersion; });
      mid = qs.length ? mid / qs.length : 0; disp = qs.length ? disp / qs.length : 0;
      return { id: c.id, key: c.key, group: c.group, middle: mid, dispersion: disp, percent: mid / 4 * 100, color: ED.colorOf(mid), questions: qs.map(function (x) { return x.i; }) };
    });
    var top = questions.filter(function (x) { return x.mostPct > 0; }).sort(function (a, b) { return b.mostPct - a.mostPct || a.i - b.i; }).slice(0, 10);
    var nComments = questions.reduce(function (s, x) { return s + x.comments.length; }, 0);
    return { n: rs.length, overall: overall, areas: areas, other: otherGroup, questions: questions, cats: cats, top: top, nComments: nComments };
  }

  return {
    COUNT: COUNT, QUESTION_CATS: QUESTION_CATS, SCALES: SCALES, CATS: CATS, GROUPS: GROUPS, LEVELS: LEVELS,
    MAX_MOST: MAX_MOST, MIN_MOST: MIN_MOST, MIN_RESPONSES: MIN_RESPONSES, MIN_GROUP: MIN_GROUP,
    hasDontKnow: hasDontKnow, classify: classify, validResponse: validResponse, aggregate: aggregate, levelCounts: levelCounts,
  };
})();

/* Participant survey shell shared by Express Diagnostics and Engagement Survey.
 * Personal link ?t=TOKEN → p_load → intro → one statement per screen → review (all answers, click to edit)
 * → p_submit → thank-you. The participant never sees results. Language = the launch's language.
 *
 * spec = {
 *   I18N, prefix (storage key), count, autoAdvance,
 *   section(q) → { index, total, key }       // progress segments + eyebrow
 *   options(t, q) → [{ value, label, sub }]  // in display order (keys 1..n)
 *   cannot(t, q) → label | null              // raw value 1 ("I cannot answer" / "Don't know")
 *   text(t, q) → statement
 *   importance: { max, min } | null          // Engagement Survey: less / medium / most important
 *   comments: bool
 *   payload(state) → extra fields for p_submit
 * }
 */
function Survey(el, cfg, spec) {
  this.el = el; this.cfg = cfg; this.spec = spec; this.I18N = spec.I18N; this.N = spec.count;
  this.token = (qs('t') || '').replace(/[^A-Za-z0-9]/g, '');
  this.skey = spec.prefix + (this.token || 'demo');
  this.info = null;
  this.lang = this.pickLang(cfg.lang !== 'auto' ? cfg.lang : '');
  this.state = this.fresh();
  this.busy = false; this.dir = 1; this.reviewing = false;
  this.root = document.createElement('div');
  this.root.className = 'adz';
  el.innerHTML = ''; el.appendChild(this.root);
  var self = this;
  this.onKey = function (e) { self.key(e); };
  document.addEventListener('keydown', this.onKey);
  // sections: first question of each, and size
  this.sec = {};
  for (var q = 0; q < this.N; q++) { var s = spec.section(q); if (!this.sec[s.index]) this.sec[s.index] = { start: q, len: 0 }; this.sec[s.index].len++; }
  this.boot();
}
var SP = Survey.prototype;
SP.fresh = function () { var n = this.N; return { step: 0, answers: [], importance: this.spec.importance ? Array.apply(null, Array(n)).map(function () { return 1; }) : null, comments: this.spec.comments ? [] : null }; };
SP.t = function () { return this.I18N[this.lang] || this.I18N.en; };
SP.pickLang = function (want) {
  var avail = Object.keys(this.I18N);
  if (!want) want = (navigator.language || 'en').slice(0, 2).toLowerCase();
  return avail.indexOf(want) >= 0 ? want : (avail.indexOf('en') >= 0 ? 'en' : avail[0]);
};
SP.save = function () { store(this.skey, this.state); };
SP.vars = function () {
  var i = this.info || {};
  return { company: esc(i.company || ''), first: esc(i.firstName || ''), date: esc(i.closeDate ? formatDate(i.closeDate + 'T12:00:00', this.t().locale) : ''), n: this.N, max: this.spec.importance ? this.spec.importance.max : '' };
};
SP.mostCount = function () { var c = 0; (this.state.importance || []).forEach(function (v) { if (v === 3) c++; }); return c; };

/* ---------- loading the invitation ---------- */
SP.boot = function () {
  var self = this, t = this.t();
  if (!this.token && this.cfg.endpoint) return this.renderState('noToken');
  this.frame('<div class="adz-loading"><div class="adz-spinner"></div><p class="adz-lead">' + esc(t.ui.loading) + '</p></div>');
  var req = this.cfg.endpoint ? api(this.cfg.endpoint, { action: 'p_load', t: this.token }, 20000)
    : Promise.resolve({ ok: true, state: 'open', lang: this.lang, company: 'Demo Company', firstName: 'Demo', closeDate: '' });
  req.then(function (info) {
    self.info = info;
    self.lang = self.pickLang(info.lang);   // the launch decides the language
    if (info.state !== 'open') { store(self.skey, null); return self.renderState(info.state); }
    var saved = load(self.skey);
    if (saved && (saved.answers || []).some(Boolean)) { self.saved = saved; self.renderResume(); }
    else self.renderIntro();
  }).catch(function (e) {
    if (e && e.code === 'invalid_link') return self.renderState('invalid_link');
    self.frame('<div class="adz-loading"><p class="adz-lead">' + esc(t.ui.errorGeneric) + '</p>' +
      '<button type="button" class="adz-btn" data-act="retry">' + esc(t.ui.retry) + '</button></div>');
    self.root.querySelector('[data-act="retry"]').addEventListener('click', function () { self.boot(); });
  });
};

/* ---------- chrome ---------- */
SP.logo = function () {
  var b = this.cfg.assetsBase;
  return b ? '<img class="adz-logo" alt="Adizes Institute" src="' + esc(b + 'adizes-logo-color.png') + '">' : '<span class="adz-logo-txt">ADIZES</span>';
};
SP.progress = function () {
  var answered = this.state.step, sec = this.sec;
  return '<div class="adz-progress" aria-hidden="true">' + Object.keys(sec).map(function (k) {
    var s = sec[k], f = Math.max(0, Math.min(1, (answered - s.start) / s.len));
    return '<span style="flex:' + s.len + '"><i style="width:' + (f * 100) + '%"></i></span>';
  }).join('') + '</div>';
};
SP.frame = function (inner, opts) {
  opts = opts || {};
  var right = opts.right || '', stage = this.root.firstChild;
  // Build the stage once; afterwards only the progress bar and the screen are replaced,
  // so the logo and the header never reload (no flash between questions).
  if (!stage || !stage.classList || !stage.classList.contains('adz-stage') || stage.getAttribute('data-right') !== right) {
    this.root.innerHTML = '<div class="adz-stage"><div class="adz-top">' + this.logo() + right + '</div>' +
      '<div class="adz-progress-slot"></div><div class="adz-body"></div></div>';
    stage = this.root.firstChild; stage.setAttribute('data-right', right);
  }
  var slot = stage.querySelector('.adz-progress-slot'), body = stage.querySelector('.adz-body');
  if (opts.progress) {
    var bar = slot.firstChild, fresh = this.progress();
    var tmp = document.createElement('div'); tmp.innerHTML = fresh;
    if (bar && bar.children.length === tmp.firstChild.children.length) {
      // same sections: only move the fills, so they glide instead of being redrawn
      Array.prototype.forEach.call(tmp.firstChild.querySelectorAll('i'), function (i, k) { bar.querySelectorAll('i')[k].style.width = i.style.width; });
    } else slot.innerHTML = fresh;
  } else slot.innerHTML = '';
  body.className = 'adz-body' + (opts.top ? ' is-top' : '');
  body.innerHTML = '<div class="adz-screen' + (opts.wide ? ' is-wide' : '') + (this.dir < 0 ? ' is-back' : '') + (opts.still ? ' is-still' : '') + '">' + inner + '</div>';
  this.scrollTop();
};
SP.scrollTop = function () {
  if (!this.mounted) { this.mounted = true; return; }
  var r = this.el.getBoundingClientRect();
  if (r.top < 0 || r.top > window.innerHeight * 0.4) {
    try { window.scrollTo({ top: window.pageYOffset + r.top - 10, behavior: 'smooth' }); } catch (e) { window.scrollTo(0, window.pageYOffset + r.top - 10); }
  }
};

/* ---------- screens ---------- */
SP.renderState = function (key) {
  var t = this.t(), s = t.states[key] || t.states.invalid_link;
  this.view = 'state';
  this.frame('<div class="adz-msg"><div class="adz-eyebrow">' + esc(t.intro.eyebrow) + '</div>' +
    '<h1 class="adz-h1 adz-h1--sm">' + esc(s.title) + '</h1><p class="adz-lead">' + esc(s.body) + '</p></div>');
};
SP.renderIntro = function () {
  var t = this.t(), v = this.vars(), self = this, i = this.info || {};
  this.view = 'intro';
  this.frame(
    '<div class="adz-eyebrow">' + esc(t.intro.eyebrow) + (v.company ? ' · ' + v.company : '') + '</div>' +
    (v.first && t.intro.hello ? '<p class="adz-hello">' + fill(esc(t.intro.hello), v) + '</p>' : '') +
    '<h1 class="adz-h1">' + fill(esc(t.intro.title), v) + '</h1>' +
    '<p class="adz-lead">' + fill(esc(t.intro.body), v) + '</p>' +
    '<ul class="adz-list">' + t.intro.bullets.map(function (b) { return '<li>' + fill(esc(b), v) + '</li>'; }).join('') + '</ul>' +
    (t.intro.note ? '<p class="adz-note">' + fill(esc(t.intro.note), v) + '</p>' : '') +
    '<div class="adz-actions"><button type="button" class="adz-btn" data-act="start">' + esc(t.ui.start) + ' →</button>' +
    '<span class="adz-hint">' + esc(t.ui.pressEnter) + '</span></div>' +
    '<p class="adz-meta">' + fill(esc(t.intro.meta), v) + (i.closeDate ? ' · ' + fill(esc(t.intro.deadline), v) : '') + '</p>');
  this.root.querySelector('[data-act="start"]').addEventListener('click', function () { self.start(); });
};
SP.start = function () { this.state = this.fresh(); this.dir = 1; this.reviewing = false; this.save(); this.renderStep(); };
SP.renderResume = function () {
  var t = this.t(), self = this;
  this.view = 'resume';
  this.frame(
    '<div class="adz-eyebrow">' + esc(t.intro.eyebrow) + '</div>' +
    '<h1 class="adz-h1 adz-h1--sm">' + esc(t.ui.resume) + '</h1>' +
    '<div class="adz-actions"><button type="button" class="adz-btn" data-act="yes">' + esc(t.ui.resumeYes) + ' →</button>' +
    '<button type="button" class="adz-btn adz-btn--ghost" data-act="no">' + esc(t.ui.resumeNo) + '</button></div>');
  this.root.querySelector('[data-act="yes"]').addEventListener('click', function () {
    self.state = self.saved; var d = self.fresh();
    if (self.spec.importance && !self.state.importance) self.state.importance = d.importance;
    if (self.spec.comments && !self.state.comments) self.state.comments = [];
    if (self.state.step >= self.N) self.renderReview(); else self.renderStep();
  });
  this.root.querySelector('[data-act="no"]').addEventListener('click', function () { store(self.skey, null); self.renderIntro(); });
};

/* ---------- one statement per screen ---------- */
SP.renderStep = function () {
  if (this.state.step >= this.N) return this.renderReview();
  var t = this.t(), self = this, sp = this.spec, q = this.state.step, s = sp.section(q);
  var cur = this.state.answers[q], opts = sp.options(t, q), cannot = sp.cannot(t, q);
  this.view = 'step';
  var imp = '';
  if (sp.importance) {
    var lv = this.state.importance[q], used = this.mostCount(), full = used >= sp.importance.max && lv !== 3;
    imp = '<div class="adz-imp"><div class="adz-imp-h"><b>' + esc(t.ui.importance) + '</b><span class="adz-imp-c' + (used >= sp.importance.max ? ' is-full' : '') + '">' +
      fill(esc(t.ui.mostCount), { n: used, max: sp.importance.max }) + '</span></div>' +
      '<div class="adz-seg" role="radiogroup">' + [1, 2, 3].map(function (k) {
        return '<button type="button" role="radio" data-imp="' + k + '" aria-checked="' + (lv === k) + '"' + (k === 3 && full ? ' disabled title="' + esc(t.ui.mostFull) + '"' : '') + '><i></i>' + esc(t.ui.imp[k - 1]) + '</button>';
      }).join('') + '</div><p class="adz-imp-note"' + (full ? '' : ' hidden') + '>' + esc(t.ui.mostFull) + '</p></div>';
  }
  var com = '';
  if (sp.comments) {
    var cv = this.state.comments[q] || '';
    com = '<div class="adz-com">' + (cv || this.openComment === q ? '' : '<button type="button" class="adz-com-btn" data-act="comment">+ ' + esc(t.ui.comment) + '</button>') +
      '<textarea class="adz-com-ta" maxlength="1000" placeholder="' + esc(t.ui.commentPh) + '"' + (cv || this.openComment === q ? '' : ' hidden') + '>' + esc(cv) + '</textarea></div>';
  }
  var canNext = !!cur;
  var navRight = this.reviewing
    ? '<button type="button" class="adz-btn" data-act="toreview"' + (canNext ? '' : ' disabled') + '>' + esc(t.review.back) + ' →</button>'
    : '<button type="button" class="adz-btn' + (sp.autoAdvance && !sp.importance ? ' adz-btn--ghost' : '') + '" data-act="next"' + (canNext ? '' : ' disabled') +
      (sp.autoAdvance && !sp.importance && !canNext ? ' hidden' : '') + '>' + esc(t.ui.next) + ' →</button>';
  var html =
    '<div class="adz-qhead"><div class="adz-eyebrow">' + esc(t.ui.section) + ' ' + (s.index + 1) + '/' + s.total + ' · ' + esc(t.cells[s.key]) + '</div>' +
    '<span class="adz-count">' + (q + 1) + ' ' + esc(t.ui.of) + ' ' + this.N + '</span></div>' +
    '<h2 class="adz-q">' + esc(sp.text(t, q)) + '</h2>' +
    '<div class="adz-scale" role="radiogroup">' + opts.map(function (o, i) {
      return '<button type="button" role="radio" class="adz-opt" data-v="' + o.value + '" aria-checked="' + (cur === o.value) + '">' +
        '<span class="adz-key">' + (i + 1) + '</span><span class="adz-opt-t"><b>' + esc(o.label) + '</b>' + (o.sub ? '<small>' + esc(o.sub) + '</small>' : '') + '</span></button>';
    }).join('') + '</div>' +
    (cannot ? '<button type="button" class="adz-cannot" data-v="1" aria-pressed="' + (cur === 1) + '">' + esc(cannot) + '</button>' : '') +
    imp + com +
    '<div class="adz-nav">' +
      '<button type="button" class="adz-back" data-act="back"' + (q === 0 || this.reviewing ? ' hidden' : '') + '>← ' + esc(t.ui.back) + '</button>' +
      '<div class="adz-actions adz-actions--tight"><span class="adz-hint adz-hint--keys">' + fill(esc(t.ui.keyboardHint), { n: opts.length }) + '</span>' + navRight + '</div>' +
    '</div>';
  this.frame(html, { progress: true });
  this.root.querySelectorAll('[data-v]').forEach(function (b) { b.addEventListener('click', function () { self.choose(Number(b.getAttribute('data-v')), b); }); });
  this.root.querySelectorAll('[data-imp]').forEach(function (b) { b.addEventListener('click', function () { self.setImportance(Number(b.getAttribute('data-imp'))); }); });
  var cb = this.root.querySelector('[data-act="comment"]');
  if (cb) cb.addEventListener('click', function () { self.openComment = q; cb.remove(); var ta = self.root.querySelector('.adz-com-ta'); ta.hidden = false; ta.focus(); });
  var ta = this.root.querySelector('.adz-com-ta');
  if (ta) ta.addEventListener('input', function () { self.state.comments[q] = ta.value.slice(0, 1000); self.save(); });
  function on(act, fn) { var b = self.root.querySelector('[data-act="' + act + '"]'); if (b) b.addEventListener('click', fn); }
  on('back', function () { self.back(); });
  on('next', function () { self.next(); });
  on('toreview', function () { self.toReview(); });
};
SP.choose = function (v, btn) {
  if (this.busy) return;
  var q = this.state.step;
  this.state.answers[q] = v;
  this.root.querySelectorAll('.adz-opt').forEach(function (b) { b.setAttribute('aria-checked', String(Number(b.getAttribute('data-v')) === v)); });
  var c = this.root.querySelector('.adz-cannot'); if (c) c.setAttribute('aria-pressed', String(v === 1));
  if (btn) { btn.classList.remove('is-pop'); void btn.offsetWidth; btn.classList.add('is-pop'); }
  this.save();
  var self = this;
  if (this.spec.autoAdvance && !this.spec.importance) {
    this.busy = true;
    setTimeout(function () { self.busy = false; if (self.reviewing) self.toReview(); else self.next(); }, 280);
  } else {
    // keep the screen (importance / comment may follow) and just enable Next
    var nr = this.root.querySelector('[data-act="next"],[data-act="toreview"]');
    if (nr) { nr.disabled = false; nr.hidden = false; }
  }
};
SP.setImportance = function (k) {
  var q = this.state.step, max = this.spec.importance.max;
  if (k === 3 && this.state.importance[q] !== 3 && this.mostCount() >= max) return;
  this.state.importance[q] = k; this.save(); this.paintImportance();
};
// Updates the importance control in place (no re-render, no flash).
SP.paintImportance = function () {
  var t = this.t(), q = this.state.step, max = this.spec.importance.max, lv = this.state.importance[q];
  var used = this.mostCount(), full = used >= max && lv !== 3, box = this.root.querySelector('.adz-imp');
  if (!box) return;
  box.querySelectorAll('[data-imp]').forEach(function (b) {
    var k = Number(b.getAttribute('data-imp'));
    b.setAttribute('aria-checked', String(lv === k));
    b.disabled = k === 3 && full;
    if (k === 3 && full) b.title = t.ui.mostFull; else b.removeAttribute('title');
  });
  var c = box.querySelector('.adz-imp-c');
  c.textContent = fill(t.ui.mostCount, { n: used, max: max });
  c.classList.toggle('is-full', used >= max);
  var note = box.querySelector('.adz-imp-note');
  note.textContent = t.ui.mostFull; note.hidden = !full;
};
SP.next = function () {
  if (this.state.step < this.N && !this.state.answers[this.state.step]) return;
  this.openComment = null;
  this.state.step = Math.min(this.state.step + 1, this.N); this.dir = 1; this.save(); this.renderStep();
};
SP.back = function () {
  if (this.state.step === 0) return;
  this.openComment = null;
  this.state.step--; this.dir = -1; this.save(); this.renderStep();
};
SP.goTo = function (q) { this.reviewing = true; this.openComment = null; this.state.step = q; this.dir = 1; this.save(); this.renderStep(); };
SP.toReview = function () { this.state.step = this.N; this.dir = -1; this.save(); this.renderReview(); };
SP.key = function (e) {
  if (!this.root.isConnected) { document.removeEventListener('keydown', this.onKey); return; }
  var tag = (e.target && e.target.tagName) || '';
  if (tag === 'INPUT' || tag === 'TEXTAREA' || e.metaKey || e.ctrlKey || e.altKey) return;
  if (this.view === 'intro' && e.key === 'Enter') {
    var r = this.el.getBoundingClientRect();
    if (r.top < window.innerHeight && r.bottom > 0) { e.preventDefault(); this.start(); }
    return;
  }
  if (this.view !== 'step') return;
  var opts = this.spec.options(this.t(), this.state.step);
  var k = Number(e.key);
  if (/^[1-9]$/.test(e.key) && opts[k - 1]) { e.preventDefault(); this.choose(opts[k - 1].value, this.root.querySelector('.adz-opt[data-v="' + opts[k - 1].value + '"]')); return; }
  if (e.key === '0' && this.spec.cannot(this.t(), this.state.step)) { e.preventDefault(); this.choose(1, this.root.querySelector('.adz-cannot')); return; }
  if (e.key === 'Enter') { e.preventDefault(); if (this.reviewing) { if (this.state.answers[this.state.step]) this.toReview(); } else this.next(); }
};

/* ---------- review: every answer, click to change ---------- */
SP.answerLabel = function (t, q, v) {
  if (v === 1 && this.spec.cannot(t, q)) return this.spec.cannot(t, q);
  var o = this.spec.options(t, q).filter(function (x) { return x.value === v; })[0];
  return o ? o.label : '';
};
SP.renderReview = function () {
  var t = this.t(), R = t.review, self = this, sp = this.spec, N = this.N;
  this.view = 'review'; this.reviewing = true;
  var missing = [], cannot = 0;
  for (var q = 0; q < N; q++) { var a = this.state.answers[q]; if (!a) missing.push(q); else if (a === 1 && sp.cannot(t, q)) cannot++; }
  var most = this.mostCount(), needMost = sp.importance && most < sp.importance.min;
  var groups = {}, order = [];
  for (var i = 0; i < N; i++) { var s = sp.section(i); if (!groups[s.index]) { groups[s.index] = { s: s, qs: [] }; order.push(s.index); } groups[s.index].qs.push(i); }
  var list = order.map(function (k) {
    var g = groups[k];
    return '<div class="adz-rv-sec"><div class="adz-rv-h">' + (g.s.index + 1) + '. ' + esc(t.cells[g.s.key]) + '</div>' + g.qs.map(function (q) {
      var a = self.state.answers[q], lbl = a ? self.answerLabel(t, q, a) : R.missing;
      var tags = '';
      if (sp.importance && self.state.importance[q] === 3) tags += '<span class="adz-tag is-most">★ ' + esc(t.ui.imp[2]) + '</span>';
      if (sp.comments && (self.state.comments[q] || '').trim()) tags += '<span class="adz-tag">' + esc(R.commented) + '</span>';
      return '<button type="button" class="adz-rv-row' + (a ? '' : ' is-missing') + '" data-q="' + q + '"><span class="adz-rv-n">' + (q + 1) + '</span>' +
        '<span class="adz-rv-t">' + esc(sp.text(t, q)) + (tags ? '<span class="adz-rv-tags">' + tags + '</span>' : '') + '</span>' +
        '<span class="adz-rv-a' + (a === 1 && sp.cannot(t, q) ? ' is-cannot' : '') + '">' + esc(lbl) + '</span></button>';
    }).join('') + '</div>';
  }).join('');
  var ok = !missing.length && !needMost;
  var summary = (missing.length ? fill(esc(R.missingN), { n: missing.length }) : fill(esc(R.body), { n: N })) +
    (cannot ? ' ' + fill(esc(R.cannot), { n: cannot }) : '') +
    (sp.importance ? ' ' + fill(esc(R.most), { n: most, max: sp.importance.max }) : '');
  var actions = function (pos) {
    return '<div class="adz-actions adz-rv-actions"><button type="button" class="adz-btn" data-act="submit"' + (ok ? '' : ' disabled') + '>' + esc(R.submit) + ' →</button>' +
      (pos === 'top' ? '<span class="adz-hint">' + esc(R.hint) + '</span>' : '') + '</div>';
  };
  this.frame(
    '<div class="adz-eyebrow">' + esc(R.eyebrow) + '</div>' +
    '<h1 class="adz-h1 adz-h1--sm">' + esc(R.title) + '</h1>' +
    '<p class="adz-lead">' + summary + '</p>' +
    (needMost ? '<p class="adz-warn">' + fill(esc(R.needMost), { min: sp.importance.min }) + '</p>' : '') +
    (missing.length ? '<p class="adz-warn">' + esc(R.missingHelp) + '</p>' : '') +
    '<p class="adz-note">' + esc(R.warn) + '</p>' + actions('top') +
    '<div class="adz-rv">' + list + '</div>' + actions('bottom'), { progress: true, wide: true, top: true });
  this.root.querySelectorAll('[data-q]').forEach(function (b) { b.addEventListener('click', function () { self.goTo(Number(b.getAttribute('data-q'))); }); });
  this.root.querySelectorAll('[data-act="submit"]').forEach(function (b) { b.addEventListener('click', function () { self.submit(); }); });
};

/* ---------- submit + thanks ---------- */
SP.submit = function () {
  var t = this.t(), self = this;
  this.view = 'sending';
  this.frame('<div class="adz-loading"><div class="adz-spinner"></div><p class="adz-lead">' + esc(t.ui.sending) + '</p></div>');
  var started = Date.now();
  var payload = { action: 'p_submit', v: this.cfg.version, t: this.token, lang: this.lang, answers: this.state.answers.slice(0, this.N) };
  if (this.spec.payload) { var extra = this.spec.payload(this.state); for (var k in extra) payload[k] = extra[k]; }
  api(this.cfg.endpoint, payload, 30000).then(function () {
    setTimeout(function () { store(self.skey, null); self.renderThanks(); }, Math.max(0, 900 - (Date.now() - started)));
  }).catch(function (e) {
    if (e && (e.code === 'already_completed' || e.code === 'closed' || e.code === 'invalid_link')) { store(self.skey, null); return self.renderState(e.code === 'already_completed' ? 'completed' : e.code); }
    self.frame('<div class="adz-loading"><p class="adz-lead">' + esc(t.ui.errorGeneric) + '</p>' +
      '<button type="button" class="adz-btn" data-act="retry">' + esc(t.ui.retry) + '</button></div>');
    self.root.querySelector('[data-act="retry"]').addEventListener('click', function () { self.submit(); });
  });
};
SP.renderThanks = function () {
  var t = this.t(), v = this.vars();
  this.view = 'thanks';
  this.frame('<div class="adz-msg adz-msg--done"><div class="adz-check" aria-hidden="true"></div>' +
    '<h1 class="adz-h1 adz-h1--sm">' + fill(esc(t.thanks.title), v).replace(/,\s*$/, '') + '</h1>' +
    '<p class="adz-lead">' + fill(esc(t.thanks.body), v) + '</p></div>');
};

function bootSurvey(configVar, defaults, spec, globalName) {
  function go() {
    var cfg = {}, user = window[configVar] || {};
    for (var k in defaults) cfg[k] = defaults[k];
    for (var k2 in user) cfg[k2] = user[k2];
    if (!cfg.assetsBase) cfg.assetsBase = detectAssets();
    var el = typeof cfg.mount === 'string' ? document.querySelector(cfg.mount) : cfg.mount;
    if (!el) { if (window.console) console.error('[' + globalName + '] mount element not found: ' + cfg.mount); return; }
    if (!el.id) el.id = String(cfg.mount).replace(/^#/, '') || 'adz-survey';
    injectStyle('adz-style-' + el.id, cfg.css, '#' + el.id);
    if (cfg.loadFont) loadFontCss();
    window[globalName] = { app: new Survey(el, cfg, spec), version: cfg.version };
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', go); else go();
}

/* Engagement Survey — participant widget (personal invitation link ?t=TOKEN). Anonymous: the participant
 * only sees a thank-you; the group report is generated in the admin.
 * Embed (Webflow page /engagement-survey):
 *   <div id="es-survey"></div>
 *   <script>window.ES_CONFIG = { endpoint: 'https://script.google.com/macros/s/XXX/exec' };</script>
 *   <script src="https://cdn.jsdelivr.net/gh/Adizes/alis-sample@vX/engagement-survey/dist/engagement-survey.min.js" defer></script>
 * Bundled by build.mjs with: i18n files, shared/core.js, shared/ed-engine.js, shared/es-engine.js, shared/survey.js.
 */
var ES_CAT_INDEX = {};
ES.CATS.forEach(function (c, i) { ES_CAT_INDEX[c.id] = c; });
// Sections follow the order of the questions (Values, Climate, … Supervisor, Planning, …).
var ES_SECTIONS = [];
ES.QUESTION_CATS.forEach(function (c) { if (ES_SECTIONS[ES_SECTIONS.length - 1] !== c) ES_SECTIONS.push(c); });
function esSection(q) {
  // Q48 and Q50 are both "Changes" but separated by Q49 → each run is its own segment.
  var run = -1, last = null;
  for (var i = 0; i <= q; i++) { if (ES.QUESTION_CATS[i] !== last) { run++; last = ES.QUESTION_CATS[i]; } }
  return { index: run, total: ES_SECTIONS.length, key: ES_CAT_INDEX[ES.QUESTION_CATS[q]].key };
}

bootSurvey('ES_CONFIG', {
  mount: '#es-survey',
  endpoint: '',
  lang: 'auto',
  assetsBase: '',
  loadFont: true,
  css: "__ROOT__ {\n--ink: #111111;\n--ink-2: #3a3a3a;\n--muted: #6b6f76;\n--soft: #9aa0a6;\n--line: #e6e6e6;\n--paper: #f6f6f6;\n--white: #ffffff;\n--red: #d7141a;\n--red-dark: #b10f14;\n--red-tint: #fdecec;\n--green: #1e8e4e; --green-t: #dcf2e5;\n--yellow: #d9a400; --yellow-ink: #8a6500; --yellow-t: #fff0bf;\n--red-t: #fbd6d7;\ndisplay: block; width: 100%;\nfont-family: 'Montserrat', system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif;\ncolor: var(--ink); line-height: 1.5; text-align: left;\n-webkit-font-smoothing: antialiased;\n}\n__ROOT__ *, __ROOT__ *::before, __ROOT__ *::after {\nbox-sizing: border-box; margin: 0; padding: 0; border: 0;\nfont: inherit; color: inherit; letter-spacing: normal; text-transform: none;\nbackground: none; box-shadow: none; text-decoration: none; list-style: none;\n}\n__ROOT__ strong, __ROOT__ b { font-weight: 700; }\n__ROOT__ em { font-style: normal; color: var(--soft); }\n__ROOT__ button { cursor: pointer; -webkit-appearance: none; appearance: none; line-height: 1.3; }\n__ROOT__ button:focus-visible, __ROOT__ a:focus-visible, __ROOT__ input:focus-visible, __ROOT__ textarea:focus-visible, __ROOT__ select:focus-visible {\noutline: 3px solid rgba(215, 20, 26, .35); outline-offset: 2px;\n}\n__ROOT__ a { color: inherit; }\n__ROOT__ [hidden] { display: none !important; }\n__ROOT__ .adz-stage {\nbackground: var(--white); border: 1px solid var(--line); border-radius: 10px;\nmin-height: min(680px, 100svh); display: flex; flex-direction: column; overflow: hidden;\n}\n__ROOT__ .adz-top { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 16px 32px 10px; }\n__ROOT__ .adz-logo { display: block; height: 32px; width: auto; max-width: none; }\n__ROOT__ .adz-logo-txt { font-weight: 800; letter-spacing: .06em; color: var(--red); }\n__ROOT__ .adz-lang { display: inline-flex; border: 1px solid var(--line); border-radius: 6px; overflow: hidden; }\n__ROOT__ .adz-lang button { padding: 6px 11px; font-size: 12px; font-weight: 600; color: var(--muted); }\n__ROOT__ .adz-lang button[aria-pressed=\"true\"] { background: var(--ink); color: var(--white); }\n__ROOT__ .adz-progress { display: flex; gap: 3px; padding: 4px 32px 0; }\n__ROOT__ .adz-progress span { height: 3px; background: var(--line); border-radius: 2px; overflow: hidden; }\n__ROOT__ .adz-progress i { display: block; height: 100%; background: var(--red); transition: width .35s ease; }\n__ROOT__ .adz-body { flex: 1; display: flex; align-items: center; padding: 22px 32px 26px; }\n__ROOT__ .adz-screen { width: 100%; max-width: 740px; margin: 0 auto; animation: adzIn .22s ease-out both; }\n__ROOT__ .adz-screen.is-back { animation-name: adzBack; }\n__ROOT__ .adz-screen.is-still { animation: none; }\n@keyframes adzIn { from { opacity: .4; transform: translateY(6px); } to { opacity: 1; transform: none; } }\n@keyframes adzBack { from { opacity: .4; transform: translateY(-6px); } to { opacity: 1; transform: none; } }\n__ROOT__ .adz-eyebrow { font-size: 12px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: var(--red); }\n__ROOT__ .adz-h1 { font-size: clamp(30px, 4.6vw, 46px); line-height: 1.12; font-weight: 700; margin: 12px 0 16px; letter-spacing: -.01em; }\n__ROOT__ .adz-h1--sm { font-size: clamp(26px, 3.6vw, 36px); }\n__ROOT__ .adz-lead { font-size: 17px; line-height: 1.6; color: var(--ink-2); max-width: 640px; }\n__ROOT__ .adz-list { margin: 22px 0; display: grid; gap: 10px; }\n__ROOT__ .adz-list li { position: relative; padding-left: 26px; font-size: 15.5px; color: var(--ink-2); }\n__ROOT__ .adz-list li::before { content: ''; position: absolute; left: 0; top: .62em; width: 12px; height: 2px; background: var(--red); }\n__ROOT__ .adz-note { font-size: 14px; color: var(--muted); max-width: 620px; border-left: 2px solid var(--line); padding-left: 14px; }\n__ROOT__ .adz-meta { margin-top: 18px; font-size: 13px; color: var(--soft); }\n__ROOT__ .adz-help { font-size: 14.5px; color: var(--muted); max-width: 680px; margin: 4px 0 18px; }\n__ROOT__ .adz-actions { display: flex; flex-wrap: wrap; align-items: center; gap: 14px; margin-top: 28px; }\n__ROOT__ .adz-actions--tight { margin-top: 0; }\n__ROOT__ .adz-btn {\ndisplay: inline-flex; align-items: center; justify-content: center; gap: 8px; min-height: 46px;\npadding: 12px 24px; border-radius: 6px; background: var(--red); color: var(--white);\nfont-size: 15px; font-weight: 600; transition: background .15s ease, transform .15s ease;\n}\n__ROOT__ .adz-btn:hover { background: var(--red-dark); }\n__ROOT__ .adz-btn:active { transform: translateY(1px); }\n__ROOT__ .adz-btn:disabled { opacity: .55; cursor: default; }\n__ROOT__ .adz-btn--ghost { background: transparent; color: var(--ink); border: 1px solid var(--ink); }\n__ROOT__ .adz-btn--ghost:hover { background: var(--ink); color: var(--white); }\n__ROOT__ .adz-btn--dark { background: var(--ink); }\n__ROOT__ .adz-btn--dark:hover { background: #000; }\n__ROOT__ .adz-hint { font-size: 12.5px; color: var(--soft); }\n__ROOT__ .adz-back { font-size: 14px; font-weight: 600; color: var(--muted); padding: 10px 2px; }\n__ROOT__ .adz-back:hover { color: var(--ink); }\n__ROOT__ .adz-nav { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-top: 20px; }\n__ROOT__ .adz-form { margin-top: 24px; display: grid; gap: 14px; max-width: 520px; }\n__ROOT__ .adz-field label { display: block; font-size: 13px; font-weight: 600; margin-bottom: 6px; color: var(--ink); }\n__ROOT__ .adz-field input[type=\"text\"], __ROOT__ .adz-field input[type=\"email\"], __ROOT__ .adz-field input:not([type]), __ROOT__ .adz-field select, __ROOT__ .adz-field textarea {\ndisplay: block; width: 100%; height: 48px; padding: 0 14px; border: 1px solid #cfcfcf; border-radius: 6px;\nbackground: var(--white); font-size: 16px; color: var(--ink); margin: 0;\n}\n__ROOT__ .adz-field textarea { height: auto; min-height: 96px; padding: 12px 14px; line-height: 1.5; resize: vertical; }\n__ROOT__ .adz-field input:focus, __ROOT__ .adz-field textarea:focus { border-color: var(--ink); outline: none; }\n__ROOT__ .adz-field input::placeholder, __ROOT__ .adz-field textarea::placeholder { color: #a5a5a5; }\n__ROOT__ .adz-err { display: none; font-size: 12.5px; color: var(--red); margin-top: 5px; }\n__ROOT__ .adz-field.has-error input { border-color: var(--red); }\n__ROOT__ .adz-field.has-error .adz-err { display: block; }\n__ROOT__ .adz-consent { display: flex !important; gap: 10px; align-items: flex-start; font-weight: 400 !important; font-size: 13.5px !important; color: var(--ink-2) !important; cursor: pointer; }\n__ROOT__ .adz-consent input { width: 18px; height: 18px; margin: 2px 0 0 !important; flex: none; accent-color: var(--red); -webkit-appearance: auto; appearance: auto; }\n__ROOT__ .adz-consent a { text-decoration: underline; }\n__ROOT__ .adz-loading { display: grid; justify-items: center; gap: 18px; text-align: center; padding: 40px 0; }\n__ROOT__ .adz-spinner { width: 40px; height: 40px; border-radius: 50%; border: 3px solid var(--line); border-top-color: var(--red); animation: adzSpin .8s linear infinite; }\n@keyframes adzSpin { to { transform: rotate(360deg); } }\n__ROOT__ .adz-card { background: var(--white); border: 1px solid var(--line); border-radius: 10px; padding: 28px; }\n__ROOT__ .adz-card h2 { font-size: 21px; font-weight: 700; line-height: 1.25; margin: 6px 0 10px; }\n__ROOT__ .adz-card p { font-size: 15px; color: var(--ink-2); margin-bottom: 20px; }\n__ROOT__ .adz-card--dark { background: var(--ink); border-color: var(--ink); color: var(--white); }\n__ROOT__ .adz-card--dark p { color: #cfcfcf; }\n@media (max-width: 640px) {\n__ROOT__ .adz-stage { border-radius: 0; border-left: 0; border-right: 0; }\n__ROOT__ .adz-top { padding: 16px 18px 12px; }\n__ROOT__ .adz-logo { height: 30px; }\n__ROOT__ .adz-progress { padding: 0 18px; gap: 2px; }\n__ROOT__ .adz-body { padding: 24px 18px 32px; align-items: flex-start; }\n__ROOT__ .adz-lead { font-size: 16px; }\n__ROOT__ .adz-card { padding: 22px; }\n}\n@media (prefers-reduced-motion: reduce) {\n__ROOT__ *, __ROOT__ *::before, __ROOT__ *::after { animation: none !important; transition: none !important; }\n}\n__ROOT__ .adz-qhead { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; }\n__ROOT__ .adz-count { font-size: 13px; font-weight: 600; color: var(--soft); white-space: nowrap; font-variant-numeric: tabular-nums; }\n__ROOT__ .adz-q { font-size: clamp(20px, 2.2vw, 25px); line-height: 1.32; font-weight: 600; margin: 10px 0 18px; min-height: 2.64em; }\n__ROOT__ .adz-scale { display: grid; gap: 8px; }\n__ROOT__ .adz-opt {\ndisplay: flex; align-items: center; gap: 14px; width: 100%; padding: 9px 14px; text-align: left;\nborder: 1px solid #d6d6d6; border-radius: 8px; background: var(--white); transition: border-color .15s, background .15s;\n}\n__ROOT__ .adz-opt:hover { border-color: var(--ink); }\n__ROOT__ .adz-opt[aria-checked=\"true\"] { border-color: var(--red); background: var(--red-tint); box-shadow: inset 0 0 0 1px var(--red); }\n__ROOT__ .adz-key {\nflex: none; width: 26px; height: 26px; border-radius: 6px; border: 1px solid #d6d6d6; display: grid; place-items: center;\nfont-size: 12px; font-weight: 700; color: var(--muted);\n}\n__ROOT__ .adz-opt[aria-checked=\"true\"] .adz-key { background: var(--red); border-color: var(--red); color: var(--white); }\n__ROOT__ .adz-opt-t { display: flex; flex-wrap: wrap; align-items: baseline; gap: 4px 12px; }\n__ROOT__ .adz-opt-t b { font-size: 15.5px; font-weight: 600; }\n__ROOT__ .adz-opt-t small { font-size: 13px; color: var(--muted); }\n__ROOT__ .adz-opt.is-pop { animation: adzPop .28s ease; }\n@keyframes adzPop { 50% { transform: scale(.985); } }\n__ROOT__ .adz-cannot {\nmargin-top: 10px; font-size: 14px; font-weight: 600; color: var(--muted); padding: 4px 2px;\nborder-bottom: 1px dashed #c4c4c4;\n}\n__ROOT__ .adz-cannot:hover { color: var(--ink); border-bottom-color: var(--ink); }\n__ROOT__ .adz-cannot[aria-pressed=\"true\"] { color: var(--red); border-bottom-color: var(--red); }\n__ROOT__ .adz-cannot[aria-pressed=\"true\"]::before { content: '● '; }\n__ROOT__ .adz-imp { margin-top: 16px; padding-top: 14px; border-top: 1px solid var(--line); }\n__ROOT__ .adz-imp-h { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: baseline; gap: 6px 14px; margin-bottom: 8px; }\n__ROOT__ .adz-imp-h b { font-size: 14.5px; font-weight: 600; }\n__ROOT__ .adz-imp-c { font-size: 13px; color: var(--muted); font-variant-numeric: tabular-nums; }\n__ROOT__ .adz-imp-c.is-full { color: var(--red); font-weight: 600; }\n__ROOT__ .adz-seg { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); border: 1px solid #d6d6d6; border-radius: 8px; overflow: hidden; }\n__ROOT__ .adz-seg button {\ndisplay: flex; align-items: center; justify-content: center; gap: 8px; padding: 9px 8px; font-size: 14px; font-weight: 600;\ncolor: var(--muted); border-left: 1px solid #d6d6d6; background: var(--white); transition: background .15s, color .15s;\n}\n__ROOT__ .adz-seg button i { flex: none; width: 9px; height: 9px; border-radius: 50%; background: var(--imp); }\n__ROOT__ .adz-seg button[data-imp=\"1\"] { --imp: #9a9a9a; --imp-ink: #fff; }\n__ROOT__ .adz-seg button[data-imp=\"2\"] { --imp: #f2b705; --imp-ink: #1a1a1a; }\n__ROOT__ .adz-seg button[data-imp=\"3\"] { --imp: #2e9b57; --imp-ink: #fff; }\n__ROOT__ .adz-seg button:first-child { border-left: 0; }\n__ROOT__ .adz-seg button:hover { color: var(--ink); }\n__ROOT__ .adz-seg button[aria-checked=\"true\"] { background: var(--imp); color: var(--imp-ink); }\n__ROOT__ .adz-seg button[aria-checked=\"true\"] i { background: var(--imp-ink); opacity: .85; }\n__ROOT__ .adz-seg button:disabled { opacity: .4; cursor: not-allowed; }\n__ROOT__ .adz-imp-note { font-size: 12.5px; color: var(--muted); margin-top: 6px; }\n__ROOT__ .adz-com { margin-top: 12px; }\n__ROOT__ .adz-com-btn { font-size: 14px; font-weight: 600; color: var(--muted); padding: 4px 0; }\n__ROOT__ .adz-com-btn:hover { color: var(--ink); }\n__ROOT__ .adz-com-ta { display: block; width: 100%; min-height: 72px; padding: 11px 13px; border: 1px solid #cfcfcf; border-radius: 8px; font-size: 15px; line-height: 1.5; resize: vertical; background: var(--white); }\n__ROOT__ .adz-com-ta:focus { outline: none; border-color: var(--ink); }\n__ROOT__ .adz-screen.is-wide { max-width: 860px; }\n__ROOT__ .adz-body.is-top { align-items: flex-start; }\n__ROOT__ .adz-warn { margin-top: 10px; font-size: 14.5px; color: var(--red); font-weight: 600; }\n__ROOT__ .adz-rv-actions { margin-top: 20px; }\n__ROOT__ .adz-rv { margin-top: 26px; border: 1px solid var(--line); border-radius: 10px; overflow: hidden; }\n__ROOT__ .adz-rv-h { font-size: 12px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: var(--red); padding: 14px 16px 8px; background: #fafafa; border-bottom: 1px solid var(--line); }\n__ROOT__ .adz-rv-sec + .adz-rv-sec .adz-rv-h { border-top: 1px solid var(--line); }\n__ROOT__ .adz-rv-row { display: grid; grid-template-columns: 32px minmax(0, 1fr) minmax(120px, auto); gap: 12px; align-items: center; width: 100%; padding: 11px 16px; text-align: left; border-bottom: 1px solid #f0f0f0; background: var(--white); }\n__ROOT__ .adz-rv-row:last-child { border-bottom: 0; }\n__ROOT__ .adz-rv-row:hover { background: #fafafa; }\n__ROOT__ .adz-rv-row:hover .adz-rv-a { text-decoration: underline; }\n__ROOT__ .adz-rv-n { font-size: 12px; font-weight: 700; color: var(--soft); font-variant-numeric: tabular-nums; }\n__ROOT__ .adz-rv-t { font-size: 14px; line-height: 1.45; color: var(--ink-2); }\n__ROOT__ .adz-rv-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 4px; }\n__ROOT__ .adz-tag { font-size: 11px; font-weight: 700; padding: 1px 7px; border-radius: 10px; background: var(--paper); color: var(--muted); }\n__ROOT__ .adz-tag.is-most { background: #e5f4ea; color: #23784a; }\n__ROOT__ .adz-rv-a { font-size: 13.5px; font-weight: 700; text-align: right; color: var(--ink); }\n__ROOT__ .adz-rv-a.is-cannot { color: var(--muted); font-weight: 600; }\n__ROOT__ .adz-rv-row.is-missing .adz-rv-a { color: var(--red); }\n__ROOT__ .adz-hello { font-size: 18px; font-weight: 600; margin-top: 14px; }\n__ROOT__ .adz-hello + .adz-h1 { margin-top: 4px; }\n__ROOT__ .adz-msg { max-width: 640px; }\n__ROOT__ .adz-msg--done { text-align: center; margin: 0 auto; }\n__ROOT__ .adz-msg--done .adz-lead { margin: 0 auto; }\n__ROOT__ .adz-check { width: 56px; height: 56px; border-radius: 50%; background: var(--red); margin: 0 auto 8px; position: relative; }\n__ROOT__ .adz-check::after { content: ''; position: absolute; left: 20px; top: 14px; width: 12px; height: 22px; border: solid #fff; border-width: 0 3px 3px 0; transform: rotate(45deg); }\n@media (max-width: 640px) {\n__ROOT__ .adz-hint--keys { display: none; }\n__ROOT__ .adz-q { min-height: 0; }\n__ROOT__ .adz-opt { padding: 9px 12px; }\n__ROOT__ .adz-rv-row { grid-template-columns: 26px minmax(0, 1fr); padding: 11px 12px; }\n__ROOT__ .adz-rv-a { grid-column: 2; text-align: left; }\n__ROOT__ .adz-seg button { font-size: 12.5px; padding: 10px 4px; line-height: 1.25; }\n__ROOT__ .adz-seg button i { display: none; }\n}",
  version: "1.3.0",
}, {
  I18N: ES_I18N, prefix: 'adz-es:', count: ES.COUNT, autoAdvance: false,
  section: esSection,
  options: function (t, q) { return t.scales[ES.SCALES[q]]; },
  cannot: function (t, q) { return ES.hasDontKnow(q) ? t.dontKnow : null; },
  text: function (t, q) { return t.questions[q]; },
  importance: { max: ES.MAX_MOST, min: ES.MIN_MOST },
  comments: true,
  payload: function (s) {
    return { importance: s.importance.slice(0, ES.COUNT), comments: (s.comments || []).slice(0, ES.COUNT).map(function (c) { return String(c || '').slice(0, 1000); }) };
  },
}, 'ESA');

})();
