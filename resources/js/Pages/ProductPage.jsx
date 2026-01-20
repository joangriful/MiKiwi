import React from 'react';
import { Head } from '@inertiajs/react';
import {
    Header,
    Footer,
    ImageCarouselVertical,
    MainProductImage,
    ProductInfo,
    ProductGridSection,
    ProductCarousel
} from '@/Components';

export default function ProductPage() {
    return (
        <div className="min-h-screen flex flex-col bg-white text-gray-900 font-sans select-none cursor-default">
            <Head title="Product Page" />

            <Header />

            <main className="flex-grow">
                {/* Visualizador Section: Horizontal Layout */}
                <section className="flex flex-row h-[600px] mb-12 bg-green-50">
                    {/* Left: Thumbnails */}
                    <ImageCarouselVertical />

                    {/* Shared Background Group */}
                    <div className="flex-1 flex flex-row">
                        {/* Center: Main Image */}
                        <div className="flex-1">
                            <MainProductImage />
                        </div>

                        {/* Right: Info */}
                        <div className="w-1/3 min-w-[300px]">
                            <ProductInfo />
                        </div>
                    </div>
                </section>

                <div className="container mx-auto px-4">
                    {/* Recommendations Section: Vertical Layout */}
                    <ProductGridSection title="Productos similares">
                        <ProductCarousel />
                    </ProductGridSection>


                </div>
            </main>

            <Footer />
        </div>
    );
}
