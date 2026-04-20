import React, { useState, useEffect, useMemo, useRef, Suspense } from 'react';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import ConfiguratorLayout from '@/Layouts/ConfiguratorLayout';
import { use3DPreload } from '@/Components/Configurator/hooks/use3DPreload';
import ConfiguratorTabs from '@/Components/Configurator/Common/ConfiguratorTabs';
import MainEditorLayout from '@/Components/Configurator/Common/MainEditorLayout';
import LoadingScreen from '@/Components/Configurator/Common/LoadingScreen';

// Pre-load the 3D viewer chunk
const load3DEngine = () => import('@/Components/Configurator/Mannequin3DViewer/Mannequin3DViewer');
const Mannequin3DViewer = React.lazy(load3DEngine);

export default function DollConfigTest({ views, defaultSettings, partPositions: initialPartPositions }) {
    // 1. Shared Logic & Preloading
    const { handle2DReady } = use3DPreload(views, defaultSettings);

    // 2. State
    const [activeTab, setActiveTab] = useState('customize');
    const [allSelections, setAllSelections] = useState({ front: {}, back: {} });
    const [currentView, setCurrentView] = useState('front');
    const [zoomLevel, setZoomLevel] = useState(100);
    const [viewportInfo, setViewportInfo] = useState(null);
    const [partPositions, setPartPositions] = useState(initialPartPositions || {});
    const [topSectionHeight, setTopSectionHeight] = useState(65);
    const isDraggingRef = useRef(false);

    // 3. Sync & Handlers
    useEffect(() => {
        if (initialPartPositions && Object.keys(initialPartPositions).length > 0) {
            setPartPositions(initialPartPositions);
        }
    }, [initialPartPositions]);

    useEffect(() => {
        const defaults = defaultSettings?.selections || { front: {}, back: {} };
        setAllSelections(defaults.front || defaults.back ? defaults : { front: defaults, back: {} });
    }, [defaultSettings]);

    useEffect(() => {
        const handleMove = (e) => {
            if (!isDraggingRef.current) return;
            const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
            const headerHeight = 60;
            const relativeY = clientY - headerHeight;
            const contentHeight = window.innerHeight - headerHeight;
            const newPercentage = (relativeY / contentHeight) * 100;
            if (newPercentage >= 20 && newPercentage <= 95) setTopSectionHeight(newPercentage);
        };
        const handleUp = () => { isDraggingRef.current = false; };
        window.addEventListener('mousemove', handleMove);
        window.addEventListener('mouseup', handleUp);
        window.addEventListener('touchmove', handleMove, { passive: false });
        window.addEventListener('touchend', handleUp);
        return () => {
            window.removeEventListener('mousemove', handleMove);
            window.removeEventListener('mouseup', handleUp);
            window.removeEventListener('touchmove', handleMove);
            window.removeEventListener('touchend', handleUp);
        };
    }, []);

    const handleSavePosition = (data) => {
        const key = `${data.view}|${data.category}|${data.part_id}`;
        setPartPositions(prev => ({ ...prev, [key]: { x: data.x, y: data.y, scale: data.scale } }));
        axios.post(route('doll.settings.savePosition'), data).catch(err => alert(`Error: ${err.message}`));
    };

    const handleSelectPart = (category, item) => {
        setAllSelections(prev => {
            const next = { ...prev };
            const current = { ...(next[currentView] || {}) };
            if (!item) delete current[category]; else current[category] = item;
            next[currentView] = current;
            return next;
        });
    };

    // 4. Selectors
    const availableParts = useMemo(() => views?.[currentView] || {}, [views, currentView]);
    const selectedParts = useMemo(() => allSelections[currentView] || {}, [allSelections, currentView]);
    const sectionOrder = useMemo(() => defaultSettings?.sectionOrder || [], [defaultSettings]);
    const defaultZoom = useMemo(() => defaultSettings?.zoom || null, [defaultSettings]);

    if (!views || !defaultSettings) return <LoadingScreen />;

    return (
        <ConfiguratorLayout>
            <Head title="Doll Configurator | Test" />
            <ConfiguratorTabs activeTab={activeTab} setActiveTab={setActiveTab} />
            
            {/* Shared Layout Container with Persistent Rendering */}
            <div className="flex-none flex flex-col min-[724px]:flex-row min-[724px]:flex-wrap min-[724px]:content-start lg:flex-nowrap bg-gray-50 relative h-[calc(100vh-150px)] min-h-[650px] overflow-hidden">
                
                {/* 2D View (Customize) */}
                <div 
                    className="w-full h-full flex flex-col lg:flex-row flex-1"
                    style={{ display: activeTab === 'customize' ? 'flex' : 'none' }}
                >
                    <MainEditorLayout
                        topSectionHeight={topSectionHeight}
                        handleDragStart={() => { isDraggingRef.current = true; }}
                        selectedParts={selectedParts}
                        viewportInfo={viewportInfo}
                        setViewportInfo={setViewportInfo}
                        partPositions={partPositions}
                        handle2DReady={handle2DReady}
                        defaultZoom={defaultZoom}
                        zoomLevel={zoomLevel}
                        setZoomLevel={setZoomLevel}
                        currentView={currentView}
                        setCurrentView={setCurrentView}
                        availableParts={availableParts}
                        handleSelectPart={handleSelectPart}
                        sectionOrder={sectionOrder}
                        handleSavePosition={handleSavePosition}
                    />
                </div>

                {/* 3D View (Ready Dolls) - Persistent Mounting */}
                <div 
                    className="flex-1 w-full h-full flex flex-col items-center justify-center bg-white z-30 relative overflow-hidden"
                    style={{ display: activeTab === 'ready' ? 'flex' : 'none' }}
                >
                    <Suspense fallback={
                        <div className="flex flex-col items-center justify-center w-full h-full bg-white">
                            <div className="w-12 h-12 border-4 border-black/10 border-t-black rounded-full animate-spin mb-4"></div>
                            <p className="text-gray-500 font-medium font-outfit">Preparando visor 3D...</p>
                        </div>
                    }>
                        <Mannequin3DViewer />
                    </Suspense>
                </div>
            </div>
        </ConfiguratorLayout>
    );
}
