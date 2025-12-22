import "./styles.css";

async function fetchWeather(city) {
  try {
    const response = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?key=ZKMHNGKN5MX234SPPWF67947Z`
    );
    if (!response.ok) {
      throw new Error("City not found");
    }
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw error;
  }
}

function fahrenheitToCelsius(fahrenheit) {
  return ((fahrenheit - 32) * 5) / 9;
}

function getIconUrl(icon) {
  return `https://raw.githubusercontent.com/visualcrossing/WeatherIcons/main/SVG/1st%20Set%20-%20Color/${icon}.svg`;
}

function displayCurrentWeather(data) {
  const current = data.currentConditions;
  const cityName = data.address || data.resolvedAddress;

  document.getElementById("city-name").textContent = cityName;
  document.getElementById("temperature").textContent = `${Math.round(
    fahrenheitToCelsius(current.temp)
  )}°C`;
  document.getElementById("weather-description").textContent =
    current.conditions;
  document.getElementById("weather-icon").src = getIconUrl(current.icon);
  document.getElementById("feels-like").textContent = `${Math.round(
    fahrenheitToCelsius(current.feelslike)
  )}°C`;
  document.getElementById("humidity").textContent = `${current.humidity}%`;
  document.getElementById(
    "wind-speed"
  ).textContent = `${current.windspeed} mph`;
  document.getElementById(
    "visibility"
  ).textContent = `${current.snow} `;

  document.getElementById("weather-container").style.display = "block";
}

function displayForecast(data) {
  const forecastDays = document.getElementById("forecast-days");
  forecastDays.innerHTML = "";

  data.days.slice(0, 5).forEach((day) => {
    const dayDiv = document.createElement("div");
    dayDiv.className = "forecast-day";
    dayDiv.innerHTML = `
      <p class="forecast-date">${new Date(day.datetime).toLocaleDateString(
        "en-US",
        { weekday: "short", month: "short", day: "numeric" }
      )}</p>
      <img class="forecast-icon" src="${getIconUrl(day.icon)}" alt="${
      day.conditions
    }" />
      <p class="forecast-temp">${Math.round(
        fahrenheitToCelsius(day.tempmax)
      )}°/${Math.round(fahrenheitToCelsius(day.tempmin))}°</p>
      <p class="forecast-desc">${day.conditions}</p>
    `;
    forecastDays.appendChild(dayDiv);
  });

  document.getElementById("forecast").style.display = "block";
}

function showError(message) {
  document.getElementById("error-message").textContent = message;
  document.getElementById("error-message").style.display = "block";
  document.getElementById("weather-container").style.display = "none";
}

function hideError() {
  document.getElementById("error-message").style.display = "none";
}

const cityInput = document.getElementById("city-input");
const searchButton = document.getElementById("search-button");

searchButton.addEventListener("click", async (event) => {
  event.preventDefault();
  const city = cityInput.value.trim();
  if (!city) {
    showError("Please enter a city name");
    return;
  }

  hideError();
  searchButton.textContent = "Loading...";
  searchButton.disabled = true;

  try {
    const weatherData = await fetchWeather(city);
    displayCurrentWeather(weatherData);
    displayForecast(weatherData);
  } catch (error) {
    showError(error.message || "Failed to fetch weather data");
  } finally {
    searchButton.textContent = "Search";
    searchButton.disabled = false;
  }
});

// Allow enter key to search
cityInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    searchButton.click();
  }
});
