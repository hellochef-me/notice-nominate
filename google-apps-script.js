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
 * ID | Timestamp | Nominator Name | Nominator Department | Nominee Name | Nominee Department | Core Value | Specific Behavior | Story
 *
 * Add "ID" as the first column header. Existing rows may leave ID empty (app will fall back to hash).
 */

var SHEET_ID = '18f26KgcXM5YEBH2bp9sL_qG6ljmghkZiIKjAuj-4o-k';

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    var id = data.id || generateId();

    sheet.appendRow([
      id,
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

/**
 * Returns all nominations from the sheet for the Notice Wall.
 * GET request - no auth required.
 */
function doGet(e) {
  var action = (e && e.parameter && e.parameter.action) || '';

  if (action === 'employees') {
    return getEmployees();
  }

  try {
    var sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();
    var data = sheet.getDataRange().getValues();

    if (data.length < 2) {
      return ContentService
        .createTextOutput(JSON.stringify([]))
        .setMimeType(ContentService.MimeType.JSON);
    }

    var headers = data[0];
    var rows = data.slice(1).filter(function(row) {
      return row.some(function(cell) { return cell !== '' && cell !== null && cell !== undefined; });
    }).map(function(row) {
      var obj = {};
      headers.forEach(function(h, i) {
        var key = String(h || '').trim() || 'col' + i;
        obj[key] = row[i] !== undefined && row[i] !== null ? String(row[i]) : '';
      });
      return obj;
    });

    return ContentService
      .createTextOutput(JSON.stringify(rows))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Returns employee names and departments from the "Employees" sheet.
 * Columns: A = Name, B = Department
 */
function getEmployees() {
  try {
    var ss = SpreadsheetApp.openById(SHEET_ID);
    var sheet = ss.getSheetByName('Employees');
    var lastRow = sheet.getLastRow();

    if (lastRow < 2) {
      return ContentService
        .createTextOutput(JSON.stringify([]))
        .setMimeType(ContentService.MimeType.JSON);
    }

    var data = sheet.getRange('A2:B' + lastRow).getValues();
    var employees = data
      .filter(function(row) { return row[0] !== '' && row[0] !== null; })
      .map(function(row) { return { name: String(row[0]).trim(), department: String(row[1] || '').trim() }; });

    return ContentService
      .createTextOutput(JSON.stringify(employees))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
