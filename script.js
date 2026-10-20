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

// Contacto sin backend: el visitante decide el envío en su aplicación
// de correo. Ningún dato personal se envía a GitHub Pages ni a un tercero
// desde JavaScript, y no hay almacenamiento, analítica ni seguimiento.
// La dirección comercial debe confirmarse ANTES de publicar. No usar una
// dirección personal/familiar ni inventar un buzón que no exista.
const LITOS_CONTACT_EMAIL = 'litos.artesania@gmail.com';
for (const form of document.querySelectorAll('[data-litos-contact]')) {
  const submit = form.querySelector('button[type="submit"]');
  if (LITOS_CONTACT_EMAIL && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(LITOS_CONTACT_EMAIL)) {
    submit.disabled = false;
  }
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!LITOS_CONTACT_EMAIL || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(LITOS_CONTACT_EMAIL)) {
      form.querySelector('.contact-feedback').textContent = 'El contacto por correo no está configurado.';
      return;
    }
    if (!form.reportValidity()) return;
    const name = form.querySelector('[name="nombre"]').value.trim();
    const email = form.querySelector('[name="correo"]').value.trim();
    const topic = form.querySelector('[name="asunto"]').value.trim();
    const message = form.querySelector('[name="mensaje"]').value.trim();
    const status = form.querySelector('.contact-feedback');
    if (!name || !email || !topic || message.length < 10 || !form.querySelector('[name="privacidad"]').checked) {
      status.textContent = 'Completa los campos obligatorios para preparar el correo.';
      return;
    }
    const subject = 'Consulta LITOS · ' + topic.replace(/[\r\n]/g, ' ');
    const body = 'Nombre: ' + name.replace(/[\r\n]/g, ' ')
      + '\nCorreo de respuesta: ' + email.replace(/[\r\n]/g, ' ')
      + '\nCategoría: ' + topic + '\n\nConsulta:\n' + message;
    const url = 'mailto:' + LITOS_CONTACT_EMAIL + '?subject=' + encodeURIComponent(subject)
      + '&body=' + encodeURIComponent(body);
    if (url.length > 7500) {
      status.textContent = 'El mensaje es demasiado extenso para abrirlo en el correo. Resúmelo un poco.';
      return;
    }
    status.textContent = 'Correo preparado. Revísalo y pulsa Enviar en tu aplicación de correo; el formulario no lo envía por sí solo.';
    try {
      window.location.assign(url);
    } catch (_) {
      status.textContent = 'No se pudo abrir la aplicación de correo. Usa la dirección de contacto mostrada junto al formulario.';
    }
  });
}

