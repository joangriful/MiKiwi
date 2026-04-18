import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import styles from './FilterMenu.module.css';

const NOISE_LEVELS = [
    { value: 'Whisper', label: 'Ultra Silencioso' },
    { value: 'Standard', label: 'Estándar V6' },
];

const USAGE_OPTIONS = ['Solo', 'En Pareja', 'Penetración', 'Licking', 'Estimulación Clitoriana'];

const COLOR_OPTIONS = [
    { name: 'Noir', hex: '#111' },
    { name: 'Biolink', hex: '#99b849' },
    { name: 'Aura', hex: '#f8b7ea' },
    { name: 'Mist', hex: '#e2e0db' },
];

export default function FilterMenu({ isOpen, onClose, categories = [], filters = {} }) {
    // Local state to store changes before applying
    const [localFilters, setLocalFilters] = useState(filters);

    // Al cambiar la categoría principal, reseteamos la subcategoría
    const handleCategoryClick = (category) => {
        const isSelected = localFilters.category === category.id;
        setLocalFilters(prev => ({
            ...prev,
            category: isSelected ? null : category.id,
            categoryName: isSelected ? null : category.name,
            subCategory: null,
            // Guardamos los hijos para mostrarlos
            activeChildren: isSelected ? [] : (category.children || [])
        }));
    };

    // Sync local state when menu opens
    useEffect(() => {
        if (isOpen) {
            setLocalFilters(filters);

            // Si hay una categoría seleccionada, buscamos sus hijos
            if (filters.category) {
                const activeCat = categories.find(c => String(c.id) === String(filters.category));
                if (activeCat) {
                    setLocalFilters(prev => ({
                        ...prev,
                        activeChildren: activeCat.children || []
                    }));
                }
            }

            // Block scroll
            document.body.style.overflow = 'hidden';
        } else {
            // Restore scroll
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen, filters, categories]);

    if (!isOpen) return null;

    const updateLocalFilter = (newParams) => {
        setLocalFilters(prev => ({ ...prev, ...newParams }));
    };

    const handleApply = () => {
        router.get(
            route('products.index'),
            localFilters,
            { preserveState: true }
        );
        onClose();
    };

    const handleClear = () => {
        setLocalFilters({});
        router.get(route('products.index'));
        onClose();
    };

    const panelClassName = `${styles.panel} ${isOpen ? styles.panelOpen : ''}`;

    return (
        <div className={styles.root}>
            <div
                className={styles.backdrop}
                onClick={onClose}
            />

            <div className={panelClassName}>
                <div className={styles.header}>
                    <div className={styles.headerText}>
                        <h2 className={styles.title}>Filtros Avanzados</h2>
                        <span className={styles.eyebrow}>Sincronía Sensorial</span>
                    </div>
                    <button onClick={onClose} className={styles.closeButton}>
                        <span className={`material-symbols-outlined ${styles.closeIcon}`}>close</span>
                    </button>
                </div>

                <div className={styles.content}>

                    <div className={styles.toggleGrid}>
                        <button
                            onClick={() => updateLocalFilter({ stock: localFilters.stock ? null : 1 })}
                            className={`${styles.toggleCard} ${localFilters.stock ? styles.toggleCardActive : styles.toggleCardInactive}`}
                        >
                            <span className={styles.toggleLabel}>En Stock</span>
                            <div className={`${styles.toggleDot} ${localFilters.stock ? styles.toggleDotActive : styles.toggleDotInactive}`}></div>
                        </button>

                        <button
                            onClick={() => updateLocalFilter({ offer: localFilters.offer ? null : 1 })}
                            className={`${styles.toggleCard} ${localFilters.offer ? styles.toggleCardActive : styles.toggleCardInactive}`}
                        >
                            <span className={styles.toggleLabel}>Descuentos</span>
                            <span className={styles.offerBadge}>%</span>
                        </button>
                    </div>

                    <section>
                        <h3 className={styles.sectionTitle}>Explorar Colección</h3>
                        <div className={styles.categoryGrid}>
                            {categories.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => handleCategoryClick(category)}
                                    className={`${styles.categoryButton} ${localFilters.category == category.id ? styles.categoryButtonActive : styles.categoryButtonInactive}`}
                                >
                                    <span>{category.name}</span>
                                    <span className={`${styles.categoryCount} ${localFilters.category == category.id ? styles.categoryCountActive : styles.categoryCountInactive}`}>
                                        {category.total_products_count || 0}
                                    </span>
                                </button>
                            ))}
                        </div>

                        {localFilters.activeChildren && localFilters.activeChildren.length > 0 && (
                            <div className={styles.subCategoryWrap}>
                                {localFilters.activeChildren.map((sub) => (
                                    <button
                                        key={sub.id}
                                        onClick={() => updateLocalFilter({ subCategory: localFilters.subCategory === sub.name ? null : sub.name })}
                                        className={`${styles.subCategoryButton} ${localFilters.subCategory === sub.name ? styles.subCategoryButtonActive : styles.subCategoryButtonInactive}`}
                                    >
                                        <span>{sub.name}</span>
                                        <span className={`${styles.subCategoryCount} ${localFilters.subCategory === sub.name ? styles.subCategoryCountActive : styles.subCategoryCountInactive}`}>
                                            {sub.products_count || 0}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </section>

                    <section>
                        <h3 className={styles.sectionTitle}>Valoraciones</h3>
                        <div className={styles.ratingRow}>
                            {[5, 4, 3, 2, 1].map((rating) => (
                                <button
                                    key={rating}
                                    onClick={() => updateLocalFilter({ rating: localFilters.rating == rating ? null : rating })}
                                    className={`${styles.ratingButton} ${localFilters.rating == rating ? styles.ratingButtonActive : styles.ratingButtonInactive}`}
                                >
                                    <span className={styles.ratingLabel}>{rating}</span>
                                    <span className={`material-symbols-outlined ${styles.ratingIcon} ${localFilters.rating == rating ? styles.ratingIconActive : ''}`}>star</span>
                                </button>
                            ))}
                        </div>
                    </section>

                    <section>
                        <h3 className={styles.sectionTitle}>Nivel de Silencio</h3>
                        <div className={styles.categoryGrid}>
                            {NOISE_LEVELS.map((level) => (
                                <button
                                    key={level.value}
                                    onClick={() => updateLocalFilter({ noise: localFilters.noise === level.value ? null : level.value })}
                                    className={`${styles.categoryButton} ${localFilters.noise === level.value ? styles.categoryButtonActive : styles.categoryButtonInactive}`}
                                >
                                    {level.label}
                                </button>
                            ))}
                        </div>
                    </section>

                    <section>
                        <h3 className={styles.sectionTitle}>Modo de Uso</h3>
                        <div className={styles.pillWrap}>
                            {USAGE_OPTIONS.map((use) => (
                                <button
                                    key={use}
                                    onClick={() => updateLocalFilter({ usage: localFilters.usage === use ? null : use })}
                                    className={`${styles.usageButton} ${localFilters.usage === use ? styles.usageButtonActive : styles.usageButtonInactive}`}
                                >
                                    {use}
                                </button>
                            ))}
                        </div>
                    </section>

                    <section>
                        <h3 className={styles.sectionTitle}>Acabados Sensoriales</h3>
                        <div className={styles.colorRow}>
                            {COLOR_OPTIONS.map((color) => (
                                <button
                                    key={color.name}
                                    onClick={() => updateLocalFilter({ color: localFilters.color === color.name ? null : color.name })}
                                    className={`${styles.colorButton} ${localFilters.color === color.name ? styles.colorButtonActive : ''}`}
                                >
                                    <div
                                        className={styles.colorSwatch}
                                        style={{ backgroundColor: color.hex }}
                                        title={color.name}
                                    />
                                </button>
                            ))}
                        </div>
                    </section>
                </div>

                <div className={styles.footer}>
                    <button
                        onClick={handleClear}
                        className={styles.clearButton}
                    >
                        Limpiar Todo
                    </button>
                    <button
                        onClick={handleApply}
                        className={styles.applyButton}
                    >
                        <span className={styles.applyButtonLabel}>Aplicar Filtros</span>
                        <div className={styles.applyButtonGlow}></div>
                    </button>
                </div>
            </div>
        </div>
    );
}
