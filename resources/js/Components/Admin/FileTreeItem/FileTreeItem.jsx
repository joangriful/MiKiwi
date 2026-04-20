import React from 'react';
import styles from './FileTreeItem.module.css';

function getRowClassName(isFocused, isSelected, selectionMode) {
    return `${styles.row} ${isFocused ? styles.rowFocused : ''} ${isSelected && selectionMode === 'single' ? styles.rowSelected : ''}`;
}

export default function FileTreeItem({ item, isSelected, isFocused, isOpen, onToggle, onSelect, selectionMode }) {
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
        onSelect(item, !isSelected);
    };

    const rowClassName = getRowClassName(isFocused, isSelected, selectionMode);
    const itemIconClassName = `${styles.itemIcon} ${item.isFolder ? styles.folderIcon : ''} ${!item.isFolder && isSelected && selectionMode === 'single' ? styles.itemIconSelected : ''}`;
    const chevronClassName = `${styles.chevronIcon} ${isOpen ? styles.chevronIconOpen : ''}`;

    return (
        <div
            className={rowClassName}
            style={{ paddingLeft: `${item.level * 16 + 12}px` }}
            onClick={handleClick}
        >
            <div className={styles.expansionIcon}>
                {item.isFolder ? (
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggle(item);
                        }}
                        className={styles.expandButton}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={chevronClassName}>
                            <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                        </svg>
                    </button>
                ) : (
                    <span className={styles.fileDot}></span>
                )}
            </div>

            {selectionMode === 'multi' && !item.isFolder && (
                <input
                    type="checkbox"
                    className={styles.checkbox}
                    checked={isSelected}
                    onChange={handleCheckboxChange}
                />
            )}

            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={itemIconClassName}>
                {item.isFolder
                    ? <path d="M3.75 3A1.75 1.75 0 002 4.75v3.26a3.235 3.235 0 011.75-.51h12.5c.644 0 1.245.188 1.75.51V6.75A1.75 1.75 0 0016.25 5h-4.836a.25.25 0 01-.177-.073L9.823 3.513A1.75 1.75 0 008.586 3H3.75zM3.75 9A1.75 1.75 0 002 10.75v4.5c0 .966.784 1.75 1.75 1.75h12.5A1.75 1.75 0 0018 15.25v-4.5A1.75 1.75 0 0016.25 9H3.75z" />
                    : <path d="M3 3.5A1.5 1.5 0 014.5 2h6.879a1.5 1.5 0 011.06.44l4.122 4.12A1.5 1.5 0 0117 7.622V16.5a1.5 1.5 0 01-1.5 1.5h-11A1.5 1.5 0 013 16.5v-13z" />
                }
            </svg>

            <span className={styles.name}>{item.name}</span>
        </div>
    );
}
