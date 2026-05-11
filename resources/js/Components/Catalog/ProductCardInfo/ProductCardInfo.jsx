import styles from './ProductCardInfo.module.css';

const STARS = [1, 2, 3, 4, 5];

export default function ProductCardInfo({
    name,
    description,
    price,
    reviewsAverageRating = null,
    reviewsCount = 0,
}) {
    const ratingValue = Number(reviewsAverageRating || 0);

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
                        aria-label={`${ratingValue.toFixed(1)} de 5 estrellas`}
                    >
                        {STARS.map((star) => (
                            <span
                                key={star}
                                className={`${styles.ratingStar} ${star <= Math.round(ratingValue) ? styles.ratingStarActive : styles.ratingStarInactive}`}
                            >
                                ★
                            </span>
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
