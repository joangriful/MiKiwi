import React from 'react';
import styles from './ColorFilter.module.css';

export default function ColorFilter({ definedColors, selectedColor, setSelectedColor }) {
    const handleClearSelection = () => {
        setSelectedColor(null);
    };

    const handleColorSelection = (colorName) => {
        setSelectedColor(selectedColor === colorName ? null : colorName);
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.title}>
                    Filter by Color
                </div>
                {selectedColor && (
                    <button
                        type="button"
                        onClick={handleClearSelection}
                        className={styles.clearButton}
                    >
                        Clear
                    </button>
                )}
            </div>
            <div className={styles.grid}>
                {definedColors.map(color => (
                    <button
                        type="button"
                        key={color.name}
                        onClick={() => handleColorSelection(color.name)}
                        className={`${styles.colorButton} ${selectedColor === color.name ? styles.colorButtonSelected : ''}`}
                        style={{ backgroundColor: color.hex }}
                        title={`${color.label} (${color.hex})`}
                    >
                        {selectedColor === color.name && (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={styles.checkIcon}>
                                <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                            </svg>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
}
