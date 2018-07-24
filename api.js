function getJIRA(card) {
  var jira = UrlFetchApp;
  var call = jira.fetch("https://salesloft.atlassian.net/rest/agile/1.0/issue/SL-" + card + "?fields=assignee,status,created,summary,epic", 
                            { headers: {
                              "Authorization": "Basic " + apiToken,
                              "header": "Accept: application/json"
                            }}               
                           );
  var response = JSON.parse((call.getContentText()));

  return {
    engineer: response.fields.assignee.displayName,
    currentColumn: response.fields.status.statusCategory.name,
    age: response.fields.created,
    title: response.fields.summary,
    epic: response.fields.epic.name    
  }
}