 // Fetch weather data for the chamber location
async function getWeatherData() {
    const apiKey = '1296ac4b47f51732b478dc0875d2ffc7';  // Replace this with your actual API key
    const city = 'Sunyani'; // Replace with the Chamber's city 
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(url);

        // Check if the response is successful (status code 200)
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        displayWeather(data);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        document.getElementById('weather-info').innerHTML = `<p>Error fetching weather data: ${error.message}</p>`;
    }
}

// Display weather data on the page
function displayWeather(data) {
    const weatherInfo = document.getElementById('weather-info');

    const temperature = Math.round(data.main.temp); // Rounded temperature
    const description = capitalizeWords(data.weather[0].description); // Capitalized description
    const forecast = `${Math.round(data.main.temp_max)}°C / ${Math.round(data.main.temp_min)}°C`; // Temperature range

    weatherInfo.innerHTML = `
        <p>Temperature: ${temperature}°C</p>
        <p>Weather: ${description}</p>
        <p>Forecast: ${forecast}</p>
    `;
}

// Capitalize each word in the description
function capitalizeWords(str) {
    return str
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

// Run the functions when the page is loaded
document.addEventListener('DOMContentLoaded', function() {
    getWeatherData();
});
