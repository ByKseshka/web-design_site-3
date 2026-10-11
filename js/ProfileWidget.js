import { UIComponent } from './UIComponent.js';

let profileCounter = 0;

export class ProfileWidget extends UIComponent {
  #profile;

  constructor({ id, title = '🏆 Мой профиль CS2', profile } = {}) {
    super({ id: id ?? `profile-${++profileCounter}`, title });
    this.#profile = profile ?? {
      name:  's1mple_fan_2024',
      rank:  21547,
      kd:    '1.24',
      hs:    58,
      wr:    64,
      hours: 1247
    };
  }

  renderBody() {
    const p = this.#profile;
    const wrap = document.createElement('div');
    wrap.className = 'profile';
    wrap.innerHTML = `
      <div class="profile__head">
        <div class="avatar avatar--lg">${p.name[0].toUpperCase()}</div>
        <div>
          <div class="profile__name">${p.name}</div>
          <div class="profile__hours">🕐 ${p.hours} часов в CS2</div>
        </div>
      </div>
      <div class="stats-grid">
        <div class="stat-box">
          <span class="stat-box__value">${p.rank.toLocaleString('ru-RU')}</span>
          <span class="stat-box__label">Premier</span>
        </div>
        <div class="stat-box">
          <span class="stat-box__value">${p.kd}</span>
          <span class="stat-box__label">K/D</span>
        </div>
        <div class="stat-box">
          <span class="stat-box__value">${p.hs}%</span>
          <span class="stat-box__label">HS</span>
        </div>
        <div class="stat-box">
          <span class="stat-box__value">${p.wr}%</span>
          <span class="stat-box__label">Winrate</span>
        </div>
      </div>
    `;
    return wrap;
  }
}