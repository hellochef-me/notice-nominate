/**
 * Google Apps Script - Notice & Nominate Form Handler
 *
 * DEPLOYMENT INSTRUCTIONS:
 * 1. Open https://script.google.com and create a new project
 * 2. Paste this entire file into Code.gs
 * 3. Click Deploy > New deployment
 * 4. Select type: "Web app"
 * 5. Set "Execute as" to your account
 * 6. Set "Who has access" to "Anyone"
 * 7. Click Deploy and copy the Web App URL
 * 8. Add the URL as VITE_APPS_SCRIPT_URL in your .env file
 *
 * SHEET SETUP:
 * Make sure your Google Sheet (ID: 18f26KgcXM5YEBH2bp9sL_qG6ljmghkZiIKjAuj-4o-k)
 * has the following headers in Row 1:
 * Timestamp | Nominator Name | Nominator Department | Nominee Name | Nominee Department | Core Value | Specific Behavior | Story
 */

var SHEET_ID = '18f26KgcXM5YEBH2bp9sL_qG6ljmghkZiIKjAuj-4o-k';

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();
    var data = JSON.parse(e.postData.contents);

    sheet.appendRow([
      new Date(),
      data.nominatorName || '',
      data.nominatorDepartment || '',
      data.nomineeName || '',
      data.nomineeDepartment || '',
      data.coreValue || '',
      data.behavior || '',
      data.story || ''
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', message: 'Notice & Nominate API is running' }))
    .setMimeType(ContentService.MimeType.JSON);
}
