import React, { useState, useEffect, useMemo, useRef, Suspense, lazy } from 'react';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import ConfiguratorLayout from '@/Layouts/ConfiguratorLayout';
import PreviewArea from '@/Components/Configurator/PreviewArea/PreviewArea';
import PartSelector from '@/Components/Configurator/PartSelector/PartSelector';
import CloseUp from '@/Components/Configurator/CloseUp/CloseUp';
import OptionsBar from '@/Components/Configurator/OptionsBar/OptionsBar';
import styles from './DollConfigTest.module.css';

// Lazy load the correct 3D viewer
const Mannequin3DViewer = lazy(() => import('@/Components/Configurator/Mannequin3DViewer/Mannequin3DViewer'));

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
        <ConfiguratorLayout>
            <Head title="Doll Configurator" />

            {/* Static Header with Tabs */}
            <div className={`${styles.root} ${styles.header}`}>
                <div className={styles.tabsBar}>
                    <div className={styles.tabsInner}>
                        <button
                            type="button"
                            onClick={() => setActiveTab('customize')}
                            className={`${styles.tabButton} ${activeTab === 'customize' ? styles.tabButtonActive : ''}`}
                        >
                            PERSONALIZAR
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('ready')}
                            className={`${styles.tabButton} ${activeTab === 'ready' ? styles.tabButtonActive : ''}`}
                        >
                            MUÑECAS LISTAS
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Layout */}
            <div className={styles.mainLayout}>

                {activeTab === 'customize' ? (
                    <>
                        {/* Left Content Area (Images ONLY) */}
                        <div className={styles.leftColumn}>

                            {/* Images Row */}
                            <div className={styles.imagesRow}>

                                {/* Preview Area */}
                                <div
                                    className={styles.previewPanel}
                                    style={{
                                        bottom: window.innerWidth < 724 ? `calc(${100 - topSectionHeight}% + 1rem)` : undefined
                                    }}
                                >
                                    <div className={styles.previewContent}>
                                        <PreviewArea
                                            selectedParts={selectedParts}
                                            viewportInfo={viewportInfo}
                                            onViewportChange={setViewportInfo}
                                            className={styles.previewArea}
                                            partPositions={partPositions}
                                        />
                                    </div>
                                </div>

                                {/* CloseUp Area */}
                                <div className={styles.closeUpPanel}>
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
                                className={styles.dragHandle}
                                style={{ bottom: `${100 - topSectionHeight}%`, transform: 'translateY(50%)' }}
                            >
                                <div className={styles.dragHandleKnob} />
                            </div>
                        )}

                        {/* Right Column: Options Bar + Controls */}
                        <div
                            className={styles.rightColumn}
                            style={{ height: window.innerWidth < 1024 ? `${100 - topSectionHeight}%` : '100%' }}
                        >
                            <div className={styles.optionsBarShell}>
                                <OptionsBar
                                    currentView={currentView}
                                    onViewChange={setCurrentView}
                                    zoomLevel={zoomLevel}
                                    onZoomChange={setZoomLevel}
                                    surface="transparent"
                                />
                            </div>

                            <div className={styles.selectorShell}>
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
                    <div className={styles.readyView}>
                        <Suspense fallback={
                            <div className={styles.viewerLoading}>
                                <div className={styles.viewerSpinner}></div>
                                <p className={styles.viewerText}>Cargando visor 3D...</p>
                            </div>
                        }>
                            <Mannequin3DViewer />
                        </Suspense>
                    </div>
                )}

            </div>
        </ConfiguratorLayout>
    );
}
