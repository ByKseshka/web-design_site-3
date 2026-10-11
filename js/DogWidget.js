import { UIComponent } from './UIComponent.js';

export class DogWidget extends UIComponent {
  static API = 'https://dog.ceo/api/breeds/image/random';
  static #counter = 0;

  constructor({ id, title = '🐶 Случайная собака' } = {}) {
    super({ id: id ?? `dog-${++DogWidget.#counter}`, title });
  }

  renderBody() {
    const wrap = document.createElement('div');
    wrap.className = 'dog';
    wrap.innerHTML = `<div class="widget__loader">Загрузка собаки…</div>`;
    return wrap;
  }

  bindEvents() { this.#load(); }

  async #load() {
    const wrap = this.$('.dog');
    if (!wrap) return;

    wrap.innerHTML = `<div class="widget__loader">Загрузка собаки…</div>`;

    try {
      const res = await fetch(DogWidget.API);
      if (!res.ok) throw new Error(`Dog CEO: ${res.status}`);
      const data = await res.json();
      if (data.status !== 'success') throw new Error('Dog CEO: status != success');
      this.#render(wrap, data.message);
    } catch (err) {
      console.warn('Dog CEO недоступен:', err.message);
      wrap.innerHTML = `<div class="widget__error">⚠ ${err.message}</div>`;
    }
  }

  #render(wrap, url) {
    const breed = this.#breedFromUrl(url);
    wrap.innerHTML = `
      <img class="dog__img" src="${url}" alt="Случайная собака" loading="lazy">
      <div class="dog__breed">${breed}</div>
      <button class="btn btn--primary dog__refresh" data-role="refresh">🐾 Другая собака</button>
    `;

    const btn = wrap.querySelector('[data-role="refresh"]');
    this.addListener(btn, 'click', () => this.#load());
  }

  #breedFromUrl(url) {
    try {
      const m = url.match(/breeds\/([^/]+)\//);
      if (!m) return '';
      return m[1].split('-').reverse().join(' ');
    } catch { return ''; }
  }
}