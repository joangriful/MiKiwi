import React, { Suspense } from 'react';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import styles from './SingleComponentView.module.css';

const BACKGROUND_OPTIONS = [
    { label: 'White', color: 'var(--bg-surface)' },
    { label: 'Light Grey', color: 'var(--color-surface-disabled)' },
    { label: 'Grey', color: 'var(--color-border-strong)' },
    { label: 'Dark Grey', color: 'var(--color-text-strong)' },
    { label: 'Black', color: 'var(--color-black)' },
];

function EmptyState() {
    return (
        <div className={styles.emptyState}>
            <div className={styles.emptyStateIconWrapper}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={styles.emptyStateIcon}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
                </svg>
            </div>
            <h3 className={styles.emptyStateTitle}>Select a component to view</h3>
        </div>
    );
}

export default function SingleComponentView({ selectedComponentPath, SelectedSingleComponent }) {
    const [bgColor, setBgColor] = React.useState('var(--color-surface-disabled)');
    const [contextMenu, setContextMenu] = React.useState(null);

    const handleContextMenu = (e) => {
        e.preventDefault();
        setContextMenu({
            mouseX: e.clientX,
            mouseY: e.clientY,
        });
    };

    const handleKeyDown = (e) => {
        if (e.key !== 'ContextMenu' && !(e.shiftKey && e.key === 'F10')) {
            return;
        }

        e.preventDefault();
        const rect = e.currentTarget.getBoundingClientRect();
        setContextMenu({
            mouseX: rect.left + 24,
            mouseY: rect.top + 24,
        });
    };

    const handleCloseContextMenu = () => {
        setContextMenu(null);
    };

    const handleColorChange = (color) => {
        setBgColor(color);
        handleCloseContextMenu();
    };

    React.useEffect(() => {
        const handleClick = () => handleCloseContextMenu();
        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    }, []);

    if (!selectedComponentPath) {
        return <EmptyState />;
    }

    return (
        <div
            className={styles.container}
            style={{ backgroundColor: bgColor }}
            onContextMenu={handleContextMenu}
            onKeyDown={handleKeyDown}
            role="region"
            tabIndex={0}
            aria-label="Component preview"
        >
            <div className={styles.header}>
                <h2 className={styles.title}>
                    {selectedComponentPath.replace('../Components/', '').replace('.jsx', '')}
                </h2>
                <span className={styles.badge}>JSX</span>
            </div>
            <div className={styles.content}>
                <ErrorBoundary key={selectedComponentPath}>
                    <Suspense fallback={<div className={styles.loadingText}>Loading Component...</div>}>
                        <div className={styles.componentWrapper}>
                            {SelectedSingleComponent && <SelectedSingleComponent />}
                        </div>
                    </Suspense>
                </ErrorBoundary>
            </div>

            {contextMenu && (
                <div
                    className={styles.contextMenu}
                    style={{ top: contextMenu.mouseY, left: contextMenu.mouseX }}
                >
                    <div className={styles.contextMenuTitle}>
                        Background Color
                    </div>
                    {BACKGROUND_OPTIONS.map((option) => (
                        <button
                            key={option.label}
                            type="button"
                            onClick={() => handleColorChange(option.color)}
                            className={`${styles.contextMenuButton} ${bgColor === option.color ? styles.contextMenuButtonActive : ''}`}
                        >
                            <div className={styles.colorSwatch} style={{ backgroundColor: option.color }} aria-hidden="true" />
                            {option.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
