import React from 'react';
import { router } from '@inertiajs/react';
import styles from './ProductFilters.module.css';

export default function ProductFilters({ categories, filters }) {
    const handleCategoryChange = (categoryId) => {
        router.get(
            route('products.index'),
            { ...filters, category: categoryId },
            { preserveState: true }
        );
    };

    const handlePriceChange = (e) => {
        // Implement debounced price change or button click
    };

    return (
        <div className={styles.root}>
            <h3 className={styles.title}>Filtros</h3>

            <div className={styles.section}>
                <h4 className={styles.sectionTitle}>Categorías</h4>
                <div className={styles.categoryList}>
                    <button
                        onClick={() => handleCategoryChange(null)}
                        className={`${styles.categoryButton} ${!filters.category ? styles.categoryButtonActive : styles.categoryButtonInactive}`}
                    >
                        Todas
                    </button>
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => handleCategoryChange(category.id)}
                            className={`${styles.categoryButton} ${filters.category == category.id ? styles.categoryButtonActive : styles.categoryButtonInactive}`}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>
            </div>

            <div className={styles.section}>
                <h4 className={styles.sectionTitle}>Precio</h4>
                <div className={styles.pricePlaceholder}>
                </div>
            </div>
        </div>
    );
}
