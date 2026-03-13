import React, { useState } from 'react';
import CloseUp from '@/Features/Configurator/Components/DollConfigurator/CloseUp/CloseUp';
import './DollZoomConfigurator.css';

export default function DollZoomConfigurator({ currentSelections, currentZoom, onZoomChange }) {
    // We use the 'front' view selections for configuration.
    // If 'front' is empty, it might be blank, but usually there are defaults.
    const selectedParts = currentSelections?.front || {};
    const [zoomLevel, setZoomLevel] = useState(100);

    return (
        <div className="flex flex-col h-full bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shadow-sm z-20">
                <div className="flex items-center space-x-4">
                    <h2 className="text-lg font-bold text-gray-800">Default Zoom Position</h2>
                    <p className="text-sm text-gray-500">
                        Drag the image below to set the starting position for the Close Up view.
                    </p>
                </div>
            </div>

            {/* Content: CloseUp View Container */}
            <div className="flex-1 relative bg-gray-200 overflow-hidden flex flex-col items-center justify-center p-8 space-y-4">

                {/* Simulation of the frontend layout for context - Using vertical aspect ratio approx 2:3 */}
                <div className="relative w-[400px] h-[600px] bg-white rounded-lg shadow-2xl border-4 border-gray-800 overflow-hidden">
                    <CloseUp
                        selectedParts={selectedParts}
                        onViewportChange={onZoomChange}
                        viewportOverride={null}
                        initialViewport={currentZoom}
                        zoomLevel={zoomLevel}
                    />

                    {/* Zoom Controls Simulation (Visual only, controls this component's zoom) */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 bg-black/70 backdrop-blur rounded-full p-1 shadow">
                        {[75, 100, 150].map((z) => (
                            <button
                                key={z}
                                onClick={() => setZoomLevel(z)}
                                className={`px-2 py-1 text-[10px] rounded-full font-bold transition-all ${zoomLevel === z ? 'bg-white text-black' : 'text-white/70'}`}
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

