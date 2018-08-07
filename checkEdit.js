function checkEdit() {
  var ui = app.getUi();
  // Ignore edits to sheets other than current
  if (sheet.getName() != currentWeek.getValue()) { return }
  
  // Set START/BLOCKER/GOAL
  if (cell.getValue() == "START") { setAsStart() }
  if (cell.getValue() == "BLOCKER") { blocker() }
  if (cell.getValue() == "GOAL") { setAsGoal() }
  
  // Hyperlink manually entered JIRA + sync data
  if (cell.getColumn() == findColumn("JIRA") && cell.getFormula() == "" && String(cell.getValue()).length == 4) { 
    var jira = cell.getValue();
    cell.setFormula('=HYPERLINK("https://salesloft.atlassian.net/browse/SL-' + jira + '", "' + jira + '")'); 
  }
  syncTaskToJIRA(cellRow);
}
