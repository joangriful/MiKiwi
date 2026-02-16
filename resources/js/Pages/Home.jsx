import { Head } from '@inertiajs/react';
import { Header, Footer } from '@/Components';
import HeroSection from '@/Components/Home/Sections/HeroSection';
import CalibrationSection from '@/Components/Home/Sections/CalibrationSection';
import FeaturedProductsSection from '@/Components/Home/Sections/FeaturedProductsSection';
import PremiumAtelierSection from '@/Components/Home/Sections/PremiumAtelierSection';
import CollectionsSection from '@/Components/Home/Sections/CollectionsSection';
import ImmersiveGallerySection from '@/Components/Home/Sections/ImmersiveGallerySection';
import useLenisScroll from '@/Components/Home/hooks/useLenisScroll';
import useScrollAnimations from '@/Components/Home/hooks/useScrollAnimations';
import '@/Components/Home/Home.css';

export default function HomePage({ auth, laravelVersion, phpVersion }) {
    // Initialize smooth scroll
    useLenisScroll();

    // Initialize scroll-based animations
    useScrollAnimations();

    return (
        <div className="min-h-screen flex flex-col bg-white text-gray-900 font-sans select-none cursor-default">
            <Head title="MiKiwi | V6 Global Sensory Luxury" />
            <Header />
            <main className="flex-grow home-container">
                <HeroSection />
                <CalibrationSection />
                <FeaturedProductsSection />
                <PremiumAtelierSection />
                <CollectionsSection />
                <ImmersiveGallerySection />
            </main>
            <Footer />
        </div>
    );
}
