import { useState } from 'react';
import styles from './ProductCardInfo.module.css';

export default function ProductCardInfo({ name, description, price }) {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const reviewsCount = 120; // Placeholder until we have real reviews

    return (
        <div className={styles.root}>
            <div>
                <h3 className={styles.title} title={name}>{name}</h3>

                <p className={styles.description} title={description}>
                    {description || 'Sin descripción disponible.'}
                </p>
            </div>

            <div className={styles.meta}>
                <div className={styles.ratingRow}>
                    <div
                        className={styles.ratingStars}
                        onMouseLeave={() => setHoverRating(0)}
                        role="radiogroup"
                        tabIndex={0}
                        aria-label="Valorar producto"
                    >
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                className={`${styles.ratingButton} ${star <= (hoverRating || rating) ? styles.ratingButtonActive : styles.ratingButtonInactive}`}
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHoverRating(star)}
                                role="radio"
                                aria-checked={star === rating}
                                aria-label={`${star} estrellas`}
                            >
                                ★
                            </button>
                        ))}
                    </div>
                    <span className={styles.reviewCount}>({reviewsCount})</span>
                </div>

                <div>
                    <span className={styles.price}>
                        {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(price)}
                    </span>
                </div>
            </div>
        </div>
    );
}
