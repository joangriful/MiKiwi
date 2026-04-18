import styles from './MainProductImage.module.css';
export default function MainProductImage({ image }) {
    return (
        <div className={styles.root}>
            {image ? (
                <img
                    src={image}
                    alt="Vista detallada del producto"
                    className={styles.image}
                />
            ) : (
                <span className={`material-symbols-outlined ${styles.placeholderIcon}`}>image</span>
            )}
        </div>
    );
}
