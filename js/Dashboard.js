import { observeReveal } from '../effects/reveal.js';

export class Dashboard {
  #widgets = new Map();
  #container;
  #registry = new Map();

  constructor(containerSelector) {
    this.#container = document.querySelector(containerSelector);
    if (!this.#container) {
      throw new Error(`Dashboard: контейнер ${containerSelector} не найден`);
    }
    this.#container.addEventListener('widget:close', (e) => {
      this.removeWidget(e.detail.id);
    });
  }

  registerType(type, factory) {
    this.#registry.set(type, factory);
    return this;
  }

  addWidget(widgetType, config = {}) {
    const factory = this.#registry.get(widgetType);
    if (!factory) {
      console.warn(`Dashboard: неизвестный тип "${widgetType}"`);
      return null;
    }

    const instance = factory(config);
    if (this.#widgets.has(instance.id)) {
      return this.#widgets.get(instance.id).instance;
    }

    const node = instance.render();
    this.#container.appendChild(node);

    // Подписываем новый виджет на появление
    observeReveal(node);
    // Гарантированно показываем через 400мс (на случай если observer не сработал)
    setTimeout(() => node.classList.add('is-visible'), 400);

    this.#widgets.set(instance.id, { instance });
    return instance;
  }

  removeWidget(widgetId) {
    const entry = this.#widgets.get(widgetId);
    if (!entry) return false;
    entry.instance.destroy();
    this.#widgets.delete(widgetId);
    return true;
  }

  clear() {
    [...this.#widgets.keys()].forEach(id => this.removeWidget(id));
  }

  get size() {
    return this.#widgets.size;
  }
}