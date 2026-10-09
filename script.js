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

// Privacy-first contact: no third-party embedded form or automatic transmission.
// The visitor reviews and sends the message explicitly from their own mail app.
const form = document.querySelector('#contact-form');
const formStatus = document.querySelector('#form-status');
form?.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const get = (key) => String(data.get(key) || '').trim();
  const subject = `Consulta LITOS — ${get('tipo') || 'Proyecto a medida'}`;
  const body = [
    `Nombre o estudio: ${get('nombre')}`,
    `Correo de contacto: ${get('correo')}`,
    `Teléfono: ${get('telefono') || 'No indicado'}`,
    `Tipo de proyecto: ${get('tipo') || 'No indicado'}`,
    '',
    'Consulta:',
    get('mensaje'),
  ].join('\n');
  const draft = `mailto:litos.artesania@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  if (formStatus) formStatus.textContent = 'Se abrirá un borrador en su correo. Revíselo y pulse Enviar; todavía no se ha enviado nada.';
  window.location.href = draft;
});
