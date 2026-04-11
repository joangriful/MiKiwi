import React from "react";
import { Link, useForm, router } from "@inertiajs/react";
import './CartStep.css';

export default function CartStep({ cart, onNext, popularProducts = [] }) {
    const { delete: destroy, patch, processing } = useForm();

    const addToCart = (product) => {
        router.post(
            route("cart.add"),
            {
                product_slug: product.slug,
                quantity: 1,
            },
            {
                preserveScroll: true,
            },
        );
    };

    const updateQuantity = (id, quantity) => {
        if (quantity < 0) return;

        router.patch(
            route("cart.update", id),
            {
                quantity: quantity,
            },
            {
                preserveScroll: true,
            },
        );
    };

    const removeItem = (id) => {
        if (confirm("¿Estás seguro de eliminar este producto?")) {
            destroy(route("cart.remove", id), {
                preserveScroll: true,
            });
        }
    };

    const RenderPopularProducts = () => (
        <div className="mt-20 pt-20 border-t border-gray-50">
            <div className="flex justify-between items-end mb-10">
                <div>
                    <h3 className="text-2xl font-black text-gray-900 tracking-tight">
                        Te va a encantar...
                    </h3>
                    <div className="w-10 h-1 bg-secondary mt-2 rounded-full"></div>
                </div>
                <Link href={route('products.index')} className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">Ver todo</Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                {popularProducts.map((product) => (
                    <div
                        key={product.id}
                        className="group flex flex-col"
                    >
                        <Link href={route('products.show', product.slug)} className="relative aspect-square w-full bg-gray-50 rounded-3xl overflow-hidden mb-4 border border-gray-100 group-hover:shadow-2xl group-hover:shadow-primary/5 transition-all duration-500 block">
                            <img
                                src={
                                    (Array.isArray(product.images) && product.images.length > 0)
                                        ? product.images[0]
                                        : (product.image_url || "https://via.placeholder.com/150")
                                }
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </Link>
                        <Link href={route('products.show', product.slug)} className="text-sm font-bold text-gray-900 line-clamp-1 hover:text-primary transition-colors">
                            {product.name}
                        </Link>
                        <div className="flex justify-between items-center mt-2">
                            <p className="text-sm font-black text-gray-400">
                                {parseFloat(product.base_price).toFixed(2)}€
                            </p>
                            <button
                                onClick={() => addToCart(product)}
                                className="p-2 bg-primary/10 text-primary rounded-xl hover:bg-primary hover:text-white transition-all active:scale-90"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    if (!cart.items || cart.items.length === 0) {
        return (
            <div className="py-12 px-4 text-center">
                <div className="mb-6">
                    <svg
                        className="mx-auto h-12 w-12 text-gray-400 font-light"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1"
                            d="M16 11V7a4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                        />
                    </svg>
                    <h2 className="mt-4 text-2xl font-bold text-gray-900">
                        Tu carrito está vacío
                    </h2>
                    <p className="mt-2 text-gray-500">
                        ¿No sabes qué comprar? Echa un vistazo a nuestros
                        populares.
                    </p>
                </div>
                <Link
                    href={route("products.index")}
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
            <div className="flex justify-between items-end mb-12 pb-6 border-b border-gray-100">
                <div>
                    <h2 className="text-4xl font-black text-gray-900 tracking-tight">
                        Cesta de Compra
                    </h2>
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-2">{cart.items.length} {cart.items.length === 1 ? 'artículo' : 'artículos'}</p>
                </div>
                <Link
                    href={route("products.index")}
                    className="flex justify-center items-center px-5 py-2.5 bg-gray-50 rounded-2xl text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-primary hover:bg-primary/5 transition-all duration-300 group"
                >
                    <span className="mr-2 group-hover:-translate-x-1 transition-transform">
                        &larr;
                    </span>{" "}
                    Seguir comprando
                </Link>
            </div>

            <div className="space-y-6">
                <div className="overflow-hidden">
                    <ul className="divide-y divide-gray-50 border-b border-gray-50">
                        {cart.items.map((item) => (
                            <li
                                key={item.product_id}
                                className="py-8 flex flex-col sm:flex-row sm:items-center justify-between gap-8 group"
                            >
                                <div className="flex items-center space-x-8 flex-1">
                                    <Link href={route('products.show', item.product.slug)} className="w-28 h-28 bg-gray-50 rounded-3xl overflow-hidden flex-shrink-0 border border-gray-100 group-hover:shadow-xl group-hover:shadow-primary/5 group-hover:border-primary/20 transition-all duration-500 block relative">
                                        <img
                                            src={(() => {
                                                try {
                                                    const images = typeof item.product.images === "string"
                                                        ? JSON.parse(item.product.images)
                                                        : item.product.images;

                                                    if (Array.isArray(images) && images.length > 0) {
                                                        return images[0];
                                                    }

                                                    return item.product.image_url || "https://via.placeholder.com/150";
                                                } catch (e) {
                                                    return item.product.image_url || "https://via.placeholder.com/150";
                                                }
                                            })()}
                                            alt={item.product.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                    </Link>
                                    <div className="flex flex-col flex-1">
                                        <Link href={route('products.show', item.product.slug)} className="text-2xl font-black text-gray-900 leading-tight hover:text-primary transition-colors">
                                            {item.product.name}
                                        </Link>
                                        <p className="text-xs text-gray-300 font-extrabold uppercase tracking-widest mt-2">
                                            PRECIO: {parseFloat(item.product.base_price).toFixed(2)} €
                                        </p>
                                        <button
                                            onClick={() => removeItem(item.product_id)}
                                            className="text-[10px] font-black text-red-300 hover:text-red-500 mt-6 flex items-center gap-1 uppercase tracking-[0.2em] transition-colors w-fit"
                                            disabled={processing}
                                        >
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                                            Eliminar
                                        </button>
                                    </div>
                                </div>
                                <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-6 w-full sm:w-auto pt-6 sm:pt-0 border-t sm:border-t-0 border-gray-50">
                                    <div className="flex items-center bg-gray-50 rounded-2xl p-1 border border-gray-100 shadow-inner">
                                        <button
                                            onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                                            className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white hover:shadow-md text-gray-400 hover:text-primary transition-all active:scale-90"
                                            disabled={processing}
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M20 12H4" /></svg>
                                        </button>
                                        <span className="w-12 text-center font-black text-gray-900 text-lg">
                                            {item.quantity}
                                        </span>
                                        <button
                                            onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                                            className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white hover:shadow-md text-gray-400 hover:text-primary transition-all active:scale-90"
                                            disabled={processing}
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
                                        </button>
                                    </div>
                                    <div className="text-2xl font-black text-gray-900 tracking-tighter">
                                        {(item.product.base_price * item.quantity).toFixed(2)}<span className="text-sm ml-0.5 font-bold">€</span>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>


            </div>

            <RenderPopularProducts />
        </div>
    );
}
