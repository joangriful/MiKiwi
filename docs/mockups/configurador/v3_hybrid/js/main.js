document.addEventListener('DOMContentLoaded', () => {
    console.log('MiKiwi Sensory Core V3 Initialized');

    const capsuleContainer = document.querySelector('.capsule-container');
    const mainCapsule = document.getElementById('main-capsule');
    const customizerPanel = document.getElementById('customizer-panel');
    const heroH1 = document.querySelector('.hero h1');
    const resonanceRoot = document.getElementById('resonance-root');

    // --- CONCEPTUAL MATERIALS ---
    const materials = {
        titanium: { glass: 'rgba(255,255,255,0.4)', core: '#99b849', blur: '20px' },
        obsidian: { glass: 'rgba(0,0,0,0.8)', core: '#555', blur: '10px' },
        pearl: { glass: 'rgba(255,255,255,0.9)', core: '#fdfdfd', blur: '40px' },
        biolink: { glass: 'rgba(153,184,73,0.3)', core: '#99b849', blur: '30px' }
    };

    document.querySelectorAll('.material-option').forEach(option => {
        option.addEventListener('click', function () {
            // Update UI
            document.querySelectorAll('.material-option').forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');

            // Apply Material Logic
            const material = this.getAttribute('data-material');
            const config = materials[material];

            mainCapsule.style.transition = 'all 0.8s cubic-bezier(0.165, 0.84, 0.44, 1)';
            mainCapsule.style.background = `linear-gradient(135deg, ${config.glass} 0%, rgba(255,255,255,0.1) 100%)`;

            // Update Internal Core Pulse
            mainCapsule.style.setProperty('--core-color', config.core);

            // Add resonance pulse
            triggerResonance();
        });
    });

    const triggerResonance = () => {
        resonanceRoot.style.opacity = '1';
        setTimeout(() => { resonanceRoot.style.opacity = '0'; }, 4000);
    };

    // Reveal animations integration point
    const revealElements = document.querySelectorAll('.gallery-item, .quiz-card, .humanoid-left');

    // Initial styles for animations
    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 1s cubic-bezier(0.165, 0.84, 0.44, 1)';
    });

    const handleScroll = () => {
        const scrollY = window.scrollY;
        const viewportHeight = window.innerHeight;

        // --- CAPSULE MOVEMENT ---
        if (scrollY > viewportHeight * 0.1) {
            capsuleContainer.classList.add('capsule-sidebar');
            customizerPanel.classList.add('active');
        } else {
            capsuleContainer.classList.remove('capsule-sidebar');
            customizerPanel.classList.remove('active');
        }

        // --- PARALLAX TEXT ---
        if (heroH1) {
            const parallaxVal = scrollY * 0.5;
            heroH1.style.transform = `translateX(-${parallaxVal}px)`;
            heroH1.style.opacity = Math.max(0, 1 - scrollY / 600);
        }

        // Parallax for capsule
        if (capsuleContainer.classList.contains('capsule-sidebar')) {
            const movement = (scrollY - viewportHeight * 0.1) * 0.12;
            capsuleContainer.style.marginTop = `${movement}px`;
        } else {
            capsuleContainer.style.marginTop = '0px';
        }

        // --- REVEAL ELEMENTS ---
        const triggerBottom = window.innerHeight * 0.85;
        revealElements.forEach(el => {
            const elTop = el.getBoundingClientRect().top;
            if (elTop < triggerBottom) {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }
        });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
});
