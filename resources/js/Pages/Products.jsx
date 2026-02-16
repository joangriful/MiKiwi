import React from 'react';
import { Head, Link } from '@inertiajs/react';
import Header from '@/Components/Common/Header';
import Footer from '@/Components/Common/Footer';
import { ProductCard, FilterMenu } from '@/Components';
import { useState } from 'react';

export default function Products({ products, categories: initialCategories, filters }) {
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Definición de las 6 categorías maestras para el rediseño
    const categories = [
        { id: 1, name: 'Femenino' },
        { id: 2, name: 'Masculino' },
        { id: 3, name: 'Parejas' },
        { id: 4, name: 'Cosmética' },
        { id: 5, name: 'Sets' },
        { id: 6, name: 'Cuidado' }
    ];

    return (
        <div className="min-h-screen flex flex-col bg-[#FDFDFD] text-gray-900 font-sans selection:bg-[#99b849]/30">
            <Head title="Nuestros Productos - MIKIWI" />

            <Header />

            <main className="flex-grow py-20 px-6 max-w-[1600px] mx-auto w-full">
                {/* Minimalist Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
                    <div className="space-y-4">
                        <span className="text-[10px] font-bold tracking-[0.3em] text-[#99b849] uppercase block animate-in fade-in slide-in-from-bottom-2 duration-700">
                            Curated Selection
                        </span>
                        <h1 className="text-5xl md:text-7xl font-bold text-gray-900 tracking-widest leading-none">
                            Nuestros <br />Productos<span className="text-[#99b849]">.</span>
                        </h1>
                        <p className="text-gray-400 text-lg max-w-md font-light">
                            Ingeniería sensorial de precisión diseñada para elevar tu experiencia de introspección habitual.
                        </p>
                    </div>

                    <button
                        onClick={() => setIsFilterOpen(true)}
                        className="group flex items-center gap-3 bg-white border border-gray-100 px-8 py-4 rounded-full shadow-sm hover:shadow-md transition-all active:scale-95"
                    >
                        <span className="material-symbols-outlined text-gray-900 text-xl transition-transform group-hover:rotate-12">tune</span>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-bold uppercase tracking-widest text-gray-900">Filtrar</span>
                            {Object.values(filters).filter(Boolean).length > 0 && (
                                <span className="flex items-center justify-center bg-[#99b849] text-white text-[10px] w-5 h-5 rounded-full font-bold animate-in zoom-in duration-300">
                                    {Object.values(filters).filter(Boolean).length}
                                </span>
                            )}
                        </div>
                    </button>
                </div>

                {/* Filter Sidebar replaced by Overlay Menu */}
                <FilterMenu
                    isOpen={isFilterOpen}
                    onClose={() => setIsFilterOpen(false)}
                    categories={categories}
                    filters={filters}
                />

                {/* Refined Product Grid */}
                <div className="w-full">
                    {products?.data && products.data.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
                            {products.data.map((product, index) => (
                                <div
                                    key={product.id || `prod-${index}`}
                                    className="animate-in fade-in slide-in-from-bottom-4 duration-1000 fill-mode-both"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <ProductCard product={product} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-40 bg-[#F9F9F9] rounded-[40px] border border-dashed border-gray-200">
                            <span className="material-symbols-outlined text-6xl text-gray-200 mb-6">inventory_2</span>
                            <p className="text-gray-400 text-xl font-light">Sin resultados para tu búsqueda.</p>
                            <Link
                                href={route('products.index')}
                                className="mt-8 inline-flex items-center gap-2 text-black font-bold uppercase tracking-widest text-xs border-b-2 border-black pb-1 hover:text-gray-600 hover:border-gray-400 transition-all"
                            >
                                Reestablecer Filtros
                            </Link>
                        </div>
                    )}

                    {/* Refined Pagination */}
                    {products?.links && products.links.length > 3 && (
                        <div className="mt-32 flex justify-center pb-20">
                            <div className="flex flex-wrap gap-3 justify-center">
                                {products.links.map((link, key) => (
                                    link.url === null ? (
                                        <div
                                            key={key}
                                            className="w-12 h-12 flex items-center justify-center text-gray-300 text-xs font-bold"
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ) : (
                                        <Link
                                            key={key}
                                            href={link.url}
                                            className={`w-12 h-12 flex items-center justify-center rounded-full text-xs font-bold transition-all ${link.active
                                                ? 'bg-black text-white shadow-xl shadow-black/10'
                                                : 'text-gray-400 hover:text-black hover:bg-gray-100'
                                                }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    )
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
