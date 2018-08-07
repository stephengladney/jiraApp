function whoAmI() {
  var ui = app.getUi();
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

function textStatusBar(left, char, right, units, percent) {
    var result = left;
    var numOfChars = Math.floor((percent / 100) * units);
    var numOfSpaces = Math.floor(((100 - percent) / 100) * units);
    for (var i = 1; i <= numOfChars; i++) {
        result+= char;
    }
    for (var i = 1; i <= numOfSpaces; i++) {
        result+= " ";
    }
    result+= right;
    return result;
}

function addedRow() {
  var cellCheck
    for (var r = 5; r < 40; r++) {
    cellCheck = sheet.getRange(r, 2).getValue();
    if (cellCheck == "ADDED") { return r }
    if (cellCheck == "Notes" ) { break }
  }
}