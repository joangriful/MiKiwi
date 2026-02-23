import { Head, Link } from '@inertiajs/react';
import { Header, Footer } from '@/Components';
import HeroSection from '@/Components/Home/Sections/HeroSection';
import CalibrationSection from '@/Components/Home/Sections/CalibrationSection';
import FeaturedProductsSection from '@/Components/Home/Sections/FeaturedProductsSection';
import PremiumAtelierSection from '@/Components/Home/Sections/PremiumAtelierSection';
import CollectionsSection from '@/Components/Home/Sections/CollectionsSection';
import ImmersiveGallerySection from '@/Components/Home/Sections/ImmersiveGallerySection';
import SeoTextSection from '@/Components/Home/Sections/SeoTextSection';
import DollsSection from '@/Components/Home/Sections/DollsSection';
import useLenisScroll from '@/Components/Home/hooks/useLenisScroll';
import './Home.css';

export default function HomePage({ auth, laravelVersion, phpVersion, heroImages = [], featuredProducts = [], collectionImages = [] }) {
    // Initialize smooth scroll
    useLenisScroll();

    const collections = [
        { title: 'Para Ella.', img: '/images/collections/collection_ella.png', desc: 'Diseños ergonómicos y texturas premium.', link: '#' },
        { title: 'Para Él.', img: '/images/collections/collection_el.png', desc: 'Innovación masculina redefinida.', link: '#' },
        { title: 'Parejas.', img: '/images/collections/collection_parejas.png', desc: 'Juguetes diseñados para compartir.', link: '#' },
        { title: 'Experiencias.', img: '/images/collections/collection_experiencias.png', desc: 'Kits curados para despertar los sentidos.', link: '#' }
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
                <section className="hero-minimal">
                    <div className="hero-top-nav">
                        <img src="/assets/icons/mikiwi_logo.svg" alt="MiKiwi Logo" className="hero-logo-small" />
                        <Link href={route('register')} className="btn-pill">
                            Únete a MIKIWI
                        </Link>
                    </div>

                    <div className="hero-bottom">
                        <p className="hero-subtitle">
                            Ingeniería sensorial + diseño<br />
                            exclusivo para elevar tu placer.
                        </p>
                        <Link href={route('products.index')} className="btn-pill">
                            Explorar catálogo
                        </Link>
                    </div>
                </section>

                {/* --- Keywords Section --- */}
                <div className="work-section">
                    <p className="work-keywords">
                        Diseño Propio.<br />
                        Fabricación Española.<br />
                        Calidad Premium.<br />
                        Bienestar Sexual.
                    </p>
                </div>

                {/* --- Benefits Section (Por qué elegirnos) --- */}
                <section className="benefits-section">
                    <div className="benefits-grid">
                        {benefits.map((benefit, i) => (
                            <div key={i} className="benefit-card">
                                <div className="benefit-img">
                                    <img src={benefit.img} alt={benefit.title} />
                                </div>
                                <h3 className="uppercase tracking-widest text-sm mb-2">{benefit.title}</h3>
                                <p>{benefit.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* --- Quiz Section --- */}
                <CalibrationSection calibrationImages={heroImages.filter(img => img.type === 'calibration')} />

                {/* --- Featured Products --- */}
                <FeaturedProductsSection featuredProducts={featuredProducts} />

                {/* --- Collection Grid --- */}
                <section className="method-section">
                    <div className="method-header">
                        <h2>Colecciones.</h2>
                        <div>
                            <p>Universos sensoriales cuidadosamente curados por MiKiwi.</p>
                            <Link href={route('products.index')} className="btn-pill" style={{ borderColor: 'white', color: 'white' }}>Ver todas</Link>
                        </div>
                    </div>

                    <div className="collection-grid-new">
                        {collections.map((col, i) => (
                            <div key={i} className="collection-item-new">
                                <div className="collection-img-box">
                                    <img src={col.img} alt={col.title} />
                                </div>
                                <h3>{col.title}</h3>
                                <Link href={col.link} className="collection-link-new">Explorar →</Link>
                            </div>
                        ))}
                    </div>
                </section>

                {/* --- Dolls Section --- */}
                <DollsSection dollsImages={heroImages.filter(img => img.type === 'dolls')} />

                {/* --- Atelier & Gallery --- */}
                <PremiumAtelierSection />
                <ImmersiveGallerySection />

                {/* --- FAQ/SEO Section --- */}
                <SeoTextSection />
            </main>

            <Footer />
        </div>
    );
}
