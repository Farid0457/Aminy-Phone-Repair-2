/* ═══════════════════════════════════════════
   ANIMATIONS — hero entrance + scroll reveal
   ═══════════════════════════════════════════ */

// ── Hero entrance ──
export function animateHero() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;   // show it as-is
  const items = [
    { el: document.querySelector('.hero-eyebrow'),  delay: 0.1 },
    { el: document.querySelector('.hero-headline'), delay: 0.3 },
    { el: document.querySelector('.hero-sub'),      delay: 0.5 },
    { el: document.querySelector('.hero-actions'),  delay: 0.7 },
    { el: document.querySelector('.hero-stats'),    delay: 0.9 },
    { el: document.querySelector('.hero-card'),     delay: 0.5 },
  ];

  items.forEach(({ el, delay }) => {
    if (!el) return;
    el.style.opacity   = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`;
    requestAnimationFrame(() => requestAnimationFrame(() => {
      el.style.opacity   = '1';
      el.style.transform = 'translateY(0)';
    }));
  });
}

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
