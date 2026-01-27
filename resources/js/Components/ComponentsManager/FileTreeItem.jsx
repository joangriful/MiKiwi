import React from 'react';

// Stateless FileTreeItem (Renders a single row)
const FileTreeItem = ({ item, isSelected, isFocused, isOpen, onToggle, onSelect, selectionMode }) => {
    const handleClick = (e) => {
        e.stopPropagation();
        if (item.isFolder) {
            onToggle(item);
        } else {
            onSelect(item);
        }
    };

    const handleCheckboxChange = (e) => {
        e.stopPropagation();
        // For multi-select, onSelect needs to handle the toggle based on current state
        onSelect(item, !isSelected);
    };

    return (
        <div
            className={`w-full text-left flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-all duration-200 cursor-pointer border
                ${isFocused ? 'ring-2 ring-[#99b849] border-[#99b849]' : 'border-transparent'}
                ${isSelected && selectionMode === 'single' ? 'bg-[#99b849]/10 text-[#99b849] font-medium' : 'hover:bg-gray-50 text-gray-700'}
            `}
            style={{ paddingLeft: `${item.level * 16 + 12}px` }}
            onClick={handleClick}
        >
            {/* Expansion Icon */}
            <div className="w-4 h-4 shrink-0 flex items-center justify-center">
                {item.isFolder ? (
                    <button onClick={(e) => { e.stopPropagation(); onToggle(item); }} className="hover:bg-gray-200 rounded p-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-3 h-3 text-gray-400 transition-transform ${isOpen ? 'rotate-90' : ''}`}>
                            <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                        </svg>
                    </button>
                ) : (
                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                )}
            </div>

            {/* Checkbox for Multi-Select (Pages) */}
            {selectionMode === 'multi' && !item.isFolder && (
                <input
                    type="checkbox"
                    className="rounded border-gray-300 text-[#99b849] focus:ring-[#99b849] w-4 h-4 cursor-pointer mr-1"
                    checked={isSelected}
                    onChange={handleCheckboxChange}
                />
            )}

            {/* Icon Type */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-4 h-4 shrink-0 ${item.isFolder ? 'text-yellow-500' : (isSelected && selectionMode === 'single' ? 'text-[#99b849]' : 'text-gray-400')}`}>
                {item.isFolder
                    ? <path d="M3.75 3A1.75 1.75 0 002 4.75v3.26a3.235 3.235 0 011.75-.51h12.5c.644 0 1.245.188 1.75.51V6.75A1.75 1.75 0 0016.25 5h-4.836a.25.25 0 01-.177-.073L9.823 3.513A1.75 1.75 0 008.586 3H3.75zM3.75 9A1.75 1.75 0 002 10.75v4.5c0 .966.784 1.75 1.75 1.75h12.5A1.75 1.75 0 0018 15.25v-4.5A1.75 1.75 0 0016.25 9H3.75z" />
                    : <path d="M3 3.5A1.5 1.5 0 014.5 2h6.879a1.5 1.5 0 011.06.44l4.122 4.12A1.5 1.5 0 0117 7.622V16.5a1.5 1.5 0 01-1.5 1.5h-11A1.5 1.5 0 013 16.5v-13z" />
                }
            </svg>

            <span className="truncate">{item.name}</span>
        </div>
    );
};

export default FileTreeItem;
