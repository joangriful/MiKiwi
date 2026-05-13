import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import MaterialIcon from '@/Components/Icon/MaterialIcon/MaterialIcon';
import styles from './BurgerMenu.module.css';

/**
 * BurgerMenu Component (Refined)
 * 
 * Simple, left-aligned full-screen menu.
 * Features a toggleable sub-menu for "Estimulación".
 */
export default function BurgerMenu({ isOpen, onClose, primaryLinks, stimulationLinks }) {
    const [isStimulationOpen, setIsStimulationOpen] = useState(false);

    // Reset sub-menu state when closing/opening the main menu
    useEffect(() => {
        if (!isOpen) setIsStimulationOpen(false);
    }, [isOpen]);

    // Prevent body scroll when menu is open
    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className={styles.root}>
            <div className={styles.container}>
                {/* Close Button */}
                <div className={styles.header}>
                    <button onClick={onClose} className={styles.closeButton}>
                        <MaterialIcon name="close" className="material-symbols-outlined" />
                    </button>
                </div>

                {/* Navigation List */}
                <nav className={styles.nav}>
                    <ul className={styles.list}>
                        {primaryLinks.map((link) => (
                            <li key={link.href}>
                                <Link href={link.href} onClick={onClose} className={styles.link}>
                                    {link.label}
                                </Link>
                            </li>
                        ))}

                        {/* Expandable Stimulation Section */}
                        <li>
                            <button 
                                onClick={() => setIsStimulationOpen(!isStimulationOpen)} 
                                className={styles.expandableLink}
                            >
                                <MaterialIcon
                                    name="keyboard_arrow_right"
                                    className={`material-symbols-outlined ${styles.arrow} ${isStimulationOpen ? styles.arrowOpen : ''}`}
                                />
                                Estimulación
                            </button>
                            
                            {isStimulationOpen && (
                                <ul className={styles.subList}>
                                    {stimulationLinks.map((link) => (
                                        <li key={link.href}>
                                            <Link href={link.href} onClick={onClose} className={styles.subLink}>
                                                {link.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </li>

                        {/* Muñecas Link (Pink) */}
                        <li>
                            <Link 
                                href={route('doll.config.test')} 
                                onClick={onClose} 
                                className={`${styles.link} ${styles.dollsLink}`}
                            >
                                Muñecas
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
}
