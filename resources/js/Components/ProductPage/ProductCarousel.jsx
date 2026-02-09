import ProductCard from './ProductCard';

export default function ProductCarousel() {
    return (
        <div className="w-full flex gap-4 overflow-x-auto px-4 pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
            {/* ProductCarousel Container */}
            <ProductCard />
            <ProductCard />
            <ProductCard />
            <ProductCard />
            <ProductCard />
        </div>
    );
}
