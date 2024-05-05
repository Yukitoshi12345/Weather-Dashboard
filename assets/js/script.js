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
  var weatherTodayURL = `${baseURL}/data/2.5/weather?q=${city}&appid=${apiWeatherKey}&${metric}`;
  fetch(weatherTodayURL)
    .then((response) => response.json())
    .then((data) => {
      if (!data.name) {
        alert(
          "We couldn't find that city. Please try entering a valid city name."
        );
        return false;
      }
      console.log(data);
      $("#cityInformation").empty();
      $("#show-and-hide").addClass("show");
      var weatherIconID = data.weather[0].icon;
      var weatherIconImageURL = `${baseURL}/img/w/${weatherIconID}.png`;
      var weatherCityCurrent = $(
        `
        <h3 id="weatherCityCurrent">
        ${data.name} ` +
          dayjs().format(`DD/MM/YYYY`) +
          ` <img src="${weatherIconImageURL}" alt="${
            data.weather[0].description
          }" />
        </h3>
        <p>Temperature: ${data.main.temp.toFixed(1)} °C</p>
        <p>Wind: ${(data.wind.speed * 3.6).toFixed(1)} km/hr</p>
        <p>Humidity: ${data.main.humidity}%</p>
      `
      );
      $("#cityInformation").append(weatherCityCurrent);
      var latitude = data.coord.lat;
      var longitude = data.coord.lon;
      forecast5Days(latitude, longitude);
      saveSearchedCity(data.name);
      displaySearchHistory();
    })
    .catch((error) => {
      console.error("Failed to fetch current weather data: ", error);
      alert("We were unable to display the current weather right now.");
    });
}

function forecast5Days(latitude, longitude) {
  var forecastWeatherURL = `${baseURL}/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiWeatherKey}&${metric}`;
  fetch(forecastWeatherURL)
    .then((response) => response.json())
    .then((dataFutureWeather) => {
      console.log(dataFutureWeather);
      $("#forecastInformation").empty();
      for (let i = 1; i <= 5; i++) {
        var index = i * 8;
        var cityWeatherInformation = {
          date: dataFutureWeather.list[index - 1].dt_txt,
          humidity: dataFutureWeather.list[index - 1].main.humidity,
          icon: dataFutureWeather.list[index - 1].weather[0].icon,
          temperature: dataFutureWeather.list[index - 1].main.temp,
          wind: dataFutureWeather.list[index - 1].wind.speed,
        };
        console.log(cityWeatherInformation);
        var IconForWeatherURL = `<img src="${baseURL}/img/w/${
          cityWeatherInformation.icon
        }.png" alt="${dataFutureWeather.list[index - 1].weather[0].main}" />`;
        var currentDate = dayjs(cityWeatherInformation.date).format(
          "DD/MM/YYYY"
        );
        var upcomingForecastCard = $(` 
          <div class="card pl-3 bg forecastCard">
            <div class="card-body">
              <h5>${currentDate}</h5>
              <p>${IconForWeatherURL}</p>
              <p>Temperature: ${cityWeatherInformation.temperature.toFixed(
                1
              )} °C</p>
              <p> Wind: ${(cityWeatherInformation.wind * 3.6).toFixed(
                1
              )} km/hr</p>
              <p>Humidity: ${cityWeatherInformation.humidity}%</p>
            </div>
          </div>
        `);
        $("#forecastInformation").append(upcomingForecastCard);
      }
    })
    .catch((error) => {
      console.error("Failed to fetch forecast data ", error);
      alert("We were unable to display the forecast right now.");
    });
}

function saveSearchedCity(city) {
  if (!searchHistoryList.some((item) => item === city)) {
    searchHistoryList.unshift(city);
    if (searchHistoryList.length > 10) {
      searchHistoryList.pop();
    }
    localStorage.setItem("city", JSON.stringify(searchHistoryList));
  }
  localStorage.setItem("lastViewedCity", city);
}

function displaySearchHistory() {
  var historyList = $("#recentSearches");
  historyList.empty();
  searchHistoryList.forEach((city) => {
    var listItem = createHistoryListItem(city);
    historyList.append(listItem);
  });
}

function createHistoryListItem(city) {
  var listItem = document.createElement("li");
  listItem.classList.add(
    "text-center",
    "list-group-item",
    "city-item",
    "text-truncate"
  );
  listItem.textContent = city;
  listItem.onclick = () => weatherToday(city);
  return listItem;
}

$(document).ready(function () {
  var savedHistory = localStorage.getItem("city");
  if (savedHistory) {
    searchHistoryList = JSON.parse(savedHistory);
  }
  displaySearchHistory();
  var lastViewedCity = localStorage.getItem("lastViewedCity");
  if (lastViewedCity) {
    weatherToday(lastViewedCity);
  }

  $("#searchButton").on("click", (event) => {
    event.preventDefault();
    var city = $("#citySearch").val();
    city = city.charAt(0).toUpperCase() + city.slice(1).toLowerCase();
    weatherToday(city);
    $("#citySearch").val("");
  });

  $("#clearHistoryButton").on("click", () => {
    searchHistoryList = [];
    localStorage.removeItem("city");
    localStorage.removeItem("lastViewedCity");
    displaySearchHistory();
  });

  $("#citySearch").on("keydown", (event) => {
    if (event.keyCode === 13) {
      event.preventDefault();
      $("#searchButton").click();
    }
  });
});
