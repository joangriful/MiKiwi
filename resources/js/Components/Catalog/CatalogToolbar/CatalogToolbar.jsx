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
                <span className={`material-symbols-outlined ${styles.searchIcon}`}>search</span>
                <input
                    type="text"
                    placeholder="Buscar..."
                    value={searchTerm}
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
                        <span className={`material-symbols-outlined ${styles.clearSearchIcon}`}>close</span>
                    </button>
                )}
            </div>

            <button
                type="button"
                onClick={onOpenFilters}
                className={styles.filterButton}
            >
                <span className={`material-symbols-outlined ${styles.filterIcon}`}>tune</span>
                <span className={styles.filterButtonLabel}>Filtrar</span>
                {activeFilterCount > 0 && (
                    <span className={styles.filterCount}>{activeFilterCount}</span>
                )}
            </button>
        </div>
    );
}
