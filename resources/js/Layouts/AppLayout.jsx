import HomeLogoLink from '@/Components/HomeLogoLink/HomeLogoLink';
import styles from './AppLayout.module.css';

const PAGES_WITH_FALLBACK_NAVBAR = new Set([
    'Profile/Index',
]);

export default function AppLayout({ children, page }) {
    const hasFallbackNavbar = PAGES_WITH_FALLBACK_NAVBAR.has(page);

    return (
        <div className={styles.root}>
            {hasFallbackNavbar ? (
                <nav className={styles.nav} aria-label="Navegacion principal">
                    <HomeLogoLink
                        className={styles.logoLink}
                        logoClassName={styles.logo}
                        size="sm"
                        ariaLabel="Volver al inicio"
                    />
                </nav>
            ) : null}

            <div className={hasFallbackNavbar ? styles.contentWithNavbar : styles.content}>
                {children}
            </div>
        </div>
    );
}
