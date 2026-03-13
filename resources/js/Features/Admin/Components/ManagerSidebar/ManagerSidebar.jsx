import React from 'react';
import FileExplorer from '../FileExplorer/FileExplorer';
import ColorFilter from '../ColorFilter/ColorFilter';
import './ManagerSidebar.css';

const ManagerSidebar = ({
    sourceType,
    setSourceType,
    definedColors,
    selectedColor,
    setSelectedColor,
    visibleItems,
    focusedIndex,
    selectedPagePaths,
    selectedComponentPath,
    openFolders,
    handleFolderToggle,
    handleItemSelect
}) => {
    return (
        <aside className="w-80 bg-white border-r border-gray-200 overflow-hidden flex flex-col shrink-0 h-full">
            <FileExplorer
                sourceType={sourceType}
                setSourceType={setSourceType}
                selectedColor={selectedColor}
                visibleItems={visibleItems}
                focusedIndex={focusedIndex}
                selectedPagePaths={selectedPagePaths}
                selectedComponentPath={selectedComponentPath}
                openFolders={openFolders}
                handleFolderToggle={handleFolderToggle}
                handleItemSelect={handleItemSelect}
            />
            <ColorFilter
                definedColors={definedColors}
                selectedColor={selectedColor}
                setSelectedColor={setSelectedColor}
            />
        </aside>
    );
};

export default ManagerSidebar;
