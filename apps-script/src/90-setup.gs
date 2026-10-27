/* =================================================================================
 *  TIME TRIGGER (every 10 minutes)
 * ================================================================================= */
function backupDeliver() {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(5000)) return;
  LOCK_DEPTH_++;
  try {
    edBackup_();
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
  // 1) Data spreadsheet (only admins should have access to it)
  if (!CONFIG.DATA_SPREADSHEET_ID && !props.getProperty('DATA_SPREADSHEET_ID')) {
    const ss = SpreadsheetApp.create('Adizes Assessments — Data');
    props.setProperty('DATA_SPREADSHEET_ID', ss.getId());
  }
  // 2) Drive folder for the PDFs
  if (!CONFIG.PDF_FOLDER_ID && !props.getProperty('PDF_FOLDER_ID')) {
    const f = DriveApp.createFolder('Adizes Assessments — PDFs');
    props.setProperty('PDF_FOLDER_ID', f.getId());
  }
  table_(ED_TABLE);
  folder_('ED');
  // 3) Admin list (used from stage 2 on)
  if (!props.getProperty('ADMIN_EMAILS')) props.setProperty('ADMIN_EMAILS', 'dario@adizes.com');
  // 4) Trigger
  ScriptApp.getProjectTriggers().forEach(t => { if (t.getHandlerFunction() === 'backupDeliver') ScriptApp.deleteTrigger(t); });
  ScriptApp.newTrigger('backupDeliver').timeBased().everyMinutes(10).create();
  // 5) Touch Gmail once so Google asks for that permission now
  GmailApp.getAliases();
  const ss = dataSS_();
  Logger.log('Ready.\nData spreadsheet: ' + ss.getUrl() + '\nPDF folder: ' + DriveApp.getFolderById(CONFIG.PDF_FOLDER_ID || props.getProperty('PDF_FOLDER_ID')).getUrl());
}

// Optional: run from the editor to send yourself a test summary email.
function testEmailToMe() {
  const me = Session.getActiveUser().getEmail();
  const rec = { 'ID': 'ED-TEST', 'Language': 'es', 'First Name': 'Prueba', 'Full Name': 'Prueba Adizes', 'Email': me, 'Company': 'Adizes' };
  ED_Q_COLS.forEach((h, i) => rec[h] = [5, 4, 3, 2, 1][i % 5]);
  edSendUserEmail_(rec, null);
  Logger.log('Sent to ' + me);
}
