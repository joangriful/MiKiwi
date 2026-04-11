import React, { useState, useEffect, useRef, useCallback } from 'react';
import { usePartOptimization } from '@/Features/Configurator/Hooks/usePartOptimization';
import './PartOption.css';

const PartOption = ({ item, isSelected, onSelect, onKeyDown, selectionLabel, showImages, onSavePosition, partPositions, currentView, category }) => {

    const [isEditing, setIsEditing] = useState(false);
    const [localConfig, setLocalConfig] = useState({ x: 0, y: 0, scale: 1 });
    const dragStartRef = useRef(null);
    const overlayRef = useRef(null);
    const draggingRef = useRef(false); // Track if we are actively dragging to prevent race conditions

    // Sync with global config when not editing
    useEffect(() => {
        if (!isEditing) {
            let key = null;
            if (currentView && category) {
                key = `${currentView}|${category}|${item.id}`;
            }
            const global = (key && partPositions && partPositions[key]) ? partPositions[key] : { x: 0, y: 0, scale: 1 };
            setLocalConfig(global);
        }
    }, [partPositions, currentView, category, item, isEditing]);

    // Use the Optimization Hook
    const { src, style } = usePartOptimization({
        item,
        partPositions,
        currentView,
        category,
        isEditing,
        showImages,
        overrideConfig: isEditing ? localConfig : null
    });

    // Zoom Handler (Non-Passive)
    useEffect(() => {
        if (isEditing) {
            document.body.style.overflow = 'hidden';

            const el = overlayRef.current;
            if (el) {
                const onWheel = (e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    const rect = el.getBoundingClientRect();
                    const centerX = rect.left + rect.width / 2;
                    const centerY = rect.top + rect.height / 2;

                    // Mouse position relative to center
                    const mouseX = e.clientX - centerX;
                    const mouseY = e.clientY - centerY;

                    // Zoom Speed
                    const zoomSensitivity = 0.001 * 1.5; // Slightly faster
                    const delta = e.deltaY * -zoomSensitivity;

                    setLocalConfig(prev => {
                        const currentScale = prev.scale;
                        // Calculate new scale (High Limit: 100x)
                        let newScale = currentScale + (currentScale * delta); // Logarithmic-ish feel
                        newScale = Math.max(0.1, Math.min(100, newScale));

                        const scaleRatio = newScale / currentScale;

                        // Calculate new position to keep mouse point stable
                        // NewTranslate = MouseOffset * (1 - Ratio) + OldTranslate * Ratio
                        const newX = mouseX * (1 - scaleRatio) + prev.x * scaleRatio;
                        const newY = mouseY * (1 - scaleRatio) + prev.y * scaleRatio;

                        return {
                            ...prev,
                            scale: newScale,
                            x: newX,
                            y: newY
                        };
                    });
                };
                el.addEventListener('wheel', onWheel, { passive: false });
                return () => {
                    document.body.style.overflow = '';
                    el.removeEventListener('wheel', onWheel);
                };
            }
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isEditing]);

    // --- Interaction Handlers (Stable) ---

    // We define move/up handlers INSIDE mousedown to capture the specific instance logic
    // OR we use useCallback. Since we need to remove specific listeners, closures are safer/easier within the down handler if we don't need external state.
    // We only need `setLocalConfig` which is stable.

    const handleMouseDown = (e) => {
        if (!isEditing) return;
        e.preventDefault();
        e.stopPropagation();

        const container = e.currentTarget.getBoundingClientRect();

        dragStartRef.current = {
            x: e.clientX,
            y: e.clientY,
            initialX: localConfig.x,
            initialY: localConfig.y,
            containerWidth: container.width
        };
        draggingRef.current = true;

        // Define handlers here to ensure we have the exact reference to remove later
        const onMouseMove = (ev) => {
            if (!draggingRef.current || !dragStartRef.current) return;

            ev.preventDefault();
            const { x, y, initialX, initialY, containerWidth } = dragStartRef.current;
            const dx = ev.clientX - x;
            const dy = ev.clientY - y;
            const scaleFactor = 500 / containerWidth;

            setLocalConfig(prev => ({
                ...prev,
                x: initialX + (dx * scaleFactor),
                y: initialY + (dy * scaleFactor)
            }));
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

    const handleSave = (e) => {
        e.stopPropagation();
        if (onSavePosition) {
            onSavePosition({
                view: currentView,
                category: category,
                part_id: item.id,
                x: localConfig.x,
                y: localConfig.y,
                scale: localConfig.scale
            });
        }
        setIsEditing(false);
    };

    const handleCancel = (e) => {
        e.stopPropagation();
        setIsEditing(false);
    };

    const toggleEdit = (e) => {
        e.stopPropagation();
        setIsEditing(true);
    };

    // Reusable Content Renderer
    const renderContent = (isOverlay = false) => (
        <>
            {src ? (
                <div
                    ref={isOverlay ? overlayRef : undefined}
                    className={`w-full h-full p-1 overflow-hidden flex items-center justify-center ${isEditing && isOverlay ? 'cursor-move' : ''}`}
                    onMouseDown={isOverlay ? handleMouseDown : undefined}
                >
                    <img
                        src={src}
                        alt={item.id}
                        className="w-full h-full object-contain transition-transform duration-75 select-none pointer-events-none"
                        style={style}
                        loading="lazy"
                    />
                </div>
            ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                    <span className="text-[10px] text-center font-medium text-gray-600 break-words w-full p-1 leading-tight select-none">
                        {item.thumbnail ? item.thumbnail.split('/').pop() : item.id}
                    </span>
                </div>
            )}

            {/* Selection Label Badge (Only if not editing) */}
            {isSelected && selectionLabel && !isEditing && (
                <div className="absolute inset-0 flex items-center justify-center bg-[var(--color-primary)]/10 backdrop-blur-[1px] pointer-events-none">
                    <div className="bg-[var(--color-primary)] text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm uppercase tracking-wider">
                        {selectionLabel}
                    </div>
                </div>
            )}
        </>
    );

    return (
        <>
            {/* Normal Card View */}
            <div className="relative group shrink-0">
                <button
                    onClick={() => onSelect(item)}
                    onKeyDown={onKeyDown}
                    className={`
                        relative 
                        w-28 h-28 sm:w-32 sm:h-32 
                        rounded-2xl overflow-hidden 
                        border-2 transition-all duration-500 ease-premium
                        hover:shadow-[0_10px_25px_rgba(0,0,0,0.08)] hover:-translate-y-1.5
                        focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50
                        flex flex-col items-center justify-center
                        ${isSelected
                            ? 'border-[var(--color-primary)] ring-4 ring-[var(--color-primary)]/10 shadow-[0_8px_30px_rgba(153,184,73,0.2)] bg-white/80'
                            : 'border-[var(--border)] bg-[var(--bg-surface)] hover:border-[var(--color-primary)]/30'
                        }
                    `}
                    title={item.id}
                >
                    {renderContent(false)}

                    {/* Edit Trigger Button */}
                    {onSavePosition && (
                        <div
                            onClick={toggleEdit}
                            className="absolute top-1 right-1 p-1.5 bg-[var(--bg-surface)]/90 rounded-full border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--color-primary-dark)] hover:border-[var(--color-primary)] opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-sm z-10 cursor-pointer hover:scale-110"
                            title="Edit Position"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                        </div>
                    )}
                </button>
            </div>

            {/* Focus Mode Overlay */}
            {isEditing && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="relative w-full max-w-sm aspect-square mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden ring-4 ring-blue-500/50">
                        {/* Content Container */}
                        <div className="w-full h-full relative"
                        // Handlers attached inside renderContent(true)
                        >
                            {/* Dashed Center Guide */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                                <div className="w-px h-full bg-blue-500"></div>
                                <div className="h-px w-full bg-blue-500 absolute"></div>
                            </div>

                            {renderContent(true)}
                        </div>

                        {/* Overlay Controls */}
                        <div className="absolute top-4 right-4 flex flex-col gap-3 z-50">
                            <button
                                onClick={handleSave}
                                className="p-3 bg-green-500 text-white rounded-full hover:bg-green-600 shadow-lg hover:scale-110 transition-all"
                                title="Save & Close"
                            >
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                            </button>
                            <button
                                onClick={handleCancel}
                                className="p-3 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-lg hover:scale-110 transition-all"
                                title="Cancel"
                            >
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        {/* Instructions */}
                        <div className="absolute bottom-4 inset-x-0 text-center pointer-events-none">
                            <span className="bg-black/50 text-white text-xs px-3 py-1 rounded-full backdrop-blur-md">
                                Arrastra para mover • Rueda para zoom
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default PartOption;
