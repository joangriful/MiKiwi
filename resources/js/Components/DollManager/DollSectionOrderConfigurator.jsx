import React, { useState, useEffect, useRef } from 'react';

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
        <div className="h-full flex flex-col">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-white">
                <h2 className="text-lg font-semibold text-gray-800">Section Order Configuration</h2>
                <div className="flex items-center space-x-4">
                    {message && (
                        <span className={`text-sm ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                            {message.text}
                        </span>
                    )}
                    <button
                        onClick={() => onSave(orderedSections)}
                        disabled={saving}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                        {saving ? 'Saving...' : 'Save Order'}
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-gray-50" ref={listRef}>
                <div className="max-w-2xl mx-auto space-y-0 relative"> {/* Cleaned space-y for custom gaps */}
                    <p className="text-sm text-gray-500 mb-4 px-1">
                        Ordena las secciones que aparecen en el configurador de la muñeca.
                    </p>

                    <style>{`
                        @keyframes expand {
                            0% { height: 0; opacity: 0; margin-bottom: 0; }
                            100% { height: 4rem; opacity: 1; margin-bottom: 0.5rem; }
                        }
                        .animate-expand {
                            animation: expand 0.2s ease-out forwards;
                        }
                    `}</style>


                    {orderedSections.map((section, index) => {
                        const isDragged = draggedItemIndex === index;

                        // Check if we should render a placeholder BEFORE this item
                        const showPlaceholderBefore = dropPlaceholderIndex === index && draggedItemIndex !== index;

                        // Check if we show placeholder AFTER this item (only for the very last item if dropping at end)
                        // Actually, simplified logic: always show before, except if index is length

                        return (
                            <React.Fragment key={section}>
                                {/* Gap Placeholder Logic */}
                                {showPlaceholderBefore && (
                                    <div
                                        onDragOver={(e) => {
                                            e.preventDefault();
                                            e.dataTransfer.dropEffect = 'move';
                                        }}
                                        onDrop={handleDrop}
                                        className="border-2 border-dashed border-blue-300 bg-blue-50 rounded-lg mb-2 flex items-center justify-center text-blue-400 font-medium overflow-hidden animate-expand">
                                        Drop here
                                    </div>
                                )}

                                <div
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, index)}
                                    onDragOver={(e) => handleDragOver(e, index)}
                                    onDragEnd={handleDragEnd}
                                    onDrop={handleDrop}
                                    className={`
                                        flex items-center justify-between p-3 bg-white rounded-lg shadow-sm border border-gray-200 
                                        group hover:border-blue-300 transition-all cursor-move mb-2 select-none
                                        ${isDragged ? 'opacity-50 ring-2 ring-blue-400' : ''}
                                    `}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="cursor-grab text-gray-300 hover:text-gray-500">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                            </svg>
                                        </div>
                                        <span className="font-medium text-gray-700 capitalize">
                                            <span className="text-gray-400 mr-2 w-6 inline-block text-right">{index + 1}.</span>
                                            {section}
                                        </span>
                                    </div>

                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => moveUp(index)}
                                            disabled={index === 0}
                                            className="p-1 text-gray-400 hover:text-blue-600 disabled:text-gray-200 transition-colors"
                                            title="Move Up"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => moveDown(index)}
                                            disabled={index === orderedSections.length - 1}
                                            className="p-1 text-gray-400 hover:text-blue-600 disabled:text-gray-200 transition-colors"
                                            title="Move Down"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
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
                            className="h-16 border-2 border-dashed border-blue-300 bg-blue-50 rounded-lg mb-2 flex items-center justify-center text-blue-400 font-medium transition-all animate-in fade-in zoom-in-95 duration-200">
                            Drop here
                        </div>
                    )}

                    {orderedSections.length === 0 && (
                        <div className="text-center py-10 text-gray-400">
                            No sections found.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
