import React, { useRef } from 'react';
import { Link } from '@inertiajs/react';
import styles from './ImmersiveGallerySection.module.css';

export default function ImmersiveGallerySection() {
    const gallerySectionRef = useRef(null);

    const collections = [
        { tag: 'COL-01', title: 'Para Ella', img: '/images/collections/collection_ella.png' },
        { tag: 'COL-02', title: 'Para Él', img: '/images/collections/collection_el.png' },
        { tag: 'COL-03', title: 'Parejas', img: '/images/collections/collection_parejas.png' },
        { tag: 'COL-04', title: 'Experiencias', img: '/images/collections/collection_experiencias.png' },
    ];

    return (
        <section className={styles.root} ref={gallerySectionRef} data-gallery-section>
            <div className={styles.header} data-gallery-header data-scroll-reveal>
                <h2>Explora Todo.</h2>
                <p>Acceso directo a todas las colecciones</p>
            </div>

            <div className={styles.grid}>
                {collections.map((collection) => (
                    <Link key={collection.tag} href="#" className={styles.card} data-gallery-card data-scroll-reveal>
                        <img src={collection.img} alt={collection.title} className={styles.image} />
                        <div className={styles.cardContent}>
                            <span className={styles.cardTag}>{collection.tag}</span>
                            <h3 className={styles.cardTitle}>{collection.title}</h3>
                            <span className={styles.cardCta}>Ver colección →</span>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
