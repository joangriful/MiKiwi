import React, { memo, useMemo } from 'react';
import PartCarousel from '../PartCarousel/PartCarousel';
import styles from './PartSelector.module.css';

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
        <div className={styles.root}>
            <div className={styles.content}>
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
                    <div className={styles.emptyState}>
                        <p>No options available.</p>
                    </div>
                )}
            </div>
        </div>
    );
});

export default PartSelector;
