import React, { useState } from 'react';
import PartOption from '../PartOption/PartOption';
import './PartCarousel.css';

const CATEGORY_ICONS = {
    'pelo': <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4a2 2 0 012-2h12a2 2 0 012 2v1m-16 0v14a2 2 0 002 2h12a2 2 0 002-2V5m-16 0h16" /></svg>,
    'ojos': <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>,
    'cejas': <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 10c0-1.657 3.134-3 7-3s7 1.343 7 3" /></svg>,
    'boca': <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0" /><circle cx="12" cy="12" r="9" strokeWidth={1.5} /></svg>,
    'nariz': <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 15c1.5 0 3-.5 3-2.5V8" /></svg>,
    'orejas': <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.027 15.023c0 1.1-1.34 2.1-3.34 2.1m-12.027-3c1.1-1.1 2.1-1.34 2.1-3.34" /><path d="M11 11c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2" /><path d="M19 12c.5 0 1-.5 1-1V5c0-.5-.5-1-1-1H5c-.5 0-1 .5-1 1v6c0 .5.5 1 1 1" /></svg>,
    'manos': <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0V12m-3 .5a3 3 0 006 0v-1a1.5 1.5 0 10-3 0m0 1V5.5a1.5 1.5 0 10-3 0v4" /></svg>,
    'pies': <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 17h6c2 0 3-1 3-3V6c0-2-1-3-3-3H3m18 14h-6c-2 0-3-1-3-3V6c0-2 1-3 3-3h6" /></svg>,
    'vientre': <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 12c-3-3-3-9 0-9s3 6 0 9zm0 0c3 3 3 9 0 9s-3-6 0-9z" /></svg>,
    'pechos': <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>,
    'vello': <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" /></svg>,
    'ropa': <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>,
    'default': <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" /></svg>
};

const PartCarousel = ({ category, items, selectedItem, onSelect, index, id, selectionLabel, partPositions, currentView, onSavePosition, isOpen, onToggle, ...props }) => {

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
        <div id={id} className="mb-2 last:mb-24 scroll-mt-4 border-b border-[var(--border)] last:border-0">
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between text-left py-3 px-2 rounded-lg transition-colors group focus:outline-none"
                aria-expanded={isOpen}
            >
                <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-xl transition-all duration-300 ${isOpen ? 'bg-[var(--color-primary)] text-white shadow-lg' : 'bg-[var(--bg-main)] text-[var(--text-muted)] group-hover:text-[var(--color-primary)]'}`}>
                        {CATEGORY_ICONS[category.toLowerCase()] || CATEGORY_ICONS.default}
                    </div>

                    <span className={`text-sm font-bold uppercase tracking-widest transition-all duration-300 ${isOpen ? 'text-[var(--color-primary-dark)] scale-105 ml-1' : 'text-[var(--text-main)] group-hover:text-[var(--color-primary)]'}`}>
                        {category}
                    </span>
                </div>

                {/* Chevron */}
                <svg
                    className={`w-5 h-5 text-[var(--text-muted)] group-hover:text-[var(--color-primary)] transition-all duration-500 ${isOpen ? 'rotate-180 text-[var(--color-primary)]' : 'rotate-0'}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={2.5}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
            </button>

            {isOpen && (
                <div className="relative group/carousel my-2 animate-in slide-in-from-top-2 fade-in duration-200">
                    {/* Scroll Container */}
                    <div className="flex overflow-x-auto gap-4 py-4 px-1 snap-x [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">

                        {/* Clear Selection Option (First Item) */}
                        <button
                            onClick={() => onSelect(null)}
                            onKeyDown={(e) => handleKeyDown(e, null)}
                            className={`
                                shrink-0 flex flex-col items-center justify-center 
                                w-24 h-24 sm:w-28 sm:h-28 
                                rounded-xl border-2 border-dashed border-[var(--border)] 
                                text-[var(--text-muted)] hover:text-red-500 hover:border-red-300 hover:bg-red-50/50
                                transition-all duration-200 snap-start
                                ${!selectedItem ? 'bg-[var(--bg-main)]' : 'bg-transparent'}
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
                                    showImages={props.showImages}
                                    onEdit={props.onEdit ? (part) => props.onEdit(category, part) : undefined}
                                    partPositions={partPositions}
                                    currentView={currentView}
                                    category={category}
                                    onSavePosition={onSavePosition}
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
