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
        <div className={styles.root}>
            <div className={styles.layout}>
                <button
                    onClick={handlePrev}
                    className={styles.navButton}
                    aria-label="Anterior imagen"
                >
                    <span className={`material-symbols-outlined ${styles.navIcon}`}>chevron_left</span>
                </button>

                <div className={styles.thumbnailTrack}>
                    {images.map((img, index) => (
                        <button
                            key={index}
                            onClick={() => onSelectImage(img)}
                            className={`${styles.thumbnailButton} ${selectedImage === img ? styles.thumbnailButtonActive : styles.thumbnailButtonInactive}`}
                        >
                            <img
                                src={img}
                                alt={`Vista ${index + 1}`}
                                className={styles.thumbnailImage}
                            />
                        </button>
                    ))}
                </div>

                <button
                    onClick={handleNext}
                    className={styles.navButton}
                    aria-label="Siguiente imagen"
                >
                    <span className={`material-symbols-outlined ${styles.navIcon}`}>chevron_right</span>
                </button>
            </div>
        </div>
    );
}
