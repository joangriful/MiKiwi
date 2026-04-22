import React, { useMemo, useRef, useEffect } from 'react';
import { usePartOptimization } from '@/Components/Configurator/hooks/usePartOptimization';
import styles from './PreviewArea.module.css';

// Sub-component to handle individual layer optimization and rendering
const LayerImage = ({ layer, partPositions }) => {
    const { src, style } = usePartOptimization({
        item: {
            ...layer.item,
            id: layer.item.id,
            url: layer.originalUrl
        },
        partPositions,
        currentView: null,
        category: layer.category,
        showImages: true
    });

    if (!src) return null;

    const combinedStyle = {
        ...style,
        zIndex: layer.zIndex,
        mixBlendMode: layer.blendMode,
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        objectFit: 'contain',
        maxWidth: 'none'
    };

    return (
        <img
            src={src}
            alt={layer.key}
            fetchpriority="high"
            loading="eager"
            onLoad={() => layer.onLoad && layer.onLoad(layer.key)}
            className={styles.layerImage}
            style={combinedStyle}
        />
    );
};


export default function PreviewArea({ selectedParts, viewportInfo, onViewportChange, className = '', partPositions, onReady }) {

    // Flatten all layers
    const renderedLayers = useMemo(() => {
        const layers = [];

        Object.entries(selectedParts).forEach(([category, item]) => {
            if (!item) return;

            if (item.type === 'group' && item.layers) {
                item.layers.forEach(layer => {
                    layers.push({
                        key: `${category}-${item.id}-${layer.name}`,
                        originalUrl: layer.url,
                        zIndex: layer.zIndex ?? 0,
                        blendMode: layer.blendMode || 'normal',
                        category,
                        item: item
                    });
                });
            }
            else {
                layers.push({
                    key: `${category}-${item.id}`,
                    originalUrl: item.url || item.thumbnail,
                    zIndex: item.zIndex ?? 0,
                    blendMode: item.blendMode || 'normal',
                    category,
                    item: item
                });
            }
        });

        return layers.sort((a, b) => a.zIndex - b.zIndex);
    }, [selectedParts]);

    // Tracking for the ready signal
    const loadedLayers = useRef(new Set());
    const onReadyCalled = useRef(false);

    const handleLayerLoad = (key) => {
        loadedLayers.current.add(key);
        
        if (loadedLayers.current.size >= renderedLayers.length && !onReadyCalled.current) {
            onReadyCalled.current = true;
            if (typeof onReady === 'function') {
                onReady();
            }
        }
    };

    // Reset ready state if the number of layers changes significantly
    // (though usually we just want to know when the INITIAL doll is ready)
    useEffect(() => {
        if (renderedLayers.length === 0 && !onReadyCalled.current) {
            // Safety trigger: if no layers are rendered after 500ms, assume ready
            const timer = setTimeout(() => {
                if (!onReadyCalled.current) {
                    onReadyCalled.current = true;
                    if (typeof onReady === 'function') onReady();
                }
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [onReady, renderedLayers.length]);

    const containerRef = useRef(null);
    const draggingRef = useRef(false);
    const dragStartRef = useRef(null);

    // Manual Non-Passive Wheel Listener
    // Note: viewportInfo and onViewportChange might change on every render if parent creates new obj/func.
    // We need to access the LATEST versions inside the event listener.
    // So we use a ref to store them.
    const latestProps = useRef({ viewportInfo, onViewportChange });
    useEffect(() => {
        latestProps.current = { viewportInfo, onViewportChange };
    }, [viewportInfo, onViewportChange]);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const onWheel = (e) => {
            const { viewportInfo, onViewportChange } = latestProps.current;
            if (!viewportInfo || !onViewportChange) return;

            e.preventDefault();
            // e.stopPropagation(); // Optional? Maybe let page scroll if at edge? No, standard pan/zoom behavior usually consumes event.

            const newInfo = {
                ...viewportInfo,
                x: Math.max(0, Math.min(1 - viewportInfo.w, viewportInfo.x + (e.deltaX * 0.001))),
                y: Math.max(0, Math.min(1 - viewportInfo.h, viewportInfo.y + (e.deltaY * 0.001))),
                visible: true
            };
            onViewportChange(newInfo);
        };

        el.addEventListener('wheel', onWheel, { passive: false });

        return () => {
            el.removeEventListener('wheel', onWheel);
        };
    }, []); // Empty dep array = attach once. accessing props via ref.


    // Drag Handlers (Closure Pattern)
    const handleMouseDown = (e) => {
        const { viewportInfo } = latestProps.current;
        if (!viewportInfo) return;

        e.preventDefault();
        e.stopPropagation();

        dragStartRef.current = {
            startX: e.clientX,
            startY: e.clientY,
            initialX: viewportInfo.x,
            initialY: viewportInfo.y
        };
        draggingRef.current = true;

        const onMouseMove = (ev) => {
            if (!draggingRef.current || !dragStartRef.current || !containerRef.current) return;

            const { onViewportChange } = latestProps.current; // Access latest callback
            if (!onViewportChange) return;

            const { startX, startY, initialX, initialY } = dragStartRef.current;
            const container = containerRef.current;

            const deltaX = ev.clientX - startX;
            const deltaY = ev.clientY - startY;

            const percentX = deltaX / container.clientWidth;
            const percentY = deltaY / container.clientHeight;

            // We calculate based on Initial X/Y to avoid accumulation errors (standard drag pattern)
            // But we need the LATEST viewport width/height (which presumably doesn't change during drag?)
            // Actually viewportInfo.w/h comes from props.
            const currentViewport = latestProps.current.viewportInfo;

            const newInfo = {
                ...currentViewport,
                x: Math.max(0, Math.min(1 - currentViewport.w, initialX + percentX)),
                y: Math.max(0, Math.min(1 - currentViewport.h, initialY + percentY)),
                visible: true
            };

            onViewportChange(newInfo);
        };

        const onMouseUp = () => {
            draggingRef.current = false;
            dragStartRef.current = null;
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
    };


    return (
        <div
            ref={containerRef}
            className={[styles.root, className].filter(Boolean).join(' ')}
            onMouseDown={handleMouseDown}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                }
            }}
            aria-label="Vista previa de muñeca"
        >
            {renderedLayers.length === 0 && (
                <div className={styles.emptyState}>
                    Vista Previa
                </div>
            )}

            <div className={styles.canvas}>
                {renderedLayers.map(layer => (
                    <LayerImage
                        key={layer.key}
                        layer={{ ...layer, onLoad: handleLayerLoad }}
                        partPositions={partPositions}
                    />
                ))}
            </div>

            {/* Viewport Indicator Overlay */}
            {viewportInfo && viewportInfo.visible && (
                <div
                    className={styles.viewportIndicator}
                    style={{
                        top: `${viewportInfo.y * 100}%`,
                        left: `${viewportInfo.x * 100}%`,
                        width: `${viewportInfo.w * 100}%`,
                        height: `${viewportInfo.h * 100}%`
                    }}
                />
            )}
        </div>
    );
}
