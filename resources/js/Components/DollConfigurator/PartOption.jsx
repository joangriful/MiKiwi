import React from 'react';

const PartOption = ({ item, isSelected, onSelect, onKeyDown, selectionLabel }) => {
    return (
        <button
            onClick={() => onSelect(item)}
            onKeyDown={onKeyDown}
            className={`
                shrink-0 relative group 
                w-24 h-24 sm:w-28 sm:h-28 
                rounded-xl overflow-hidden 
                border-2 transition-all duration-200 
                hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500/50
                ${isSelected
                    ? 'border-blue-600 ring-2 ring-blue-600 ring-opacity-20 shadow-md transform scale-105'
                    : 'border-gray-200 bg-white hover:border-indigo-300'
                }
            `}
            title={item.id}
        >
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                <span className="text-[10px] text-center font-medium text-gray-600 break-words w-full p-1 leading-tight select-none">
                    {item.thumbnail
                        ? item.thumbnail.split('/').pop()
                        : item.id
                    }
                </span>
            </div>

            {/* Selection Label Badge */}
            {isSelected && selectionLabel && (
                <div className="absolute inset-0 flex items-center justify-center bg-blue-600/10 backdrop-blur-[1px]">
                    <div className="bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm uppercase tracking-wider">
                        {selectionLabel}
                    </div>
                </div>
            )}


            {/* Optional: Add a label or indicator for grouped items? */}
            {item.type === 'group' && (
                <div className="absolute top-1 right-1 w-2 h-2 bg-indigo-500 rounded-full shadow-sm" title="Grouped Item"></div>
            )}
        </button>
    );
};

export default PartOption;
