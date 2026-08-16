/**
 * LITOS — Script principal
 * Navbar scroll, menú móvil, scroll reveal, envío de formulario con Formspree
 */

document.addEventListener('DOMContentLoaded', () => {

    // ─────────────────────────────────────────────
    // 1. NAVBAR — Efecto glassmorphism al hacer scroll
    // ─────────────────────────────────────────────
    const navbar = document.getElementById('navbar');

    const handleScroll = () => {
        if (window.scrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Ejecutar al cargar por si empieza con scroll


    // ─────────────────────────────────────────────
    // 2. MENÚ MÓVIL — Hamburger toggle
    // ─────────────────────────────────────────────
    const hamburger   = document.getElementById('hamburger');
    const mobileMenu  = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    const openMenu = () => {
        hamburger.classList.add('open');
        mobileMenu.classList.add('open');
        hamburger.setAttribute('aria-expanded', 'true');
        mobileMenu.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    };

    const closeMenu = () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    };

    hamburger.addEventListener('click', () => {
        hamburger.classList.contains('open') ? closeMenu() : openMenu();
    });

    // Cerrar al pulsar un enlace del menú móvil
    mobileLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Cerrar con tecla Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeMenu();
    });


    // ─────────────────────────────────────────────
    // 3. ANIMACIONES — Intersection Observer
    // ─────────────────────────────────────────────
    const fadeElements = document.querySelectorAll('.fade-in, .scroll-reveal');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -80px 0px' });

        fadeElements.forEach(el => observer.observe(el));
    } else {
        fadeElements.forEach(el => el.classList.add('visible'));
    }

    // Hero y Navbar siempre visibles al cargar
    setTimeout(() => {
        const hero = document.querySelector('.hero');
        if (hero) hero.classList.add('visible');
        if (navbar) navbar.classList.add('visible');
    }, 100);


    // ─────────────────────────────────────────────
    // 4. SMOOTH SCROLL — Todos los anchors internos
    // ─────────────────────────────────────────────
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId.length <= 1) return;
            const target = document.querySelector(targetId);
            if (!target) return;
            e.preventDefault();
            const navH = navbar ? navbar.offsetHeight : 0;
            const top = target.getBoundingClientRect().top + window.scrollY - navH;
            window.scrollTo({ top, behavior: 'smooth' });
        });
    });


    // ─────────────────────────────────────────────
    // 5. FORMULARIO — Floating labels & validación & envío Formspree
    // ─────────────────────────────────────────────
    const form       = document.getElementById('contact-form');
    const submitBtn  = document.getElementById('submit-btn');
    const successMsg = document.getElementById('form-success');
    const errorMsg   = document.getElementById('form-error');
    const inputs     = document.querySelectorAll('.input-wrapper input, .input-wrapper textarea');

    // Limpiar estado de error al escribir
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            input.closest('.input-wrapper').classList.remove('error');
        });
    });

    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // — Validación local —
        let isValid = true;
        inputs.forEach(input => {
            if (!input.hasAttribute('required')) return;
            const wrapper = input.closest('.input-wrapper');
            const empty   = input.value.trim() === '';
            const badEmail = input.type === 'email' && !validateEmail(input.value);

            if (empty || badEmail) {
                wrapper.classList.add('error');
                isValid = false;
            } else {
                wrapper.classList.remove('error');
            }
        });

        if (!isValid) return;

        // — Estado loading —
        submitBtn.classList.add('loading');
        successMsg.classList.add('hidden');
        errorMsg.classList.add('hidden');

        // — Envío a Formspree —
        try {
            const data     = new FormData(form);
            const response = await fetch(form.action, {
                method:  'POST',
                body:    data,
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                // ✅ Éxito
                form.reset();
                inputs.forEach(i => i.closest('.input-wrapper').classList.remove('error'));
                successMsg.classList.remove('hidden');
                successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else {
                // ❌ Error del servidor
                errorMsg.classList.remove('hidden');
            }
        } catch (_) {
            // ❌ Error de red
            errorMsg.classList.remove('hidden');
        } finally {
            submitBtn.classList.remove('loading');
        }
    });

    // Helper de validación de email
    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).toLowerCase());
    }

});
