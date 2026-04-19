import React from "react";
import { Link, useForm, router } from "@inertiajs/react";
import { useConfirm } from "@/Shared/Confirm/ConfirmProvider";
import styles from "./CartStep.module.css";

function getProductImage(product) {
    try {
        const images =
            typeof product.images === "string"
                ? JSON.parse(product.images)
                : product.images;

        if (Array.isArray(images) && images.length > 0) {
            return images[0];
        }
    } catch (error) {
        // Fallback handled below.
    }

    return product.image_url || "https://via.placeholder.com/150";
}

function PopularProducts({ popularProducts, addToCart }) {
    return (
        <div className={styles.popularSection}>
            <div className={styles.popularHeader}>
                <div>
                    <h3 className={styles.popularTitle}>Te va a encantar...</h3>
                    <div className={styles.popularAccent}></div>
                </div>
                <Link href={route("products.index")} className={styles.popularLink}>
                    Ver todo
                </Link>
            </div>

            <div className={styles.popularGrid}>
                {popularProducts.map((product) => (
                    <div key={product.id} className={styles.popularCard}>
                        <Link
                            href={route("products.show", product.slug)}
                            className={styles.popularImageLink}
                        >
                            <img
                                src={getProductImage(product)}
                                alt={product.name}
                                className={styles.popularImage}
                            />
                            <div className={styles.popularImageOverlay}></div>
                        </Link>

                        <Link
                            href={route("products.show", product.slug)}
                            className={styles.popularProductLink}
                        >
                            {product.name}
                        </Link>

                        <div className={styles.popularFooter}>
                            <p className={styles.popularPrice}>
                                {parseFloat(product.base_price).toFixed(2)}€
                            </p>

                            <button
                                type="button"
                                onClick={() => addToCart(product)}
                                className={styles.popularAddButton}
                            >
                                <svg className={styles.iconSm} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" />
                                </svg>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function EmptyCart({ popularProducts, addToCart }) {
    return (
        <div className={styles.emptyState}>
            <div className={styles.emptyContent}>
                <svg
                    className={styles.emptyIcon}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1"
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                </svg>

                <h2 className={styles.emptyTitle}>Tu carrito está vacío</h2>
                <p className={styles.emptyText}>
                    ¿No sabes qué comprar? Echa un vistazo a nuestros populares.
                </p>
            </div>

            <Link href={route("products.index")} className={styles.emptyAction}>
                Volver a la tienda
            </Link>

            <PopularProducts popularProducts={popularProducts} addToCart={addToCart} />
        </div>
    );
}

export default function CartStep({ cart, onNext, popularProducts = [] }) {
    const { delete: destroy, processing } = useForm();
    const confirmAction = useConfirm();

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
                quantity,
            },
            {
                preserveScroll: true,
            },
        );
    };

    const removeItem = async (id) => {
        const confirmed = await confirmAction({
            title: 'Eliminar producto',
            message: '¿Seguro que quieres eliminar este producto del carrito?',
            confirmText: 'Eliminar',
            cancelText: 'Cancelar',
            tone: 'danger',
        });

        if (!confirmed) {
            return;
        }

        destroy(route("cart.remove", id), {
            preserveScroll: true,
        });
    };

    if (!cart.items || cart.items.length === 0) {
        return <EmptyCart popularProducts={popularProducts} addToCart={addToCart} />;
    }

    return (
        <div className={styles.root}>
            <div className={styles.header}>
                <div>
                    <h2 className={styles.title}>Cesta de Compra</h2>
                    <p className={styles.stepMeta}>
                        {cart.items.length} {cart.items.length === 1 ? "artículo" : "artículos"}
                    </p>
                </div>

                <Link href={route("products.index")} className={styles.backLink}>
                    <span className={styles.backArrow}>&larr;</span>
                    Seguir comprando
                </Link>
            </div>

            <div className={styles.itemsWrapper}>
                <ul className={styles.itemsList}>
                    {cart.items.map((item) => (
                        <li key={item.product_id} className={styles.itemRow}>
                            <div className={styles.itemContent}>
                                <Link
                                    href={route("products.show", item.product.slug)}
                                    className={styles.itemImageLink}
                                >
                                    <img
                                        src={getProductImage(item.product)}
                                        alt={item.product.name}
                                        className={styles.itemImage}
                                    />
                                </Link>

                                <div className={styles.itemInfo}>
                                    <Link
                                        href={route("products.show", item.product.slug)}
                                        className={styles.itemName}
                                    >
                                        {item.product.name}
                                    </Link>

                                    <p className={styles.itemUnitPrice}>
                                        PRECIO: {parseFloat(item.product.base_price).toFixed(2)} €
                                    </p>

                                    <button
                                        type="button"
                                        onClick={() => removeItem(item.product_id)}
                                        className={styles.removeButton}
                                        disabled={processing}
                                    >
                                        <svg className={styles.iconXs} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                        Eliminar
                                    </button>
                                </div>
                            </div>

                            <div className={styles.itemActions}>
                                <div className={styles.quantityControl}>
                                    <button
                                        type="button"
                                        onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                                        className={styles.quantityButton}
                                        disabled={processing}
                                    >
                                        <svg className={styles.iconSm} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M20 12H4" />
                                        </svg>
                                    </button>

                                    <span className={styles.quantityValue}>{item.quantity}</span>

                                    <button
                                        type="button"
                                        onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                                        className={styles.quantityButton}
                                        disabled={processing}
                                    >
                                        <svg className={styles.iconSm} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" />
                                        </svg>
                                    </button>
                                </div>

                                <div className={styles.itemTotal}>
                                    {(item.product.base_price * item.quantity).toFixed(2)}
                                    <span className={styles.currency}>€</span>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            <PopularProducts popularProducts={popularProducts} addToCart={addToCart} />
        </div>
    );
}
