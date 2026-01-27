import { useState } from 'react';
import ImageCarouselVertical from './ImageCarouselVertical';
import MainProductImage from './MainProductImage';
import ProductInfo from './ProductInfo';

export default function ProductShowcase() {
    const images = [
        '/assets/img/product_example/main.png',
        '/assets/img/product_example/profile.png',
    ];

    const [selectedImage, setSelectedImage] = useState(images[0]);

    return (
        <section className="flex flex-row h-[600px] mb-12 bg-green-50">
            {/* Left: Thumbnails */}
            <ImageCarouselVertical
                images={images}
                selectedImage={selectedImage}
                onSelectImage={setSelectedImage}
            />

            {/* Shared Background Group */}
            <div className="flex-1 flex flex-row">
                {/* Center: Main Image */}
                <div className="flex-1">
                    <MainProductImage image={selectedImage} />
                </div>

                {/* Right: Info */}
                <div className="w-1/3 min-w-[300px]">
                    <ProductInfo />
                </div>
            </div>
        </section>
    );
}
