import React, { useState, useEffect } from 'react';
import CloseUp from '@/Components/DollConfigurator/CloseUp';

export default function DollZoomConfigurator({ views, currentSelections, currentZoom, onSave, saving, message }) {
    // Initialize viewport state from currentZoom prop or default center-ish
    // Using a key on the component to force re-mount when currentZoom changes from parent ensures fresh init
    const [viewport, setViewport] = useState(currentZoom || { x: 0.5, y: 0.5, w: 1, h: 1 });
    const [zoomLevel, setZoomLevel] = useState(100);

    // Sync local state if prop changes (e.g. after save or load)
    useEffect(() => {
        if (currentZoom) {
            setViewport(currentZoom);
        }
    }, [currentZoom]);

    // We use the 'front' view selections for configuration. 
    // If 'front' is empty, it might be blank, but usually there are defaults.
    const selectedParts = currentSelections?.front || {};

    const handleSave = () => {
        // Pass the current viewport state up to save
        onSave(viewport);
    };

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
                <div className="flex items-center space-x-4">
                    {message && (
                        <span className={`text-sm font-medium ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                            {message.text}
                        </span>
                    )}
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center"
                    >
                        {saving ? 'Saving...' : 'Save Position'}
                    </button>
                </div>
            </div>

            {/* Content: CloseUp View Container */}
            <div className="flex-1 relative bg-gray-200 overflow-hidden flex flex-col items-center justify-center p-8 space-y-4">

                {/* Simulation of the frontend layout for context - Using vertical aspect ratio approx 2:3 */}
                <div className="relative w-[400px] h-[600px] bg-white rounded-lg shadow-2xl border-4 border-gray-800 overflow-hidden">
                    <CloseUp
                        selectedParts={selectedParts}
                        onViewportChange={setViewport}
                        viewportOverride={null}
                        initialViewport={currentZoom} // Start at current saved position
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
