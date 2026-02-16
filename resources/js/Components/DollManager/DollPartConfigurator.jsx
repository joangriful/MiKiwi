import React, { useState } from 'react';
import PartSelector from '@/Components/DollConfigurator/PartSelector';
// PartPositionEditor import removed as it is superseded by In-Card/Overlay editing and was unused in render
import OptionsBar from '@/Components/DollConfigurator/OptionsBar';

export default function DollPartConfigurator({ views, saving, setMessage, partPositions, onSavePosition }) {
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
        <div className="flex flex-col h-full bg-gray-50 relative">
            <div className="flex-1 flex overflow-hidden">
                {/* Full Width: Part List (Image Mode) */}
                <div className="w-full bg-white flex flex-col">
                    <div className="p-4 border-b bg-gray-50 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                        <div>
                            <h3 className="font-bold text-gray-700">Partes Disponibles</h3>
                            <p className="text-xs text-gray-500">Haz clic en el lápiz para editar posición/zoom directamente en la tarjeta</p>
                        </div>

                        {/* View Switcher */}
                        <div className="w-full sm:w-auto">
                            <OptionsBar
                                currentView={currentView}
                                onViewChange={setCurrentView}
                                hideZoom={true}
                                bgColor="bg-white border md:border-gray-200 rounded-lg"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-hidden relative">
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
