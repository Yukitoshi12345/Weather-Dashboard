// Declared Variablescd 
var searchFormEl = document.querySelector('#search-section');
var searchButton = document.querySelector('#searchButton');


// Generated apiKey from openweatherAPI.com after creating an account
var baseURL = 'https://api.openweathermap.org';
var metric = `units=metric`;
var apiWeatherKey = 'eca2fe1873a9d22d6e99bc36262d9d3f';


// Function to fetch and display current weather for a given city
function weatherToday(city) {
    // Calling an openWeatherMap API request on a variable
    var weatherTodayURL = `${baseURL}/data/2.5/weather?q=${city}&appid=${apiWeatherKey}&${metric}`;
    
    // Fetching current weather data using fetch API
    fetch(weatherTodayURL)
        .then(response => response.json())  //Parsing the response as JSON 
        .then(data => {
            // Logging on console
            console.log(data);

            // Clearing any previous content in the city information container
            $("#cityInformation").empty();
            // Show the weather details container
            $("#currentWeatherDetails").css("display", "block");
 
            // Extracting the weather icon code from the response
            var weatherIconID = data.weather[0].icon;

            // Calling weather icon image URL on a variable
            var weatherIconImageURL = `${baseURL}/img/w/${weatherIconID}.png`;

            // HTML content for city's current weather information
            var weatherCityCurrent = $(`
                <h2 id="weatherCityCurrent">
                ${data.name} ` + dayjs().format(`DD/MM/YYYY`) + ` <img src="${weatherIconImageURL}" alt="${data.weather[0].description}" />
                </h2>
                <p>Temperature: ${data.main.temp} °C</p>
                <p>Wind: ${data.wind.speed} MPH</p>
                <p>Humidity: ${data.main.humidity}\%</p>
                
            `);
            // Appending the current city weather to the city information container 
            $("#cityInformation").append(weatherCityCurrent);

            // Extracting latitude and longitude
            var latitude = data.coord.lat;
            var longitude = data.coord.lon;

            // running the weather forecast function that has been created later down the javascript code
            forecastNext5Days(latitude, longitude);

        })
        // Display error message to the user otherwise
        .catch(error => {
            console.error('Error fetching current weather: ', error);
            alert('Error fetching current weather data.');
        });
}


function forecastNext5Days(latitude,longitude) {
    var forecastWeatherURL = `${baseURL}/data/2.5/onecall?lat=${latitude}&lon=${longitude}&appid=${apiWeatherKey}&${metric}`;
    
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


