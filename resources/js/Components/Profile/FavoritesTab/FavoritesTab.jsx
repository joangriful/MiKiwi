import { Link } from '@inertiajs/react';
import { useState } from 'react';
import MaterialIcon from '@/Components/Icon/MaterialIcon/MaterialIcon';
import useProductFavorite from '@/Hooks/useProductFavorite';
import styles from './FavoritesTab.module.css';

function FavoriteProductCard({ product, onRemoved }) {
    const { isFavorite, isTogglingFavorite, toggleFavorite } = useProductFavorite(product, {
        onChange: (nextIsFavorite) => {
            if (!nextIsFavorite) {
                onRemoved(product.id);
            }
        },
    });

    return (
        <article className={styles.productCard}>
            <Link href={route('products.show', product.slug)} className={styles.productLink}>
                {product.category && (
                    <div className={styles.categoryBadge}>
                        <span className={styles.categoryText}>{product.category.name}</span>
                    </div>
                )}

                <div className={styles.productImageBox}>
                    {product.image_url ? (
                        <>
                            <img src={product.image_url} alt={product.name} className={styles.productImage} />
                            {product.hover_image_url && (
                                <img
                                    src={product.hover_image_url}
                                    alt={`${product.name} hover`}
                                    className={styles.productHoverImage}
                                />
                            )}
                        </>
                    ) : (
                        <div className={styles.productPlaceholder} />
                    )}
                </div>

                <div className={styles.productInfo}>
                    <div className={styles.productHeading}>
                        <h3 className={styles.productName}>{product.name}</h3>
                        <span className={styles.productPrice}>
                            {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(product.base_price)}
                        </span>
                    </div>
                    <div className={styles.productDivider} />
                    <p className={styles.productDescription}>
                        {product.description || 'Ingeniería sensorial premium'}
                    </p>
                </div>
            </Link>

            <button
                type="button"
                disabled={isTogglingFavorite}
                onClick={toggleFavorite}
                className={styles.favoriteButton}
                aria-label={isFavorite ? `Quitar ${product.name} de favoritos` : `Añadir ${product.name} a favoritos`}
                aria-pressed={isFavorite}
            >
                <MaterialIcon name="favorite" filled className={`material-symbols-outlined ${styles.favoriteIcon}`} />
            </button>
        </article>
    );
}

export default function FavoritesTab({ favoriteProducts = [] }) {
    const [products, setProducts] = useState(favoriteProducts);

    const handleRemoved = (productId) => {
        setProducts((currentProducts) => currentProducts.filter((product) => product.id !== productId));
    };

    return (
        <div className={`${styles.root} ${styles.panel}`}>
            <div className={styles.header}>
                <div>
                    <h2 className={styles.title}>Favoritos</h2>
                    <p className={styles.subtitle}>
                        {products.length === 1 ? '1 producto guardado' : `${products.length} productos guardados`}
                    </p>
                </div>

                <Link href={route('products.index')} className={styles.catalogLink}>
                    <MaterialIcon name="storefront" className={styles.materialIcon} />
                    Ver catálogo
                </Link>
            </div>

            {products.length > 0 ? (
                <div className={styles.productsGrid}>
                    {products.map((product) => (
                        <FavoriteProductCard
                            key={product.id}
                            product={product}
                            onRemoved={handleRemoved}
                        />
                    ))}
                </div>
            ) : (
                <div className={styles.emptyState}>
                    <MaterialIcon name="favorite" filled className={`material-symbols-outlined ${styles.emptyIcon}`} />
                    <h3 className={styles.emptyTitle}>Aún no tienes favoritos</h3>
                    <p className={styles.emptyText}>
                        Guarda productos desde el catálogo para encontrarlos aquí rápidamente.
                    </p>
                    <Link href={route('products.index')} className={styles.primaryLink}>
                        Explorar productos
                    </Link>
                </div>
            )}
        </div>
    );
}
