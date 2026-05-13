import MaterialIcon from '@/Components/Icon/MaterialIcon/MaterialIcon';
import styles from './ProductImagePlaceholder.module.css';

export default function ProductImagePlaceholder() {
    return (
        <div className={styles.root}>
            <MaterialIcon name="image" className={`material-symbols-outlined ${styles.icon}`} />
        </div>
    );
}
