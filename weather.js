// Weather App Javascript Logic

// API Configuration (Open-Meteo)
const GEO_API_URL = "https://geocoding-api.open-meteo.com/v1/search";
const WEATHER_API_URL = "https://api.open-meteo.com/v1/forecast";

// Default City fallback
const DEFAULT_CITY = {
    name: "New York",
    latitude: 40.7128,
    longitude: -74.0060,
    country: "United States",
    admin1: "New York"
};

// Weather Code Mapping (WMO codes to text, icon names and backgrounds)
const WEATHER_CODES = {
    0: { text: "Clear Sky", icon: "sun", class: "theme-sunny" },
    1: { text: "Mainly Clear", icon: "cloud-sun", class: "theme-sunny" },
    2: { text: "Partly Cloudy", icon: "cloud", class: "theme-cloudy" },
    3: { text: "Overcast", icon: "cloudy", class: "theme-cloudy" },
    45: { text: "Foggy", icon: "cloud-fog", class: "theme-cloudy" },
    48: { text: "Depositing Rime Fog", icon: "cloud-fog", class: "theme-cloudy" },
    51: { text: "Light Drizzle", icon: "cloud-drizzle", class: "theme-rainy" },
    53: { text: "Moderate Drizzle", icon: "cloud-drizzle", class: "theme-rainy" },
    55: { text: "Dense Drizzle", icon: "cloud-drizzle", class: "theme-rainy" },
    56: { text: "Light Freezing Drizzle", icon: "cloud-drizzle", class: "theme-rainy" },
    57: { text: "Dense Freezing Drizzle", icon: "cloud-drizzle", class: "theme-rainy" },
    61: { text: "Slight Rain", icon: "cloud-rain", class: "theme-rainy" },
    63: { text: "Moderate Rain", icon: "cloud-rain", class: "theme-rainy" },
    65: { text: "Heavy Rain", icon: "cloud-showers-heavy", class: "theme-rainy" },
    66: { text: "Light Freezing Rain", icon: "cloud-hail", class: "theme-rainy" },
    67: { text: "Heavy Freezing Rain", icon: "cloud-hail", class: "theme-rainy" },
    71: { text: "Slight Snow", icon: "cloud-snow", class: "theme-snowy" },
    73: { text: "Moderate Snow", icon: "cloud-snow", class: "theme-snowy" },
    75: { text: "Heavy Snow", icon: "snowflake", class: "theme-snowy" },
    77: { text: "Snow Grains", icon: "snowflake", class: "theme-snowy" },
    80: { text: "Slight Rain Showers", icon: "cloud-drizzle", class: "theme-rainy" },
    81: { text: "Moderate Rain Showers", icon: "cloud-rain", class: "theme-rainy" },
    82: { text: "Violent Rain Showers", icon: "cloud-showers-heavy", class: "theme-rainy" },
    85: { text: "Slight Snow Showers", icon: "cloud-snow", class: "theme-snowy" },
    86: { text: "Heavy Snow Showers", icon: "snowflake", class: "theme-snowy" },
    95: { text: "Thunderstorm", icon: "cloud-lightning", class: "theme-thunderstorm" },
    96: { text: "Thunderstorm with Hail", icon: "cloud-lightning", class: "theme-thunderstorm" },
    99: { text: "Thunderstorm with Heavy Hail", icon: "cloud-lightning", class: "theme-thunderstorm" }
};

// Global App State
let currentCity = { ...DEFAULT_CITY };
let favorites = JSON.parse(localStorage.getItem("weather_favorites")) || [];
let homeLocation = JSON.parse(localStorage.getItem("weather_home")) || null;
let workLocation = JSON.parse(localStorage.getItem("weather_work")) || null;
let temperatureUnit = localStorage.getItem("weather_unit") || "C"; // 'C' or 'F'

// Initialization
document.addEventListener("DOMContentLoaded", () => {
    // UI Event Listeners
    const searchInput = document.getElementById("city-search");
    const searchBtn = document.getElementById("search-btn");
    const suggestionsBox = document.getElementById("search-suggestions");
    const toggleUnitBtn = document.getElementById("toggle-unit-btn");
    const addFavoriteBtn = document.getElementById("add-favorite-btn");

    const homeBtn = document.getElementById("home-btn");
    const workBtn = document.getElementById("work-btn");
    const setHomeBtn = document.getElementById("set-home-btn");
    const setWorkBtn = document.getElementById("set-work-btn");
    const locateBtn = document.getElementById("locate-btn");

    // Initial UI render of favorites and home/work buttons
    renderFavorites();
    updatePresetButtons();

    // Check Geolocation permission on load
    requestLocalWeather();

    // Auto-suggest city names as user types
    let debounceTimer;
    searchInput.addEventListener("input", (e) => {
        clearTimeout(debounceTimer);
        const query = e.target.value.trim();
        if (query.length < 2) {
            suggestionsBox.classList.add("hidden");
            return;
        }

        debounceTimer = setTimeout(() => {
            fetchCities(query);
        }, 300);
    });

    // Close suggestions when clicking outside
    document.addEventListener("click", (e) => {
        if (!searchInput.contains(e.target) && !suggestionsBox.contains(e.target)) {
            suggestionsBox.classList.add("hidden");
        }
    });

    searchBtn.addEventListener("click", () => {
        const query = searchInput.value.trim();
        if (query) {
            fetchCities(query, true); // True means automatically select the first result
        }
    });

    searchInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            const query = searchInput.value.trim();
            if (query) {
                fetchCities(query, true);
            }
        }
    });

    toggleUnitBtn.addEventListener("click", () => {
        temperatureUnit = temperatureUnit === "C" ? "F" : "C";
        localStorage.setItem("weather_unit", temperatureUnit);
        toggleUnitBtn.textContent = `°${temperatureUnit === "C" ? "F" : "C"}`;
        loadWeatherForCity(currentCity);
    });

    addFavoriteBtn.addEventListener("click", () => {
        toggleFavorite(currentCity);
    });

    // Locate Me action
    locateBtn.addEventListener("click", () => {
        requestLocalWeather(true);
    });

    // Home / Work action triggers
    homeBtn.addEventListener("click", () => {
        if (homeLocation) {
            selectCity(homeLocation);
        } else {
            alert("No Home location set. Search a city and click 'Set Home'.");
        }
    });

    workBtn.addEventListener("click", () => {
        if (workLocation) {
            selectCity(workLocation);
        } else {
            alert("No Work location set. Search a city and click 'Set Work'.");
        }
    });

    setHomeBtn.addEventListener("click", () => {
        homeLocation = { ...currentCity };
        localStorage.setItem("weather_home", JSON.stringify(homeLocation));
        updatePresetButtons();
        alert(`Saved ${currentCity.name} as Home!`);
    });

    setWorkBtn.addEventListener("click", () => {
        workLocation = { ...currentCity };
        localStorage.setItem("weather_work", JSON.stringify(workLocation));
        updatePresetButtons();
        alert(`Saved ${currentCity.name} as Work!`);
    });
});

// Request Geolocation and load weather
function requestLocalWeather(forced = false) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;

                // Attempt reverse-geocode to look up city name
                let name = "Current Location";
                let country = "";
                let admin1 = "";
                try {
                    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=en`);
                    const data = await response.json();
                    if (data.address) {
                        name = data.address.city || data.address.town || data.address.village || data.address.suburb || "Current Location";
                        country = data.address.country || "";
                        admin1 = data.address.state || "";
                    }
                } catch (err) {
                    console.warn("Reverse geocode failed, using coordinates fallback:", err);
                }

                const localCity = {
                    name: name,
                    latitude: lat,
                    longitude: lon,
                    country: country,
                    admin1: admin1
                };

                selectCity(localCity);
            },
            (error) => {
                console.warn("Geolocation access denied or failed:", error);
                if (forced) {
                    alert("Location access denied or unavailable.");
                }
                // Fall back to default city on load
                loadWeatherForCity(currentCity);
            }
        );
    } else {
        if (forced) alert("Geolocation not supported by this browser.");
        loadWeatherForCity(currentCity);
    }
}

// Update Home/Work presets display
function updatePresetButtons() {
    const homeBtn = document.getElementById("home-btn");
    const workBtn = document.getElementById("work-btn");

    if (homeLocation) {
        homeBtn.classList.remove("preset-empty");
        homeBtn.innerHTML = `<i data-lucide="home" class="w-4 h-4"></i> Home: ${homeLocation.name}`;
    } else {
        homeBtn.classList.add("preset-empty");
        homeBtn.innerHTML = `<i data-lucide="home" class="w-4 h-4"></i> Setup Home`;
    }

    if (workLocation) {
        workBtn.classList.remove("preset-empty");
        workBtn.innerHTML = `<i data-lucide="briefcase" class="w-4 h-4"></i> Work: ${workLocation.name}`;
    } else {
        workBtn.classList.add("preset-empty");
        workBtn.innerHTML = `<i data-lucide="briefcase" class="w-4 h-4"></i> Setup Work`;
    }

    lucide.createIcons();
}

// Fetch cities from Geocoding API
async function fetchCities(query, autoSelect = false) {
    try {
        const response = await fetch(`${GEO_API_URL}?name=${encodeURIComponent(query)}&count=5&language=en&format=json`);
        const data = await response.json();

        if (data.results && data.results.length > 0) {
            if (autoSelect) {
                selectCity(data.results[0]);
                document.getElementById("search-suggestions").classList.add("hidden");
            } else {
                renderSuggestions(data.results);
            }
        } else if (autoSelect) {
            alert("City not found. Try searching for another name.");
        }
    } catch (error) {
        console.error("Error fetching cities:", error);
    }
}

// Render search suggestions list
function renderSuggestions(cities) {
    const suggestionsBox = document.getElementById("search-suggestions");
    suggestionsBox.innerHTML = "";
    suggestionsBox.classList.remove("hidden");

    cities.forEach(city => {
        const div = document.createElement("div");
        div.className = "p-3 hover:bg-white/10 cursor-pointer transition border-b border-white/5 last:border-b-0 flex justify-between items-center text-white text-sm";

        const nameSpan = document.createElement("span");
        nameSpan.className = "font-medium";
        nameSpan.textContent = `${city.name}${city.admin1 ? ', ' + city.admin1 : ''}`;

        const countrySpan = document.createElement("span");
        countrySpan.className = "text-white/60 text-xs font-light";
        countrySpan.textContent = city.country || "";

        div.appendChild(nameSpan);
        div.appendChild(countrySpan);

        div.addEventListener("click", () => {
            selectCity(city);
            suggestionsBox.classList.add("hidden");
        });

        suggestionsBox.appendChild(div);
    });
}

// Select city and load its weather
function selectCity(city) {
    currentCity = {
        name: city.name,
        latitude: city.latitude,
        longitude: city.longitude,
        country: city.country,
        admin1: city.admin1
    };

    document.getElementById("city-search").value = city.name === "Current Location" ? "" : city.name;
    loadWeatherForCity(currentCity);
}

// Load Weather details
async function loadWeatherForCity(city) {
    const container = document.getElementById("weather-content");
    container.classList.add("opacity-50");

    try {
        const url = `${WEATHER_API_URL}?latitude=${city.latitude}&longitude=${city.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,wind_speed_10m&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max&timezone=auto`;
        const response = await fetch(url);
        const data = await response.json();

        renderWeather(data, city);
    } catch (error) {
        console.error("Error fetching weather:", error);
    } finally {
        container.classList.remove("opacity-50");
    }
}

// Render Weather values on the Page
function renderWeather(data, city) {
    // Current Weather Info
    const current = data.current;
    const weatherInfo = WEATHER_CODES[current.weather_code] || { text: "Unknown", icon: "help-circle", class: "theme-cloudy" };

    // Update Theme Background
    updateAppTheme(weatherInfo.class);

    // Update Favorite Button State
    const addFavoriteBtn = document.getElementById("add-favorite-btn");
    const isFav = favorites.some(fav => fav.name === city.name && Math.abs(fav.latitude - city.latitude) < 0.1);
    if (isFav) {
        addFavoriteBtn.innerHTML = `<i data-lucide="star" class="fill-yellow-400 text-yellow-400 w-5 h-5"></i>`;
    } else {
        addFavoriteBtn.innerHTML = `<i data-lucide="star" class="w-5 h-5 text-white/80"></i>`;
    }

    // Convert temperature units if needed
    const displayTemp = (t) => {
        if (temperatureUnit === "F") {
            return Math.round((t * 9 / 5) + 32) + "°F";
        }
        return Math.round(t) + "°C";
    };

    // Current Temp & Location
    document.getElementById("current-temp").textContent = displayTemp(current.temperature_2m);
    document.getElementById("current-city").textContent = city.name;
    document.getElementById("current-country").textContent = `${city.admin1 ? city.admin1 + ', ' : ''}${city.country}`;
    document.getElementById("current-condition-text").textContent = weatherInfo.text;

    // Weather Icon
    const iconContainer = document.getElementById("current-weather-icon");
    iconContainer.innerHTML = `<i data-lucide="${weatherInfo.icon}" class="w-20 h-20 text-white drop-shadow-lg animate-pulse"></i>`;

    // Details Grid
    document.getElementById("feels-like-val").textContent = displayTemp(current.apparent_temperature);
    document.getElementById("humidity-val").textContent = `${current.relative_humidity_2m}%`;
    document.getElementById("wind-val").textContent = `${Math.round(current.wind_speed_10m)} km/h`;
    document.getElementById("precipitation-val").textContent = `${current.precipitation} mm`;

    // Sunrise/Sunset & UV Index
    const today = new Date().toISOString().split('T')[0];
    const dailyIndex = data.daily.time.indexOf(today);

    if (dailyIndex !== -1) {
        const formatTime = (timeStr) => {
            const date = new Date(timeStr);
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        };
        document.getElementById("sunrise-val").textContent = formatTime(data.daily.sunrise[dailyIndex]);
        document.getElementById("sunset-val").textContent = formatTime(data.daily.sunset[dailyIndex]);
        document.getElementById("uv-val").textContent = data.daily.uv_index_max[dailyIndex] || "N/A";
    }

    // Render Hourly Forecast (Next 24 hours)
    const hourlyContainer = document.getElementById("hourly-track");
    hourlyContainer.innerHTML = "";

    const currentHour = new Date().getHours();
    for (let i = currentHour; i < currentHour + 24; i++) {
        if (i >= data.hourly.time.length) break;

        const time = new Date(data.hourly.time[i]);
        const temp = data.hourly.temperature_2m[i];
        const code = data.hourly.weather_code[i];
        const hInfo = WEATHER_CODES[code] || { text: "Unknown", icon: "help-circle" };

        const card = document.createElement("div");
        card.className = "hourly-card";

        const timeSpan = document.createElement("span");
        timeSpan.className = "hourly-time";
        timeSpan.textContent = i === currentHour ? "Now" : time.toLocaleTimeString([], { hour: '2-digit' });

        const iconDiv = document.createElement("div");
        iconDiv.className = "hourly-icon";
        iconDiv.innerHTML = `<i data-lucide="${hInfo.icon}"></i>`;

        const tempSpan = document.createElement("span");
        tempSpan.className = "hourly-temp";
        tempSpan.textContent = displayTemp(temp);

        card.appendChild(timeSpan);
        card.appendChild(iconDiv);
        card.appendChild(tempSpan);

        hourlyContainer.appendChild(card);
    }

    // Render Weekly Forecast
    const weeklyContainer = document.getElementById("weekly-forecast-list");
    weeklyContainer.innerHTML = "";

    data.daily.time.forEach((dayStr, idx) => {
        const date = new Date(dayStr);
        const maxTemp = data.daily.temperature_2m_max[idx];
        const minTemp = data.daily.temperature_2m_min[idx];
        const code = data.daily.weather_code[idx];
        const dInfo = WEATHER_CODES[code] || { text: "Unknown", icon: "help-circle" };

        const row = document.createElement("div");
        row.className = "weekly-row";

        const daySpan = document.createElement("span");
        daySpan.className = "weekly-day";
        daySpan.textContent = idx === 0 ? "Today" : date.toLocaleDateString([], { weekday: 'long' });

        const iconInfoDiv = document.createElement("div");
        iconInfoDiv.className = "weekly-desc";
        iconInfoDiv.innerHTML = `<i data-lucide="${dInfo.icon}"></i> <span>${dInfo.text}</span>`;

        const tempSpan = document.createElement("span");
        tempSpan.className = "weekly-temp";
        tempSpan.innerHTML = `<span>${displayTemp(maxTemp)}</span> <span class="temp-min">${displayTemp(minTemp)}</span>`;

        row.appendChild(daySpan);
        row.appendChild(iconInfoDiv);
        row.appendChild(tempSpan);

        weeklyContainer.appendChild(row);
    });

    // Refresh Lucide Icons on dynamic elements
    lucide.createIcons();
}

// Toggle Favorites
function toggleFavorite(city) {
    const existsIdx = favorites.findIndex(fav => fav.name === city.name && Math.abs(fav.latitude - city.latitude) < 0.1);

    if (existsIdx !== -1) {
        favorites.splice(existsIdx, 1);
    } else {
        favorites.push({ ...city });
    }

    localStorage.setItem("weather_favorites", JSON.stringify(favorites));
    renderFavorites();

    // Re-trigger load to refresh favorites star icon styling
    loadWeatherForCity(currentCity);
}

// Render Favorites list in sidebar
function renderFavorites() {
    const container = document.getElementById("favorites-list");
    container.innerHTML = "";

    if (favorites.length === 0) {
        container.innerHTML = `<div class="fav-empty-msg">No saved locations. Click star above to bookmark here.</div>`;
        return;
    }

    favorites.forEach(city => {
        const itemDiv = document.createElement("div");
        itemDiv.className = "fav-item";

        const textSpan = document.createElement("span");
        textSpan.className = "fav-text";
        textSpan.textContent = `${city.name}, ${city.country || city.admin1}`;
        textSpan.addEventListener("click", () => {
            selectCity(city);
        });

        const deleteBtn = document.createElement("button");
        deleteBtn.className = "fav-delete-btn";
        deleteBtn.innerHTML = `<i data-lucide="trash-2"></i>`;
        deleteBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            toggleFavorite(city);
        });

        itemDiv.appendChild(textSpan);
        itemDiv.appendChild(deleteBtn);
        container.appendChild(itemDiv);
    });
}

// Dynamically change gradient overlay classes on body/main containers
function updateAppTheme(themeClass) {
    const appBody = document.getElementById("app-background");
    appBody.className = "app-background-container " + themeClass;
}
