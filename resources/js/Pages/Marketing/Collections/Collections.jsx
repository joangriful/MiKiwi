import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import MarketingPageLayout from '@/Components/Marketing/MarketingPageLayout/MarketingPageLayout';
import styles from './Collections.module.css';

const categories = [
    { id: 1, title: 'Dildos', subtitle: 'Realistas y únicos', description: 'Descubre nuestra colección premium' },
    { id: 2, title: 'Vibradores', subtitle: 'Placer intenso', description: 'Explora nuevas sensaciones' },
    { id: 3, title: 'Consoladores', subtitle: 'Diseño ergonómico', description: 'Comodidad y placer garantizado' },
    { id: 4, title: 'Succionadores', subtitle: 'Tecnología avanzada', description: 'Experiencias que activan tu mente' },
    { id: 5, title: 'Lubricantes', subtitle: 'Fórmulas premium', description: 'Suavidad y confort' },
    { id: 6, title: 'Aceites & Cosmética', subtitle: 'Cuidado íntimo', description: 'Productos naturales de calidad' },
];

export default function Collections() {
    const [darkMode, setDarkMode] = useState(false);
    const pageClassName = darkMode ? `${styles.page} dark` : styles.page;

    return (
        <MarketingPageLayout
            title="Nuestras Categorías"
            headTitle="Colecciones - MiKiwi"
            maxWidth="wide"
            showBreadcrumb={false}
            showPageHeader={false}
            className={pageClassName}
        >
            <div className={styles.toolbar}>
                <nav aria-label="Navegación de colecciones">
                    <Link href={route('home')}>Inicio</Link>
                    <a href="#categorias">Categorías</a>
                    <a href="#novedades">Novedades</a>
                    <Link href={route('contacto')}>Contacto</Link>
                </nav>
                <button onClick={() => setDarkMode((value) => !value)} type="button">
                    {darkMode ? 'Modo claro' : 'Modo oscuro'}
                </button>
            </div>

            <section className={styles.hero}>
                <h2>Nuestras Categorías</h2>
                <p>Explora nuestra selección curada de productos</p>
            </section>

            <section className={styles.grid} id="categorias">
                {categories.map((category, index) => (
                    <article className={styles.card} key={category.id}>
                        <span className={styles[`accent${index % 3}`]} aria-hidden="true" />
                        <div className={styles.cardVisual} aria-hidden="true" />
                        <div>
                            <p>{category.subtitle}</p>
                            <h3>{category.title}</h3>
                            <p>{category.description}</p>
                            <Link href={route('products.index')}>Ver más</Link>
                        </div>
                    </article>
                ))}
            </section>

            <section className={styles.cta}>
                <h2>¿Necesitas ayuda?</h2>
                <p>Contáctanos para asesoramiento personalizado</p>
                <Link href={route('contacto')}>Contactar</Link>
            </section>
        </MarketingPageLayout>
    );
}
