import React from 'react';
import { Head } from '@inertiajs/react';
import {
    Header,
    Footer,
    ProductShowcase,
    RelatedProductsSection
} from '@/Components';

export default function ProductPage({ product, accessories, relatedProducts }) {
    return (
        <div className="min-h-screen flex flex-col bg-white text-gray-900 font-sans select-none cursor-default">
            <Head title={`${product?.name || 'Producto'} - MiKiwi`} />

            <Header />

            <main className="flex-grow">
                <ProductShowcase product={product} />
                <RelatedProductsSection relatedProducts={relatedProducts} />
            </main>

            <Footer />
        </div>
    );
}
