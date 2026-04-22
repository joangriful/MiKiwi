import React from 'react';
import MarketingPageLayout from '@/Components/Marketing/MarketingPageLayout/MarketingPageLayout';
import styles from './AboutUs.module.css';

const values = [
    {
        title: 'Inclusión',
        text: 'Garantizamos que la búsqueda de placer sea accesible y respetuosa para todos los cuerpos y todas las identidades, incluyendo a la comunidad LGTBQ+.',
    },
    {
        title: 'Confianza y Ética',
        text: 'Mantenemos un compromiso absoluto con la discreción del cliente y la seguridad del producto, utilizando únicamente materiales certificados.',
    },
    {
        title: 'Plenitud y Bienestar',
        text: 'Promovemos la sexualidad como un pilar fundamental de la salud integral y fomentamos la autoexploración positiva.',
    },
    {
        title: 'Innovación Tecnológica',
        text: 'Utilizamos soluciones de vanguardia, como la co-creación on-demand, para resolver problemas reales del consumidor.',
    },
];

const features = [
    ['Personalización Total:', 'Diseña tu producto según tus necesidades anatómicas, funcionales y estéticas.'],
    ['Calidad Premium:', 'Materiales certificados y procesos de fabricación de alto valor.'],
    ['Discreción Absoluta:', 'Envío y facturación completamente confidenciales.'],
    ['Experiencia Única:', 'Tecnología avanzada para una experiencia de compra fluida y segura.'],
];

export default function AboutUs() {
    return (
        <MarketingPageLayout title="Sobre Nosotros" maxWidth="default" showBreadcrumb={false}>
            <div className={styles.content}>
                <section className={styles.section}>
                    <h2>Quiénes Somos</h2>
                    <p>
                        <strong>MiKiwi</strong> es una plataforma innovadora de e-commerce especializada en bienestar sexual
                        personalizado. Nacimos con la visión de transformar la industria ofreciendo productos totalmente
                        personalizables bajo demanda.
                    </p>
                    <p>
                        Como startup tecnológica, combinamos innovación, diseño y un profundo compromiso ético para crear
                        experiencias únicas adaptadas a cada persona.
                    </p>
                </section>

                <section className={styles.highlight}>
                    <h2>Nuestra Misión</h2>
                    <p>
                        Democratizar la plenitud sexual ofreciendo a cada individuo la posibilidad de co-crear herramientas de
                        placer únicas, personalizadas bajo demanda, con inclusión, seguridad y discreción.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2>Nuestra Visión</h2>
                    <p>
                        Ser el referente global del bienestar sexual personalizado, eliminando la estandarización y normalizando
                        la autoexploración como componente esencial de la salud integral.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2>Nuestros Valores</h2>
                    <div className={styles.grid}>
                        {values.map((value) => (
                            <article className={styles.card} key={value.title}>
                                <h3>{value.title}</h3>
                                <p>{value.text}</p>
                            </article>
                        ))}
                    </div>
                </section>

                <section className={styles.highlight}>
                    <h2>Nuestra Propuesta de Valor</h2>
                    <p>
                        MiKiwi resuelve la principal fricción del consumidor en el sector: la incertidumbre. A través de nuestro
                        configurador on-demand, eliminamos dudas sobre ajuste, material y funcionalidad.
                    </p>
                    <ul className={styles.featureList}>
                        {features.map(([title, text]) => (
                            <li key={title}>
                                <span aria-hidden="true">✓</span>
                                <p><strong>{title}</strong> {text}</p>
                            </li>
                        ))}
                    </ul>
                </section>

                <section className={styles.contact}>
                    <h2>¿Tienes alguna pregunta?</h2>
                    <p>Estamos aquí para ayudarte. No dudes en contactarnos.</p>
                    <a href="mailto:mikiwi.toys@gmail.com">mikiwi.toys@gmail.com</a>
                </section>

                <footer className={styles.note}>
                    <p>MiKiwi - Innovación, Inclusión y Bienestar</p>
                    <p>Pago Valdeconejos, s/n, 11550 Chipiona, Cádiz</p>
                </footer>
            </div>
        </MarketingPageLayout>
    );
}
