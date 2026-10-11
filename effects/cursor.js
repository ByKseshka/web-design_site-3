/**
 * Контекстный курсор — плашка с текстом над элементами [data-cursor].
 */
export function initCursor() {
  const touch = matchMedia('(hover: none)').matches;
  if (touch) return;

  const label = document.getElementById('cursor-label');
  if (!label) return;

  let mx = 0, my = 0;

  addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
    label.style.left = `${mx}px`;
    label.style.top  = `${my - 30}px`;
  });

  document.addEventListener('mouseover', (e) => {
    const el = e.target.closest('[data-cursor]');
    if (!el) return;
    label.textContent = el.dataset.cursor;
    label.classList.add('is-active');
  });

  document.addEventListener('mouseout', (e) => {
    const el = e.target.closest('[data-cursor]');
    if (!el) return;
    if (el.contains(e.relatedTarget)) return;
    label.classList.remove('is-active');
  });
}