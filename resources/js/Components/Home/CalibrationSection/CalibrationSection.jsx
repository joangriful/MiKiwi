import React from 'react';
import { Link } from '@inertiajs/react';
import styles from './CalibrationSection.module.css';

export default function CalibrationSection() {
    const backgroundImage = 'https://res.cloudinary.com/dquwonjie/image/upload/v1771865798/Julia_Platanomelon_944_iuusvc.jpg';

    return (
        <section className={styles.root}>
            <img
                src={backgroundImage}
                alt="Calibration Background"
                className={styles.backgroundImage}
            />

            <div className={styles.content}>
                <h2 className={styles.title}>
                    ¿NO SABES POR DÓNDE EMPEZAR?
                </h2>

                <Link href="/configurador/quiz" className={styles.cta}>
                    CONÓCETE
                </Link>
            </div>

            <div className={styles.overlay} />
        </section>
    );
}
