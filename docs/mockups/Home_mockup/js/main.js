// MiKiwi Unified - Main JavaScript
document.addEventListener('DOMContentLoaded', () => {

    // ========================================
    // THEME TOGGLE (DARK / LIGHT MODE)
    // ========================================
    const themeToggle = document.getElementById('theme-toggle');
    const html = document.documentElement;

    // Check for saved theme preference or default to 'light'
    const savedTheme = localStorage.getItem('mikiwi-theme') || 'light';
    html.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = html.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            html.setAttribute('data-theme', newTheme);
            localStorage.setItem('mikiwi-theme', newTheme);
            updateThemeIcon(newTheme);
        });
    }

    function updateThemeIcon(theme) {
        if (themeToggle) {
            themeToggle.textContent = theme === 'light' ? '🌙' : '☀️';
        }
    }

    // ========================================
    // CAPSULE SCROLL BEHAVIOR
    // ========================================
    const capsuleContainer = document.querySelector('.capsule-container');
    const customizerUI = document.querySelector('.customizer-ui');

    if (capsuleContainer) {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            const windowHeight = window.innerHeight;

            if (scrollY > windowHeight * 0.3) {
                capsuleContainer.classList.add('capsule-sidebar');
                if (customizerUI) customizerUI.classList.add('active');
            } else {
                capsuleContainer.classList.remove('capsule-sidebar');
                if (customizerUI) customizerUI.classList.remove('active');
            }
        });
    }

    // ========================================
    // MATERIAL SELECTOR (CUSTOMIZER)
    // ========================================
    const materialOptions = document.querySelectorAll('.material-option');
    const capsule = document.querySelector('.floating-capsule');

    const colorMap = {
        'titanium': { bg: 'linear-gradient(135deg, #bfc1c2 0%, #9ca0a3 100%)', core: '#7a8085' },
        'obsidian': { bg: 'linear-gradient(135deg, #222 0%, #000 100%)', core: '#333' },
        'pearl': { bg: 'linear-gradient(135deg, #fff 0%, #f0f0f0 100%)', core: '#e0e0e0' },
        'biolink': { bg: 'linear-gradient(135deg, #99b849 0%, #7a943a 100%)', core: '#b5d45e' }
    };

    materialOptions.forEach(option => {
        option.addEventListener('click', () => {
            materialOptions.forEach(o => o.classList.remove('selected'));
            option.classList.add('selected');

            const material = option.getAttribute('data-material');
            if (capsule && colorMap[material]) {
                capsule.style.background = colorMap[material].bg;
                capsule.style.setProperty('--core-color', colorMap[material].core);
            }
        });
    });

    // ========================================
    // INTERSECTION OBSERVER FOR ANIMATIONS
    // ========================================
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        animatedElements.forEach(el => observer.observe(el));
    }

    // ========================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ========================================
    // PARALLAX EFFECT FOR KINETIC BACKGROUNDS
    // ========================================
    const kineticBgs = document.querySelectorAll('.kinetic-bg, .kinetic-bg-2');

    if (kineticBgs.length > 0) {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            kineticBgs.forEach((bg, index) => {
                const speed = index === 0 ? 0.3 : 0.15;
                bg.style.transform = `translate(-50%, calc(-50% + ${scrollY * speed}px))`;
            });
        });
    }

    // ========================================
    // QUIZ / PERSONALITY INTERACTION
    // ========================================
    const personalityBtns = document.querySelectorAll('.personality-btn');

    personalityBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            personalityBtns.forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');

            // Visual feedback
            btn.style.transform = 'scale(0.95)';
            setTimeout(() => {
                btn.style.transform = 'scale(1)';
            }, 150);
        });
    });

    // ========================================
    // PRODUCT CARD HOVER EFFECTS
    // ========================================
    const productItems = document.querySelectorAll('.product-item, .gallery-item');

    productItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.zIndex = '10';
        });
        item.addEventListener('mouseleave', () => {
            item.style.zIndex = '1';
        });
    });

    // ========================================
    // LENIS SMOOTH SCROLL
    // ========================================
    const lenis = new Lenis({
        duration: 1.4,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        smoothTouch: false,
        touchMultiplier: 2,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // ========================================
    // SCROLL REVEAL ANIMATIONS (Split Layout)
    // ========================================
    const heroSplit = document.getElementById('collections-hero');
    if (heroSplit) {
        const heroElements = heroSplit.querySelectorAll('[data-scroll-reveal]');

        function updateHeroAnimations() {
            const rect = heroSplit.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            const heroCenter = rect.top + rect.height / 2;
            const viewportCenter = windowHeight / 2;
            const distanceFromCenter = Math.abs(heroCenter - viewportCenter);
            const maxDistance = windowHeight;

            const progress = Math.max(0, 1 - (distanceFromCenter / maxDistance));

            heroElements.forEach(el => {
                const delay = parseInt(el.dataset.delay) || 0;
                const threshold = 0.3 + (delay / 2000);

                if (progress > threshold) {
                    el.classList.add('visible');
                } else if (progress < threshold - 0.15) {
                    el.classList.remove('visible');
                }
            });
        }

        window.addEventListener('scroll', updateHeroAnimations, { passive: true });
        updateHeroAnimations(); // Initial check
    }

    // ========================================
    // STACK CARDS ANIMATION
    // ========================================
    const stackItems = Array.from(document.querySelectorAll('.js-stack-cards__item'));
    if (stackItems.length > 0) {
        const config = {
            perspective: 1600,
            rotationX: 7,
            scaleStep: 0.038,
            minScale: 0.84,
            translateYStep: 30,
            translateZStep: -70,
            opacityStep: 0.85,
            minOpacity: 0.05,
            blurStep: 2.8,
            maxBlur: 11,
            brightnessStep: 0.06,
            minBrightness: 0.75,
            saturationStep: 0.12,
            minSaturation: 0.55,
            shadowIntensity: 0.35,
            lerpFactorBase: 0.09,
            lerpFactorFast: 0.16,
            lerpFactorSlow: 0.04,
        };

        const states = stackItems.map(() => ({
            current: { scale: 1, opacity: 1, blur: 0, brightness: 1, saturation: 1, translateY: 0, translateZ: 0, rotateX: 0, imageScale: 1, shadow: 0 },
            target: { scale: 1, opacity: 1, blur: 0, brightness: 1, saturation: 1, translateY: 0, translateZ: 0, rotateX: 0, imageScale: 1, shadow: 0 }
        }));

        function adaptiveLerp(current, target, baseFactor) {
            const distance = Math.abs(target - current);
            let factor = distance > 50 ? config.lerpFactorSlow : distance > 10 ? baseFactor : config.lerpFactorFast;
            return current + (target - current) * Math.min(factor, 0.2);
        }

        function calculateTargets() {
            const windowHeight = window.innerHeight;
            const depths = new Array(stackItems.length).fill(0);

            for (let i = stackItems.length - 1; i >= 0; i--) {
                let overlappingRectTop = windowHeight;
                if (i < stackItems.length - 1) {
                    overlappingRectTop = stackItems[i + 1].getBoundingClientRect().top;
                }
                const overlapProgress = Math.max(0, Math.min(1, 1 - (overlappingRectTop / windowHeight)));
                let neighborDepth = i < stackItems.length - 1 ? depths[i + 1] : 0;
                depths[i] = overlapProgress + neighborDepth;
            }

            stackItems.forEach((card, i) => {
                const t = states[i].target;
                const depth = depths[i];

                if (depth > 0.01) {
                    const effectiveDepth = Math.min(depth, 5);
                    t.scale = Math.max(config.minScale, 1 - (effectiveDepth * config.scaleStep));
                    t.opacity = Math.max(config.minOpacity, 1 - (effectiveDepth * config.opacityStep));
                    t.blur = Math.min(effectiveDepth * config.blurStep, config.maxBlur);
                    t.brightness = Math.max(config.minBrightness, 1 - (effectiveDepth * config.brightnessStep));
                    t.saturation = Math.max(config.minSaturation, 1 - (effectiveDepth * config.saturationStep));
                    t.imageScale = 1 + (effectiveDepth * 0.02);
                    t.translateY = -effectiveDepth * config.translateYStep;
                    t.translateZ = effectiveDepth * config.translateZStep;
                    t.rotateX = effectiveDepth * config.rotationX;
                    t.shadow = Math.min(effectiveDepth * config.shadowIntensity, 0.65);
                } else {
                    t.scale = 1; t.opacity = 1; t.blur = 0; t.brightness = 1; t.saturation = 1;
                    t.translateY = 0; t.translateZ = 0; t.rotateX = 0; t.imageScale = 1; t.shadow = 0;
                }
            });
        }

        function applyStyles() {
            let animating = false;
            const windowHeight = window.innerHeight;

            stackItems.forEach((card, i) => {
                const c = states[i].current;
                const t = states[i].target;
                const baseFactor = config.lerpFactorBase;

                c.scale = adaptiveLerp(c.scale, t.scale, baseFactor);
                c.opacity = adaptiveLerp(c.opacity, t.opacity, baseFactor);
                c.blur = adaptiveLerp(c.blur, t.blur, baseFactor);
                c.brightness = adaptiveLerp(c.brightness, t.brightness, baseFactor);
                c.saturation = adaptiveLerp(c.saturation, t.saturation, baseFactor);
                c.translateY = adaptiveLerp(c.translateY, t.translateY, baseFactor);
                c.translateZ = adaptiveLerp(c.translateZ, t.translateZ, baseFactor);
                c.rotateX = adaptiveLerp(c.rotateX, t.rotateX, baseFactor);
                c.imageScale = adaptiveLerp(c.imageScale, t.imageScale, baseFactor);
                c.shadow = adaptiveLerp(c.shadow, t.shadow, baseFactor);

                const diff = Math.abs(c.scale - t.scale) + Math.abs(c.opacity - t.opacity) * 0.1 +
                    Math.abs(c.translateY - t.translateY) * 0.01;
                if (diff > 0.0005) animating = true;

                const transform = `perspective(${config.perspective}px) translateY(${c.translateY.toFixed(1)}px) translateZ(${c.translateZ.toFixed(1)}px) rotateX(${c.rotateX.toFixed(2)}deg) scale(${c.scale.toFixed(4)})`;

                let filters = [];
                if (c.blur > 0.3) filters.push(`blur(${c.blur.toFixed(1)}px)`);
                if (c.brightness < 0.98) filters.push(`brightness(${c.brightness.toFixed(2)})`);
                if (c.saturation < 0.98) filters.push(`saturate(${c.saturation.toFixed(2)})`);

                card.style.transform = transform;
                card.style.opacity = c.opacity.toFixed(3);
                card.style.filter = filters.length ? filters.join(' ') : 'none';

                // Shadow on inner card
                const collectionCard = card.querySelector('.collection-card');
                if (collectionCard && c.shadow > 0.01) {
                    collectionCard.style.boxShadow = `
                        0 ${20 + c.shadow * 35}px ${45 + c.shadow * 45}px rgba(34, 43, 36, ${(c.shadow * 0.15).toFixed(3)}),
                        0 ${6 + c.shadow * 10}px ${18 + c.shadow * 18}px rgba(34, 43, 36, ${(c.shadow * 0.1).toFixed(3)})
                    `;
                }

                // Parallax on image
                const rect = card.getBoundingClientRect();
                const cardProgress = 1 - (rect.top / windowHeight);
                const clampedProgress = Math.max(0, Math.min(1, cardProgress));
                const parallaxOffset = (clampedProgress - 0.5) * 100;
                const img = card.querySelector('.card-image');
                if (img) {
                    img.style.transform = `translateY(${parallaxOffset.toFixed(1)}px) scale(${c.imageScale.toFixed(3)})`;
                }
            });
            return animating;
        }

        let running = false;
        function tick() {
            calculateTargets();
            const needsMore = applyStyles();
            if (needsMore) {
                running = true;
                requestAnimationFrame(tick);
            } else {
                running = false;
            }
        }

        function start() {
            if (!running) {
                running = true;
                requestAnimationFrame(tick);
            }
        }

        // Init Perspective on Container
        const stackContainer = document.querySelector('.stack-container');
        if (stackContainer) {
            stackContainer.style.perspective = `${config.perspective}px`;
            stackContainer.style.perspectiveOrigin = 'center top';
        }

        start();
        window.addEventListener('resize', start);
        window.addEventListener('scroll', start, { passive: true });
    }

    // ========================================
    // MAGNETIC BUTTON EFFECT
    // ========================================
    document.querySelectorAll('[data-magnetic]').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
        });
    });

    // ========================================
    // GALLERY REVEAL ANIMATION
    // ========================================
    const galleryHeader = document.querySelector('.gallery-header');
    const galleryCards = document.querySelectorAll('.gallery-card');

    function updateGalleryAnimations() {
        const windowHeight = window.innerHeight;

        // Gallery header
        if (galleryHeader) {
            const rect = galleryHeader.getBoundingClientRect();
            if (rect.top < windowHeight * 0.85 && rect.bottom > 0) {
                galleryHeader.classList.add('visible');
            } else {
                galleryHeader.classList.remove('visible');
            }
        }

        // Gallery cards
        galleryCards.forEach(card => {
            const rect = card.getBoundingClientRect();
            if (rect.top < windowHeight * 0.9 && rect.bottom > 0) {
                card.classList.add('visible');
            } else {
                card.classList.remove('visible');
            }
        });
    }

    if (galleryCards.length > 0) {
        window.addEventListener('scroll', updateGalleryAnimations, { passive: true });
        updateGalleryAnimations(); // Initial check
    }

    console.log('🥝 MiKiwi Unified - Ready');
});
