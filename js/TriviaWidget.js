import { UIComponent } from './UIComponent.js';

export class TriviaWidget extends UIComponent {
  static API = 'https://opentdb.com/api.php';
  static #counter = 0;

  #correct = null;

  constructor({ id, title = '🧠 Викторина' } = {}) {
    super({ id: id ?? `trivia-${++TriviaWidget.#counter}`, title });
  }

  renderBody() {
    const wrap = document.createElement('div');
    wrap.className = 'trivia';
    wrap.innerHTML = `<div class="widget__loader">Загрузка вопроса…</div>`;
    return wrap;
  }

  bindEvents() {
    this.#load();
    this.addListener(this.$('.trivia'), 'click', (e) => {
      const btn = e.target.closest('[data-answer]');
      if (!btn) return;
      if (btn.dataset.locked) return;

      const wrap = this.$('.trivia');
      wrap.querySelectorAll('[data-answer]').forEach(b => {
        b.dataset.locked = '1';
        if (b.dataset.answer === this.#correct) {
          b.classList.add('trivia__answer--correct');
        } else if (b === btn) {
          b.classList.add('trivia__answer--wrong');
        }
      });

      const again = document.createElement('button');
      again.className = 'btn btn--primary trivia__again';
      again.textContent = '🔄 Ещё вопрос';
      again.addEventListener('click', () => this.#load());
      wrap.appendChild(again);
    });
  }

  async #load() {
    const wrap = this.$('.trivia');
    if (!wrap) return;

    wrap.innerHTML = `<div class="widget__loader">Загрузка вопроса…</div>`;

    try {
      const url = `${TriviaWidget.API}?amount=1&type=multiple&encode=url3986`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Open Trivia DB: ${res.status}`);
      const data = await res.json();

      if (!data.results || !data.results.length) {
        throw new Error('Вопросы не найдены');
      }

      const q = data.results[0];
      const question = decodeURIComponent(q.question);
      const correct = decodeURIComponent(q.correct_answer);
      const incorrect = q.incorrect_answers.map(decodeURIComponent);

      this.#correct = correct;
      const answers = [...incorrect, correct].sort(() => Math.random() - 0.5);

      wrap.innerHTML = `
        <div class="trivia__category">${decodeURIComponent(q.category)} · ${decodeURIComponent(q.difficulty)}</div>
        <div class="trivia__question">${question}</div>
        <div class="trivia__answers">
          ${answers.map(a => `
            <button class="trivia__answer" data-answer="${this.#escape(a)}">${this.#escape(a)}</button>
          `).join('')}
        </div>
      `;
    } catch (err) {
      console.warn('Trivia недоступен, демо-вопрос:', err.message);
      this.#renderDemo(wrap);
    }
  }

  #renderDemo(wrap) {
    this.#correct = 'Париж';
    wrap.innerHTML = `
      <div class="trivia__category">Geography · easy</div>
      <div class="trivia__question">Столица Франции?</div>
      <div class="trivia__answers">
        ${['Лондон', 'Париж', 'Берлин', 'Мадрид'].map(a => `
          <button class="trivia__answer" data-answer="${a}">${a}</button>
        `).join('')}
      </div>
    `;
  }

  #escape(str) {
    return String(str).replace(/[&<>"']/g, c => ({
      '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
    }[c]));
  }
}