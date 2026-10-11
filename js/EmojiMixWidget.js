import { UIComponent } from './UIComponent.js';

export class EmojiMixWidget extends UIComponent {
  static API = 'https://xiaoqi.icofun.cn/API/emojimix.php';
  static #counter = 0;
  static #EMOJIS = ['😄','😎','🔥','💧','🌟','🌸','🐱','🍀','🎈','⚡','🌈','🍕','🐸','🦄','🍩','🎃'];

  #left;
  #right;

  constructor({ id, title = '🎨 Микс эмодзи', emoji1, emoji2 } = {}) {
    super({ id: id ?? `emoji-mix-${++EmojiMixWidget.#counter}`, title });
    this.#left  = emoji1 ?? this.#randomEmoji();
    this.#right = emoji2 ?? this.#randomEmoji();
  }

  renderBody() {
    const wrap = document.createElement('div');
    wrap.className = 'emoji-mix';
    wrap.innerHTML = `<div class="widget__loader">Загрузка микса…</div>`;
    return wrap;
  }

  bindEvents() { this.#load(); }

  async #load() {
    const wrap = this.$('.emoji-mix');
    if (!wrap) return;

    wrap.innerHTML = `<div class="widget__loader">Загрузка микса…</div>`;

    try {
      const url = `${EmojiMixWidget.API}?emoji1=${encodeURIComponent(this.#left)}`
                + `&emoji2=${encodeURIComponent(this.#right)}&type=json`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`EmojiMix: ${res.status}`);
      const data = await res.json();

      const imageUrl = data.result || data.url || data.data;
      if (!imageUrl) throw new Error('EmojiMix: нет URL в ответе');

      this.#render(wrap, imageUrl);
    } catch (err) {
      console.warn('EmojiMix недоступен:', err.message);
      wrap.innerHTML = `<div class="widget__error">⚠ ${err.message}</div>`;
    }
  }

  #render(wrap, imageUrl) {
    wrap.innerHTML = `
      <div class="emoji-mix__preview">
        <img class="emoji-mix__img" src="${imageUrl}" alt="Микс эмодзи">
      </div>
      <div class="emoji-mix__meta">
        <span class="emoji-mix__pair">${this.#left} + ${this.#right}</span>
      </div>
      <button class="btn btn--primary emoji-mix__refresh" data-role="refresh">🎲 Другой микс</button>
    `;

    const btn = wrap.querySelector('[data-role="refresh"]');
    this.addListener(btn, 'click', () => this.#randomMix());
  }

  #randomMix() {
    this.#left  = this.#randomEmoji();
    this.#right = this.#randomEmoji();
    this.#load();
  }

  #randomEmoji() {
    return EmojiMixWidget.#EMOJIS[
      Math.floor(Math.random() * EmojiMixWidget.#EMOJIS.length)
    ];
  }
}