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
