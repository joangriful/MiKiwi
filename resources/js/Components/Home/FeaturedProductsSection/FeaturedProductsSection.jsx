import React, { useRef } from 'react';
import { Link } from '@inertiajs/react';
import ProductCarousel from '@/Components/Catalog/ProductCarousel/ProductCarousel';
import styles from './FeaturedProductsSection.module.css';

export default function FeaturedProductsSection({ featuredProducts = [] }) {
    const carouselRef = useRef(null);

    const scroll = (direction) => {
        if (!carouselRef.current) {
            return;
        }

        carouselRef.current.scrollBy({
            left: direction === 'right' ? 370 : -370,
            behavior: 'smooth',
        });
    };

    return (
        <section className={styles.root}>
            <div className={styles.header}>
                <div className={styles.headingBlock}>
                    <span className={styles.eyebrow}>Selección MiKiwi</span>
                    <h2 className={styles.title}>
                        PRODUCTOS<br />DESTACADOS.
                    </h2>
                </div>

                <p className={styles.description}>
                    Nuestras piezas fundamentales de ingeniería sensorial seleccionadas para tu primera experiencia.
                </p>
            </div>

            <div className={styles.carouselWrapper}>
                <ProductCarousel ref={carouselRef} products={featuredProducts} />

                <button
                    onClick={() => scroll('left')}
                    aria-label="Anterior"
                    className={`${styles.arrowButton} ${styles.arrowLeft}`}
                >
                    <svg className={styles.arrowIcon} viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15 18l-6-6 6-6" />
                    </svg>
                </button>

                <button
                    onClick={() => scroll('right')}
                    aria-label="Siguiente"
                    className={`${styles.arrowButton} ${styles.arrowRight}`}
                >
                    <svg className={styles.arrowIcon} viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 18l6-6-6-6" />
                    </svg>
                </button>
            </div>

            <div className={styles.footer}>
                <Link href={route('products.index')} className={styles.cta}>
                    VER TODOS LOS PRODUCTOS
                </Link>
            </div>
        </section>
    );
}
