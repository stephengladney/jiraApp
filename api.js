function getJIRA(card) {
  var jira = UrlFetchApp;
  var returnData = {};
  var call = jira.fetch("https://salesloft.atlassian.net/rest/api/2/issue/SL-" + card + "?fields=assignee,status,summary,created", 
//  var call = jira.fetch("https://salesloft.atlassian.net/rest/agile/1.0/issue/SL-" + card + "?fields=assignee,status,created,summary,epic", 
                            { headers: {
                              "Authorization": "Basic " + apiToken,
                              "header": "Accept: application/json"
                            }}               
                           );
  var response = JSON.parse((call.getContentText()));
  if (response.fields.assignee == null) { returnData.engineerEmail = "Unassigned" }
  else { returnData.engineerEmail = response.fields.assignee.emailAddress }

    returnData.currentColumn = response.fields.status.name;
    returnData.gaColumn = response.fields.status.statusCategory.name == "Done";
    returnData.age = dateDiff(reformatJIRADate(response.fields.created), now);
    returnData.title = response.fields.summary;
//    epic: response.fields.epic.name,
      return returnData;
}

function jiraToSheet(card) {
  
  switch(card.currentColumn) {
    case "Unassigned" :
      return toDoColumn;
      break;
    case "In Development" :
      return inProgressColumn;
      break;
    case "QA Remediation" :
      return inProgressColumn;
      break;
    case "Ready for Code Review" :
      return r4rColumn;
      break;
    case "Design Review" :
      return designColumn;
      break;
    case "Ready for QA" :
      return qaColumn;
      break;
    case "Ready for Acceptance" :
      return acceptColumn;
      break;
    case "Ready for Merge" :
      return r4mColumn;
      break;
    case "Merged" :
      return mergedColumn;
      break;
    default :
      if (card.gaColumn) { return gaColumn }
      else { Logger.log("Unrecognized column detected") }
  }
}

function syncTaskToJIRA(row) {
  var currentJIRA = sheet.getRange(row, findColumn("JIRA"));
  var jiraNumber = currentJIRA.getValue();
  var jiraData = getJIRA(jiraNumber);
  var currentItem = sheet.getRange(row, findColumn("Item"));
  var currentEpic = sheet.getRange(row, findColumn("EPIC"));
  var currentCurrent = sheet.getRange(row, findColumn("current"));
  var currentEngineer = sheet.getRange(row, findColumn("Engineer"));
  var engineerName = emailToEngineer(jiraData.engineerEmail);

  if (jiraData.title != currentItem.getValue()) { currentItem.setValue(jiraData.title) }
  if (engineerName != currentEngineer.getValue()) { currentEngineer.setValue(engineerName) }
  
  if (jiraData.age >= 7 && currentEpic.getValue() == "Customer Defect" && currentCurrent.getValue() != gaColumn) { 
    currentItem.setBackground("#ff0000").setFontColor("#ffffff").setNote("Aging Defect Warning: " + jiraData.age + " days");
    currentJIRA.setBackground("#ff0000").setFontColor("#ffffff");
  }

  var columnInSheet = sheet.getRange(row, findColumn("current")).getValue();
  var columnInJIRA = jiraToSheet(jiraData);
  var difference = columnInJIRA - columnInSheet;
  resetCell(sheet, row, columnInSheet);
  if (difference > 0) {
    Logger.log("SYNC: Advancing card " + jiraNumber + " (" + difference + ") steps");
    for (var i = 1; i <= difference; i++) {
      advance();
      resetCell(sheet, row, columnInSheet + i);
    }
  }
  else if (difference < 0) {
    difference*= -1
    Logger.log("SYNC: Reverting card " + jiraNumber + " (" + difference + ") steps");
    for (var i = 1; i <= difference; i++) {
      revert();
      resetCell(sheet, row, columnInSheet - i);
    }
  }
  else if (difference == 0) {
  }
}

function syncBoardToJIRA() {
//  var stagedForNewWeek = db.getRange(2, 2);
  var syncTimeStampCell = sheet.getRange(1,16);
  var syncingCell = sheet.getRange(1,11);
  var rowsToSync = [];
  var rowJIRA;
  sheet = spreadsheet.getSheetByName(currentWeek.getValue());
  for (var r = 5; r < 40; r++){
    rowJIRA = sheet.getRange(r, 4).getValue();
    if (sheet.getRange(r, 2).getValue() == "Command Line") { break }
    if (rowJIRA != "") { rowsToSync.push(r) }
  }
  rowsToSync.forEach(function(i, n) {
    syncTaskToJIRA(i);
    percent = Math.round(((n + 1) / rowsToSync.length) * 100); 
    syncingCell.setValue("Syncing: " + textStatusBar("[","|","]", 10, percent) + " " + percent + "%");
  });
  updateLastSync(syncTimeStampCell);
  syncingCell.setValue(null);
  updateStatusBar(currentWeekGoalAchievement());
}
