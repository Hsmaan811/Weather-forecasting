# Skycast: Weather Web Application

Skycast is a responsive, browser-based weather application that provides live weather conditions and a 7-day forecast for any city. The application utilizes open-source APIs to pull live data without requiring the user to configure API keys. Built with HTML, CSS, and Vanilla JavaScript, Skycast offers a clean, card-based interface with a toggleable navigation system to switch between current weather data and upcoming weekly outlooks.

---

## 🌟 Features

* **Real-Time Live Conditions**: Users can search for a city to view the current temperature, wind speed, relative humidity, 'feels like' temperature, and wind direction.
* **24-Hour Hourly Strip**: The home page features a horizontally scrollable panel displaying upcoming hourly weather predictions, including temperature and wind metrics.
* **7-Day Forecast**: A dedicated forecast page displays the expected highs, lows, and maximum wind speeds for the week ahead.
* **Geolocation Integration**: A dedicated location button allows users to fetch their current local weather using their device's GPS coordinates.
* **Search History**: The application utilizes local storage to save recently searched cities, displaying them as clickable "chips" for quick access.
* **Dynamic SVG Iconography**: The interface automatically generates custom SVG weather icons (e.g., sun, cloud, rain, snow) mapped to specific WMO (World Meteorological Organization) weather codes.
* **Live Clock**: A footer element displays a real-time clock that updates every 30 seconds.
* **Responsive Design**: The UI includes CSS media queries that adjust form inputs, flex layouts, and daily forecast rows for mobile screens under 600px wide.

---

## 🛠️ Technologies & APIs Used

### Frontend
* **HTML5**: Structure and semantic tagging for two distinct views (`index.html` and `forecast.html`).
* **CSS3**: Custom CSS using native variables for theming, flexbox for layout, and modern styling attributes like rounded corners and subtle box shadows.
* **Vanilla JavaScript**: Handles all application logic, event listeners, API fetching, and dynamic DOM manipulation.

### External APIs
* **Open-Meteo Forecast API**: Fetches current, hourly, and daily weather data.
* **Open-Meteo Geocoding API**: Converts user search queries into latitude and longitude coordinates.
* **BigDataCloud Reverse Geocoding API**: Translates user GPS coordinates back into readable city or locality names.

---

## 📁 Project Structure

* `index.html`: The main dashboard page displaying live conditions and the next 24 hours of weather.
* `forecast.html`: The secondary page dedicated to showing the 7-day outlook.
* `weather.css`: The global stylesheet containing color variables (`--bg-app`, `--accent`, etc.), panel styling, and mobile responsiveness.
* `weathscript.js`: The central script handling data fetching, local storage management (`skycast:selectedPlace` and `skycast:recents`), and UI rendering functions.

---

## 🚀 How to Run

1. Download all four files (`index.html`, `forecast.html`, `weather.css`, and `weathscript.js`) into the same directory.
2. Open `index.html` directly in any modern web browser.
3. No build tools, Node.js installations, or API keys are required to view and test the application locally.
