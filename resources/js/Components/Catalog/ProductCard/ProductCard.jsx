import { useState } from 'react';
import ProductImagePlaceholder from '../ProductImagePlaceholder/ProductImagePlaceholder';
import { Link } from '@inertiajs/react';
import styles from './ProductCard.module.css';

export default function ProductCard({ product }) {
    const [isLiked, setIsLiked] = useState(false);

    if (!product) return null;

    return (
        <Link
            href={route('products.show', product.slug)}
            className={styles.root}
        >
            <div className={styles.imageArea}>
                {product.image_url ? (
                    <>
                        <img
                            src={product.image_url}
                            alt={product.name}
                            className={`${styles.productImage} ${product.hover_image_url ? styles.productImageWithHover : ''}`}
                        />
                        {product.hover_image_url && (
                            <img
                                src={product.hover_image_url}
                                alt={`${product.name} hover`}
                                className={styles.productHoverImage}
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
                    className={styles.likeButton}
                >
                    <div
                        className={`${styles.likeIcon} ${isLiked ? styles.likeIconActive : styles.likeIconInactive}`}
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

            <div className={styles.infoSection}>
                <div className={styles.infoHeader}>
                    <h3 className={styles.productName}>{product.name}</h3>
                    <span className={styles.price}>
                        {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(product.base_price)}
                    </span>
                </div>
                <div className={styles.divider} />
                <p className={styles.description}>
                    {product.description || 'Ingeniería sensorial premium'}
                </p>
            </div>
        </Link>
    );
}
