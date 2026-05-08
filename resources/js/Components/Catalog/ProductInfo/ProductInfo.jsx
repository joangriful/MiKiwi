import { useState } from "react";
import { Link, router } from "@inertiajs/react";
import axios from "axios";
import useProductFavorite from '@/Hooks/useProductFavorite';
import styles from './ProductInfo.module.css';

export default function ProductInfo({ product }) {
    const { isFavorite, isTogglingFavorite, toggleFavorite } = useProductFavorite(product);
    const [quantity, setQuantity] = useState(1);
    const [notification, setNotification] = useState(null); // 'added' | 'error' | null
    const [isLoading, setIsLoading] = useState(false);

    const parentCategory = product?.category?.parent;
    const currentCategory = product?.category;
    const isOutOfStock = Number(product?.stock_quantity ?? 0) <= 0;

    const showNotification = (type) => {
        setNotification(type);
        setTimeout(() => setNotification(null), 2500);
    };

    const handleAddToCart = async () => {
        if (!product?.slug || isOutOfStock) return;
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
        if (!product?.slug || isOutOfStock) return;
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
        <div className={styles.root}>
            <div
                className={`${styles.notificationWrap} ${notification ? styles.notificationWrapVisible : styles.notificationWrapHidden}`}
            >
                {notification === "added" && (
                    <div className={`${styles.notification} ${styles.notificationSuccess}`}>
                        <span className={`material-symbols-outlined ${styles.notificationIcon}`}>
                            check_circle
                        </span>
                        <span className={styles.notificationText}>
                            ¡Producto añadido al carrito! Redirigiendo…
                        </span>
                    </div>
                )}
                {notification === "error" && (
                    <div className={`${styles.notification} ${styles.notificationError}`}>
                        <span className={`material-symbols-outlined ${styles.notificationIcon}`}>
                            error
                        </span>
                        <span className={styles.notificationText}>
                            Error al añadir el producto. Inténtalo de nuevo.
                        </span>
                    </div>
                )}
            </div>

            <div className={styles.breadcrumbs}>
                {parentCategory && (
                    <>
                        <Link
                            href={route("categories.show", parentCategory.slug)}
                            className={styles.breadcrumbLink}
                        >
                            {parentCategory.name}
                        </Link>
                        <span className={styles.breadcrumbDivider}>/</span>
                    </>
                )}
                {currentCategory ? (
                    <Link
                        href={route("categories.show", currentCategory.slug)}
                        className={`${styles.breadcrumbLink} ${styles.breadcrumbLinkActive}`}
                    >
                        {currentCategory.name}
                    </Link>
                ) : (
                    <span className={styles.breadcrumbFallback}>Colección Kiwi</span>
                )}
            </div>

            <div className={styles.titleRow}>
                <h1 className={styles.title}>
                    {product?.name || "Kiwi Premium"}
                </h1>
                <button
                    type="button"
                    onClick={toggleFavorite}
                    disabled={isTogglingFavorite}
                    className={`${styles.favoriteButton} ${isFavorite ? styles.favoriteButtonActive : styles.favoriteButtonInactive}`}
                    aria-label={isFavorite ? `Quitar ${product?.name} de favoritos` : `Añadir ${product?.name} a favoritos`}
                    aria-pressed={isFavorite}
                >
                    <span
                        className={`material-symbols-outlined ${styles.favoriteIcon} ${isFavorite ? styles.favoriteIconFilled : ''}`}
                        style={{
                            fontVariationSettings:
                                "'FILL' " + (isFavorite ? 1 : 0),
                        }}
                    >
                        favorite
                    </span>
                </button>
            </div>

            <div className={styles.priceRow}>
                <span className={styles.price}>
                    {product?.base_price
                        ? new Intl.NumberFormat("es-ES", {
                            style: "currency",
                            currency: "EUR",
                        }).format(product.base_price)
                        : "4.99€"}
                </span>
                {product?.base_price > 50 && (
                    <span className={styles.limitedBadge}>
                        Edición Limitada
                    </span>
                )}
            </div>

            <div className={styles.descriptionBlock}>
                <h3 className={styles.descriptionTitle}>
                    Descripción
                </h3>
                <p className={styles.descriptionText}>
                    {product?.description ||
                        "Nuestros productos representan la cumbre de la ingeniería sensorial de MiKiwi. Cada pieza es seleccionada y procesada bajo los estándares más estrictos para garantizar una experiencia de introspección única y pura."}
                </p>
            </div>

            <div className={styles.actions}>
                <div className={styles.quantitySelector}>
                    <button
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className={styles.quantityButton}
                    >
                        -
                    </button>
                    <div className={styles.quantityValue}>
                        <span className={styles.quantityLabel}>CANTIDAD</span>
                        <span className={styles.quantityNumber}>
                            {quantity}
                        </span>
                    </div>
                    <button
                        onClick={() => setQuantity((q) => q + 1)}
                        className={styles.quantityButton}
                    >
                        +
                    </button>
                </div>

                <button
                    onClick={handleAddToCart}
                    disabled={isLoading || isOutOfStock}
                    className={styles.addToCartButton}
                >
                    <span className={`material-symbols-outlined ${styles.actionIcon}`}>
                        shopping_cart
                    </span>
                    {isOutOfStock ? 'Sin stock' : 'Añadir al carrito'}
                </button>

                <button
                    onClick={handleBuyNow}
                    disabled={isLoading || isOutOfStock}
                    className={styles.buyNowButton}
                >
                    <span className={`material-symbols-outlined ${styles.actionIcon}`}>
                        bolt
                    </span>
                    {isOutOfStock ? 'Sin stock' : 'Comprar ahora'}
                </button>
            </div>
        </div>
    );
}
