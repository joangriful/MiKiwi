

import React, { useState, useEffect, useMemo } from 'react';
import { Head } from '@inertiajs/react';
import PreviewArea from '@/Components/DollConfigurator/PreviewArea';
import CloseUp from '@/Components/DollConfigurator/CloseUp';
import PartSelector from '@/Components/DollConfigurator/PartSelector';
import Header from '@/Components/Common/Header';

export default function DollConfigTest({ views = {} }) {
    const [currentView, setCurrentView] = useState('front');
    const [viewportInfo, setViewportInfo] = useState({ visible: false });
    const [zoomLevel, setZoomLevel] = useState(100);
    const [isHeaderVisible, setIsHeaderVisible] = useState(false);

    // Initial load: Try to restore selections or just default empty
    const [selectedParts, setSelectedParts] = useState({});

    // Identify parts for current view
    const availableParts = useMemo(() => {
        return views[currentView] || {};
    }, [views, currentView]);

    // Handle View Switch & Sync Selections
    // When switching views, mapped selected objects to the new view's objects (by ID)
    useEffect(() => {
        setSelectedParts(prev => {
            const next = {};
            // Iterate over previously selected parts
            Object.entries(prev).forEach(([category, item]) => {
                if (!item) return; // Skip if null

                // Look for strictly the same ID in the new view's same category
                const newCategoryItems = views[currentView]?.[category];
                if (newCategoryItems && Array.isArray(newCategoryItems)) {
                    const match = newCategoryItems.find(p => p.id === item.id);
                    if (match) {
                        next[category] = match;
                    }
                    // If no match found in new view, the part is effectively deselected for this view 
                    // (e.g. Back view doesn't have "Star T-Shirt" but Front does).
                }
            });
            return next;
        });
    }, [currentView, views]);

    // Keyboard Shortcuts (1 & 3)
    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.key === '1') setCurrentView('front');
            if (e.key === '3') setCurrentView('back');
        };
        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, []);


    const handleSelectPart = (category, item) => {
        setSelectedParts(prev => {
            if (!item) {
                const next = { ...prev };
                delete next[category];
                return next;
            }
            return {
                ...prev,
                [category]: item
            };
        });
    };

    const headerTimeoutRef = React.useRef(null);

    const handleHeaderMouseEnter = () => {
        if (headerTimeoutRef.current) {
            clearTimeout(headerTimeoutRef.current);
            headerTimeoutRef.current = null;
        }
        setIsHeaderVisible(true);
    };

    const handleHeaderMouseLeave = (e) => {
        if (headerTimeoutRef.current) {
            clearTimeout(headerTimeoutRef.current);
        }

        // Check if leaving via top edge (allow some buffer)
        if (e.clientY <= 5) {
            // Keep visible for 3s
            headerTimeoutRef.current = setTimeout(() => {
                setIsHeaderVisible(false);
            }, 3000);
        } else {
            // Immediate hide (or fast)
            setIsHeaderVisible(false);
        }
    };

    return (
        <>
            <Head title="Configurador de Muñecas" />

            {/* Header Overlay */}
            <div
                className="fixed top-0 left-0 w-full z-[300]"
                onMouseLeave={handleHeaderMouseLeave}
                onMouseEnter={handleHeaderMouseEnter}
            >
                {/* Trigger Zone */}
                <div
                    className="absolute top-0 left-0 w-full h-8 z-[301]"
                    onMouseEnter={handleHeaderMouseEnter}
                />

                {/* Header Content */}
                <div className={`transition-transform duration-300 ease-in-out ${isHeaderVisible ? 'translate-y-0' : '-translate-y-full'}`}>
                    <Header />
                </div>
            </div>

            {/* Main Layout: Fixed 100vh */}
            <div className="flex flex-col lg:flex-row h-screen bg-gray-50 overflow-hidden cursor-default select-none touch-none">

                {/* Left Column: Full Preview (Fixed) */}
                <div className="lg:w-1/4 h-1/3 lg:h-full relative bg-white border-r border-gray-200">

                    {/* View Switcher Overlay (Floating Horizontal Pill) - Repositioned to Bottom & Resized */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[200] flex items-center bg-black/70 backdrop-blur-md rounded-full p-1 shadow-lg border border-white/10">
                        {['front', 'back'].map((view) => (
                            <button
                                key={view}
                                onClick={() => setCurrentView(view)}
                                className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 ${currentView === view
                                    ? 'bg-white text-black shadow-sm'
                                    : 'text-white/70 hover:text-white hover:bg-white/10'
                                    }`}
                            >
                                {view}
                            </button>
                        ))}
                    </div>

                    <div className="absolute inset-0 flex items-center justify-center">
                        <PreviewArea
                            selectedParts={selectedParts}
                            viewportInfo={viewportInfo}
                            onViewportChange={setViewportInfo}
                        />
                    </div>
                </div>

                {/* Center Column: CloseUp (Zoomed & Pannable) */}
                <div className="lg:w-2/5 h-1/3 lg:h-full relative bg-gray-100 border-r border-gray-200 overflow-hidden shadow-inner">
                    <CloseUp
                        selectedParts={selectedParts}
                        onViewportChange={setViewportInfo}
                        viewportOverride={viewportInfo}
                        zoomLevel={zoomLevel}
                    />

                    {/* Zoom Control Overlay - Repositioned to Bottom & Resized */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[200] flex items-center bg-black/70 backdrop-blur-md rounded-full p-1 shadow-lg border border-white/10">
                        {[75, 100, 150, 200].map((zoom) => (
                            <button
                                key={zoom}
                                onClick={() => setZoomLevel(zoom)}
                                className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all duration-200 ${zoomLevel === zoom
                                    ? 'bg-white text-black shadow-sm'
                                    : 'text-white/70 hover:text-white hover:bg-white/10'
                                    }`}
                            >
                                {zoom}%
                            </button>
                        ))}
                    </div>
                </div>

                {/* Right Column: Controls (Scrollable) */}
                <div className="lg:w-auto flex-1 h-1/3 lg:h-full flex flex-col bg-white overflow-hidden shadow-xl z-10">
                    <PartSelector
                        parts={availableParts}
                        selectedParts={selectedParts}
                        onSelect={handleSelectPart}
                    />
                </div>

            </div>
        </>
    );
}
