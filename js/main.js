/* ==========================================================================
   NEXTGEN HEALTHTECH ACADEMY — MAIN.JS
   Shared behaviour for every public page: mobile nav toggle + the
   Beginner/Intermediate/Advanced tab switcher inside each course card.
   Loaded on index.html only (auth pages use auth.js instead).
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- Mobile nav burger toggle ---------------------------------------- */
  const burgerBtn = document.getElementById('burgerBtn');
  const navbar = document.getElementById('navbar');

  if (burgerBtn && navbar) {
    burgerBtn.addEventListener('click', () => {
      const isOpen = navbar.classList.toggle('navbar--open');
      burgerBtn.setAttribute('aria-expanded', String(isOpen));
    });
  }

  /* ---- Course level tabs (Beginner / Intermediate / Advanced) ----------
     Each .course-card has its own independent set of tabs + panels,
     scoped with querySelectorAll inside the card so cards never interfere
     with each other. */
  document.querySelectorAll('.course-card').forEach((card) => {
    const tabs = card.querySelectorAll('.level-tab');
    const panels = card.querySelectorAll('.level-panel');

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const level = tab.dataset.level;

        tabs.forEach((t) => t.classList.remove('is-active'));
        panels.forEach((p) => p.classList.remove('is-active'));

        tab.classList.add('is-active');
        card.querySelector(`.level-panel[data-level="${level}"]`)?.classList.add('is-active');
      });
    });
  });

  /* ---- Smooth-scroll for on-page anchor links --------------------------*/
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        navbar?.classList.remove('navbar--open');
      }
    });
  });

});
