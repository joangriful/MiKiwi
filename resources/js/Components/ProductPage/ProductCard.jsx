import ProductImagePlaceholder from './ProductImagePlaceholder';
import ProductCardInfo from './ProductCardInfo';

export default function ProductCard() {
    return (
        <div className="min-w-[240px] border border-gray-100 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
            {/* Product Card */}
            <ProductImagePlaceholder />
            <ProductCardInfo />
        </div>
    );
}
