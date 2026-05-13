import { Link } from '@inertiajs/react';
import MaterialIcon from '@/Components/Icon/MaterialIcon/MaterialIcon';
import styles from './CatalogEmptyState.module.css';

export default function CatalogEmptyState() {
    return (
        <div className={styles.root}>
            <MaterialIcon name="inventory_2" className={`material-symbols-outlined ${styles.icon}`} />
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
