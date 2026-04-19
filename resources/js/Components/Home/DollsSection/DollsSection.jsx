import React from 'react';
import styles from './DollsSection.module.css';

export default function DollsSection({ dollsImages }) {
    if (!dollsImages || dollsImages.length === 0) {
        return null;
    }

    return (
        <section className={styles.root} id="dolls-exploration">
            <div className={styles.container}>
                <div className={styles.header}>
                    <div className={styles.headerContent}>
                        <span className={styles.eyebrow}>The Doll Experience</span>
                        <h2 className={styles.title}>
                            Alta <br />Ingeniería<span className={styles.titleAccent}>.</span>
                        </h2>
                        <p className={styles.description}>
                            Explora nuestra selección de muñecas hiperrealistas, diseñadas para una inmersión sensorial absoluta y una conexión sin precedentes.
                        </p>
                    </div>
                </div>

                <div className={styles.grid}>
                    {dollsImages.map((image, index) => (
                        <div
                            key={image.url ?? index}
                            className={styles.card}
                            style={{ animationDelay: `${index * 200 + 400}ms` }}
                        >
                            <img
                                src={image.url}
                                alt={`Doll ${index + 1}`}
                                className={styles.image}
                            />

                            <div className={styles.overlay}>
                                <span className={styles.overlayTag}>Luxury Variant</span>
                                <h3 className={styles.overlayTitle}>Nova Realista</h3>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
