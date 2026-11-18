/* ═══════════════════════════════════════════
   MAIN — entry point for index.html (task 5.1)
   Kept out of the HTML so the Content-Security-Policy
   in _headers can forbid inline scripts.
   ═══════════════════════════════════════════ */
import { animateHero, setupReveal, setupExplodedPhone } from './animations.js';
import { buildQuote }       from './quote.js';
import { setupContactForm } from './contact.js';
import './navbar.js';

document.addEventListener('DOMContentLoaded', () => {
  animateHero();
  setupReveal();
  setupExplodedPhone();
  buildQuote();
  setupContactForm();
});
