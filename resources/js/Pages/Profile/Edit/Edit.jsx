import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DeleteUserForm from '@/Components/Profile/DeleteUserForm/DeleteUserForm';
import UpdatePasswordForm from '@/Components/Profile/UpdatePasswordForm/UpdatePasswordForm';
import UpdateProfileInformationForm from '@/Components/Profile/UpdateProfileInformationForm/UpdateProfileInformationForm';
import { Head } from '@inertiajs/react';
import styles from './Edit.module.css';

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <div className={styles.root}>
            <AuthenticatedLayout
                header={
                    <h2 className={styles.title}>
                        Profile
                    </h2>
                }
            >
                <Head title="Profile" />

                <div className={styles.page}>
                    <div className={styles.container}>
                        <section className={styles.card}>
                            <UpdateProfileInformationForm
                                mustVerifyEmail={mustVerifyEmail}
                                status={status}
                                className={styles.form}
                            />
                        </section>

                        <section className={styles.card}>
                            <UpdatePasswordForm className={styles.form} />
                        </section>

                        <section className={styles.card}>
                            <DeleteUserForm className={styles.form} />
                        </section>
                    </div>
                </div>
            </AuthenticatedLayout>
        </div>
    );
}
