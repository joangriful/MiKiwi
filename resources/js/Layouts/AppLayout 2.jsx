import HomeLogoLink from '@/Components/HomeLogoLink/HomeLogoLink';
import AgeGate from '@/Components/AgeGate/AgeGate';
import styles from './AppLayout.module.css';

const PAGES_WITH_FALLBACK_NAVBAR = new Set([
    'Profile/Index',
]);

export default function AppLayout({ children, page, auth }) {
    const hasFallbackNavbar = PAGES_WITH_FALLBACK_NAVBAR.has(page);
    const isLoggedIn = Boolean(auth?.user);

    return (
        <div className={styles.root}>
            <AgeGate isLoggedIn={isLoggedIn} />
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
