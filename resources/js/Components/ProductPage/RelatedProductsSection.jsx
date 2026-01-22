import ProductGridSection from './ProductGridSection';
import ProductCarousel from './ProductCarousel';

export default function RelatedProductsSection() {
    return (
        <div className="w-full">
            {/* Recommendations Section: Vertical Layout */}
            <ProductGridSection title="Productos similares">
                <ProductCarousel />
            </ProductGridSection>

        </div>
    );
}
