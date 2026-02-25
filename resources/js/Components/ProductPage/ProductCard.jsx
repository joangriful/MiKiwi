import { useState } from 'react';
import ProductImagePlaceholder from './ProductImagePlaceholder';
import ProductCardInfo from './ProductCardInfo';
import { Link } from '@inertiajs/react';

export default function ProductCard({ product }) {
    const [isLiked, setIsLiked] = useState(false);

    if (!product) return null;

    return (
        <Link
            href={route('products.show', product.slug)}
            className="w-full h-full flex flex-col bg-white group relative transition-all duration-500 hover:-translate-y-4 hover:scale-[1.01] border-2 border-[#fec0d5]/60 hover:border-[#fec0d5] hover:shadow-[0_30px_60px_rgba(254,192,213,0.3)] rounded-[32px] p-4 flex-shrink-0 min-w-[280px] sm:min-w-[320px] md:min-w-0"
        >
            {/* Image Container */}
            <div className="relative aspect-[4/5] bg-[#F7F7F7] rounded-2xl overflow-hidden mb-4">
                {product.image_url ? (
                    <>
                        <img
                            src={product.image_url}
                            alt={product.name}
                            className={`w-full h-full object-cover transition-transform duration-700 ${!product.hover_image_url ? 'group-hover:scale-105' : ''}`}
                        />
                        {product.hover_image_url && (
                            <img
                                src={product.hover_image_url}
                                alt={`${product.name} hover`}
                                className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                            />
                        )}
                    </>
                ) : (
                    <ProductImagePlaceholder />
                )}

                {/* Like Button */}
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        setIsLiked(!isLiked);
                    }}
                    className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center transition-all bg-white/40 hover:bg-white/80 rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100"
                >
                    <div
                        className={`w-5 h-5 transition-colors duration-200 ${isLiked ? 'bg-red-500' : 'bg-gray-800'}`}
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

            {/* Info Section */}
            <div className="flex flex-col space-y-1">
                <div className="flex justify-between items-start">
                    <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wider">{product.name}</h3>
                    <span className="text-sm font-bold text-gray-900">
                        {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(product.base_price)}
                    </span>
                </div>
                <p className="text-xs text-gray-400 line-clamp-1 italic font-light">
                    {product.description || 'Ingeniería sensorial premium'}
                </p>
            </div>
        </Link>
    );
}
