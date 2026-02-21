import React from 'react';
import { Link } from '@inertiajs/react';
import ProductCarousel from '@/Components/ProductPage/ProductCarousel';

export default function FeaturedProductsSection({ featuredProducts = [] }) {
    return (
        <section className="curation-section">
            <div className="curation-header">
                <h2>Productos Destacados.</h2>
                <p style={{ textAlign: 'right', maxWidth: '300px', color: 'var(--text-muted)' }}>
                    Selección exclusiva de nuestras piezas fundamentales de ingeniería sensorial.
                </p>
            </div>

            <div className="product-carousel-wrapper" style={{ margin: '0 -15px' }}>
                <ProductCarousel products={featuredProducts} />
            </div>

            <div className="collections-btn-wrap" style={{ marginTop: '40px' }}>
                <Link
                    href={route('products.index')}
                    className="btn-v6"
                >
                    Ver Todos los Productos
                </Link>
            </div>
        </section>
    );
}
