import { Link } from '@inertiajs/react';

import ScrollReveal from '@/Utils/ScrollReveal';
import { getCloudinaryUrl } from '@/Utils/cloudinary';
import styles from './DollTeaserSection.module.css';

const TEASER_IMAGE = 'https://res.cloudinary.com/dquwonjie/image/upload/v1771872987/46bfb4f33999ce12ffa791b9df263c4f_vuktao.jpg';

export default function DollTeaserSection() {
    return (
        <section className={styles.root}>
            <div className={styles.background} aria-hidden="true">
                <img
                    src={getCloudinaryUrl(TEASER_IMAGE, { transformations: 'f_auto,q_auto,w_1400,h_900,c_fill' })}
                    alt=""
                    width="1400"
                    height="900"
                    loading="lazy"
                    decoding="async"
                    className={styles.backgroundImage}
                />
                <div className={styles.gradient} />
            </div>

            <div className={styles.content}>
                <ScrollReveal direction="right" distance={40}>
                    <span className={styles.tag}>Personalización Avanzada</span>
                    <h2 className={styles.title}>
                        CREA TU<br />PROPIA MODELO.
                    </h2>
                </ScrollReveal>

                <ScrollReveal direction="left" distance={40} delay={0.2}>
                    <p className={styles.text}>
                        Accede a nuestro configurador biométrico de alta fidelidad. Define cada detalle, textura y polímero de tu compañera ideal.
                    </p>
                </ScrollReveal>

                <ScrollReveal direction="up" delay={0.4}>
                    <Link href={route('doll.config.test')} className={styles.cta}>
                        LANZAR CONFIGURADOR
                    </Link>
                </ScrollReveal>
            </div>
        </section>
    );
}
