
// HTML elements for displaying weather data
let cityName = document.querySelector(".weather_city");
let dateTime = document.querySelector(".weather_date_time");
let w_forecast = document.querySelector(".weather_forecast");
let w_icon = document.querySelector(".weather_icon");
let w_temperature = document.querySelector(".weather_temperate");
let w_minTem = document.querySelector(".weather_min");
let w_maxTem = document.querySelector(".weather_max");
let w_feelslike = document.querySelector(".weather_feelslike");
let w_humidity = document.querySelector(".weather_humidity");
let w_wind = document.querySelector(".weather_wind");
let w_pressure = document.querySelector(".weather_pressure");

// Get the city input field, search button, container, and loader
let citySearchInput = document.querySelector("#city-input");
let searchButton = document.querySelector(".search__btn");
let loader = document.querySelector("#loader");
let container = document.querySelector(".container");
let locationButton = document.querySelector("#location-btn");

// Function to show the loader and hide the container
const showLoader = () => {
  loader.style.display = "block"; // Show the loader
  container.style.display = "none"; // Hide the container
};

// Function to hide the loader and show the container
const hideLoader = () => {
  loader.style.display = "none"; // Hide the loader
  container.style.display = "block"; // Show the container
};

// Function to get the country name based on country code
const getCountryName = (code) => {
  return new Intl.DisplayNames(["en"], { type: "region" }).of(code);
};

// Function to get formatted date and time
const getDateTime = (dt) => {
  const curDate = new Date(dt * 1000);
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  };
  const formatter = new Intl.DateTimeFormat("en-US", options);
  return formatter.format(curDate);
};

// Function to fetch weather data from OpenWeather API
const getWeatherData = async (city) => {
  const apiKey = "bdb407a950105b4973eddf44eb857baa";
  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

  // Show loader and hide container before API request
  showLoader();

  try {
    const res = await fetch(weatherUrl);
    if (!res.ok) throw new Error(`City not found: ${city}`);
    const data = await res.json();

    // Destructure the relevant data
    const { main, name, weather, sys, dt, wind } = data;

    // Update the UI with fetched weather data
    cityName.innerHTML = `${name}, ${getCountryName(sys.country)}`;
    dateTime.innerHTML = getDateTime(dt);

    w_temperature.innerHTML = `${(main.temp - 273.15).toFixed(1)} ℃`;
    w_minTem.innerHTML = `Min: ${(main.temp_min - 273.15).toFixed(1)} ℃`;
    w_maxTem.innerHTML = `Max: ${(main.temp_max - 273.15).toFixed(1)} ℃`;

    w_feelslike.innerHTML = `${(main.feels_like - 273.15).toFixed(1)} ℃`;
    w_humidity.innerHTML = `${main.humidity}%`;
    w_wind.innerHTML = `${(wind.speed * 3.6).toFixed(1)} km/h`; // Convert wind speed to km/h
    w_pressure.innerHTML = `${main.pressure} hPa`;

    w_forecast.innerHTML = weather[0].main;
    w_icon.innerHTML = `<img src="http://openweathermap.org/img/wn/${weather[0].icon}@2x.png" alt="${weather[0].main}"/>`;
  } catch (error) {
    console.error(error);
    Swal.fire({
      icon: "error",
      title: "City not found",
      text: "Please try again with a valid city name.",
    });
  } finally {
    // Hide loader and show container after the request completes
    hideLoader();
  }
};

// Function to fetch weather data by user's location
const getWeatherByLocation = async (lat, lon) => {
  const apiKey = "bdb407a950105b4973eddf44eb857baa";
  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;

  // Show loader and hide container before API request
  showLoader();

  try {
    const res = await fetch(weatherUrl);
    if (!res.ok) throw new Error("Unable to get weather data for your location");
    const data = await res.json();

    // Destructure the relevant data
    const { main, name, weather, sys, dt, wind } = data;

    // Update the UI with fetched weather data
    cityName.innerHTML = `${name}, ${getCountryName(sys.country)}`;
    dateTime.innerHTML = getDateTime(dt);

    w_temperature.innerHTML = `${(main.temp - 273.15).toFixed(1)} ℃`;
    w_minTem.innerHTML = `Min: ${(main.temp_min - 273.15).toFixed(1)} ℃`;
    w_maxTem.innerHTML = `Max: ${(main.temp_max - 273.15).toFixed(1)} ℃`;

    w_feelslike.innerHTML = `${(main.feels_like - 273.15).toFixed(1)} ℃`;
    w_humidity.innerHTML = `${main.humidity}%`;
    w_wind.innerHTML = `${(wind.speed * 3.6).toFixed(1)} km/h`;
    w_pressure.innerHTML = `${main.pressure} hPa`;

    w_forecast.innerHTML = weather[0].main;
    w_icon.innerHTML = `<img src="http://openweathermap.org/img/wn/${weather[0].icon}@2x.png" alt="${weather[0].main}"/>`;
  } catch (error) {
    console.error(error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Unable to get weather data for your location.",
    });
  } finally {
    // Hide loader and show container after the request completes
    hideLoader();
  }
};

// Function to get the user's current location
const getLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        getWeatherByLocation(latitude, longitude);
      },
      (error) => {
        Swal.fire({
          icon: "error",
          title: "Geolocation Error",
          text: "Unable to retrieve your location.",
        });
      }
    );
  } else {
    Swal.fire({
      icon: "warning",
      title: "Geolocation Not Supported",
      text: "Your browser does not support geolocation.",
    });
  }
};

// Add event listener to search button to handle city search
searchButton.addEventListener("click", (e) => {
  e.preventDefault();
  const city = citySearchInput.value.trim();

  if (city) {
    // Fetch weather data for the inputted city
    getWeatherData(city);
  } else {
    Swal.fire({
      icon: "warning",
      title: "Invalid Input",
      text: "Please enter a valid city name.",
    });
  }
});

// Add event listener to location button to fetch weather by current location
locationButton.addEventListener("click", (e) => {
  e.preventDefault();
  getLocation();
});

// Fetch weather data for default city when the page loads (e.g., Lahore)
document.addEventListener("DOMContentLoaded", () => {
  getWeatherData("Lahore");
});

