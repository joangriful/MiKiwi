import React from 'react';
import { Link } from '@inertiajs/react';

export default function FeaturedProductsSection() {
    const products = [
        { tag: 'H-01 // DEPTH', name: 'Void Sphere', desc: 'Gravedad sensorial pura.', color: 'var(--color-primary)' },
        { tag: 'H-02 // VISION', name: 'Aura Lens', desc: 'Filtración de espectro.', color: 'var(--color-secondary)' },
        { tag: 'H-03 // WAVE', name: 'Zen Flow', desc: 'Frecuencia rítmica.', color: 'var(--text-main)', opacity: 0.1 },
        { tag: 'H-04 // CORE', name: 'Neural Core', desc: 'Sincronía total.', border: true }
    ];

    return (
        <section className="curation-section">
            <div className="curation-header">
                <h2>Productos Destacados.</h2>
                <p style={{ textAlign: 'right', maxWidth: '300px', color: 'var(--text-muted)' }}>
                    Selección exclusiva de nuestras piezas fundamentales de ingeniería sensorial.
                </p>
            </div>

            <div className="product-gallery">
                {products.map((prod, i) => (
                    <div key={i} className="product-item">
                        <span className="product-tag">{prod.tag}</span>
                        <div className="product-img-box">
                            {prod.border ? (
                                <div style={{ width: '60px', height: '120px', border: '1px solid var(--border)', borderRadius: '50px' }}></div>
                            ) : (
                                <div style={{
                                    width: i === 2 ? '120px' : (i === 1 ? '100px' : '80px'),
                                    height: i === 2 ? '10px' : (i === 1 ? '100px' : '80px'),
                                    background: prod.color,
                                    borderRadius: i === 1 ? '10px' : '50%',
                                    filter: i < 2 ? 'blur(20px)' : 'none',
                                    opacity: prod.opacity || 0.4
                                }}></div>
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
        </section>
    );
}
