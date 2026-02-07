import React from 'react';

export default function OptionsBar({ currentView, onViewChange, zoomLevel, onZoomChange }) {
    return (
        <div className="w-full bg-white border-t border-gray-200 px-4 py-3 flex items-center justify-between shadow-sm z-30 relative">

            {/* View Switcher (Front/Back) */}
            <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider hidden sm:inline-block mr-2">View:</span>
                <div className="flex bg-gray-100 rounded-full p-1 border border-gray-200">
                    {['front', 'back'].map((view) => (
                        <button
                            key={view}
                            onClick={() => onViewChange(view)}
                            className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 ${currentView === view
                                ? 'bg-white text-black shadow-sm'
                                : 'text-gray-500 hover:text-gray-900 hover:bg-white/50'
                                }`}
                        >
                            {view}
                        </button>
                    ))}
                </div>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider hidden sm:inline-block mr-2">Zoom:</span>
                <div className="flex items-center space-x-1 bg-gray-100 rounded-full p-1 border border-gray-200">
                    {[75, 100, 150, 200].map((zoom) => (
                        <button
                            key={zoom}
                            onClick={() => onZoomChange(zoom)}
                            className={`px-3 py-1.5 rounded-full text-[10px] font-bold transition-all duration-200 ${zoomLevel === zoom
                                ? 'bg-white text-black shadow-sm'
                                : 'text-gray-500 hover:text-gray-900 hover:bg-white/50'
                                }`}
                        >
                            {zoom}%
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
