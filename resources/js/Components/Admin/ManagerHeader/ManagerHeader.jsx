import React from 'react';
import { Link } from '@inertiajs/react';
import styles from './ManagerHeader.module.css';

function SearchField({ searchTerm, setSearchTerm }) {
    return (
        <div className={styles.searchField}>
            <input
                type="text"
                placeholder="Search components..."
                className={styles.searchInput}
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
            />
        </div>
    );
}

function SaveButton({ onSaveDefaults }) {
    return (
        <button
            type="button"
            onClick={onSaveDefaults}
            className={styles.saveButton}
        >
            <img src="/assets/icons/Save_icon.svg" alt="Save" className={styles.saveIcon} />
            Save
        </button>
    );
}

export default function ManagerHeader({ searchTerm, setSearchTerm, activeManager, onSaveDefaults }) {
    return (
        <header className={styles.header}>
            <div className={styles.brand}>
                <Link href="/" className={styles.backLink}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={styles.backIcon}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                    </svg>
                </Link>
                <h1 className={styles.title}>
                    <img src="/assets/icons/manager.svg" alt="Manager" className={styles.titleIcon} />
                </h1>
            </div>

            <div className={styles.actions}>
                {activeManager === 'components' ? (
                    <SearchField searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                ) : (
                    <SaveButton onSaveDefaults={onSaveDefaults} />
                )}
            </div>
        </header>
    );
}
