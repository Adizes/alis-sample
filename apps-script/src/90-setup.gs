/* =================================================================================
 *  TIME TRIGGER (every hour): launches whose close date passed become "Ready"
 *  (or admins are told the minimum wasn't reached).
 * ================================================================================= */
function tick() {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(10000)) return;
  LOCK_DEPTH_++;
  try {
    rows_(LAUNCHES).forEach(l => { if (l['Status'] === L_STATUS.OPEN) checkReady_(l['ID']); });
  } finally {
    LOCK_DEPTH_--;
    lock.releaseLock();
  }
}

/* =================================================================================
 *  SETUP — run once from the editor: choose "setup" in the toolbar and press ▶ Run
 * ================================================================================= */
function setup() {
  const props = PropertiesService.getScriptProperties();
  if (!props.getProperty('ADMIN_EMAILS')) props.setProperty('ADMIN_EMAILS', 'dario@adizes.com');
  // From the editor the active user is the owner; from a web page it must be an admin.
  if (!isAdmin_(currentEmail_())) throw new Error('forbidden');
  // 1) Data spreadsheet (share it only with admins)
  if (!CONFIG.DATA_SPREADSHEET_ID && !props.getProperty('DATA_SPREADSHEET_ID')) {
    props.setProperty('DATA_SPREADSHEET_ID', SpreadsheetApp.create('Adizes Assessments — Data').getId());
  }
  // 2) Drive folder for the reports
  if (!CONFIG.PDF_FOLDER_ID && !props.getProperty('PDF_FOLDER_ID')) {
    props.setProperty('PDF_FOLDER_ID', DriveApp.createFolder('Adizes Assessments — Reports').getId());
  }
  [COMPANIES, EMPLOYEES, LAUNCHES, INVITES, ED_ANSWERS].forEach(T => headerMap_(table_(T), T));
  TESTS.forEach(t => folder_(t));
  // 3) Trigger
  ScriptApp.getProjectTriggers().forEach(t => { if (['tick', 'backupDeliver'].indexOf(t.getHandlerFunction()) >= 0) ScriptApp.deleteTrigger(t); });
  ScriptApp.newTrigger('tick').timeBased().everyHours(1).create();
  // 4) Touch Gmail once so Google asks for that permission now
  GmailApp.getAliases();
  Logger.log('Ready.\nData spreadsheet: ' + dataSS_().getUrl() +
    '\nReports folder: ' + DriveApp.getFolderById(CONFIG.PDF_FOLDER_ID || props.getProperty('PDF_FOLDER_ID')).getUrl() +
    '\nAdmins: ' + props.getProperty('ADMIN_EMAILS'));
}
