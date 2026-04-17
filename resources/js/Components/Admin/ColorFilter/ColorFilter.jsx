import React from 'react';

const ColorFilter = ({ definedColors, selectedColor, setSelectedColor }) => {
    return (
        <div className="p-4 border-t border-gray-100 bg-gray-50/50 shrink-0">
            <div className="flex justify-between items-center mb-2">
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Filter by Color
                </div>
                {selectedColor && (
                    <button
                        onClick={() => setSelectedColor(null)}
                        className="text-[10px] text-gray-400 hover:text-gray-600 underline"
                    >
                        Clear
                    </button>
                )}
            </div>
            <div className="grid grid-cols-8 gap-0 border border-gray-200 rounded-lg overflow-hidden">
                {definedColors.map(color => (
                    <button
                        key={color.name}
                        onClick={() => setSelectedColor(selectedColor === color.name ? null : color.name)}
                        className={`w-full aspect-square transition-all relative group flex items-center justify-center
                            ${selectedColor === color.name ? 'z-10 ring-2 ring-inset ring-white' : 'hover:scale-105 hover:z-10 hover:shadow-sm'}
                        `}
                        style={{ backgroundColor: color.hex }}
                        title={`${color.label} (${color.hex})`}
                    >
                        {selectedColor === color.name && (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 text-white/90 drop-shadow-md">
                                <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                            </svg>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ColorFilter;
