document.addEventListener('DOMContentLoaded', () => {
    console.log('MiKiwi Visionary Obsidian V4 Initialized');

    const capsule = document.querySelector('.capsule-vision');
    const heroRight = document.querySelector('.hero-right');

    // --- MOUSE TRACKING (Visionary Depth) ---
    heroRight.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const { left, top, width, height } = heroRight.getBoundingClientRect();

        const x = (clientX - left) / width - 0.5;
        const y = (clientY - top) / height - 0.5;

        capsule.style.transform = `translate(${x * 40}px, ${y * 40}px) rotateX(${y * 20}deg) rotateY(${x * 20}deg)`;
    });

    heroRight.addEventListener('mouseleave', () => {
        capsule.style.transform = `translate(0, 0) rotateX(0) rotateY(0)`;
    });

    // --- SMOOTH REVEAL ON SCROLL ---
    const revealElements = document.querySelectorAll('.product-v4, .scroll-title, .humat-section h2, .spec-item');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(40px)';
        el.style.transition = 'all 1s cubic-bezier(0.165, 0.84, 0.44, 1)';
        observer.observe(el);
    });

    // Add a custom style for the revealed class
    const style = document.createElement('style');
    style.innerHTML = `
        .revealed {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);

    // --- DYNAMIC COUNTERS (Technical Feel) ---
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        let count = 0;
        const updateCount = () => {
            const speed = target / 100;
            if (count < target) {
                count += speed;
                counter.innerText = Math.ceil(count);
                setTimeout(updateCount, 20);
            } else {
                counter.innerText = target;
            }
        };
        updateCount();
    });
});
