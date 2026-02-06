import { useState } from 'react';

export default function ProductCardInfo() {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const reviewsCount = 120; // Fictitious review count

    return (
        <div className="flex-1 flex flex-col p-4 bg-white text-left justify-between">
            <div>
                {/* Product Name */}
                <h3 className="text-lg font-bold text-gray-900 mb-2 truncate">Kiwi Pack Premium</h3>

                {/* Description */}
                <p className="text-sm text-gray-500 leading-snug line-clamp-3 mb-4">
                    Kiwis frescos selección premium. Directos de nuestros huertos a tu mesa, garantizando el mejor sabor y frescura.
                </p>
            </div>

            <div className="space-y-3">
                {/* Stars */}
                <div className="flex items-center gap-2">
                    <div className="flex" onMouseLeave={() => setHoverRating(0)}>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                className={`text-xl transition-colors ${star <= (hoverRating || rating) ? 'text-yellow-400' : 'text-gray-200'
                                    }`}
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHoverRating(star)}
                            >
                                ★
                            </button>
                        ))}
                    </div>
                    <span className="text-gray-400 text-xs">({reviewsCount})</span>
                </div>

                {/* Price */}
                <div>
                    <span className="font-bold text-xl text-gray-900">$14.99</span>
                </div>
            </div>
        </div>
    );
}
