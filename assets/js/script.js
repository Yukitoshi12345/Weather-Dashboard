// Declared Variables
var currentDayEl = $('#currentDay');
var searchFormEl = document.querySelector('#search-form');

// Generated apiKey from openweatherAPI.com after creating an account
var apiWeatherKey = 'cbb0bb358215c29546dabe7a6b463f5f'

// This function is to get the real time
function displayTime() {
    var currentLocalTime = dayjs().format('dddd, MMM DD, YYYY hh:mm:ss a');
    currentDayEl.text(currentLocalTime);
  }


// To get current weather:
var currentWeatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiWeatherKey}`;

// To get weather icon:
var iconCode = response.weather[0].icon;
var weatherIconURL = `https://openweatherapp.org/img/w/${iconCode}.png`

// To get UV:
var uvURL = `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${apiWeatherKey}`

// To get the forecast for next 5 days:
var futureWeatherURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=current,minutely,hourly,alerts&appid=${apiWeatherKey}`

displayTime();
// 1000ms = 1 second. setInterval is always in ms.
setInterval(displayTime, 1000);