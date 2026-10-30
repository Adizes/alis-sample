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
