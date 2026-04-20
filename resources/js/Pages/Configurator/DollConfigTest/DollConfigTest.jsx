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
    // 1. Shared Logic & Network Pre-fetching (Only fetches files to cache, no CPU parsing)
    const { handle2DReady } = use3DPreload(views, defaultSettings);

    // 2. State
    const [activeTab, setActiveTab] = useState('customize');
    const [allSelections, setAllSelections] = useState({ front: {}, back: {} });
    const [currentView, setCurrentView] = useState('front');
    const [zoomLevel, setZoomLevel] = useState(100);
    const [viewportInfo, setViewportInfo] = useState(null);
    const [partPositions, setPartPositions] = useState(initialPartPositions || {});
    const [topSectionHeight, setTopSectionHeight] = useState(65);
    
    // Activity Tracker to prevent UI Jank
    const [canStartBackgroundWarming, setCanStartBackgroundWarming] = useState(false);
    const [transitionStartTime, setTransitionStartTime] = useState(null); // Real UX Metric
    const is3DMountedRef = useRef(false); // Track if 3D is already "warm"
    const idleTimerRef = useRef(null);
    const isDraggingRef = useRef(false);

    // Reset idle timer whenever user interacts with the 2D UI
    const resetIdleTimer = () => {
        if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
        // Only restart if we haven't warmed up yet
        if (!canStartBackgroundWarming) {
            idleTimerRef.current = setTimeout(() => {
                setCanStartBackgroundWarming(true);
            }, 3000); // Only 3 seconds of inactivity needed to start background GPU prep
        }
    };

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
        // Initial timer
        resetIdleTimer();

        // 3D Engine JS Pre-fetch (Load the code, stay idle on the parse)
        load3DEngine().then(() => {
            console.log("%c[System] %cMotor 3D listo para inicialización silenciosa.", "color: #9c27b0; font-weight: bold", "color: #666");
        });

        const handleMove = (e) => {
            resetIdleTimer(); // Mouse move resets the 10s window
            if (!isDraggingRef.current) return;
            const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
            const headerHeight = 60;
            const relativeY = clientY - headerHeight;
            const windowHeight = window.innerHeight;
            const contentHeight = windowHeight - headerHeight;
            const newPercentage = (relativeY / contentHeight) * 100;
            if (newPercentage >= 20 && newPercentage <= 95) setTopSectionHeight(newPercentage);
        };

        const handleUp = () => { isDraggingRef.current = false; };
        
        window.addEventListener('mousemove', handleMove);
        window.addEventListener('mousedown', resetIdleTimer);
        window.addEventListener('keydown', resetIdleTimer);
        window.addEventListener('mouseup', handleUp);
        window.addEventListener('touchmove', handleMove, { passive: false });
        window.addEventListener('touchend', handleUp);

        return () => {
            if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
            window.removeEventListener('mousemove', handleMove);
            window.removeEventListener('mousedown', resetIdleTimer);
            window.removeEventListener('keydown', resetIdleTimer);
            window.removeEventListener('mouseup', handleUp);
            window.removeEventListener('touchmove', handleMove);
            window.removeEventListener('touchend', handleUp);
        };
    }, [canStartBackgroundWarming]);

    const handleSavePosition = (data) => {
        const key = `${data.view}|${data.category}|${data.part_id}`;
        setPartPositions(prev => ({ ...prev, [key]: { x: data.x, y: data.y, scale: data.scale } }));
        axios.post(route('doll.settings.savePosition'), data);
    };

    const handleSelectPart = (category, item) => {
        resetIdleTimer(); // Clicking on a part resets the 10s window
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

    const handleTabChange = (tab) => {
        if (tab === 'ready') {
            const now = performance.now();
            if (is3DMountedRef.current) {
                // If already warmed, it's instant!
                console.log(`%c[UX Metric] %cTransición INSTANTÁNEA (Pre-warming activo): %c${Math.round(now - now)}ms`, "color: #2196F3; font-weight: bold", "color: #666", "color: #2196F3; font-weight: bold");
            } else {
                setTransitionStartTime(now); // Start UX stopwatch
            }
        }
        setActiveTab(tab);
    };

    return (
        <ConfiguratorLayout>
            <Head title="Doll Configurator | Test" />
            <ConfiguratorTabs activeTab={activeTab} setActiveTab={handleTabChange} />
            
            <div className="flex-none flex flex-col min-[724px]:flex-row min-[724px]:flex-wrap min-[724px]:content-start lg:flex-nowrap bg-gray-50 relative h-[calc(100vh-150px)] min-h-[650px] overflow-hidden">
                
                {/* 2D View (Customize) */}
                <div 
                    className="w-full h-full flex flex-col lg:flex-row flex-1"
                    style={{ 
                        opacity: activeTab === 'customize' ? 1 : 0, 
                        pointerEvents: activeTab === 'customize' ? 'auto' : 'none', 
                        position: activeTab === 'customize' ? 'relative' : 'absolute', 
                        inset: 0 
                    }}
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

                {/* 3D View (Ready Dolls) - Gated Mount */}
                <div 
                    className="flex-1 w-full h-full flex flex-col items-center justify-center bg-white z-30 relative overflow-hidden"
                    style={{ 
                        opacity: activeTab === 'ready' ? 1 : 0, 
                        pointerEvents: activeTab === 'ready' ? 'auto' : 'none', 
                        position: activeTab === 'ready' ? 'relative' : 'absolute', 
                        inset: 0 
                    }}
                >
                    {/* ONLY mount the 3D Viewer if the user switches to the tab OR if they are idle for 10s */}
                    {(activeTab === 'ready' || canStartBackgroundWarming) && (
                        <Suspense fallback={
                            <div className="flex flex-col items-center justify-center w-full h-full bg-white">
                                <div className="w-12 h-12 border-4 border-black/10 border-t-black rounded-full animate-spin mb-4"></div>
                                <p className="text-gray-500 font-medium font-outfit">Inicializando motor 3D...</p>
                            </div>
                        }>
                            <Mannequin3DViewer 
                                isActive={activeTab === 'ready'}
                                onModelMounted={() => {
                                    is3DMountedRef.current = true;
                                    if (transitionStartTime) {
                                        const totalTime = Math.round(performance.now() - transitionStartTime);
                                        console.log(`%c[UX Metric] %cTransición completada (Carga bajo demanda): %c${totalTime}ms`, "color: #2196F3; font-weight: bold", "color: #666", "color: #2196F3; font-weight: bold");
                                        setTransitionStartTime(null);
                                    } else {
                                        console.log("%c[System] %cEscena 3D pre-hidratada (GPU ready).", "color: #4CAF50; font-weight: bold", "color: #666");
                                    }
                                }} 
                            />
                        </Suspense>
                    )}
                </div>
            </div>
        </ConfiguratorLayout>
    );
}
