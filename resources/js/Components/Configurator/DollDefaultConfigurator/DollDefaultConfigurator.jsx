import React, { useState, useMemo } from 'react';
import PreviewArea from '@/Components/Configurator/PreviewArea/PreviewArea';
import CloseUp from '@/Components/Configurator/CloseUp/CloseUp';
import PartSelector from '@/Components/Configurator/PartSelector/PartSelector';
import OptionsBar from '@/Components/Configurator/OptionsBar/OptionsBar';
import styles from './DollDefaultConfigurator.module.css';

export default function DollDefaultConfigurator({ views, currentSelections, onSelectionChange, saving: _saving, partPositions }) {
    const [currentView, setCurrentView] = useState('front');
    const [viewportInfo, setViewportInfo] = useState({ visible: false });
    const [zoomLevel, setZoomLevel] = useState(100);

    // Get selections for current view
    const selectedParts = useMemo(() => {
        return currentSelections[currentView] || {};
    }, [currentSelections, currentView]);

    // Identify parts for current view
    const availableParts = useMemo(() => {
        return views[currentView] || {};
    }, [views, currentView]);

    const handleSelectPart = (category, item) => {
        // Calculate new state based on props
        const next = { ...currentSelections };
        const currentViewSelections = { ...(next[currentView] || {}) };

        // 1. Update Current View
        if (!item) {
            delete currentViewSelections[category];
        } else {
            currentViewSelections[category] = item;
        }
        next[currentView] = currentViewSelections;

        // 2. Try Syncing to Other Views (e.g. Front -> Back)
        const otherView = currentView === 'front' ? 'back' : 'front';
        const otherViewParts = views[otherView]?.[category];

        if (otherViewParts && Array.isArray(otherViewParts)) {
            const nextOtherSelections = { ...(next[otherView] || {}) };
            if (item) {
                const match = otherViewParts.find(p => p.id === item.id);
                if (match) {
                    nextOtherSelections[category] = match;
                }
            } else {
                // If Deselecting: Only remove from other view if it was the SAME item
                const currentOtherInCat = nextOtherSelections[category];
                const removedItem = currentSelections[currentView][category];
                if (currentOtherInCat && removedItem && currentOtherInCat.id === removedItem.id) {
                    delete nextOtherSelections[category];
                }
            }
            next[otherView] = nextOtherSelections;
        }

        // Notify parent immediately
        onSelectionChange(next);
    };

    return (
        <div className={styles.root}>
            <div className={styles.layout}>
                <div className={styles.workspace}>
                    <div className={styles.previewRow}>
                        <div className={styles.previewPane}>
                            <PreviewArea
                                selectedParts={selectedParts}
                                viewportInfo={viewportInfo}
                                onViewportChange={setViewportInfo}
                                partPositions={partPositions}
                            />
                        </div>

                        <div className={styles.closeUpPane}>
                            <CloseUp
                                selectedParts={selectedParts}
                                onViewportChange={setViewportInfo}
                                viewportOverride={viewportInfo}
                                zoomLevel={zoomLevel}
                            />
                        </div>
                    </div>

                    <div className={styles.optionsBarSlot}>
                        <OptionsBar
                            currentView={currentView}
                            onViewChange={setCurrentView}
                            zoomLevel={zoomLevel}
                            onZoomChange={setZoomLevel}
                        />
                    </div>
                </div>

                <div className={styles.selectorPane}>
                    <PartSelector
                        parts={availableParts}
                        selectedParts={selectedParts}
                        onSelect={handleSelectPart}
                        selectionLabel="DEFAULT"
                        showImages={true}
                        partPositions={partPositions}
                        currentView={currentView}
                    />
                </div>
            </div>
        </div>
    );
}
