import ProductGridSection from '../ProductGridSection/ProductGridSection';
import ProductCarousel from '../ProductCarousel/ProductCarousel';
import styles from './RelatedProductsSection.module.css';

export default function RelatedProductsSection({ relatedProducts = [] }) {
    return (
        <div className={styles.root}>
            <ProductGridSection title="Productos similares">
                <ProductCarousel products={relatedProducts} />
            </ProductGridSection>
        </div>
    );
}
