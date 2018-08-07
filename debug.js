function getColorAbove() {
  var ui = app.getUi();
  var howManyColors = Number(ui.prompt("How many colors?").getResponseText());
  for (var i = 0; i < howManyColors; i++) {
  sheet.getRange(cellRow, cellColumn + i).setValue("." + sheet.getRange(cellRow - 1, cellColumn + i).getBackground() + ".,");
  }
}

function newLayOut() {
  var max = db.getRange(3,2).getValue();
  var columnResults = [];
  for (var i = 1; i <= max; i++) {
    columnResults.push('"' + sheet.getRange(3, i).getValue() + '"');
  }
  var ui = app.getUi();
  ui.alert(columnResults);  

}
