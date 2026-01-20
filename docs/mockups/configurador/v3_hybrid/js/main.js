document.addEventListener('DOMContentLoaded', () => {
    console.log('MiKiwi Hybrid Mockup V3 Initialized');

    const kiwiContainer = document.querySelector('.kiwi-container');
    const heroSection = document.querySelector('.hero');

    // Smooth scrolling for navigation
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            console.log('Nav item clicked:', this.textContent);
        });
    });

    // Reveal animations integration point
    const revealElements = document.querySelectorAll('.gallery-item, .quiz-card, .humanoid-left');

    // Initial styles for animations
    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.8s cubic-bezier(0.165, 0.84, 0.44, 1)';
    });

    const handleScroll = () => {
        const scrollY = window.scrollY;
        const viewportHeight = window.innerHeight;

        // --- KIWI MOVEMENT ---
        // If we scrolled past 20% of the first section, move to side
        if (scrollY > viewportHeight * 0.2) {
            kiwiContainer.classList.add('kiwi-sidebar');
        } else {
            kiwiContainer.classList.remove('kiwi-sidebar');
        }

        // Parallax effect for the kiwi while scrolling down
        if (kiwiContainer.classList.contains('kiwi-sidebar')) {
            const movement = (scrollY - viewportHeight * 0.2) * 0.1;
            kiwiContainer.style.marginTop = `${movement}px`;
        } else {
            kiwiContainer.style.marginTop = '0px';
        }

        // --- REVEAL ELEMENTS ---
        const triggerBottom = window.innerHeight * 0.8;
        revealElements.forEach(el => {
            const elTop = el.getBoundingClientRect().top;
            if (elTop < triggerBottom) {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }
        });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Trigger once on load
});
