import React from 'react';
import { Head } from '@inertiajs/react';
import ProductShowcase from '@/Components/Catalog/ProductShowcase/ProductShowcase';
import RelatedProductsSection from '@/Components/Catalog/RelatedProductsSection/RelatedProductsSection';
import styles from './ProductPage.module.css';

export default function ProductPage({ product, accessories, relatedProducts }) {
    return (
        <div className={`${styles.root} min-h-screen flex flex-col bg-white text-gray-900 font-sans select-none cursor-default`}>
            <Head title={`${product?.name || 'Producto'} - MiKiwi`} />

            <main className="flex-grow">
                <ProductShowcase product={product} />
                <RelatedProductsSection relatedProducts={relatedProducts} />
            </main>
        </div>
    );
}

// Version for Components Manager preview (without Header/Footer that need Inertia context)
export function ProductPagePreview({ product, accessories, relatedProducts }) {
    return (
        <div className={`${styles.root} min-h-screen flex flex-col bg-white text-gray-900 font-sans select-none cursor-default`}>
            <main className="flex-grow">
                <ProductShowcase product={product} />
                <RelatedProductsSection relatedProducts={relatedProducts} />
            </main>
        </div>
    );
}
