import styles from './ProductGridSection.module.css';

export default function ProductGridSection({ title, children }) {
    return (
        <div className={styles.root}>
            <h2 className={styles.title}>{title || 'Section Title'}</h2>
            {children}
        </div>
    );
}
