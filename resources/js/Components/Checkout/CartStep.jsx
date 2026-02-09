import React from 'react';
import { Link, useForm, router } from '@inertiajs/react';

export default function CartStep({ cart, onNext, popularProducts = [] }) {
    const { delete: destroy, patch, processing } = useForm();

    const addToCart = (product) => {
        router.post(route('cart.add'), {
            product_slug: product.slug,
            quantity: 1
        }, {
            preserveScroll: true,
        });
    };

    const updateQuantity = (id, quantity) => {
        if (quantity < 1) return;
        patch(route('cart.update', id), {
            quantity: quantity
        }, {
            preserveScroll: true,
        });
    };

    const removeItem = (id) => {
        if (confirm('¿Estás seguro de eliminar este producto?')) {
            destroy(route('cart.remove', id), {
                preserveScroll: true,
            });
        }
    };

    const RenderPopularProducts = () => (
        <div className="mt-12 pt-8 border-t border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Productos que podrían interesarte</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {popularProducts.map((product) => (
                    <div key={product.id} className="group flex flex-col items-center text-center">
                        <div className="relative aspect-square w-full bg-gray-50 rounded-xl overflow-hidden mb-3 border border-gray-100 group-hover:border-indigo-200 transition-colors">
                            <img
                                src={Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : 'https://via.placeholder.com/150'}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                        </div>
                        <h4 className="text-sm font-medium text-gray-900 line-clamp-1">{product.name}</h4>
                        <p className="text-sm font-bold text-primary mt-1">{parseFloat(product.base_price).toFixed(2)} €</p>
                        <button
                            onClick={() => addToCart(product)}
                            className="mt-3 w-full py-2 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary-dark transition-colors"
                        >
                            Añadir
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );

    if (!cart.items || cart.items.length === 0) {
        return (
            <div className="py-12 px-4 text-center">
                <div className="mb-6">
                    <svg className="mx-auto h-12 w-12 text-gray-400 font-light" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    <h2 className="mt-4 text-2xl font-bold text-gray-900">Tu carrito está vacío</h2>
                    <p className="mt-2 text-gray-500">¿No sabes qué comprar? Echa un vistazo a nuestros populares.</p>
                </div>
                <Link
                    href={route('colecciones')}
                    className="inline-block px-8 py-3 bg-primary text-white font-bold rounded-lg shadow-lg hover:bg-primary-dark transition"
                >
                    Volver a la tienda
                </Link>

                <RenderPopularProducts />
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100">
                <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Cesta de Compra</h2>
                <Link
                    href={route('colecciones')}
                    className="text-sm font-medium text-primary hover:text-primary-dark flex items-center gap-1"
                >
                    <span>&larr;</span> Volver a la tienda
                </Link>
            </div>

            <div className="space-y-6">
                <div className="overflow-hidden">
                    <ul className="divide-y divide-gray-100">
                        {cart.items.map((item) => (
                            <li key={item.product_id} className="py-6 flex items-center justify-between gap-4">
                                <div className="flex items-center space-x-6">
                                    <div className="w-24 h-24 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100">
                                        <img
                                            src={(() => {
                                                try {
                                                    const images = typeof item.product.images === 'string'
                                                        ? JSON.parse(item.product.images)
                                                        : item.product.images;
                                                    return Array.isArray(images) && images.length > 0 ? images[0] : 'https://via.placeholder.com/150';
                                                } catch (e) {
                                                    return 'https://via.placeholder.com/150';
                                                }
                                            })()}
                                            alt={item.product.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <h3 className="text-xl font-bold text-gray-900 leading-tight">{item.product.name}</h3>
                                        <p className="text-sm text-gray-500 mt-1">{parseFloat(item.product.base_price).toFixed(2)} € / unidad</p>
                                        <button
                                            onClick={() => removeItem(item.product_id)}
                                            className="text-xs font-bold text-accent hover:opacity-80 mt-4 flex items-center gap-1 uppercase tracking-widest"
                                            disabled={processing}
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-3">
                                    <div className="flex items-center bg-gray-100 rounded-full px-2 py-1">
                                        <button
                                            onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                                            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white hover:shadow-sm text-gray-600 transition"
                                            disabled={processing}
                                        >
                                            -
                                        </button>
                                        <span className="w-8 text-center font-bold text-gray-800">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                                            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white hover:shadow-sm text-gray-600 transition"
                                            disabled={processing}
                                        >
                                            +
                                        </button>
                                    </div>
                                    <div className="text-xl font-extrabold text-gray-900 tracking-tight">
                                        {(item.product.base_price * item.quantity).toFixed(2)} €
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="mt-10 flex flex-col items-end pt-8 border-t border-gray-100">
                    <div className="flex items-center gap-4 mb-6">
                        <span className="text-gray-500 uppercase text-xs font-bold tracking-widest">Total Provisional</span>
                        <span className="text-3xl font-black text-gray-900">{parseFloat(cart.total).toFixed(2)} €</span>
                    </div>

                    <button
                        onClick={onNext}
                        className="w-full md:w-auto px-12 py-4 bg-primary text-white font-black rounded-xl hover:bg-primary-dark shadow-xl shadow-green-100 transition-all duration-300 transform hover:-translate-y-1 active:scale-95 text-lg"
                    >
                        Pagar Pedido
                    </button>
                </div>
            </div>

            <RenderPopularProducts />
        </div>
    );
}
