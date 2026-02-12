import React, { useEffect, useRef, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import Lenis from 'lenis';
import './Home.css';

const Home = () => {
    const [selectedMaterial, setSelectedMaterial] = useState('biolink');
    const heroRef = useRef(null);
    const collectionsHeroRef = useRef(null);
    const gallerySectionRef = useRef(null);
    const stackItemsRef = useRef([]);
    const stackContainerRef = useRef(null);

    // Logic for Lenis and general scroll animations
    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.4,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

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
            if (collectionsHeroRef.current) {
                const rect = collectionsHeroRef.current.getBoundingClientRect();
                const windowHeight = window.innerHeight;
                const heroCenter = rect.top + rect.height / 2;
                const viewportCenter = windowHeight / 2;
                const progress = Math.max(0, 1 - (Math.abs(heroCenter - viewportCenter) / windowHeight));

                const revealEls = collectionsHeroRef.current.querySelectorAll('[data-scroll-reveal]');
                revealEls.forEach(el => {
                    const delay = parseInt(el.dataset.delay) || 0;
                    const threshold = 0.3 + (delay / 2000);
                    if (progress > threshold) el.classList.add('visible');
                    else if (progress < threshold - 0.15) el.classList.remove('visible');
                });
            }

            // Gallery reveal
            if (gallerySectionRef.current) {
                const windowHeight = window.innerHeight;
                const header = gallerySectionRef.current.querySelector('.gallery-header');
                const cards = gallerySectionRef.current.querySelectorAll('.gallery-card');

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
            lenis.destroy();
        };
    }, []);

    // Stack Cards Logic
    useEffect(() => {
        const stackItems = stackItemsRef.current;
        if (stackItems.length === 0) return;

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

        let states = null;
        const adaptiveLerp = (current, target, baseFactor) => {
            const distance = Math.abs(target - current);
            let factor = distance > 50 ? config.lerpFactorSlow : distance > 10 ? baseFactor : config.lerpFactorFast;
            return current + (target - current) * Math.min(factor, 0.2);
        };

        const tick = () => {
            const stackItems = stackItemsRef.current.filter(Boolean);
            if (stackItems.length === 0) {
                requestAnimationFrame(tick);
                return;
            }

            if (!states || states.length !== stackItems.length) {
                states = stackItems.map(() => ({
                    current: { scale: 1, opacity: 1, blur: 0, brightness: 1, saturation: 1, translateY: 0, translateZ: 0, rotateX: 0, imageScale: 1, shadow: 0 },
                    target: { scale: 1, opacity: 1, blur: 0, brightness: 1, saturation: 1, translateY: 0, translateZ: 0, rotateX: 0, imageScale: 1, shadow: 0 }
                }));
            }

            const windowHeight = window.innerHeight;
            const depths = new Array(stackItems.length).fill(0);

            for (let i = stackItems.length - 1; i >= 0; i--) {
                const card = stackItems[i];
                let overlappingRectTop = windowHeight;
                if (i < stackItems.length - 1) {
                    overlappingRectTop = stackItems[i + 1].getBoundingClientRect().top;
                }
                const overlapProgress = Math.max(0, Math.min(1, 1 - (overlappingRectTop / windowHeight)));
                let neighborDepth = i < stackItems.length - 1 ? depths[i + 1] : 0;
                depths[i] = overlapProgress + neighborDepth;
            }

            stackItems.forEach((card, i) => {
                const c = states[i].current;
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

                const bf = config.lerpFactorBase;
                c.scale = adaptiveLerp(c.scale, t.scale, bf);
                c.opacity = adaptiveLerp(c.opacity, t.opacity, bf);
                c.blur = adaptiveLerp(c.blur, t.blur, bf);
                c.brightness = adaptiveLerp(c.brightness, t.brightness, bf);
                c.saturation = adaptiveLerp(c.saturation, t.saturation, bf);
                c.translateY = adaptiveLerp(c.translateY, t.translateY, bf);
                c.translateZ = adaptiveLerp(c.translateZ, t.translateZ, bf);
                c.rotateX = adaptiveLerp(c.rotateX, t.rotateX, bf);
                c.imageScale = adaptiveLerp(c.imageScale, t.imageScale, bf);
                c.shadow = adaptiveLerp(c.shadow, t.shadow, bf);

                const transform = `perspective(${config.perspective}px) translateY(${c.translateY.toFixed(1)}px) translateZ(${c.translateZ.toFixed(1)}px) rotateX(${c.rotateX.toFixed(2)}deg) scale(${c.scale.toFixed(4)})`;
                card.style.transform = transform;
                card.style.opacity = c.opacity.toFixed(3);
                card.style.zIndex = 100 + i; // Offset to ensure it's above other elements

                let filters = [];
                if (c.blur > 0.3) filters.push(`blur(${c.blur.toFixed(1)}px)`);
                if (c.brightness < 0.98) filters.push(`brightness(${c.brightness.toFixed(2)})`);
                if (c.saturation < 0.98) filters.push(`saturate(${c.saturation.toFixed(2)})`);
                card.style.filter = filters.length ? filters.join(' ') : 'none';

                const collectionCard = card.querySelector('.collection-card');
                if (collectionCard && c.shadow > 0.01) {
                    collectionCard.style.boxShadow = `
                        0 ${(20 + c.shadow * 35).toFixed(1)}px ${(45 + c.shadow * 45).toFixed(1)}px rgba(34, 43, 36, ${(c.shadow * 0.15).toFixed(3)}),
                        0 ${(6 + c.shadow * 10).toFixed(1)}px ${(18 + c.shadow * 18).toFixed(1)}px rgba(34, 43, 36, ${(c.shadow * 0.1).toFixed(3)})
                    `;
                }


                const img = card.querySelector('.card-image');
                if (img) {
                    const rect = card.getBoundingClientRect();
                    const cardProgress = 1 - (rect.top / windowHeight);
                    const parallaxOffset = (Math.max(0, Math.min(1, cardProgress)) - 0.5) * 100;
                    img.style.transform = `translateY(${parallaxOffset}px) scale(${c.imageScale})`;
                }
            });

            requestAnimationFrame(tick);
        };

        const stackContainer = stackContainerRef.current;
        if (stackContainer) {
            stackContainer.style.perspective = `${config.perspective}px`;
            stackContainer.style.perspectiveOrigin = 'center top';
            stackContainer.style.transformStyle = 'preserve-3d';
        }

        const animationId = requestAnimationFrame(tick);

        return () => cancelAnimationFrame(animationId);
    }, []);

    const charSplit = (text, startDelay = 0) => {
        return text.split('').map((char, i) => (
            <span
                key={i}
                className="char"
                data-scroll-reveal
                data-delay={startDelay + (i * 50)}
                style={{ color: char === '.' ? 'inherit' : (i >= 6 && i <= 10 ? 'var(--kiwi)' : 'inherit') }}
            >
                {char}
            </span>
        ));
    };

    return (
        <div className="home-container">
            <Head title="MiKiwi | V6 Global Sensory Luxury" />

            {/* 1. HERO SECTION */}
            <section className="hero-side" ref={heroRef}>
                <div className="kinetic-bg">MIKIWI</div>
                <div className="kinetic-bg kinetic-bg-2">THE ORIGIN</div>

                <div className="hero-content" style={{ position: 'relative', zIndex: 100 }}>
                    <h1>MiKiwi.</h1>
                    <p>Trascendiendo el límite de lo material. Ingeniería sensorial Suiza diseñada para la introspección profunda.</p>
                </div>
                <div className="hero-capsule-float">
                    <div className="capsule-core"></div>
                </div>
            </section >

            {/* 2. PERSONALITY CALIBRATION */}
            < section className="calibration-section" >
                <div className="calib-title">
                    <span style={{ fontWeight: 900, letterSpacing: '10px', color: 'var(--kiwi)', textTransform: 'uppercase', fontSize: '0.7rem', display: 'block', marginBottom: '20px' }}>
                        SISTEMA DE IDENTIDAD v6
                    </span>
                    <h2>Descubre tu<br />Personalidad.</h2>
                    <p style={{ marginTop: '20px', color: 'var(--text-muted)' }}>
                        Calibra tu estado mental para encontrar el perfil sensorial que se alinea con tu arquitectura interna.
                    </p>
                </div>
                <div className="quiz-container">
                    <p style={{ fontWeight: 900, letterSpacing: '5px', fontSize: '0.7rem', color: 'var(--color-primary)' }}>
                        CUESTIONARIO DE DIAGNÓSTICO
                    </p>
                    <h3 style={{ margin: '20px 0', fontSize: '2rem', fontFamily: 'var(--font-head)' }}>
                        ¿Cómo defines tu espacio de silencio?
                    </h3>
                    <p style={{ marginBottom: '40px', color: 'var(--text-muted)', opacity: 0.7 }}>
                        Analizaremos tu respuesta somática para recomendarte el núcleo de resonancia perfecto.
                    </p>
                    <Link href="#" className="btn-v6">Iniciar Calibración</Link>
                </div>
            </section >

            {/* 3. FEATURED PRODUCTS */}
            < section className="curation-section" >
                <div className="curation-header">
                    <h2>Productos Destacados.</h2>
                    <p style={{ textAlign: 'right', maxWidth: '300px', color: 'var(--text-muted)' }}>
                        Selección exclusiva de nuestras piezas fundamentales de ingeniería sensorial.
                    </p>
                </div>

                <div className="product-gallery">
                    {[
                        { tag: 'H-01 // DEPTH', name: 'Void Sphere', desc: 'Gravedad sensorial pura.', color: 'var(--color-primary)' },
                        { tag: 'H-02 // VISION', name: 'Aura Lens', desc: 'Filtración de espectro.', color: 'var(--color-secondary)' },
                        { tag: 'H-03 // WAVE', name: 'Zen Flow', desc: 'Frecuencia rítmica.', color: 'var(--text-main)', opacity: 0.1 },
                        { tag: 'H-04 // CORE', name: 'Neural Core', desc: 'Sincronía total.', border: true }
                    ].map((prod, i) => (
                        <div key={i} className="product-item">
                            <span className="product-tag">{prod.tag}</span>
                            <div className="product-img-box">
                                {prod.border ? (
                                    <div style={{ width: '60px', height: '120px', border: '1px solid var(--border)', borderRadius: '50px' }}></div>
                                ) : (
                                    <div style={{ width: i === 2 ? '120px' : (i === 1 ? '100px' : '80px'), height: i === 2 ? '10px' : (i === 1 ? '100px' : '80px'), background: prod.color, borderRadius: i === 1 ? '10px' : '50%', filter: i < 2 ? 'blur(20px)' : 'none', opacity: prod.opacity || 0.4 }}></div>
                                )}
                            </div>
                            <h3 style={{ fontFamily: 'var(--font-head)', fontSize: '2rem' }}>{prod.name}</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{prod.desc}</p>
                        </div>
                    ))}
                </div>

                <div className="collections-btn-wrap">
                    <Link href="#" className="btn-v6">Ver Colecciones</Link>
                </div>
            </section >

            {/* 4. PREMIUM ATELIER */}
            < section className="premium-atelier" >
                <div className="atelier-bg-visual"></div>
                <div className="atelier-content">
                    <span className="atelier-tag">EXPERIMENTAL DIVISION</span>
                    <h2>Zona Premium,<br />Tu Muñeca.</h2>
                    <p style={{ fontSize: '1.5rem', color: 'rgba(255,255,255,0.4)', fontWeight: 300 }}>
                        Configuración de modelos de alta fidelidad. Crea tu unidad humana a medida con precisión biotécnica.
                    </p>

                    <div className="config-preview-box">
                        <div className="config-item">
                            <span>POLÍMERO</span>
                            <p>OBSIDIAN</p>
                        </div>
                        <div className="config-item">
                            <span>ID SYNC</span>
                            <p>ELITE-01</p>
                        </div>
                        <div className="config-item">
                            <span>FINISH</span>
                            <p>MATTE</p>
                        </div>
                    </div>

                    <Link href="#" className="atelier-btn">Lanzar Configurador</Link>
                </div>
            </section >

            {/* 5. COLLECTIONS */}
            < div className="split-container" id="collections-split" >
                <div className="split-left">
                    <section className="hero-split-context" id="collections-hero" ref={collectionsHeroRef}>
                        <div className="hero-shapes">
                            <div className="hero-shape hero-shape--1" data-scroll-reveal></div>
                            <div className="hero-shape hero-shape--2" data-scroll-reveal></div>
                            <div className="hero-shape hero-shape--3" data-scroll-reveal></div>
                            <div className="hero-shape hero-shape--4" data-scroll-reveal></div>
                        </div>

                        <div className="hero-content">
                            <h2 className="hero-title-split">
                                <span className="word">
                                    {charSplit('Colecciones.')}
                                </span>
                            </h2>
                            <p className="hero-subtitle-split" data-scroll-reveal>
                                Universos sensoriales cuidadosamente curados. Cada colección cuenta una historia única de placer y descubrimiento.
                            </p>
                            <div style={{ textAlign: 'center' }}>
                                <div className="btn-magnetic" data-scroll-reveal data-magnetic>
                                    Explorar Universos
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <path d="M12 5v14M5 12l7 7 7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="scroll-indicator" data-scroll-reveal>
                            <span>Scroll</span>
                            <div className="line"></div>
                        </div>
                    </section>
                </div>

                <div className="split-right">
                    <div className="stack-container" id="collections-list" ref={stackContainerRef}>
                        <ul className="stack-cards">
                            {[
                                { tag: 'COL-01 // Feminine', title: 'Para Ella.', img: '/images/collections/collection_ella.png', desc: 'Diseños ergonómicos y texturas premium pensados para maximizar el placer femenino.', pills: ['Silicona Premium', '10 Modos', 'IPX7'] },
                                { tag: 'COL-02 // Masculine', title: 'Para Él.', img: '/images/collections/collection_el.png', desc: 'Innovación masculina redefinida. Masturbadores con tecnología háptica, anillos vibradores y accesorios.', pills: ['Tech Háptica', 'Control App', 'USB-C'], alt: true },
                                { tag: 'COL-03 // Shared', title: 'Parejas.', img: '/images/collections/collection_parejas.png', desc: 'Juguetes diseñados para compartir. Vibradores controlados a distancia y accesorios que intensifican la conexión.', pills: ['Control Dual', 'Sync', 'Long Range'] },
                                { tag: 'COL-04 // Sensorial', title: 'Experiencias.', img: '/images/collections/collection_experiencias.png', desc: 'Kits curados para despertar todos los sentidos. Aceites de masaje, velas y elementos de exploración sensorial.', pills: ['Aromaterapia', 'Gift Ready', 'Premium'], alt: true }
                            ].map((col, i) => (
                                <li key={i} className="stack-cards__item" ref={el => stackItemsRef.current[i] = el}>
                                    <article className={`collection-card ${col.alt ? 'alt' : ''}`}>
                                        <div className="card-visual">
                                            <img src={col.img} alt={col.title} className="card-image" />
                                        </div>
                                        <div className="card-content">
                                            <span className="card-tag">{col.tag}</span>
                                            <h2 className="card-title">{col.title}</h2>
                                            <p className="card-desc">{col.desc}</p>
                                            <div className="feature-pills">
                                                {col.pills.map((pill, j) => <span key={j} className="pill">{pill}</span>)}
                                            </div>
                                            <Link href="#" className="card-link">Explorar Colección</Link>
                                        </div>
                                    </article>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div >

            {/* 6. IMMERSIVE GALLERY */}
            < section className="gallery-section" ref={gallerySectionRef} >
                <div className="gallery-header" data-scroll-reveal>
                    <h2>Explora Todo.</h2>
                    <p>Acceso directo a todas las colecciones</p>
                </div>
                <div className="gallery-grid">
                    {[
                        { tag: 'COL-01', title: 'Para Ella', img: '/assets/images/home/collection_ella.png' },
                        { tag: 'COL-02', title: 'Para Él', img: '/assets/images/home/collection_el.png' },
                        { tag: 'COL-03', title: 'Parejas', img: '/assets/images/home/collection_parejas.png' },
                        { tag: 'COL-04', title: 'Experiencias', img: '/assets/images/home/collection_experiencias.png' }
                    ].map((col, i) => (
                        <Link key={i} href="#" className="gallery-card" data-scroll-reveal>
                            <img src={col.img.replace('/assets/images/home/', '/images/collections/')} alt={col.title} />
                            <div className="gallery-card-content">
                                <span className="gallery-card-tag">{col.tag}</span>
                                <h3 className="gallery-card-title">{col.title}</h3>
                                <span className="gallery-card-cta">Ver colección →</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </section >
        </div >
    );
};

export default Home;
