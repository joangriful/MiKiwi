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
        { title: 'Envío discreto', img: '/images/benefits/envio.png', desc: 'Paquetes anónimos y nombres genéricos en los recibos.' },
        { title: 'Garantía 3 años', img: '/images/benefits/garantia.png', desc: 'Disfruta sin preocuparte. Cubrimos cualquier fallo de fábrica.' },
        { title: 'Pago seguro', img: '/images/benefits/pago.png', desc: 'Nuestra página está protegida con certificación SSL.' },
        { title: 'Devolución', img: '/images/benefits/devolucion.png', desc: '¿Era un regalo y no ha gustado? Devuelve tu juguete precintado sin problema.' }
    ];

    return (
        <div className="home-container select-none cursor-default">
            <Head title="MiKiwi | Ingeniería Sensorial y Diseño Exclusivo" />
            <Header />

            <main>
                {/* --- Hero Section --- */}
                <section className="hero-minimal">
                    <img src="/assets/icons/mikiwi_logo.svg" alt="MiKiwi Logo" className="hero-logo-large" />
                    <div className="hero-bottom">
                        <p className="hero-subtitle">
                            Ingeniería sensorial + diseño exclusivo para elevar tu placer.
                        </p>
                        <Link href={route('products.index')} className="btn-pill">
                            Explorar catálogo
                        </Link>
                    </div>
                </section>

                {/* --- Benefits Section (Por qué elegirnos) --- */}
                <section className="benefits-section">
                    <h2>Por qué elegirnos</h2>
                    <div className="benefits-grid">
                        {benefits.map((benefit, i) => (
                            <div key={i} className="benefit-card">
                                <div className="benefit-img">
                                    <img src={benefit.img} alt={benefit.title} />
                                </div>
                                <h3>{benefit.title}</h3>
                                <p>{benefit.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* --- Interstitial Keywords --- */}
                <div className="work-section">
                    <p className="work-keywords">
                        Diseño Propio. Fabricación Española. Calidad Premium. Bienestar Sexual.
                    </p>
                </div>

                {/* --- Featured Products --- */}
                <FeaturedProductsSection featuredProducts={featuredProducts} />

                {/* --- Collection Grid (Static Dark) --- */}
                <section className="method-section">
                    <div className="method-header">
                        <h2>Colecciones.</h2>
                        <div>
                            <p>Universos sensoriales cuidadosamente curados por MiKiwi.</p>
                            <Link href="#" className="btn-pill" style={{ borderColor: 'white', color: 'white' }}>Ver todas</Link>
                        </div>
                    </div>

                    <div className="collection-grid-new">
                        {collections.map((col, i) => (
                            <div key={i} className="collection-item-new">
                                <div className="collection-img-box">
                                    <img src={col.img} alt={col.title} />
                                </div>
                                <h3>{col.title}</h3>
                                <Link href={col.link} className="collection-link-new">Ver más →</Link>
                            </div>
                        ))}
                    </div>
                </section>

                {/* --- Quiz Section --- */}
                <CalibrationSection calibrationImages={heroImages.filter(img => img.type === 'calibration')} />

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
