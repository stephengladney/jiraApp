function setItemGoal(goal) { itemGoal.setValue(goal) }
function setItemStart(start) { itemStart.setValue(start) }
function setItemCurrent(n) { itemCurrent.setValue(n) }
function setItemBlocker(n) { itemBlocker.setValue(n) }

function setAsGoal(cellToSet) { 
  if (!cellToSet) { cellToSet = cell }
  cellToSet
  .setBorder(true, true, true, true, false, false, "#efefef", app.BorderStyle.SOLID)
  .setBackground("#ffe599")
  .setValue("GOAL");
  setItemGoal(cellColumn);
  updateCurrentStateColors();
}

function unSetAsGoal() { 
  cell.setBorder(false, false, false, false, false, false, null, null);
  itemGoal.setValue(null);
}

function setAsStart(cellToSet) { 
  if (!cellToSet) { cellToSet = cell }
  cellToSet
  .setBorder(true, true, true, true, false, false, "#efefef", app.BorderStyle.SOLID)
  .setBackground("#4a86e8")
  .setFontColor("#ffffff")
  .setValue("START");
  setItemStart(cell.getColumn());
  setItemCurrent(cell.getColumn());
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
  setItemBlocker(cellColumn);
  updateLast("blocker");
}

function unSetAsBlocker () {
    cell
  .setBorder(true, true, true, true, false, false, "#351c75", app.BorderStyle.SOLID)
  .setBackground(advanceColor)
  .setValue(null);
  setItemBlocker(null);
  updateLast("unblock");
  itemCell.setFontColor("#f3f3f3");
  jiraCell.setFontColor("#f3f3f3");
}

function setAllGoals () {
  var rowsToSync = [];
  var rowItem;
  for (var r = 5; r < 40; r++){
    rowItem = sheet.getRange(r, 5).getValue();
    if (sheet.getRange(r, 2).getValue() == "Notes") { break }
    if (rowItem != "") { rowsToSync.push(r) }
  }
  rowsToSync.forEach(function(i) {
    goalSelect = sheet.getRange(i, goalSelectColumn);
    resetCell(sheet, i, columnNameToColumnNumber(goalSelect.getValue()));
    setAsGoal();        
  }
                    
                    );                  
}