var app = SpreadsheetApp;
var active = app.getActive();
//var ui = app.getUi();
    
var spreadsheet = app.getActiveSpreadsheet();
var sheet = spreadsheet.getActiveSheet();
var cell = sheet.getActiveCell();
var cellColumn = cell.getColumn();
var cellRow = cell.getRow();
    
var columns = [0,"A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
    
if (cellColumn > 1) { var cellLeft = sheet.getRange(cellRow, cellColumn - 1) }
var cellRight = sheet.getRange(cellRow, cellColumn + 1);
if (cellColumn < 1) { var cellLeftA1Notation = columns[cellColumn - 1] + cellRow }
var cellRightA1Notation = columns[cellColumn + 1] + cellRow;
  
var goodGradient = [0,0,0,0,0,0,0,0,0,"#43606f", "#456972", "#477275", "#497b78", "#4b847b", "#4d8d7e", "#4f9681", "#519f84", "#53a887", "#55b18a", "#57bb8a"];
var badGradient = [0,0,0,0,0,0,0,0,0,"#e06666", "#d56165", "#ca5c64", "#bf5762", "#b45261", "#a94d60", "#9e485e", "#93435d", "#883e5c", "#7d395a", "#743759"];
var advanceColor = goodGradient[cellColumn];
var advanceColorRight = goodGradient[cellColumn + 1];
var revertColor = badGradient[cellColumn];
var revertColorLeft = badGradient[cellColumn - 1];

var sheetColumns = ["","EPIC","S","JIRA","Item","Engineer","At bat","Last","RSRCH","PLAN","TO DO","IN PROG","R4R","DESIGN","QA","ACCT","R4M","MRGD","GA","","","","","","","start","goal","current","block","30"];
// Run newLayout() to get current column layout

function findColumn(string) {
  return sheetColumns.indexOf(string) + 1;
}

var stagedCell = sheet.getRange(cellRow, findColumn("S"));
var jiraCell = sheet.getRange(cellRow, findColumn("JIRA"));
var itemCell = sheet.getRange(cellRow, findColumn("Item"));
var itemEngineer = sheet.getRange(cellRow, findColumn("Engineer"));
var itemWaitingOn = sheet.getRange(cellRow, findColumn("At bat"));
var itemLast = sheet.getRange(cellRow, findColumn("Last"));
      
var researchColumn = findColumn("RSRCH");
var planColumn = findColumn("PLAN");
var toDoColumn = findColumn("TO DO");
var inProgressColumn = findColumn("IN PROG");
var r4rColumn = findColumn("R4R");
var designColumn = findColumn("DESIGN");
var qaColumn = findColumn("QA");
var acceptColumn = findColumn("ACCT");
var r4mColumn = findColumn("R4R");
var mergedColumn = findColumn("MRGD");
var gaColumn = findColumn("GA");
      
//var canProgress = (cellColumn >= planColumn && cellColumn < gaColumn);
//var canRevert = (cellColumn >= toDoColumn && cellColumn <= gaColumn);
      
var itemStart = sheet.getRange(cellRow, findColumn("start"));
var itemGoal = sheet.getRange(cellRow, findColumn("goal"));
var itemCurrent = sheet.getRange(cellRow, findColumn("current"));
var itemBlocker = sheet.getRange(cellRow, findColumn("block"));
    
var markingGA = (cellColumn == gaColumn - 1);
      
var db = spreadsheet.getSheetByName('db');
var now = new Date();

/*
NOTES:
"Light" gray is light gray 1
*/

function checkEdit() {
  if (sheet.getName() == "Settings") { return }
  if (cell.getValue() == "START") { setAsStart() }
  if (cell.getValue() == "BLOCKER") { blocker() }
  if (cell.getValue() == "GOAL") { setAsGoal() }
}

function resetCell(newSheet, newRow, newColumn) {
  sheet = newSheet;
  cell = sheet.getRange(newRow, newColumn);
  cellColumn = newColumn;
  cellRow = newRow;       
  cellLeft = sheet.getRange(cellRow, cellColumn - 1);
  cellRight = sheet.getRange(cellRow, cellColumn + 1);
  cellLeftA1Notation = columns[cellColumn - 1] + cellRow;
  cellRightA1Notation = columns[cellColumn + 1] + cellRow;
  advanceColor = goodGradient[cellColumn];
  advanceColorRight = goodGradient[cellColumn + 1];
  revertColor = badGradient[cellColumn];
  revertColorLeft = badGradient[cellColumn - 1];
  stagedCell = sheet.getRange(cellRow, 3);
  jiraCell = sheet.getRange(cellRow, 4);
  itemCell = sheet.getRange(cellRow, 5);
  itemEngineer = sheet.getRange(cellRow, 6);
  itemWaitingOn = sheet.getRange(cellRow, 7);
  itemLast = sheet.getRange(cellRow, 8);
  itemStart = sheet.getRange(cellRow, planColumn + 16);
  itemGoal = sheet.getRange(cellRow, planColumn + 17);
  itemCurrent = sheet.getRange(cellRow, planColumn + 18);
  itemBlocker = sheet.getRange(cellRow, planColumn + 19);
  markingGA = (cellColumn == gaColumn - 1);

}

function isItemStart(cell) { return (cell.getColumn() == itemStart.getValue()) }
function isItemGoal(cell) { return (cell.getColumn() == itemGoal.getValue()) }
function isItemBlocker(cell) { return (cell.getColumn() == itemBlocker.getValue()) }
  


function assignWaitingOn(cell) {
  var settings = spreadsheet.getSheetByName("Settings");
  var designer = settings.getRange(5, 2).getValue();
  var qaEngineer = settings.getRange(6, 2).getValue();
  var product = settings.getRange(7, 2).getValue();

  switch(cell.getColumn()) {
    case inProgressColumn:
  itemWaitingOn.setValue(itemEngineer.getValue());
  break;
    case designColumn:
  itemWaitingOn.setValue(designer);
  break;
    case qaColumn:
  itemWaitingOn.setValue(qaEngineer);
  break;
    case acceptColumn:
  itemWaitingOn.setValue(product);
  break;
    case gaColumn:
  itemWaitingOn.setValue(null)
  break;
    default:
      itemWaitingOn.setValue("TEAM");
  }
}

function updateLast(direction) {
  var newCellData = Sheets.newCellData();
  var day = weekdayNow();
  newCellData.textFormatRuns = [];
  var newFmt = Sheets.newTextFormatRun();
  switch(day) {
    case "Thurs":
      newFmt.startIndex = 6;
      break;
    default:
      newFmt.startIndex = 4;
  }
  newFmt.format = Sheets.newTextFormat();
  newFmt.format.foregroundColor = Sheets.newColor();
  var newValue = new Sheets.newExtendedValue();

  switch(direction) {
    case "start":
      newValue.setStringValue(day + " S")
      var 
      red = 0.29,
      green = 0.53,
      blue = 0.91;
      break;
    case "advance":
      newValue.setStringValue(day + " ->")
      var 
      red = 0.34,
      green = 0.73,
      blue = 0.54;
      break;
    case "revert":
      newValue.setStringValue(day + " <-")
      var 
      red = 0.88,
      green = 0.4,
      blue = 0.4;
      break;
    case "blocker":
      newValue.setStringValue(day + " B!")
      var 
      red = 0.88,
      green = 0.4,
      blue = 0.4
      break;
    case "unblock":
      newValue.setStringValue(day + " -B")
      var 
      red = 0.34,
      green = 0.73,
      blue = 0.54;
      break;
    case "GA":
      newValue.setStringValue(day + " GA")
      var 
      red = 0,
      green = 1,
      blue = 0;
      break;
  }
  
  newFmt.format.foregroundColor.red = red;
  newFmt.format.foregroundColor.green = green;
  newFmt.format.foregroundColor.blue = blue;
  newCellData.textFormatRuns.push(newFmt);
  newCellData.userEnteredValue = newValue;
  
    // Create the request object.
  var batchUpdateRQ = Sheets.newBatchUpdateSpreadsheetRequest();
  batchUpdateRQ.requests = [];
  batchUpdateRQ.requests.push(
    {
       "updateCells": {
        "rows": [ { "values": newCellData } ],
        "fields": "userEnteredValue, textFormatRuns",
        "start": {
          "sheetId": sheet.getSheetId(),
          "rowIndex": itemLast.getRow() - 1,
          "columnIndex": itemLast.getColumn() - 1
        }
      }
    }
  );
  Sheets.Spreadsheets.batchUpdate(batchUpdateRQ, active.getId());
}

function startNewWeek() {
  var currentWeek = db.getRange(1, 2);
  var stagedForNewWeek = db.getRange(2, 2);
  var rItem;
  var rItemCurrentPosition;
  if (stagedForNewWeek.getValue() == false) {
  var rowsToTransfer = [];  
  for (var r = 5; r < 40; r++){
    rItem = sheet.getRange(r, 5).getValue();
    rItemCurrentPosition = sheet.getRange(r, planColumn + 18).getValue();
    if (sheet.getRange(r, 2).getValue() == "Notes") { break }
    if (rItem != "" && rItemCurrentPosition < gaColumn) {
      rowsToTransfer.push({"values": [{"userEnteredValue": {"boolValue": true}}]});
    }
    else { 
      rowsToTransfer.push({"values": [{"userEnteredValue": {"boolValue": false}}]}); }    
  }  
    var resource = {"requests": [
      {
        "repeatCell": {
          "cell": {"dataValidation": {"condition": {"type": "BOOLEAN"}}},
          "range": {"sheetId": sheet.getSheetId(), "startRowIndex": 4, "endRowIndex": r - 1, "startColumnIndex": 2, "endColumnIndex": 3},
          "fields": "dataValidation"
        }
      }
      ,
      {
        "updateCells": {
          "rows": rowsToTransfer,
          "start": {"rowIndex": 4, "columnIndex": 2, "sheetId": sheet.getSheetId()},
          "fields": "userEnteredValue"
        }
      }
      ,
      {
           "duplicateSheet": {
             "sourceSheetId": 506422022,
             "insertSheetIndex": 0,
             "newSheetName": dateNow()
           }
      }]};
    
    sheet.showColumns(3);
//    ui.alert("A wild column appears!", "Check those you wish to roll over to next week. Items that are not at goal have been checked for you. When you are ready to create the new sheet, hit the New week command again.", ui.ButtonSet.OK);
                          
  Sheets.Spreadsheets.batchUpdate(resource, active.getId());
  stagedForNewWeek.setValue(true);
  }
  else {
    var newSheet = app.getActiveSpreadsheet().getSheetByName(dateNow());
    var oldSheet = app.getActiveSpreadsheet().getSheetByName(currentWeek.getValue());
    var rowsToCopy = [];
    
    for (var r = 5; r < 40; r++) {
      if (oldSheet.getRange(r, 2).getValue() == "Notes") { break }
      if (oldSheet.getRange(r, 3).getValue() == true) { rowsToCopy.push(r); }
    }
  
    rowsToCopy.forEach(function(row,i) {
      var r = i + 5;
      var oldSheet_epic = oldSheet.getRange(row, 2).getValue();
      var oldSheet_jira = oldSheet.getRange(row, 4).getValue();
      var oldSheet_item = oldSheet.getRange(row, 5).getValue();
      var oldSheet_engineer = oldSheet.getRange(row, 6).getValue();
      var oldSheet_atBat = oldSheet.getRange(row, 7).getValue();
      var oldSheet_rCurrent = oldSheet.getRange(row, planColumn + 18).getValue();

      var newSheet_epic = newSheet.getRange(r, 2);
      var newSheet_jira = newSheet.getRange(r, 4);
      var newSheet_item = newSheet.getRange(r, 5);
      var newSheet_engineer = newSheet.getRange(r, 6);
      var newSheet_atBat = newSheet.getRange(r, 7);

      newSheet.getRange(r,6).activate();
      newSheet_epic.setValue(oldSheet_epic);
      newSheet_jira.setFormula('=HYPERLINK("https://salesloft.atlassian.net/browse/SL-' + oldSheet_jira + '", "' + oldSheet_jira + '")');
      newSheet_item.setValue(oldSheet_item);
      newSheet_engineer.setValue(oldSheet_engineer);
      newSheet_atBat.setValue(oldSheet_atBat);

      resetCell(newSheet, r, oldSheet_rCurrent);
      setAsStart();        
      newSheet.getRange(r, 2).setBackground(oldSheet.getRange(row, 2).getBackground()); // Set epic background
      newSheet.getRange(r, 2).setFontColor(oldSheet.getRange(row, 2).getFontColor()); // Set epic font color
      stagedCell.setValue(""); // Clear staged for next week
    });

    currentWeek.setValue(dateNow());
    stagedForNewWeek.setValue(false);
  }
}

function insertMondayCommit() {
  var newItem
  var newStart
  var ui = app.getUi();
  var newJIRA = ui.prompt("Is there already a JIRA card for this? (Enter below if so)", ui.ButtonSet.YES_NO);
  sheet.insertRowBefore(addedRow());
  
  if (newJIRA.getSelectedButton() == ui.Button.YES) {
    newJIRA = newJIRA.getResponseText();
    newItem = getJIRA(newJIRA).title;
    
  } else if (newJIRA.getSelectedButton() == ui.Button.NO) {
    newJIRA = ""
  }
      sheet.getRange(addedRow() - 1, jiraColumn).setValue(newJIRA);
  
  
}

// SPECIAL FORMATTING

function updateLastSync(cell) {
  var newCellData = Sheets.newCellData();
  newCellData.textFormatRuns = [];
  
  for (var i = 0; i <= 16; i += 16) {
  var newFmt = Sheets.newTextFormatRun();
  newFmt.startIndex = i;
  newFmt.format = Sheets.newTextFormat();
  newFmt.format.foregroundColor = Sheets.newColor();
      var red = 0.34;
      var green = 0.73;
      var blue = 0.54;
    }
    
  newFmt.format.foregroundColor.red = red;
  newFmt.format.foregroundColor.green = green;
  newFmt.format.foregroundColor.blue = blue;
  newCellData.textFormatRuns.push(newFmt);
    
  
  var newValue = new Sheets.newExtendedValue();
  newValue.setStringValue("Last JIRA sync:  " + weekdayNow() + " " + timeNow(12)); 
  newCellData.userEnteredValue = newValue;


  // Create the request object.
  var batchUpdateRQ = Sheets.newBatchUpdateSpreadsheetRequest();
  batchUpdateRQ.requests = [];
  batchUpdateRQ.requests.push(
    {
       "updateCells": {
        "rows": [ { "values": newCellData } ],
        "fields": "userEnteredValue, textFormatRuns",
        "start": {
          "sheetId": sheet.getSheetId(),
          "rowIndex": cell.getRow() - 1,
          "columnIndex": cell.getColumn() - 1
        }
      }
    }
  );
  Sheets.Spreadsheets.batchUpdate(batchUpdateRQ, active.getId());
}

function coresLightText(cell) {
  var newCellData = Sheets.newCellData();
  newCellData.textFormatRuns = [];
  
  for (var i = 0; i <= 6; i += 6) {
  var newFmt = Sheets.newTextFormatRun();
  newFmt.startIndex = i;
  newFmt.format = Sheets.newTextFormat();
  newFmt.format.foregroundColor = Sheets.newColor();
    switch(i) {
      case 0:
    var red = 1;
    var green = 0;
    var blue = 0;
    break;
      default:
    var red = .85;
    var green = .85;
    var blue = .85;
    }
    
  newFmt.format.foregroundColor.red = red;
  newFmt.format.foregroundColor.green = green;
  newFmt.format.foregroundColor.blue = blue;
  newCellData.textFormatRuns.push(newFmt);
    
  }
  
  var newValue = new Sheets.newExtendedValue();
  newValue.setStringValue("Cores Light"); 
  newCellData.userEnteredValue = newValue;


  // Create the request object.
  var batchUpdateRQ = Sheets.newBatchUpdateSpreadsheetRequest();
  batchUpdateRQ.requests = [];
  batchUpdateRQ.requests.push(
    {
       "updateCells": {
        "rows": [ { "values": newCellData } ],
        "fields": "userEnteredValue, textFormatRuns",
        "start": {
          "sheetId": sheet.getSheetId(),
          "rowIndex": cell.getRow() - 1,
          "columnIndex": cell.getColumn() - 1
        }
      }
    }
  );
  Sheets.Spreadsheets.batchUpdate(batchUpdateRQ, active.getId());
}