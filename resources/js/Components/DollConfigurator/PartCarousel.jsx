import React, { useState } from 'react';
import PartOption from './PartOption';

const PartCarousel = ({ category, items, selectedItem, onSelect, index, id, selectionLabel }) => {
    const [isOpen, setIsOpen] = useState(index === 0);

    // Keyboard Navigation Handler
    const handleKeyDown = (e, item) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
            e.preventDefault();

            // Find all buttons within this specific carousel container
            const container = e.currentTarget.closest('.group\\/carousel');
            if (!container) return;

            // Get all focusable buttons (including the 'None' button and item buttons)
            const buttons = Array.from(container.querySelectorAll('button'));
            const currentIndex = buttons.indexOf(e.currentTarget);

            if (currentIndex === -1) return;

            let nextIndex;
            if (e.key === 'ArrowRight') {
                nextIndex = currentIndex + 1;
                if (nextIndex >= buttons.length) nextIndex = 0;
            } else {
                nextIndex = currentIndex - 1;
                if (nextIndex < 0) nextIndex = buttons.length - 1;
            }

            buttons[nextIndex].focus();

            // Auto-select logic (Selection follows focus)
            if (nextIndex === 0) {
                onSelect(null);
            } else {
                // items array is 0-indexed, but buttons array has "None" button at index 0
                const itemToSelect = items[nextIndex - 1];
                if (itemToSelect) {
                    onSelect(itemToSelect);
                }
            }

        } else if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            // Select the item
            onSelect(item);

            // Jump to next carousel section
            const nextCarouselId = `carousel-${index + 1}`;
            const nextCarousel = document.getElementById(nextCarouselId);

            if (nextCarousel) {
                // Determine if we need to open it first (if it's a closed accordion)
                // Since state is local, we can't easily force-open from here without ref/context.
                // However, user interaction (focus) might be enough if we target the header button first?
                // Let's just try to focus the first button inside.

                // If it's closed, the buttons inside won't exist.
                // We might need to focus the toggle button instead.
                // For now, let's just focus whatever we can find.

                const firstButton = nextCarousel.querySelector('button');
                if (firstButton) {
                    firstButton.focus();
                    firstButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    // Optional: Simulate click to open if it's the toggle button?
                    // firstButton.click(); 
                }
            }
        }
    };

    return (
        <div id={id} className="mb-2 last:mb-24 scroll-mt-4 border-b border-gray-100 last:border-0">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between text-left py-3 px-2 hover:bg-gray-50 rounded-lg transition-colors group focus:outline-none focus:ring-2 focus:ring-red-500/20"
                aria-expanded={isOpen}
            >
                <div className="flex items-center gap-3">
                    {/* Chevron (Simple Triangle) */}
                    <svg
                        className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-90' : 'rotate-0'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path d="M6 6L14 10L6 14V6Z" />
                    </svg>

                    <span className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                        {category}
                    </span>
                    <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full group-hover:bg-white transition-colors">
                        {items.length}
                    </span>
                </div>
            </button>

            {isOpen && (
                <div className="relative group/carousel my-2 animate-in slide-in-from-top-2 fade-in duration-200">
                    {/* Scroll Container */}
                    <div className="flex overflow-x-auto gap-4 pb-4 px-1 snap-x [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">

                        {/* Clear Selection Option (First Item) */}
                        <button
                            onClick={() => onSelect(null)}
                            onKeyDown={(e) => handleKeyDown(e, null)}
                            className={`
                                shrink-0 flex flex-col items-center justify-center 
                                w-24 h-24 sm:w-28 sm:h-28 
                                rounded-xl border-2 border-dashed border-gray-300 
                                text-gray-400 hover:text-red-500 hover:border-red-300 hover:bg-red-50
                                transition-all duration-200 snap-start
                                ${!selectedItem ? 'bg-gray-50' : 'bg-transparent'}
                            `}
                            title={`Remove ${category}`}
                        >
                            <span className="text-2xl">✕</span>
                            <span className="text-xs font-medium mt-1">None</span>
                        </button>

                        {/* Items */}
                        {items.map((item) => (
                            <div key={item.id} className="snap-start">
                                <PartOption
                                    item={item}
                                    isSelected={selectedItem?.id === item.id}
                                    onSelect={onSelect}
                                    onKeyDown={(e) => handleKeyDown(e, item)}
                                    selectionLabel={selectionLabel}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PartCarousel;
