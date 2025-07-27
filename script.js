// API KEY
const apiKey = '90a0c7ba7e5b4f0f56732af1079e0e14';
let units = 'imperial'; // default to Fahrenheit

const roasts = {
  Clear: ["Clear skies? Finally something as transparent as your excuses."],
  Clouds: ["Cloudy? Perfect mood for your messy thoughts."],
  Rain: ["Raining? Boohoo. Beyoncé still worked harder today."],
  Drizzle: ["Drizzling? Just like your motivation."],
  Thunderstorm: ["Thunderstorm? Even the weather's clapping back at your takes."],
  Snow: ["Snowing? Don't slip — your excuses already do that."],
  Mist: ["Misty? Like your memory when it's time to take accountability."],
  default: ["Weather's moody, and so are you."]
};

function toggleUnits() {
  units = (units === 'imperial') ? 'metric' : 'imperial';
  document.getElementById('unitLabel').innerText = (units === 'imperial') ? '°F' : '°C';
}

async function getWeather() {
  const city = document.getElementById('cityInput').value.trim();
  if (!city) {
    document.getElementById('weatherResult').innerText = 'Please enter a city name.';
    return;
  }

  // Step 1: search for matching cities using geocoding API
  const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=5&appid=${apiKey}`;
  try {
    const geoResponse = await fetch(geoUrl);
    const geoData = await geoResponse.json();
    console.log('Geo data:', geoData);

    if (geoData.length === 0) {
      document.getElementById('weatherResult').innerText = `No matches found for "${city}".`;
      document.getElementById('cityOptions').innerHTML = '';
      return;
    }

    // Step 2: show user matching options
    let optionsHTML = '<p>Select your city:</p>';
    geoData.forEach((place, index) => {
      const displayName = `${place.name}${place.state ? ', ' + place.state : ''}, ${place.country}`;
      optionsHTML += `<button onclick="fetchWeather(${place.lat}, ${place.lon}, '${displayName}')">${displayName}</button>`;
    });
    document.getElementById('cityOptions').innerHTML = optionsHTML;
    document.getElementById('weatherResult').innerHTML = '';
  } catch (error) {
    console.error(error);
    document.getElementById('weatherResult').innerText = 'Something went wrong. Blame the weather gods.';
  }
}

async function fetchWeather(lat, lon, displayName) {
  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${apiKey}`;
  try {
    const response = await fetch(weatherUrl);
    const data = await response.json();
    console.log('Weather data:', data);

    if (data.cod === 401) {
      document.getElementById('weatherResult').innerText = 'Invalid API key. Please double-check it.';
      return;
    }

    if (data.cod == 200) {
      const temp = Math.round(data.main.temp);
      const description = data.weather[0].description;
      const main = data.weather[0].main;
      const unitLabel = (units === 'imperial') ? '°F' : '°C';

      const roastOptions = roasts[main] || roasts['default'];
      const roast = roastOptions[Math.floor(Math.random() * roastOptions.length)];

      document.getElementById('weatherResult').innerHTML = `
        <h2>${displayName}</h2>
        <p>${description}, ${temp}${unitLabel}</p>
        <p><em>${roast}</em></p>
      `;
      document.getElementById('cityOptions').innerHTML = ''; // clear options
    } else {
      document.getElementById('weatherResult').innerText = 'Could not get weather data.';
    }
  } catch (error) {
    console.error(error);
    document.getElementById('weatherResult').innerText = 'Something went wrong. Blame the weather gods.';
  }
}
