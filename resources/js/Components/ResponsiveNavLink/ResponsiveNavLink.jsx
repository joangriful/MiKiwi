import { Link } from '@inertiajs/react';
import styles from './ResponsiveNavLink.module.css';

export default function ResponsiveNavLink({
    active = false,
    className = '',
    children,
    ...props
}) {
    const linkClassName = [
        styles.root,
        active ? styles.active : styles.inactive,
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <Link {...props} className={linkClassName}>
            {children}
        </Link>
    );
}
