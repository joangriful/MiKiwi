import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { toast } from 'react-toastify';
import MaterialIcon from '@/Components/Icon/MaterialIcon/MaterialIcon';
import { filterProductsBySearchTerm } from '@/Utils/productSearch';
import { getAdminProductImage } from '@/Components/Admin/utils/productImages';
import styles from './ProductsList.module.css';

function SearchBar({ searchTerm, setSearchTerm }) {
    return (
        <div className={styles.searchWrapper}>
            <MaterialIcon name="search" className={`material-symbols-outlined ${styles.searchIcon}`} />
            <input
                aria-label="Buscar por nombre o SKU"
                type="text"
                placeholder="Buscar por nombre o SKU..."
                className={styles.searchInput}
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
            />
        </div>
    );
}

function EmptyState() {
    return (
        <div className={styles.emptyState}>
            <MaterialIcon name="inventory_2" className={`material-symbols-outlined ${styles.emptyStateIcon}`} />
            <p className={styles.emptyStateTitle}>No se encontraron productos</p>
            <p className={styles.emptyStateDescription}>Inténtalo con otro término de búsqueda o crea uno nuevo.</p>
        </div>
    );
}

export default function ProductsList({ products = [], onEdit, debugCount }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [deletingId, setDeletingId] = useState(null);

    const filteredProducts = filterProductsBySearchTerm(products, searchTerm);

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
            },
        });
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                <div className={styles.summary}>
                    Total: {filteredProducts.length} productos (Raw prop: {products?.length}, Debug Count: {debugCount})
                </div>
            </div>

            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead className={styles.tableHead}>
                        <tr>
                            <th className={`${styles.tableHeading} ${styles.orderHeading}`} aria-label="Orden" />
                            <th className={styles.tableHeading}>Producto</th>
                            <th className={styles.tableHeading}>Categoría</th>
                            <th className={styles.tableHeading}>Precio</th>
                            <th className={styles.tableHeading}>Stock</th>
                            <th className={styles.tableHeading}>Estado</th>
                            <th className={`${styles.tableHeading} ${styles.actionsHeading}`}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.map((product, index) => {
                            const productImage = getAdminProductImage(product);

                            return (
                                <tr key={product.id} className={styles.tableRow}>
                                    <td className={`${styles.tableCell} ${styles.orderCell}`}>
                                        {filteredProducts.length - index}
                                    </td>
                                    <td className={styles.tableCell} aria-label={product.name}>
                                        <div className={styles.productInfo}>
                                            <div className={styles.productImageFrame}>
                                                {productImage ? (
                                                    <img src={productImage} alt={product.name} className={styles.productImage} />
                                                ) : (
                                                    <div className={styles.productImagePlaceholder}>
                                                        <MaterialIcon name="image" className="material-symbols-outlined" />
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <p className={styles.productName}>{product.name}</p>
                                                <p className={styles.productSku}>{product.sku || 'Sin SKU'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className={styles.tableCell}>
                                        <span className={styles.categoryBadge}>
                                            {product.category?.name || 'Uncategorized'}
                                        </span>
                                    </td>
                                    <td className={styles.tableCell}>
                                        <span className={styles.price}>{parseFloat(product.base_price).toFixed(2)}€</span>
                                    </td>
                                    <td className={styles.tableCell} aria-label={`Stock ${product.stock_quantity ?? 0}`}>
                                        <div className={styles.stockInfo}>
                                            <span className={`${styles.stockDot} ${product.stock_quantity > 0 ? styles.stockDotAvailable : styles.stockDotEmpty}`} aria-hidden="true" />
                                            <span className={styles.stockValue}>{product.stock_quantity ?? 0}</span>
                                        </div>
                                    </td>
                                    <td className={styles.tableCell}>
                                        <span className={`${styles.statusBadge} ${product.is_active ? styles.statusBadgeActive : styles.statusBadgeInactive}`}>
                                            {product.is_active ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </td>
                                    <td className={`${styles.tableCell} ${styles.actionsCell}`}>
                                        <div className={styles.actionButtons}>
                                            <button
                                                type="button"
                                                onClick={() => onEdit(product)}
                                                className={`${styles.iconButton} ${styles.editButton}`}
                                                title="Editar"
                                                aria-label={`Editar ${product.name}`}
                                            >
                                                <MaterialIcon name="edit" className={`material-symbols-outlined ${styles.iconButtonIcon}`} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleDelete(product)}
                                                disabled={deletingId === product.id}
                                                className={`${styles.iconButton} ${styles.deleteButton}`}
                                                title="Eliminar"
                                                aria-label={`Eliminar ${product.name}`}
                                            >
                                                {deletingId === product.id ? (
                                                    <MaterialIcon name="refresh" className={`material-symbols-outlined ${styles.iconButtonIcon} ${styles.spinningIcon}`} />
                                                ) : (
                                                    <MaterialIcon name="delete" className={`material-symbols-outlined ${styles.iconButtonIcon}`} />
                                                )}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {filteredProducts.length === 0 && (
                    <EmptyState />
                )}
            </div>
        </div>
    );
}
