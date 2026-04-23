import ProductCard from '@/Components/Catalog/ProductCard/ProductCard';
import styles from './CatalogProductGrid.module.css';

export default function CatalogProductGrid({ products = [] }) {
    return (
        <div className={styles.root}>
            {products.map((product, index) => (
                <div
                    key={product.slug || `product-${index}`}
                    className={styles.item}
                    style={{ animationDelay: `${index * 100}ms` }}
                >
                    <ProductCard product={product} />
                </div>
            ))}
        </div>
    );
}
