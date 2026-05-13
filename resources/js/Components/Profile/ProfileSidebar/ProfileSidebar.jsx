import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import MaterialIcon from '@/Components/Icon/MaterialIcon/MaterialIcon';
import styles from './ProfileSidebar.module.css';

export default function ProfileSidebar({ activeTab, setActiveTab }) {
    const menuItems = [
        { id: 'profile', label: 'Perfil', icon: 'person', isMaterial: true },
        { id: 'favorites', label: 'Favoritos', icon: 'favorite', isMaterial: true },
        { id: 'addresses', label: 'Direcciones', icon: 'location_on', isMaterial: true },
        { id: 'orders', label: 'Historial de pedidos', icon: 'pedidos.svg' },
        { id: 'edit-account', label: 'Editar Detalles de la cuenta', icon: 'account_preferences.svg' },
        { id: 'cards', label: 'Tarjetas', icon: 'credit_card', isMaterial: true },
        { id: 'returns', label: 'Devoluciones', icon: 'refund.svg' },
    ];

    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const activeItem = menuItems.find((item) => item.id === activeTab) || menuItems[0];

    const handleTabChange = (id) => {
        setActiveTab(id);
        setIsMobileOpen(false);
    };

    const renderIcon = (item, isActive) => {
        if (item.isMaterial) {
            return (
                <MaterialIcon
                    name={item.icon}
                    className={`${styles.materialIcon} ${isActive ? styles.materialIconActive : styles.materialIconIdle}`}
                />
            );
        }

        return (
            <span
                className={`${styles.maskIcon} ${isActive ? styles.maskIconActive : styles.maskIconIdle}`}
                style={{
                    maskImage: `url('/assets/icons/${item.icon}')`,
                    WebkitMaskImage: `url('/assets/icons/${item.icon}')`,
                }}
            />
        );
    };

    return (
        <aside className={`${styles.root} ${styles.sidebar}`}>
            <nav className={styles.nav}>
                <div className={styles.mobileTriggerWrap}>
                    <button
                        onClick={() => setIsMobileOpen(!isMobileOpen)}
                        className={styles.mobileTrigger}
                    >
                        <div className={styles.mobileActive}>
                            {renderIcon(activeItem, true)}
                            <span className={styles.mobileLabel}>{activeItem.label}</span>
                        </div>
                        <MaterialIcon
                            name="expand_more"
                            className={`${styles.materialIcon} ${styles.mobileChevron} ${isMobileOpen ? styles.mobileChevronOpen : ''}`}
                        />
                    </button>
                </div>

                <div className={`${styles.items} ${isMobileOpen ? styles.itemsOpen : ''}`}>
                    {menuItems.map((item) => {
                        const isActive = activeTab === item.id;

                        return (
                            <button
                                key={item.id}
                                onClick={() => handleTabChange(item.id)}
                                className={`${styles.itemButton} ${isActive ? styles.itemButtonActive : styles.itemButtonIdle}`}
                            >
                                {renderIcon(item, isActive)}
                                <span>{item.label}</span>
                            </button>
                        );
                    })}
                </div>

                <div className={`${styles.logoutWrap} ${isMobileOpen ? styles.logoutWrapOpen : ''}`}>
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className={styles.logoutButton}
                    >
                        <MaterialIcon name="logout" className={styles.materialIcon} />
                        Cerrar Sesión
                    </Link>
                </div>
            </nav>
        </aside>
    );
}
