/* =================================================================================
 *  PARTICIPANTS (public API used by the Webflow widgets)
 * ================================================================================= */
function inviteByToken_(t) {
  const token = clean_(t, 64);
  if (!/^[A-Za-z0-9]{16,64}$/.test(token)) return null;
  return findRecord_(INVITES, 'Token', token);
}

// { t } → what the widget needs to show (no answers, no other people's data)
function pLoad_(b) {
  const inv = inviteByToken_(b.t);
  if (!inv || inv.rec['Status'] === I_STATUS.REMOVED) return { ok: false, error: 'invalid_link' };
  const l = byId_(LAUNCHES, inv.rec['Launch ID']);
  if (!l) return { ok: false, error: 'invalid_link' };
  const L = l.rec, c = byId_(COMPANIES, L['Company ID']);
  let state = 'open';
  if (inv.rec['Status'] === I_STATUS.DONE) state = 'completed';
  else if (L['Status'] !== L_STATUS.OPEN) state = L['Status'] === L_STATUS.DRAFT ? 'not_open' : 'closed';
  const out = {
    ok: true, state: state, type: L['Type'], lang: L['Language'] || 'en',
    company: c ? c.rec['Name'] : '', closeDate: dateStr_(L['Close Date']),
  };
  if (L['Type'] === 'ED') {
    const e = byId_(EMPLOYEES, inv.rec['Employee ID']);
    out.firstName = e ? firstName_(e.rec['Full Name']) : '';
  }
  return out;
}

// { t, answers, lang } → saves once; the participant only gets a thank-you.
function pSubmit_(b) {
  return withLock_(() => {
    const inv = inviteByToken_(b.t);
    if (!inv || inv.rec['Status'] === I_STATUS.REMOVED) throw new Error('invalid_link');
    if (inv.rec['Status'] === I_STATUS.DONE) throw new Error('already_completed');
    const l = byId_(LAUNCHES, inv.rec['Launch ID']);
    if (!l) throw new Error('invalid_link');
    if (l.rec['Status'] !== L_STATUS.OPEN) throw new Error('closed');
    const type = l.rec['Type'];
    if (type === 'ED') saveEdAnswers_(inv.rec, l.rec, b);
    else if (type === 'ES') saveEsAnswers_(inv.rec, l.rec, b);
    else throw new Error('unknown_type');
    setCells_(inv.sh, inv.rowNum, inv.map, { 'Status': I_STATUS.DONE, 'Completed On': type === 'ES' ? today_() : new Date().toISOString() });
    checkReady_(l.rec['ID']);
    return { ok: true };
  });
}

function saveEdAnswers_(inv, launch, b) {
  const answers = (b.answers || []).map(Number);
  if (!ED.validAnswers(answers)) throw new Error('invalid_answers');
  const e = byId_(EMPLOYEES, inv['Employee ID']);
  const r = ED.score([answers]);
  const row = {
    'Response ID': newId_('R'), 'Launch ID': launch['ID'], 'Invitation ID': inv['ID'], 'Employee ID': inv['Employee ID'],
    'Full Name': e ? e.rec['Full Name'] : '', 'Submitted At': new Date(), 'Language': LABELS[b.lang] ? b.lang : launch['Language'],
  };
  r.cells.forEach((x, i) => { row[ED_CELL_COLS[i]] = Math.round(x.percent * 10) / 10; });
  answers.forEach((v, i) => { row[ED_Q_COLS[i]] = v; });
  appendRecord_(ED_ANSWERS, row);
}

function saveEsAnswers_(inv, launch, b) {
  const answers = (b.answers || []).map(Number), importance = (b.importance || []).map(Number);
  const bad = ES.validResponse(answers, importance);
  if (bad) throw new Error(bad);
  const e = byId_(EMPLOYEES, inv['Employee ID']);
  const comments = (b.comments || []).slice(0, ES.COUNT).map(c => clean_(String(c || '').replace(/\s*\n\s*/g, ' '), 1000));
  const row = {
    'Response ID': newId_('R'), 'Launch ID': launch['ID'], 'Submitted On': today_(),
    'Language': LABELS[b.lang] ? b.lang : launch['Language'], 'Area': e ? clean_(e.rec['Area'], 80) : '',
    'Result': ES.classify(answers, importance).level,
  };
  answers.forEach((v, i) => { row[ES_Q_COLS[i]] = v; });
  importance.forEach((v, i) => { row[ES_I_COLS[i]] = v; });
  comments.forEach((v, i) => { if (v) row[ES_C_COLS[i]] = v; });
  insertRandom_(ES_ANSWERS, row);
}
