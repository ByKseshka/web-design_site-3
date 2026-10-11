/**
 * Кинетическая типографика.
 * Буквы [data-kinetic] отталкиваются от курсора + разъезжаются при скролле.
 */
export function initKinetic() {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const touch  = matchMedia('(hover: none)').matches;
  if (reduce || touch) return;

  document.querySelectorAll('[data-kinetic]').forEach((el) => {
    const text = el.textContent.trim();
    el.innerHTML = [...text].map(ch =>
      `<span class="k-letter">${ch === ' ' ? '&nbsp;' : ch}</span>`
    ).join('');
  });

  const letters = [...document.querySelectorAll('.k-letter')];
  if (!letters.length) return;

  let mx = innerWidth / 2, my = innerHeight / 2;
  let sy = scrollY;

  const state = letters.map(() => ({ x: 0, y: 0, r: 0, sx: 1, sy: 1 }));
  const target = letters.map(() => ({ x: 0, y: 0, r: 0, sx: 1, sy: 1 }));

  addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; });
  addEventListener('scroll',  () => { sy = scrollY; }, { passive: true });

  function frame() {
    const center = letters.length / 2;

    letters.forEach((el, i) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width  / 2;
      const cy = r.top  + r.height / 2;

      // Курсорное влияние
      const dx = cx - mx;
      const dy = cy - my;
      const dist = Math.hypot(dx, dy);
      const force = Math.max(0, 1 - dist / 260);

      const pushX  = force * (dx / (dist || 1)) * 18;
      const pushY  = force * (dy / (dist || 1)) * 18;
      const rotate = force * (i % 2 ? 14 : -14);
      const scaleX = 1 + force * 0.18;
      const scaleY = 1 - force * 0.08;

      // Скролл-разъезд
      const scrollSpread = (i - center) * (sy / window.innerHeight) * 22;

      target[i].x  = pushX + scrollSpread;
      target[i].y  = pushY;
      target[i].r  = rotate;
      target[i].sx = scaleX;
      target[i].sy = scaleY;

      const s = state[i], t = target[i];
      s.x  += (t.x  - s.x)  * 0.12;
      s.y  += (t.y  - s.y)  * 0.12;
      s.r  += (t.r  - s.r)  * 0.12;
      s.sx += (t.sx - s.sx) * 0.12;
      s.sy += (t.sy - s.sy) * 0.12;

      el.style.transform = `
        translate(${s.x}px, ${s.y}px)
        rotate(${s.r}deg)
        scale(${s.sx}, ${s.sy})
      `;
      el.style.opacity = Math.max(0, 1 - Math.abs(scrollSpread) / 400);
    });

    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}