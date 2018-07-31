function getJIRA(card) {
  var jira = UrlFetchApp;
  var call = jira.fetch("https://salesloft.atlassian.net/rest/api/2/issue/SL-" + card + "?fields=assignee,status,created,summary,epic", 
//  var call = jira.fetch("https://salesloft.atlassian.net/rest/agile/1.0/issue/SL-" + card + "?fields=assignee,status,created,summary,epic", 
                            { headers: {
                              "Authorization": "Basic " + apiToken,
                              "header": "Accept: application/json"
                            }}               
                           );
  var response = JSON.parse((call.getContentText()));
  return {
    engineer: response.fields.assignee.displayName,
    currentColumn: response.fields.status.name,
    gaColumn: response.fields.status.statusCategory.name == "Done",
    age: response.fields.created,
    title: response.fields.summary,
//    epic: response.fields.epic.name,
    age: dateDiff(response.fields.created, now)
  }
}

function jiraToSheet(card) {
  switch(card.currentColumn) {
    case "Unassigned" :
      return toDoColumn;
      break;
    case "In Development" :
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
      return r4mColumns;
      break;
    case "Merged" :
      return mergedColumn;
      break;
    default :
      if (card.gaColumn) { return gaColumn }
      else { return null }
  }
}

function syncTaskToJIRA(row) {
  var columnInSheet = sheet.getRange(row, planColumn + 18).getValue();
  var jiraNumber = sheet.getRange(row, 5).getValue();
  var jiraData = getJIRA(jiraNumber);
  var columnInJIRA = jiraToSheet(jiraData);
  var difference = columnInJIRA - columnInSheet;
  resetCell(row, columnInSheet);
  if (difference > 0) {
    for (var i = 1; i <= difference; i++) {
      advance();
      resetCell(row, columnInSheet + i);
    }
  }
  else if (difference < 0) {
    difference*= -1
    for (var i = 1; i <= difference; i++) {
      revert();
      resetCell(row, columnInSheet - i);
    }
  }
  else if (difference == 0) {
  }
}

function syncBoardToJIRA() {
  var rowsToSync = [];
  var rowItem;
  for (var r = 5; r < 40; r++){
    rowItem = sheet.getRange(r, 6).getValue();
    if (sheet.getRange(r, 2).getValue() == "Notes") { break }
    if (rowItem != "") { rowsToSync.push(r) }
  }
  rowsToSync.forEach(function(i) {
    syncTaskToJIRA(i);
  });
}