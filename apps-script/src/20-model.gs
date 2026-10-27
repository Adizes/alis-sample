/* =================================================================================
 *  DATA MODEL — one tab per table in the data spreadsheet (columns matched by header)
 * ================================================================================= */
const COMPANIES = {
  name: 'Companies',
  cols: ['ID', 'Name', 'Country', 'Language', 'Contact Name', 'Contact Email', 'Notes', 'Status', 'Created At', 'Updated At'],
  text: ['ID', 'Name', 'Country', 'Contact Name', 'Contact Email', 'Notes'],
};
const EMPLOYEES = {
  name: 'Employees',
  cols: ['ID', 'Company ID', 'Full Name', 'Email', 'Area', 'Position', 'Status', 'Created At', 'Updated At'],
  text: ['ID', 'Company ID', 'Full Name', 'Email', 'Area', 'Position'],
};
const LAUNCHES = {
  name: 'Launches',
  cols: ['ID', 'Company ID', 'Type', 'Name', 'Language', 'Status', 'Min Responses', 'Close Date', 'Recipients',
    'Created At', 'Opened At', 'Ready At', 'Report URL', 'Report File ID', 'Report Generated At', 'Report Sent At', 'Report Sent To',
    'Closed At', 'Notice', 'Notes', 'Updated At'],
  text: ['ID', 'Company ID', 'Name', 'Close Date', 'Recipients', 'Report Sent To', 'Notes'],
};
const INVITES = {
  name: 'Invitations',
  cols: ['ID', 'Launch ID', 'Employee ID', 'Token', 'Status', 'Sent At', 'Reminded At', 'Reminders', 'Completed On', 'Created At'],
  text: ['ID', 'Launch ID', 'Employee ID', 'Token', 'Completed On'],
};
const ED_CELL_COLS = ED.CELLS.map(c => c.code + ' ' + c.key + ' %');
const ED_Q_COLS = ED.QUESTION_CATS.map((c, i) => 'Q' + (i + 1));
const ED_ANSWERS = {
  name: 'ED Answers',
  cols: ['Response ID', 'Launch ID', 'Invitation ID', 'Employee ID', 'Full Name', 'Submitted At', 'Language'].concat(ED_CELL_COLS, ED_Q_COLS),
  text: ['Response ID', 'Launch ID', 'Invitation ID', 'Employee ID', 'Full Name'],
};

const L_STATUS = { DRAFT: 'Draft', OPEN: 'Open', READY: 'Ready', SENT: 'Report sent', CLOSED: 'Closed' };
const I_STATUS = { PENDING: 'Pending', SENT: 'Sent', DONE: 'Completed', REMOVED: 'Removed' };

/* ---------------- generic record helpers ---------------- */
function rows_(T) { return allRecords_(T).rows; }
function byId_(T, id) { return findRecord_(T, 'ID', id); }
function update_(T, id, obj) {
  const f = byId_(T, id);
  if (!f) throw new Error('not_found');
  setCells_(f.sh, f.rowNum, f.map, obj);
  Object.keys(obj).forEach(k => f.rec[k] = obj[k]);
  return f.rec;
}

/* ---------------- launches: counts + "ready" rule ---------------- */
function launchCounts_(launchId, invites) {
  const list = (invites || rows_(INVITES)).filter(i => i['Launch ID'] === launchId && i['Status'] !== I_STATUS.REMOVED);
  return { total: list.length, done: list.filter(i => i['Status'] === I_STATUS.DONE).length };
}
function closeDatePassed_(l) {
  const d = dateStr_(l['Close Date']);
  return !!d && today_() > d;
}
/**
 * Open → Ready when everybody invited has answered, or the close date has passed, and the minimum
 * is met. If the date passed without the minimum, admins are told once ("Notice").
 */
function checkReady_(launchId) {
  return withLock_(() => {
    const f = byId_(LAUNCHES, launchId);
    if (!f || f.rec['Status'] !== L_STATUS.OPEN) return null;
    const l = f.rec, c = launchCounts_(launchId);
    const min = Number(l['Min Responses']) || CONFIG.MIN_RESPONSES[l['Type']] || 1;
    const all = c.total > 0 && c.done >= c.total, late = closeDatePassed_(l);
    if (c.done >= min && (all || late)) {
      setCells_(f.sh, f.rowNum, f.map, { 'Status': L_STATUS.READY, 'Ready At': new Date(), 'Notice': '' });
      l['Status'] = L_STATUS.READY;
      try { notifyAdmins_('ready', l, c); } catch (err) { console.error('notify', err); }
      return 'ready';
    }
    if (late && c.done < min && !l['Notice']) {
      setCells_(f.sh, f.rowNum, f.map, { 'Notice': 'expired' });
      try { notifyAdmins_('expired', l, c); } catch (err) { console.error('notify', err); }
      return 'expired';
    }
    return null;
  });
}

/* ---------------- invitation links ---------------- */
function inviteLink_(type, token) { return CONFIG.PAGES[type] + '?t=' + encodeURIComponent(token); }
