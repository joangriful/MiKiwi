import { useEffect } from 'react';

export default function useScrollAnimations() {
    useEffect(() => {
        const magneticButtons = document.querySelectorAll('[data-magnetic]');

        const handleMagneticMove = (event) => {
            const button = event.currentTarget;
            const rect = button.getBoundingClientRect();
            const x = event.clientX - rect.left - rect.width / 2;
            const y = event.clientY - rect.top - rect.height / 2;

            button.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
        };

        const handleMagneticLeave = (event) => {
            event.currentTarget.style.transform = 'translate(0, 0)';
        };

        magneticButtons.forEach((button) => {
            button.addEventListener('mousemove', handleMagneticMove);
            button.addEventListener('mouseleave', handleMagneticLeave);
        });

        const handleScroll = () => {
            const scrollY = window.scrollY;
            const windowHeight = window.innerHeight;

            const kineticBackgrounds = document.querySelectorAll('[data-kinetic-bg]');
            kineticBackgrounds.forEach((background, index) => {
                const speed = index === 0 ? 0.3 : 0.15;
                background.style.transform = `translate(-50%, calc(-50% + ${scrollY * speed}px))`;
            });

            const capsule = document.querySelector('[data-hero-capsule]');
            if (capsule) {
                capsule.classList.toggle('capsule-sidebar', scrollY > windowHeight * 0.3);
            }

            const collectionsHero = document.querySelector('[data-collections-hero]');
            if (collectionsHero) {
                const rect = collectionsHero.getBoundingClientRect();
                const heroCenter = rect.top + rect.height / 2;
                const viewportCenter = windowHeight / 2;
                const progress = Math.max(0, 1 - (Math.abs(heroCenter - viewportCenter) / windowHeight));

                const revealElements = collectionsHero.querySelectorAll('[data-scroll-reveal]');
                revealElements.forEach((element) => {
                    const delay = parseInt(element.dataset.delay || '0', 10);
                    const threshold = 0.3 + (delay / 2000);

                    if (progress > threshold) {
                        element.setAttribute('data-visible', 'true');
                    } else if (progress < threshold - 0.15) {
                        element.removeAttribute('data-visible');
                    }
                });
            }

            const gallerySection = document.querySelector('[data-gallery-section]');
            if (gallerySection) {
                const header = gallerySection.querySelector('[data-gallery-header]');
                const cards = gallerySection.querySelectorAll('[data-gallery-card]');

                if (header) {
                    const rect = header.getBoundingClientRect();
                    if (rect.top < windowHeight * 0.85) {
                        header.setAttribute('data-visible', 'true');
                    } else {
                        header.removeAttribute('data-visible');
                    }
                }

                cards.forEach((card) => {
                    const rect = card.getBoundingClientRect();
                    if (rect.top < windowHeight * 0.9) {
                        card.setAttribute('data-visible', 'true');
                    } else {
                        card.removeAttribute('data-visible');
                    }
                });
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();

        return () => {
            window.removeEventListener('scroll', handleScroll);

            magneticButtons.forEach((button) => {
                button.removeEventListener('mousemove', handleMagneticMove);
                button.removeEventListener('mouseleave', handleMagneticLeave);
            });
        };
    }, []);
}
