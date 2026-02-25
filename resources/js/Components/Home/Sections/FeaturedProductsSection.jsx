import React, { useRef } from 'react';
import { Link } from '@inertiajs/react';
import ProductCarousel from '@/Components/ProductPage/ProductCarousel';

export default function FeaturedProductsSection({ featuredProducts = [] }) {
    const carouselRef = useRef(null);

    const scroll = (direction) => {
        if (!carouselRef.current) return;
        carouselRef.current.scrollBy({
            left: direction === 'right' ? 370 : -370,
            behavior: 'smooth',
        });
    };

    return (
        <section className="curation-section px-8 py-24 bg-[#fafafa]">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                <div className="max-w-2xl">
                    <span className="font-sugo text-pink-500 text-sm tracking-[0.4em] uppercase mb-4 block">Selección MiKiwi</span>
                    <h2 className="font-sugo text-5xl md:text-7xl font-black uppercase tracking-widest leading-[0.85]">
                        PRODUCTOS<br />DESTACADOS.
                    </h2>
                </div>
                <p className="font-agrandir max-w-xs opacity-60 uppercase text-xs tracking-widest leading-relaxed">
                    Nuestras piezas fundamentales de ingeniería sensorial seleccionadas para tu primera experiencia.
                </p>
            </div>

            {/* Carousel + Arrows */}
            <div className="relative product-carousel-wrapper -mx-4 pt-20 pb-20">
                <ProductCarousel ref={carouselRef} products={featuredProducts} />

                {/* Prev Arrow */}
                <button
                    onClick={() => scroll('left')}
                    aria-label="Anterior"
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-11 h-11 flex items-center justify-center rounded-full bg-white border border-black/10 shadow-md hover:bg-black hover:text-white transition-all duration-300 group"
                >
                    <svg className="w-4 h-4 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15 18l-6-6 6-6" />
                    </svg>
                </button>

                {/* Next Arrow */}
                <button
                    onClick={() => scroll('right')}
                    aria-label="Siguiente"
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-11 h-11 flex items-center justify-center rounded-full bg-white border border-black/10 shadow-md hover:bg-black hover:text-white transition-all duration-300 group"
                >
                    <svg className="w-4 h-4 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 18l6-6-6-6" />
                    </svg>
                </button>
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
