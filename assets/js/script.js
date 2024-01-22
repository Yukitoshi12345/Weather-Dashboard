// Declared Variables
var currentDayEl = $('#currentDay');
var searchFormEl = document.querySelector('#search-section');
var searchButton = document.querySelector('#searchButton');


// Generated apiKey from openweatherAPI.com after creating an account
var baseURL = 'https://api.openweathermap.org';
var metric = `units=metric`;
var apiWeatherKey = 'eca2fe1873a9d22d6e99bc36262d9d3f';



function weatherToday(city) {
    var weatherTodayURL = `${baseURL}/data/2.5/weather?q=tokyo&${metric}&appid=${apiWeatherKey}`;
  
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
                <p>Wind: ${data.wind.speed} MPH</p>
                <p>Humidity: ${data.main.humidity}\%</p>
                
            `);
            $("#cityInformation").append(weatherCityCurrent);

            // Run the Weather Forecast
            var latitude = data.coord.lat;
            var longitude = data.coord.lon;

            forecastNext5Days(latitude, longitude);

        })
        //   Display error message to the user otherwise
        .catch(error => {
            console.error('Error fetching current weather: ', error);
            alert('Error fetching current weather data.');
        });
}


function forecastNext5Days(latitude,longitude) {
    var forecastWeatherURL = `${baseURL}/data/2.5/onecall?lat=${latitude}&lon=${longitude}&${metric}&appid=${apiWeatherKey}`;
    
    fetch(forecastWeatherURL)
        .then(response => response.json())
        .then(dataFutureWeather => {
            console.log(dataFutureWeather);
            $("#forecastInformation").empty();
        })


        //   Display error message to the user otherwise
        .catch(error => {
            console.error('Error fetching future weather: ', error);
            alert('Error fetching future weather data.');
        });
}


