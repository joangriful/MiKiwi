import ProductCard from './ProductCard';

export default function ProductCarousel() {
    const mockProduct = {
        name: 'Kiwi Pack Premium',
        description: 'Kiwis frescos selección premium. Directos de nuestros huertos a tu mesa.',
        base_price: 14.99,
        image_url: '/assets/images/products/kiwi-pack.jpg', // Ensure this path is valid or use a placeholder
        slug: 'kiwi-pack-premium'
    };

    return (
        <div className="w-full flex gap-4 overflow-x-auto px-4 pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
            {/* ProductCarousel Container */}
            <ProductCard product={mockProduct} />
            <ProductCard product={mockProduct} />
            <ProductCard product={mockProduct} />
            <ProductCard product={mockProduct} />
            <ProductCard product={mockProduct} />
        </div>
    );
}
