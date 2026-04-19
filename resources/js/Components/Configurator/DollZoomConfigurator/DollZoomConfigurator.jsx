import React, { useState } from 'react';
import CloseUp from '@/Components/Configurator/CloseUp/CloseUp';
import styles from './DollZoomConfigurator.module.css';

export default function DollZoomConfigurator({ currentSelections, currentZoom, onZoomChange }) {
    // We use the 'front' view selections for configuration.
    // If 'front' is empty, it might be blank, but usually there are defaults.
    const selectedParts = currentSelections?.front || {};
    const [zoomLevel, setZoomLevel] = useState(100);

    return (
        <div className={styles.root}>
            <div className={styles.header}>
                <div className={styles.headerGroup}>
                    <h2 className={styles.title}>Default Zoom Position</h2>
                    <p className={styles.subtitle}>
                        Drag the image below to set the starting position for the Close Up view.
                    </p>
                </div>
            </div>

            <div className={styles.content}>
                <div className={styles.frame}>
                    <CloseUp
                        selectedParts={selectedParts}
                        onViewportChange={onZoomChange}
                        viewportOverride={null}
                        initialViewport={currentZoom}
                        zoomLevel={zoomLevel}
                    />

                    <div className={styles.zoomControls}>
                        {[75, 100, 150].map((z) => (
                            <button
                                key={z}
                                onClick={() => setZoomLevel(z)}
                                className={[
                                    styles.zoomButton,
                                    zoomLevel === z
                                        ? styles.zoomButtonActive
                                        : '',
                                ]
                                    .filter(Boolean)
                                    .join(' ')}
                            >
                                {z}%
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
