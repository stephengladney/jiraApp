function updateCurrentStateColors() {
  var cells = [itemCell, jiraCell, stagedCell];
  cells.forEach(function(cell) { cell.setFontColor(itemCurrentStateColor()) });
    
  if (itemGoal.getValue() != "" && itemCurrent.getValue() >= itemGoal.getValue()) {
    var itemGoalCell = sheet.getRange(cellRow, itemGoal.getValue());
    itemGoalCell.setBackground("#57bb8a").setFontColor("#ffffff"); 
  } else if (itemGoal.getValue() != "" && itemCurrent.getValue() < itemGoal.getValue()) {
    var itemGoalCell = sheet.getRange(cellRow, itemGoal.getValue());
    itemGoalCell.setBackground("#ffe599").setFontColor("#000000");
  }
  
  switch(itemWaitingOn.getValue()) {
    case "Cores Light":
      coresLightText(itemWaitingOn);
      break;
    default:
      itemWaitingOn.setFontColor(itemCurrentStateColor());
  }
}

function itemCurrentStateColor() {
  if (itemBlocker.getValue() == "" && itemCurrent.getValue() < itemGoal.getValue()) {
    return "#ffe599"
  }
  if (itemGoal.getValue() != "" && itemCurrent.getValue() >= itemGoal.getValue()) {
    return "#57bb8a"
  }
  if (itemBlocker.getValue() != "") {
    return "#e06666";
  }
}

