/**
 * Reveal при скролле — элементы .reveal появляются при попадании в viewport.
 * Экспортирует observe(el) для динамически добавляемых элементов.
 */
let observer = null;

export function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) {
    els.forEach(el => el.classList.add('is-visible'));
    return;
  }

  observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('is-visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  els.forEach(el => observer.observe(el));
}

/**
 * Подписать новый элемент на появление.
 * Если observer ещё не создан — сразу показываем элемент.
 */
export function observeReveal(el) {
  if (!el) return;
  if (!observer) {
    el.classList.add('is-visible');
    return;
  }
  observer.observe(el);
}