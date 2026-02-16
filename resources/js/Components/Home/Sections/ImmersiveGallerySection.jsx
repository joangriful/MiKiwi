import React, { useRef } from 'react';
import { Link } from '@inertiajs/react';

export default function ImmersiveGallerySection() {
    const gallerySectionRef = useRef(null);

    const collections = [
        { tag: 'COL-01', title: 'Para Ella', img: '/images/collections/collection_ella.png' },
        { tag: 'COL-02', title: 'Para Él', img: '/images/collections/collection_el.png' },
        { tag: 'COL-03', title: 'Parejas', img: '/images/collections/collection_parejas.png' },
        { tag: 'COL-04', title: 'Experiencias', img: '/images/collections/collection_experiencias.png' }
    ];

    return (
        <section className="gallery-section" ref={gallerySectionRef}>
            <div className="gallery-header" data-scroll-reveal>
                <h2>Explora Todo.</h2>
                <p>Acceso directo a todas las colecciones</p>
            </div>
            <div className="gallery-grid">
                {collections.map((col, i) => (
                    <Link key={i} href="#" className="gallery-card" data-scroll-reveal>
                        <img src={col.img} alt={col.title} />
                        <div className="gallery-card-content">
                            <span className="gallery-card-tag">{col.tag}</span>
                            <h3 className="gallery-card-title">{col.title}</h3>
                            <span className="gallery-card-cta">Ver colección →</span>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
