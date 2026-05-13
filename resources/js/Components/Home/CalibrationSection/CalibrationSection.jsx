import React from 'react';
import { Link } from '@inertiajs/react';
import { getCloudinaryUrl } from '@/Utils/cloudinary';
import styles from './CalibrationSection.module.css';

export default function CalibrationSection() {
    const backgroundImage = getCloudinaryUrl(
        'https://res.cloudinary.com/dquwonjie/image/upload/v1778704826/Julia_Platanomelon_944_iuusvc2_koohg8.webp',
        { transformations: 'f_auto,q_auto,w_1600,c_fill' },
    );

    return (
        <section className={styles.root}>
            <img
                src={backgroundImage}
                alt="Calibration Background"
                width="1600"
                height="800"
                loading="lazy"
                decoding="async"
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
