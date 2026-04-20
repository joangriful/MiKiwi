import React from 'react';
import FileExplorer from '../FileExplorer/FileExplorer';
import ColorFilter from '../ColorFilter/ColorFilter';
import styles from './ManagerSidebar.module.css';

export default function ManagerSidebar({
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
}) {
    return (
        <aside className={styles.sidebar}>
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
}
