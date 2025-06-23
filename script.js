// script.js
const apiKey = "0dd12d907e104ffb9e1195058251906";
const loader = '<p style="color:white;">⏳ Loading...</p>';
const allCities = [
  "London", "New York", "Tokyo", "Lahore", "Paris", "Sydney", "Istanbul", "Moscow", "Berlin", "Toronto",
  "Dubai", "Madrid", "Bangkok", "Rome", "Chicago", "Karachi", "Delhi", "Beijing", "Los Angeles", "San Francisco",
  "Barcelona", "Amsterdam", "Seoul", "Cairo", "Jakarta"
];

async function getCityWeather(city) {
  const res = await fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`);
  const data = await res.json();
  return `<strong>${city}</strong>: ${data.current.temp_c}°C, ${data.current.condition.text}`;
}

async function loadMajorCities() {
  const cities = shuffle([...allCities]).slice(0, 5);
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

  const html = `
    <div style="background: rgba(0,0,0,0.6); padding: 1.5rem; border-radius: 12px; color: white; max-width: 500px; margin: auto; font-family: sans-serif; line-height: 1.6; box-shadow: 0 0 15px rgba(0,0,0,0.4);">
      <h2 style="margin-bottom: 1rem;">🌍 ${data.location.name}, ${data.location.country}</h2>
      <p><strong>🌡️ Temperature:</strong> ${data.current.temp_c}°C</p>
      <p><strong>🌤️ Condition:</strong> ${data.current.condition.text}</p>
      <p><strong>💧 Humidity:</strong> ${data.current.humidity}%</p>
      <p><strong>🌬️ Feels Like:</strong> ${data.current.feelslike_c}°C</p>
      <p><strong>🌫️ Air Quality Index (PM2.5):</strong> ${data.current.air_quality?.pm2_5?.toFixed(2) || 'N/A'}</p>
      <p><strong>🕓 Last Updated:</strong> ${data.current.last_updated}</p>
    </div>
  `;

  setTimeout(() => {
    result.innerHTML = html;
  }, 500);
}

function showSuggestions() {
  const input = document.getElementById("weather-city").value.toLowerCase();
  const suggestionBox = document.getElementById("city-suggestions");
  suggestionBox.innerHTML = "";
  if (!input) return;

  const matches = allCities.filter(city => city.toLowerCase().startsWith(input));
  if (matches.length > 0) {
    suggestionBox.style.display = "block";
    suggestionBox.innerHTML = matches.map(city => `<div onclick="selectSuggestion('${city}')" style="padding: 8px 12px; cursor: pointer; background: rgba(255,255,255,0.9); margin-bottom: 2px; border-radius: 6px; font-weight: bold;">${city}</div>`).join('');
  } else {
    suggestionBox.style.display = "none";
  }
}

function selectSuggestion(city) {
  document.getElementById("weather-city").value = city;
  document.getElementById("city-suggestions").style.display = "none";
  getWeather();
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
