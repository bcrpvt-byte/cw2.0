/**
 * CoachApp Backend - Google Apps Script
 * Visual: Ascent Professional Design System
 * Architecture: Modular GAS logic with Google Sheets as DB
 */

// --- CONFIGURATION ---
const CONFIG = {
  SHEET_NAME_APPLICATIONS: 'Applications',
  SHEET_NAME_ATHLETES: 'Athletes',
  SHEET_NAME_PRODUCTS: 'Products',
  SHEET_NAME_CONTRACTS: 'Contracts',
  SHEET_NAME_GOALS: 'AthleteGoals',
  SHEET_NAME_CALLS: 'CallLogs',
  
  DRIVE_BASE_FOLDER: 'CoachApp_Data',
  APP_TITLE: 'CoachApp Professional'
};

/**
 * Serves the web application
 */
function doGet(e) {
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle(CONFIG.APP_TITLE)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

/**
 * Handle incoming webhooks (e.g. from Google Forms)
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    return processIncomingApplication(data);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// --- API FUNCTIONS (Called from Frontend via google.script.run) ---

/**
 * Fetches all athletes for selection in the Calls modal
 */
function api_getAthletes() {
  const sheet = _getSheet(CONFIG.SHEET_NAME_ATHLETES);
  if (!sheet) return [];
  
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return []; // Only header or empty
  const headers = data.shift();
  
  return data.map(row => {
    let obj = {};
    headers.forEach((h, i) => obj[h] = row[i]);
    return obj;
  });
}

/**
 * Fetches active products and bundles
 */
function api_getProducts() {
  const sheet = _getSheet(CONFIG.SHEET_NAME_PRODUCTS);
  if (!sheet) return [];
  
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];
  const headers = data.shift();
  
  return data.map(row => {
    let obj = {};
    headers.forEach((h, i) => obj[h] = row[i]);
    return obj;
  });
}

/**
 * Saves a product or bundle to the Products sheet
 */
function api_saveProduct(productData) {
  const sheet = _getSheet(CONFIG.SHEET_NAME_PRODUCTS);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const idIndex = headers.indexOf('product_id');
  
  if (idIndex === -1) return { status: 'error', message: 'product_id column not found' };

  let rowIndex = -1;
  if (productData.product_id) {
    for (let i = 1; i < data.length; i++) {
       if (data[i][idIndex] === productData.product_id) {
         rowIndex = i + 1;
         break;
       }
    }
  }

  // Generate ID if new
  if (!productData.product_id) {
    productData.product_id = 'P-' + Utilities.getUuid().substring(0, 8).toUpperCase();
  }

  const newRow = headers.map(h => productData[h] || '');
  
  if (rowIndex > -1) {
    sheet.getRange(rowIndex, 1, 1, headers.length).setValues([newRow]);
  } else {
    sheet.appendRow(newRow);
  }

  return { status: 'success', product: productData };
}

/**
 * Deletes a product by ID
 */
function api_deleteProduct(productId) {
  const sheet = _getSheet(CONFIG.SHEET_NAME_PRODUCTS);
  const data = sheet.getDataRange().getValues();
  const idIndex = data[0].indexOf('product_id');

  for (let i = 1; i < data.length; i++) {
    if (data[i][idIndex] === productId) {
      sheet.deleteRow(i + 1);
      return { status: 'success' };
    }
  }
  return { status: 'error', message: 'Product not found' };
}

/**
 * Processes the conclusion of a call
 * Creates logs, notes, and triggers automated workflows
 */
function api_saveCallConclusion(callData) {
  const timestamp = new Date();
  
  try {
    // 1. Log the call
    const callLogSheet = _getSheet(CONFIG.SHEET_NAME_CALLS);
    callLogSheet.appendRow([
      timestamp,
      callData.athleteId,
      callData.type, // e.g. 'Erstgespräch'
      callData.duration,
      callData.notesId || '',
      JSON.stringify(callData.summary)
    ]);
    
    // 2. Save Goals if any
    if (callData.goals && callData.goals.length > 0) {
      const goalSheet = _getSheet(CONFIG.SHEET_NAME_GOALS);
      callData.goals.forEach(goal => {
        goalSheet.appendRow([
          timestamp,
          callData.athleteId,
          goal.name,
          goal.scope,
          goal.kpis
        ]);
      });
    }
    
    // 3. Trigger Workflows based on triggers
    const results = {
      emailSent: false,
      athleteAppInvited: false,
      contractCreated: false
    };
    
    if (callData.triggers.sendActivation) {
      results.athleteAppInvited = _triggerAthleteAppActivation(callData.athleteId);
    }
    
    if (callData.triggers.createContract) {
      results.contractCreated = _triggerContractCreation(callData);
    }
    
    return { status: 'success', results: results };
  } catch (e) {
    return { status: 'error', message: e.toString() };
  }
}

/**
 * Creates/Retrieves a call notes document in Drive
 */
function api_getOrCreateNotesDoc(athleteName, callType) {
  try {
    const folder = _getAthleteFolder(athleteName, 'Notes/Call Notes');
    const dateStr = Utilities.formatDate(new Date(), "GMT+1", "yyyy-MM-dd");
    const fileName = `${dateStr}_${callType}_${athleteName}`;
    
    // Check if exists
    const files = folder.getFilesByName(fileName);
    if (files.hasNext()) {
      return files.next().getUrl();
    }
    
    // Create new
    const doc = DocumentApp.create(fileName);
    const file = DriveApp.getFileById(doc.getId());
    file.moveTo(folder);
    
    return doc.getUrl();
  } catch (e) {
    return { error: e.toString() };
  }
}

// --- INTERNAL HELPERS ---

function _getSheet(name) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    // Basic Header Setup if new
    if (name === CONFIG.SHEET_NAME_APPLICATIONS) sheet.appendRow(['Timestamp', 'Name', 'Email', 'Goals', 'Data']);
    if (name === CONFIG.SHEET_NAME_CALLS) sheet.appendRow(['Timestamp', 'AthleteID', 'Type', 'Duration', 'NotesLink', 'SummaryJSON']);
    if (name === CONFIG.SHEET_NAME_GOALS) sheet.appendRow(['Timestamp', 'AthleteID', 'GoalName', 'Scope', 'KPIs']);
  }
  return sheet;
}

function processIncomingApplication(data) {
  const sheet = _getSheet(CONFIG.SHEET_NAME_APPLICATIONS);
  sheet.appendRow([new Date(), data.name, data.email, data.goals, JSON.stringify(data)]);
  
  // Auto-responder
  MailApp.sendEmail({
    to: data.email,
    subject: `Willkommen bei Coaching Workspace, ${data.name}!`,
    body: `Vielen Dank für dein Interesse am Coaching. \n\nDu kannst hier ein Erstgespräch buchen: [KALENDER_LINK]\n\nSportliche Grüße,\nCoach Michael`
  });
  
  return ContentService.createTextOutput(JSON.stringify({ status: 'ok' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function _getAthleteFolder(athleteName, subPath) {
  const baseFolderName = CONFIG.DRIVE_BASE_FOLDER;
  let baseFolder;
  const folders = DriveApp.getFoldersByName(baseFolderName);
  
  if (folders.hasNext()) {
    baseFolder = folders.next();
  } else {
    baseFolder = DriveApp.createFolder(baseFolderName);
  }
  
  let athleteFolder;
  const aFolders = baseFolder.getFoldersByName(athleteName);
  if (aFolders.hasNext()) {
    athleteFolder = aFolders.next();
  } else {
    athleteFolder = baseFolder.createFolder(athleteName);
  }
  
  // Handle subpath (recursive simplified)
  let currentFolder = athleteFolder;
  if (subPath) {
    const parts = subPath.split('/');
    parts.forEach(part => {
      const subFolders = currentFolder.getFoldersByName(part);
      if (subFolders.hasNext()) {
        currentFolder = subFolders.next();
      } else {
        currentFolder = currentFolder.createFolder(part);
      }
    });
  }
  
  return currentFolder;
}

function _triggerAthleteAppActivation(athleteId) {
  // Generate a mock activation code
  const activationCode = Math.floor(100000 + Math.random() * 900000).toString();
  console.log(`Generated Activation Code for Athlete ${athleteId}: ${activationCode}`);
  
  // In a real app, we'd store this in the 'Athletes' sheet or a dedicated 'Activations' sheet
  // And then send it via email.
  
  return { success: true, code: activationCode };
}

function _triggerContractCreation(callData) {
  // Mock logic to generate PDF from template and save to Drive
  console.log('Creating Contract for data: ' + JSON.stringify(callData));
  return true;
}
