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
        // Parsing the response as JSON to make it useable in JavaScript
        .then(response => response.json())  
        .then(data => {
            // If city doesn't exist:
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
            // toFixed(1) is a way of rounding to nearest 1 decimal place
            // wind speed is calculated in m/s, so to change to km/hr, multiply by 3.6
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

            // Running the weather forecast function that has been created later down the javascript code
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
        //Parsing the response as JSON to make it useable in JavaScript
        .then(response => response.json())
        // Handle the parsed JSON data containing forecast weather information
        .then(dataFutureWeather => {
            // Log the received forecast weather data to the console for debugging
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

        
                // Create the HTML structure for the forecast card
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
                // Appending the future weather to the forecast information container
                $("#forecastInformation").append(upcomingForecastCard);
            };
        })


        // Display error message to the user otherwise
        .catch(error => {
            console.error('Failed to fetch forecast data ', error);
            alert("We were unable to display the forecast right now.");
        });
};

// Function to create a list item for a city in the search history
function createHistoryListItem(city) {

    // Create a new list item element
    var listItem = document.createElement('li');
    
    // Add CSS classes to style the list item
    listItem.classList.add('list-group-item', 'city-item');

    // Set the text content of the list item to the city name
    listItem.textContent = city;

     // Attach a click event listener to the list item to retrieve weather
    listItem.onclick = () => weatherToday(city);

    // Return the created list item
    return listItem;
}

// Retrieve saved search history from localStorage on page load
var savedHistory = localStorage.getItem("city");
// Attempt to parse saved search history from localStorage, or create an empty array if none exists
searchHistoryList = JSON.parse(savedHistory) || [];

// Display the saved history initially
displaySearchHistory();


// Event listener for the search button
$("#searchButton").on("click", event => {
    // Stops the browser from submitting the form and reloading the page
    event.preventDefault();
  
    // Get the city name entered in the search input
    var city = $("#citySearch").val();
  
    // Capitalise the first letter and make the rest lowercase
    city = city.charAt(0).toUpperCase() + city.slice(1).toLowerCase();
  
    // Fetch and display weather for the entered city
    weatherToday(city);
  
    // Check for duplicates and add to history with proper capitalisation
    // Store a normalised version for comparison
    var normalisedCity = city.toLowerCase(); 

    if (!searchHistoryList.some(item => item.toLowerCase() === normalisedCity)) {
        // Add to the beginning with capitalisation
        searchHistoryList.unshift(city); 

        if (searchHistoryList.length > 10) {
            // Remove the oldest entry if the list exceeds 10
            searchHistoryList.pop(); 
        }
        // Save the updated history to localStorage
        localStorage.setItem("city", JSON.stringify(searchHistoryList));

        // Update the UI to reflect the new history
        displaySearchHistory();

    } else {
        // Log a message if the city is already in the history (case-insensitive)
        console.log("City already in history (normalised):", normalisedCity);
    }

    // Clear the search input field after search
    $("#citySearch").val(""); 
});

// Event listener for clear history button
$("#clearHistoryButton").on("click", () => {
    // Clear the search history array
    searchHistoryList = []; 
    // Remove the history from localStorage
    localStorage.removeItem("city"); 
    // Update the UI to reflect the cleared list
    displaySearchHistory(); 
});

// Event listener for Enter key press in search input
$("#citySearch").on("keydown", event => {
    // If Enter key is pressed
    if (event.keyCode === 13) {
    // Prevent default form submission
    event.preventDefault();
    
    // Reuse the same logic from the search button click
    // Simulate a search button click
    $("#searchButton").click();
    }
});

// Function to display search history 
function displaySearchHistory() {
    // Get the DOM element for the history list
    var historyList = $("#recentSearches");
    // Clear any existing content
    historyList.empty();

    // Iterate through the search history and create list items for each city
    searchHistoryList.forEach(city => {
        // Create a list item for the city using the `createHistoryListItem` function
        var listItem = createHistoryListItem(city);
        // Append list items in normal order (reversed in data)
        historyList.append(listItem); 
    });
}