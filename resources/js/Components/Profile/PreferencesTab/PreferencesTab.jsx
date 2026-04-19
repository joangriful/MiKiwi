import React from 'react';
import styles from './PreferencesTab.module.css';

export default function PreferencesTab() {
    return (
        <div className={`${styles.root} ${styles.panel}`}>
            <h2 className={styles.title}>Gestiona tus preferencias</h2>
            <p className={styles.description}>Configura tus preferencias de usuario.</p>
        </div>
    );
}
