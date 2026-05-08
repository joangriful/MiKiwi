import { Link, useForm, router } from "@inertiajs/react";
import { getProductImage } from "@/Components/Checkout/utils/productImages";
import styles from "./CartStep.module.css";

function PopularProducts({ popularProducts, addToCart }) {
    return (
        <div className={styles.popularSection}>
            <div className={styles.popularHeader}>
                <div>
                    <h3 className={styles.popularTitle}>Te va a encantar...</h3>
                    <div className={styles.popularAccent} />
                </div>
                <Link href={route("products.index")} className={styles.popularLink}>
                    Ver todo
                </Link>
            </div>

            <div className={styles.popularGrid}>
                {popularProducts.map((product) => (
                    <div key={product.slug} className={styles.popularCard}>
                        <Link
                            href={route("products.show", product.slug)}
                            className={styles.popularImageLink}
                        >
                            <img
                                src={getProductImage(product)}
                                alt={product.name}
                                className={styles.popularImage}
                            />
                            <div className={styles.popularImageOverlay} />
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
                                aria-label={`Añadir ${product.name} al carrito`}
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
                        d="M16 11V7a4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
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

export default function CartStep({ cart, popularProducts = [], isBuyNow = false }) {
    const { delete: destroy, processing } = useForm();

    const addToCart = (product) => {
        if (Number(product?.stock_quantity ?? 0) <= 0) {
            return;
        }

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

    const removeItem = (id) => {
        if (confirm("¿Estás seguro de eliminar este producto?")) {
            destroy(route("cart.remove", id), {
                data: isBuyNow ? { buy_now: 1 } : {},
                preserveScroll: true,
            });
        }
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
                    {cart.items.map((item) => {
                        const isConfigurable = item.product?.product_type === "configurable";

                        return (
                        <li key={item.product_id} className={styles.itemRow}>
                            <div className={styles.itemContent}>
                                {isConfigurable ? (
                                    <div className={styles.itemImageLink}>
                                        <img
                                            src={getProductImage(item.product)}
                                            alt={item.product.name}
                                            className={styles.itemImage}
                                        />
                                    </div>
                                ) : (
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
                                )}

                                <div className={styles.itemInfo}>
                                    {isConfigurable ? (
                                        <span className={styles.itemName}>
                                            {item.product.name}
                                        </span>
                                    ) : (
                                        <Link
                                            href={route("products.show", item.product.slug)}
                                            className={styles.itemName}
                                        >
                                            {item.product.name}
                                        </Link>
                                    )}

                                    <p className={styles.itemUnitPrice}>
                                        PRECIO: {parseFloat(item.unit_price ?? item.product.base_price).toFixed(2)} €
                                    </p>

                                    {item.configuration?.entries?.length > 0 ? (
                                        <ul className={styles.itemMetaList}>
                                            {item.configuration.entries.map((entry) => (
                                                <li key={`${item.product_id}-${entry.view}-${entry.category}`} className={styles.itemMetaRow}>
                                                    <span>{entry.category}</span>
                                                    <span>
                                                        {entry.has_special_price ? `+${parseFloat(entry.extra_price).toFixed(2)} €` : 'Incluido'}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : null}

                                    <button
                                        type="button"
                                        onClick={() => removeItem(item.product_id)}
                                        className={styles.removeButton}
                                        disabled={processing}
                                        aria-label={`Eliminar ${item.product.name} del carrito`}
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
                                        aria-label={`Reducir cantidad de ${item.product.name}`}
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
                                        aria-label={`Aumentar cantidad de ${item.product.name}`}
                                    >
                                        <svg className={styles.iconSm} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" />
                                        </svg>
                                    </button>
                                </div>

                                <div className={styles.itemTotal}>
                                    {parseFloat(item.subtotal ?? ((item.unit_price ?? item.product.base_price) * item.quantity)).toFixed(2)}
                                    <span className={styles.currency}>€</span>
                                </div>
                            </div>
                        </li>
                    );})}
                </ul>
            </div>

            <PopularProducts popularProducts={popularProducts} addToCart={addToCart} />
        </div>
    );
}
