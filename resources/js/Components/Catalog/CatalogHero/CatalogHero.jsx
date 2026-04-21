import styles from './CatalogHero.module.css';

export default function CatalogHero() {
    return (
        <header className={styles.root}>
            <div className={styles.headingGroup}>
                <span className={styles.eyebrow}>Curated Selection</span>
                <h1 className={styles.title}>
                    Nuestros <br />
                    Productos<span className={styles.titleAccent}>.</span>
                </h1>
            </div>
            <p className={styles.description}>
                Ingenieria sensorial de precision disenada para elevar tu experiencia de introspeccion habitual.
            </p>
        </header>
    );
}
