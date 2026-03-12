import { useEffect } from 'react';

export default function useScrollAnimations() {
    useEffect(() => {
        // Magnetic buttons
        const magneticBtns = document.querySelectorAll('[data-magnetic]');
        const handleMagneticMove = (e) => {
            const btn = e.currentTarget;
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
        };
        const handleMagneticLeave = (e) => {
            e.currentTarget.style.transform = 'translate(0, 0)';
        };

        magneticBtns.forEach(btn => {
            btn.addEventListener('mousemove', handleMagneticMove);
            btn.addEventListener('mouseleave', handleMagneticLeave);
        });

        // Kinetic BG parallax & Hero animations
        const handleScroll = () => {
            const scrollY = window.scrollY;
            const windowHeight = window.innerHeight;

            // Kinetic backgrounds
            const kineticBgs = document.querySelectorAll('.kinetic-bg, .kinetic-bg-2');
            kineticBgs.forEach((bg, index) => {
                const speed = index === 0 ? 0.3 : 0.15;
                bg.style.transform = `translate(-50%, calc(-50% + ${scrollY * speed}px))`;
            });

            // Capsule sidebar behavior
            const capsule = document.querySelector('.hero-capsule-float');
            if (capsule) {
                if (scrollY > windowHeight * 0.3) capsule.classList.add('capsule-sidebar');
                else capsule.classList.remove('capsule-sidebar');
            }

            // Collections Hero animations
            const collectionsHero = document.getElementById('collections-hero');
            if (collectionsHero) {
                const rect = collectionsHero.getBoundingClientRect();
                const heroCenter = rect.top + rect.height / 2;
                const viewportCenter = windowHeight / 2;
                const progress = Math.max(0, 1 - (Math.abs(heroCenter - viewportCenter) / windowHeight));

                const revealEls = collectionsHero.querySelectorAll('[data-scroll-reveal]');
                revealEls.forEach(el => {
                    const delay = parseInt(el.dataset.delay) || 0;
                    const threshold = 0.3 + (delay / 2000);
                    if (progress > threshold) el.classList.add('visible');
                    else if (progress < threshold - 0.15) el.classList.remove('visible');
                });
            }

            // Gallery reveal
            const gallerySection = document.querySelector('.gallery-section');
            if (gallerySection) {
                const header = gallerySection.querySelector('.gallery-header');
                const cards = gallerySection.querySelectorAll('.gallery-card');

                if (header) {
                    const rect = header.getBoundingClientRect();
                    if (rect.top < windowHeight * 0.85) header.classList.add('visible');
                    else header.classList.remove('visible');
                }

                cards.forEach(card => {
                    const rect = card.getBoundingClientRect();
                    if (rect.top < windowHeight * 0.9) card.classList.add('visible');
                    else card.classList.remove('visible');
                });
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Initial check

        return () => {
            window.removeEventListener('scroll', handleScroll);
            magneticBtns.forEach(btn => {
                btn.removeEventListener('mousemove', handleMagneticMove);
                btn.removeEventListener('mouseleave', handleMagneticLeave);
            });
        };
    }, []);
}
