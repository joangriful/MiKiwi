import React from 'react';
import { Head } from '@inertiajs/react';
import {
    Header,
    Footer,
    ProductShowcase,
    RelatedProductsSection
} from '@/Components';

export default function ProductPage() {
    return (
        <div className="min-h-screen flex flex-col bg-white text-gray-900 font-sans select-none cursor-default">
            <Head title="Kiwi Premium - MiKiwi" />

            <Header />

            <main className="flex-grow">
                <ProductShowcase />
                <RelatedProductsSection />
            </main>

            <Footer />
        </div>
    );
}
