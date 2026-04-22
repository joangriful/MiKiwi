import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import styles from './Dashboard.module.css';

export default function Dashboard() {
    return (
        <div className={styles.root}>
            <AuthenticatedLayout
                header={
                    <h2 className={styles.title}>
                        Dashboard
                    </h2>
                }
            >
                <Head title="Dashboard" />

                <div className={styles.page}>
                    <div className={styles.container}>
                        <div className={styles.card}>
                            You're logged in!
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        </div>
    );
}
