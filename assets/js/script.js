// Generated apiKey from openweatherAPI.com after creating an account
var baseURL = 'https://api.openweathermap.org';
var metric = `units=metric`;
var apiWeatherKey = '24716f334fbb25fbc76f035aa23a8fa8';


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
                <h3 id="weatherCityCurrent">
                ${data.name} ` + dayjs().format(`DD/MM/YYYY`) + ` <img src="${weatherIconImageURL}" alt="${data.weather[0].description}" />
                </h3>
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
            forecastNext4Days(latitude, longitude);

        })
        // Display error message to the user otherwise
        .catch(error => {
            console.error('Error fetching current weather: ', error);
            alert('Error fetching current weather data.');
        });
}


function forecastNext4Days(latitude,longitude) {
    var forecastWeatherURL = `${baseURL}/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiWeatherKey}&${metric}`;
    
    fetch(forecastWeatherURL)
        .then(response => response.json())
        .then(dataFutureWeather => {
            console.log(dataFutureWeather);
            $("#forecastInformation").empty();
            // i = 1 shows todays weather. Want to see from tomorrows weather.
            for (let i = 2; i <= 5; i++) {
                // check api. Theres only up to i = 39 without *8.
                // Multiply 8 because dt_txt goes every 3 hours and there are 24 hours in a day.
                var index = i*8;
                var cityWeatherInformation = {
                    date: dataFutureWeather.list[index-1].dt_txt,
                    humidity: dataFutureWeather.list[index-1].main.humidity,
                    icon: dataFutureWeather.list[index-1].weather[0].icon,
                    temperature: dataFutureWeather.list[index-1].main.temp,
                    wind: dataFutureWeather.list[index-1].wind.speed
                };
                
                // Logging on console
                console.log(cityWeatherInformation);

                var IconForWeatherURL = `<img src="${baseURL}/img/w/${cityWeatherInformation.icon}.png" alt="${dataFutureWeather.list[index-1].weather[0].main}" />`;
                var currentDate = dayjs(cityWeatherInformation.date).format('DD/MM/YYYY');

        
                // Display weather forecast for the next five days
                // Future weather information includes weather icon, temperature, wind speed, and humidity
                var futureWeatherCard = $(`
                    <div class="pl-3">
                        <div class="card pl-3 pt-3 mb-3 bg" style="width: 12rem;>
                            <div class="card-body">
                                <h5>${currentDate}</h5>
                                <p>${IconForWeatherURL}</p>
                                <p>Temperature: ${cityWeatherInformation.temperature} °C</p>
                                <p> Wind: ${cityWeatherInformation.wind} m/s</p>
                                <p>Humidity: ${cityWeatherInformation.humidity}\%</p>
                            </div>
                        </div>
                    <div>
`);
                $("#forecastInformation").append(futureWeatherCard);
            }
        })

        // Display error message to the user otherwise
        .catch(error => {
            console.error('Error fetching future weather: ', error);
            alert('Error fetching future weather data.');
        });
}



