import React, { useState, useEffect, useRef } from 'react';
import styles from './DollSectionOrderConfigurator.module.css';

export default function DollSectionOrderConfigurator({ views, currentOrder, onSave, saving, message }) {
    const [orderedSections, setOrderedSections] = useState([]);

    // Drag and Drop State
    const [draggedItemIndex, setDraggedItemIndex] = useState(null);
    const [dropPlaceholderIndex, setDropPlaceholderIndex] = useState(null);
    const listRef = useRef(null);

    useEffect(() => {
        const defaultOrder = ['pelo', 'ojos', 'cejas', 'boca', 'nariz', 'orejas', 'manos', 'pies', 'vientre', 'pechos', 'vello', 'ropa'];
        const baseOrder = (currentOrder && currentOrder.length > 0) ? currentOrder : defaultOrder;

        const allAvailableSections = new Set();
        if (views) {
            Object.values(views).forEach(viewParts => {
                if (viewParts) {
                    Object.keys(viewParts).forEach(key => allAvailableSections.add(key.toLowerCase()));
                }
            });
        }

        const normalizedBaseOrder = baseOrder.map(s => s.toLowerCase());
        const finalOrder = [...new Set(normalizedBaseOrder)];

        allAvailableSections.forEach(section => {
            if (!finalOrder.includes(section)) {
                finalOrder.push(section);
            }
        });

        setOrderedSections(finalOrder);
    }, [views, currentOrder]);

    // DnD Handlers
    const handleDragStart = (e, index) => {
        setDraggedItemIndex(index);
        e.dataTransfer.effectAllowed = 'move';
        // Optional: Set a custom drag image or use default
    };

    const handleDragOver = (e, index) => {
        e.preventDefault(); // Necessary to allow dropping
        e.dataTransfer.dropEffect = 'move';

        if (draggedItemIndex === null) return;

        // Calculate insertion point based on cursor position relative to the item
        const rect = e.currentTarget.getBoundingClientRect();
        const midY = rect.top + rect.height / 2;
        const insertAfter = e.clientY > midY;

        // Determine the potential new index for the placeholder
        let newPlaceholderIndex = index;
        if (insertAfter) {
            newPlaceholderIndex = index + 1;
        }

        // Optimization: prevent unnecessary state updates
        if (dropPlaceholderIndex !== newPlaceholderIndex) {
            setDropPlaceholderIndex(newPlaceholderIndex);
        }
    };

    const handleDragLeave = (e) => {
        // Only clear if we actually left the list container? 
        // Logic might be tricky with child elements firing dragleave.
        // A safer way is to clear placeholder onDrop or onDragEnd.
    };

    const handleDragEnd = () => {
        setDraggedItemIndex(null);
        setDropPlaceholderIndex(null);
    };

    const handleDrop = (e) => {
        e.preventDefault();

        if (draggedItemIndex === null || dropPlaceholderIndex === null) return;

        const newOrder = [...orderedSections];
        const itemToMove = newOrder[draggedItemIndex];

        // Remove item from old position
        newOrder.splice(draggedItemIndex, 1);

        // Calculate insertion index (adjust for removal if necessary)
        // If we removed an item with a lower index than the drop target, the targets shift down by 1
        let finalIndex = dropPlaceholderIndex;
        if (draggedItemIndex < dropPlaceholderIndex) {
            finalIndex -= 1;
        }

        // Insert at new position
        newOrder.splice(finalIndex, 0, itemToMove);

        setOrderedSections(newOrder);
        handleDragEnd();
    };


    const moveUp = (index) => {
        if (index === 0) return;
        const newOrder = [...orderedSections];
        [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
        setOrderedSections(newOrder);
    };

    const moveDown = (index) => {
        if (index === orderedSections.length - 1) return;
        const newOrder = [...orderedSections];
        [newOrder[index + 1], newOrder[index]] = [newOrder[index], newOrder[index + 1]];
        setOrderedSections(newOrder);
    };

    return (
        <div className={styles.root}>
            <div className={styles.header}>
                <h2 className={styles.title}>Section Order Configuration</h2>
                <div className={styles.headerActions}>
                    {message && (
                        <span
                            className={`${styles.message} ${
                                message.type === 'success'
                                    ? styles.messageSuccess
                                    : styles.messageError
                            }`}
                        >
                            {message.text}
                        </span>
                    )}
                    <button
                        onClick={() => onSave(orderedSections)}
                        disabled={saving}
                        className={styles.saveButton}
                    >
                        {saving ? 'Saving...' : 'Save Order'}
                    </button>
                </div>
            </div>

            <div className={styles.content} ref={listRef}>
                <div className={styles.list}>
                    <p className={styles.description}>
                        Ordena las secciones que aparecen en el configurador de la muñeca.
                    </p>

                    {orderedSections.map((section, index) => {
                        const isDragged = draggedItemIndex === index;
                        const showPlaceholderBefore = dropPlaceholderIndex === index && draggedItemIndex !== index;

                        return (
                            <React.Fragment key={section}>
                                {showPlaceholderBefore && (
                                    <div
                                        onDragOver={(e) => {
                                            e.preventDefault();
                                            e.dataTransfer.dropEffect = 'move';
                                        }}
                                        onDrop={handleDrop}
                                        className={`${styles.dropZone} ${styles.dropZoneExpanded}`}
                                    >
                                        Drop here
                                    </div>
                                )}

                                <div
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, index)}
                                    onDragOver={(e) => handleDragOver(e, index)}
                                    onDragEnd={handleDragEnd}
                                    onDrop={handleDrop}
                                    className={`${styles.row} ${
                                        isDragged ? styles.rowDragged : ''
                                    }`}
                                >
                                    <div className={styles.rowMain}>
                                        <div className={styles.dragHandle}>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className={styles.dragIcon}
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                            </svg>
                                        </div>
                                        <span className={styles.sectionLabel}>
                                            <span className={styles.index}>{index + 1}.</span>
                                            {section}
                                        </span>
                                    </div>

                                    <div className={styles.controls}>
                                        <button
                                            onClick={() => moveUp(index)}
                                            disabled={index === 0}
                                            className={styles.controlButton}
                                            title="Move Up"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className={styles.controlIcon}
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => moveDown(index)}
                                            disabled={index === orderedSections.length - 1}
                                            className={styles.controlButton}
                                            title="Move Down"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className={styles.controlIcon}
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </React.Fragment>
                        );
                    })}

                    {/* Placeholder for dropping at the very end */}
                    {dropPlaceholderIndex === orderedSections.length && (
                        <div
                            onDragOver={(e) => {
                                e.preventDefault();
                                e.dataTransfer.dropEffect = 'move';
                            }}
                            onDrop={handleDrop}
                            className={`${styles.dropZone} ${styles.dropZoneEnd}`}
                        >
                            Drop here
                        </div>
                    )}

                    {orderedSections.length === 0 && (
                        <div className={styles.emptyState}>
                            No sections found.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
