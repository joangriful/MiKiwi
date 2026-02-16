import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Head, router } from '@inertiajs/react';
import axios from 'axios';
import PreviewArea from '@/Components/DollConfigurator/PreviewArea';
import PartSelector from '@/Components/DollConfigurator/PartSelector';
import CloseUp from '@/Components/DollConfigurator/CloseUp';
import OptionsBar from '@/Components/DollConfigurator/OptionsBar';
import Header from '@/Components/Common/Header';

export default function DollConfigTest({ views, defaultSettings, partPositions: initialPartPositions }) {
    const [allSelections, setAllSelections] = useState({ front: {}, back: {} });
    const [currentView, setCurrentView] = useState('front');
    const [zoomLevel, setZoomLevel] = useState(100);
    const [viewportInfo, setViewportInfo] = useState(null);

    // Lifted State for Positions (Optimistic UI)
    const [partPositions, setPartPositions] = useState(initialPartPositions || {});

    // Resizable layout state
    const [topSectionHeight, setTopSectionHeight] = useState(65); // Percentage
    const isDraggingRef = useRef(false);

    const handleDragStart = (e) => {
        isDraggingRef.current = true;
    };

    const handleSavePosition = (data) => {
        const key = `${data.view}|${data.category}|${data.part_id}`;

        // Optimistic Update
        const oldPositions = { ...partPositions };
        setPartPositions(prev => ({
            ...prev,
            [key]: { x: data.x, y: data.y, scale: data.scale }
        }));

        axios.post(route('doll.settings.savePosition'), data)
            .then(() => {
                console.log('Position saved successfully');
            })
            .catch(err => {
                console.error(err);
                // Revert on failure
                setPartPositions(oldPositions);
                alert(`Error al guardar: ${err.response?.data?.message || err.message}`);
            });
    };

    useEffect(() => {
        const handleMove = (e) => {
            if (!isDraggingRef.current) return;

            const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
            const headerHeight = 60; // Approximate header height
            const windowHeight = window.innerHeight;
            const contentHeight = windowHeight - headerHeight;

            // Calculate percentage relative to the CONTENT area (below header)
            // relativeY is distance from bottom of header
            const relativeY = clientY - headerHeight;

            // Clamp relativeY
            if (relativeY < 0) return;
            if (relativeY > contentHeight) return;

            const newPercentage = (relativeY / contentHeight) * 100;

            // Constrain between 20% and 95% (allows hiding PartSelector almost completely)
            if (newPercentage >= 20 && newPercentage <= 95) {
                setTopSectionHeight(newPercentage);
            }
        };

        const handleUp = () => {
            isDraggingRef.current = false;
        };

        window.addEventListener('mousemove', handleMove);
        window.addEventListener('mouseup', handleUp);
        window.addEventListener('touchmove', handleMove);
        window.addEventListener('touchend', handleUp);

        return () => {
            window.removeEventListener('mousemove', handleMove);
            window.removeEventListener('mouseup', handleUp);
            window.removeEventListener('touchmove', handleMove);
            window.removeEventListener('touchend', handleUp);
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
            return {};
        }
        return views[currentView] || {};
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

    // Get section order from settings
    const sectionOrder = useMemo(() => {
        return defaultSettings?.sectionOrder || [];
    }, [defaultSettings]);

    return (
        <div className="flex flex-col h-screen overflow-hidden">
            <Head title="Doll Configurator" />

            {/* Static Header */}
            <div className="z-50 bg-white">
                <Header />
            </div>

            {/* Main Layout */}
            <div className="flex-1 flex flex-col min-[724px]:flex-row min-[724px]:flex-wrap min-[724px]:content-start lg:flex-nowrap bg-gray-50 overflow-hidden cursor-default select-none touch-none relative">

                {/* Left Content Area (Images ONLY) */}
                <div
                    className="flex flex-col w-full h-full min-[724px]:w-full lg:w-auto lg:h-full lg:flex-1 border-r border-gray-200 bg-white shadow-xl lg:shadow-none z-20"
                >

                    {/* Images Row */}
                    <div className="flex-1 flex relative overflow-hidden">

                        {/* Preview Area - Mobile: PIP overlay, Desktop: Left column */}
                        <div
                            className="absolute left-4 z-50 w-24 h-auto aspect-[2/3] pointer-events-none shadow-xl border-2 border-white rounded-lg bg-white overflow-hidden transition-all duration-75 ease-linear
                                       min-[724px]:relative min-[724px]:bottom-auto min-[724px]:left-auto min-[724px]:w-1/2 min-[724px]:h-full min-[724px]:pointer-events-auto min-[724px]:border-r min-[724px]:border-gray-200 min-[724px]:shadow-none min-[724px]:rounded-none min-[724px]:aspect-auto
                                       lg:w-1/4"
                            style={{
                                bottom: window.innerWidth < 724 ? `calc(${100 - topSectionHeight}% + 1rem)` : undefined
                            }}
                        >
                            <div className="absolute inset-0 flex items-center justify-center">
                                <PreviewArea
                                    selectedParts={selectedParts}
                                    viewportInfo={viewportInfo}
                                    onViewportChange={setViewportInfo}
                                    className="bg-white"
                                    partPositions={partPositions} // Lifted State
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
                </div>

                {/* Drag Handle - Mobile/Tablet Only */}
                {window.innerWidth < 1024 && (
                    <div
                        onMouseDown={handleDragStart}
                        onTouchStart={handleDragStart}
                        className="absolute w-full h-8 z-50 flex items-center justify-center cursor-row-resize touch-none"
                        style={{ bottom: `${100 - topSectionHeight}%`, transform: 'translateY(50%)' }}
                    >
                        {/* Visible Handle */}
                        <div className="w-12 h-1.5 bg-gray-300 rounded-full shadow-sm mx-auto" />
                    </div>
                )}

                {/* Right Column: Options Bar + Controls */}
                <div
                    className="absolute bottom-0 left-0 w-full flex flex-col bg-black/50 backdrop-blur-md z-40 border-t border-white/10
                               min-[724px]:w-full
                               lg:relative lg:w-[400px] lg:h-full lg:border-t-0 lg:border-l lg:border-white/10 lg:flex-none transition-[height] duration-0 ease-linear"
                    style={{ height: window.innerWidth < 1024 ? `${100 - topSectionHeight}%` : '100%' }}
                >
                    {/* Options Bar - Moved here */}
                    <div className="flex-none z-[60] relative">
                        <OptionsBar
                            currentView={currentView}
                            onViewChange={setCurrentView}
                            zoomLevel={zoomLevel}
                            onZoomChange={setZoomLevel}
                            bgColor="bg-transparent"
                        />
                    </div>

                    {/* Part Selector - Takes remaining height */}
                    <div className="flex-1 overflow-hidden">
                        <PartSelector
                            parts={availableParts}
                            selectedParts={selectedParts}
                            onSelect={handleSelectPart}
                            sectionOrder={sectionOrder}
                            showImages={true}
                            partPositions={partPositions} // Lifted State
                            currentView={currentView}
                            onSavePosition={handleSavePosition} // Optimistic Handler
                        />
                    </div>
                </div>

            </div>
        </div>
    );
}
