import ApplicationLogo from '@/Components/ApplicationLogo/ApplicationLogo';
import { Link } from '@inertiajs/react';
import styles from './GuestLayout.module.css';

export default function GuestLayout({ children }) {
    return (
        <div className={styles.root}>
            <div className={styles.logoSlot}>
                <Link href="/">
                    <ApplicationLogo size="lg" tone="muted" />
                </Link>
            </div>

            <div className={styles.card}>
                {children}
            </div>
        </div>
    );
}
