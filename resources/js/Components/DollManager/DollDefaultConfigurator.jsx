import React, { useState, useEffect, useMemo } from 'react';
import PreviewArea from '@/Components/DollConfigurator/PreviewArea';
import CloseUp from '@/Components/DollConfigurator/CloseUp';
import PartSelector from '@/Components/DollConfigurator/PartSelector';

export default function DollDefaultConfigurator({ views, currentSelections, onSave, saving, message }) {
    const [currentView, setCurrentView] = useState('front');
    const [viewportInfo, setViewportInfo] = useState({ visible: false });
    const [zoomLevel, setZoomLevel] = useState(100);

    // Local state for editing, initialized from parent prop
    const [allSelections, setAllSelections] = useState(currentSelections);

    // Sync if parent updates (e.g. after save or init)
    useEffect(() => {
        setAllSelections(currentSelections);
    }, [currentSelections]);

    // Get selections for current view
    const selectedParts = useMemo(() => {
        return allSelections[currentView] || {};
    }, [allSelections, currentView]);

    // Identify parts for current view
    const availableParts = useMemo(() => {
        return views[currentView] || {};
    }, [views, currentView]);

    const handleSelectPart = (category, item) => {
        setAllSelections(prev => {
            const next = { ...prev };
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
                    const removedItem = prev[currentView][category];
                    if (currentOtherInCat && removedItem && currentOtherInCat.id === removedItem.id) {
                        delete nextOtherSelections[category];
                    }
                }
                next[otherView] = nextOtherSelections;
            }

            return next;
        });
    };

    const handleSaveClick = () => {
        onSave(allSelections);
    };

    return (
        <div className="flex flex-col h-full bg-gray-50">
            {/* Toolbar */}
            <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shadow-sm z-20">
                <div className="flex items-center space-x-4">
                    <h2 className="text-lg font-bold text-gray-800">Default Configuration</h2>
                    <div className="flex bg-gray-100 rounded-lg p-1">
                        {['front', 'back'].map((view) => (
                            <button
                                key={view}
                                onClick={() => setCurrentView(view)}
                                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${currentView === view
                                    ? 'bg-white text-blue-600 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                {view.charAt(0).toUpperCase() + view.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex items-center space-x-4">
                    {message && (
                        <span className={`text-sm font-medium ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                            {message.text}
                        </span>
                    )}
                    <button
                        onClick={handleSaveClick}
                        disabled={saving}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center"
                    >
                        {saving ? 'Saving...' : 'Save Defaults'}
                    </button>
                </div>
            </div>

            {/* Configurator Layout */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left: Preview */}
                <div className="w-1/3 relative bg-gray-200 border-r border-gray-200">
                    <PreviewArea
                        selectedParts={selectedParts}
                        viewportInfo={viewportInfo}
                        onViewportChange={setViewportInfo}
                    />
                </div>

                {/* Center: CloseUp */}
                <div className="w-1/3 relative bg-gray-100 border-r border-gray-200 overflow-hidden">
                    <CloseUp
                        selectedParts={selectedParts}
                        onViewportChange={setViewportInfo}
                        viewportOverride={viewportInfo}
                        zoomLevel={zoomLevel}
                    />
                    {/* Simple Zoom Controls */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 bg-white/80 backdrop-blur rounded-lg p-1 shadow">
                        {[75, 100, 150].map((z) => (
                            <button
                                key={z}
                                onClick={() => setZoomLevel(z)}
                                className={`px-2 py-1 text-xs rounded ${zoomLevel === z ? 'bg-blue-100 text-blue-700' : 'text-gray-600'}`}
                            >
                                {z}%
                            </button>
                        ))}
                    </div>
                </div>

                {/* Right: Selector */}
                <div className="flex-1 bg-white overflow-hidden flex flex-col">
                    <PartSelector
                        parts={availableParts}
                        selectedParts={selectedParts}
                        onSelect={handleSelectPart}
                        selectionLabel="DEFAULT"
                    />
                </div>
            </div>
        </div>
    );
}
