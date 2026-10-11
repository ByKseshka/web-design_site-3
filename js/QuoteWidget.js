import { UIComponent } from './UIComponent.js';

let quoteCounter = 0;

export class QuoteWidget extends UIComponent {
  static #QUOTES = [
    { text: 'Работает — не трогай.', author: 'Народная мудрость' },
    { text: 'Сначала сделай так, чтобы работало. Потом — правильно. Потом — быстро.', author: 'Кент Бек' },
    { text: 'Если сомневаешься — залогируй.', author: 'Неизвестный сисадмин' },
    { text: 'Лучшая защита — бэкап.', author: 'Правило 3-2-1' },
    { text: 'AWP — это не оружие, это философия.', author: 'CS2-фольклор' },
    { text: 'Проверяй углы. Всегда.', author: 'Правило раш-сайта' },
    { text: 'Любая достаточно развитая технология похожа на магию.', author: 'Артур Кларк' }
  ];

  #current = null;

  constructor({ id, title = '💬 Цитата дня' } = {}) {
    super({ id: id ?? `quote-${++quoteCounter}`, title });
  }

  renderBody() {
    const wrap = document.createElement('div');
    wrap.className = 'quote';
    wrap.innerHTML = `
      <blockquote class="quote__block">
        <p class="quote__text"   data-role="text"></p>
        <footer class="quote__author" data-role="author"></footer>
      </blockquote>
      <button class="btn btn--primary" data-role="refresh">Обновить</button>
    `;
    return wrap;
  }

  bindEvents() {
    const btn = this.$('[data-role="refresh"]');
    this.addListener(btn, 'click', () => this.#pickRandom());
    this.#pickRandom();
  }

  #pickRandom() {
    let next;
    do {
      next = QuoteWidget.#QUOTES[Math.floor(Math.random() * QuoteWidget.#QUOTES.length)];
    } while (QuoteWidget.#QUOTES.length > 1 && next === this.#current);

    this.#current = next;
    this.$('[data-role="text"]').textContent   = `«${next.text}»`;
    this.$('[data-role="author"]').textContent = `— ${next.author}`;
  }
}