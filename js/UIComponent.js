export class UIComponent {
  #id;
  #title;
  #root = null;
  #listeners = [];
  #collapsed = false;

  constructor({ id, title }) {
    if (new.target === UIComponent) {
      throw new Error('UIComponent — абстрактный класс, используйте подкласс');
    }
    if (!id || !title) throw new Error('UIComponent: обязательны id и title');
    this.#id = id;
    this.#title = title;
  }

  get id()    { return this.#id; }
  get title() { return this.#title; }
  get root()  { return this.#root; }

  render() {
    const root = document.createElement('section');
    root.className = 'widget';              // ← убран класс 'reveal'
    root.dataset.id = this.#id;
    root.innerHTML = `
      <header class="widget__header">
        <h2 class="widget__title">${this.#title}</h2>
        <div class="widget__actions">
          <button class="widget__icon" data-action="minimize" title="Свернуть">–</button>
          <button class="widget__icon" data-action="close" title="Закрыть">✕</button>
        </div>
      </header>
      <div class="widget__body"></div>
    `;

    this.#root = root;

    this.addListener(root.querySelector('[data-action="minimize"]'), 'click', () => this.minimize());
    this.addListener(root.querySelector('[data-action="close"]'),    'click', () => this.close());

    const body = root.querySelector('.widget__body');
    body.appendChild(this.renderBody());
    this.bindEvents();
    return root;
  }

  renderBody() {
    throw new Error(`${this.constructor.name}: renderBody() не реализован`);
  }

  bindEvents() {}

  minimize() {
    this.#collapsed = !this.#collapsed;
    this.#root.classList.toggle('widget--collapsed', this.#collapsed);
  }

  close() {
    this.#root.dispatchEvent(new CustomEvent('widget:close', {
      bubbles: true,
      detail: { id: this.#id }
    }));
  }

  destroy() {
    this.#listeners.forEach(({ el, type, handler, options }) => {
      el.removeEventListener(type, handler, options);
    });
    this.#listeners = [];
    this.#root?.remove();
    this.#root = null;
    this.onDestroy();
  }

  onDestroy() {}

  addListener(el, type, handler, options) {
    if (!el) return;
    el.addEventListener(type, handler, options);
    this.#listeners.push({ el, type, handler, options });
  }

  $(selector) {
    return this.#root?.querySelector(selector) ?? null;
  }
}