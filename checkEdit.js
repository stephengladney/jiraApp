function checkEdit() {
  // Ignore edits to sheets other than current
  if (sheet.getName() != currentWeek.getValue()) { return }
  var ui = app.getUi();
  
  var isCommandLine = sheet.getRange(cellRow - 1, cellColumn - 2).getValue() == "Command Line";
  
  // Command line
  if (isCommandLine) {
    var commandLineCell = cell
    var command = cell.getValue().toLowerCase();
    var validCommand = false;
    if (command == "") { return }
    
    // sync
    if (command == "sync") { 
      validCommand = true;
      cell.setValue("Syncing to JIRA...");
      syncBoardToJIRA();
    }
    
    // new
    if (command.substring(0,3) == "new") {
      var commitType = command.split(" ")[1];
      var commitData = command.split(" ")[2];
      var commitDataType;
      var errorMsg = "";
      if (commitData == Number(commitData)) { commitDataType = "jira" } else { commitDataType = "task" }
      switch (commitType) {
        case "monday" :
          break;
        case "added" :
          break;
        default:
          errorMsg = ": set [type] (must be 'monday' or 'added')";
          break;
      }

    }
    if (!validCommand) { commandLineCell.setValue("Invalid command" + errorMsg);
    } else {
    commandLineCell.setValue("");
    }
  }
  
  // Set START/BLOCKER/GOAL
  if (cell.getValue() == "START") { setAsStart() }
  if (cell.getValue() == "BLOCKER") { blocker() }
  if (cell.getValue() == "GOAL") { setAsGoal() }
  
  // Hyperlink manually entered JIRA + sync data
  if (cell.getColumn() == findColumn("JIRA") && cell.getFormula() == "" && String(cell.getValue()).length == 4 && !isCommandLine) { 
    var jira = cell.getValue();
    cell.setFormula('=HYPERLINK("https://salesloft.atlassian.net/browse/SL-' + jira + '", "' + jira + '")'); 
  }
  syncTaskToJIRA(cellRow);
}
