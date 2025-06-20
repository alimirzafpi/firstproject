// script.js
const apiKey = "0dd12d907e104ffb9e1195058251906";
const loader = '<p style="color:white;">⏳ Loading...</p>';

async function getCityWeather(city) {
  const res = await fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`);
  const data = await res.json();
  return `<strong>${city}</strong>: ${data.current.temp_c}°C, ${data.current.condition.text}`;
}

async function loadMajorCities() {
  const citiesList = [
    "London", "New York", "Tokyo", "Lahore", "Paris",
    "Sydney", "Istanbul", "Moscow", "Berlin", "Toronto",
    "Dubai", "Madrid", "Bangkok", "Rome", "Chicago"
  ];
  const cities = shuffle(citiesList).slice(0, 5);
  let html = "";
  for (let city of cities) {
    html += `<p>${await getCityWeather(city)}</p>`;
  }
  document.getElementById("cities-weather").innerHTML = html;
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

async function getWeather() {
  const city = document.getElementById("weather-city").value;
  const result = document.getElementById("weather-result");
  result.innerHTML = loader;
  const res = await fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`);
  const data = await res.json();

  const condition = data.current.condition.text.toLowerCase();
  let bgImage = "";
  if (condition.includes("sunny")) {
    bgImage = "url('C:/Users/FPI/Desktop/Coding/weather2/sunny.jpg')";
  } else if (condition.includes("clear")) {
    bgImage = "url('C:/Users/FPI/Desktop/Coding/weather2/clear.jpg')";
  } else if (condition.includes("cloud")) {
    bgImage = "url('C:/Users/FPI/Desktop/Coding/weather2/cloudy.jpg')";
  } else if (condition.includes("thunder")) {
    bgImage = "url('C:/Users/FPI/Desktop/Coding/weather2/thunder.jpg')";
  }

  if (bgImage) {
    document.body.style.backgroundImage = bgImage;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundPosition = "center center";
    document.body.style.transition = "background-image 1s ease-in-out";
  }

  setTimeout(() => {
    result.innerHTML = `${data.location.name}: ${data.current.temp_c}°C, ${data.current.condition.text}`;
  }, 500);
}

async function getHumidity() {
  const city = document.getElementById("humidity-city").value;
  const result = document.getElementById("humidity-result");
  result.innerHTML = loader;
  const res = await fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`);
  const data = await res.json();
  setTimeout(() => {
    result.innerHTML = `${data.location.name}: Humidity is ${data.current.humidity}%`;
  }, 500);
}

function formatDate(dateString) {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
}

async function getForecast() {
  const city = document.getElementById("forecast-city").value;
  const result = document.getElementById("forecast-result");
  result.innerHTML = loader;
  const res = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=7`);
  const data = await res.json();

  let html = `<h3>${data.location.name} - 7 Day Forecast</h3>`;
  html += `<div style="display: flex; flex-direction: row-reverse; flex-wrap: wrap; justify-content: center; gap: 1rem;">`;

  for (let day of data.forecast.forecastday) {
    html += `
      <div style="background: rgba(255,255,255,0.2); padding: 1rem; border-radius: 10px; width: 220px; text-align: center; box-shadow: 0 0 10px rgba(0,0,0,0.2);">
        <p><strong>${formatDate(day.date)}</strong></p>
        <p>🌡️ ${day.day.avgtemp_c}°C</p>
        <p>🌤️ ${day.day.condition.text}</p>
        <p>💧 Humidity: ${day.day.avghumidity}%</p>
      </div>
    `;
  }
  html += `</div>`;

  setTimeout(() => {
    result.innerHTML = html;
  }, 500);
}

window.onload = loadMajorCities;
