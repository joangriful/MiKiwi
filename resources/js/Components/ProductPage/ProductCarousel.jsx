import ProductCard from './ProductCard';

export default function ProductCarousel() {
    return (
        <div className="flex gap-4 overflow-x-auto border-2 border-dashed border-pink-500 bg-pink-50 p-4">
            {/* ProductCarousel Container */}
            <ProductCard />
            <ProductCard />
            <ProductCard />
        </div>
    );
}
