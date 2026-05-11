import { Head } from '@inertiajs/react';
import ReviewsManager from '@/Components/Admin/ReviewsManager/ReviewsManager';
import styles from './Reviews.module.css';

export default function Reviews({ reviews = [], users = [], products = [] }) {
    return (
        <div className={styles.root}>
            <Head title="Reseñas - Admin" />
            <ReviewsManager
                reviews={reviews}
                users={users}
                products={products}
            />
        </div>
    );
}
