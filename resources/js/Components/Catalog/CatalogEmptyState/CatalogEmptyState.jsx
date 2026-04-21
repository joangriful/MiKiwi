import { Link } from '@inertiajs/react';
import styles from './CatalogEmptyState.module.css';

export default function CatalogEmptyState() {
    return (
        <div className={styles.root}>
            <span className={`material-symbols-outlined ${styles.icon}`}>inventory_2</span>
            <p className={styles.message}>Sin resultados para tu busqueda.</p>
            <Link
                href={route('products.index')}
                className={styles.resetLink}
            >
                Reestablecer Filtros
            </Link>
        </div>
    );
}
