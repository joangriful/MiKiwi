import ProductGridSection from './ProductGridSection';
import ProductCarousel from './ProductCarousel';

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
