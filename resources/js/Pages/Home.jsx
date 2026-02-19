import { lazy, Suspense } from 'react';
import { Head } from '@inertiajs/react';
import Header from '@/Components/Common/Header';
import Footer from '@/Components/Common/Footer';
import HeroSection from '@/Components/Home/Sections/HeroSection';
import CalibrationSection from '@/Components/Home/Sections/CalibrationSection';
import useLenisScroll from '@/Components/Home/hooks/useLenisScroll';
import useScrollAnimations from '@/Components/Home/hooks/useScrollAnimations';
import '@/Components/Home/Home.css';

const FeaturedProductsSection = lazy(() => import('@/Components/Home/Sections/FeaturedProductsSection'));
const PremiumAtelierSection = lazy(() => import('@/Components/Home/Sections/PremiumAtelierSection'));
const CollectionsSection = lazy(() => import('@/Components/Home/Sections/CollectionsSection'));
const ImmersiveGallerySection = lazy(() => import('@/Components/Home/Sections/ImmersiveGallerySection'));

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
                <Suspense fallback={null}>
                    <FeaturedProductsSection />
                    <PremiumAtelierSection />
                    <CollectionsSection />
                    <ImmersiveGallerySection />
                </Suspense>
            </main>
            <Footer />
        </div>
    );
}
