function whoAmI() {
  ui.alert(sheet.getSheetId());
}

function dateNow() {
  var today  = new Date(),
      day = today.getDate(),
      m = today.getMonth() + 1;

  return String(m + "/" + day) 
}


function weekdayNow() {
  var today = new Date(),
      day = today.getDay(),
      days = ["Sun", "Mon", "Tue", "Wed", "Thurs", "Fri", "Sat"];

  return days[day];
}

function reformatJIRADate(str) {
  return new Date(str.substring(0,4), Number(str.substring(5,7)) - 1, str.substring(8,10), str.substring(11,13), str.substring(14,16));
}

function dateDiff(first, second) {
    return Math.round((second - first)/(1000*60*60*24));
}

function checkTime(i) { if (i < 10) { return "0" + i } else { return i } }
function standardizeHour(i) { if (i == 0) { return 12 } else if (i > 12) { return i - 12 } else { return i } }
function amPm(i) { if (i < 12) { return 'AM' } else { return 'PM' } }

function timeNow(format/* 12 (standard) || 24 (military) */) {
  var today = new Date();
  var h = today.getHours();
  var m = today.getMinutes();
  return standardizeHour(h) + ':' + checkTime(m) + ' ' + amPm(h) 
}

function columnNameToColumnNumber(name) {
  switch(name) {
    case "RSRCH" :
      return researchColumn;
      break;
    case "PLAN" :
      return planColumn;
      break;
    case "TO DO" :
      return toDoColumn;
      break;
    case "IN PROG" :
      return inProgressColumn;
      break;
    case "R4R" :
      return r4rColumn;
      break;
    case "DESIGN" :
      return designColumn;
      break;
    case "QA" :
      return qaColumn;
      break;
    case "ACCT" :
      return acceptColumn;
      break;
    case "R4M" :
      return r4mColumn;
      break;
    case "MRGD" :
      return mergedColumn;
      break;
    case "GA" :
      return gaColumn;
      break;
    default:
      return gaColumn;
  }
}