import React, { useState, useRef, useEffect } from 'react';
import { getCloudinaryUrl } from '@/Utils/cloudinary';
import styles from './PartPositionEditor.module.css';

export default function PartPositionEditor({ part, view, onClose, onSave }) {
    const [position, setPosition] = useState({ x: 0, y: 0, scale: 1 });
    const [isDragging, setIsDragging] = useState(false);
    const dragStartRef = useRef({ x: 0, y: 0 });
    const imgRef = useRef(null);
    const containerRef = useRef(null);

    // Initial load logic could go here if we were passing existing pos
    // For now, start fresh or use passed props if available
    useEffect(() => {
        if (part.config) {
            setPosition({
                x: part.config.x || 0,
                y: part.config.y || 0,
                scale: part.config.scale || 1
            });
        }
    }, [part]);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const onWheel = (e) => {
            e.preventDefault();
            const scaleChange = e.deltaY * -0.001;
            setPosition(prev => {
                const newScale = Math.min(Math.max(0.1, prev.scale + scaleChange), 5);
                return { ...prev, scale: newScale };
            });
        };

        container.addEventListener('wheel', onWheel, { passive: false });

        return () => {
            container.removeEventListener('wheel', onWheel);
        };
    }, []);

    const handleMouseDown = (e) => {
        e.preventDefault();
        setIsDragging(true);
        dragStartRef.current = {
            x: e.clientX - position.x,
            y: e.clientY - position.y
        };
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        const newX = e.clientX - dragStartRef.current.x;
        const newY = e.clientY - dragStartRef.current.y;
        setPosition(prev => ({ ...prev, x: newX, y: newY }));
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };


    const handleSave = () => {
        onSave({
            part_id: part.id,
            category: part.category, // Assuming part object has this
            view: view,
            x: position.x,
            y: position.y,
            scale: position.scale
        });
    };

    const imageUrl = getCloudinaryUrl(part.thumbnail || part.url, { transformations: 'f_auto,q_auto' });

    return (
        <div className={styles.backdrop}>
            <div className={styles.dialog}>
                <div className={styles.header}>
                    <div>
                        <h3 className={styles.title}>Editor de Posición: {part.id}</h3>
                        <p className={styles.subtitle}>Arrastra para mover • Rueda para zoom</p>
                    </div>
                    <div className={styles.headerActions}>
                        <button
                            onClick={onClose}
                            className={`${styles.button} ${styles.secondaryButton}`}
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleSave}
                            className={`${styles.button} ${styles.primaryButton}`}
                        >
                            Guardar Posición
                        </button>
                    </div>
                </div>

                <div
                    className={styles.canvas}
                    ref={containerRef}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                        }
                    }}
                    aria-label={`Lienzo de edicion para ${part.id}`}
                >
                    <div className={styles.guideOverlay}>
                        <div className={styles.guideFrame} />
                    </div>

                    <img
                        ref={imgRef}
                        src={imageUrl}
                        alt={part.id}
                        className={styles.image}
                        style={{
                            transform: `translate(${position.x}px, ${position.y}px) scale(${position.scale})`
                        }}
                    />
                </div>

                <div className={styles.footer}>
                    <div className={styles.sliderGroup}>
                        <label className={styles.label}>Zoom: {position.scale.toFixed(2)}x</label>
                        <input
                            id="part-position-editor-zoom"
                            type="range"
                            min="0.1"
                            max="3"
                            step="0.01"
                            value={position.scale}
                            onChange={(e) => setPosition(prev => ({ ...prev, scale: parseFloat(e.target.value) }))}
                            className={styles.slider}
                            aria-label="Zoom"
                        />
                    </div>
                    <div className={styles.metrics}>
                        <div className={styles.metric}>
                            <span className={styles.label}>Pos X</span>
                            <span className={styles.metricValue}>{position.x.toFixed(0)}px</span>
                        </div>
                        <div className={styles.metric}>
                            <span className={styles.label}>Pos Y</span>
                            <span className={styles.metricValue}>{position.y.toFixed(0)}px</span>
                        </div>
                    </div>
                    <button
                        onClick={() => setPosition({ x: 0, y: 0, scale: 1 })}
                        className={styles.resetButton}
                    >
                        Resetear
                    </button>
                </div>
            </div>
        </div>
    );
}
