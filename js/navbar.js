/* ═══════════════════════════════════════════
   NAVBAR — scroll, hamburger, active links
   ═══════════════════════════════════════════ */

const navbar     = document.getElementById('navbar');
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

// ── Scroll: add shadow to navbar ──
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// ── Mobile menu ──
const isMenuOpen = () => mobileMenu.classList.contains('open');

function setMenu(open) {
  mobileMenu.classList.toggle('open', open);
  hamburger.classList.toggle('open', open);
  hamburger.setAttribute('aria-expanded', String(open));
  hamburger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
}

hamburger.addEventListener('click', () => setMenu(!isMenuOpen()));

// Close on link click, Escape, click outside, or when the window grows to desktop width
mobileMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && isMenuOpen()) { setMenu(false); hamburger.focus(); }
});

document.addEventListener('click', e => {
  if (isMenuOpen() && !navbar.contains(e.target)) setMenu(false);
});

window.matchMedia('(min-width: 901px)').addEventListener('change', e => {
  if (e.matches) setMenu(false);
});

// ── Active nav link on scroll ──
const navLinks = [...document.querySelectorAll('.nav-links a')];
const linkTargets = navLinks
  .map(link => ({ link, section: document.querySelector(link.getAttribute('href')) }))
  .filter(t => t.section);

function updateActiveLink() {
  const y = window.scrollY + 100;
  linkTargets.forEach(({ link, section }) => {
    const inView = y >= section.offsetTop && y < section.offsetTop + section.offsetHeight;
    link.classList.toggle('active', inView);
    if (inView) link.setAttribute('aria-current', 'true');
    else link.removeAttribute('aria-current');
  });
}

let ticking = false;
window.addEventListener('scroll', () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => { updateActiveLink(); ticking = false; });
}, { passive: true });
updateActiveLink();
