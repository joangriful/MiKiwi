import React, { useState, useEffect, useMemo, useRef, Suspense, useCallback } from 'react';
import { Head, router } from '@inertiajs/react';
import axios from 'axios';
import ConfiguratorLayout from '@/Layouts/ConfiguratorLayout';
import DollSelectionSummary from '@/Components/Configurator/DollSelectionSummary/DollSelectionSummary';
import { use3DPreload } from '@/Components/Configurator/hooks/use3DPreload';
import { loadMannequin3DViewer } from '@/Components/Configurator/utils/lazyLoaders';
import {
    buildConfigurationPayload,
    calculateConfigurationTotal,
    ensurePreselectedSelections,
    filterHiddenPartsFromSelections,
    filterHiddenPartsFromViews,
    getCategoryLabel,
    getConfigurationEntries,
    getMissingRequiredCategories,
    getPartExtraPrice,
} from '@/Components/Configurator/utils/dollCustomization';
import LoadingScreen from '@/Components/Configurator/Common/LoadingScreen';
import PreviewArea from '@/Components/Configurator/PreviewArea/PreviewArea';
import PartSelector from '@/Components/Configurator/PartSelector/PartSelector';
import CloseUp from '@/Components/Configurator/CloseUp/CloseUp';
import OptionsBar from '@/Components/Configurator/OptionsBar/OptionsBar';
import useMediaQuery from '@/Hooks/useMediaQuery';
import styles from './DollConfigTest.module.css';

// Pre-load the 3D viewer chunk
const Mannequin3DViewer = React.lazy(loadMannequin3DViewer);
const DEFAULT_DOLL_BASE_PRICE = 2000;

export default function DollConfigTest({ views, defaultSettings, partPositions: initialPartPositions, dollProduct, configuratorRules }) {
    // 1. Shared Logic & Network Pre-fetching (Only fetches files to cache, no CPU parsing)
    const { handle2DReady } = use3DPreload(views, defaultSettings);

    // 2. State
    const sanitizedViews = useMemo(() => filterHiddenPartsFromViews(views || {}), [views]);
    const [activeTab, setActiveTab] = useState('customize');
    const [allSelections, setAllSelections] = useState({ front: {}, back: {} });
    const [currentView, setCurrentView] = useState('front');
    const [zoomLevel, setZoomLevel] = useState(100);
    const [viewportInfo, setViewportInfo] = useState(null);
    const [partPositions, setPartPositions] = useState(initialPartPositions || {});
    const [topSectionHeight, setTopSectionHeight] = useState(65);
    const [isSubmittingPurchase, setIsSubmittingPurchase] = useState(false);
    const [isSubmittingReadyDollPurchase, setIsSubmittingReadyDollPurchase] = useState(false);
    const [isAddingReadyDollToCart, setIsAddingReadyDollToCart] = useState(false);
    const [addedReadyDollSlug, setAddedReadyDollSlug] = useState(null);
    
    // Activity Tracker to prevent UI Jank
    const [canStartBackgroundWarming, setCanStartBackgroundWarming] = useState(false);
    const [transitionStartTime, setTransitionStartTime] = useState(null); // Real UX Metric
    const is3DMountedRef = useRef(false); // Track if 3D is already "warm"
    const idleTimerRef = useRef(null);
    const isDraggingRef = useRef(false);
    const isCompactPreview = useMediaQuery('(max-width: 723px)');
    const isStackedEditor = useMediaQuery('(max-width: 1023px)');

    const handleDragStart = () => {
        isDraggingRef.current = true;
    };

    // Reset idle timer whenever user interacts with the 2D UI
    const resetIdleTimer = useCallback(() => {
        if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
        // Only restart if we haven't warmed up yet
        if (!canStartBackgroundWarming) {
            idleTimerRef.current = setTimeout(() => {
                setCanStartBackgroundWarming(true);
            }, 3000); // Only 3 seconds of inactivity needed to start background GPU prep
        }
    }, [canStartBackgroundWarming]);

    // 3. Sync & Handlers
    useEffect(() => {
        if (initialPartPositions && Object.keys(initialPartPositions).length > 0) {
            setPartPositions(initialPartPositions);
        }
    }, [initialPartPositions]);

    useEffect(() => {
        const defaults = defaultSettings?.selections || { front: {}, back: {} };
        const normalizedDefaults = defaults.front || defaults.back ? defaults : { front: defaults, back: {} };
        setAllSelections(ensurePreselectedSelections(sanitizedViews, filterHiddenPartsFromSelections(normalizedDefaults), configuratorRules));
    }, [defaultSettings, sanitizedViews, configuratorRules]);

    useEffect(() => {
        // Initial timer
        resetIdleTimer();

        // 3D Engine JS Pre-fetch (Load the code, stay idle on the parse)
        loadMannequin3DViewer().then(() => {
            console.warn("%c[System] %cMotor 3D listo para inicialización silenciosa.", "color: #9c27b0; font-weight: bold", "color: #666");
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
    }, [canStartBackgroundWarming, resetIdleTimer]);

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
            const isLockedCategory = configuratorRules?.preselectedCategories?.includes(category);

            if (!item) {
                if (isLockedCategory) {
                    return prev;
                }

                delete current[category];
            } else {
                current[category] = item;
            }

            next[currentView] = current;
            return ensurePreselectedSelections(sanitizedViews, next, configuratorRules);
        });
    };

    // 4. Selectors
    const availableParts = useMemo(() => sanitizedViews?.[currentView] || {}, [sanitizedViews, currentView]);
    const selectedParts = useMemo(() => allSelections[currentView] || {}, [allSelections, currentView]);
    const sectionOrder = useMemo(() => defaultSettings?.sectionOrder || [], [defaultSettings]);
    const defaultZoom = useMemo(() => defaultSettings?.zoom || null, [defaultSettings]);
    const configurationEntries = useMemo(() => getConfigurationEntries(allSelections, configuratorRules), [allSelections, configuratorRules]);
    const missingRequiredCategories = useMemo(
        () => getMissingRequiredCategories(allSelections, configuratorRules, sanitizedViews).map(getCategoryLabel),
        [allSelections, configuratorRules, sanitizedViews],
    );
    const baseDollPrice = Number(dollProduct?.base_price ?? DEFAULT_DOLL_BASE_PRICE);
    const totals = useMemo(
        () => calculateConfigurationTotal(baseDollPrice, configurationEntries),
        [baseDollPrice, configurationEntries],
    );
    const canPurchase = Boolean(dollProduct?.slug) && missingRequiredCategories.length === 0;
    const purchaseDisabledReason = !dollProduct?.slug
        ? 'No hay una muñeca configurable disponible para compra en este momento.'
        : missingRequiredCategories.length > 0
            ? 'Completa todas las categorias obligatorias para comprar tu muñeca.'
            : null;

    if (!views || !defaultSettings) return <LoadingScreen />;

    const handleResetSelections = () => {
        const defaults = defaultSettings?.selections || { front: {}, back: {} };
        const normalizedDefaults = defaults.front || defaults.back ? defaults : { front: defaults, back: {} };
        setAllSelections(ensurePreselectedSelections(sanitizedViews, filterHiddenPartsFromSelections(normalizedDefaults), configuratorRules));
    };

    const handlePurchase = async () => {
        if (!canPurchase || !dollProduct?.slug) {
            return;
        }

        setIsSubmittingPurchase(true);

        try {
            const payload = {
                product_slug: dollProduct.slug,
                quantity: 1,
                configuration: buildConfigurationPayload(allSelections),
            };

            const { data } = await axios.post(route('cart.buy-now'), payload);

            window.location.href = data.redirect || route('cart.index', { buy_now: 1 });
        } catch (error) {
            console.error('No pudimos preparar la compra de la muñeca:', error);
            setIsSubmittingPurchase(false);
        }
    };

    const addReadyDollToCart = (productSlug) => axios.post(route('cart.add'), {
        product_slug: productSlug,
        quantity: 1,
    });

    const handleReadyDollPurchase = async (productSlug) => {
        if (!productSlug) {
            return;
        }

        setIsSubmittingReadyDollPurchase(true);

        try {
            await addReadyDollToCart(productSlug);
            router.visit(route('cart.index'));
        } catch (error) {
            console.error('No pudimos agregar la muñeca al carrito:', error);
            setIsSubmittingReadyDollPurchase(false);
        }
    };

    const handleReadyDollAddToCart = async (productSlug) => {
        if (!productSlug) {
            return;
        }

        setIsAddingReadyDollToCart(true);
        setAddedReadyDollSlug(null);

        try {
            await addReadyDollToCart(productSlug);
            setAddedReadyDollSlug(productSlug);
        } catch (error) {
            console.error('No pudimos agregar la muñeca al carrito:', error);
        } finally {
            setIsAddingReadyDollToCart(false);
        }
    };

    const handleTabChange = (tab) => {
        if (tab === 'ready') {
            const now = performance.now();
            if (is3DMountedRef.current) {
                // If already warmed, it's instant!
                console.warn(`%c[UX Metric] %cTransición INSTANTÁNEA (Pre-warming activo): %c${Math.round(now - now)}ms`, "color: #2196F3; font-weight: bold", "color: #666", "color: #2196F3; font-weight: bold");
            } else {
                setTransitionStartTime(now); // Start UX stopwatch
            }
        }
        setActiveTab(tab);
    };

    return (
        <ConfiguratorLayout>
            <Head title="Configurador de muñecas" />

            {/* Static Header with Tabs */}
            <div className={`${styles.root} ${styles.header}`}>
                <div className={styles.tabsBar}>
                    <div className={styles.tabsInner}>
                        <button
                            type="button"
                            onClick={() => handleTabChange('customize')}
                            className={`${styles.tabButton} ${activeTab === 'customize' ? styles.tabButtonActive : ''}`}
                        >
                            PERSONALIZAR
                        </button>
                        <button
                            type="button"
                            onClick={() => handleTabChange('ready')}
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
                                        bottom: isCompactPreview ? `calc(${100 - topSectionHeight}% + 1rem)` : undefined
                                    }}
                                >
                                    <div className={styles.previewContent}>
                                        <PreviewArea
                                            selectedParts={selectedParts}
                                            viewportInfo={viewportInfo}
                                            onViewportChange={setViewportInfo}
                                            className={styles.previewArea}
                                            partPositions={partPositions}
                                            onReady={handle2DReady}
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
                        {isStackedEditor && (
                            <button
                                type="button"
                                onMouseDown={handleDragStart}
                                onTouchStart={handleDragStart}
                                className={styles.dragHandle}
                                style={{ bottom: `${100 - topSectionHeight}%`, transform: 'translateY(50%)' }}
                                aria-label="Ajustar altura del panel"
                            >
                                <div className={styles.dragHandleKnob} />
                            </button>
                        )}

                        {/* Right Column: Options Bar + Controls */}
                        <div
                            className={styles.rightColumn}
                            style={{ height: isStackedEditor ? `${100 - topSectionHeight}%` : '100%' }}
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
                                <div className={styles.selectorContent}>
                                    <PartSelector
                                        parts={availableParts}
                                        selectedParts={selectedParts}
                                        onSelect={handleSelectPart}
                                        sectionOrder={sectionOrder}
                                        showImages={true}
                                        partPositions={partPositions}
                                        currentView={currentView}
                                        onSavePosition={handleSavePosition}
                                        clearDisabledCategories={configuratorRules?.preselectedCategories || []}
                                        getItemPrice={(category, item) => getPartExtraPrice(category, item, configuratorRules)}
                                    />
                                    <DollSelectionSummary
                                        dollProduct={dollProduct}
                                        baseDollPrice={baseDollPrice}
                                        entries={configurationEntries}
                                        totals={totals}
                                        missingCategories={missingRequiredCategories}
                                        canPurchase={canPurchase}
                                        purchaseDisabledReason={purchaseDisabledReason}
                                        onReset={handleResetSelections}
                                        onPurchase={handlePurchase}
                                        isSubmitting={isSubmittingPurchase}
                                    />
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className={styles.readyView}>
                        <Suspense fallback={
                            <div className={styles.viewerLoading}>
                                <div className={styles.viewerSpinner} />
                                <p className={styles.viewerText}>Inicializando motor 3D...</p>
                            </div>
                        }>
                            <Mannequin3DViewer 
                                isActive={activeTab === 'ready'}
                                onBuyDoll={handleReadyDollPurchase}
                                onAddDollToCart={handleReadyDollAddToCart}
                                isBuyingDoll={isSubmittingReadyDollPurchase}
                                isAddingDollToCart={isAddingReadyDollToCart}
                                addedDollSlug={addedReadyDollSlug}
                                onModelMounted={() => {
                                    is3DMountedRef.current = true;
                                    if (transitionStartTime) {
                                        const totalTime = Math.round(performance.now() - transitionStartTime);
                                        console.warn(`%c[UX Metric] %cTransición completada (Carga bajo demanda): %c${totalTime}ms`, "color: #2196F3; font-weight: bold", "color: #666", "color: #2196F3; font-weight: bold");
                                        setTransitionStartTime(null);
                                    } else {
                                        console.warn("%c[System] %cEscena 3D pre-hidratada (GPU ready).", "color: #4CAF50; font-weight: bold", "color: #666");
                                    }
                                }} 
                            />
                        </Suspense>
                    </div>
                )}
            </div>
        </ConfiguratorLayout>
    );
}
