import { Head } from '@inertiajs/react';
import Header from '@/Components/Header/Header';
import Footer from '@/Components/Footer/Footer';
import ProductDetailContent from '@/Components/Catalog/ProductDetailContent/ProductDetailContent';
import styles from './ProductPage.module.css';

function ProductPageFrame({ children, withChrome = true }) {
    return (
        <div className={styles.root}>
            {withChrome && <Header />}

            {children}

            {withChrome && <Footer />}
        </div>
    );
}

export default function ProductPage({ product, relatedProducts }) {
    return (
        <ProductPageFrame>
            <Head title={`${product?.name || 'Producto'} - MiKiwi`} />
            <ProductDetailContent
                product={product}
                relatedProducts={relatedProducts}
            />
        </ProductPageFrame>
    );
}

// Version for Components Manager preview (without Header/Footer that need Inertia context)
export function ProductPagePreview({ product, relatedProducts }) {
    return (
        <ProductPageFrame withChrome={false}>
            <ProductDetailContent
                product={product}
                relatedProducts={relatedProducts}
            />
        </ProductPageFrame>
    );
}
