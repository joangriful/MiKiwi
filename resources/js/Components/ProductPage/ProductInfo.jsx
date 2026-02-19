import { useState } from 'react';
import { Link } from '@inertiajs/react';

export default function ProductInfo({ product }) {
    const [isFavorite, setIsFavorite] = useState(false);

    const parentCategory = product?.category?.parent;
    const currentCategory = product?.category;

    return (
        <div className="h-full w-full flex flex-col pt-2 lg:pt-0">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 mb-8 text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400">
                {parentCategory && (
                    <>
                        <Link
                            href={route('categories.show', parentCategory.slug)}
                            prefetch
                            className="hover:text-[#99b849] cursor-pointer transition-colors px-1"
                        >
                            {parentCategory.name}
                        </Link>
                        <span className="text-gray-200">/</span>
                    </>
                )}
                {currentCategory ? (
                    <Link
                        href={route('categories.show', currentCategory.slug)}
                        prefetch
                        className="text-[#99b849] hover:text-[#88a441] transition-colors px-1"
                    >
                        {currentCategory.name}
                    </Link>
                ) : (
                    <span className="text-[#99b849] px-1">Colección Kiwi</span>
                )}
            </div>

            {/* Title & Favorite */}
            <div className="flex justify-between items-start mb-6">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight leading-tight uppercase">
                    {product?.name || 'Kiwi Premium'}
                </h1>
                <button
                    onClick={() => setIsFavorite(!isFavorite)}
                    className={`p-3 rounded-full border transition-all duration-300 ${isFavorite
                        ? 'bg-red-50 border-red-100 text-red-500 scale-110 shadow-sm'
                        : 'bg-white border-gray-100 text-gray-300 hover:text-gray-400 hover:border-gray-200'
                        }`}
                >
                    <span className={`material-symbols-outlined text-2xl ${isFavorite ? 'fill-1' : ''}`} style={{ fontVariationSettings: "'FILL' " + (isFavorite ? 1 : 0) }}>
                        favorite
                    </span>
                </button>
            </div>

            {/* Price section */}
            <div className="flex items-baseline gap-4 mb-10">
                <span className="text-4xl font-bold text-gray-900">
                    {product?.base_price ?
                        new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(product.base_price)
                        : '4.99€'}
                </span>
                {product?.base_price > 50 && (
                    <span className="text-sm text-gray-400 font-medium bg-gray-50 px-3 py-1 rounded-full border border-gray-100 uppercase tracking-widest">
                        Edición Limitada
                    </span>
                )}
            </div>

            {/* Description */}
            <div className="space-y-4 mb-12">
                <h3 className="text-[10px] font-bold tracking-[0.3em] uppercase text-gray-900">Descripción</h3>
                <p className="text-gray-500 leading-relaxed text-lg font-light">
                    {product?.description || 'Nuestros productos representan la cumbre de la ingeniería sensorial de MiKiwi. Cada pieza es seleccionada y procesada bajo los estándares más estrictos para garantizar una experiencia de introspección única y pura.'}
                </p>
            </div>

            {/* Actions */}
            <div className="mt-auto flex gap-4 pt-8 border-t border-gray-50">
                <div className="flex items-center bg-gray-50 rounded-2xl border border-gray-100 p-1">
                    <button className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors font-bold text-lg">-</button>
                    <span className="w-8 text-center font-bold text-sm text-gray-900">1</span>
                    <button className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors font-bold text-lg">+</button>
                </div>
                <button className="flex-1 bg-black text-white rounded-2xl py-4 px-8 font-bold text-xs uppercase tracking-[0.2em] hover:bg-gray-800 transition-all active:scale-95 shadow-xl shadow-black/10 flex items-center justify-center gap-3">
                    <span className="material-symbols-outlined text-lg">shopping_cart</span>
                    Añadir al carrito
                </button>
            </div>
        </div>
    );
}
