import { useState, useEffect, useCallback } from 'react';
import ProductImageCarousel from '../ProductImageCarousel/ProductImageCarousel';
import MainProductImage from '../MainProductImage/MainProductImage';
import ProductInfo from '../ProductInfo/ProductInfo';
import styles from './ProductShowcase.module.css';

export default function ProductShowcase({ product }) {
    // Normalize gallery items from the API to plain URLs before rendering.
    const galleryImages = Array.isArray(product?.images)
        ? product.images.map((image) => image?.url).filter(Boolean)
        : [];

    // Combine main image with additional images array and remove duplicates
    const images = [
        product?.image_url,
        ...galleryImages
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
        <section className={styles.root}>
            <div className={styles.layout}>

                <div className={styles.mediaColumn}>
                    <div className={styles.mainImagePanel}>
                        <MainProductImage image={selectedImage} />

                        <div className={styles.keyboardTip}>
                            <span className={styles.keyboardTipText}>Navega con las flechas</span>
                            <div className={styles.keyboardTipIcons}>
                                <span className={`material-symbols-outlined ${styles.keyboardTipIcon}`}>keyboard_arrow_left</span>
                                <span className={`material-symbols-outlined ${styles.keyboardTipIcon}`}>keyboard_arrow_right</span>
                            </div>
                        </div>
                    </div>

                    <ProductImageCarousel
                        images={images}
                        selectedImage={selectedImage}
                        onSelectImage={setSelectedImage}
                    />
                </div>

                <div className={styles.infoColumn}>
                    <ProductInfo product={product} />
                </div>
            </div>
        </section>
    );
}
