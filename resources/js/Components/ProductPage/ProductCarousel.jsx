import ProductCard from './ProductCard';

export default function ProductCarousel({ products = [] }) {
    return (
        <div className="w-full grid grid-cols-1 md:flex md:gap-4 md:overflow-x-auto px-4 pb-4 md:[&::-webkit-scrollbar]:hidden md:[-ms-overflow-style:'none'] md:[scrollbar-width:'none'] gap-6">
            {/* ProductCarousel Container */}
            {products && products.length > 0 ? (
                products.map((product, index) => (
                    <div key={product.id || index} className="w-full md:w-auto md:flex-shrink-0">
                        <ProductCard product={product} />
                    </div>
                ))
            ) : (
                <div className="text-gray-400 text-sm py-10 w-full text-center italic">
                    Sin productos relacionados
                </div>
            )}
        </div>
    );
}

