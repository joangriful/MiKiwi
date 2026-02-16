import React, { useState, useRef, useEffect } from 'react';

export default function OptionsBar({ currentView, onViewChange, zoomLevel, onZoomChange, bgColor = 'bg-white', hideZoom = false }) {
    const [showViewOptions, setShowViewOptions] = useState(false);
    const [showZoomOptions, setShowZoomOptions] = useState(false);
    // Debug prop
    // console.log('OptionsBar render', { hideZoom, currentView });
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
        <div className={`w-full ${bgColor} px-4 py-3 flex items-center justify-between shadow-sm z-30 relative`}>

            {/* View Dropdown */}
            <div className="relative" ref={viewRef}>
                <button
                    onClick={() => setShowViewOptions(!showViewOptions)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-bold uppercase tracking-wider text-gray-700 transition-colors"
                >
                    {currentView}
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-4 h-4 transition-transform ${showViewOptions ? 'rotate-180' : ''}`}>
                        <path fillRule="evenodd" d="M14.77 12.79a.75.75 0 01-1.06-.02L10 8.832 6.29 12.77a.75.75 0 11-1.08-1.04l4.25-4.5a.75.75 0 011.08 0l4.25 4.5a.75.75 0 01-.02 1.06z" clipRule="evenodd" />
                    </svg>
                </button>

                {showViewOptions && (
                    <div className="absolute bottom-full lg:bottom-auto lg:top-full lg:mt-2 left-0 mb-2 lg:mb-0 w-full min-w-[120px] bg-white rounded-lg shadow-xl ring-1 ring-black/5 overflow-hidden z-[100] p-1 space-y-1">
                        {views.map(view => (
                            <button
                                key={view}
                                onClick={() => {
                                    onViewChange(view);
                                    setShowViewOptions(false);
                                }}
                                className={`w-full text-left px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-colors ${currentView === view
                                    ? 'bg-blue-50 text-blue-600'
                                    : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                {view}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Zoom Dropdown */}
            {!hideZoom && (
                <div className="relative" ref={zoomRef}>
                    <button
                        onClick={() => setShowZoomOptions(!showZoomOptions)}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-bold text-gray-700 transition-colors"
                    >
                        {zoomLevel}%
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-4 h-4 transition-transform ${showZoomOptions ? 'rotate-180' : ''}`}>
                            <path fillRule="evenodd" d="M14.77 12.79a.75.75 0 01-1.06-.02L10 8.832 6.29 12.77a.75.75 0 11-1.08-1.04l4.25-4.5a.75.75 0 011.08 0l4.25 4.5a.75.75 0 01-.02 1.06z" clipRule="evenodd" />
                        </svg>
                    </button>

                    {showZoomOptions && (
                        <div className="absolute bottom-full lg:bottom-auto lg:top-full lg:mt-2 right-0 mb-2 lg:mb-0 w-full min-w-[100px] bg-white rounded-lg shadow-xl ring-1 ring-black/5 overflow-hidden z-[100] p-1 space-y-1">
                            {zoomLevels.map(zoom => (
                                <button
                                    key={zoom}
                                    onClick={() => {
                                        onZoomChange(zoom);
                                        setShowZoomOptions(false);
                                    }}
                                    className={`w-full text-left px-4 py-2 text-xs font-bold rounded-md transition-colors ${zoomLevel === zoom
                                        ? 'bg-blue-50 text-blue-600'
                                        : 'text-gray-600 hover:bg-gray-100'
                                        }`}
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
