import ProductShowcase from '@/Components/Catalog/ProductShowcase/ProductShowcase';
import RelatedProductsSection from '@/Components/Catalog/RelatedProductsSection/RelatedProductsSection';
import styles from './ProductDetailContent.module.css';

export default function ProductDetailContent({ product, relatedProducts = [] }) {
    return (
        <main className={styles.root}>
            <ProductShowcase product={product} />
            <RelatedProductsSection relatedProducts={relatedProducts} />
        </main>
    );
}
