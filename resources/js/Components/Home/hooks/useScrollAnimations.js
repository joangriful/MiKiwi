import { useEffect } from 'react';

export default function useScrollAnimations() {
    useEffect(() => {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const supportsHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

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

        if (supportsHover) {
            magneticBtns.forEach(btn => {
                btn.addEventListener('mousemove', handleMagneticMove);
                btn.addEventListener('mouseleave', handleMagneticLeave);
            });
        }

        const kineticBgs = document.querySelectorAll('.kinetic-bg, .kinetic-bg-2');
        const capsule = document.querySelector('.hero-capsule-float');
        const collectionsHero = document.getElementById('collections-hero');
        const revealEls = collectionsHero ? collectionsHero.querySelectorAll('[data-scroll-reveal]') : [];
        const gallerySection = document.querySelector('.gallery-section');
        const galleryHeader = gallerySection ? gallerySection.querySelector('.gallery-header') : null;
        const galleryCards = gallerySection ? gallerySection.querySelectorAll('.gallery-card') : [];

        let rafId = null;
        let pending = false;

        const runScrollEffects = () => {
            pending = false;

            const scrollY = window.scrollY;
            const windowHeight = window.innerHeight;

            if (!prefersReducedMotion) {
                kineticBgs.forEach((bg, index) => {
                    const speed = index === 0 ? 0.3 : 0.15;
                    bg.style.transform = `translate(-50%, calc(-50% + ${scrollY * speed}px))`;
                });
            }

            if (capsule) {
                if (scrollY > windowHeight * 0.3) capsule.classList.add('capsule-sidebar');
                else capsule.classList.remove('capsule-sidebar');
            }

            if (collectionsHero) {
                const rect = collectionsHero.getBoundingClientRect();
                const heroCenter = rect.top + rect.height / 2;
                const viewportCenter = windowHeight / 2;
                const progress = Math.max(0, 1 - (Math.abs(heroCenter - viewportCenter) / windowHeight));

                revealEls.forEach(el => {
                    const delay = parseInt(el.dataset.delay || '0', 10) || 0;
                    const threshold = 0.3 + (delay / 2000);
                    if (progress > threshold) el.classList.add('visible');
                    else if (progress < threshold - 0.15) el.classList.remove('visible');
                });
            }

            if (gallerySection) {
                if (galleryHeader) {
                    const rect = galleryHeader.getBoundingClientRect();
                    if (rect.top < windowHeight * 0.85) galleryHeader.classList.add('visible');
                    else galleryHeader.classList.remove('visible');
                }

                galleryCards.forEach(card => {
                    const rect = card.getBoundingClientRect();
                    if (rect.top < windowHeight * 0.9) card.classList.add('visible');
                    else card.classList.remove('visible');
                });
            }
        };

        const handleScroll = () => {
            if (pending) {
                return;
            }
            pending = true;
            rafId = requestAnimationFrame(runScrollEffects);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        runScrollEffects();

        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (rafId) {
                cancelAnimationFrame(rafId);
            }
            if (supportsHover) {
                magneticBtns.forEach(btn => {
                    btn.removeEventListener('mousemove', handleMagneticMove);
                    btn.removeEventListener('mouseleave', handleMagneticLeave);
                });
            }
        };
    }, []);
}
