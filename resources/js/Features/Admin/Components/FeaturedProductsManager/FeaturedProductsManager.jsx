import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { toast } from 'react-toastify';
import './FeaturedProductsManager.css';

export default function FeaturedProductsManager({ products = [] }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [loadingId, setLoadingId] = useState(null);

    // Split products into all and featured
    const allProducts = products.filter(p =>
        p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const featuredProducts = products.filter(p => p.is_featured);

    const toggleFeatured = (product) => {
        setLoadingId(product.id);
        router.post(route('products.update', product.id), {
            _method: 'put',
            is_featured: !product.is_featured
        }, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                toast.success(product.is_featured ? 'Producto eliminado de destacados' : 'Producto añadido a destacados');
                setLoadingId(null);
            },
            onError: () => {
                toast.error('Error al actualizar el estado destacado');
                setLoadingId(null);
            }
        });
    };

    const renderProductRow = (product, isRightSide = false) => (
        <tr
            key={product.id}
            className={`transition-colors cursor-pointer ${product.is_featured ? 'bg-blue-50 hover:bg-blue-100' : 'hover:bg-gray-50'}`}
            onClick={() => toggleFeatured(product)}
        >
            <td className="px-4 py-3 border-b border-gray-200">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-md bg-white border border-gray-200 overflow-hidden shrink-0 flex items-center justify-center">
                        {product.image_url ? (
                            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                            <span className="material-symbols-outlined text-gray-400 text-sm">image</span>
                        )}
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-gray-900 truncate">{product.name}</p>
                        <p className="text-xs text-gray-500 font-mono truncate">{product.sku || 'Sin SKU'}</p>
                    </div>
                </div>
            </td>
            <td className="px-4 py-3 border-b border-gray-200 text-right w-16">
                {loadingId === product.id ? (
                    <span className="material-symbols-outlined animate-spin text-blue-500 text-lg">refresh</span>
                ) : (
                    <span className={`material-symbols-outlined text-lg ${product.is_featured ? 'text-blue-500' : 'text-gray-300'}`}>
                        {product.is_featured ? 'star' : 'star_border'}
                    </span>
                )}
            </td>
        </tr>
    );

    return (
        <div className="h-full flex flex-col bg-white">
            <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center shrink-0">
                <div>
                    <h2 className="text-lg font-bold text-gray-800">Productos Destacados</h2>
                    <p className="text-sm text-gray-500">Selecciona los productos que aparecerán en la sección de inicio.</p>
                </div>
                <div className="relative w-64">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">search</span>
                    <input
                        type="text"
                        placeholder="Buscar producto..."
                        className="w-full pl-9 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex-1 overflow-hidden flex">
                {/* Left Side: All Products */}
                <div className="w-1/2 border-r border-gray-200 flex flex-col">
                    <div className="p-3 bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider sticky top-0">
                        Todos los Productos ({allProducts.length})
                    </div>
                    <div className="flex-1 overflow-auto">
                        <table className="w-full text-left border-collapse">
                            <tbody>
                                {allProducts.map(p => renderProductRow(p))}
                            </tbody>
                        </table>
                        {allProducts.length === 0 && (
                            <div className="p-8 text-center text-gray-400">No hay productos.</div>
                        )}
                    </div>
                </div>

                {/* Right Side: Featured Products */}
                <div className="w-1/2 flex flex-col bg-slate-50">
                    <div className="p-3 bg-blue-50 border-b border-blue-100 text-xs font-bold text-blue-700 uppercase tracking-sticky top-0">
                        Productos Destacados ({featuredProducts.length})
                    </div>
                    <div className="flex-1 overflow-auto">
                        <table className="w-full text-left border-collapse">
                            <tbody>
                                {featuredProducts.map(p => renderProductRow(p, true))}
                            </tbody>
                        </table>
                        {featuredProducts.length === 0 && (
                            <div className="p-8 text-center text-gray-400">
                                <span className="material-symbols-outlined text-4xl mb-2 opacity-50">star</span>
                                <p>No hay productos destacados.</p>
                                <p className="text-xs mt-1">Haz clic en un producto de la izquierda para destacarlo.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
