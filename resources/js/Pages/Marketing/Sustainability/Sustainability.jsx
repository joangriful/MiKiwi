import React from 'react';
import MarketingPageLayout from '@/Components/Marketing/MarketingPageLayout/MarketingPageLayout';
import styles from './Sustainability.module.css';

const pillars = [
    {
        title: 'Materiales Seguros',
        tone: 'info',
        text: 'Utilizamos silicona hipoalergénica, algodón orgánico y maderas certificadas. Nuestra impresión 3D utiliza PLA biodegradable, un plástico de origen vegetal y libre de tóxicos.',
    },
    {
        title: 'Producción Local',
        tone: 'warning',
        text: 'Fabricado con orgullo en Chipiona, Cádiz. Apostamos por el talento local, reduciendo nuestra huella de carbono y apoyando la economía de nuestra región.',
    },
    {
        title: 'Packaging Sin Plásticos',
        tone: 'success',
        text: 'Nuestros envíos son 100% libres de plásticos. Utilizamos cajas de cartón reciclable y tintas respetuosas con el medio ambiente.',
    },
];

const philosophyItems = [
    'Diseño atemporal y duradero',
    'Fomento del juego consciente',
    'Respeto por los tiempos de la infancia',
];

export default function Sustainability({ heroImages = [] }) {
    const heroImage = heroImages[0]?.url;

    return (
        <MarketingPageLayout title="Sostenibilidad" maxWidth="wide" showBreadcrumb={false} showPageHeader={false} className={styles.layout}>
            <section className={styles.hero}>
                {heroImage && <img src={heroImage} alt="" className={styles.heroImage} />}
                <div className={styles.heroOverlay} />
                <div className={styles.heroContent}>
                    <p>Nuestro Compromiso</p>
                    <h1>Jugando por un <span>futuro mejor</span></h1>
                    <p>
                        En Mikiwi, creemos que la diversión no debe costar el planeta. Diseñamos juguetes responsables,
                        seguros y duraderos.
                    </p>
                </div>
            </section>

            <section className={styles.pillars}>
                {pillars.map((pillar) => (
                    <article className={styles.pillar} key={pillar.title}>
                        <span className={`${styles.icon} ${styles[pillar.tone]}`} aria-hidden="true" />
                        <h2>{pillar.title}</h2>
                        <p>{pillar.text}</p>
                    </article>
                ))}
            </section>

            <section className={styles.philosophy}>
                <div className={styles.visual}>
                    <span>SLOW TOYS</span>
                </div>
                <div>
                    <p className={styles.kicker}>Nuestra Filosofía</p>
                    <h2>Menos es más: La filosofía "Slow"</h2>
                    <p>
                        En un mundo de consumo rápido, apostamos por la durabilidad. Nuestros juguetes están diseñados para durar,
                        ser reparados y favorecer una economía circular.
                    </p>
                    <ul>
                        {philosophyItems.map((item) => (
                            <li key={item}>{item}</li>
                        ))}
                    </ul>
                </div>
            </section>
        </MarketingPageLayout>
    );
}
