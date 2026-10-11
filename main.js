import { Dashboard }          from './js/Dashboard.js';
import { ProfileWidget }      from './js/ProfileWidget.js';
import { MapWinrateWidget }   from './js/MapWinrateWidget.js';
import { CurrencyWidget }     from './js/CurrencyWidget.js';
import { WeatherWidget }      from './js/WeatherWidget.js';
import { CheapSharkWidget }   from './js/CheapSharkWidget.js';
import { TriviaWidget }       from './js/TriviaWidget.js';
import { DogWidget }          from './js/DogWidget.js';
import { EmojiMixWidget }     from './js/EmojiMixWidget.js';
import { ToDoWidget }         from './js/ToDoWidget.js';
import { QuoteWidget }        from './js/QuoteWidget.js';

// === Эффекты ===
import { initKinetic }  from './effects/kinetic.js';
import { initCubes }    from './effects/cubes.js';
import { initCursor }   from './effects/cursor.js';
import { initTrail }    from './effects/trail.js';
import { initReveal }   from './effects/reveal.js';

/* ---------- Тема ---------- */
(function initTheme() {
  const saved = localStorage.getItem('theme');
  if (saved) document.documentElement.setAttribute('data-theme', saved);

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.js-theme-toggle')) return;
    e.preventDefault();
    const cur = document.documentElement.getAttribute('data-theme');
    const next = cur === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });
})();

/* ---------- Часы в футере ---------- */
(function clock() {
  const el = document.getElementById('clock');
  if (!el) return;
  const tick = () => { el.textContent = new Date().toLocaleTimeString('ru-RU'); };
  tick();
  setInterval(tick, 1000);
})();

/* ---------- Дашборд ---------- */
const dashboard = new Dashboard('#dashboard');

dashboard
  .registerType('profile',    (cfg) => new ProfileWidget(cfg))
  .registerType('maps',       (cfg) => new MapWinrateWidget(cfg))
  .registerType('currency',   (cfg) => new CurrencyWidget(cfg))
  .registerType('weather',    (cfg) => new WeatherWidget({
    ...cfg,
    lat: 59.9343,
    lon: 30.3351,
    city: 'Санкт-Петербург'
  }))
  .registerType('cheapshark', (cfg) => new CheapSharkWidget(cfg))
  .registerType('trivia',     (cfg) => new TriviaWidget(cfg))
  .registerType('dog',        (cfg) => new DogWidget(cfg))
  .registerType('emoji-mix',  (cfg) => new EmojiMixWidget(cfg))
  .registerType('todo',       (cfg) => new ToDoWidget(cfg))
  .registerType('quote',      (cfg) => new QuoteWidget(cfg));

/* ---------- Меню «Добавить виджет» ---------- */
const addToggle = document.getElementById('add-toggle');
const addList   = document.getElementById('add-list');

function openMenu()  { addList.hidden = false; addToggle.setAttribute('aria-expanded', 'true');  }
function closeMenu() { addList.hidden = true;  addToggle.setAttribute('aria-expanded', 'false'); }

// 1. Клик по кнопке — открыть/закрыть
addToggle.addEventListener('click', (e) => {
  e.stopPropagation();
  addList.hidden ? openMenu() : closeMenu();
});

// 2. Клик по пункту меню — добавить виджет и закрыть меню
addList.addEventListener('click', (e) => {
  const item = e.target.closest('[data-add]');
  if (!item) return;
  e.stopPropagation();
  dashboard.addWidget(item.dataset.add);
  closeMenu();
  document.getElementById('dashboard').scrollIntoView({ behavior: 'smooth', block: 'start' });
});

// 3. Клик вне меню — закрыть
document.addEventListener('click', (e) => {
  if (!addList.hidden && !e.target.closest('.add-menu')) closeMenu();
});

// 4. Esc — закрыть
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !addList.hidden) closeMenu();
});

/* ---------- Очистить всё ---------- */
document.getElementById('clear-all').addEventListener('click', () => {
  dashboard.clear();
});

/* ---------- Стартовый набор ---------- */
dashboard.addWidget('profile');
dashboard.addWidget('currency');
dashboard.addWidget('weather');
dashboard.addWidget('maps');
dashboard.addWidget('cheapshark');
dashboard.addWidget('trivia');
dashboard.addWidget('dog');
dashboard.addWidget('emoji-mix');
dashboard.addWidget('todo');
dashboard.addWidget('quote');

/* ---------- Запуск эффектов ---------- */
initKinetic();
initCubes();
initCursor();
initTrail();
initReveal();

window.dashboard = dashboard;