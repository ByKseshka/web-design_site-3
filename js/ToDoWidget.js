import { UIComponent } from './UIComponent.js';

let todoCounter = 0;

export class ToDoWidget extends UIComponent {
  #tasks = [];
  #taskSeq = 0;

  constructor({ id, title = '📝 Чеклист игрока' } = {}) {
    super({ id: id ?? `todo-${++todoCounter}`, title });
  }

  renderBody() {
    const wrap = document.createElement('div');
    wrap.className = 'todo';
    wrap.innerHTML = `
      <form class="todo__form" data-role="form">
        <input class="todo__input" type="text"
               placeholder="Например: aim_botz 30 мин" aria-label="Новая задача" />
        <button class="btn btn--primary" type="submit">Добавить</button>
      </form>
      <ul class="todo__list" data-role="list"></ul>
      <div class="todo__empty" data-role="empty">Пока нет задач</div>
    `;
    return wrap;
  }

  bindEvents() {
    const form = this.$('[data-role="form"]');
    const list = this.$('[data-role="list"]');

    this.addListener(form, 'submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('.todo__input');
      this.#addTask(input.value);
      input.value = '';
      input.focus();
    });

    this.addListener(list, 'click', (e) => {
      const li = e.target.closest('li[data-task-id]');
      if (!li) return;
      const taskId = Number(li.dataset.taskId);
      const action = e.target.dataset.action;
      if (action === 'remove') this.#removeTask(taskId);
      if (action === 'toggle') this.#toggleTask(taskId);
    });
  }

  #addTask(text) {
    const trimmed = text.trim();
    if (!trimmed) return;
    this.#tasks.push({ id: ++this.#taskSeq, text: trimmed, done: false });
    this.#renderTasks();
  }

  #removeTask(taskId) {
    this.#tasks = this.#tasks.filter(t => t.id !== taskId);
    this.#renderTasks();
  }

  #toggleTask(taskId) {
    const task = this.#tasks.find(t => t.id === taskId);
    if (task) task.done = !task.done;
    this.#renderTasks();
  }

  #renderTasks() {
    const list  = this.$('[data-role="list"]');
    const empty = this.$('[data-role="empty"]');

    list.innerHTML = '';
    this.#tasks.forEach(task => {
      const li = document.createElement('li');
      li.className = 'todo__item' + (task.done ? ' todo__item--done' : '');
      li.dataset.taskId = task.id;
      li.innerHTML = `
        <label class="todo__label">
          <input type="checkbox" data-action="toggle" ${task.done ? 'checked' : ''} />
          <span class="todo__text">${this.#escape(task.text)}</span>
        </label>
        <button class="widget__icon" data-action="remove" title="Удалить">✕</button>
      `;
      list.appendChild(li);
    });

    empty.style.display = this.#tasks.length ? 'none' : 'block';
  }

  #escape(str) {
    return str.replace(/[&<>"']/g, c => ({
      '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
    }[c]));
  }
}