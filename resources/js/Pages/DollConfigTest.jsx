import React, { useState, useEffect, useMemo, useRef, Suspense, lazy } from 'react';
import { Head, router } from '@inertiajs/react';
import axios from 'axios';
import PreviewArea from '@/Components/DollConfigurator/PreviewArea';
import PartSelector from '@/Components/DollConfigurator/PartSelector';
import CloseUp from '@/Components/DollConfigurator/CloseUp';
import OptionsBar from '@/Components/DollConfigurator/OptionsBar';
import Header from '@/Components/Common/Header';
import Footer from '@/Components/Common/Footer';

// Lazy load the correct 3D viewer
const Mannequin3DViewer = lazy(() => import('@/Components/DollConfigurator/Mannequin3DViewer'));

export default function DollConfigTest({ views, defaultSettings, partPositions: initialPartPositions }) {
    const [activeTab, setActiveTab] = useState('customize'); // 'customize' or 'ready'
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

            const relativeY = clientY - headerHeight;

            if (relativeY < 0) return;
            if (relativeY > contentHeight) return;

            const newPercentage = (relativeY / contentHeight) * 100;

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

            if (!item) {
                delete currentViewSelections[category];
            } else {
                currentViewSelections[category] = item;
            }
            next[currentView] = currentViewSelections;

            return next;
        });
    };

    const selectedParts = useMemo(() => {
        return allSelections[currentView] || {};
    }, [allSelections, currentView]);

    const sectionOrder = useMemo(() => {
        return defaultSettings?.sectionOrder || [];
    }, [defaultSettings]);

    return (
        <div className="flex flex-col min-h-screen bg-[var(--bg-main)]">
            <Head title="Doll Configurator" />

            {/* Static Header with Tabs */}
            <div className="z-50 bg-white border-b border-gray-100">
                <Header />
                <div className="flex justify-center border-t border-[var(--border)] bg-[var(--bg-surface)] py-4">
                    <div className="inline-flex p-1.5 bg-[var(--bg-main)] rounded-2xl shadow-inner border border-[var(--border)]/50">
                        <button
                            onClick={() => setActiveTab('customize')}
                            className={`px-8 py-2.5 rounded-xl text-sm font-bold tracking-wide transition-all duration-300 ${activeTab === 'customize'
                                ? 'bg-[var(--premium-gradient)] text-white shadow-[0_4px_15px_rgba(153,184,73,0.4)] scale-105'
                                : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-white/50'
                                }`}
                        >
                            PERSONALIZAR
                        </button>
                        <button
                            onClick={() => setActiveTab('ready')}
                            className={`px-8 py-2.5 rounded-xl text-sm font-bold tracking-wide transition-all duration-300 ${activeTab === 'ready'
                                ? 'bg-[var(--premium-gradient)] text-white shadow-[0_4px_15px_rgba(153,184,73,0.4)] scale-105'
                                : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-white/50'
                                }`}
                        >
                            MUÑECAS LISTAS
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Layout */}
            <div className="flex-none flex flex-col min-[724px]:flex-row min-[724px]:flex-wrap min-[724px]:content-start lg:flex-nowrap bg-gray-50 cursor-default select-none touch-none relative h-[calc(100vh-150px)] min-h-[650px]">

                {activeTab === 'customize' ? (
                    <>
                        {/* Left Content Area (Images ONLY) */}
                        <div
                            className="flex flex-col w-full h-full min-[724px]:w-full lg:w-auto lg:h-full lg:flex-1 border-r border-gray-200 bg-white shadow-xl lg:shadow-none z-20"
                        >

                            {/* Images Row */}
                            <div className="flex-1 flex relative overflow-hidden">

                                {/* Preview Area */}
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
                                            partPositions={partPositions}
                                        />
                                    </div>
                                </div>

                                {/* CloseUp Area */}
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
                                <div className="w-12 h-1.5 bg-gray-300 rounded-full shadow-sm mx-auto" />
                            </div>
                        )}

                        {/* Right Column: Options Bar + Controls */}
                        <div
                            className="absolute bottom-0 left-0 w-full flex flex-col bg-gradient-to-b from-[var(--bg-surface)] to-[var(--bg-main)] backdrop-blur-2xl z-40 border-t border-[var(--border)]
                                       min-[724px]:w-full
                                       lg:relative lg:w-[420px] lg:h-full lg:border-t-0 lg:border-l lg:border-[var(--border)] lg:flex-none transition-all duration-500 ease-premium shadow-[-20px_0_50px_rgba(0,0,0,0.05)]"
                            style={{ height: window.innerWidth < 1024 ? `${100 - topSectionHeight}%` : '100%' }}
                        >
                            <div className="flex-none z-[60] relative">
                                <OptionsBar
                                    currentView={currentView}
                                    onViewChange={setCurrentView}
                                    zoomLevel={zoomLevel}
                                    onZoomChange={setZoomLevel}
                                    bgColor="bg-transparent"
                                />
                            </div>

                            <div className="flex-1 overflow-hidden">
                                <PartSelector
                                    parts={availableParts}
                                    selectedParts={selectedParts}
                                    onSelect={handleSelectPart}
                                    sectionOrder={sectionOrder}
                                    showImages={true}
                                    partPositions={partPositions}
                                    currentView={currentView}
                                    onSavePosition={handleSavePosition}
                                />
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 w-full h-full flex flex-col items-center justify-center bg-white z-30 relative">
                        <Suspense fallback={
                            <div className="flex flex-col items-center justify-center w-full h-full bg-white">
                                <div className="w-12 h-12 border-4 border-black/10 border-t-black rounded-full animate-spin mb-4"></div>
                                <p className="text-gray-500 font-medium font-outfit">Cargando visor 3D...</p>
                            </div>
                        }>
                            <Mannequin3DViewer />
                        </Suspense>
                    </div>
                )}

            </div>
            <Footer />
        </div>
    );
}
