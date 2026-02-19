import React from 'react';
import { router } from '@inertiajs/react';

export default function ProductFilters({ categories, filters }) {
    const handleCategoryChange = (categoryId) => {
        router.get(
            route('products.index'),
            { ...filters, category: categoryId },
            {
                preserveState: true,
                preserveScroll: true,
                only: ['products', 'filters'],
            }
        );
    };

    const handlePriceChange = (e) => {
        // Implement debounced price change or button click
    };

    return (
        <div className="w-64 flex-shrink-0 bg-white p-6 border-r border-gray-100 hidden md:block">
            <h3 className="text-lg font-bold mb-6 text-gray-900">Filtros</h3>

            {/* Categorías */}
            <div className="mb-8">
                <h4 className="font-semibold text-gray-700 mb-4">Categorías</h4>
                <div className="space-y-2">
                    <button
                        onClick={() => handleCategoryChange(null)}
                        className={`block text-sm w-full text-left py-1 hover:text-blue-600 transition-colors ${!filters.category ? 'font-bold text-blue-600' : 'text-gray-500'}`}
                    >
                        Todas
                    </button>
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => handleCategoryChange(category.id)}
                            className={`block text-sm w-full text-left py-1 hover:text-blue-600 transition-colors ${filters.category == category.id ? 'font-bold text-blue-600' : 'text-gray-500'}`}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Precio (Placeholder) */}
            <div>
                <h4 className="font-semibold text-gray-700 mb-4">Precio</h4>
                <div className="flex items-center gap-2">
                    {/* Implement price range inputs here later if needed */}
                </div>
            </div>
        </div>
    );
}
