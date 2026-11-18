/* ═══════════════════════════════════════════
   ANIMATIONS — scroll reveal + exploded phone
   ═══════════════════════════════════════════ */

// (The hero entrance is pure CSS: see the end of css/hero.css.)

// ── Scroll reveal ──
export function setupReveal() {
  const selectors = [
    '.why-card', '.step',
    '.contact-item', '.section-header'
  ];

  selectors.forEach(sel => {
    document.querySelectorAll(sel).forEach((el, i) => {
      el.classList.add('reveal');
      const delay = el.getAttribute('data-delay') || (i * 80);
      el.style.transitionDelay = `${delay}ms`;
    });
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}


// ── Services: exploded iPhone assembles, then separates when scrolled into view ──
export function setupExplodedPhone() {
  const fig = document.querySelector('.xphone');
  if (!fig || !('IntersectionObserver' in window)) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  fig.classList.add('is-assembled');
  const observer = new IntersectionObserver(entries => {
    if (entries.some(e => e.isIntersecting)) {
      requestAnimationFrame(() => fig.classList.remove('is-assembled'));
      observer.disconnect();
    }
  }, { threshold: 0.35 });
  observer.observe(fig);
}
