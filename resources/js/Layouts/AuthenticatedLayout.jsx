import ApplicationLogo from '@/Components/ApplicationLogo/ApplicationLogo';
import Dropdown from '@/Components/Dropdown/Dropdown';
import NavLink from '@/Components/NavLink/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './AuthenticatedLayout.module.css';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    return (
        <div className={styles.root}>
            <nav className={styles.nav}>
                <div className={styles.navContainer}>
                    <div className={styles.navInner}>
                        <div className={styles.leftSection}>
                            <div className={styles.logoSlot}>
                                <Link href="/">
                                    <ApplicationLogo size="sm" tone="strong" />
                                </Link>
                            </div>

                            <div className={styles.desktopNav}>
                                <NavLink
                                    href={route('dashboard')}
                                    active={route().current('dashboard')}
                                >
                                    Dashboard
                                </NavLink>
                            </div>
                        </div>

                        <div className={styles.desktopActions}>
                            <div className={styles.dropdownAnchor}>
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <button
                                            type="button"
                                            className={styles.userMenuButton}
                                        >
                                            {user.name}

                                            <svg
                                                className={styles.userMenuIcon}
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </button>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link
                                            href={route('perfil.view')}
                                        >
                                            Profile
                                        </Dropdown.Link>
                                        <Dropdown.Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                        >
                                            Log Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        <div className={styles.mobileToggleWrap}>
                            <button
                                type="button"
                                onClick={() =>
                                    setShowingNavigationDropdown(
                                        (previousState) => !previousState,
                                    )
                                }
                                className={styles.mobileToggle}
                                aria-label="Abrir o cerrar navegación móvil"
                            >
                                <svg
                                    className={styles.mobileToggleIcon}
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        className={
                                            !showingNavigationDropdown
                                                ? styles.isVisible
                                                : styles.isHidden
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={
                                            showingNavigationDropdown
                                                ? styles.isVisible
                                                : styles.isHidden
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div
                    className={`${showingNavigationDropdown ? styles.isVisible : styles.isHidden} ${styles.mobilePanel}`}
                >
                    <div className={styles.mobileNavLinks}>
                        <ResponsiveNavLink
                            href={route('dashboard')}
                            active={route().current('dashboard')}
                        >
                            Dashboard
                        </ResponsiveNavLink>
                    </div>

                    <div className={styles.mobileUserBlock}>
                        <div className={styles.mobileUserIdentity}>
                            <div className={styles.mobileUserName}>
                                {user.name}
                            </div>
                            <div className={styles.mobileUserEmail}>
                                {user.email}
                            </div>
                        </div>

                        <div className={styles.mobileUserLinks}>
                            <ResponsiveNavLink href={route('perfil.view')}>
                                Profile
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                method="post"
                                href={route('logout')}
                                as="button"
                            >
                                Log Out
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className={styles.header}>
                    <div className={styles.headerInner}>
                        {header}
                    </div>
                </header>
            )}

            <main>{children}</main>
            <ToastContainer
                position="bottom-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
        </div>
    );
}
