document.addEventListener('DOMContentLoaded', () => {
    console.log('MiKiwi Global Index v6.02 Initialized');

    const body = document.body;
    const themeToggle = document.getElementById('theme-toggle');
    const kineticBg = document.querySelector('.kinetic-bg');

    // --- THEME ENGINE ---
    const savedTheme = localStorage.getItem('mikiwi-theme') || 'light';
    body.setAttribute('data-theme', savedTheme);
    updateToggleIcon(savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = body.getAttribute('data-theme');
        const nextTheme = currentTheme === 'light' ? 'dark' : 'light';

        body.setAttribute('data-theme', nextTheme);
        localStorage.setItem('mikiwi-theme', nextTheme);
        updateToggleIcon(nextTheme);
    });

    function updateToggleIcon(theme) {
        themeToggle.innerHTML = theme === 'light' ? '🌙' : '☀️';
    }

    // --- KINETIC MOUSE EFFECT ---
    window.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const moveX = (window.innerWidth / 2 - clientX) * 0.02;
        const moveY = (window.innerHeight / 2 - clientY) * 0.02;

        if (kineticBg) {
            kineticBg.style.transform = `translate(calc(-50% + ${moveX}px), calc(-50% + ${moveY}px)) rotate(${moveX * 0.1}deg)`;
        }

        const kineticBg2 = document.querySelector('.kinetic-bg-2');
        if (kineticBg2) {
            kineticBg2.style.transform = `translate(calc(-50% + ${-moveX * 2}px), calc(-50% + ${-moveY * 2}px)) rotate(${-moveX * 0.2}deg)`;
        }
    });

    // --- SCROLL REVEALS ---
    const revealElements = document.querySelectorAll('.product-item, .quiz-container, .brand-reveal h1, .calib-title h2, .atelier-content, .config-preview-box');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('premium-reveal');
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(50px)';
        el.style.transition = 'all 1.2s cubic-bezier(0.165, 0.84, 0.44, 1)';
        observer.observe(el);
    });

    // Custom CSS for reveal
    const style = document.createElement('style');
    style.innerHTML = `
        .premium-reveal {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);

    // --- CAPSULE PARALLAX ---
    window.addEventListener('scroll', () => {
        const scroll = window.pageYOffset;
        const capsule = document.querySelector('.capsule-core');
        if (capsule) {
            capsule.style.transform = `translateY(${scroll * 0.1}px) rotate(${scroll * 0.03}deg)`;
        }
    });

    // --- QUIZ INTERACTION ---
    document.querySelectorAll('.personality-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            document.querySelectorAll('.personality-btn').forEach(b => {
                b.style.background = 'var(--bg-surface)';
                b.style.color = 'var(--text-main)';
            });
            this.style.background = 'var(--color-primary)';
            this.style.color = 'var(--bg-main)';
            console.log('Personality Selected:', this.innerText);
        });
    });
});
