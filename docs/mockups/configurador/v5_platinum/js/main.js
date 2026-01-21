document.addEventListener('DOMContentLoaded', () => {
    console.log('MiKiwi Obsidian Platinum V5 Initialized');

    // --- SCROLL PROGRESS ---
    const progressBar = document.querySelector('.progress-bar');
    window.addEventListener('scroll', () => {
        const totalHeight = document.body.scrollHeight - window.innerHeight;
        const progress = (window.pageYOffset / totalHeight) * 100;
        progressBar.style.height = `${progress}%`;
    });

    // --- SMOOTH REVEAL ON SCROLL ---
    const revealElements = document.querySelectorAll('.luxury-card, .atelier-header, .luxury-cta');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('luxury-visible');
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(60px)';
        el.style.transition = 'all 1.2s cubic-bezier(0.165, 0.84, 0.44, 1)';
        observer.observe(el);
    });

    // Add luxury visibility style
    const style = document.createElement('style');
    style.innerHTML = `
        .luxury-visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);

    // --- PARALLAX MOVEMENTS ---
    window.addEventListener('scroll', () => {
        const scroll = window.pageYOffset;
        const capsule = document.querySelector('.platinum-capsule');
        if (capsule) {
            capsule.style.transform = `translateY(${scroll * 0.1}px) rotate(${scroll * 0.05}deg)`;
        }
    });
});
