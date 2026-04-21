import React, { useState, useRef, useEffect } from 'react';
import styles from './OptionsBar.module.css';

const SURFACE_CLASS_MAP = {
    default: styles.surfaceDefault,
    transparent: styles.surfaceTransparent,
    elevated: styles.surfaceElevated,
};

const VIEW_LABELS = {
    front: 'Frente',
    back: 'Espalda',
};

function getClassName(...classNames) {
    return classNames.filter(Boolean).join(' ');
}

export default function OptionsBar({
    currentView,
    onViewChange,
    zoomLevel,
    onZoomChange,
    surface = 'default',
    hideZoom = false,
}) {
    const [showViewOptions, setShowViewOptions] = useState(false);
    const [showZoomOptions, setShowZoomOptions] = useState(false);
    const viewRef = useRef(null);
    const zoomRef = useRef(null);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (viewRef.current && !viewRef.current.contains(event.target)) {
                setShowViewOptions(false);
            }
            if (zoomRef.current && !zoomRef.current.contains(event.target)) {
                setShowZoomOptions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const views = ['front', 'back'];
    const zoomLevels = [75, 100, 150, 200];

    return (
        <div
            className={getClassName(
                styles.root,
                SURFACE_CLASS_MAP[surface] ?? SURFACE_CLASS_MAP.default
            )}
        >
            <div className={styles.dropdownRoot} ref={viewRef}>
                <button
                    onClick={() => setShowViewOptions(!showViewOptions)}
                    className={getClassName(
                        styles.trigger,
                        styles.triggerUppercase
                    )}
                >
                    {VIEW_LABELS[currentView] ?? currentView}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className={getClassName(
                            styles.chevron,
                            showViewOptions ? styles.chevronOpen : ''
                        )}
                    >
                        <path fillRule="evenodd" d="M14.77 12.79a.75.75 0 01-1.06-.02L10 8.832 6.29 12.77a.75.75 0 11-1.08-1.04l4.25-4.5a.75.75 0 011.08 0l4.25 4.5a.75.75 0 01-.02 1.06z" clipRule="evenodd" />
                    </svg>
                </button>

                {showViewOptions && (
                    <div
                        className={getClassName(
                            styles.menu,
                            styles.alignLeft
                        )}
                    >
                        {views.map(view => (
                            <button
                                key={view}
                                onClick={() => {
                                    onViewChange(view);
                                    setShowViewOptions(false);
                                }}
                                className={getClassName(
                                    styles.menuItem,
                                    styles.menuItemUppercase,
                                    currentView === view
                                        ? styles.menuItemActive
                                        : ''
                                )}
                            >
                                {VIEW_LABELS[view] ?? view}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Zoom Dropdown */}
            {!hideZoom && (
                <div className={styles.dropdownRoot} ref={zoomRef}>
                    <button
                        onClick={() => setShowZoomOptions(!showZoomOptions)}
                        className={styles.trigger}
                    >
                        {zoomLevel}%
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className={getClassName(
                                styles.chevron,
                                showZoomOptions ? styles.chevronOpen : ''
                            )}
                        >
                            <path fillRule="evenodd" d="M14.77 12.79a.75.75 0 01-1.06-.02L10 8.832 6.29 12.77a.75.75 0 11-1.08-1.04l4.25-4.5a.75.75 0 011.08 0l4.25 4.5a.75.75 0 01-.02 1.06z" clipRule="evenodd" />
                        </svg>
                    </button>

                    {showZoomOptions && (
                        <div
                            className={getClassName(
                                styles.menu,
                                styles.alignRight
                            )}
                        >
                            {zoomLevels.map(zoom => (
                                <button
                                    key={zoom}
                                    onClick={() => {
                                        onZoomChange(zoom);
                                        setShowZoomOptions(false);
                                    }}
                                    className={getClassName(
                                        styles.menuItem,
                                        zoomLevel === zoom
                                            ? styles.menuItemActive
                                            : ''
                                    )}
                                >
                                    {zoom}%
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
