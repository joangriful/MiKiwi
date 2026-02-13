import React, { useState } from 'react';
import { router } from '@inertiajs/react';

export default function FilterMenu({ isOpen, onClose, categories = [], filters = {} }) {
    if (!isOpen) return null;

    const handleCategoryChange = (categoryId) => {
        router.get(
            route('products.index'),
            { ...filters, category: categoryId },
            { preserveState: true }
        );
    };

    return (
        <div className="fixed inset-0 z-[100] overflow-hidden flex justify-end">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Menu Panel */}
            <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
                <div className="p-8 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Filtros</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <span className="material-symbols-outlined text-gray-500">close</span>
                    </button>
                </div>

                <div className="flex-grow overflow-y-auto p-8 space-y-12">
                    {/* Categories Section */}
                    <section>
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Categorías</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => handleCategoryChange(null)}
                                className={`px-4 py-3 rounded-xl text-sm font-medium transition-all text-left border ${!filters.category
                                        ? 'bg-black text-white border-black shadow-lg shadow-black/10'
                                        : 'bg-gray-50 text-gray-600 border-transparent hover:border-gray-200'
                                    }`}
                            >
                                Todas
                            </button>
                            {categories.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => handleCategoryChange(category.id)}
                                    className={`px-4 py-3 rounded-xl text-sm font-medium transition-all text-left border ${filters.category == category.id
                                            ? 'bg-black text-white border-black shadow-lg shadow-black/10'
                                            : 'bg-gray-50 text-gray-600 border-transparent hover:border-gray-200'
                                        }`}
                                >
                                    {category.name}
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* Price Section (Optional placeholder for now) */}
                    <section>
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Rango de Precio</h3>
                        <div className="flex items-center gap-4">
                            <input
                                type="range"
                                className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
                            />
                        </div>
                        <div className="flex justify-between mt-4 text-xs font-medium text-gray-500">
                            <span>0 €</span>
                            <span>200 € +</span>
                        </div>
                    </section>
                </div>

                <div className="p-8 border-t border-gray-100 bg-gray-50/50">
                    <button
                        onClick={onClose}
                        className="w-full bg-black text-white py-4 rounded-2xl font-bold hover:bg-gray-800 transition-all shadow-xl shadow-black/10 text-sm uppercase tracking-widest"
                    >
                        Aplicar Filtros
                    </button>
                </div>
            </div>
        </div>
    );
}
