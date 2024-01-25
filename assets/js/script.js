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
            if (!data.name) {
                // City doesn't exist, show alert and exit
                alert("We couldn't find that city. Please try entering a valid city name.");
                return false;
              }
            // Logging on console
            console.log(data);

            // Clearing any previous content in the city information container
            $("#cityInformation").empty();
           
            // Display current weather details
            $("#currentWeatherDetails").addClass("show");
 
            // Extracting the weather icon code from the response
            var weatherIconID = data.weather[0].icon;

            // Calling weather icon image URL on a variable
            var weatherIconImageURL = `${baseURL}/img/w/${weatherIconID}.png`;

            // HTML content for city's current weather information
            var weatherCityCurrent = $(`
                <h3 id="weatherCityCurrent">
                ${data.name} ` + dayjs().format(`DD/MM/YYYY`) + ` <img src="${weatherIconImageURL}" alt="${data.weather[0].description}" />
                </h3>
                <p>Temperature: ${data.main.temp.toFixed(1)} °C</p>
                <p>Wind: ${(data.wind.speed*3.6).toFixed(1)} km/hr</p>
                <p>Humidity: ${data.main.humidity}\%</p>
                
            `);
            // Appending the current city weather to the city information container 
            $("#cityInformation").append(weatherCityCurrent);

            // Extracting latitude and longitude
            var latitude = data.coord.lat;
            var longitude = data.coord.lon;

            // running the weather forecast function that has been created later down the javascript code
            forecast5Days(latitude, longitude);

        })
        // Display error message to the user otherwise
        .catch(error => {
            console.error('Failed to fetch current weather data: ', error);
            alert("We were unable to display the current weather right now.");
        });
}

// Function to fetch and display 5-day weather forecast for given latitude and longitude
function forecast5Days(latitude,longitude) {
    // Calling an openWeatherMap API request on a variable
    var forecastWeatherURL = `${baseURL}/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiWeatherKey}&${metric}`;
    
    // Fetching 5-day weather forecast data using fetch API
    fetch(forecastWeatherURL)
        .then(response => response.json())
        .then(dataFutureWeather => {
            console.log(dataFutureWeather);

            // Clearing any previous content in the forecast information container
            $("#forecastInformation").empty();

            // i = 1 shows todays weather. Want to see from tomorrows weather.
            // Looping through 5-day weather forecast data 
            for (let i = 1; i <= 5; i++) {
                // check API. Theres only up to i = 39 without *8.
                // Multiply 8 because dt_txt goes every 3 hours and there are 24 hours in a day.
                var index = i*8;

                // Created an object to store relevant weather information for the next 5 days
                var cityWeatherInformation = {
                    date: dataFutureWeather.list[index-1].dt_txt,
                    humidity: dataFutureWeather.list[index-1].main.humidity,
                    icon: dataFutureWeather.list[index-1].weather[0].icon,
                    temperature: dataFutureWeather.list[index-1].main.temp,
                    wind: dataFutureWeather.list[index-1].wind.speed
                };
                
                // Logging on console for debugging
                console.log(cityWeatherInformation);

                // Function to fetch and display image URL for given weather icon
                var IconForWeatherURL = `<img src="${baseURL}/img/w/${cityWeatherInformation.icon}.png" alt="${dataFutureWeather.list[index-1].weather[0].main}" />`;

                // Formatting the date for the display
                var currentDate = dayjs(cityWeatherInformation.date).format('DD/MM/YYYY');

        
                // Create the HTML structure for the forecast card [Need edit]
                var upcomingForecastCard = $(`
                    <div class="pl-3">
                        <div class="card pl-3 pt-3 mb-3 bg" style="width: 15rem;>
                            <div class="card-body">
                                <h5>${currentDate}</h5>
                                <p>${IconForWeatherURL}</p>
                                <p>Temperature: ${cityWeatherInformation.temperature.toFixed(1)} °C</p>
                                <p> Wind: ${(cityWeatherInformation.wind*3.6).toFixed(1)} km/hr</p>
                                <p>Humidity: ${cityWeatherInformation.humidity}\%</p>
                            </div>
                        </div>
                    <div>
`);
                $("#forecastInformation").append(upcomingForecastCard);
            }
        })

        // Display error message to the user otherwise
        .catch(error => {
            console.error('Failed to fetch forecast data ', error);
            alert("We were unable to display the forecast right now.");
        });
}

function createHistoryListItem(city) {
    var listItem = document.createElement('li');
    listItem.classList.add('list-group-item', 'city-item');
    listItem.textContent = city;
    listItem.onclick = () => weatherToday(city);
    return listItem;
}

// Get saved search history from localStorage on page load
var savedHistory = localStorage.getItem("city");
searchHistoryList = JSON.parse(savedHistory) || [];

// Display the saved history initially
displaySearchHistory();


// Event listener for search button
$("#searchButton").on("click", event => {
    event.preventDefault();
  
    var city = $("#citySearch").val();
  
    // Capitalize the first letter and make the rest lowercase
    city = city.charAt(0).toUpperCase() + city.slice(1).toLowerCase();
  
    weatherToday(city);
  
    // Check for duplicates and add to history with proper capitalisation
    var normalisedCity = city.toLowerCase(); // Store a normalised version for comparison
    if (!searchHistoryList.some(item => item.toLowerCase() === normalisedCity)) {
      searchHistoryList.unshift(city); // Add to the beginning with capitalisation
        if (searchHistoryList.length > 10) {
        searchHistoryList.pop(); // Remove the oldest if list is full
        }
        localStorage.setItem("city", JSON.stringify(searchHistoryList));
        displaySearchHistory();
    } else {
        console.log("City already in history (normalised):", normalisedCity);
    }
  
    $("#citySearch").val(""); // Clear the input field
});

// Event listener for clear history button
$("#clearHistoryButton").on("click", () => {
    searchHistoryList = []; // Clear the search history array
    localStorage.removeItem("city"); // Remove the history from localStorage
    displaySearchHistory(); // Update the UI to reflect the cleared list
});

// Event listener for Enter key press in search input
$("#citySearch").on("keydown", event => {
    if (event.keyCode === 13) {
    event.preventDefault();
    
    // Reuse the same logic from the search button click
    $("#searchButton").click();
    }
});

// Function to display search history 
function displaySearchHistory() {
    var historyList = $("#recentSearches");
    historyList.empty();

    searchHistoryList.forEach(city => {
    var listItem = createHistoryListItem(city);
    historyList.append(listItem); // Append in normal order (reversed in data)
    });
}