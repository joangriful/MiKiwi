import { useState, useEffect, useCallback } from 'react';
import ProductImageCarousel from '../ProductImageCarousel/ProductImageCarousel';
import MainProductImage from '../MainProductImage/MainProductImage';
import ProductInfo from '../ProductInfo/ProductInfo';
import styles from './ProductShowcase.module.css';

export default function ProductShowcase({ product }) {
    // Combine main image with additional images array and remove duplicates
    const images = [
        product?.image_url,
        ...(Array.isArray(product?.images) ? product.images : [])
    ].filter((img, index, self) => img && self.indexOf(img) === index);

    // Fallback if no images are found
    if (images.length === 0) {
        images.push('/assets/img/product_placeholder.png');
    }

    const [selectedImage, setSelectedImage] = useState(images[0]);

    // Keyboard navigation
    const handleKeyDown = useCallback((e) => {
        const currentIndex = images.indexOf(selectedImage);
        if (e.key === 'ArrowLeft') {
            const prevIndex = (currentIndex - 1 + images.length) % images.length;
            setSelectedImage(images[prevIndex]);
        } else if (e.key === 'ArrowRight') {
            const nextIndex = (currentIndex + 1) % images.length;
            setSelectedImage(images[nextIndex]);
        }
    }, [images, selectedImage]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    return (
        <section className={`${styles.root} max-w-[1600px] mx-auto px-6 py-8 md:py-16`}>
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-start">

                {/* Left side: Images Section */}
                <div className="w-full lg:w-[60%] flex flex-col gap-6 lg:gap-8">
                    {/* Main Image Container */}
                    <div className="relative aspect-square lg:aspect-[4/3] bg-gray-50 rounded-2xl md:rounded-[40px] overflow-hidden border border-gray-100 flex items-center justify-center p-4 md:p-8 group shadow-sm transition-shadow hover:shadow-md">
                        <MainProductImage image={selectedImage} />

                        {/* Keyboard Tip (Visible on hover) */}
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200 shadow-sm pointer-events-none">
                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Navega con las flechas</span>
                            <div className="flex gap-1">
                                <span className="material-symbols-outlined text-xs text-[#99b849]">keyboard_arrow_left</span>
                                <span className="material-symbols-outlined text-xs text-[#99b849]">keyboard_arrow_right</span>
                            </div>
                        </div>
                    </div>

                    {/* Horizontal Carousel below main image */}
                    <ProductImageCarousel
                        images={images}
                        selectedImage={selectedImage}
                        onSelectImage={setSelectedImage}
                    />
                </div>

                {/* Right side: Info Section */}
                <div className="w-full lg:w-[40%] lg:sticky lg:top-32">
                    <ProductInfo product={product} />
                </div>
            </div>
        </section>
    );
}
