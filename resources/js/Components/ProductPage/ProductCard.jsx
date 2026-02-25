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
            className="w-full h-full flex flex-col bg-white group relative transition-all duration-500 hover:-translate-y-2 flex-shrink-0 min-w-[280px] sm:min-w-[320px] md:min-w-0 md:max-w-[380px] md:mx-auto overflow-hidden rounded-[24px]"
        >
            {/* Image Container */}
            <div className="relative aspect-[4/5] bg-[#F3F3F3] overflow-hidden">
                {product.image_url ? (
                    <>
                        <img
                            src={product.image_url}
                            alt={product.name}
                            className={`w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 ${!product.hover_image_url ? '' : ''}`}
                        />
                        {product.hover_image_url && (
                            <img
                                src={product.hover_image_url}
                                alt={`${product.name} hover`}
                                className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-1000"
                            />
                        )}
                    </>
                ) : (
                    <ProductImagePlaceholder />
                )}

                {/* Like Button - Minimalist Overlay */}
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        setIsLiked(!isLiked);
                    }}
                    className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center transition-all bg-white/60 hover:bg-white rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100"
                >
                    <div
                        className={`w-5 h-5 transition-colors duration-200 ${isLiked ? 'bg-red-500' : 'bg-black'}`}
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

            {/* Info Section - Minimalist & Prioritizing Text */}
            <div className="flex flex-col pt-6 pb-4 px-2 space-y-2">
                <div className="flex justify-between items-baseline gap-4">
                    <h3 className="text-base font-bold text-black uppercase tracking-widest leading-tight flex-1">{product.name}</h3>
                    <span className="text-base font-medium text-black/80">
                        {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(product.base_price)}
                    </span>
                </div>
                <div className="h-px bg-black/5 w-12 transition-all duration-500 group-hover:w-full" />
                <p className="text-xs text-black/40 line-clamp-2 leading-relaxed transition-colors group-hover:text-black/60">
                    {product.description || 'Ingeniería sensorial premium'}
                </p>
            </div>
        </Link>
    );
}
