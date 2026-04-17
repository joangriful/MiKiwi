import React from 'react';
import styles from './ProductImageCarousel.module.css';

export default function ProductImageCarousel({ images = [], selectedImage, onSelectImage }) {
    const currentIndex = images.indexOf(selectedImage);

    const handlePrev = () => {
        const prevIndex = (currentIndex - 1 + images.length) % images.length;
        onSelectImage(images[prevIndex]);
    };

    const handleNext = () => {
        const nextIndex = (currentIndex + 1) % images.length;
        onSelectImage(images[nextIndex]);
    };

    return (
        <div className={`${styles.root} w-full flex flex-col gap-6`}>
            <div className="flex items-center gap-4 justify-between">
                {/* Prev Button */}
                <button
                    onClick={handlePrev}
                    className="p-2 rounded-full border border-gray-100 bg-white text-gray-400 hover:text-black hover:border-gray-200 transition-all active:scale-90"
                    aria-label="Anterior imagen"
                >
                    <span className="material-symbols-outlined">chevron_left</span>
                </button>

                {/* Thumbnails Container */}
                <div className="flex-1 flex gap-4 overflow-x-auto py-2 px-1 custom-scrollbar justify-center">
                    {images.map((img, index) => (
                        <button
                            key={index}
                            onClick={() => onSelectImage(img)}
                            className={`relative w-20 h-20 rounded-xl cursor-pointer transition-all duration-300 flex-shrink-0 overflow-hidden border-2 
                                ${selectedImage === img
                                    ? 'border-[#99b849] scale-105 shadow-md'
                                    : 'border-transparent opacity-40 hover:opacity-100 hover:border-gray-100'}
                            `}
                        >
                            <img
                                src={img}
                                alt={`Vista ${index + 1}`}
                                className="w-full h-full object-cover"
                            />
                        </button>
                    ))}
                </div>

                {/* Next Button */}
                <button
                    onClick={handleNext}
                    className="p-2 rounded-full border border-gray-100 bg-white text-gray-400 hover:text-black hover:border-gray-200 transition-all active:scale-90"
                    aria-label="Siguiente imagen"
                >
                    <span className="material-symbols-outlined">chevron_right</span>
                </button>
            </div>
        </div>
    );
}
