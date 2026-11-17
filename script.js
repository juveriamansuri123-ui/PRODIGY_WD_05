
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const locationBtn = document.getElementById("locationBtn");
const message = document.getElementById("message");

const weatherIcons = {
    0: "☀️",
    1: "🌤️",
    2: "⛅",
    3: "☁️",
    45: "🌫️",
    48: "🌫️",
    51: "🌦️",
    53: "🌦️",
    55: "🌧️",
    61: "🌧️",
    63: "🌧️",
    65: "🌧️",
    71: "🌨️",
    73: "❄️",
    75: "❄️",
    80: "🌦️",
    81: "🌧️",
    82: "⛈️",
    95: "⛈️",
    96: "⛈️",
    99: "⛈️"
};

const weatherDescriptions = {
    0: "Clear Sky",
    1: "Mainly Clear",
    2: "Partly Cloudy",
    3: "Overcast",
    45: "Foggy",
    48: "Depositing Rime Fog",
    51: "Light Drizzle",
    53: "Moderate Drizzle",
    55: "Dense Drizzle",
    61: "Light Rain",
    63: "Moderate Rain",
    65: "Heavy Rain",
    71: "Light Snow",
    73: "Moderate Snow",
    75: "Heavy Snow",
    80: "Rain Showers",
    81: "Moderate Rain Showers",
    82: "Heavy Rain Showers",
    95: "Thunderstorm",
    96: "Thunderstorm with Hail",
    99: "Heavy Thunderstorm"
};

// Search city
async function searchCity() {
    const city = cityInput.value.trim();

    if (!city) {
        message.textContent = "Please enter a city name!";
        return;
    }

    message.textContent = "Searching...";

    try {
        const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;

        const response = await fetch(url);
        const data = await response.json();

        if (!data.results || data.results.length === 0) {
            throw new Error("City not found!");
        }

        const place = data.results[0];

        await getWeather(
            place.latitude,
            place.longitude,
            `${place.name}, ${place.country}`
        );

    } catch (error) {
        message.textContent = error.message;
    }
}

// Get weather using coordinates
async function getWeather(lat, lon, city) {
    message.textContent = "Fetching weather...";

    try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,cloud_cover,wind_speed_10m&timezone=auto`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Unable to fetch weather data.");
        }

        const data = await response.json();
        const weather = data.current;

        document.getElementById("city").textContent = city;

        document.getElementById("date").textContent =
            new Date(weather.time).toLocaleString();

        document.getElementById("temperature").textContent =
            Math.round(weather.temperature_2m) + "°C";

        document.getElementById("condition").textContent =
            weatherDescriptions[weather.weather_code] || "Unknown";

        document.getElementById("weatherIcon").textContent =
            weatherIcons[weather.weather_code] || "🌡️";

        document.getElementById("feelsLike").textContent =
            "Feels like " + Math.round(weather.apparent_temperature) + "°C";

        document.getElementById("humidity").textContent =
            weather.relative_humidity_2m + "%";

        document.getElementById("wind").textContent =
            weather.wind_speed_10m + " km/h";

        document.getElementById("feelsDetail").textContent =
            Math.round(weather.apparent_temperature) + "°C";

        document.getElementById("clouds").textContent =
            weather.cloud_cover + "%";

        message.textContent = "Weather updated successfully!";

    } catch (error) {
        message.textContent = error.message;
    }
}

// Search button
searchBtn.addEventListener("click", searchCity);

// Enter key
cityInput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        searchCity();
    }
});

// Current location
locationBtn.addEventListener("click", function() {

    if (!navigator.geolocation) {
        message.textContent = "Geolocation is not supported!";
        return;
    }

    message.textContent = "Getting your location...";

    navigator.geolocation.getCurrentPosition(
        async function(position) {

            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            await getWeather(lat, lon, "Your Current Location");
        },

        function() {
            message.textContent =
                "Location permission denied. Please search your city.";
        }
    );
});

// Default city
getWeather(19.0760, 72.8777, "Mumbai, India");
