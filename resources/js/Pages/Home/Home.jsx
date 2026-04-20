import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';

import Header from '@/Components/Header/Header';
import Footer from '@/Components/Footer/Footer';
import CalibrationSection from '@/Components/Home/CalibrationSection/CalibrationSection';
import FeaturedProductsSection from '@/Components/Home/FeaturedProductsSection/FeaturedProductsSection';
import useLenisScroll from '@/Hooks/useLenisScroll';
import ScrollReveal from '@/Utils/ScrollReveal';
import styles from './Home.module.css';

export default function HomePage({ auth, laravelVersion, phpVersion, heroImages = [], featuredProducts = [], collectionImages = [] }) {
    // Initialize smooth scroll
    useLenisScroll();

    const collections = [
        { title: 'PARA ELLA.', img: 'https://res.cloudinary.com/dquwonjie/image/upload/v1771865798/platanomelon-sexualidad-sin-tabues-1024x767_d9nufa.jpg', desc: 'Diseños ergonómicos y texturas premium.', link: route('products.index', { category: 'para-ella' }) },
        { title: 'PARA ÉL.', img: 'https://res.cloudinary.com/dquwonjie/image/upload/v1771865798/juguetes-sexuales-platanomelon_nlqjcv.jpg', desc: 'Innovación masculina redefinida.', link: route('products.index', { category: 'para-el' }) },
        { title: 'PAREJAS.', img: 'https://res.cloudinary.com/dquwonjie/image/upload/v1771866759/Julia_Platanomelon_900-1024x512_tycrzc.jpg', desc: 'Juguetes diseñados para compartir.', link: route('products.index', { category: 'parejas' }) },
        { title: 'EXPERIENCIAS.', img: 'https://res.cloudinary.com/dquwonjie/image/upload/v1771866855/Julia_Platanomelon_910_ALTA-copia-1024x512_vnsnhs.jpg', desc: 'Kits curados para despertar los sentidos.', link: route('products.index', { category: 'experiencias' }) }
    ];

    const benefits = [
        { title: 'Por qué elegirnos', img: 'https://res.cloudinary.com/dquwonjie/image/upload/v1771237740/eroteca_plugs_q8kgy8.webp', desc: 'Diseños exclusivos que rompen moldes.' },
        { title: 'Envío Discreto', img: 'https://res.cloudinary.com/dquwonjie/image/upload/v1771237736/claim-envios-img_ljob1v.webp', desc: 'Paquetes discretos para tu total privacidad.' },
        { title: 'Garantía MiKiwi', img: 'https://res.cloudinary.com/dquwonjie/image/upload/v1771237736/claim-garantia-img_e0t3s2.webp', desc: 'Comprometidos con la calidad de nuestras piezas.' },
        { title: 'Calidad Premium', img: 'https://res.cloudinary.com/dquwonjie/image/upload/v1771238940/portadaplatanomelon-1547046722_iqly7v.avif', desc: 'Fabricación con los mejores estándares.' }
    ];

    return (
        <div className={`${styles.page} select-none cursor-default`}>
            <Head title="MiKiwi | Ingeniería Sensorial y Diseño Exclusivo" />
            <Header />

            <main>
                {/* --- Hero Section --- */}
                <section className={styles.heroSection}>
                    <div className={styles.heroMainContent}>
                        {/* Wrapper for text and logo to handle split layout on desktop */}
                        <div className={styles.heroSplit}>
                            {/* Brand Logo - appearing first on mobile, right on desktop */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 1.2, ease: "easeOut" }}
                                className={styles.heroBrandLogo}
                            >
                                <img src="/assets/icons/mikiwi_logo.svg" alt="MiKiwi Logo" className={styles.heroBrandLogoImage} />
                            </motion.div>

                            {/* Actions & Slogan - appearing second on mobile, left on desktop */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.6 }}
                                className={styles.heroTextSide}
                            >
                                <h1 className={styles.heroSlogan}>
                                    Ingeniería sensorial + diseño<br />
                                    exclusivo para elevar tu placer.
                                </h1>
                                <div className={styles.heroCtaBox}>
                                    <Link href={route('register')} className={styles.pillButton}>
                                        ÚNETE A MIKIWI
                                    </Link>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* --- Keywords Section --- */}
                <ScrollReveal direction="right" distance={50} delay={0.2}>
                    <div className={styles.workSection}>
                        <p className={styles.workKeywords}>
                            Diseño Propio.<br />
                            Fabricación Española.<br />
                            Calidad Premium.<br />
                            Bienestar Sexual.
                        </p>
                    </div>
                </ScrollReveal>

                {/* --- Benefits Section (Por qué elegirnos) --- */}
                <section className={styles.benefitsSection}>
                    <div className={styles.benefitsGrid}>
                        {benefits.map((benefit, i) => (
                            <ScrollReveal key={i} direction="up" delay={i * 0.15}>
                                <div className={styles.benefitCard}>
                                    <div className={styles.benefitImageWrap}>
                                        <img src={benefit.img} alt={benefit.title} className={styles.benefitImage} />
                                    </div>
                                    <h3 className={styles.benefitTitle}>{benefit.title}</h3>
                                    <p className={styles.benefitDescription}>{benefit.desc}</p>
                                </div>
                            </ScrollReveal>
                        ))}
                    </div>
                </section>

                {/* --- Quiz Section --- */}
                <ScrollReveal direction="up">
                    <CalibrationSection calibrationImages={heroImages.filter(img => img.type === 'calibration')} />
                </ScrollReveal>

                {/* --- Featured Products --- */}
                <ScrollReveal direction="left" distance={60}>
                    <FeaturedProductsSection featuredProducts={featuredProducts} />
                </ScrollReveal>

                {/* --- Collection Grid --- */}
                <section className={styles.methodSection}>
                    <ScrollReveal direction="right">
                        <div className={styles.methodHeader}>
                            <h2 className={styles.methodTitle}>Colecciones.</h2>
                            <div className={styles.methodHeaderText}>
                                <p className={styles.methodDescription}>Universos sensoriales cuidadosamente curados por MiKiwi.</p>
                                <Link href={route('products.index')} className={styles.pillButton}>Ver todas</Link>
                            </div>
                        </div>
                    </ScrollReveal>

                    <div className={styles.collectionGrid}>
                        {collections.map((col, i) => (
                            <ScrollReveal key={i} direction="left" delay={i * 0.1} distance={30}>
                                <Link href={col.link} className={styles.collectionItem}>
                                    <div className={styles.collectionImageBox}>
                                        <img src={col.img} alt={col.title} className={styles.collectionImage} />
                                    </div>
                                    <h3 className={styles.collectionTitle}>{col.title}</h3>
                                </Link>
                            </ScrollReveal>
                        ))}
                    </div>
                </section>


                {/* --- Doll Customization Teaser --- */}
                <section className={styles.teaserSection}>
                    {/* Background Overlay with requested image and transparency */}
                    <div className={styles.teaserBgOverlay}>
                        <img
                            src="https://res.cloudinary.com/dquwonjie/image/upload/v1771872987/46bfb4f33999ce12ffa791b9df263c4f_vuktao.jpg"
                            alt="Background Modelo"
                            className={styles.teaserBgImage}
                        />
                        <div className={styles.teaserGradient}></div>
                    </div>

                    <div className={styles.teaserContent}>
                        <ScrollReveal direction="right" distance={40}>
                            <span className={styles.teaserTag}>Personalización Avanzada</span>
                            <h2 className={styles.teaserTitle}>
                                CREA TU<br />PROPIA MODELO.
                            </h2>
                        </ScrollReveal>

                        <ScrollReveal direction="left" distance={40} delay={0.2}>
                            <p className={styles.teaserText}>
                                Accede a nuestro configurador biométrico de alta fidelidad. Define cada detalle, textura y polímero de tu compañera ideal.
                            </p>
                        </ScrollReveal>

                        <ScrollReveal direction="up" delay={0.4}>
                            <Link href={route('doll.config.test')} className={styles.pillButton}>
                                LANZAR CONFIGURADOR
                            </Link>
                        </ScrollReveal>
                    </div>
                </section>

                {/* --- Atelier & Gallery --- */}

                {/* SEO Text Removed */}
            </main>

            <Footer />
        </div>
    );
}
