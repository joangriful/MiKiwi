import { useMemo, useState } from 'react';
import { router } from '@inertiajs/react';
import Toast from '@/Components/Toast/Toast';
import styles from './ReviewsManager.module.css';

const STATUS_FILTERS = [
    { id: 'all', label: 'Todas' },
    { id: 'pending', label: 'Pendientes' },
    { id: 'approved', label: 'Aprobadas' },
];

const RATING_FILTERS = [
    { id: 'all', label: 'Todas' },
    { id: '5', label: '5 estrellas' },
    { id: '4', label: '4 estrellas' },
    { id: '3', label: '3 estrellas' },
    { id: '2', label: '2 estrellas' },
    { id: '1', label: '1 estrella' },
];

const REVIEWABLE_PRODUCT_TYPES = ['simple', 'doll'];

const EMPTY_FORM = {
    user_id: '',
    product_id: '',
    rating: 5,
    comment: '',
    is_approved: false,
};

function getErrorMessage(errors, fallback) {
    const firstError = Object.values(errors || {})[0];

    return Array.isArray(firstError) ? firstError[0] : firstError || fallback;
}

function formatDate(value) {
    if (!value) {
        return '-';
    }

    return new Intl.DateTimeFormat('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(value));
}

function normalizeReviewForm(review) {
    return {
        user_id: review?.user?.id || '',
        product_id: review?.product?.id || '',
        rating: review?.rating || 5,
        comment: review?.comment || '',
        is_approved: Boolean(review?.is_approved),
    };
}

function ReviewForm({
    users,
    products,
    formData,
    editingReview,
    saving,
    onChange,
    onSubmit,
    onCancel,
}) {
    return (
        <form className={styles.formPanel} onSubmit={onSubmit}>
            <div className={styles.panelHeader}>
                <div>
                    <h3 className={styles.panelTitle}>{editingReview ? 'Editar reseña' : 'Crear reseña'}</h3>
                    <p className={styles.panelDescription}>Gestiona puntuación, comentario y estado de publicación.</p>
                </div>
                {editingReview && (
                    <button type="button" className={styles.secondaryButton} onClick={onCancel}>
                        Cancelar
                    </button>
                )}
            </div>

            <div className={styles.formGrid}>
                <label className={styles.field}>
                    <span>Usuario</span>
                    <select
                        value={formData.user_id}
                        onChange={(event) => onChange('user_id', event.target.value)}
                        className={styles.input}
                        required
                    >
                        <option value="">Seleccionar usuario</option>
                        {users.map((user) => (
                            <option key={user.id} value={user.id}>
                                {user.name} · {user.email}
                            </option>
                        ))}
                    </select>
                </label>

                <label className={styles.field}>
                    <span>Producto</span>
                    <select
                        value={formData.product_id}
                        onChange={(event) => onChange('product_id', event.target.value)}
                        className={styles.input}
                        required
                    >
                        <option value="">Seleccionar producto</option>
                        {products.map((product) => (
                            <option key={product.id} value={product.id}>
                                {product.name} · {product.sku || product.slug}
                            </option>
                        ))}
                    </select>
                </label>

                <label className={styles.field}>
                    <span>Rating</span>
                    <select
                        value={formData.rating}
                        onChange={(event) => onChange('rating', Number(event.target.value))}
                        className={styles.input}
                    >
                        {[5, 4, 3, 2, 1].map((rating) => (
                            <option key={rating} value={rating}>{rating} estrellas</option>
                        ))}
                    </select>
                </label>

                <label className={`${styles.field} ${styles.checkboxField}`}>
                    <input
                        type="checkbox"
                        checked={formData.is_approved}
                        onChange={(event) => onChange('is_approved', event.target.checked)}
                    />
                    <span>Aprobada</span>
                </label>
            </div>

            <label className={styles.field}>
                <span>Comentario</span>
                <textarea
                    value={formData.comment}
                    onChange={(event) => onChange('comment', event.target.value)}
                    className={styles.textarea}
                    maxLength={2000}
                    rows={4}
                />
            </label>

            <button type="submit" disabled={saving} className={styles.primaryButton}>
                {saving ? 'Guardando...' : editingReview ? 'Actualizar reseña' : 'Crear reseña'}
            </button>
        </form>
    );
}

export default function ReviewsManager({ reviews = [], users = [], products = [] }) {
    const [statusFilter, setStatusFilter] = useState('all');
    const [ratingFilter, setRatingFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [toast, setToast] = useState(null);
    const [saving, setSaving] = useState(false);
    const [loadingAction, setLoadingAction] = useState(null);
    const [editingReview, setEditingReview] = useState(null);
    const [formData, setFormData] = useState(EMPTY_FORM);

    const reviewableProducts = useMemo(() => products.filter((product) => (
        !product.product_type || REVIEWABLE_PRODUCT_TYPES.includes(product.product_type)
    )), [products]);

    const counts = useMemo(() => ({
        all: reviews.length,
        pending: reviews.filter((review) => !review.is_approved).length,
        approved: reviews.filter((review) => review.is_approved).length,
    }), [reviews]);

    const filteredReviews = useMemo(() => {
        const query = searchTerm.trim().toLowerCase();

        return reviews.filter((review) => {
            const matchesStatus = {
                all: true,
                pending: !review.is_approved,
                approved: review.is_approved,
            }[statusFilter];

            const matchesRating = ratingFilter === 'all' || Number(review.rating) === Number(ratingFilter);
            const matchesSearch = !query ||
                review.user?.name?.toLowerCase().includes(query) ||
                review.user?.email?.toLowerCase().includes(query) ||
                review.product?.name?.toLowerCase().includes(query) ||
                review.product?.sku?.toLowerCase().includes(query) ||
                review.product?.slug?.toLowerCase().includes(query);

            return matchesStatus && matchesRating && matchesSearch;
        });
    }, [reviews, statusFilter, ratingFilter, searchTerm]);

    const updateForm = (field, value) => {
        setFormData((current) => ({ ...current, [field]: value }));
    };

    const resetForm = () => {
        setEditingReview(null);
        setFormData(EMPTY_FORM);
    };

    const editReview = (review) => {
        setEditingReview(review);
        setFormData(normalizeReviewForm(review));
    };

    const submitForm = (event) => {
        event.preventDefault();
        setSaving(true);

        const options = {
            preserveScroll: true,
            onSuccess: () => {
                setToast({ message: editingReview ? 'Reseña actualizada' : 'Reseña creada', type: 'success' });
                setSaving(false);
                resetForm();
            },
            onError: (errors) => {
                setToast({ message: getErrorMessage(errors, 'No se pudo guardar la reseña.'), type: 'error' });
                setSaving(false);
            },
        };

        if (editingReview) {
            router.put(route('admin.reviews.update', editingReview.id), formData, options);
            return;
        }

        router.post(route('admin.reviews.store'), formData, options);
    };

    const approveReview = (review) => {
        setLoadingAction(`approve-${review.id}`);
        router.patch(route('admin.reviews.approve', review.id), {}, {
            preserveScroll: true,
            onSuccess: () => setToast({ message: 'Reseña aprobada', type: 'success' }),
            onError: (errors) => setToast({ message: getErrorMessage(errors, 'No se pudo aprobar la reseña.'), type: 'error' }),
            onFinish: () => setLoadingAction(null),
        });
    };

    const rejectReview = (review) => {
        setLoadingAction(`reject-${review.id}`);
        router.put(route('admin.reviews.update', review.id), {
            user_id: review.user?.id,
            product_id: review.product?.id,
            rating: review.rating,
            comment: review.comment || '',
            is_approved: false,
        }, {
            preserveScroll: true,
            onSuccess: () => setToast({ message: 'Reseña rechazada', type: 'success' }),
            onError: (errors) => setToast({ message: getErrorMessage(errors, 'No se pudo rechazar la reseña.'), type: 'error' }),
            onFinish: () => setLoadingAction(null),
        });
    };

    const deleteReview = (review) => {
        setLoadingAction(`delete-${review.id}`);
        router.delete(route('admin.reviews.destroy', review.id), {
            preserveScroll: true,
            onSuccess: () => {
                setToast({ message: 'Reseña eliminada', type: 'success' });
                if (editingReview?.id === review.id) {
                    resetForm();
                }
            },
            onError: (errors) => setToast({ message: getErrorMessage(errors, 'No se pudo eliminar la reseña.'), type: 'error' }),
            onFinish: () => setLoadingAction(null),
        });
    };

    return (
        <div className={styles.layout}>
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            <aside className={styles.sidebar}>
                <div className={styles.sidebarHeader}>
                    <h2 className={styles.sidebarTitle}>Reseñas</h2>
                    <p className={styles.sidebarDescription}>Moderación y edición</p>
                </div>

                <div className={styles.sidebarFilters}>
                    {STATUS_FILTERS.map((filter) => (
                        <button
                            key={filter.id}
                            type="button"
                            onClick={() => setStatusFilter(filter.id)}
                            className={`${styles.filterButton} ${statusFilter === filter.id ? styles.filterButtonActive : ''}`}
                        >
                            <span>{filter.label}</span>
                            <span className={styles.filterCount}>{counts[filter.id]}</span>
                        </button>
                    ))}
                </div>

                <label className={styles.sidebarField}>
                    <span>Rating</span>
                    <select
                        value={ratingFilter}
                        onChange={(event) => setRatingFilter(event.target.value)}
                        className={styles.input}
                    >
                        {RATING_FILTERS.map((filter) => (
                            <option key={filter.id} value={filter.id}>{filter.label}</option>
                        ))}
                    </select>
                </label>
            </aside>

            <main className={styles.content}>
                <div className={styles.toolbar}>
                    <div className={styles.searchBar}>
                        <span className={`material-symbols-outlined ${styles.searchIcon}`}>search</span>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(event) => setSearchTerm(event.target.value)}
                            placeholder="Buscar por usuario o producto..."
                            className={styles.searchInput}
                            aria-label="Buscar reseñas"
                        />
                    </div>
                    <button type="button" className={styles.primaryButton} onClick={resetForm}>
                        Nueva reseña
                    </button>
                </div>

                <div className={styles.workspace}>
                    <section className={styles.tableArea}>
                        <div className={styles.tableContainer}>
                            <table className={styles.table}>
                                <thead className={styles.tableHead}>
                                    <tr>
                                        <th className={styles.heading}>Producto</th>
                                        <th className={styles.heading}>Usuario</th>
                                        <th className={`${styles.heading} ${styles.headingCentered}`}>Rating</th>
                                        <th className={`${styles.heading} ${styles.headingCentered}`}>Estado</th>
                                        <th className={styles.heading}>Fecha</th>
                                        <th className={`${styles.heading} ${styles.headingRight}`}>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredReviews.map((review) => (
                                        <tr key={review.id} className={styles.tableRow}>
                                            <td className={styles.cell}>
                                                <span className={styles.primaryText}>{review.product?.name || '-'}</span>
                                                <span className={styles.secondaryText}>{review.product?.sku || review.product?.slug || '-'}</span>
                                            </td>
                                            <td className={styles.cell}>
                                                <span className={styles.primaryText}>{review.user?.name || '-'}</span>
                                                <span className={styles.secondaryText}>{review.user?.email || '-'}</span>
                                            </td>
                                            <td className={`${styles.cell} ${styles.cellCentered}`}>
                                                <span className={styles.ratingBadge}>{review.rating} ★</span>
                                            </td>
                                            <td className={`${styles.cell} ${styles.cellCentered}`}>
                                                <span className={`${styles.statusBadge} ${review.is_approved ? styles.statusApproved : styles.statusPending}`}>
                                                    {review.is_approved ? 'Aprobada' : 'Pendiente'}
                                                </span>
                                            </td>
                                            <td className={styles.cell}>{formatDate(review.created_at)}</td>
                                            <td className={`${styles.cell} ${styles.cellRight}`}>
                                                <div className={styles.actionGroup}>
                                                    <button type="button" className={styles.iconButton} onClick={() => editReview(review)} aria-label="Editar reseña">
                                                        <span className="material-symbols-outlined">edit</span>
                                                    </button>
                                                    {review.is_approved ? (
                                                        <button
                                                            type="button"
                                                            className={styles.actionButton}
                                                            disabled={loadingAction === `reject-${review.id}`}
                                                            onClick={() => rejectReview(review)}
                                                        >
                                                            Rechazar
                                                        </button>
                                                    ) : (
                                                        <button
                                                            type="button"
                                                            className={styles.actionButton}
                                                            disabled={loadingAction === `approve-${review.id}`}
                                                            onClick={() => approveReview(review)}
                                                        >
                                                            Aprobar
                                                        </button>
                                                    )}
                                                    <button
                                                        type="button"
                                                        className={`${styles.iconButton} ${styles.iconButtonDanger}`}
                                                        disabled={loadingAction === `delete-${review.id}`}
                                                        onClick={() => deleteReview(review)}
                                                        aria-label="Eliminar reseña"
                                                    >
                                                        <span className="material-symbols-outlined">delete</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {filteredReviews.length === 0 && (
                                <div className={styles.emptyState}>
                                    <span className={`material-symbols-outlined ${styles.emptyIcon}`}>rate_review</span>
                                    <p>No hay reseñas con los filtros actuales.</p>
                                </div>
                            )}
                        </div>
                    </section>

                    <ReviewForm
                        users={users}
                        products={reviewableProducts}
                        formData={formData}
                        editingReview={editingReview}
                        saving={saving}
                        onChange={updateForm}
                        onSubmit={submitForm}
                        onCancel={resetForm}
                    />
                </div>
            </main>
        </div>
    );
}
