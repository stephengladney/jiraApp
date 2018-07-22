function getColorAbove() {
  var howManyColors = Number(ui.prompt("How many colors?").getResponseText());
  for (var i = 0; i < howManyColors; i++) {
  sheet.getRange(cellRow, cellColumn + i).setValue("." + sheet.getRange(cellRow - 1, cellColumn + i).getBackground() + ".,");
  }
}