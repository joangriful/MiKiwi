import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import MikiwiLogo from '@/Components/MikiwiLogo/MikiwiLogo';
import BurgerMenu from './BurgerMenu';
import styles from './Header.module.css';

const primaryLinks = [
    { href: '/productos?featured=1', label: 'Top Ventas' },
    { href: route('products.index'), label: 'Juguetes' },
    {
        href: '/productos?category=cosmetica-y-cuidado',
        label: 'Cosmética',
    },
];

const stimulationLinks = [
    {
        href: '/productos?category=estimulacion-interna',
        label: 'Estimulación Interna',
    },
    {
        href: '/productos?category=estimulacion-externa',
        label: 'Estimulación Externa',
    },
    {
        href: '/productos?category=estimulacion-anal',
        label: 'Estimulación Anal',
    },
];

export default function Header() {
    const { auth, cartCount } = usePage().props;
    const user = auth?.user;
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className={styles.root}>
            <Link href={route('home')} className={styles.logoLink}>
                <MikiwiLogo className={styles.logo} />
            </Link>

            <nav className={styles.navigation} aria-label="Primary navigation">
                {primaryLinks.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={styles.navLink}
                    >
                        {link.label}
                    </Link>
                ))}

                <div className={styles.dropdown}>
                    <span className={styles.dropdownTrigger}>
                        Estimulación
                        <span
                            className={`${styles.dropdownIcon} material-symbols-outlined`}
                        >
                            keyboard_arrow_down
                        </span>
                    </span>

                    <div className={styles.dropdownPopover}>
                        <div className={styles.dropdownPanel}>
                            <ul className={styles.dropdownList}>
                                {stimulationLinks.map((link) => (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            className={styles.dropdownLink}
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                <Link href={route('doll.config.test')} className={styles.dollsLink}>
                    Muñecas
                </Link>
            </nav>

            <div className={styles.actions}>
                <Link href="/perfil" className={styles.iconLink}>
                    <span
                        className={`${styles.icon} material-symbols-outlined`}
                    >
                        person
                    </span>
                </Link>

                {user?.role === 'admin' && (
                    <Link href="/components-manager" className={styles.iconLink}>
                        <img
                            src="/assets/icons/manager.svg"
                            alt="Manager"
                            className={styles.assetIcon}
                        />
                    </Link>
                )}

                <Link href={route('cart.index')} className={styles.cartLink}>
                    <img
                        src="/assets/icons/cart.svg"
                        alt="Cart"
                        className={styles.assetIcon}
                    />
                    {cartCount > 0 && (
                        <span className={styles.badge}>
                            {cartCount > 99 ? '99+' : cartCount}
                        </span>
                    )}
                </Link>

                <button 
                    className={styles.burgerButton} 
                    onClick={() => setIsMenuOpen(true)}
                    aria-label="Open menu"
                >
                    <span className="material-symbols-outlined">menu</span>
                </button>
            </div>

            <BurgerMenu 
                isOpen={isMenuOpen} 
                onClose={() => setIsMenuOpen(false)}
                primaryLinks={primaryLinks}
                stimulationLinks={stimulationLinks}
            />
        </header>
    );
}
