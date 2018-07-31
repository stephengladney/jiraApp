function stepBack() {
  if (!isItemStart(cellLeft) && !isItemGoal(cellLeft) && !isItemBlocker(cellLeft)) { 
    cellLeft.setBackground(revertColorLeft);
  }
  if (!isItemStart(cell) && !isItemGoal(cell) && !isItemBlocker(cell) && cellRight.getBackground() == "#20124d") {
    cell.setBackground(revertColor);
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

//===========================================================================

function advance() {
  
  if (isItemBlocker(cell)) { 
  cell.setValue("");
  cell.setBorder(true, true, true, true, true, true, "#351c75", app.BorderStyle.SOLID);
  }
    
    setItemCurrent(cellColumn + 1);
    assignWaitingOn(cellRight);
    updateCurrentStateColors();
    if (!markingGA) { updateLast("advance") }
    else if (markingGA) {updateLast("GA") }
    if (cellColumn == toDoColumn && itemEngineer.getValue() == "") { ui.alert("(╯°□°）╯ Y U NO SPECIFY ENGINEER?", "I even made it a nice dropdown for you...", ui.ButtonSet.OK); }
    stepForward(); 
}

function blocker() {
  if (isItemBlocker(cell)) {
    unSetAsBlocker();
  return 
  }
  
  if (isItemGoal(cell) || isItemStart(cell)) { 
    var choice = ui.alert("Choose wisely...", "Do you want to override the goal label with the blocker label visually? (The sheet will still know the goal)",ui.ButtonSet.YES_NO_CANCEL);
    switch(choice) {
      case ui.Button.YES:
        setAsBlocker();
        return;
        break;
      case ui.Button.NO:
        updateLast("blocker");
        setItemBlocker(cellColumn);
        return;
        break;
      case ui.Button.CANCEL:
        return;
    }
}
  setAsBlocker();
  updateCurrentStateColors();
  updateLast("blocker");
}

function revert() {
  
  setItemCurrent(cellColumn - 1);
  assignWaitingOn(cellLeft);
  updateCurrentStateColors();
  updateLast("revert");
  stepBack();

}