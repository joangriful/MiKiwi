import MikiwiLogo from '@/Components/MikiwiLogo/MikiwiLogo';
import { Link } from '@inertiajs/react';
import styles from './HomeLogoLink.module.css';

export default function HomeLogoLink({
    className = '',
    logoClassName = '',
    size = 'sm',
    ariaLabel = 'Ir al inicio',
}) {
    const linkClassName = [styles.link, className].filter(Boolean).join(' ');
    const resolvedLogoClassName = [
        styles.logo,
        styles[`size${size.charAt(0).toUpperCase()}${size.slice(1)}`],
        logoClassName,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <Link href={route('home')} className={linkClassName} aria-label={ariaLabel}>
            <MikiwiLogo className={resolvedLogoClassName} title="MiKiwi" />
        </Link>
    );
}
