import React, { useRef, useEffect } from 'react';
import FileTreeItem from '../FileTreeItem/FileTreeItem';
import styles from './FileExplorer.module.css';

function getExplorerLabel(sourceType, selectedColor) {
    return {
        title: `${sourceType} Explorer`,
        colorLabel: selectedColor ? `(${selectedColor})` : null,
    };
}

export default function FileExplorer({
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
}) {
    const sidebarRef = useRef(null);

    useEffect(() => {
        if (focusedIndex >= 0 && sidebarRef.current) {
            const focusedElement = sidebarRef.current.children[focusedIndex];

            if (focusedElement) {
                focusedElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
            }
        }
    }, [focusedIndex]);

    const explorerLabel = getExplorerLabel(sourceType, selectedColor);

    return (
        <>
            <div className={styles.header}>
                <div className={styles.sourceToggle}>
                    <button
                        type="button"
                        onClick={() => setSourceType('components')}
                        className={`${styles.sourceButton} ${sourceType === 'components' ? styles.sourceButtonActive : ''}`}
                    >
                        Components
                    </button>
                    <button
                        type="button"
                        onClick={() => setSourceType('pages')}
                        className={`${styles.sourceButton} ${sourceType === 'pages' ? styles.sourceButtonActive : ''}`}
                    >
                        Pages
                    </button>
                </div>
            </div>

            <div className={styles.explorer} ref={sidebarRef}>
                <div className={styles.label}>
                    {explorerLabel.title}
                    {explorerLabel.colorLabel && <span className={styles.selectedColor}>{explorerLabel.colorLabel}</span>}
                </div>
                {visibleItems.map((item, index) => (
                    <FileTreeItem
                        key={item.path || item.fullPathComponents?.join('/')}
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
}
