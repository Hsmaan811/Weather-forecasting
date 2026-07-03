const GEOCODE_URL = "https://geocoding-api.open-meteo.com/v1/search";
const REVERSE_GEOCODE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";
const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";
const STORAGE_KEY = "skycast:selectedPlace";
const RECENTS_KEY = "skycast:recents";

const WMO = {
  0: ["Clear sky", "sun"],
  1: ["Mostly clear", "sun"],
  2: ["Partly cloudy", "cloud-sun"],
  3: ["Overcast", "cloud"],
  45: ["Fog", "fog"],
  48: ["Rime fog", "fog"],
  51: ["Light drizzle", "drizzle"],
  53: ["Drizzle", "drizzle"],
  55: ["Dense drizzle", "drizzle"],
  56: ["Freezing drizzle", "drizzle"],
  57: ["Freezing drizzle", "drizzle"],
  61: ["Light rain", "rain"],
  63: ["Rain", "rain"],
  65: ["Heavy rain", "rain"],
  66: ["Freezing rain", "rain"],
  67: ["Freezing rain", "rain"],
  71: ["Light snow", "snow"],
  73: ["Snow", "snow"],
  75: ["Heavy snow", "snow"],
  77: ["Snow grains", "snow"],
  80: ["Light showers", "rain"],
  81: ["Showers", "rain"],
  82: ["Violent showers", "rain"],
  85: ["Snow showers", "snow"],
  86: ["Snow showers", "snow"],
  95: ["Thunderstorm", "storm"],
  96: ["Thunderstorm, hail", "storm"],
  99: ["Thunderstorm, hail", "storm"],
};

function weatherInfo(code) { return WMO[code] || ["Unknown", "cloud"]; }

function weatherIcon(key) {
  const icons = {
    sun: `<circle cx="12" cy="12" r="4.4"/><g stroke-linecap="round"><path d="M12 2.5v2.6M12 18.9v2.6M21.5 12h-2.6M5.1 12H2.5M18.5 5.5l-1.8 1.8M7.3 16.7l-1.8 1.8M18.5 18.5l-1.8-1.8M7.3 7.3 5.5 5.5"/></g>`,
    "cloud-sun": `<circle cx="8.5" cy="8.5" r="3.4"/><g stroke-linecap="round"><path d="M8.5 2.8v1.8M8.5 12.4v1.3M13.9 8.5h-1.8M4.4 8.5H3M12.3 4.7l-1.2 1.2M5.9 11.1l-1.2 1.2"/></g><path d="M6.5 21.2h11a3.6 3.6 0 0 0 .6-7.15 4.9 4.9 0 0 0-9.3-1.7 3.9 3.9 0 0 0-2.3 8.85z"/>`,
    cloud: `<path d="M6.2 20h11.6a3.9 3.9 0 0 0 .5-7.77 5.3 5.3 0 0 0-10.14-1.5A4.2 4.2 0 0 0 6.2 20z"/>`,
    fog: `<path d="M6.2 15.3h11.6a3.9 3.9 0 0 0 .3-7.78 5.3 5.3 0 0 0-9.94-2.02A4.2 4.2 0 0 0 6.2 15.3z"/><g stroke-linecap="round"><path d="M4 18.4h16M4 21.4h16"/></g>`,
    drizzle: `<path d="M6.2 13.3h11.6a3.9 3.9 0 0 0 .3-7.78A5.3 5.3 0 0 0 8.16 3.5 4.2 4.2 0 0 0 6.2 13.3z"/><g stroke-linecap="round"><path d="M8.5 17.5l-1 2.2M12.5 17.5l-1 2.2M16.5 17.5l-1 2.2"/></g>`,
    rain: `<path d="M6.2 12.6h11.6a3.9 3.9 0 0 0 .3-7.78A5.3 5.3 0 0 0 8.16 2.8 4.2 4.2 0 0 0 6.2 12.6z"/><g stroke-linecap="round"><path d="M7.5 16.5l-1.6 3.6M13 16.5l-1.6 3.6M18.5 16.5l-1.6 3.6"/></g>`,
    snow: `<path d="M6.2 11.6h11.6a3.9 3.9 0 0 0 .3-7.78A5.3 5.3 0 0 0 8.16 1.8 4.2 4.2 0 0 0 6.2 11.6z"/><g stroke-linecap="round"><path d="M8 16.2v6M5.3 17.7l5.4 3M13.3 17.7l-5.4 3M16 16.2v6M13.3 17.7l5.4 3M18.7 17.7l-5.4 3"/></g>`,
    storm: `<path d="M6.2 11.6h11.6a3.9 3.9 0 0 0 .3-7.78A5.3 5.3 0 0 0 8.16 1.8 4.2 4.2 0 0 0 6.2 11.6z"/><path d="M13 14.5l-3.4 5h3l-1.8 4.2 5.4-6.2h-3.2z" fill="currentColor" stroke="none"/>`,
  };
  const body = icons[key] || icons.cloud;
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" xmlns="http://www.w3.org/2000/svg">${body}</svg>`;
}

async function geocodeCity(name) {
  const url = `${GEOCODE_URL}?name=${encodeURIComponent(name)}&count=5&language=en&format=json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("geocode-failed");
  const data = await res.json();
  return data.results || [];
}

// Turns lat/lon from the GPS button into a human-readable place name.
async function reverseGeocode(lat, lon) {
  try {
    const url = `${REVERSE_GEOCODE_URL}?latitude=${lat}&longitude=${lon}&localityLanguage=en`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("reverse-geocode-failed");
    const data = await res.json();
    const parts = [data.city || data.locality, data.principalSubdivision, data.countryName].filter(Boolean);
    return parts.length ? parts.join(", ") : "Your Location";
  } catch (err) {
    return "Your Location";
  }
}

async function fetchForecast(lat, lon) {
  const params = new URLSearchParams({
    latitude: lat,
    longitude: lon,
    current: "temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,wind_direction_10m,weather_code",
    hourly: "temperature_2m,weather_code,wind_speed_10m",
    daily: "weather_code,temperature_2m_max,temperature_2m_min,wind_speed_10m_max",
    wind_speed_unit: "kmh",
    timezone: "auto",
    forecast_days: "7",
  });
  const res = await fetch(`${FORECAST_URL}?${params.toString()}`);
  if (!res.ok) throw new Error("forecast-failed");
  return res.json();
}

function savePlace(place) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(place));
  const recents = getRecents().filter((r) => r.label !== place.label);
  recents.unshift(place);
  localStorage.setItem(RECENTS_KEY, JSON.stringify(recents.slice(0, 5)));
}

function getPlace() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)); }
  catch (e) { return null; }
}

function getRecents() {
  try { return JSON.parse(localStorage.getItem(RECENTS_KEY)) || []; }
  catch (e) { return []; }
}

function compassLabel(deg) {
  const dirs = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  return dirs[Math.round(deg / 22.5) % 16];
}

function formatHour(iso) { return new Date(iso).toLocaleTimeString([], { hour: "numeric" }); }
function formatDay(iso, index) { return index === 0 ? "Today" : new Date(iso).toLocaleDateString([], { weekday: "short" }); }
function formatDate(iso) { return new Date(iso).toLocaleDateString([], { month: "short", day: "numeric" }); }

const content = document.getElementById("content");
const clockEl = document.getElementById("clock");

function tickClock() {
  if (clockEl) clockEl.textContent = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
tickClock();
setInterval(tickClock, 30000);

const form = document.getElementById("search-form");
// The forecast page has a #place-heading element; the "now" page doesn't.
const isForecastPage = !!document.getElementById("place-heading");

if (form) {
  const input = document.getElementById("city-input");
  const statusEl = document.getElementById("search-status");
  const chipsEl = document.getElementById("recent-chips");
  const locateBtn = document.getElementById("locate-btn");

  function setStatus(msg, type) {
    statusEl.textContent = msg || "";
    statusEl.className = "search-status" + (type ? " " + type : "");
  }

  function renderChips() {
    const recents = getRecents();
    chipsEl.innerHTML = recents
      .map((r) => `<button class="chip" data-lat="${r.lat}" data-lon="${r.lon}" data-label="${r.label}">${r.label}</button>`)
      .join("");
    chipsEl.querySelectorAll(".chip").forEach((btn) => {
      btn.addEventListener("click", () => loadPlace({ lat: btn.dataset.lat, lon: btn.dataset.lon, label: btn.dataset.label }));
    });
  }

  function renderEmptyState() {
    if (isForecastPage) {
      content.innerHTML = `<div class="empty-state"><p>No city selected yet.</p><p>Search above to see the 7-day forecast.</p></div>`;
    } else {
      content.innerHTML = `<div class="empty-state"><p>No city loaded yet.</p><p>Search above to get started.</p></div>`;
    }
  }

  function renderCompassSVG(deg) {
    return `
    <div class="compass-wrap">
      <span class="label">Wind Dir</span>
      <span class="value">${compassLabel(deg)}</span>
    </div>`;
  }

  function renderNow(place, data) {
    const cur = data.current;
    const [label, iconKey] = weatherInfo(cur.weather_code);

    content.innerHTML = `
      <div class="panel">
        <div class="panel-header">
          <h2>${place.label}</h2>
          <p>Updated: ${new Date(cur.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
        </div>
        <div class="panel-icon">${weatherIcon(iconKey)}</div>
        <div class="panel-temp">${Math.round(cur.temperature_2m)}°C</div>
        <div class="panel-desc">${label}</div>

        <div class="stat-row">
          <div class="stat"><span class="label">Feels like</span><span class="value">${Math.round(cur.apparent_temperature)}°C</span></div>
          <div class="stat"><span class="label">Humidity</span><span class="value">${cur.relative_humidity_2m}%</span></div>
          <div class="stat"><span class="label">Wind</span><span class="value">${Math.round(cur.wind_speed_10m)} km/h</span></div>
          ${renderCompassSVG(cur.wind_direction_10m)}
        </div>
      </div>
      <h3 class="section-title">Next 24 hours</h3>
      <div class="hourly-strip" id="hourly-strip"></div>
    `;
    renderHourly(data);
  }

  function renderHourly(data) {
    const strip = document.getElementById("hourly-strip");
    const now = new Date();
    const hourly = data.hourly;
    let startIdx = hourly.time.findIndex((t) => new Date(t) >= now);
    if (startIdx === -1) startIdx = 0;

    strip.innerHTML = hourly.time.slice(startIdx, startIdx + 24)
      .map((t, i) => {
        const idx = startIdx + i;
        const temp = Math.round(hourly.temperature_2m[idx]);
        const wind = Math.round(hourly.wind_speed_10m[idx]);
        const [, iconKey] = weatherInfo(hourly.weather_code[idx]);
        return `
          <div class="hour-card">
            <b>${i === 0 ? "Now" : formatHour(t)}</b>
            <div class="hour-icon">${weatherIcon(iconKey)}</div>
            <div class="hour-temp">${temp}°</div>
            <div class="hour-wind">${wind} km/h</div>
          </div>`;
      }).join("");
  }

  function renderDays(place, data) {
    const heading = document.getElementById("place-heading");
    const sub = document.getElementById("place-sub");
    if (heading) heading.textContent = `Forecast for ${place.label}`;
    if (sub) sub.textContent = "The weather for the next 7 days.";

    const daily = data.daily;
    content.innerHTML = `<div class="forecast-list">` + daily.time.map((t, i) => {
      const [label, iconKey] = weatherInfo(daily.weather_code[i]);
      const hi = Math.round(daily.temperature_2m_max[i]);
      const lo = Math.round(daily.temperature_2m_min[i]);
      const wind = Math.round(daily.wind_speed_10m_max[i]);

      return `
        <div class="day-row">
          <div class="day-info">
            <h3>${formatDay(t, i)}</h3>
            <p>${formatDate(t)}</p>
          </div>
          <div class="day-icon">${weatherIcon(iconKey)}</div>
          <div class="day-desc">${label}</div>
          <div class="day-wind">${wind} km/h</div>
          <div class="range-bar">
            L: ${lo}° &nbsp;|&nbsp; <span class="high">H: ${hi}°</span>
          </div>
        </div>`;
    }).join("") + `</div>`;
  }

  async function loadPlace(place) {
    content.innerHTML = `<p style="text-align:center; color:var(--text-muted); padding:40px 0;">Loading weather…</p>`;
    setStatus("");
    try {
      const data = await fetchForecast(place.lat, place.lon);
      savePlace(place);
      renderChips();
      if (isForecastPage) renderDays(place, data);
      else renderNow(place, data);
    } catch (err) {
      content.innerHTML = "";
      setStatus("Couldn't load the weather. Please try again.", "error");
    }
  }

  async function handleSearch(query) {
    setStatus("Searching…", "ok");
    try {
      const results = await geocodeCity(query);
      if (!results.length) { setStatus("No city found.", "error"); return; }
      const top = results[0];
      const label = [top.name, top.admin1, top.country].filter(Boolean).join(", ");
      setStatus("Found it!", "ok");
      loadPlace({ lat: top.latitude, lon: top.longitude, label });
    } catch (err) {
      setStatus("Search failed. Please try again.", "error");
    }
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (input.value.trim()) handleSearch(input.value.trim());
  });

  locateBtn.addEventListener("click", () => {
    if (!navigator.geolocation) return setStatus("Location isn't supported on this device.", "error");
    setStatus("Finding your location…");
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const label = await reverseGeocode(latitude, longitude);
        loadPlace({ lat: latitude, lon: longitude, label });
      },
      () => setStatus("Couldn't get your location.", "error")
    );
  });

  renderChips();
  const saved = getPlace();
  if (saved) loadPlace(saved); else renderEmptyState();
}