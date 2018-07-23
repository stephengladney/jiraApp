function setItemGoal(goal) { itemGoal.setValue(goal) }
function setItemStart(start) { itemStart.setValue(start) }
function setItemCurrent(n) { itemCurrent.setValue(n) }
function setItemBlocker(n) { itemBlocker.setValue(n) }

function setAsGoal() { 
  cell
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
  setItemStart(cellToSet.getColumn());
  setItemCurrent(cellToSet.getColumn());
  Logger.log(cellToSet.getColumn());
  updateLast("start");
  assignWaitingOn(cellToSet);
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
  .setFontColor("#ffffff")
  .setValue(null);
  setItemBlocker(null);
  updateLast("unblock");
}