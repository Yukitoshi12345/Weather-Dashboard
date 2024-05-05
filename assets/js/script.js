// Generated apiKey from openweatherAPI.org after creating an account
var apiWeatherKey = "24716f334fbb25fbc76f035aa23a8fa8";

// Storing the base URL for openweatherAPI.org
var baseURL = "https://api.openweathermap.org";

// Metric means temperature in Celsius
var metric = `units=metric`;

// Declare an empty array to store search history items
var searchHistoryList = [];

// Function to fetch and display current weather for a given city
function weatherToday(city) {
  // Construct URL for current weather with city, API key, and metric units
  var weatherTodayURL = `${baseURL}/data/2.5/weather?q=${city}&appid=${apiWeatherKey}&${metric}`;
  // Fetch current weather data
  fetch(weatherTodayURL)
    // Parse JSON response
    .then((response) => response.json())
    .then((data) => {
      // Check if the data includes a valid city name
      if (!data.name) {
        alert(
          "We couldn't find that city. Please try entering a valid city name."
        );
        return false;
      }
      // Log data for debugging
      console.log(data);
      // Clear previous city information
      $("#cityInformation").empty();
      // Show the weather information section
      $("#show-and-hide").addClass("show");
      // Create elements for displaying current weather with icons
      var weatherIconID = data.weather[0].icon;
      var weatherIconImageURL = `${baseURL}/img/w/${weatherIconID}.png`;
      var weatherCityCurrent = $(
        `<h3 id="weatherCityCurrent">
        ${data.name} ` +
          dayjs().format(`DD/MM/YYYY`) +
          ` <img src="${weatherIconImageURL}" alt="${
            data.weather[0].description
          }" />
        </h3>
        <p>Temperature: ${data.main.temp.toFixed(1)} °C</p>
        <p>Wind: ${(data.wind.speed * 3.6).toFixed(1)} km/hr</p>
        <p>Humidity: ${data.main.humidity}%</p>`
      );
      // Append current weather to the DOM
      $("#cityInformation").append(weatherCityCurrent);
      // Get latitude for forecast
      var latitude = data.coord.lat;
      // Get longitude for forecast
      var longitude = data.coord.lon;
      // Call function to fetch 5-day forecast
      forecast5Days(latitude, longitude);
      // Save the searched city
      saveSearchedCity(data.name);
      // Update the display of search history
      displaySearchHistory();
    })
    .catch((error) => {
      // Handle errors in fetching weather data
      console.error("Failed to fetch current weather data: ", error);
      alert("We were unable to display the current weather right now.");
    });
}

// Function to fetch and display 5-day weather forecast based on coordinates
function forecast5Days(latitude, longitude) {
  // Construct URL for 5-day weather forecast
  var forecastWeatherURL = `${baseURL}/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiWeatherKey}&${metric}`;
  // Fetch forecast data
  fetch(forecastWeatherURL)
    // Parse JSON response
    .then((response) => response.json())
    .then((dataFutureWeather) => {
      // Log forecast data for debugging
      console.log(dataFutureWeather);
      // Clear previous forecast information
      $("#forecastInformation").empty();
      // Process and display each day's forecast
      for (let i = 1; i <= 5; i++) {
        // Calculate index for midday of each forecast day
        var index = i * 8;
        var cityWeatherInformation = {
          date: dataFutureWeather.list[index - 1].dt_txt,
          humidity: dataFutureWeather.list[index - 1].main.humidity,
          icon: dataFutureWeather.list[index - 1].weather[0].icon,
          temperature: dataFutureWeather.list[index - 1].main.temp,
          wind: dataFutureWeather.list[index - 1].wind.speed,
        };
        // Log individual day forecast for debugging
        console.log(cityWeatherInformation);
        var IconForWeatherURL = `<img src="${baseURL}/img/w/${
          cityWeatherInformation.icon
        }.png" alt="${dataFutureWeather.list[index - 1].weather[0].main}" />`;
        var currentDate = dayjs(cityWeatherInformation.date).format(
          "DD/MM/YYYY"
        );
        // Format forecast date
        var upcomingForecastCard = $(
          `<div class="card pl-3 bg forecastCard"><div class="card-body"><h5>${currentDate}</h5><p>${IconForWeatherURL}</p><p>Temperature: ${cityWeatherInformation.temperature.toFixed(
            1
          )} °C</p><p> Wind: ${(cityWeatherInformation.wind * 3.6).toFixed(
            1
          )} km/hr</p><p>Humidity: ${
            cityWeatherInformation.humidity
          }%</p></div></div>`
        );
        // Append forecast to the DOM
        $("#forecastInformation").append(upcomingForecastCard);
      }
    })
    .catch((error) => {
      // Handle errors in fetching forecast data
      console.error("Failed to fetch forecast data ", error);
      alert("We were unable to display the forecast right now.");
    });
}

// Function to save a searched city to local storage
function saveSearchedCity(city) {
  // Check if city is already in history and add if not
  if (!searchHistoryList.some((item) => item === city)) {
    // Add new city to the front of the list
    searchHistoryList.unshift(city);
    if (searchHistoryList.length > 10) {
      // Remove the oldest entry if list exceeds 10 items
      searchHistoryList.pop();
    }

    // Save updated list to local storage
    localStorage.setItem("city", JSON.stringify(searchHistoryList));
  }
  // Save the last viewed city for quick access
  localStorage.setItem("lastViewedCity", city);
}

// Function to display the search history in the UI
function displaySearchHistory() {
  // Select the recent searches list element
  var historyList = $("#recentSearches");
  // Clear previous entries
  historyList.empty();
  // Append each city in the search history to the list
  searchHistoryList.forEach((city) => {
    // Create a list item for each city
    var listItem = createHistoryListItem(city);
    // Add the list item to the history list
    historyList.append(listItem);
  });
}

// Function to create a list item element for a city
function createHistoryListItem(city) {
  // Create a new list item element
  var listItem = document.createElement("li");
  // Add classes for styling
  listItem.classList.add(
    "text-center",
    "list-group-item",
    "city-item",
    "text-truncate"
  );
  // Set the text content to the city name
  listItem.textContent = city;
  // Add click event to fetch weather for the city
  listItem.onclick = () => weatherToday(city);
  // Return the created list item
  return listItem;
}

// jQuery function that runs when the document is ready
$(document).ready(function () {
  // Retrieve saved search history
  var savedHistory = localStorage.getItem("city");
  if (savedHistory) {
    // Parse the retrieved history
    searchHistoryList = JSON.parse(savedHistory);
  }
  // Display the search history
  displaySearchHistory();
  // Retrieve the last viewed city
  var lastViewedCity = localStorage.getItem("lastViewedCity");
  if (lastViewedCity) {
    // Fetch weather for the last viewed city
    weatherToday(lastViewedCity);
  }

  // Event handler for the search button
  $("#searchButton").on("click", (event) => {
    // Prevent the default form submission behaviour
    event.preventDefault();
    // Get the city name from the input
    var city = $("#citySearch").val();
    // Format the city name
    city = city.charAt(0).toUpperCase() + city.slice(1).toLowerCase();
    // Fetch weather for the entered city
    weatherToday(city);
    // Clear the input field
    $("#citySearch").val("");
  });

  // Event handler for the clear history button
  $("#clearHistoryButton").on("click", () => {
    // Clear the search history
    searchHistoryList = [];
    // Remove the city history from local storage
    localStorage.removeItem("city");
    // Remove the last viewed city from local storage
    localStorage.removeItem("lastViewedCity");
    // Update the display of the search history
    displaySearchHistory();
  });

  // Event handler for the enter key in the city search input
  $("#citySearch").on("keydown", (event) => {
    if (event.keyCode === 13) {
      // Check if the key pressed is enter
      // Prevent the default form submission behaviour
      event.preventDefault();
      // Trigger the search button click event
      $("#searchButton").click();
    }
  });
});
