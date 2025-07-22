// Weather API Integration
const apiKey = "YOUR_OPENWEATHERMAP_API_KEY"; // Replace with your OpenWeatherMap API key
const city = "Timbuktu,ML";
const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

async function fetchWeather() {
  try {
    // Fetch current weather
    const currentResponse = await fetch(currentWeatherUrl);
    if (!currentResponse.ok) throw new Error("Failed to fetch current weather");
    const currentData = await currentResponse.json();

    // Fetch forecast
    const forecastResponse = await fetch(forecastUrl);
    if (!forecastResponse.ok) throw new Error("Failed to fetch forecast");
    const forecastData = await forecastResponse.json();

    // Display current weather
    const currentWeather = document.getElementById("current-weather");
    currentWeather.innerHTML = `
      <p><strong>Temperature:</strong> ${currentData.main.temp}°C</p>
      <p><strong>Condition:</strong> ${currentData.weather[0].description}</p>
      <img src="https://openweathermap.org/img/wn/${currentData.weather[0].icon}.png" alt="Weather icon">
    `;

    // Display 3-day forecast (taking one forecast per day at 12:00)
    const forecastContainer = document.getElementById("weather-forecast");
    const dailyForecasts = forecastData.list.filter(item => item.dt_txt.includes("12:00:00")).slice(0, 3);
    forecastContainer.innerHTML = dailyForecasts.map(forecast => `
      <div>
        <p><strong>${new Date(forecast.dt_txt).toLocaleDateString()}</strong></p>
        <p>Temp: ${forecast.main.temp}°C</p>
        <p>${forecast.weather[0].description}</p>
        <img src="https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png" alt="Weather icon">
      </div>
    `).join("");
  } catch (error) {
    console.error("Error fetching weather:", error);
    document.getElementById("current-weather").innerHTML = "<p>Unable to load weather data.</p>";
    document.getElementById("weather-forecast").innerHTML = "<p>Unable to load forecast data.</p>";
  }
}

// Member Spotlights
const members = [
  {
    name: "Ikona ",
    logo: "images/ikona.jpg",
    phone: "(223) 555-1234",
    address: "amasaman road, mall",
    website: "https://timbuktucrafts.com",
    membershipLevel: "Gold"
  },
  {
    name: "Ikona Health",
    logo: "images/ikona.jpg",
    phone: "(233)266838889",
    address: "20 Avenue, amasaman road, ",
    website: "https://saharatraders.com",
    membershipLevel: "Silver"
  },
  {
    name: "Kingsmotion",
    logo: "images/motion.jpg",
    phone: "(233) 450701235",
    address: "5 Rue des Artisans, ",
    website: "https://malitextiles.com",
    membershipLevel: "Gold"
  },
  {
    name: "Desert Imports",
    logo: "images/motion.jpg",
    phone: "(223) 555-3456",
    address: "30 Boulevard Central",
    website: "https://desertimports.com",
    membershipLevel: "Silver"
  }
];

function displaySpotlights() {
  const spotlightContainer = document.getElementById("spotlights");
  // Filter for Gold and Silver members
  const eligibleMembers = members.filter(member => member.membershipLevel === "Gold" || member.membershipLevel === "Silver");
  // Randomly select 3 members (or fewer if not enough)
  const shuffled = eligibleMembers.sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, Math.min(3, eligibleMembers.length));

  spotlightContainer.innerHTML = selected.map(member => `
    <div class="spotlight-card">
      <img src="${member.logo}" alt="${member.name} logo">
      <h4>${member.name}</h4>
      <p><strong>Phone:</strong> ${member.phone}</p>
      <p><strong>Address:</strong> ${member.address}</p>
      <p><strong>Website:</strong> <a href="${member.website}" target="_blank">${member.website}</a></p>
      <p><strong>Membership:</strong> ${member.membershipLevel}</p>
    </div>
  `).join("");
}

// Dark Mode Toggle
document.getElementById("dark-mode-toggle").addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  const isDarkMode = document.body.classList.contains("dark-mode");
  localStorage.setItem("darkMode", isDarkMode);
  document.getElementById("dark-mode-toggle").textContent = isDarkMode ? "☀️" : "🌙";
});

// Last Modified Date
document.getElementById("last-modified").textContent = `Last Modified: ${document.lastModified}`;

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  fetchWeather();
  displaySpotlights();
  // Restore dark mode preference
  if (localStorage.getItem("darkMode") === "true") {
    document.body.classList.add("dark-mode");
    document.getElementById("dark-mode-toggle").textContent = "☀️";
  }
});