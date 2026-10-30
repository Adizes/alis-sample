/* Express Diagnostics — English
 * GENERATED from the translations workbook (tools/translations.py). Edit the workbook, not this file.
 * Answer values and the order of questions come from English and never change.
 */
ED_I18N.en = {
  code: "en",
  langName: "English",
  locale: "en-US",
  ui: {
    start: "Start",
    back: "Back",
    next: "Next",
    pressEnter: "press Enter ↵",
    keyboardHint: "Keys 1–4 · 0 = I cannot answer",
    of: "of",
    section: "Area",
    resume: "Welcome back. Your answers so far are saved.",
    resumeYes: "Continue where I left off",
    resumeNo: "Start over",
    loading: "Loading…",
    sending: "Sending your answers…",
    errorGeneric: "Something went wrong. Please check your connection and try again.",
    retry: "Try again"
  },
  intro: {
    eyebrow: "Express Diagnostics",
    hello: "Hi, {first}",
    title: "{company} wants your view of the organization",
    body: "{company} is running an organizational diagnostic with the Adizes Institute. You will rate 67 statements about how the company works today, across the 16 factors of the Adizes methodology.",
    bullets: [
      "It takes about 10 minutes. You can pause and come back later with the same link.",
      "Your answers are combined with those of the other participants in a group report.",
      "Answer for how things actually work today, not how they are supposed to work."
    ],
    note: "If you have no basis to judge a statement, choose “I cannot answer”.",
    deadline: "Open until {date}",
    meta: "67 statements · about 10 minutes"
  },
  scale: [
    {
      value: 2,
      label: "Never",
      sub: "Totally disagree"
    },
    {
      value: 3,
      label: "Sometimes",
      sub: "Partially disagree"
    },
    {
      value: 4,
      label: "Often",
      sub: "Partially agree"
    },
    {
      value: 5,
      label: "Always",
      sub: "Totally agree"
    }
  ],
  cannot: "I cannot answer",
  cells: {
    values: "Values",
    climate: "Climate",
    responsibility: "Responsibility Structure",
    authority: "Authority Structure",
    reward: "Reward Structure",
    planning: "Planning",
    information: "Information flow",
    corrective: "Corrective Actions",
    client: "Client interface",
    transformation: "Transformation",
    human: "Human factors",
    financial: "Financial factors",
    behaviour: "Behaviour",
    changes: "Changes",
    inefficiency: "Inefficiency",
    ineffectiveness: "Ineffectiveness"
  },
  diagram: {
    title: "Causal factors of systemic organizational problems",
    external: "External Factors",
    internal: "Internal Factors",
    causes: "Systemic Organizational Causes",
    culture: "Organizational Culture",
    subsystems: "Subsystems Symptoms",
    manifestations: "Systemic Manifestations",
    labels: {
      values: "Values",
      climate: "Climate",
      planning: "Strategic Planning",
      responsibility: "Organizational Structure",
      authority: "Authority",
      information: "Information Flow",
      corrective: "Corrective Actions",
      reward: "Rewards",
      client: "Client Interface",
      transformation: "Transformation",
      human: "Human Resources",
      financial: "Finance",
      inefficiency: "Inefficiency",
      behaviour: "Behavior",
      changes: "Change",
      ineffectiveness: "Ineffectiveness"
    }
  },
  radar: {
    title1: "Systemic organizational problems",
    title2: "Operational problems and systemic manifestations (consequences)",
    normal: "Normal situation",
    abnormal: "Abnormal situation",
    yours: "The company"
  },
  colors: {
    green: "The process is healthy",
    yellow: "There are some areas for improvement",
    red: "Key focus zone"
  },
  colorShort: {
    green: "Healthy",
    yellow: "Needs improvement",
    red: "Key focus zone"
  },
  frames: {
    title: "Type of frame",
    sub: "Depending on how much the participants’ opinions vary, a different frame is displayed",
    dotted: "Dotted frame — participants’ opinions largely coincide",
    thin: "Thin frame — noticeable divergence of opinion",
    thick: "Thick frame — the participants’ opinions do not coincide at all"
  },
  noAnswer: "no answer",
  review: {
    eyebrow: "Last step",
    title: "Review your answers",
    body: "You rated all {n} statements.",
    cannot: "{n} marked as “I cannot answer”.",
    missingN: "{n} statements still need an answer.",
    missingHelp: "Click any statement to answer or change it.",
    missing: "Not answered",
    warn: "Click any statement to change your answer. Once sent, your answers can’t be changed.",
    submit: "Send my answers",
    hint: "You can also send from the bottom of the list.",
    back: "Back to review"
  },
  thanks: {
    title: "Thank you, {first}",
    body: "Your answers have been recorded. {company} will receive the group report through the Adizes Institute. You can close this window."
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
      title: "This diagnostic is closed",
      body: "Answers are no longer being collected. If you think this is a mistake, contact the person who invited you."
    },
    not_open: {
      title: "This diagnostic isn’t open yet",
      body: "Please try again later from the same link."
    }
  },
  pdf: {
    file: "Express-Diagnostics",
    title: "Express Diagnostics",
    subtitle: "Report",
    company: "Company",
    date: "Date of the report",
    design: "Survey design: distance survey of top management",
    participants: "Participants",
    participantsCount: "Participants surveyed",
    howTitle: "How to read this report",
    howBody: "Each of the 16 factors is rated from the participants’ answers on a 4-point scale (“I cannot answer” is not counted as an answer and lowers the factor’s score). The causal map shows where problems originate, the radar charts compare the company with a normal and an abnormal situation, and the last section lists every statement with its rating.",
    summary: "At a glance",
    keyFactors: "Key organizational factors",
    keyFactorsHelp: "Each statement is shown in the wording that matches its rating.",
    colorsTitle: "Colour decoding",
    footer: "Adizes Institute · Express Diagnostics",
    page: "Page",
    cont: "cont."
  },
  questions: [
    {
      t: "Our value system is clearly articulated in a few words / phrases",
      z2: "Our value system is not clearly articulated",
      z3: "Our value system is not articulated"
    },
    {
      t: "Our value system is respected in our daily business practice, the declared values correspond to the demonstrated ones",
      z2: "Our value system is not always respected in everyday business practice, the declared values do not always correspond to the demonstrated ones",
      z3: "Our value system is often not adhered to in our daily business practice, the declared values often do not correspond to the demonstrated ones"
    },
    {
      t: "Our value system is the same across all divisions",
      z2: "Our value system is not the same in some departments",
      z3: "Our value system is not the same for many departments"
    },
    {
      t: "Our corporate culture is very similar in most departments",
      z2: "Our corporate culture is not similar enough in most departments",
      z3: "Our corporate culture is not the same in most departments"
    },
    {
      t: "Our corporate culture is characterized by a high level of collaboration between divisions",
      z2: "Our corporate culture is characterized by a lack of cooperation between departments",
      z3: "Our corporate culture is characterized by a low level of cooperation between divisions"
    },
    {
      t: "Our corporate culture is characterized by a high level of performance discipline",
      z2: "Our corporate culture is characterized by a lack of performance discipline",
      z3: "Our corporate culture is characterized by a low level of performance discipline"
    },
    {
      t: "Our corporate culture is characterized by the ability to fearlessly express our own opinions",
      z2: "Our corporate culture is not always characterized by the ability to fearlessly express our own opinions",
      z3: "Our corporate culture is not characterized by the ability to fearlessly express our own opinions"
    },
    {
      t: "Our corporate culture is characterized by high employee initiative",
      z2: "Our corporate culture is characterized by insufficiently high employee initiative",
      z3: "Our corporate culture is characterized by low employee initiative"
    },
    {
      t: "Our corporate culture is characterized by a low level of conflict",
      z2: "Our corporate culture is not always characterized by low levels of conflict",
      z3: "Our corporate culture is not characterized by a low level of conflict"
    },
    {
      t: "Our organizational structure supports the current business model well",
      z2: "Our organizational structure does not support the current business model well enough",
      z3: "Our organizational structure does not fully support the current business model"
    },
    {
      t: "Our organizational structure supports the long-term goals of the company well",
      z2: "Our organizational structure does not support the long-term goals of the company well enough",
      z3: "Our organizational structure has little support for the long-term goals of the company"
    },
    {
      t: "Our organizational structure contains all the necessary functions",
      z2: "Our organizational structure does not contain all the necessary functions",
      z3: "Our organizational structure lacks many essential functions"
    },
    {
      t: "There are no unclear/overlapping areas of responsibility in our organizational structure",
      z2: "There are sometimes unclear/overlapping areas of responsibility in our organizational structure",
      z3: "There are many unclear/overlapping areas of responsibility in our organizational structure"
    },
    {
      t: "Our organizational structure is highly “around functions” rather than “around people”",
      z2: "Our organizational structure is somewhat “around functions” rather than “around people”",
      z3: "Our organizational structure is highly “around people” rather than “around functions”"
    },
    {
      t: "Most of our leaders have enough authority to handle the challenges they face",
      z2: "Some of our leaders lack the authority to meet the challenges they face",
      z3: "Many of our leaders lack the authority to meet the challenges they face"
    },
    {
      t: "In our company, the biggest authority is held by commercial divisions",
      z2: "In our company, only part of the authority is held by commercial divisions",
      z3: "In our company, a small part of the authority is held by commercial divisions"
    },
    {
      t: "Our authority structure allows for quick decision making",
      z2: "Our authority structure does not always allow for quick decision making",
      z3: "Our authority structure does not allow for quick decision making"
    },
    {
      t: "Our structure of authority does not cause conflicts in the decision-making process",
      z2: "Our structure of authority sometimes causes conflicts in the decision-making process",
      z3: "Our structure of authority often causes conflicts in the decision-making process"
    },
    {
      t: "Our reward system contributes to the achievement of our goals",
      z2: "Our reward system does not fully contribute to the achievement of our goals",
      z3: "Our reward system rarely helps us achieve our goals"
    },
    {
      t: "Our employees are satisfied with the existing motivation system",
      z2: "Our employees are not always satisfied with the existing motivation system",
      z3: "Our employees are often not satisfied with the existing motivation system"
    },
    {
      t: "Our long term goals / strategy are clearly defined",
      z2: "Our long term goals / strategy are not well defined",
      z3: "Our long term goals / strategy are not defined"
    },
    {
      t: "Our long term goals / strategy are documented",
      z2: "Our long term goals / strategy are not fully documented",
      z3: "Our long term goals / strategy are not documented"
    },
    {
      t: "Our long-term goals / strategy are known to management",
      z2: "Not all of our long-term goals / strategy are known to management",
      z3: "Our long-term goals / strategy are not known to management"
    },
    {
      t: "Our long-term goals / strategy were developed with the participation of management",
      z2: "Our long-term goals / strategy were developed with insufficient management involvement",
      z3: "Our long-term goals / strategy were developed without management involvement"
    },
    {
      t: "Our long term goals / strategy are supported by management",
      z2: "Our long-term goals / strategy are not fully supported by management",
      z3: "Our long-term goals / strategy are not supported by management"
    },
    {
      t: "Our long term goals / strategy are backed up by a detailed action plan",
      z2: "Our long term goals / strategy are not fully backed by a detailed action plan",
      z3: "Our long term goals / strategy are not backed up by a specific action plan"
    },
    {
      t: "Our long-term goals / strategy are backed by the necessary resources",
      z2: "Our long-term goals / strategy are not fully resourced",
      z3: "Our long-term goals / strategy are not resourced"
    },
    {
      t: "We regularly evaluate the implementation of long-term goals / strategies",
      z2: "We do not regularly evaluate the implementation of long-term goals / strategies",
      z3: "We rarely evaluate the implementation of long-term goals / strategies"
    },
    {
      t: "Our long-term goals / strategy are regularly / if necessary revised",
      z2: "Our long-term goals / strategy are not reviewed regularly enough",
      z3: "Our long-term goals / strategy are rarely revised"
    },
    {
      t: "We base our annual plans on our long-term objectives / strategies",
      z2: "We do not always base our annual plans on our long-term objectives / strategies",
      z3: "We do not base our annual plans on our long-term objectives / strategies"
    },
    {
      t: "I have enough information to make key regular management decisions",
      z2: "I do not always have enough information to make key regular management decisions",
      z3: "I often do not have enough information to make key regular management decisions"
    },
    {
      t: "Information for taking management decisions usually contains reliable information",
      z2: "Information for taking management decisions does not always contain reliable information",
      z3: "Information for taking management decisions often does not contain reliable information"
    },
    {
      t: "Information for taking management decisions is usually collected in a timely manner",
      z2: "Information for taking management decisions is not always collected in a timely manner",
      z3: "Information for taking management decisions is usually not collected in a timely manner"
    },
    {
      t: "Information for taking management decisions does not contain redundant unnecessary information",
      z2: "Information for taking management decisions sometimes contains redundant unnecessary information",
      z3: "Information for taking management decisions often contains redundant unnecessary information"
    },
    {
      t: "The collection of information for taking management decisions is automated in our company",
      z2: "The collection of information for taking management decisions is not fully automated in our company",
      z3: "The collection of information for taking management decisions is not automated in our company"
    },
    {
      t: "We carry out control / analysis of our company's performance at least once a month",
      z2: "We do not always carry out control / analysis of our company's performance at least once a month",
      z3: "We rarely monitor / analyze our company's performance"
    },
    {
      t: "We carry out control / analysis of our company's performance in a team of key managers",
      z2: "We do not always monitor / analyze our company's performance in a team of key managers",
      z3: "We do not monitor / analyze the performance of the company in a team of key managers"
    },
    {
      t: "We control and analyse the performance of our company with discussion, fixation and subsequent control of the implementation of corrective measures",
      z2: "We do not always control and analyse the performance of our company with discussion, fixation and subsequent control of the implementation of corrective measures",
      z3: "We do not control and analyse the performance of our company with discussion, fixation and subsequent control of the implementation of corrective measures"
    },
    {
      t: "We control and analyse the performance of our company with the identification and fixation of systemic problems",
      z2: "We do not always control and analyse the performance of our company with the identification and fixation of systemic problems",
      z3: "We do not control and analyse the performance of our company with the identification and fixation of systemic problems"
    },
    {
      t: "We know our target customers and their needs well",
      z2: "We do not always know the target customers and their needs well",
      z3: "We do not know the target customers and their needs well"
    },
    {
      t: "Our selling proposition and our promotion and sales models are highly responsive to the needs of our customers",
      z2: "Our selling proposition and our promotion and sales models do not fully meet the needs of our customers",
      z3: "Our selling proposition and our promotion and sales models meet the needs of our customers only to a small extent"
    },
    {
      t: "Our selling proposition and promotion and sales models are competitive",
      z2: "Our selling proposition and promotion and sales models are not always competitive",
      z3: "Our selling proposition and promotion and sales models are not fully competitive"
    },
    {
      t: "Our annual / quarterly production / operating unit plans are based on the sales plan",
      z2: "Our annual / quarterly production / operating unit plans are partially based on the sales plan",
      z3: "Our annual / quarterly production / operating unit plans are not based on sales plans"
    },
    {
      t: "The activities of commercial and operational (production) functions are well coordinated with each other",
      z2: "The actions of commercial and operational (production) functions are not always well coordinated with each other",
      z3: "The actions of commercial and operational (production) functions are poorly coordinated with each other"
    },
    {
      t: "Most of our standard processes and procedures are documented",
      z2: "Not all of our standard processes and procedures are documented",
      z3: "Most of our standard processes and procedures are not documented"
    },
    {
      t: "We follow most of our standard processes and procedures",
      z2: "We follow some of our standard processes and procedures",
      z3: "We rarely follow our standard processes and procedures"
    },
    {
      t: "Most of our standard processes and procedures are subject to periodic adjustments",
      z2: "Only a subset of our standard processes and procedures are subject to periodic adjustments",
      z3: "A small part of our standard processes and procedures are subject to periodic adjustments"
    },
    {
      t: "Most of our standard processes and procedures are automated",
      z2: "Only part of our standard processes and procedures are automated",
      z3: "A small part of our standard processes and procedures are automated"
    },
    {
      t: "Our work on the development and release of new products is effective",
      z2: "Our activity in developing and launching new products is not effective enough",
      z3: "Our activity on the development and release of new products is ineffective"
    },
    {
      t: "We take a systematic approach to training and development",
      z2: "Our approach to training and development is not systematic enough",
      z3: "We do not approach training and development systematically"
    },
    {
      t: "We handle hiring challenges",
      z2: "We do not fully cope with the tasks of hiring",
      z3: "We are bad at hiring tasks"
    },
    {
      t: "We do not experience a shortage of qualified personnel",
      z2: "Sometimes we experience a shortage of qualified personnel",
      z3: "We are experiencing a shortage of qualified personnel"
    },
    {
      t: "We know the break-even point",
      z2: "We roughly know the break-even point",
      z3: "We don't know the break-even point"
    },
    {
      t: "We have implemented a budgeting process and follow it",
      z2: "Our budgeting process is not fully implemented",
      z3: "We do not have a budgeting process implemented"
    },
    {
      t: "We have implemented management accounting and it operates",
      z2: "We have partially implemented management accounting",
      z3: "We have not implemented management accounting"
    },
    {
      t: "Payment requests (to suppliers / contractors) in most cases are paid quickly / within a specified time frame",
      z2: "Payment requests (to suppliers / contractors) are not always paid quickly / within a specified time frame",
      z3: "Payment requests (to suppliers / contractors) are rarely paid quickly / within a stipulated time frame"
    },
    {
      t: "We have a low level of key personnel turnover",
      z2: "We have an average level of key personnel turnover",
      z3: "We have a high level of key personnel turnover"
    },
    {
      t: "Our employees recommend the company to their friends",
      z2: "Not all of our employees recommend the company to their friends",
      z3: "Our employees do not recommend the company to their friends"
    },
    {
      t: "Our product line is changing rapidly",
      z2: "Our product line is not changing fast enough",
      z3: "Our product line is slowly changing"
    },
    {
      t: "Changes in our company are not met with resistance",
      z2: "Changes in our company are sometimes met with resistance",
      z3: "Changes in our company are often resisted"
    },
    {
      t: "Our development budget has been growing for the past three years",
      z2: "Our development budget has slightly grown for the past three years",
      z3: "Our development budget has not been growing for the last three years"
    },
    {
      t: "The share of our income from new areas of activity (markets, products) has been growing over the past three years",
      z2: "The share of our income from new areas of activity (markets, products) has slightly grown over the past three years",
      z3: "The share of our income from new areas of activity (markets, products) has not been growing for the last three years"
    },
    {
      t: "Our profits have been growing for the last three years",
      z2: "Our profits have slightly grown over the past three years",
      z3: "Our profits have not grown for the last three years"
    },
    {
      t: "Our profitability has been growing for the past three years",
      z2: "Our profitability has slightly increased over the past three years",
      z3: "Our profitability has not increased for the past three years"
    },
    {
      t: "Our market share has been growing for the past three years",
      z2: "Our market share has grown little over the past three years",
      z3: "Our market share has not been growing for the last three years"
    },
    {
      t: "Our sales volume has been growing for the last three years",
      z2: "Our sales volume has grown little for the last three years",
      z3: "Our sales volume has not grown for the last three years"
    },
    {
      t: "Our clients recommend us",
      z2: "Our clients do not always recommend us",
      z3: "Our clients rarely recommend us"
    }
  ]
};
