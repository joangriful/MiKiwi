import React, { memo } from 'react';
import PartCarousel from './PartCarousel';

const PartSelector = memo(({ parts, selectedParts, onSelect, selectionLabel }) => {
    return (
        <div className="h-full flex flex-col bg-white/50 backdrop-blur-sm">
            <div className="p-6 pb-2 border-b border-gray-200 bg-white sticky top-0 z-10">
                <h2 className="text-xl font-bold text-gray-800">Personaliza tu Muñeca</h2>
                <p className="text-sm text-gray-500 mt-1">Elige los elementos para configurar tu diseño único.</p>
            </div>

            <div className="flex-1 overflow-y-auto p-6 scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                {Object.entries(parts).map(([category, items], index) => (
                    <PartCarousel
                        key={category}
                        index={index}
                        id={`carousel-${index}`}
                        category={category}
                        items={items}
                        selectedItem={selectedParts[category]}
                        onSelect={(item) => onSelect(category, item)}
                        selectionLabel={selectionLabel}
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
