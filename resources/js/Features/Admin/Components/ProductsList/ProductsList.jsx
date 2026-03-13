import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { toast } from 'react-toastify';
import './ProductsList.css';

export default function ProductsList({ products = [], onEdit, debugCount }) {
    console.log('ProductsList received products:', products, 'DebugCount:', debugCount);
    const [searchTerm, setSearchTerm] = useState('');
    const [deletingId, setDeletingId] = useState(null);

    const filteredProducts = products.filter(product =>
        product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = (product) => {
        if (!confirm('¿Estás seguro de que deseas eliminar este producto?')) return;

        setDeletingId(product.id);
        router.delete(route('products.delete', product.id), {
            onSuccess: () => {
                toast.success('Producto eliminado correctamente');
                setDeletingId(null);
            },
            onError: () => {
                toast.error('Error al eliminar el producto');
                setDeletingId(null);
            }
        });
    };

    return (
        <div className="h-full flex flex-col">
            <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                <div className="relative w-72">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">search</span>
                    <input
                        type="text"
                        placeholder="Buscar por nombre o SKU..."
                        className="w-full pl-9 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="text-xs text-gray-500 font-medium">
                    Total: {filteredProducts.length} productos (Raw prop: {products?.length}, Debug Count: {debugCount})
                </div>
            </div>

            <div className="flex-1 overflow-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 sticky top-0 z-10 border-b border-gray-200">
                        <tr>
                            <th className="w-12 px-2 py-3 text-xs font-bold text-gray-400"></th>
                            <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Producto</th>
                            <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Categoría</th>
                            <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Precio</th>
                            <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Stock</th>
                            <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Estado</th>
                            <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filteredProducts.map((product, index) => (
                            <tr key={product.id} className="hover:bg-gray-50 transition-colors group">
                                <td className="w-12 px-2 py-4 text-sm text-gray-400 font-medium text-center">
                                    {filteredProducts.length - index}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-lg bg-gray-100 flex-shrink-0 border border-gray-200 overflow-hidden">
                                            {product.image_url ? (
                                                <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                    <span className="material-symbols-outlined">image</span>
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900 leading-tight">{product.name}</p>
                                            <p className="text-xs text-gray-500 mt-1 font-mono">{product.sku || 'Sin SKU'}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                                        {product.category?.name || 'Uncategorized'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-sm font-medium text-gray-900">{parseFloat(product.base_price).toFixed(2)}€</span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <span className={`w-2 h-2 rounded-full ${product.stock_quantity > 0 ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                        <span className="text-sm text-gray-600 font-medium">{product.stock_quantity ?? 0}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${product.is_active
                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                        : 'bg-gray-50 text-gray-600 border-gray-200'
                                        }`}>
                                        {product.is_active ? 'Activo' : 'Inactivo'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => onEdit(product)}
                                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            title="Editar"
                                        >
                                            <span className="material-symbols-outlined text-lg">edit</span>
                                        </button>
                                        <button
                                            onClick={() => handleDelete(product)}
                                            disabled={deletingId === product.id}
                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Eliminar"
                                        >
                                            {deletingId === product.id ? (
                                                <span className="material-symbols-outlined text-lg animate-spin">refresh</span>
                                            ) : (
                                                <span className="material-symbols-outlined text-lg">delete</span>
                                            )}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filteredProducts.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-24 text-gray-400 bg-gray-50/30">
                        <span className="material-symbols-outlined text-5xl mb-4">inventory_2</span>
                        <p className="text-lg font-medium">No se encontraron productos</p>
                        <p className="text-sm mt-1">Inténtalo con otro término de búsqueda o crea uno nuevo.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
