import React from 'react';
import styles from './LegalSection.module.css';

export default function LegalSection({ title, children }) {
    return (
        <section className={styles.section}>
            <h2 className={styles.title}>
                <span aria-hidden="true" className={styles.marker}>·</span>
                {title}
            </h2>
            <div className={styles.content}>{children}</div>
        </section>
    );
}
