import { useState } from "react";
import { Link, router } from "@inertiajs/react";
import useCartActions from "@/Features/Cart/hooks/useCartActions";
import styles from './ProductInfo.module.css';

export default function ProductInfo({ product }) {
    const { addToCart, buyNow, resolveBuyNowUrl } = useCartActions();
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
            await addToCart({
                productSlug: product.slug,
                quantity,
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
            const responseData = await buyNow({
                productSlug: product.slug,
                quantity,
            });

            router.visit(resolveBuyNowUrl(responseData));
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
                    onClick={() => setIsFavorite(!isFavorite)}
                    className={`${styles.favoriteButton} ${isFavorite ? styles.favoriteButtonActive : styles.favoriteButtonInactive}`}
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
                    disabled={isLoading}
                    className={styles.addToCartButton}
                >
                    <span className={`material-symbols-outlined ${styles.actionIcon}`}>
                        shopping_cart
                    </span>
                    Añadir al carrito
                </button>

                <button
                    onClick={handleBuyNow}
                    disabled={isLoading}
                    className={styles.buyNowButton}
                >
                    <span className={`material-symbols-outlined ${styles.actionIcon}`}>
                        bolt
                    </span>
                    Comprar ahora
                </button>
            </div>
        </div>
    );
}
