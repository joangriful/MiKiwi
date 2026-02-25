import ProductCard from './ProductCard';

export default function ProductCarousel({ products = [] }) {
    return (
        <div className={`w-full flex gap-6 overflow-x-auto px-6 pt-10 pb-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] ${products.length < 3 ? 'md:justify-center' : ''}`}>
            {/* ProductCarousel Container */}
            {products && products.length > 0 ? (
                products.map((product, index) => (
                    <ProductCard key={product.id || index} product={product} />
                ))
            ) : (
                <div className="text-gray-400 text-sm py-10 w-full text-center italic">
                    Sin productos relacionados
                </div>
            )}
        </div>
    );
}

