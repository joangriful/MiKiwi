import React, { memo, useMemo } from 'react';
import PartCarousel from '../PartCarousel/PartCarousel';

const DEFAULT_ORDER = ['pelo', 'ojos', 'cejas', 'boca', 'nariz', 'orejas', 'manos', 'pies', 'vientre', 'pechos', 'vello', 'ropa'];

const PartSelector = memo(({ parts, selectedParts, onSelect, sectionOrder, selectionLabel, partPositions, currentView, onSavePosition, ...props }) => {
    // Manage which category is open (Exclusive Accordion)
    const [openCategory, setOpenCategory] = React.useState(() => {
        const order = (sectionOrder && sectionOrder.length > 0) ? sectionOrder : DEFAULT_ORDER;
        return Object.keys(parts).sort((a, b) => order.indexOf(a.toLowerCase()) - order.indexOf(b.toLowerCase()))[0];
    });

    const sortedParts = useMemo(() => {
        const orderToUse = (sectionOrder && sectionOrder.length > 0) ? sectionOrder : DEFAULT_ORDER;

        return Object.entries(parts).sort(([keyA], [keyB]) => {
            const indexA = orderToUse.indexOf(keyA.toLowerCase());
            const indexB = orderToUse.indexOf(keyB.toLowerCase());

            if (indexA !== -1 && indexB !== -1) return indexA - indexB; // Both in list, sort by index
            if (indexA !== -1) return -1; // Only A in list, A comes first
            if (indexB !== -1) return 1;  // Only B in list, B comes first
            return keyA.localeCompare(keyB); // Neither in list, sort alphabetically
        });
    }, [parts, sectionOrder]);

    return (
        <div className="h-full flex flex-col bg-transparent">
            <div className="flex-1 overflow-y-auto p-6 scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                {sortedParts.map(([category, items], index) => (
                    <PartCarousel
                        key={category}
                        index={index}
                        id={`carousel-${index}`}
                        category={category}
                        items={items}
                        selectedItem={selectedParts[category]}
                        onSelect={(item) => onSelect(category, item)}
                        selectionLabel={selectionLabel}
                        showImages={props.showImages}
                        onEdit={props.onEdit}
                        partPositions={partPositions}
                        currentView={currentView}
                        onSavePosition={onSavePosition}
                        isOpen={openCategory === category}
                        onToggle={() => setOpenCategory(openCategory === category ? null : category)}
                    />
                ))}

                {Object.keys(parts).length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                        <p>No options available.</p>
                    </div>
                )}
            </div>
        </div>
    );
});

export default PartSelector;
