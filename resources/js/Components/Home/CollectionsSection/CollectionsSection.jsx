import React, { useRef } from 'react';
import { Link } from '@inertiajs/react';
import useStackCards from '@/Hooks/useStackCards';
import { charSplit } from '@/Utils/textAnimations';
import styles from './CollectionsSection.module.css';

export default function CollectionsSection() {
    const collectionsHeroRef = useRef(null);
    const stackItemsRef = useRef([]);
    const stackContainerRef = useRef(null);

    useStackCards(stackItemsRef, stackContainerRef);

    const collections = [
        { tag: 'COL-01 // Feminine', title: 'Para Ella.', img: '/images/collections/collection_ella.png', desc: 'Diseños ergonómicos y texturas premium pensados para maximizar el placer femenino.', pills: ['Silicona Premium', '10 Modos', 'IPX7'] },
        { tag: 'COL-02 // Masculine', title: 'Para Él.', img: '/images/collections/collection_el.png', desc: 'Innovación masculina redefinida. Masturbadores con tecnología háptica, anillos vibradores y accesorios.', pills: ['Tech Háptica', 'Control App', 'USB-C'], alt: true },
        { tag: 'COL-03 // Shared', title: 'Parejas.', img: '/images/collections/collection_parejas.png', desc: 'Juguetes diseñados para compartir. Vibradores controlados a distancia y accesorios que intensifican la conexión.', pills: ['Control Dual', 'Sync', 'Long Range'] },
        { tag: 'COL-04 // Sensorial', title: 'Experiencias.', img: '/images/collections/collection_experiencias.png', desc: 'Kits curados para despertar todos los sentidos. Aceites de masaje, velas y elementos de exploración sensorial.', pills: ['Aromaterapia', 'Gift Ready', 'Premium'], alt: true },
    ];

    return (
        <div className={styles.root}>
            <div className={styles.leftPane}>
                <section className={styles.heroContext} ref={collectionsHeroRef} data-collections-hero>
                    <div className={styles.heroShapes}>
                        <div className={`${styles.heroShape} ${styles.heroShapeOne}`} data-scroll-reveal></div>
                        <div className={`${styles.heroShape} ${styles.heroShapeTwo}`} data-scroll-reveal></div>
                        <div className={`${styles.heroShape} ${styles.heroShapeThree}`} data-scroll-reveal></div>
                        <div className={`${styles.heroShape} ${styles.heroShapeFour}`} data-scroll-reveal></div>
                    </div>

                    <div className={styles.heroContent}>
                        <h2 className={styles.heroTitle}>
                            <span className={styles.word}>
                                {charSplit('Colecciones.')}
                            </span>
                        </h2>

                        <p className={styles.heroSubtitle} data-scroll-reveal>
                            Universos sensoriales cuidadosamente curados. Cada colección cuenta una historia única de placer y descubrimiento.
                        </p>

                        <div className={styles.heroAction}>
                            <div className={styles.magneticButton} data-scroll-reveal data-magnetic>
                                Explorar Universos
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M12 5v14M5 12l7 7 7-7" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className={styles.scrollIndicator} data-scroll-reveal>
                        <span>Scroll</span>
                        <div className={styles.scrollLine}></div>
                    </div>
                </section>
            </div>

            <div className={styles.rightPane}>
                <div className={styles.stackContainer} ref={stackContainerRef}>
                    <ul className={styles.stackCards}>
                        {collections.map((collection, index) => (
                            <li
                                key={collection.tag}
                                className={styles.stackItem}
                                ref={(element) => {
                                    stackItemsRef.current[index] = element;
                                }}
                            >
                                <article
                                    className={`${styles.collectionCard} ${collection.alt ? styles.collectionCardAlt : ''}`}
                                    data-stack-card-surface
                                >
                                    <div className={styles.cardVisual}>
                                        <img
                                            src={collection.img}
                                            alt={collection.title}
                                            className={styles.cardImage}
                                            data-stack-card-image
                                        />
                                    </div>

                                    <div className={styles.cardContent}>
                                        <span className={styles.cardTag}>{collection.tag}</span>
                                        <h2 className={styles.cardTitle}>{collection.title}</h2>
                                        <p className={styles.cardDescription}>{collection.desc}</p>
                                        <div className={styles.featurePills}>
                                            {collection.pills.map((pill) => (
                                                <span key={pill} className={styles.pill}>{pill}</span>
                                            ))}
                                        </div>
                                        <Link href="#" className={styles.cardLink}>Explorar Colección</Link>
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
