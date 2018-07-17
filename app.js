var app = SpreadsheetApp,
    active = app.getActive(),
    ui = app.getUi(),
    spreadsheet = app.getActiveSpreadsheet(),
    sheet = spreadsheet.getActiveSheet(),
    cell = sheet.getActiveCell(),
    cellColumn = cell.getColumn(),
    cellRow = cell.getRow(),
    columns = [0,"A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"],
    goodGradient = [0,0,0,0,0,0,0,0,0,0,"#43606f","#456b72","#487675","#4a8279","#4d8d7c","#4f987f","#52a483","#54af86","#57bb8a"],
    badGradient = [0,0,0,0,0,0,0,0,0,"#e06666","#d36165","#c55b63","#b85562","#aa4f60","#9d495e","#8f435d","#823d5b","#743759"],
    cellLeft = sheet.getRange(cellRow, cellColumn - 1),
    cellRight = sheet.getRange(cellRow, cellColumn + 1),
    cellLeftA1Notation = columns[cellColumn - 1] + cellRow,
    cellRightA1Notation = columns[cellColumn + 1] + cellRow,
    stagedCell = sheet.getRange(cellRow, 4),
    jiraCell = sheet.getRange(cellRow, 5),
    itemCell = sheet.getRange(cellRow, 6),
    itemEngineer = sheet.getRange(cellRow, 7),
    itemWaitingOn = sheet.getRange(cellRow, 8),
    itemLast = sheet.getRange(cellRow, 9),
    planColumn = 10,
    toDoColumn = planColumn + 1,
    inProgressColumn = planColumn + 2,
    r4rColumn = planColumn + 3,
    designColumn = planColumn + 4,
    qaColumn = planColumn + 5,
    acceptColumn = planColumn + 6,
    r4mColumn = planColumn + 7,
    mergedColumn = planColumn + 8,
    gaColumn = planColumn + 9,
    canProgress = (cellColumn >= planColumn && cellColumn < gaColumn),
    canRevert = (cellColumn >= toDoColumn && cellColumn <= gaColumn),
    itemStart = sheet.getRange(cellRow, planColumn + 16),
    itemGoal = sheet.getRange(cellRow, planColumn + 17),
    itemCurrent = sheet.getRange(cellRow, planColumn + 18),
    itemBlocker = sheet.getRange(cellRow, planColumn + 19),
    advanceColor = goodGradient[cellColumn],
    advanceColorRight = goodGradient[cellColumn + 1],
    revertColor = badGradient[cellColumn],
    revertColorLeft = badGradient[cellColumn - 1],
    markingGA = (cellColumn == gaColumn - 1),
    stagedForNewWeek = sheet.getRange(3, 32);

/*

NOTES:
"Light" gray is light gray 1

*/

// SET & CHECKIF ITEM START/GOAL

function setItemGoal(goal) { itemGoal.setValue(goal) }
function setItemStart(start) { itemStart.setValue(start) }
function setItemCurrent(n) { itemCurrent.setValue(n) }


function isItemStart(cell) { return (cell.getColumn() == itemStart.getValue()) }
function isItemGoal(cell) { return (cell.getColumn() == itemGoal.getValue()) }
function isItemBlocker(cell) { return (cell.getColumn() == itemBlocker.getValue()) }
  
// SET ITEM & JIRA CELLS TEXT COLOR

function updateCurrentStateColors() {
  var cells = [itemCell, jiraCell, stagedCell];
  cells.forEach(function(cell) { cell.setFontColor(itemCurrentStateColor()) });
    
  if (itemGoal.getValue() != "" && itemCurrent.getValue() >= itemGoal.getValue()) {
    var itemGoalCell = sheet.getRange(cellRow, itemGoal.getValue());
    itemGoalCell.setBackground("#57bb8a").setFontColor("#ffffff"); 
  } else if (itemGoal.getValue() != "" && itemCurrent.getValue() < itemGoal.getValue()) {
    var itemGoalCell = sheet.getRange(cellRow, itemGoal.getValue());
    itemGoalCell.setBackground("#ffe599").setFontColor("#000000");
  }
  
  switch(itemWaitingOn.getValue()) {
    case "Cores Light":
      coresLightText(itemWaitingOn);
      break;
    default:
      itemWaitingOn.setFontColor(itemCurrentStateColor());
  }
}

function itemCurrentStateColor() {
  if (itemBlocker.getValue() == "" && itemCurrent.getValue() < itemGoal.getValue()) {
    return "#ffe599"
  }
  if (itemCurrent.getValue() >= itemGoal.getValue()) {
    return "#57bb8a"
  }
  if (itemBlocker.getValue() != "") {
    return "#e06666";
  }
}
  

// SET SELECTED CELL TO START/GOAL

function setAsGoal() { 
  cell
  .setBorder(true, true, true, true, false, false, "#efefef", app.BorderStyle.SOLID)
  .setBackground("#ffe599")
  .setValue("GOAL");
  setItemGoal(cellColumn);
  updateCurrentStateColors();
}

function setAsStart() { 
  cell
  .setBorder(true, true, true, true, false, false, "#efefef", app.BorderStyle.SOLID)
  .setBackground("#4a86e8")
  .setFontColor("#ffffff")
  .setValue("START");
  setItemStart(cellColumn);
  setItemCurrent(cellColumn);
  updateLast("start");
  assignWaitingOn(cell);
  updateCurrentStateColors();
}

function setAsBlocker() {
  cell
  .setBorder(true, true, true, true, false, false, "#efefef", app.BorderStyle.SOLID)
  .setBackground("#ff0000")
  .setFontColor("#ffffff")
  .setValue("BLOCKER");
  setItemCurrent(cellColumn);
  itemBlocker.setValue(cellColumn);
}


// SET ITEM CURRENT POSITION



function unSetAsGoal() { 
  cell.setBorder(false, false, false, false, false, false, null, null);
  itemGoal.setValue(null);
}

// STEP - MOVE TO NEXT/PREVIOUS CELL AND MODIFY

function stepBack() {
  
  if (!isItemStart(cellLeft) && !isItemGoal(cellLeft) && !isItemBlocker(cellLeft)) { 
    cellLeft.setBackground(revertColorLeft);
  }
  sheet.setActiveSelection(cellLeftA1Notation);
}

function stepForward() {
  if (isItemBlocker(cell) ) { cell.setValue(null) }
  if (cell.getBackground() != advanceColor && !isItemStart(cell) && !isItemGoal(cell)) { cell.setBackground(advanceColor) }
  
  if (!isItemGoal(cellRight) && !isItemBlocker(cellRight)) {  
    cellRight.setBackground(advanceColorRight);
  }
  
  sheet.setActiveSelection(cellRightA1Notation);
}

// ASSIGN OWNER BASED ON COLUMN

function assignWaitingOn(cell) {
  switch(cell.getColumn()) {
    case inProgressColumn:
  itemWaitingOn.setValue(itemEngineer.getValue());
  break;
    case designColumn:
  itemWaitingOn.setValue("Solomon");
  break;
    case qaColumn:
  itemWaitingOn.setValue("Ron");
  break;
    case acceptColumn:
  itemWaitingOn.setValue("Gladney");
  break;
    case gaColumn:
  itemWaitingOn.setValue(null)
  break;
    default:
      itemWaitingOn.setValue("Cores Light");
  }
}

// ADVANCE, REVERT, AND BLOCKER

function advance() {
  
  if (isItemBlocker(cell)) { 
  itemBlocker.setValue(null);
  cell.setValue("");
  cell.setBorder(true, true, true, true, true, true, "#351c75", app.BorderStyle.SOLID);
  }
  
  if (canProgress) { 
    
    setItemCurrent(cellColumn + 1);
    assignWaitingOn(cellRight);
    updateCurrentStateColors();
    if (!markingGA) { updateLast("advance") }
    else if (markingGA) {updateLast("GA") }
    if (cellColumn == toDoColumn && itemEngineer.getValue() == "") { ui.alert("(╯°□°）╯ Y U NO SPECIFY ENGINEER?", "I even made it a nice dropdown for you...", ui.ButtonSet.OK); }
    stepForward(); 
  }
//  else if (markingGA) {
//    itemCurrent.setValue(cellColumn);
//    itemWaitingOn.setValue(null);
//    updateCurrentStateColors();
//    cell.setBackground(advanceColor);
//    updateLast("GA");
//    }
}

function blocker() {
  if (isItemGoal(cell) || isItemStart(cell)) { 
    var choice = ui.alert("Choose wisely...", "Do you want to override the goal label with the blocker label visually? (The sheet will still know the goal)",ui.ButtonSet.YES_NO_CANCEL);
    switch(choice) {
      case ui.Button.YES:
        setAsBlocker();
//        setItemCurrent(cellColumn - 1);
        updateLast("blocker");
//        assignWaitingOn(cellLeft);
//        stepBack();
        return;
        break;
      case ui.Button.NO:
        updateLast("blocker");
//        assignWaitingOn(cellLeft);
//        stepBack();
        itemBlocker.setValue(cellColumn);
        return;
        break;
      case ui.Button.CANCEL:
        return;
    }
}
  setAsBlocker();
//  setItemCurrent(cellColumn - 1);
  updateCurrentStateColors();
  updateLast("blocker");
//  assignWaitingOn(cellLeft);
//  stepBack();
}

function revert() {
  
  if (canRevert) {

  setItemCurrent(cellColumn - 1);
  assignWaitingOn(cellLeft);
  updateCurrentStateColors();
  updateLast("revert");
  stepBack();
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

// DEBUGGING/TESTING STUFF

function getColorAbove() {
  var howManyColors = Number(ui.prompt("How many colors?").getResponseText());
  for (var i = 0; i < howManyColors; i++) {
  sheet.getRange(cellRow, cellColumn + i).setValue("." + sheet.getRange(cellRow - 1, cellColumn + i).getBackground() + ".,");
  }
}