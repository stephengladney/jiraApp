var app = SpreadsheetApp;
var active = app.getActive();
var ui = app.getUi();
    
var spreadsheet = app.getActiveSpreadsheet();
var sheet = spreadsheet.getActiveSheet();
var cell = sheet.getActiveCell();
var cellColumn = cell.getColumn();
var cellRow = cell.getRow();

var settings = spreadsheet.getSheetByName("Settings");
var designer = settings.getRange(5, 2).getValue();
var qaEngineer = settings.getRange(6, 2).getValue();
var productManager = settings.getRange(7, 2).getValue();
    
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

var stagedCell = sheet.getRange(cellRow, 4);
var jiraCell = sheet.getRange(cellRow, 5);
var itemCell = sheet.getRange(cellRow, 6);
var itemEngineer = sheet.getRange(cellRow, 7);
var itemWaitingOn = sheet.getRange(cellRow, 8);
var itemLast = sheet.getRange(cellRow, 9);
      
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
      
var canProgress = (cellColumn >= planColumn && cellColumn < gaColumn);
var canRevert = (cellColumn >= toDoColumn && cellColumn <= gaColumn);
      
var itemStart = sheet.getRange(cellRow, planColumn + 16);
var itemGoal = sheet.getRange(cellRow, planColumn + 17);
var itemCurrent = sheet.getRange(cellRow, planColumn + 18);
var itemBlocker = sheet.getRange(cellRow, planColumn + 19);
    
var markingGA = (cellColumn == gaColumn - 1);
      
var db = spreadsheet.getSheetByName('db');
var currentWeek = db.getRange(1, 2);
var stagedForNewWeek = db.getRange(2, 2);

/*
NOTES:
"Light" gray is light gray 1
*/

function isItemStart(cell) { return (cell.getColumn() == itemStart.getValue()) }
function isItemGoal(cell) { return (cell.getColumn() == itemGoal.getValue()) }
function isItemBlocker(cell) { return (cell.getColumn() == itemBlocker.getValue()) }
  
// ASSIGN OWNER BASED ON COLUMN

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
  itemWaitingOn.setValue(pro);
  break;
    case gaColumn:
  itemWaitingOn.setValue(null)
  break;
    default:
      itemWaitingOn.setValue("Cores Light");
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
  ui.alert("change reference to sheet called db");
  return;
  //
  if (stagedForNewWeek.getValue() == false) {
  var rowsToTransfer = [];  
  for (var r = 5; r < 20; r++){
    if (sheet.getRange(r, 6).getValue() == "") { break; }
    var itemCurrentPosition = sheet.getRange(r, 28).getValue();
    var itemGoal = sheet.getRange(r, 27).getValue();
    if (itemCurrentPosition < itemGoal) {
      rowsToTransfer.push({"values": [{"userEnteredValue": {"boolValue": true}}]});
    }
    else { 
      rowsToTransfer.push({"values": [{"userEnteredValue": {"boolValue": false}}]}); }    
  }  
    var resource = {"requests": [
      {
        "repeatCell": {
          "cell": {"dataValidation": {"condition": {"type": "BOOLEAN"}}},
          "range": {"sheetId": sheet.getSheetId(), "startRowIndex": 4, "endRowIndex": r - 1, "startColumnIndex": 3, "endColumnIndex": 4},
          "fields": "dataValidation"
        }
      }
      ,
      {
        "updateCells": {
          "rows": rowsToTransfer,
          "start": {"rowIndex": 4, "columnIndex": 3, "sheetId": sheet.getSheetId()},
          "fields": "userEnteredValue"
        }
      }
    ]};
    
    sheet.showColumns(4);
    ui.alert("A wild column appears!", "Check those you wish to roll over to next week. Items that are not at goal have been checked for you. When you are ready to create the new sheet, hit the New week command again.", ui.ButtonSet.OK);
    stagedForNewWeek.setValue(true);
  }
  else {
       var resource = {"requests": [
         {
           "duplicateSheet": {
             "sourceSheetId": 506422022,
             "insertSheetIndex": 0,
             "newSheetName": dateNow()
           }
         }
       ]
                      }
       }
      Sheets.Spreadsheets.batchUpdate(resource, active.getId());
}
         

// MISC FUNCTIONS

function whoAmI() {
  ui.alert(sheet.getSheetId());
}

function dateNow() {
  var today  = new Date(),
      day = today.getDate(),
      m = today.getMonth() + 1;
  return String(m + "/" + day);
}


function weekdayNow() {
  var today = new Date(),
      day = today.getDay(),
      days = ["Sun", "Mon", "Tue", "Wed", "Thurs", "Fri", "Sat"];

  return days[day];
}

// CORES LIGHT FORMATTING

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