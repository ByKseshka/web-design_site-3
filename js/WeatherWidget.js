import { UIComponent } from './UIComponent.js';

export class WeatherWidget extends UIComponent {
  static API = 'https://api.open-meteo.com/v1/forecast';
  static #counter = 0;

  #timerId = null;
  #lat;
  #lon;
  #city;

  constructor({ id, title = '☁️ Погода', lat = 59.9343, lon = 30.3351, city = 'Санкт-Петербург', refreshInterval = 600000 } = {}) {
    super({ id: id ?? `weather-${++WeatherWidget.#counter}`, title });
    this.#lat = lat;
    this.#lon = lon;
    this.#city = city;
    this.refreshInterval = refreshInterval;
  }

  renderBody() {
    const wrap = document.createElement('div');
    wrap.className = 'weather';
    wrap.innerHTML = `<div class="widget__loader">Загрузка погоды…</div>`;
    return wrap;
  }

  bindEvents() {
    this.#load();
    if (this.refreshInterval > 0) {
      this.#timerId = setInterval(() => this.#load(), this.refreshInterval);
    }
  }

  async #load() {
    const wrap = this.$('.weather');
    if (!wrap) return;

    try {
      const url = `${WeatherWidget.API}?latitude=${this.#lat}&longitude=${this.#lon}`
                + `&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Open-Meteo: ${res.status}`);
      const data = await res.json();
      this.#render(wrap, data.current);
    } catch (err) {
      console.warn('Open-Meteo недоступен, демо-данные:', err.message);
      this.#render(wrap, {
        temperature_2m: 8,
        relative_humidity_2m: 78,
        wind_speed_10m: 14,
        weather_code: 3
      });
    }
  }

  #codeToEmoji(code) {
    if (code === 0) return '☀️';
    if (code <= 3) return '⛅';
    if (code <= 48) return '🌫️';
    if (code <= 67) return '🌧️';
    if (code <= 77) return '❄️';
    if (code <= 82) return '🌦️';
    if (code <= 99) return '⛈️';
    return '🌡️';
  }

  #render(wrap, current) {
    wrap.innerHTML = `
      <div class="weather__main">
        <div class="weather__icon">${this.#codeToEmoji(current.weather_code)}</div>
        <div class="weather__temp">${current.temperature_2m}°C</div>
      </div>
      <div class="weather__city">${this.#city}</div>
      <div class="weather__details">
        <div class="weather__detail">💧 ${current.relative_humidity_2m}%</div>
        <div class="weather__detail">💨 ${current.wind_speed_10m} км/ч</div>
      </div>
    `;
  }

  onDestroy() {
    if (this.#timerId) clearInterval(this.#timerId);
    this.#timerId = null;
  }
}