/* =================================================================================
 *  EMAILS — invitations / reminders (participants), report (recipients), notices (admins)
 * ================================================================================= */
function fmtDate_(d, lang) {
  d = dateStr_(d);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(d)) return '';
  const p = d.split('-'), T = L_(lang);
  // dateFormat tokens: {d} day, {dd} 2-digit day, {mm} 2-digit month, {month} month name, {y} year
  return fill_(T.dateFormat || '{y}-{mm}-{dd}', { d: Number(p[2]), dd: p[2], mm: p[1], month: (T.months || [])[Number(p[1]) - 1] || p[1], y: p[0] });
}
function button_(label, url) {
  return '<a href="' + esc_(url) + '" style="display:inline-block;background:#d7141a;color:#ffffff;font:700 15px Arial,sans-serif;text-decoration:none;padding:13px 26px;border-radius:6px">' + esc_(label) + ' &rarr;</a>';
}

/**
 * Sends the invitation (or a reminder) to every participant that hasn't answered.
 * inviteIds: optional subset. Invitations are only sent while the launch is open.
 */
function sendInvites_(launchId, inviteIds, reminder) {
  const lf = byId_(LAUNCHES, launchId);
  if (!lf) throw new Error('not_found');
  const l = lf.rec;
  if (l['Status'] !== L_STATUS.OPEN) throw new Error('not_open');
  const lang = LABELS[l['Language']] ? l['Language'] : 'en', T = L_(lang), I = T.invite;
  const company = launchCompany_(l)['Name'] || '';
  const test = T.tests[l['Type']];
  const emp = {}; rows_(EMPLOYEES).forEach(r => emp[r['ID']] = r);
  const only = inviteIds && inviteIds.length ? inviteIds.reduce((o, id) => (o[id] = true, o), {}) : null;
  let n = 0;
  allRecords_(INVITES).rows.forEach(r => {
    if (r['Launch ID'] !== launchId || r['Status'] === I_STATUS.REMOVED || r['Status'] === I_STATUS.DONE) return;
    if (only && !only[r['ID']]) return;
    if (reminder && r['Status'] !== I_STATUS.SENT) return;   // reminders only to people already invited
    const e = emp[r['Employee ID']];
    if (!e || !validEmail_(e['Email'])) return;
    const map = { company: company, test: test, first: firstName_(e['Full Name']), date: fmtDate_(l['Close Date'], lang) };
    const link = inviteLink_(l['Type'], r['Token']);
    const inner =
      '<p style="margin:0 0 14px">' + esc_(fill_(I.hi, map)) + '</p>' +
      '<p style="margin:0 0 14px">' + esc_(fill_(reminder ? I.reminder : I.body, map)) + '</p>' +
      '<p style="margin:0 0 14px;color:#3a3a3a">' + esc_(fill_(I.privacy[l['Type']], map)) + '</p>' +
      (l['Close Date'] ? '<p style="margin:0 0 22px"><b>' + esc_(fill_(I.deadline, map)) + '</b></p>' : '') +
      '<p style="margin:0 0 22px">' + button_(I.cta, link) + '</p>' +
      '<p style="margin:0 0 18px;font-size:12px;color:#8a8a8a">' + esc_(I.personal) + '<br>' + esc_(link) + '</p>' +
      '<p style="margin:0">' + esc_(I.sign) + '</p>';
    const plain = [fill_(I.hi, map), fill_(reminder ? I.reminder : I.body, map), fill_(I.privacy[l['Type']], map),
      l['Close Date'] ? fill_(I.deadline, map) : '', I.cta + ': ' + link, I.personal, I.sign].filter(Boolean).join('\n\n');
    sendMail_(e['Email'], fill_(reminder ? I.reminderSubject : I.subject, map), plain, emailShell_(inner, fill_(I.footer, map)));
    const upd = reminder ? { 'Reminded At': new Date(), 'Reminders': (Number(r['Reminders']) || 0) + 1 } : { 'Status': I_STATUS.SENT, 'Sent At': new Date() };
    update_(INVITES, r['ID'], upd);
    n++;
  });
  return n;
}

function sendReportEmail_(l, to, note, pdf, n) {
  const lang = LABELS[l['Language']] ? l['Language'] : 'en', T = L_(lang), R = T.report;
  const map = { company: launchCompany_(l)['Name'] || '', test: T.tests[l['Type']], launch: l['Name'], n: n };
  const inner =
    '<p style="margin:0 0 14px">' + esc_(R.hi) + '</p>' +
    '<p style="margin:0 0 14px">' + esc_(fill_(R.body, map)) + '</p>' +
    (note ? '<p style="margin:0 0 14px;white-space:pre-line">' + esc_(note) + '</p>' : '') +
    '<p style="margin:22px 0 0">' + esc_(R.sign) + '</p>';
  const plain = [R.hi, fill_(R.body, map), note, R.sign].filter(Boolean).join('\n\n');
  sendMail_(to.join(','), fill_(R.subject, map), plain, emailShell_(inner, R.footer), [pdf]);
}

// Internal notices (Spanish) to the admins + it@adizes.com
function notifyAdmins_(kind, l, c) {
  const to = noticeList_().concat(CONFIG.EMAIL.NOTIFY_TO ? [CONFIG.EMAIL.NOTIFY_TO] : []).filter((x, i, a) => x && a.indexOf(x) === i);
  if (!to.length) return;
  const company = launchCompany_(l)['Name'] || '';
  const test = LABELS.es.tests[l['Type']];
  const url = prop_('ADMIN_URL');
  const head = kind === 'ready' ? 'Listo para reporte' : 'Fecha de cierre sin el mínimo';
  const text = kind === 'ready'
    ? 'El lanzamiento ya tiene ' + c.done + ' de ' + c.total + ' respuestas. Ya puedes revisar y generar el reporte en el admin.'
    : 'La fecha de cierre pasó con ' + c.done + ' de ' + c.total + ' respuestas (mínimo ' + (l['Min Responses'] || '') + '). Puedes enviar recordatorios o extender la fecha desde el admin.';
  const inner =
    '<div style="font:700 11px Arial,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:#d7141a;margin-bottom:8px">' + esc_(head) + '</div>' +
    '<p style="margin:0 0 6px;font:700 18px Arial,sans-serif">' + esc_(company) + ' · ' + esc_(test) + '</p>' +
    '<p style="margin:0 0 14px;color:#6b6f76">' + esc_(l['Name']) + ' (' + esc_(l['ID']) + ')</p>' +
    '<p style="margin:0 0 20px">' + esc_(text) + '</p>' +
    (url ? '<p style="margin:0">' + button_('Abrir el admin', url) + '</p>' : '');
  sendMail_(to.join(','), '[' + head + '] ' + company + ' · ' + test + ' · ' + l['Name'], text + (url ? '\n\n' + url : ''), emailShell_(inner, 'Aviso interno · Adizes Assessments'));
}
