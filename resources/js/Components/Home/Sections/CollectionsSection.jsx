import React, { useRef } from 'react';
import { Link } from '@inertiajs/react';
import useStackCards from '../hooks/useStackCards';
import { charSplit } from '../utils/textAnimations';

export default function CollectionsSection() {
    const collectionsHeroRef = useRef(null);
    const stackItemsRef = useRef([]);
    const stackContainerRef = useRef(null);

    useStackCards(stackItemsRef, stackContainerRef);

    const collections = [
        { tag: 'COL-01 // Feminine', title: 'Para Ella.', img: '/images/collections/collection_ella.png', desc: 'Diseños ergonómicos y texturas premium pensados para maximizar el placer femenino.', pills: ['Silicona Premium', '10 Modos', 'IPX7'] },
        { tag: 'COL-02 // Masculine', title: 'Para Él.', img: '/images/collections/collection_el.png', desc: 'Innovación masculina redefinida. Masturbadores con tecnología háptica, anillos vibradores y accesorios.', pills: ['Tech Háptica', 'Control App', 'USB-C'], alt: true },
        { tag: 'COL-03 // Shared', title: 'Parejas.', img: '/images/collections/collection_parejas.png', desc: 'Juguetes diseñados para compartir. Vibradores controlados a distancia y accesorios que intensifican la conexión.', pills: ['Control Dual', 'Sync', 'Long Range'] },
        { tag: 'COL-04 // Sensorial', title: 'Experiencias.', img: '/images/collections/collection_experiencias.png', desc: 'Kits curados para despertar todos los sentidos. Aceites de masaje, velas y elementos de exploración sensorial.', pills: ['Aromaterapia', 'Gift Ready', 'Premium'], alt: true }
    ];

    return (
        <div className="split-container" id="collections-split">
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
                        {collections.map((col, i) => (
                            <li key={i} className="stack-cards__item" ref={el => stackItemsRef.current[i] = el}>
                                <article className={`collection-card ${col.alt ? 'alt' : ''}`}>
                                    <div className="card-visual">
                                        <img src={col.img} alt={col.title} className="card-image" loading="lazy" decoding="async" />
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
        </div>
    );
}
