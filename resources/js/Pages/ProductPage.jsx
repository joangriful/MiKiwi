import React from 'react';
import { Head } from '@inertiajs/react';
import {
    Header,
    Footer,
    ProductShowcase,
    RelatedProductsSection
} from '@/Components';

export default function ProductPage({ product, relatedProducts }) {
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

// Version for Components Manager preview (without Header/Footer that need Inertia context)
export function ProductPagePreview({ product, relatedProducts }) {
    return (
        <div className="min-h-screen flex flex-col bg-white text-gray-900 font-sans select-none cursor-default">
            <main className="flex-grow">
                <ProductShowcase product={product} />
                <RelatedProductsSection relatedProducts={relatedProducts} />
            </main>
        </div>
    );
}
