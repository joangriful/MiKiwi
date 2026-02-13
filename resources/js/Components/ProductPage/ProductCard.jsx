import { useState } from 'react';
import ProductImagePlaceholder from './ProductImagePlaceholder';
import ProductCardInfo from './ProductCardInfo';
import { Link } from '@inertiajs/react';

export default function ProductCard({ product }) {
    const [isLiked, setIsLiked] = useState(false);

    return (
        <Link href={route('products.show', product.slug)} className="w-[321px] h-[616px] flex flex-col bg-white group box-border relative shrink-0 transition-shadow hover:shadow-lg rounded-lg overflow-hidden border border-gray-100">
            {/* Product Card */}
            <div className="relative h-[381px] bg-gray-50 flex items-center justify-center overflow-hidden">
                {product.image_url ? (
                    <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <ProductImagePlaceholder />
                )}

                <button
                    onClick={(e) => {
                        e.preventDefault(); // Prevent navigation when clicking like
                        setIsLiked(!isLiked);
                    }}
                    className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center transition-transform hover:scale-110 active:scale-95 bg-white/80 rounded-full shadow-sm backdrop-blur-sm"
                >
                    <div
                        className={`w-5 h-5 transition-colors duration-200 ${isLiked ? 'bg-red-500' : 'bg-gray-400 hover:bg-red-400'}`}
                        style={{
                            maskImage: `url('/assets/icons/${isLiked ? 'MdiCardsHeart.svg' : 'MdiCardsHeartOutline.svg'}')`,
                            maskSize: 'contain',
                            maskRepeat: 'no-repeat',
                            maskPosition: 'center',
                            WebkitMaskImage: `url('/assets/icons/${isLiked ? 'MdiCardsHeart.svg' : 'MdiCardsHeartOutline.svg'}')`,
                            WebkitMaskSize: 'contain',
                            WebkitMaskRepeat: 'no-repeat',
                            WebkitMaskPosition: 'center',
                        }}
                    ></div>
                </button>
            </div>
            <ProductCardInfo
                name={product.name}
                description={product.description}
                price={product.base_price}
            />
        </Link>
    );
}
