const menuButton = document.querySelector('.menu-button');
const mobileMenu = document.querySelector('.mobile-menu');
const menuLinks = mobileMenu ? [...mobileMenu.querySelectorAll('a')] : [];
const content = document.querySelector('main');
const footer = document.querySelector('.site-footer');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function setMenu(open, returnFocus = true) {
  if (!menuButton || !mobileMenu) return;
  menuButton.setAttribute('aria-expanded', String(open));
  mobileMenu.hidden = !open;
  document.body.classList.toggle('menu-open', open);
  if (content) content.inert = open;
  if (footer) footer.inert = open;
  if (open) menuLinks[0]?.focus();
  else if (returnFocus) menuButton.focus();
}

menuButton?.addEventListener('click', () => {
  setMenu(menuButton.getAttribute('aria-expanded') !== 'true');
});
menuLinks.forEach((link) => link.addEventListener('click', () => setMenu(false, false)));

document.addEventListener('keydown', (event) => {
  if (menuButton?.getAttribute('aria-expanded') !== 'true') return;
  if (event.key === 'Escape') {
    event.preventDefault();
    setMenu(false);
  }
  if (event.key === 'Tab') {
    const focusable = [menuButton, ...menuLinks];
    const index = focusable.indexOf(document.activeElement);
    if (event.shiftKey && index <= 0) {
      event.preventDefault();
      focusable[focusable.length - 1].focus();
    } else if (!event.shiftKey && index === focusable.length - 1) {
      event.preventDefault();
      focusable[0].focus();
    }
  }
});

const mobileBreakpoint = window.matchMedia('(max-width: 1080px)');
mobileBreakpoint.addEventListener('change', () => {
  if (!mobileBreakpoint.matches && menuButton?.getAttribute('aria-expanded') === 'true') setMenu(false, false);
});

const hero = document.querySelector('.hero');
if (hero && !reduceMotion && window.matchMedia('(pointer: fine)').matches) {
  hero.addEventListener('pointermove', (event) => {
    const position = Math.max(12, Math.min(82, (event.clientX / window.innerWidth) * 100));
    hero.style.setProperty('--light-x', `${position}%`);
  }, { passive: true });
}

// No commercial contact form handlers: LITOS does not accept orders or quotations.
