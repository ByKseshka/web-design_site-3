/**
 * Шлейф за курсором — светящиеся частицы на canvas.
 */
export function initTrail() {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const touch  = matchMedia('(hover: none)').matches;
  if (reduce || touch) return;

  const canvas = document.getElementById('trail');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  let W = 0, H = 0;
  const resize = () => {
    W = canvas.width  = innerWidth  * devicePixelRatio;
    H = canvas.height = innerHeight * devicePixelRatio;
    canvas.style.width  = innerWidth  + 'px';
    canvas.style.height = innerHeight + 'px';
  };
  resize();
  addEventListener('resize', resize);

  const particles = [];
  let prevX = 0, prevY = 0, first = true;

  function getColor() {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    return isLight
      ? { r: 37, g: 99, b: 235 }
      : { r: 0,  g: 210, b: 255 };
  }

  addEventListener('mousemove', (e) => {
    const x = e.clientX * devicePixelRatio;
    const y = e.clientY * devicePixelRatio;

    if (first) { prevX = x; prevY = y; first = false; return; }

    const dx = x - prevX;
    const dy = y - prevY;
    const speed = Math.hypot(dx, dy);
    const steps = Math.min(Math.floor(speed / 3) + 1, 5);

    for (let i = 0; i < steps; i++) {
      const t = i / steps;
      spawnParticle(prevX + dx * t, prevY + dy * t);
    }

    prevX = x;
    prevY = y;
  });

  function spawnParticle(x, y) {
    particles.push({
      x, y,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      life: 1,
      decay: 0.018 + Math.random() * 0.02,
      size: (2 + Math.random() * 3) * devicePixelRatio
    });
  }

  function frame() {
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = 'rgba(0,0,0,0.08)';
    ctx.fillRect(0, 0, W, H);

    ctx.globalCompositeOperation = 'lighter';
    const { r, g, b } = getColor();

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.life -= p.decay;

      if (p.life > 0) {
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
        grad.addColorStop(0, `rgba(${r},${g},${b},${p.life * 0.8})`);
        grad.addColorStop(1, `rgba(${r},${g},${b},0)`);

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // Чистим мёртвые
    for (let i = particles.length - 1; i >= 0; i--) {
      if (particles[i].life <= 0) particles.splice(i, 1);
    }

    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}