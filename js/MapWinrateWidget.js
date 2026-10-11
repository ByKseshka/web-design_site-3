import { UIComponent } from './UIComponent.js';

let mapCounter = 0;

export class MapWinrateWidget extends UIComponent {
  #maps;

  constructor({ id, title = '🗺 Винрейт по картам', maps } = {}) {
    super({ id: id ?? `maps-${++mapCounter}`, title });
    this.#maps = maps ?? [
      { name: 'Mirage',  wr: 68, played: 42 },
      { name: 'Inferno', wr: 55, played: 38 },
      { name: 'Nuke',    wr: 62, played: 29 },
      { name: 'Ancient', wr: 41, played: 22 },
      { name: 'Dust2',   wr: 73, played: 51 },
      { name: 'Vertigo', wr: 48, played: 18 }
    ];
  }

  renderBody() {
    const wrap = document.createElement('div');
    wrap.className = 'map-winrate';
    wrap.innerHTML = this.#maps.map(m => `
      <div class="map-row">
        <span class="map-row__name">${m.name}</span>
        <div class="map-row__bar">
          <div class="map-row__fill" style="width:${m.wr}%;background:${this.#color(m.wr)}"></div>
        </div>
        <span class="map-row__pct">${m.wr}%</span>
        <span class="map-row__played">${m.played} игр</span>
      </div>
    `).join('');
    return wrap;
  }

  #color(wr) {
    if (wr >= 60) return 'linear-gradient(90deg, #22c55e, #4ade80)';
    if (wr >= 45) return 'linear-gradient(90deg, #f59e0b, #fbbf24)';
    return 'linear-gradient(90deg, #ef4444, #f87171)';
  }
}