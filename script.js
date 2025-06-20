// script.js
const apiKey = "0dd12d907e104ffb9e1195058251906";
const geminiApiKey = "AIzaSyC3hTkHmkjC46VBWXS3J-vjntrRf0FDj1Y"; // Replace with your Gemini API key
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
  const bgPrompt = `Suggest a background image theme for a weather condition described as '${condition}'. Provide only one keyword like 'sunny sky', 'stormy clouds', or 'clear sunset'.`;
  const imageKeyword = await getGeminiBackgroundKeyword(bgPrompt);

  if (imageKeyword) {
    const bgUrl = `https://source.unsplash.com/1920x1080/?${encodeURIComponent(imageKeyword)}`;
    document.body.style.backgroundImage = `url('${bgUrl}')`;
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

async function getGeminiBackgroundKeyword(promptText) {
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: promptText }] }]
    })
  });
  const result = await response.json();
  return result?.candidates?.[0]?.content?.parts?.[0]?.text.trim();
}

async function askGemini() {
  const input = document.getElementById("gemini-input").value;
  const output = document.getElementById("gemini-result");
  output.innerHTML = loader;
  const response = await getGeminiResponse(input);
  setTimeout(() => {
    output.innerHTML = `<div style="background: rgba(0, 0, 0, 0.7); color: #fff; padding: 1rem; border-radius: 10px; font-size: 1.1rem; line-height: 1.6; box-shadow: 0 0 10px rgba(0,0,0,0.5);">${response.replace(/\n/g, "<br>")}</div>`;
  }, 500);
}

async function getGeminiResponse(promptText) {
  const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + geminiApiKey, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: promptText }] }]
    })
  });

  const result = await response.json();
  const reply = result.candidates?.[0]?.content?.parts?.[0]?.text || "No response.";
  return reply;
}

window.onload = loadMajorCities;
