import { UIComponent } from './UIComponent.js';

/**
 * Виджет «Курсы валют» — USD → EUR / TRY / RUB.
 * API: https://api.frankfurter.app/latest
 */
export class CurrencyWidget extends UIComponent {
  static API = 'https://api.frankfurter.app/latest';
  static #counter = 0;

  #timerId = null;

  constructor({ id, title = '💵 Курсы валют', refreshInterval = 300000 } = {}) {
    super({ id: id ?? `currency-${++CurrencyWidget.#counter}`, title });
    this.refreshInterval = refreshInterval;
  }

  renderBody() {
    const wrap = document.createElement('div');
    wrap.className = 'currency';
    wrap.innerHTML = `<div class="widget__loader">Загрузка курсов…</div>`;
    return wrap;
  }

  bindEvents() {
    this.#load();
    if (this.refreshInterval > 0) {
      this.#timerId = setInterval(() => this.#load(), this.refreshInterval);
    }
  }

  async #load() {
    const wrap = this.$('.currency');
    if (!wrap) return;

    try {
      const url = `${CurrencyWidget.API}?from=USD&to=EUR,TRY,RUB`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Frankfurter: ${res.status}`);
      const data = await res.json();
      this.#render(wrap, data);
    } catch (err) {
      console.warn('Frankfurter недоступен, демо-данные:', err.message);
      this.#render(wrap, {
        date: new Date().toISOString().slice(0, 10),
        rates: { EUR: 0.92, TRY: 34.18, RUB: 97.5 }
      });
    }
  }

  #render(wrap, data) {
    const flags = { EUR: '🇪🇺', TRY: '🇹🇷', RUB: '🇷🇺' };
    const names = { EUR: 'Евро',  TRY: 'Турецкая лира', RUB: 'Рубль' };
    const order = ['EUR', 'TRY', 'RUB'];

    const rows = order.map(code => {
      const rate = data.rates[code];
      if (rate == null) return '';
      return `
        <div class="currency-row">
          <span class="currency-row__flag">${flags[code]}</span>
          <div class="currency-row__name">
            <span class="currency-row__code">${code}</span>
            <span class="currency-row__label">${names[code]}</span>
          </div>
          <span class="currency-row__rate">${rate.toFixed(4)}</span>
        </div>
      `;
    }).join('');

    wrap.innerHTML = `
      <div class="currency__base">
        <span class="currency__base-label">1 USD =</span>
      </div>
      <div class="currency__list">${rows}</div>
      <div class="currency__meta">Обновлено: ${data.date}</div>
    `;
  }

  onDestroy() {
    if (this.#timerId) clearInterval(this.#timerId);
    this.#timerId = null;
  }
}