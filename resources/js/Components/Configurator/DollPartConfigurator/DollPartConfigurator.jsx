import React, { useState } from 'react';
import PartSelector from '@/Components/Configurator/PartSelector/PartSelector';
// PartPositionEditor import removed as it is superseded by In-Card/Overlay editing and was unused in render
import OptionsBar from '@/Components/Configurator/OptionsBar/OptionsBar';
import styles from './DollPartConfigurator.module.css';

export default function DollPartConfigurator({ views, saving: _saving, setMessage: _setMessage, partPositions, onSavePosition }) {
    const [currentView, setCurrentView] = useState('front');

    // Helper to get available parts for current view
    const availableParts = views[currentView] || {};

    const [selectedParts, setSelectedParts] = useState({});

    const handleSelectPart = (category, item) => {
        const next = { ...selectedParts };
        if (!item) {
            delete next[category];
        } else {
            next[category] = item;
        }
        setSelectedParts(next);
    };

    // We don't need local handleSavePosition wrapper if we just pass the prop.
    // DollManager handles the API call and message.

    return (
        <div className={styles.root}>
            <div className={styles.layout}>
                <div className={styles.panel}>
                    <div className={styles.panelHeader}>
                        <div>
                            <h3 className={styles.title}>Partes Disponibles</h3>
                            <p className={styles.subtitle}>Haz clic en el lápiz para editar posición/zoom directamente en la tarjeta</p>
                        </div>

                        <div className={styles.toolbarSlot}>
                            <OptionsBar
                                currentView={currentView}
                                onViewChange={setCurrentView}
                                hideZoom={true}
                                surface="elevated"
                            />
                        </div>
                    </div>

                    <div className={styles.selectorSlot}>
                        <PartSelector
                            parts={availableParts}
                            selectedParts={selectedParts}
                            onSelect={handleSelectPart}
                            partPositions={partPositions} // From Props (Lifted State)
                            currentView={currentView}
                            selectionLabel="PREVIEW"
                            showImages={true}
                            onSavePosition={onSavePosition} // From Props (Lifted Handler)
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
