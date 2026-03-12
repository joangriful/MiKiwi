import { useState } from "react";
import { Link, router } from "@inertiajs/react";
import axios from "axios";

export default function ProductInfo({ product }) {
    const [isFavorite, setIsFavorite] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [notification, setNotification] = useState(null); // 'added' | 'error' | null
    const [isLoading, setIsLoading] = useState(false);

    const parentCategory = product?.category?.parent;
    const currentCategory = product?.category;

    const showNotification = (type) => {
        setNotification(type);
        setTimeout(() => setNotification(null), 2500);
    };

    const handleAddToCart = async () => {
        if (!product?.slug) return;
        setIsLoading(true);
        try {
            await axios.post(route("cart.add"), {
                product_slug: product.slug,
                quantity: quantity,
            });
            showNotification("added");
            setTimeout(() => {
                router.visit(route("products.index"));
            }, 1500);
        } catch (error) {
            console.error("Error adding to cart:", error);
            showNotification("error");
        } finally {
            setIsLoading(false);
        }
    };

    const handleBuyNow = async () => {
        if (!product?.slug) return;
        setIsLoading(true);
        try {
            const { data: responseData } = await axios.post(route("cart.buy-now"), {
                product_slug: product.slug,
                quantity: quantity,
            });

            if (responseData.redirect) {
                router.visit(responseData.redirect);
            } else {
                router.visit(route("cart.index", { buy_now: 1 }));
            }
        } catch (error) {
            console.error("Error buying now:", error);
            showNotification("error");
            setIsLoading(false);
        }
    };

    return (
        <div className="h-full w-full flex flex-col pt-2 lg:pt-0">
            {/* Notification Banner */}
            <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${notification
                    ? "max-h-20 mb-4 opacity-100"
                    : "max-h-0 mb-0 opacity-0"
                    }`}
            >
                {notification === "added" && (
                    <div className="flex items-center gap-3 bg-[#f0f7e6] border border-[#c8e0a0] text-[#4a7a1a] rounded-2xl px-5 py-3">
                        <span className="material-symbols-outlined text-xl">
                            check_circle
                        </span>
                        <span className="font-semibold text-sm">
                            ¡Producto añadido al carrito! Redirigiendo…
                        </span>
                    </div>
                )}
                {notification === "error" && (
                    <div className="flex items-center gap-3 bg-red-50 border border-red-100 text-red-600 rounded-2xl px-5 py-3">
                        <span className="material-symbols-outlined text-xl">
                            error
                        </span>
                        <span className="font-semibold text-sm">
                            Error al añadir el producto. Inténtalo de nuevo.
                        </span>
                    </div>
                )}
            </div>

            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 mb-8 text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400">
                {parentCategory && (
                    <>
                        <Link
                            href={route("categories.show", parentCategory.slug)}
                            className="hover:text-[#99b849] cursor-pointer transition-colors px-1"
                        >
                            {parentCategory.name}
                        </Link>
                        <span className="text-gray-200">/</span>
                    </>
                )}
                {currentCategory ? (
                    <Link
                        href={route("categories.show", currentCategory.slug)}
                        className="text-[#99b849] hover:text-[#88a441] transition-colors px-1"
                    >
                        {currentCategory.name}
                    </Link>
                ) : (
                    <span className="text-[#99b849] px-1">Colección Kiwi</span>
                )}
            </div>

            {/* Title & Favorite */}
            <div className="flex justify-between items-start mb-4 md:mb-6">
                <h1 className="text-3xl md:text-5xl font-bold text-gray-900 tracking-tight leading-tight uppercase">
                    {product?.name || "Kiwi Premium"}
                </h1>
                <button
                    onClick={() => setIsFavorite(!isFavorite)}
                    className={`p-3 rounded-full border transition-all duration-300 ${isFavorite
                        ? "bg-red-50 border-red-100 text-red-500 scale-110 shadow-sm"
                        : "bg-white border-gray-100 text-gray-300 hover:text-gray-400 hover:border-gray-200"
                        }`}
                >
                    <span
                        className={`material-symbols-outlined text-2xl ${isFavorite ? "fill-1" : ""}`}
                        style={{
                            fontVariationSettings:
                                "'FILL' " + (isFavorite ? 1 : 0),
                        }}
                    >
                        favorite
                    </span>
                </button>
            </div>

            {/* Price section */}
            <div className="flex items-baseline gap-4 mb-10">
                <span className="text-4xl font-bold text-gray-900">
                    {product?.base_price
                        ? new Intl.NumberFormat("es-ES", {
                            style: "currency",
                            currency: "EUR",
                        }).format(product.base_price)
                        : "4.99€"}
                </span>
                {product?.base_price > 50 && (
                    <span className="text-sm text-gray-400 font-medium bg-gray-50 px-3 py-1 rounded-full border border-gray-100 uppercase tracking-widest">
                        Edición Limitada
                    </span>
                )}
            </div>

            {/* Description */}
            <div className="space-y-4 mb-8 md:mb-12">
                <h3 className="text-[20px] font-bold tracking-[0.3em] uppercase text-gray-900">
                    Descripción
                </h3>
                <p className="text-gray-500 leading-relaxed text-base md:text-lg font-light">
                    {product?.description ||
                        "Nuestros productos representan la cumbre de la ingeniería sensorial de MiKiwi. Cada pieza es seleccionada y procesada bajo los estándares más estrictos para garantizar una experiencia de introspección única y pura."}
                </p>
            </div>

            {/* Actions */}
            <div className="mt-auto flex flex-col gap-4 pt-8 border-t border-gray-50">
                {/* Quantity Selector */}
                <div className="flex items-center justify-between bg-gray-50 rounded-2xl border border-gray-100 p-2">
                    <button
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="w-12 h-12 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors font-bold text-xl"
                    >
                        -
                    </button>
                    <div className="flex flex-col items-center">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">CANTIDAD</span>
                        <span className="font-bold text-lg text-gray-900 leading-none">
                            {quantity}
                        </span>
                    </div>
                    <button
                        onClick={() => setQuantity((q) => q + 1)}
                        className="w-12 h-12 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors font-bold text-xl"
                    >
                        +
                    </button>
                </div>

                {/* Add to Cart Button */}
                <button
                    onClick={handleAddToCart}
                    disabled={isLoading}
                    className="w-full bg-black text-white rounded-2xl py-4 md:py-5 px-8 font-bold text-xs uppercase tracking-[0.2em] hover:bg-gray-800 transition-all active:scale-95 shadow-xl shadow-black/10 flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    <span className="material-symbols-outlined text-xl">
                        shopping_cart
                    </span>
                    Añadir al carrito
                </button>

                {/* Buy Now Button */}
                <button
                    onClick={handleBuyNow}
                    disabled={isLoading}
                    className="w-full bg-[#99b849] text-white rounded-2xl py-4 md:py-5 px-8 font-bold text-xs uppercase tracking-[0.2em] hover:bg-[#88a441] transition-all active:scale-95 shadow-xl shadow-green-100 flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    <span className="material-symbols-outlined text-xl">
                        bolt
                    </span>
                    Comprar ahora
                </button>
            </div>
        </div>
    );
}
