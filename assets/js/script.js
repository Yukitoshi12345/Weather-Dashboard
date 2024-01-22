// Declared Variables
var currentDayEl = $('#currentDay');
var searchFormEl = document.querySelector('#search-section');
var searchButton = document.querySelector('#searchButton');


// Generated apiKey from openweatherAPI.com after creating an account
var baseURL = 'https://api.openweathermap.org';
var apiWeatherKey = 'eca2fe1873a9d22d6e99bc36262d9d3f';



function weatherToday(city) {
    var weatherTodayURL = `${baseURL}/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
  
    fetch(weatherTodayURL)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            $("#currentWeatherDetails").css("display", "block");
            $("#cityInformation").empty();
  
            var weatherIconID = data.weather[0].icon;
            var weatherIconImageURL = `${baseURL}/img/w/${weatherIconID}.png`;

            var weatherCityCurrent = $(`
                <h2 id="weatherCityCurrent">
                ${data.name} ${today} <img src="${weatherIconImageURL}" alt="${data.weather[0].description}" />
                </h2>
                <p>Temperature: ${data.main.temp} °C</p>
                <p>Humidity: ${data.main.humidity}\%</p>
                <p>Wind Speed: ${data.wind.speed} MPH</p>
            `);
            $("#cityInformation").append(weatherCityCurrent);

            // Run the Weather Forecast
            var lat = data.coord.lat;
            var lon = data.coord.lon;

            futureWeather(lat, lon);

        })
        //   Display error message to the user otherwise
        .catch(error => {
            console.error('Error fetching current weather: ', error);
            alert('Error fetching current weather data.');
        });


  }




// function forecastNext5Days(lat,lon) {
//     var forecastWeatherURL = `${baseURL}/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=current,minutely,hourly,alerts&appid=${apiWeatherKey}`;
//     fetch(forecastWeatherURL)
//     .then(function (response) {
//       return response.json();
//     })
//     .then(function (data) {
//       return displayForecast(data);
//     }) 
//     .catch(function(error) {
//         console.error('Error fetching forecast weather: ', error);
//         alert('Error fetching forecast weather data.');
//     });   
// };




