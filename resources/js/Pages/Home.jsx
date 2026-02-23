import { Head } from '@inertiajs/react';
import { Header, Footer, SubHeader } from '@/Components';
import HeroSection from '@/Components/Home/Sections/HeroSection';
import CalibrationSection from '@/Components/Home/Sections/CalibrationSection';
import FeaturedProductsSection from '@/Components/Home/Sections/FeaturedProductsSection';
import PremiumAtelierSection from '@/Components/Home/Sections/PremiumAtelierSection';
import CollectionsSection from '@/Components/Home/Sections/CollectionsSection';
import ImmersiveGallerySection from '@/Components/Home/Sections/ImmersiveGallerySection';
import SeoTextSection from '@/Components/Home/Sections/SeoTextSection';
import DollsSection from '@/Components/Home/Sections/DollsSection';
import useLenisScroll from '@/Components/Home/hooks/useLenisScroll';
import useScrollAnimations from '@/Components/Home/hooks/useScrollAnimations';
import '@/Components/Home/Home.css';

export default function HomePage({ auth, laravelVersion, phpVersion, heroImages = [], featuredProducts = [], collectionImages = [] }) {
    // Initialize smooth scroll
    useLenisScroll();

    // Initialize scroll-based animations
    useScrollAnimations();

    return (
        <div className="min-h-screen flex flex-col bg-white text-gray-900 font-sans select-none cursor-default">
            <Head title="MiKiwi | V6 Global Sensory Luxury" />
            <Header />
            <SubHeader transparent={true} textBlack={true} />
            <main className="flex-grow home-container">
                <HeroSection heroImages={heroImages.filter(img => img.type === 'home')} />
                <FeaturedProductsSection featuredProducts={featuredProducts} />
                <CollectionsSection collectionImages={collectionImages} />
                <DollsSection dollsImages={heroImages.filter(img => img.type === 'dolls')} />
                <CalibrationSection calibrationImages={heroImages.filter(img => img.type === 'calibration')} />
                <PremiumAtelierSection />
                <ImmersiveGallerySection />
            <SeoTextSection />
            </main>
            <Footer />
        </div>
    );
}
