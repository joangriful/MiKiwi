import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';

import { Header, Footer } from '@/Components';
import HeroSection from '@/Features/Home/Components/Sections/HeroSection/HeroSection';
import CalibrationSection from '@/Features/Home/Components/Sections/CalibrationSection/CalibrationSection';
import FeaturedProductsSection from '@/Features/Home/Components/Sections/FeaturedProductsSection/FeaturedProductsSection';
import CollectionsSection from '@/Features/Home/Components/Sections/CollectionsSection/CollectionsSection';
import useLenisScroll from '@/Features/Home/hooks/useLenisScroll';
import ScrollReveal from '@/Features/Home/utils/ScrollReveal';
import './Home.css';

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
        <div className="home-container select-none cursor-default">
            <Head title="MiKiwi | Ingeniería Sensorial y Diseño Exclusivo" />
            <Header />

            <main>
                {/* --- Hero Section --- */}
                <section className="hero-minimal hero-v2">
                    <div className="hero-main-content">
                        {/* Wrapper for text and logo to handle split layout on desktop */}
                        <div className="hero-split-container">
                            {/* Brand Logo - appearing first on mobile, right on desktop */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 1.2, ease: "easeOut" }}
                                className="hero-brand-logo"
                            >
                                <img src="/assets/icons/mikiwi_logo.svg" alt="MiKiwi Logo" />
                            </motion.div>

                            {/* Actions & Slogan - appearing second on mobile, left on desktop */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.6 }}
                                className="hero-text-side"
                            >
                                <h1 className="hero-slogan">
                                    Ingeniería sensorial + diseño<br />
                                    exclusivo para elevar tu placer.
                                </h1>
                                <div className="hero-cta-box">
                                    <Link href={route('register')} className="btn-pill btn-hover-effect">
                                        ÚNETE A MIKIWI
                                    </Link>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* --- Keywords Section --- */}
                <ScrollReveal direction="right" distance={50} delay={0.2}>
                    <div className="work-section">
                        <p className="work-keywords">
                            Diseño Propio.<br />
                            Fabricación Española.<br />
                            Calidad Premium.<br />
                            Bienestar Sexual.
                        </p>
                    </div>
                </ScrollReveal>

                {/* --- Benefits Section (Por qué elegirnos) --- */}
                <section className="benefits-section">
                    <div className="benefits-grid">
                        {benefits.map((benefit, i) => (
                            <ScrollReveal key={i} direction="up" delay={i * 0.15}>
                                <div className="benefit-card">
                                    <div className="benefit-img">
                                        <img src={benefit.img} alt={benefit.title} />
                                    </div>
                                    <h3 className="uppercase tracking-widest text-sm mb-2">{benefit.title}</h3>
                                    <p>{benefit.desc}</p>
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
                <section className="method-section">
                    <ScrollReveal direction="right">
                        <div className="method-header">
                            <h2>Colecciones.</h2>
                            <div>
                                <p>Universos sensoriales cuidadosamente curados por MiKiwi.</p>
                                <Link href={route('products.index')} className="btn-pill">Ver todas</Link>
                            </div>
                        </div>
                    </ScrollReveal>

                    <div className="collection-grid-new">
                        {collections.map((col, i) => (
                            <ScrollReveal key={i} direction="left" delay={i * 0.1} distance={30}>
                                <Link href={col.link} className="collection-item-new group">
                                    <div className="collection-img-box rounded-2xl">
                                        <img src={col.img} alt={col.title} />
                                    </div>
                                    <h3 className="mt-4">{col.title}</h3>
                                </Link>
                            </ScrollReveal>
                        ))}
                    </div>
                </section>


                {/* --- Doll Customization Teaser --- */}
                <section className="doll-teaser-section relative bg-white">
                    {/* Background Overlay with requested image and transparency */}
                    <div className="teaser-bg-overlay absolute inset-0 z-0">
                        <img
                            src="https://res.cloudinary.com/dquwonjie/image/upload/v1771872987/46bfb4f33999ce12ffa791b9df263c4f_vuktao.jpg"
                            alt="Background Modelo"
                            className="w-full h-full object-cover object-center opacity-[0.4] filter blur-[0.5px]"
                        />
                        {/* 
                          Full-width gradient overlay to "cover" the photo more. 
                          Starts solid white and fades out but keeps a white tint. 
                        */}
                        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/60 to-white/20"></div>
                    </div>

                    <div className="teaser-content relative z-10">
                        <ScrollReveal direction="right" distance={40}>
                            <span className="font-sugo text-pink-500 text-xs tracking-[.3em] uppercase mb-4 block">Personalización Avanzada</span>
                            <h2 className="font-sugo text-black text-5xl md:text-8xl font-black uppercase leading-[0.85] mb-8 tracking-widest">
                                CREA TU<br />PROPIA MODELO.
                            </h2>
                        </ScrollReveal>

                        <ScrollReveal direction="left" distance={40} delay={0.2}>
                            <p className="text-black/60 max-w-lg text-lg mb-10 font-light">
                                Accede a nuestro configurador biométrico de alta fidelidad. Define cada detalle, textura y polímero de tu compañera ideal.
                            </p>
                        </ScrollReveal>

                        <ScrollReveal direction="up" delay={0.4}>
                            <Link href={route('doll.config.test')} className="btn-pill">
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

