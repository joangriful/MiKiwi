import ProductImagePlaceholder from './ProductImagePlaceholder';
import ProductCardInfo from './ProductCardInfo';

export default function ProductCard() {
    return (
        <div className="w-[321px] h-[616px] flex flex-col bg-white group box-border relative shrink-0">
            {/* Product Card */}
            <ProductImagePlaceholder />
            <ProductCardInfo />
        </div>
    );
}
