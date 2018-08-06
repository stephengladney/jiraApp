var app = SpreadsheetApp;
var active = app.getActive();
var ui = app.getUi();
    
var spreadsheet = app.getActiveSpreadsheet();
var sheet = spreadsheet.getActiveSheet();
var cell = sheet.getActiveCell();
var cellColumn = cell.getColumn();
var cellRow = cell.getRow();
    
var columns = [0,"A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
    
var cellLeft = sheet.getRange(cellRow, cellColumn - 1);
var cellRight = sheet.getRange(cellRow, cellColumn + 1);
var cellLeftA1Notation = columns[cellColumn - 1] + cellRow;
var cellRightA1Notation = columns[cellColumn + 1] + cellRow;
  
var goodGradient = [0,0,0,0,0,0,0,0,0,0,"#43606f","#456b72","#487675","#4a8279","#4d8d7c","#4f987f","#52a483","#54af86","#57bb8a"];
var badGradient = [0,0,0,0,0,0,0,0,0,"#e06666","#d36165","#c55b63","#b85562","#aa4f60","#9d495e","#8f435d","#823d5b","#743759"];
var advanceColor = goodGradient[cellColumn];
var advanceColorRight = goodGradient[cellColumn + 1];
var revertColor = badGradient[cellColumn];
var revertColorLeft = badGradient[cellColumn - 1];

var stagedCell = sheet.getRange(cellRow, 3);
var jiraCell = sheet.getRange(cellRow, 4);
var itemCell = sheet.getRange(cellRow, 5);
var itemEngineer = sheet.getRange(cellRow, 6);
var itemWaitingOn = sheet.getRange(cellRow, 7);
var itemLast = sheet.getRange(cellRow, 8);
      
var researchColumn = 9;
var planColumn = 10;
var toDoColumn = planColumn + 1;
var inProgressColumn = planColumn + 2;
var r4rColumn = planColumn + 3;
var designColumn = planColumn + 4;
var qaColumn = planColumn + 5;
var acceptColumn = planColumn + 6;
var r4mColumn = planColumn + 7;
var mergedColumn = planColumn + 8;
var gaColumn = planColumn + 9;
var goalSelectColumn = planColumn + 10;
var goalSelect = sheet.getRange(cellRow, goalSelectColumn);
      
//var canProgress = (cellColumn >= planColumn && cellColumn < gaColumn);
//var canRevert = (cellColumn >= toDoColumn && cellColumn <= gaColumn);
      
var itemStart = sheet.getRange(cellRow, planColumn + 16);
var itemGoal = sheet.getRange(cellRow, planColumn + 17);
var itemCurrent = sheet.getRange(cellRow, planColumn + 18);
var itemBlocker = sheet.getRange(cellRow, planColumn + 19);
    
var markingGA = (cellColumn == gaColumn - 1);

var settings = spreadsheet.getSheetByName("Settings");
var designer = settings.getRange(5, 2).getValue();
var qaEngineer = settings.getRange(6, 2).getValue();
var product = settings.getRange(7, 2).getValue();
      
var syncTimeStampCell = sheet.getRange(1,16);
var db = spreadsheet.getSheetByName('db');
var currentWeek = db.getRange(1, 2);
var stagedForNewWeek = db.getRange(2, 2);
var now = new Date();

/*
NOTES:
"Light" gray is light gray 1
*/

function resetCell(zheet, row, column) {
  sheet = zheet;
  cell = sheet.getRange(row, column);
  cellColumn = column;
  cellRow = row;       
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

      // Set dependent variables to new sheet before executing setAsStart
//      sheet = newSheet;
//      itemStart = newSheet.getRange(r, planColumn + 16); 
//      itemCurrent = newSheet.getRange(r, planColumn + 18); 
//      itemCell = newSheet_item; 
//      jiraCell = newSheet_jira;
//      stagedCell = newSheet.getRange(r, 3);
//      itemWaitingOn = newSheet_atBat;
//      itemLast = newSheet.getRange(r, 8);
//      itemGoal = newSheet.getRange(r, planColumn + 17);
//      itemBlocker = newSheet.getRange(r, planColumn + 19);
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
  newValue.setStringValue("Last JIRA sync: " + timeNow(12)); 
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