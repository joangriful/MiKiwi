import styles from './ProductImagePlaceholder.module.css';

export default function ProductImagePlaceholder() {
    return (
        <div className={styles.root}>
            <span className={`material-symbols-outlined ${styles.icon}`}>image</span>
        </div>
    );
}
