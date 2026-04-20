import React, { useRef, useState, useEffect, useMemo } from 'react';
import { getCloudinaryUrl } from '@/Utils/cloudinary';
import styles from './CloseUp.module.css';

export default function CloseUp({ selectedParts, onViewportChange, viewportOverride, zoomLevel = 100, initialViewport }) {
    const containerRef = useRef(null);
    const contentRef = useRef(null);
    const timeoutRef = useRef(null);
    const isScrollingRef = useRef(false);
    const isFirstRender = useRef(true); // Track first render to avoid conflict

    // Sync from Parent (Preview Area interaction)
    useEffect(() => {
        if (viewportOverride && containerRef.current && contentRef.current && !isScrollingRef.current) {
            const container = containerRef.current;
            const content = contentRef.current;

            const targetLeft = viewportOverride.x * content.scrollWidth;
            const targetTop = viewportOverride.y * content.scrollHeight;

            // Only scroll if difference is significant (simple loop prevention)
            if (Math.abs(container.scrollLeft - targetLeft) > 5 || Math.abs(container.scrollTop - targetTop) > 5) {
                container.scrollTo({
                    left: targetLeft,
                    top: targetTop,
                    behavior: 'auto'
                });
            }
        }
    }, [viewportOverride]);

    // Reuse Backend Z-Index Logic (Same as PreviewArea)
    const renderedLayers = useMemo(() => {
        const layers = [];
        Object.entries(selectedParts).forEach(([category, item]) => {
            if (!item || !item.layers) return;
            item.layers.forEach((layer) => {
                layers.push({
                    key: `${category}-${item.id}-${layer.name}`,
                    url: getCloudinaryUrl(layer.url, { transformations: 'f_auto,q_auto' }),
                    zIndex: layer.zIndex ?? 0,
                    blendMode: layer.blendMode || 'normal',
                    category
                });
            });
        });
        return layers.sort((a, b) => a.zIndex - b.zIndex);
    }, [selectedParts]);

    const handleScroll = () => {
        if (!containerRef.current || !contentRef.current) return;

        // Mark as scrolling to avoid fighting with external updates (optional optimization)
        // isScrollingRef.current = true; 
        // clearTimeout(scrollEndTimer); ...

        const container = containerRef.current;
        const content = contentRef.current;

        // Calculate visible percentage relative to total content size
        const info = {
            x: container.scrollLeft / content.scrollWidth,
            y: container.scrollTop / content.scrollHeight,
            w: container.clientWidth / content.scrollWidth,
            h: container.clientHeight / content.scrollHeight,
            visible: true
        };

        onViewportChange(info);

        // Clear existing timeout
        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        // Set timeout to hide indicator
        timeoutRef.current = setTimeout(() => {
            onViewportChange({ ...info, visible: false });
        }, 1000); // Hide after 1 second of no movement
    };

    // Auto-scroll to center OR initial position on mount
    useEffect(() => {
        if (containerRef.current && contentRef.current) {
            const container = containerRef.current;
            const content = contentRef.current;

            // Wait for next frame to ensure layout is done, or roughly done
            requestAnimationFrame(() => {
                let scrollX, scrollY;

                // Always center Horizontally by default, ignoring initialViewport.x
                scrollX = (content.scrollWidth - container.clientWidth) / 2;

                // Ensure y is number
                const initY = initialViewport ? Number(initialViewport.y) : NaN;

                if (!isNaN(initY)) {
                    // Use provided viewport Y
                    scrollY = initY * content.scrollHeight;
                } else {
                    // Default to Center Vertical
                    scrollY = (content.scrollHeight - container.clientHeight) / 2;
                }

                container.scrollTo({
                    top: scrollY,
                    left: scrollX,
                    behavior: 'instant'
                });
                // Initialize viewport info
                handleScroll();
            });
        }
    }, [initialViewport]);

    // Center on Zoom Change
    React.useLayoutEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            // If we have initialViewport, SKIP the default centering on mount
            // The useEffect above will handle the positioning.
            if (initialViewport) {
                return;
            }
        }

        if (containerRef.current && contentRef.current) {
            const container = containerRef.current;
            const content = contentRef.current;

            const scrollX = (content.scrollWidth - container.clientWidth) / 2;
            const scrollY = (content.scrollHeight - container.clientHeight) / 2;

            container.scrollTo({
                top: scrollY,
                left: scrollX,
                behavior: 'instant' // Ensure instant jump to center
            });
        }
    }, [zoomLevel]);

    return (
        <div
            ref={containerRef}
            className={styles.container}
            onScroll={handleScroll}
        >
            <div
                ref={contentRef}
                className={styles.content}
                style={{
                    width: `${zoomLevel * 3}%`, // 100% -> 300% width, 25% -> 75% width (approx fit)
                    height: `${zoomLevel * 3}%`
                }}
            >
                {renderedLayers.length === 0 && (
                    <div className={styles.emptyState}>
                        Close Up View
                    </div>
                )}

                {renderedLayers.map(layer => (
                    <img
                        key={layer.key}
                        src={layer.url}
                        alt={layer.key}
                        fetchpriority="high"
                        className={styles.layerImage}
                        style={{
                            zIndex: layer.zIndex,
                            mixBlendMode: layer.blendMode
                        }}
                    />
                ))}
            </div>
        </div>
    );
}
