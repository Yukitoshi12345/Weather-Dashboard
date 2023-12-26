var currentDayEl = $('#currentDay');

// This function is to get the real time
function displayTime() {
    var currentLocalTime = dayjs().format('dddd, MMM DD, YYYY hh:mm:ss a');
    currentDayEl.text(currentLocalTime);
  }

displayTime();
// 1000ms = 1 second. setInterval is always in ms.
setInterval(displayTime, 1000);