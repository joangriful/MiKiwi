import React, { useMemo, useRef, useEffect } from 'react';
import { getCloudinaryUrl } from '@/Utils/cloudinary';

export default function PreviewArea({ selectedParts, viewportInfo, onViewportChange }) {
    // ... (logic remains same) ...

    // Flatten all layers from all selected parts
    const renderedLayers = useMemo(() => {
        // ... (same logic) ...
        const layers = [];
        Object.entries(selectedParts).forEach(([category, item]) => {
            if (!item || !item.layers) return;
            item.layers.forEach((layer) => {
                layers.push({
                    key: `${category}-${item.id}-${layer.name}`,
                    url: getCloudinaryUrl(layer.url, { transformations: 'f_auto,q_auto' }),
                    originalUrl: layer.url, // Keep original for reference if needed
                    zIndex: layer.zIndex ?? 0,
                    blendMode: layer.blendMode || 'normal',
                    category
                });
            });
        });
        return layers.sort((a, b) => a.zIndex - b.zIndex);
    }, [selectedParts]);

    const handleWheel = (e) => {
        if (!viewportInfo || !onViewportChange) return;
        e.preventDefault();

        // Pan logic: Move viewport opposite to scroll direction (natural feel) or same?
        // Standard scroll: wheel down -> move view down (increase Y).

        // Sensitivity factor
        const factor = 0.05;

        const newInfo = {
            ...viewportInfo,
            x: Math.max(0, Math.min(1 - viewportInfo.w, viewportInfo.x + (e.deltaX * 0.001))),
            y: Math.max(0, Math.min(1 - viewportInfo.h, viewportInfo.y + (e.deltaY * 0.001))),
            visible: true // Keep visible while scrolling
        };
        onViewportChange(newInfo);
    };

    // Drag Logic
    const dragStartRef = useRef(null);
    const containerRef = useRef(null);

    const handleMouseDown = (e) => {
        if (!viewportInfo) return;
        e.preventDefault();
        e.stopPropagation();

        dragStartRef.current = {
            startX: e.clientX,
            startY: e.clientY,
            initialX: viewportInfo.x,
            initialY: viewportInfo.y
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    };

    const handleMouseMove = (e) => {
        if (!dragStartRef.current || !containerRef.current || !onViewportChange) return;

        const { startX, startY, initialX, initialY } = dragStartRef.current;
        const container = containerRef.current;

        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;

        // Convert pixels to percentage
        const percentX = deltaX / container.clientWidth;
        const percentY = deltaY / container.clientHeight;

        const newInfo = {
            ...viewportInfo,
            x: Math.max(0, Math.min(1 - viewportInfo.w, initialX + percentX)),
            y: Math.max(0, Math.min(1 - viewportInfo.h, initialY + percentY)),
            visible: true
        };

        onViewportChange(newInfo);
    };

    const handleMouseUp = () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
        dragStartRef.current = null;
    };

    // Clean up on unmount
    useEffect(() => {
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className="relative w-full h-full flex items-center justify-center bg-transparent overflow-hidden"
            onWheel={handleWheel}
        >
            {/* Background Placeholder */}
            {renderedLayers.length === 0 && (
                <div className="text-gray-300 font-medium z-0">
                    Vista Previa
                </div>
            )}

            {/* Size Container */}
            <div className="relative h-full w-full flex justify-center">
                {renderedLayers.map(layer => (
                    <img
                        key={layer.key}
                        src={layer.url}
                        alt={layer.key}
                        fetchpriority="high" // High priority for main doll layers
                        className="absolute h-full w-auto max-w-none object-contain pointer-events-none select-none left-1/2 -translate-x-1/2"
                        style={{
                            zIndex: layer.zIndex,
                            mixBlendMode: layer.blendMode
                        }}
                    />
                ))}
            </div>

            {/* Viewport Indicator Overlay */}
            {viewportInfo && viewportInfo.visible && (
                <div
                    onMouseDown={handleMouseDown}
                    className="absolute border-2 border-red-500 shadow-md bg-yellow-400/10 pointer-events-auto cursor-move z-[900] transition-opacity duration-200"
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

