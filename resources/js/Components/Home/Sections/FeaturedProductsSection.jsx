import React from 'react';
import { Link } from '@inertiajs/react';
import ProductCarousel from '@/Components/ProductPage/ProductCarousel';

export default function FeaturedProductsSection({ featuredProducts = [] }) {
    return (
        <section className="curation-section px-8 py-24 bg-[#fafafa]">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                <div className="max-w-2xl">
                    <span className="font-sugo text-pink-500 text-sm tracking-[0.4em] uppercase mb-4 block">Selección MiKiwi</span>
                    <h2 className="font-sugo text-5xl md:text-7xl font-black uppercase tracking-widest
                     leading-[0.85]">
                        PRODUCTOS<br />DESTACADOS.
                    </h2>
                </div>
                <p className="font-agrandir max-w-xs opacity-60 uppercase text-xs tracking-widest leading-relaxed">
                    Nuestras piezas fundamentales de ingeniería sensorial seleccionadas para tu primera experiencia.
                </p>
            </div>

            <div className="product-carousel-wrapper -mx-4 pt-20 pb-20">
                <ProductCarousel products={featuredProducts} />
            </div>

            <div className="flex justify-center mt-20">
                <Link
                    href={route('products.index')}
                    className="btn-pill"
                >
                    VER TODOS LOS PRODUCTOS
                </Link>
            </div>
        </section>
    );
}
