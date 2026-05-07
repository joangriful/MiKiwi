import React, { memo, useEffect, useMemo } from 'react';
import PartCarousel from '../PartCarousel/PartCarousel';
import styles from './PartSelector.module.css';

const DEFAULT_ORDER = ['cuerpo', 'pelo', 'ojos', 'cejas', 'boca', 'nariz', 'orejas', 'manos', 'pies', 'vientre', 'pechos', 'vagina', 'vello', 'ropa', 'complementos', 'pecas', 'head', 'torso', 'armLeft', 'armRight', 'legLeft', 'legRight'];

function sortParts(parts, sectionOrder) {
    const orderToUse = (sectionOrder && sectionOrder.length > 0) ? sectionOrder : DEFAULT_ORDER;

    return Object.entries(parts).sort(([keyA], [keyB]) => {
        const indexA = orderToUse.indexOf(keyA);
        const indexB = orderToUse.indexOf(keyB);
        const lowerIndexA = orderToUse.indexOf(keyA.toLowerCase());
        const lowerIndexB = orderToUse.indexOf(keyB.toLowerCase());
        const normalizedIndexA = indexA !== -1 ? indexA : lowerIndexA;
        const normalizedIndexB = indexB !== -1 ? indexB : lowerIndexB;

        if (normalizedIndexA !== -1 && normalizedIndexB !== -1) return normalizedIndexA - normalizedIndexB;
        if (normalizedIndexA !== -1) return -1;
        if (normalizedIndexB !== -1) return 1;
        return keyA.localeCompare(keyB);
    });
}

const PartSelector = memo(({ parts, selectedParts, onSelect, sectionOrder, selectionLabel, partPositions, currentView, onSavePosition, clearDisabledCategories = [], getItemPrice, ...props }) => {
    const [openCategory, setOpenCategory] = React.useState(() => {
        return sortParts(parts, sectionOrder)[0]?.[0] ?? null;
    });

    const sortedParts = useMemo(() => {
        return sortParts(parts, sectionOrder);
    }, [parts, sectionOrder]);

    useEffect(() => {
        const categories = sortedParts.map(([category]) => category);

        if (!openCategory || !categories.includes(openCategory)) {
            setOpenCategory(categories[0] ?? null);
        }
    }, [openCategory, sortedParts]);

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
                        canClear={!clearDisabledCategories.includes(category)}
                        getItemPrice={getItemPrice}
                        isOpen={openCategory === category}
                        onToggle={() => setOpenCategory(openCategory === category ? null : category)}
                    />
                ))}

                {Object.keys(parts).length === 0 && (
                    <div className={styles.emptyState}>
                        <p>No hay opciones disponibles.</p>
                    </div>
                )}
            </div>
        </div>
    );
});

export default PartSelector;
