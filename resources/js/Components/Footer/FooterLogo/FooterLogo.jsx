import MikiwiLogo from '@/Components/MikiwiLogo/MikiwiLogo';
import { Link } from '@inertiajs/react';
import styles from './FooterLogo.module.css';

export default function FooterLogo() {
    return (
        <div className={styles.root}>
            <Link href={route('home')} className={styles.logoLink} aria-label="Ir al inicio">
                <MikiwiLogo className={styles.logo} />
            </Link>
        </div>
    );
}
