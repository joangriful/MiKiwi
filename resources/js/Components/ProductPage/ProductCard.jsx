import { useState } from 'react';
import ProductImagePlaceholder from './ProductImagePlaceholder';
import ProductCardInfo from './ProductCardInfo';

export default function ProductCard() {
    const [isLiked, setIsLiked] = useState(false);

    return (
        <div className="w-[321px] h-[616px] flex flex-col bg-white group box-border relative shrink-0">
            {/* Product Card */}
            <div className="relative">
                <ProductImagePlaceholder />
                <button
                    onClick={() => setIsLiked(!isLiked)}
                    className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
                >
                    <div
                        className={`w-6 h-6 transition-colors duration-200 ${isLiked ? 'bg-red-500' : 'bg-gray-400 hover:bg-red-400'}`}
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
            <ProductCardInfo />
        </div>
    );
}
