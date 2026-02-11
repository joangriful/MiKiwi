import React from 'react';
import { Head, Link } from '@inertiajs/react';
import Header from '@/Components/Common/Header';
import Footer from '@/Components/Common/Footer';
import ProductFilters from '@/Components/ProductPage/ProductFilters';
import ProductCard from '@/Components/ProductPage/ProductCard';

export default function Products({ products, categories, filters }) {
    return (
        <div className="min-h-screen flex flex-col bg-white text-gray-900 font-sans">
            <Head title="Productos - MiKiwi" />

            <Header />

            <main className="flex-grow container mx-auto px-6 py-8">
                {/* Breadcrumbs or Title */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Nuestros Productos</h1>
                    <p className="text-gray-500 mt-2">Explora nuestra selección premium</p>
                </div>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar Filters */}
                    <aside className="w-full md:w-64 shrink-0">
                        <ProductFilters categories={categories} filters={filters} />
                    </aside>

                    {/* Product Grid */}
                    <div className="flex-1">
                        {products.data.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-x-6 gap-y-10 justify-items-center md:justify-items-start">
                                {products.data.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-gray-50 rounded-lg">
                                <p className="text-gray-500 text-lg">No se encontraron productos con estos filtros.</p>
                                <Link
                                    href={route('products.index')}
                                    className="text-blue-600 font-medium hover:underline mt-2 inline-block"
                                >
                                    Limpiar filtros
                                </Link>
                            </div>
                        )}

                        {/* Pagination */}
                        {products.links && products.links.length > 3 && (
                            <div className="mt-12 flex justify-center">
                                <div className="flex flex-wrap gap-2 justify-center">
                                    {products.links.map((link, key) => (
                                        link.url === null ? (
                                            <div
                                                key={key}
                                                className="px-4 py-2 border border-gray-200 text-gray-400 rounded-md text-sm"
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ) : (
                                            <Link
                                                key={key}
                                                href={link.url}
                                                className={`px-4 py-2 border rounded-md text-sm transition-colors ${link.active
                                                    ? 'bg-blue-600 text-white border-blue-600'
                                                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                                    }`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        )
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
