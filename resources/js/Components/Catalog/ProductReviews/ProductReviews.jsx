import { useMemo, useState } from 'react';
import { useForm } from '@inertiajs/react';
import styles from './ProductReviews.module.css';

const STARS = [1, 2, 3, 4, 5];

function formatDate(value) {
    if (!value) {
        return '';
    }

    return new Intl.DateTimeFormat('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }).format(new Date(value));
}

function getErrorMessage(errors, fallback) {
    const firstError = Object.values(errors || {})[0];

    return Array.isArray(firstError) ? firstError[0] : firstError || fallback;
}

function RatingStars({ value = 0, interactive = false, hoveredValue = 0, onChange, onHover }) {
    const activeValue = hoveredValue || value;

    if (!interactive) {
        return (
            <div className={styles.stars} aria-label={`${value || 0} de 5 estrellas`}>
                {STARS.map((star) => (
                    <span
                        key={star}
                        className={`${styles.star} ${star <= Math.round(value || 0) ? styles.starActive : styles.starInactive}`}
                    >
                        ★
                    </span>
                ))}
            </div>
        );
    }

    return (
        <div className={styles.starsInput} role="radiogroup" aria-label="Puntuación">
            {STARS.map((star) => (
                <button
                    key={star}
                    type="button"
                    className={`${styles.starButton} ${star <= activeValue ? styles.starActive : styles.starInactive}`}
                    onClick={() => onChange(star)}
                    onMouseEnter={() => onHover(star)}
                    onFocus={() => onHover(star)}
                    onBlur={() => onHover(0)}
                    role="radio"
                    aria-checked={star === value}
                    aria-label={`${star} estrellas`}
                >
                    ★
                </button>
            ))}
        </div>
    );
}

function ReviewForm({ product }) {
    const [hoveredRating, setHoveredRating] = useState(0);
    const [submitted, setSubmitted] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        rating: 0,
        comment: '',
    });

    const submit = (event) => {
        event.preventDefault();

        post(route('products.reviews.store', product.slug), {
            preserveScroll: true,
            onSuccess: () => {
                setSubmitted(true);
                setHoveredRating(0);
                reset();
            },
        });
    };

    return (
        <form className={styles.form} onSubmit={submit}>
            <div className={styles.formHeader}>
                <h3 className={styles.formTitle}>Tu reseña</h3>
                <RatingStars
                    value={data.rating}
                    interactive
                    hoveredValue={hoveredRating}
                    onChange={(rating) => setData('rating', rating)}
                    onHover={setHoveredRating}
                />
            </div>

            <label className={styles.field}>
                <span>Comentario</span>
                <textarea
                    value={data.comment}
                    onChange={(event) => setData('comment', event.target.value)}
                    maxLength={2000}
                    rows={4}
                    className={styles.textarea}
                />
            </label>

            {(errors.rating || errors.comment) && (
                <p className={styles.error} role="alert">
                    {getErrorMessage(errors, 'No se pudo enviar la reseña.')}
                </p>
            )}

            {submitted && (
                <p className={styles.pendingMessage} role="status">
                    Reseña enviada. Se publicará cuando sea aprobada.
                </p>
            )}

            <button
                type="submit"
                className={styles.submitButton}
                disabled={processing || data.rating < 1}
            >
                {processing ? 'Enviando...' : 'Enviar reseña'}
            </button>
        </form>
    );
}

function UserReviewNotice({ userReview }) {
    if (!userReview) {
        return null;
    }

    return (
        <div className={styles.notice}>
            <div>
                <p className={styles.noticeTitle}>Tu reseña está registrada</p>
                <p className={styles.noticeText}>
                    Si todavía no aparece en el listado público, está pendiente de aprobación.
                </p>
            </div>
            <RatingStars value={userReview.rating} />
        </div>
    );
}

export default function ProductReviews({ product }) {
    const reviews = Array.isArray(product?.reviews) ? product.reviews : [];
    const averageRating = product?.reviews_average_rating;
    const reviewsCount = product?.reviews_count ?? reviews.length;
    const canReview = Boolean(product?.can_review);
    const userReview = product?.user_review;

    const formattedAverage = useMemo(() => {
        if (averageRating === null || averageRating === undefined) {
            return 'Sin valoración';
        }

        return Number(averageRating).toLocaleString('es-ES', {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1,
        });
    }, [averageRating]);

    return (
        <section className={styles.root} aria-labelledby="product-reviews-title">
            <div className={styles.header}>
                <div>
                    <p className={styles.eyebrow}>Reseñas</p>
                    <h2 id="product-reviews-title" className={styles.title}>Opiniones de clientes</h2>
                </div>

                <div className={styles.summary}>
                    <span className={styles.average}>{formattedAverage}</span>
                    <RatingStars value={averageRating || 0} />
                    <span className={styles.total}>{reviewsCount} {reviewsCount === 1 ? 'reseña' : 'reseñas'}</span>
                </div>
            </div>

            {canReview && <ReviewForm product={product} />}
            {!canReview && <UserReviewNotice userReview={userReview} />}

            {reviews.length > 0 ? (
                <div className={styles.list}>
                    {reviews.map((review, index) => (
                        <article key={`${review.user_name || 'review'}-${review.created_at || index}`} className={styles.review}>
                            <div className={styles.reviewHeader}>
                                <div>
                                    <h3 className={styles.reviewAuthor}>{review.user_name || 'Cliente'}</h3>
                                    {review.created_at && (
                                        <p className={styles.reviewDate}>{formatDate(review.created_at)}</p>
                                    )}
                                </div>
                                <RatingStars value={review.rating} />
                            </div>
                            {review.comment && <p className={styles.reviewComment}>{review.comment}</p>}
                        </article>
                    ))}
                </div>
            ) : (
                <div className={styles.emptyState}>
                    <span className={`material-symbols-outlined ${styles.emptyIcon}`}>reviews</span>
                    <p>Este producto todavía no tiene reseñas aprobadas.</p>
                </div>
            )}
        </section>
    );
}
