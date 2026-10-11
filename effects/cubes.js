/**
 * Интерактивные 3D-кубы — наклоняются за курсором с параллаксом.
 */
export function initCubes() {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const touch  = matchMedia('(hover: none)').matches;
  if (reduce || touch) return;

  const cubes = [...document.querySelectorAll('.decor')];
  if (!cubes.length) return;

  let mx = 0, my = 0, curX = 0, curY = 0;

  addEventListener('mousemove', (e) => {
    mx = (e.clientX / innerWidth)  * 2 - 1;
    my = (e.clientY / innerHeight) * 2 - 1;
  });

  function frame() {
    curX += (mx - curX) * 0.06;
    curY += (my - curY) * 0.06;

    cubes.forEach(cube => {
      const depth = parseFloat(cube.dataset.depth) || 1;
      const tx = curX * 30 * depth;
      const ty = curY * 30 * depth;
      const rotateY = curX * 25 * depth;
      const rotateX = -curY * 25 * depth;

      cube.style.transform = `
        translate3d(${tx}px, ${ty}px, 0)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
      `;

      const dist = Math.hypot(mx - 0, my - 0);
      cube.style.opacity = Math.min(1, 0.6 + (1 - dist) * 0.4);
    });

    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}