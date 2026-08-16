/**
 * LITOS - Estructura Funcional
 * Interacciones de UI, Smooth Scroll y Validación de Formulario de Contacto
 */

document.addEventListener("DOMContentLoaded", () => {

    // --- 1. Animaciones de Intersección (Scroll Reveal) ---
    const fadeElements = document.querySelectorAll('.fade-in, .scroll-reveal');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion && 'IntersectionObserver' in window) {
        const appearOptions = {
            threshold: 0.1,
            rootMargin: "0px 0px -80px 0px"
        };

        const appearOnScroll = new IntersectionObserver(function (entries, observer) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, appearOptions);

        fadeElements.forEach(el => appearOnScroll.observe(el));
    } else {
        fadeElements.forEach(el => el.classList.add('visible'));
    }

    // Asegurar que Hero y Nav se ven siempre al cargar
    setTimeout(() => {
        const hero = document.querySelector('.hero');
        const nav = document.querySelector('.navbar');
        if (hero) hero.classList.add('visible');
        if (nav) nav.classList.add('visible');
    }, 100);


    // --- 2. Smooth Scroll ---
    const scrollLinks = document.querySelectorAll('a.js-scroll, a[href^="#"]');

    scrollLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId.startsWith('#') && targetId.length > 1) {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });


    // --- 3. UI del Formulario (Active state on blur) ---
    const inputs = document.querySelectorAll('.input-wrapper input, .input-wrapper textarea');

    inputs.forEach(input => {
        input.addEventListener('blur', () => {
            if (input.value.trim() !== "") {
                input.classList.add('has-content');
            } else {
                input.classList.remove('has-content');
            }
        });
    });


    // --- 4. Validación de Formulario Minimalista ---
    const form = document.getElementById('contact-form');
    const successMessage = document.getElementById('form-success');
    const submitBtn = form ? form.querySelector('button[type="submit"]') : null;

    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault(); // Prevenir el envío por defecto para validación local

            let isValid = true;

            // Validar cada input requerido
            inputs.forEach(input => {
                const wrapper = input.closest('.input-wrapper');

                if (input.hasAttribute('required')) {
                    if (input.value.trim() === '') {
                        isValid = false;
                        wrapper.classList.add('error');
                    } else if (input.type === 'email' && !validateEmail(input.value)) {
                        isValid = false;
                        wrapper.classList.add('error');
                    } else {
                        wrapper.classList.remove('error');
                    }
                }
            });

            if (isValid) {
                // Simulación de envío de datos (listo para Netlify Forms o similares)
                submitBtn.style.display = 'none';

                // Mostrar mensaje elegante
                setTimeout(() => {
                    successMessage.classList.remove('hidden');
                    form.reset();
                    inputs.forEach(i => i.classList.remove('has-content'));

                    // Opcionalmente volver a mostrar el botón tras un tiempo
                    setTimeout(() => {
                        successMessage.classList.add('hidden');
                        submitBtn.style.display = 'inline-block';
                    }, 6000);
                }, 500);
            }
        });

        // Limpiar errores al escribir
        inputs.forEach(input => {
            input.addEventListener('input', function () {
                this.closest('.input-wrapper').classList.remove('error');
            });
        });
    }

    // Helper de email
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }
});
