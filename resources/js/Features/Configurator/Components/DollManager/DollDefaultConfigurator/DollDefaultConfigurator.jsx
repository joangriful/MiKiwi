import React, { useState, useMemo } from 'react';
import PreviewArea from '@/Features/Configurator/Components/DollConfigurator/PreviewArea/PreviewArea';
import CloseUp from '@/Features/Configurator/Components/DollConfigurator/CloseUp/CloseUp';
import PartSelector from '@/Features/Configurator/Components/DollConfigurator/PartSelector/PartSelector';
import OptionsBar from '@/Features/Configurator/Components/DollConfigurator/OptionsBar/OptionsBar';
import './DollDefaultConfigurator.css';

export default function DollDefaultConfigurator({ views, currentSelections, onSelectionChange, saving, partPositions }) {
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
        <div className="flex flex-col h-full bg-gray-50">
            {/* Configurator Layout */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left Content Area (Images + Options Bar) */}
                <div className="w-2/3 flex flex-col border-r border-gray-200 bg-white">
                    <div className="flex-1 flex relative overflow-hidden">
                        {/* Left: Preview */}
                        <div className="w-1/2 relative bg-gray-200 border-r border-gray-200">
                            <PreviewArea
                                selectedParts={selectedParts}
                                viewportInfo={viewportInfo}
                                onViewportChange={setViewportInfo}
                                partPositions={partPositions}
                            />
                        </div>

                        {/* Center: CloseUp */}
                        <div className="w-1/2 relative bg-gray-100 overflow-hidden">
                            <CloseUp
                                selectedParts={selectedParts}
                                onViewportChange={setViewportInfo}
                                viewportOverride={viewportInfo}
                                zoomLevel={zoomLevel}
                            />
                        </div>
                    </div>

                    {/* Options Bar */}
                    <div className="flex-none z-40 relative">
                        <OptionsBar
                            currentView={currentView}
                            onViewChange={setCurrentView}
                            zoomLevel={zoomLevel}
                            onZoomChange={setZoomLevel}
                        />
                    </div>
                </div>

                {/* Right: Selector */}
                <div className="w-1/3 bg-white overflow-hidden flex flex-col">
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

