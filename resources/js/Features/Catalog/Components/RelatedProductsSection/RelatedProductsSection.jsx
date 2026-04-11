import ProductGridSection from '../ProductGridSection/ProductGridSection';
import ProductCarousel from '../ProductCarousel/ProductCarousel';
import './RelatedProductsSection.css';

export default function RelatedProductsSection({ relatedProducts = [] }) {
    return (
        <div className="w-full">
            {/* Recommendations Section: Vertical Layout */}
            <ProductGridSection title="Productos similares">
                <ProductCarousel products={relatedProducts} />
            </ProductGridSection>

        </div>
    );
}
