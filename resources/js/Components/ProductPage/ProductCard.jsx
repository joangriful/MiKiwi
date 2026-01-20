import ProductImagePlaceholder from './ProductImagePlaceholder';
import ProductCardInfo from './ProductCardInfo';

export default function ProductCard() {
    return (
        <div className="min-w-[200px] border-2 border-dashed border-red-500 bg-red-50 p-2">
            {/* Product Card */}
            <ProductImagePlaceholder />
            <ProductCardInfo />
        </div>
    );
}
