import React from 'react';
import styles from './ReturnsTab.module.css';

export default function ReturnsTab() {
    return (
        <div className={`${styles.root} ${styles.panel}`}>
            <h2 className={styles.title}>Devoluciones</h2>

            <div className={styles.section}>
                <h3 className={styles.subtitle}>Devolver Artículo</h3>
                <p className={styles.description}>Proceso para iniciar una devolución.</p>
                <button className={styles.primaryAction}>Iniciar Devolución</button>
            </div>

            <hr className={styles.divider} />

            <div className={styles.section}>
                <h3 className={styles.subtitle}>Estado de tus devoluciones</h3>
                <p className={styles.description}>Revisa el estado de tus devoluciones en curso o pasadas.</p>
            </div>
        </div>
    );
}
