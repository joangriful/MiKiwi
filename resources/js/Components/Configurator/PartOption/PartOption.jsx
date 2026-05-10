import { useEffect, useRef, useState } from 'react';
import { usePartOptimization } from '@/Components/Configurator/hooks/usePartOptimization';
import styles from './PartOption.module.css';

const CATEGORY_PREVIEW_CONFIG = {
    boca: { scale: 22.45, translateX: 0, translateY: 530 },
    cejas: { scale: 12.45, translateX: 0, translateY: 340 },
    complementos: { scale: 6.45, translateX: 0, translateY: 170 },
    manos: { scale: 2.6, translateX: 0, translateY: -10 },
    nariz: { scale: 25.45, translateX: 0, translateY: 660 },
    ojos: { scale: 16.45, translateX: 0, translateY: 440 },
    orejas: { scale: 3.45, translateX: 0, translateY: 110 },
    pecas: { scale: 5.55, translateX: 0, translateY: 40 },
    pechos: { scale: 5.45, translateX: 0, translateY: 50 },
    pelo: { scale: 4.35, translateX: 0, translateY: 115},
    pies: { scale: 4.45, translateX: 0, translateY: -200 },
    ropa: { scale: 2.45, translateX: 0, translateY: 0 },
    vagina: { scale: 16.45, translateX: 0, translateY: -120 },
    vello: { scale: 10.45, translateX: 0, translateY: -60 },
    vientre: { scale: 4.45, translateX: 0, translateY: 30 },
};

function getClassName(...classNames) {
    return classNames.filter(Boolean).join(' ');
}

export default function PartOption({
    item,
    isSelected,
    onSelect,
    onKeyDown,
    selectionLabel,
    showImages,
    onSavePosition,
    partPositions,
    currentView,
    category,
    extraPrice = 0,
}) {
    const [isEditing, setIsEditing] = useState(false);
    const [localConfig, setLocalConfig] = useState({ x: 0, y: 0, scale: 1 });
    const dragStartRef = useRef(null);
    const overlayRef = useRef(null);
    const draggingRef = useRef(false);

    useEffect(() => {
        if (isEditing) {
            return;
        }

        let key = null;

        if (currentView && category) {
            key = `${currentView}|${category}|${item.id}`;
        }

        const globalConfig =
            key && partPositions && partPositions[key]
                ? partPositions[key]
                : { x: 0, y: 0, scale: 1 };

        setLocalConfig(globalConfig);
    }, [partPositions, currentView, category, item, isEditing]);

    const { src, style } = usePartOptimization({
        item,
        partPositions,
        currentView,
        category,
        isEditing,
        showImages,
        overrideConfig: isEditing ? localConfig : null,
    });

    useEffect(() => {
        if (!isEditing) {
            document.body.style.overflow = '';
            return () => {
                document.body.style.overflow = '';
            };
        }

        document.body.style.overflow = 'hidden';

        const element = overlayRef.current;

        if (!element) {
            return () => {
                document.body.style.overflow = '';
            };
        }

        const handleWheel = (event) => {
            event.preventDefault();
            event.stopPropagation();

            const rect = element.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const mouseX = event.clientX - centerX;
            const mouseY = event.clientY - centerY;
            const zoomSensitivity = 0.0015;
            const delta = event.deltaY * -zoomSensitivity;

            setLocalConfig((previous) => {
                const currentScale = previous.scale;
                let newScale = currentScale + currentScale * delta;

                newScale = Math.max(0.1, Math.min(100, newScale));

                const scaleRatio = newScale / currentScale;

                return {
                    ...previous,
                    scale: newScale,
                    x: mouseX * (1 - scaleRatio) + previous.x * scaleRatio,
                    y: mouseY * (1 - scaleRatio) + previous.y * scaleRatio,
                };
            });
        };

        element.addEventListener('wheel', handleWheel, { passive: false });

        return () => {
            document.body.style.overflow = '';
            element.removeEventListener('wheel', handleWheel);
        };
    }, [isEditing]);

    const handleMouseDown = (event) => {
        if (!isEditing) {
            return;
        }

        event.preventDefault();
        event.stopPropagation();

        const container = event.currentTarget.getBoundingClientRect();

        dragStartRef.current = {
            x: event.clientX,
            y: event.clientY,
            initialX: localConfig.x,
            initialY: localConfig.y,
            containerWidth: container.width,
        };
        draggingRef.current = true;

        const handleMouseMove = (moveEvent) => {
            if (!draggingRef.current || !dragStartRef.current) {
                return;
            }

            moveEvent.preventDefault();

            const { x, y, initialX, initialY, containerWidth } =
                dragStartRef.current;
            const deltaX = moveEvent.clientX - x;
            const deltaY = moveEvent.clientY - y;
            const scaleFactor = 500 / containerWidth;

            setLocalConfig((previous) => ({
                ...previous,
                x: initialX + deltaX * scaleFactor,
                y: initialY + deltaY * scaleFactor,
            }));
        };

        const handleMouseUp = () => {
            draggingRef.current = false;
            dragStartRef.current = null;
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    };

    const handleSave = (event) => {
        event.stopPropagation();

        if (onSavePosition) {
            onSavePosition({
                view: currentView,
                category,
                part_id: item.id,
                x: localConfig.x,
                y: localConfig.y,
                scale: localConfig.scale,
            });
        }

        setIsEditing(false);
    };

    const handleCancel = (event) => {
        event.stopPropagation();
        setIsEditing(false);
    };

    const renderContent = (isOverlay = false) => (
        <>
            {src ? (
                <div
                    ref={isOverlay ? overlayRef : undefined}
                    className={getClassName(
                        styles.contentFrame,
                        isEditing && isOverlay
                            ? styles.contentFrameEditable
                            : ''
                    )}
                    onMouseDown={isOverlay ? handleMouseDown : undefined}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(event) => {
                        if (!isOverlay) {
                            return;
                        }
                        if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault();
                        }
                    }}
                    aria-label={`Editor de posicion para ${item.id}`}
                >
                    {!isOverlay && extraPrice > 0 ? (
                        <span className={styles.priceBadge}>+{extraPrice} EUR</span>
                    ) : null}

                    <img
                        src={src}
                        alt={item.id}
                        className={styles.itemImage}
                        style={buildImageStyle(style, isOverlay ? null : getThumbnailPreviewStyle(category))}
                        loading="lazy"
                    />
                </div>
            ) : (
                <div className={styles.placeholder}>
                    <span className={styles.placeholderLabel}>
                        {item.thumbnail
                            ? item.thumbnail.split('/').pop()
                            : item.id}
                    </span>
                </div>
            )}

            {isSelected && selectionLabel && !isEditing ? (
                <div className={styles.selectionOverlay}>
                    <div className={styles.selectionBadge}>
                        {selectionLabel}
                    </div>
                </div>
            ) : null}
        </>
    );

    return (
        <>
            <div className={styles.cardRoot}>
                <button
                    type="button"
                    onClick={() => onSelect(item)}
                    onKeyDown={onKeyDown}
                    className={getClassName(
                        styles.cardButton,
                        isSelected ? styles.cardButtonSelected : ''
                    )}
                    title={item.id}
                >
                    {renderContent(false)}

                </button>

                {onSavePosition ? (
                    <button
                        type="button"
                        onClick={() => {
                            setIsEditing(true);
                        }}
                        className={styles.editTrigger}
                        title="Editar posición"
                        aria-label={`Editar posicion de ${item.id}`}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className={styles.editIcon}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                            />
                        </svg>
                    </button>
                ) : null}
            </div>

            {isEditing ? (
                <div className={styles.overlayBackdrop}>
                    <div className={styles.overlayCard}>
                        <div className={styles.overlayCanvas}>
                            <div className={styles.guideOverlay}>
                                <div className={styles.guideVertical} />
                                <div className={styles.guideHorizontal} />
                            </div>

                            {renderContent(true)}
                        </div>

                        <div className={styles.overlayControls}>
                            <button
                                type="button"
                                onClick={handleSave}
                                className={getClassName(
                                    styles.controlButton,
                                    styles.saveButton
                                )}
                                title="Guardar y cerrar"
                                aria-label="Guardar posicion"
                            >
                                <svg
                                    className={styles.controlIcon}
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={3}
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            </button>

                            <button
                                type="button"
                                onClick={handleCancel}
                                className={getClassName(
                                    styles.controlButton,
                                    styles.cancelButton
                                )}
                                title="Cancelar"
                                aria-label="Cancelar edicion"
                            >
                                <svg
                                    className={styles.controlIcon}
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={3}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>

                        <div className={styles.instructionBar}>
                            <span className={styles.instructionBadge}>
                                Arrastra para mover • Rueda para zoom
                            </span>
                        </div>
                    </div>
                </div>
            ) : null}
        </>
    );
}

function getThumbnailPreviewStyle(category) {
    const previewConfig = CATEGORY_PREVIEW_CONFIG[category];

    if (!previewConfig) {
        return {};
    }

    return {
        width: '100%',
        height: '100%',
        objectFit: 'contain',
        objectPosition: 'center center',
        transformOrigin: 'center center',
        transform: `translate(${previewConfig.translateX ?? 0}%, ${previewConfig.translateY ?? 0}%) scale(${previewConfig.scale})`,
    };
}

function buildImageStyle(baseStyle, previewStyle) {
    if (!previewStyle) {
        return baseStyle;
    }

    return {
        ...baseStyle,
        ...previewStyle,
        transform: [baseStyle?.transform, previewStyle.transform].filter(Boolean).join(' '),
    };
}
