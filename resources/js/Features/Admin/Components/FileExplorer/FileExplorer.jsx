import React, { useRef, useEffect } from 'react';
import FileTreeItem from '../FileTreeItem/FileTreeItem';
import './FileExplorer.css';

const FileExplorer = ({
    sourceType,
    setSourceType,
    selectedColor,
    visibleItems,
    focusedIndex,
    selectedPagePaths,
    selectedComponentPath,
    openFolders,
    handleFolderToggle,
    handleItemSelect
}) => {
    // Scroll focused item into view
    const sidebarRef = useRef(null);
    useEffect(() => {
        if (focusedIndex >= 0 && sidebarRef.current) {
            const focusedElement = sidebarRef.current.children[focusedIndex];
            if (focusedElement) {
                focusedElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
            }
        }
    }, [focusedIndex]);

    return (
        <>
            <div className="p-4 border-b border-gray-100 shrink-0">
                <div className="flex bg-gray-100 p-1 rounded-lg w-full mb-2">
                    <button
                        onClick={() => setSourceType('components')}
                        className={`flex-1 py-1.5 rounded-md text-xs font-medium transition-all ${sourceType === 'components' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Components
                    </button>
                    <button
                        onClick={() => setSourceType('pages')}
                        className={`flex-1 py-1.5 rounded-md text-xs font-medium transition-all ${sourceType === 'pages' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Pages
                    </button>
                </div>
            </div>

            <div className="p-4 flex-1 overflow-y-auto no-scrollbar min-h-0" ref={sidebarRef}>
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-2">
                    {sourceType} Explorer
                    {selectedColor && <span className="text-[#99b849] ml-1">({selectedColor})</span>}
                </div>
                {visibleItems.map((item, index) => (
                    <FileTreeItem
                        key={item.path || item.fullPathComponents?.join('/')} // Safe check
                        item={item}
                        isFocused={index === focusedIndex}
                        isSelected={!item.isFolder && (sourceType === 'pages' ? selectedPagePaths.has(item.path) : selectedComponentPath === item.path)}
                        isOpen={item.isFolder && openFolders.has(item.fullPathComponents.join('/'))}
                        onToggle={handleFolderToggle}
                        onSelect={handleItemSelect}
                        selectionMode={sourceType === 'pages' ? 'multi' : 'single'}
                    />
                ))}
            </div>
        </>
    );
};

export default FileExplorer;
