import { UIComponent } from './UIComponent.js';

export class CheapSharkWidget extends UIComponent {
  static API = 'https://www.cheapshark.com/api/1.0/deals';
  static #counter = 0;

  constructor({ id, title = '🎮 Скидки на игры' } = {}) {
    super({ id: id ?? `cheapshark-${++CheapSharkWidget.#counter}`, title });
  }

  renderBody() {
    const wrap = document.createElement('div');
    wrap.className = 'cheapshark';
    wrap.innerHTML = `<div class="widget__loader">Загрузка скидок…</div>`;
    return wrap;
  }

  bindEvents() { this.#load(); }

  async #load() {
    const wrap = this.$('.cheapshark');
    if (!wrap) return;

    try {
      const url = `${CheapSharkWidget.API}?storeID=1&upperPrice=15&pageSize=5&sortBy=Deal%20Rating`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`CheapShark: ${res.status}`);
      const deals = await res.json();
      this.#render(wrap, deals);
    } catch (err) {
      console.warn('CheapShark недоступен, демо-данные:', err.message);
      this.#render(wrap, [
        { title: 'Portal 2',      salePrice: '1.99', normalPrice: '9.99', savings: '80.08' },
        { title: 'Left 4 Dead 2', salePrice: '1.99', normalPrice: '9.99', savings: '80.08' },
        { title: 'Half-Life 2',   salePrice: '1.99', normalPrice: '9.99', savings: '80.08' }
      ]);
    }
  }

  #render(wrap, deals) {
    wrap.innerHTML = deals.map(d => `
      <div class="deal-row">
        <div class="deal-row__title">${d.title}</div>
        <div class="deal-row__prices">
          <span class="deal-row__sale">$${d.salePrice}</span>
          <span class="deal-row__normal">$${d.normalPrice}</span>
          <span class="deal-row__save">−${Math.round(Number(d.savings))}%</span>
        </div>
      </div>
    `).join('');
  }
}