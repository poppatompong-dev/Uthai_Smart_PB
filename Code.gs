/**
 * =========================================================================
 * UTHAI THANI SMART PA MANAGEMENT SYSTEM - BACKEND ENGINE
 * Version: 4.8.5 (Final Stable - Production Ready)
 * Updated: 2026-01-22
 * Developer: นักวิชาการคอมพิวเตอร์ เทศบาลเมืองอุทัยธานี
 * =========================================================================
 */
const CONFIG = {
  APP_ID: 'uthai-smart-pa',
  DRIVE_PHOTO_FOLDER: '1ogy7ecMeNU3_vruq9n0q2X958ZrT81XU',
  SPREADSHEET_DB_ID: '1Xs_pVZp6SkGNR5XbFTrLycGiBXeeeMd1hw60pjQmr3o'
};

function doGet(e) {
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle('Uthai Thani Smart PA')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function processAdminAction(action, payload) {
  const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_DB_ID);
  if (action === 'USER_SAVE') {
    const sheet = ss.getSheetByName('users') || ss.insertSheet('users');
    const data = sheet.getDataRange().getValues();
    let foundRow = -1;
    for (let i = 1; i < data.length; i++) { if (data[i][0] == payload.id) { foundRow = i + 1; break; } }
    const row = [payload.id, payload.username, payload.password, payload.role, payload.name];
    if (foundRow > -1) sheet.getRange(foundRow, 1, 1, 5).setValues([row]);
    else sheet.appendRow(row);
    return { success: true };
  }
}

function uploadEvidence(base64Data, fileName, pointNumber) {
  try {
    const rootFolder = DriveApp.getFolderById(CONFIG.DRIVE_PHOTO_FOLDER);
    const folderName = "Point_" + pointNumber;
    let targetFolder;
    const folders = rootFolder.getFoldersByName(folderName);
    targetFolder = folders.hasNext() ? folders.next() : rootFolder.createFolder(folderName);
    const contentType = base64Data.substring(5, base64Data.indexOf(';'));
    const bytes = Utilities.base64Decode(base64Data.split(',')[1]);
    const blob = Utilities.newBlob(bytes, contentType, fileName);
    const file = targetFolder.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    return { success: true, fileId: file.getId(), viewUrl: file.getUrl() };
  } catch (err) { return { success: false, error: err.toString() }; }
}