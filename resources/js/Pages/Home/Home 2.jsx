import { Head } from '@inertiajs/react';

import Header from '@/Components/Header/Header';
import Footer from '@/Components/Footer/Footer';
import BenefitsSection from '@/Components/Home/BenefitsSection/BenefitsSection';
import CalibrationSection from '@/Components/Home/CalibrationSection/CalibrationSection';
import CollectionsSection from '@/Components/Home/CollectionsSection/CollectionsSection';
import DollTeaserSection from '@/Components/Home/DollTeaserSection/DollTeaserSection';
import FeaturedProductsSection from '@/Components/Home/FeaturedProductsSection/FeaturedProductsSection';
import HeroSection from '@/Components/Home/HeroSection/HeroSection';
import KeywordsSection from '@/Components/Home/KeywordsSection/KeywordsSection';
import useLenisScroll from '@/Hooks/useLenisScroll';
import ScrollReveal from '@/Utils/ScrollReveal';
import styles from './Home.module.css';

export default function HomePage({ heroImages = [], featuredProducts = [], collectionImages = [] }) {
    useLenisScroll();

    return (
        <div className={styles.page}>
            <Head title="MiKiwi | Ingeniería Sensorial y Diseño Exclusivo" />
            <Header />

            <main>
                <HeroSection />
                <KeywordsSection />
                <BenefitsSection />

                <ScrollReveal direction="up">
                    <CalibrationSection calibrationImages={heroImages.filter((image) => image.type === 'calibration')} />
                </ScrollReveal>

                <ScrollReveal direction="left" distance={60}>
                    <FeaturedProductsSection featuredProducts={featuredProducts} />
                </ScrollReveal>

                <CollectionsSection collectionImages={collectionImages} />
                <DollTeaserSection />
            </main>

            <Footer />
        </div>
    );
}
