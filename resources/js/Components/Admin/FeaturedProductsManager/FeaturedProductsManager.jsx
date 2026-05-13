import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { toast } from 'react-toastify';
import MaterialIcon from '@/Components/Icon/MaterialIcon/MaterialIcon';
import { filterProductsBySearchTerm } from '@/Utils/productSearch';
import { getAdminProductImage } from '@/Components/Admin/utils/productImages';
import styles from './FeaturedProductsManager.module.css';

function ProductRow({ product, isLoading, onToggleFeatured }) {
    const isPromoted = !!product.is_promoted;
    const rowClassName = `${styles.productRow} ${isPromoted ? styles.productRowFeatured : ''}`;
    const starIconClassName = `${styles.statusIcon} ${isPromoted ? styles.statusIconFeatured : styles.statusIconInactive}`;
    const productImage = getAdminProductImage(product);

    const handleToggle = () => {
        onToggleFeatured(product);
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            handleToggle();
        }
    };

    return (
        <tr
            className={rowClassName}
            onClick={handleToggle}
            onKeyDown={handleKeyDown}
            role="button"
            tabIndex={0}
            aria-label={`${isPromoted ? 'Quitar de destacados' : 'Añadir a destacados'} ${product.name}`}
        >
            <td className={styles.productCell} aria-label={product.name}>
                <div className={styles.productInfo}>
                    <div className={styles.productImageFrame}>
                        {productImage ? (
                            <img src={productImage} alt={product.name} className={styles.productImage} />
                        ) : (
                            <MaterialIcon name="image" className={`material-symbols-outlined ${styles.imagePlaceholderIcon}`} />
                        )}
                    </div>
                    <div className={styles.productText}>
                        <p className={styles.productName}>{product.name}</p>
                        <p className={styles.productSku}>{product.sku || 'Sin SKU'}</p>
                    </div>
                </div>
            </td>
            <td className={`${styles.productCell} ${styles.statusCell}`}>
                {isLoading ? (
                    <MaterialIcon name="refresh" className={`material-symbols-outlined ${styles.loadingIcon}`} />
                ) : (
                    <MaterialIcon
                        name={isPromoted ? 'star' : 'star_border'}
                        className={`material-symbols-outlined ${starIconClassName}`}
                    />
                )}
            </td>
        </tr>
    );
}

function EmptyState({ icon, title, description }) {
    return (
        <div className={styles.emptyState}>
            {icon && <MaterialIcon name={icon} className={`material-symbols-outlined ${styles.emptyStateIcon}`} />}
            <p className={styles.emptyStateTitle}>{title}</p>
            {description && <p className={styles.emptyStateDescription}>{description}</p>}
        </div>
    );
}

export default function FeaturedProductsManager({ products = [] }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [loadingId, setLoadingId] = useState(null);

    const allProducts = filterProductsBySearchTerm(products, searchTerm);
    const featuredProducts = products.filter((product) => product.is_promoted);

    const toggleFeatured = (product) => {
        const isPromoted = !!product.is_promoted;
        setLoadingId(product.id);
        router.post(route('products.update', product.id), {
            _method: 'put',
            is_promoted: !isPromoted,
        }, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                toast.success(isPromoted ? 'Producto eliminado de destacados' : 'Producto añadido a destacados');
                setLoadingId(null);
            },
            onError: () => {
                toast.error('Error al actualizar el estado destacado');
                setLoadingId(null);
            },
        });
    };

    return (
        <div className={styles.layout}>
            <div className={styles.header}>
                <div>
                    <h2 className={styles.title}>Productos Destacados</h2>
                    <p className={styles.description}>Selecciona los productos que aparecerán en la sección de inicio.</p>
                </div>
                <div className={styles.searchWrapper}>
                    <MaterialIcon name="search" className={`material-symbols-outlined ${styles.searchIcon}`} />
                    <input
                        aria-label="Buscar producto destacado"
                        type="text"
                        placeholder="Buscar producto..."
                        className={styles.searchInput}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className={styles.columns}>
                <div className={`${styles.column} ${styles.columnWithDivider}`}>
                    <div className={styles.columnHeader}>
                        Todos los Productos ({allProducts.length})
                    </div>
                    <div className={styles.tableWrapper}>
                        <table className={styles.table}>
                            <tbody>
                                {allProducts.map((product) => (
                                    <ProductRow
                                        key={product.id}
                                        product={product}
                                        isLoading={loadingId === product.id}
                                        onToggleFeatured={toggleFeatured}
                                    />
                                ))}
                            </tbody>
                        </table>
                        {allProducts.length === 0 && (
                            <EmptyState title="No hay productos." />
                        )}
                    </div>
                </div>

                <div className={`${styles.column} ${styles.featuredColumn}`}>
                    <div className={`${styles.columnHeader} ${styles.featuredColumnHeader}`}>
                        Productos Destacados ({featuredProducts.length})
                    </div>
                    <div className={styles.tableWrapper}>
                        <table className={styles.table}>
                            <tbody>
                                {featuredProducts.map((product) => (
                                    <ProductRow
                                        key={product.id}
                                        product={product}
                                        isLoading={loadingId === product.id}
                                        onToggleFeatured={toggleFeatured}
                                    />
                                ))}
                            </tbody>
                        </table>
                        {featuredProducts.length === 0 && (
                            <EmptyState
                                icon="star"
                                title="No hay productos destacados."
                                description="Haz clic en un producto de la izquierda para destacarlo."
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
