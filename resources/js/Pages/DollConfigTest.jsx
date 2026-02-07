import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Head } from '@inertiajs/react';
import PreviewArea from '@/Components/DollConfigurator/PreviewArea';
import PartSelector from '@/Components/DollConfigurator/PartSelector';
import CloseUp from '@/Components/DollConfigurator/CloseUp';
import OptionsBar from '@/Components/DollConfigurator/OptionsBar';
import Header from '@/Components/Common/Header';

export default function DollConfigTest({ views, defaultSettings }) {
    const [allSelections, setAllSelections] = useState({ front: {}, back: {} });
    const [currentView, setCurrentView] = useState('front');
    const [zoomLevel, setZoomLevel] = useState(100);
    const [viewportInfo, setViewportInfo] = useState(null);
    const [isHeaderVisible, setIsHeaderVisible] = useState(false);
    const headerTimeoutRef = useRef(null);

    // Header visibility logic - show on hover near top
    useEffect(() => {
        const handleMouseMove = (e) => {
            if (e.clientY < 100) {
                setIsHeaderVisible(true);
                if (headerTimeoutRef.current) clearTimeout(headerTimeoutRef.current);
            } else {
                if (headerTimeoutRef.current) clearTimeout(headerTimeoutRef.current);
                headerTimeoutRef.current = setTimeout(() => {
                    setIsHeaderVisible(false);
                }, 500);
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            if (headerTimeoutRef.current) clearTimeout(headerTimeoutRef.current);
        };
    }, []);

    // Initial load of defaults
    useEffect(() => {
        let defaults = {};

        if (defaultSettings && defaultSettings.selections) {
            if (defaultSettings.selections.front || defaultSettings.selections.back) {
                defaults = defaultSettings.selections;
            } else {
                defaults = { front: defaultSettings.selections, back: {} };
            }
        } else {
            defaults = { front: {}, back: {} };
        }

        setAllSelections(defaults);
    }, [defaultSettings]);

    const defaultZoom = useMemo(() => {
        return defaultSettings?.zoom || null;
    }, [defaultSettings]);

    const availableParts = useMemo(() => {
        if (!views) {
            console.log('DollConfigTest - No views:', views);
            return {};
        }
        const parts = views[currentView] || {};
        console.log('DollConfigTest - availableParts for', currentView, ':', parts);
        console.log('DollConfigTest - Object.keys:', Object.keys(parts));
        return parts;
    }, [views, currentView]);

    const handleSelectPart = (category, item) => {
        setAllSelections(prev => {
            const next = { ...prev };
            const currentViewSelections = { ...(next[currentView] || {}) };

            // Update Current View
            if (!item) {
                delete currentViewSelections[category];
            } else {
                currentViewSelections[category] = item;
            }
            next[currentView] = currentViewSelections;

            return next;
        });
    };

    // Get selections for current view - EXACT pattern from DollDefaultConfigurator
    const selectedParts = useMemo(() => {
        return allSelections[currentView] || {};
    }, [allSelections, currentView]);

    return (
        <>
            <Head title="Doll Configurator" />

            {/* Hover-reveal Header */}
            <div className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${isHeaderVisible ? 'translate-y-0' : '-translate-y-full'}`}>
                <Header />
            </div>

            {/* Main Layout */}
            <div className="flex flex-col min-[724px]:flex-row min-[724px]:flex-wrap min-[724px]:content-start lg:flex-nowrap h-screen bg-gray-50 overflow-hidden cursor-default select-none touch-none relative">

                {/* Left Content Area (Images + Options Bar) */}
                <div className="flex flex-col h-[65%] w-full min-[724px]:h-[65%] min-[724px]:w-full lg:w-auto lg:h-full lg:flex-1 border-r border-gray-200 bg-white shadow-xl lg:shadow-none z-20">

                    {/* Images Row */}
                    <div className="flex-1 flex relative overflow-hidden">

                        {/* Preview Area - Mobile: PIP overlay, Desktop: Left column */}
                        <div className="absolute bottom-4 left-4 z-50 w-24 h-auto aspect-[2/3] pointer-events-none shadow-xl border-2 border-white rounded-lg bg-white overflow-hidden
                                        min-[724px]:relative min-[724px]:bottom-auto min-[724px]:left-auto min-[724px]:w-1/2 min-[724px]:h-full min-[724px]:pointer-events-auto min-[724px]:border-r min-[724px]:border-gray-200 min-[724px]:shadow-none min-[724px]:rounded-none min-[724px]:aspect-auto
                                        lg:w-1/4">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <PreviewArea
                                    selectedParts={selectedParts}
                                    viewportInfo={viewportInfo}
                                    onViewportChange={setViewportInfo}
                                />
                            </div>
                        </div>

                        {/* CloseUp Area - Mobile: Full, Desktop: Right column */}
                        <div className="w-full h-full relative bg-gray-100 overflow-hidden shadow-inner
                                        min-[724px]:w-1/2 lg:flex-1">
                            <CloseUp
                                selectedParts={selectedParts}
                                onViewportChange={setViewportInfo}
                                viewportOverride={viewportInfo}
                                initialViewport={defaultZoom}
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

                {/* Right Column: Controls */}
                <div className="h-[35%] w-full flex-none bg-white overflow-hidden shadow-xl z-10 border-t border-gray-200
                                min-[724px]:h-[35%] min-[724px]:w-full
                                lg:w-[400px] lg:h-full lg:border-t-0 lg:border-l lg:flex-none">
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
