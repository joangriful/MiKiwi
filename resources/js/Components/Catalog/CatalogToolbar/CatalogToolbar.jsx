import MaterialIcon from '@/Components/Icon/MaterialIcon/MaterialIcon';
import styles from './CatalogToolbar.module.css';

export default function CatalogToolbar({
    activeFilterCount = 0,
    onOpenFilters,
    onSearchChange,
    searchTerm = '',
}) {
    return (
        <div className={styles.root}>
            <div className={styles.searchWrap}>
                <MaterialIcon name="search" className={`material-symbols-outlined ${styles.searchIcon}`} />
                <input
                    type="text"
                    placeholder="Buscar..."
                    value={searchTerm}
                    aria-label="Buscar productos"
                    onChange={(event) => onSearchChange(event.target.value)}
                    className={styles.searchInput}
                />
                {searchTerm && (
                    <button
                        type="button"
                        onClick={() => onSearchChange('')}
                        className={styles.clearSearchButton}
                        aria-label="Limpiar busqueda"
                    >
                        <MaterialIcon name="close" className={`material-symbols-outlined ${styles.clearSearchIcon}`} />
                    </button>
                )}
            </div>

            <button
                type="button"
                onClick={onOpenFilters}
                className={styles.filterButton}
            >
                <MaterialIcon name="tune" className={`material-symbols-outlined ${styles.filterIcon}`} />
                <span className={styles.filterButtonLabel}>Filtrar</span>
                {activeFilterCount > 0 && (
                    <span className={styles.filterCount}>{activeFilterCount}</span>
                )}
            </button>
        </div>
    );
}
