/* =================================================================================
 *  EXPRESS DIAGNOSTICS (individual)
 * ================================================================================= */
const ED_CELL_COLS = ED.CELLS.map(c => c.code + ' ' + LABELS.en.cells[c.key] + ' %');
const ED_Q_COLS = ED.QUESTION_CATS.map((c, i) => 'Q' + (i + 1));
const ED_TABLE = {
  name: 'ED Responses',
  cols: [
    'ID', 'Submitted At', 'Status', 'Mode', 'Group Code', 'Language',
    'Full Name', 'First Name', 'Last Name', 'Email', 'Company',
    'Key Focus Zones', 'To Improve', 'Healthy', 'Key Focus Areas',
  ].concat(ED_CELL_COLS, ED_Q_COLS, [
    'Report URL', 'Emailed At', 'Notified', 'Session Click', 'PDF Downloads',
    'Consent'], META_COLS, ['Widget Version', 'Error']),
  text: ['ID', 'Group Code', 'Full Name', 'First Name', 'Last Name', 'Email', 'Company', 'Key Focus Areas', 'Error'].concat(META_COLS),
};
const ED_STATUS = { SUBMITTED: 'Submitted', DONE: 'Done', DONE_NO_PDF: 'Done (no PDF)', ERROR: 'Error' };

function edSubmit_(b) {
  const answers = (b.answers || []).map(Number);
  if (!ED.validAnswers(answers)) throw new Error('invalid_answers');
  const c = b.contact || {};
  const name = clean_(c.name, 120).replace(/\s+/g, ' '), email = clean_(c.email, 160).toLowerCase(), company = clean_(c.company, 160);
  if (name.length < 2) throw new Error('invalid_name');
  if (!validEmail_(email)) throw new Error('invalid_email');
  if (!company) throw new Error('invalid_company');
  if (c.consent !== true) throw new Error('consent_required');
  const lang = LABELS[b.lang] ? b.lang : 'en';

  const r = ED.score([answers]);
  const counts = edCounts_(r);
  const id = newId_('ED');
  const nm = splitName_(name);
  const row = Object.assign({
    'ID': id, 'Submitted At': new Date(), 'Status': ED_STATUS.SUBMITTED, 'Mode': 'Individual', 'Language': lang,
    'Full Name': name, 'First Name': nm.first, 'Last Name': nm.last, 'Email': email, 'Company': company,
    'Key Focus Zones': counts.red, 'To Improve': counts.yellow, 'Healthy': counts.green,
    'Key Focus Areas': r.cells.filter(x => x.color === 'red').map(x => LABELS.en.cells[x.key]).join(' | '),
    'Consent': 'Yes', 'PDF Downloads': 0, 'Widget Version': clean_(b.v, 20),
  }, meta_(b.meta));
  r.cells.forEach((x, i) => { row[ED_CELL_COLS[i]] = Math.round(x.percent * 10) / 10; });
  answers.forEach((v, i) => { row[ED_Q_COLS[i]] = v; });
  appendRecord_(ED_TABLE, row);
  return { ok: true, id: id, counts: counts };
}

function edDeliver_(b) {
  const found = findRecord_(ED_TABLE, 'ID', clean_(b.id, 40));
  if (!found) throw new Error('not_found');
  const { sh, rowNum, rec, map } = found;
  if (rec['Status'] === ED_STATUS.DONE) return { ok: true, already: true };
  const blob = pdfBlob_(b.pdf, b.fileName, 'Express-Diagnostics.pdf');
  const nice = blob.getName();
  const file = folder_('ED').createFile(blob.setName(nice.replace(/\.pdf$/i, '') + ' - ' + rec['ID'] + '.pdf'));
  blob.setName(nice);
  const url = file.getUrl();
  setCells_(sh, rowNum, map, { 'Report URL': url });
  rec['Report URL'] = url;
  try {
    edSendUserEmail_(rec, blob);
    setCells_(sh, rowNum, map, { 'Emailed At': new Date() });
  } catch (err) {
    setCells_(sh, rowNum, map, { 'Status': ED_STATUS.ERROR, 'Error': 'email: ' + err });
    throw err;
  }
  edFinish_(sh, rowNum, map, rec, ED_STATUS.DONE);
  return { ok: true };
}

function edFinish_(sh, rowNum, map, rec, status) {
  const upd = { 'Status': status };
  if (CONFIG.EMAIL.NOTIFY_TO && !rec['Notified']) {
    try { edNotify_(rec); upd['Notified'] = new Date(); }
    catch (err) { upd['Notified'] = 'ERROR ' + String(err).slice(0, 200); }
  }
  setCells_(sh, rowNum, map, upd);
}

function edEvent_(b) {
  const found = findRecord_(ED_TABLE, 'ID', clean_(b.id, 40));
  if (!found) return { ok: true };
  const { sh, rowNum, rec, map } = found;
  if (b.type === 'book_click' && !rec['Session Click']) setCells_(sh, rowNum, map, { 'Session Click': new Date() });
  if (b.type === 'pdf_download') setCells_(sh, rowNum, map, { 'PDF Downloads': (Number(rec['PDF Downloads']) || 0) + 1 });
  return { ok: true };
}

// Time trigger: rows whose PDF never arrived (person closed the tab) get the summary email.
function edBackup_() {
  const { sh, map, rows } = allRecords_(ED_TABLE);
  const cutoff = Date.now() - CONFIG.BACKUP_AFTER_MIN * 60 * 1000;
  rows.forEach(rec => {
    if (rec['Status'] !== ED_STATUS.SUBMITTED || rec['Mode'] !== 'Individual') return;
    const at = rec['Submitted At'] instanceof Date ? rec['Submitted At'].getTime() : Date.parse(rec['Submitted At']);
    if (!(at < cutoff)) return;
    try {
      edSendUserEmail_(rec, null);
      setCells_(sh, rec._row, map, { 'Emailed At': new Date() });
      edFinish_(sh, rec._row, map, rec, ED_STATUS.DONE_NO_PDF);
    } catch (err) {
      setCells_(sh, rec._row, map, { 'Status': ED_STATUS.ERROR, 'Error': 'backup: ' + err });
    }
  });
}

/* ---------------- helpers ---------------- */
function edCounts_(r) { const c = { red: 0, yellow: 0, green: 0 }; r.cells.forEach(x => c[x.color]++); return c; }
function edRecScore_(rec) { return ED.score([ED_Q_COLS.map(h => Number(rec[h]))]); }
function edCalendly_(rec, src) {
  return CONFIG.CALENDLY_URL + '?name=' + encodeURIComponent(rec['Full Name'] || '') + '&email=' + encodeURIComponent(rec['Email'] || '') +
    '&utm_source=' + (src || 'express-diagnostics-email') + '&utm_content=' + encodeURIComponent(rec['ID']);
}
const ED_HEX = { green: '#1e8e4e', yellow: '#9a7200', red: '#d7141a' };
const ED_TINT = { green: '#dcf2e5', yellow: '#fff0bf', red: '#fbd6d7' };

function edSendUserEmail_(rec, pdfBlob) {
  const lang = LABELS[rec['Language']] ? rec['Language'] : 'en';
  const T = L_(lang), E = T.ed, r = edRecScore_(rec), counts = edCounts_(r);
  const first = esc_(rec['First Name'] || '');
  const cal = edCalendly_(rec);
  const boxes = ['red', 'yellow', 'green'].map(c =>
    '<td width="33%" style="padding:0 4px"><div style="background:#f6f6f6;border-left:4px solid ' + ED_HEX[c] + ';padding:12px 14px">' +
    '<div style="font:700 26px Arial,sans-serif;color:#111111">' + counts[c] + '</div>' +
    '<div style="font:600 12px Arial,sans-serif;color:#6b6f76">' + esc_(E.count[c]) + '</div></div></td>').join('');
  const rows = r.cells.slice().sort((a, b) => a.percent - b.percent).map(x =>
    '<tr><td style="padding:8px 0;border-bottom:1px solid #eeeeee;font:600 14px Arial,sans-serif;color:#111111">' + esc_(T.cells[x.key]) + '</td>' +
    '<td style="padding:8px 0;border-bottom:1px solid #eeeeee;text-align:right;white-space:nowrap"><span style="display:inline-block;padding:2px 8px;border-radius:3px;background:' + ED_TINT[x.color] + ';color:' + ED_HEX[x.color] + ';font:700 12px Arial,sans-serif">' + Math.round(x.percent) + '% · ' + esc_(T.colors[x.color]) + '</span></td></tr>').join('');
  const inner =
    '<p style="margin:0 0 14px">' + fill_(E.hi, { first: first }) + '</p>' +
    '<p style="margin:0 0 22px">' + esc_(pdfBlob ? E.intro : E.introNoPdf) + '</p>' +
    '<div style="font:700 11px Arial,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:#d7141a;margin-bottom:8px">' + esc_(E.glance) + '</div>' +
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 -4px"><tr>' + boxes + '</tr></table>' +
    '<div style="font:700 16px Arial,sans-serif;color:#111111;margin:26px 0 4px">' + esc_(E.factors) + '</div>' +
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0">' + rows + '</table>' +
    ctaBlock_(E.sessionTitle, E.sessionBody, E.sessionCta, cal) +
    '<p style="margin:22px 0 0">' + esc_(E.sign) + '</p>';
  const plain = fill_(E.hi, { first: rec['First Name'] || '' }) + '\n\n' + (pdfBlob ? E.intro : E.introNoPdf) + '\n\n' +
    ['red', 'yellow', 'green'].map(c => counts[c] + ' ' + E.count[c]).join(' · ') + '\n\n' +
    r.cells.map(x => T.cells[x.key] + ': ' + Math.round(x.percent) + '% (' + T.colors[x.color] + ')').join('\n') +
    '\n\n' + E.sessionTitle + ': ' + cal + '\n\n' + E.sign;
  sendMail_(rec['Email'], E.subject, plain, emailShell_(inner, E.footer), pdfBlob ? [pdfBlob] : null);
}

function edNotify_(rec) {
  const r = edRecScore_(rec), counts = edCounts_(r);
  const lines = [
    ['ID', rec['ID']], ['Name', rec['Full Name']], ['Email', rec['Email']], ['Company', rec['Company']], ['Language', rec['Language']],
    ['Result', counts.red + ' key focus · ' + counts.yellow + ' to improve · ' + counts.green + ' healthy'],
    ['Key focus areas', rec['Key Focus Areas'] || '(none)'],
    ['Report', rec['Report URL'] || '(no PDF — sent by backup)'],
    ['Source', [rec['UTM Source'], rec['UTM Medium'], rec['UTM Campaign']].filter(String).join(' / ') || '(none)'],
  ];
  const html = '<table style="font:14px Arial,sans-serif;border-collapse:collapse">' + lines.map(l =>
    '<tr><td style="padding:4px 14px 4px 0;color:#6b6f76;vertical-align:top">' + esc_(l[0]) + '</td><td style="padding:4px 0;color:#111111">' + esc_(l[1]) + '</td></tr>').join('') + '</table>';
  const subject = '[Express Diagnostics] ' + rec['Full Name'] + ' · ' + rec['Company'] + ' · ' + counts.red + ' key focus';
  sendMail_(CONFIG.EMAIL.NOTIFY_TO, subject, lines.map(l => l[0] + ': ' + l[1]).join('\n'), html);
}
