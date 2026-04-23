import { forwardRef } from 'react';
import ProductCard from '../ProductCard/ProductCard';
import styles from './ProductCarousel.module.css';

const ProductCarousel = forwardRef(function ProductCarousel({ products = [] }, ref) {
    return (
        <div
            ref={ref}
            className={`${styles.root} ${products.length < 3 ? styles.rootCentered : ''}`}
        >
            {products && products.length > 0 ? (
                products.map((product, index) => (
                    <ProductCard key={product.slug || index} product={product} />
                ))
            ) : (
                <div className={styles.emptyState}>
                    Sin productos relacionados
                </div>
            )}
        </div>
    );
});

export default ProductCarousel;
