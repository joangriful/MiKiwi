import React, { useState } from 'react';
import styles from './CustomizationPanel.module.css';
import BodyPartSelector from './BodyPartSelector';

function getOptionButtonClassName(isActive) {
    return [styles.optionButton, isActive ? styles.optionButtonActive : '']
        .filter(Boolean)
        .join(' ');
}

function getColorSwatchClassName({ isActive, isSkinTone = false }) {
    return [
        styles.colorSwatch,
        isSkinTone ? styles.skinToneSwatch : '',
        isActive ? styles.colorSwatchActive : '',
    ]
        .filter(Boolean)
        .join(' ');
}

export default function CustomizationPanel({
    hairStyle,
    setHairStyle,
    hairColor,
    setHairColor,
    eyeColor,
    setEyeColor,
    eyeSize,
    setEyeSize,
    skinTone,
    setSkinTone,
    bodyProportions,
    setBodyProportions,
    selectedParts,
    onPartSelect,
    partLibrary
}) {
    const [activeTab, setActiveTab] = useState('personalizar');

    const hairStyles = [
        { id: 'long', name: 'Largo' },
        { id: 'short', name: 'Corto' },
        { id: 'ponytail', name: 'Coleta' },
        { id: 'curly', name: 'Rizado' },
    ];

    const hairColors = [
        { id: 'blonde', color: '#f4d03f', name: 'Rubio' },
        { id: 'brown', color: '#8b4513', name: 'Castaño' },
        { id: 'black', color: '#1a1a1a', name: 'Negro' },
        { id: 'red', color: '#c0392b', name: 'Pelirrojo' },
        { id: 'pink', color: '#ff69b4', name: 'Rosa' },
        { id: 'blue', color: '#3498db', name: 'Azul' },
        { id: 'purple', color: '#9b59b6', name: 'Morado' },
        { id: 'white', color: '#ecf0f1', name: 'Platino' },
    ];

    const eyeColors = [
        { id: 'blue', color: '#3498db', name: 'Azul' },
        { id: 'green', color: '#2ecc71', name: 'Verde' },
        { id: 'brown', color: '#8b4513', name: 'Marrón' },
        { id: 'gray', color: '#7f8c8d', name: 'Gris' },
        { id: 'purple', color: '#9b59b6', name: 'Violeta' },
        { id: 'red', color: '#e74c3c', name: 'Rojo' },
    ];

    const skinTones = [
        { id: 'fair', color: '#ffd5b4', name: 'Clara' },
        { id: 'light', color: '#f0c8a0', name: 'Media Clara' },
        { id: 'medium', color: '#d4a574', name: 'Media' },
        { id: 'tan', color: '#c68642', name: 'Bronceada' },
        { id: 'brown', color: '#8d5524', name: 'Morena' },
        { id: 'dark', color: '#5c3317', name: 'Oscura' },
    ];

    return (
        <div className={styles.root}>
            <div className={styles.panelHeader}>
                <h2>Personalización</h2>
                <p className={styles.panelSubtitle}>Diseña tu muñeca ideal</p>
            </div>

            {/* Tab Switcher */}
            <div className={styles.panelTabs}>
                <button
                    className={`${styles.tabButton} ${activeTab === 'editar' ? styles.tabButtonActive : ''}`}
                    onClick={() => setActiveTab('editar')}
                >
                    EDITAR
                </button>
                <button
                    className={`${styles.tabButton} ${activeTab === 'personalizar' ? styles.tabButtonActive : ''}`}
                    onClick={() => setActiveTab('personalizar')}
                >
                    PERSONALIZAR
                </button>
            </div>

            <div className={styles.panelContent}>
                {activeTab === 'editar' ? (
                    <div className={styles.editarContent}>
                        {/* Hair Style */}
                        <section className={styles.customizationSection}>
                            <h3 className={styles.sectionTitle}>Estilo de Cabello</h3>
                            <div className={styles.optionsGrid}>
                                {hairStyles.map((style) => (
                                    <button
                                        key={style.id}
                                        className={getOptionButtonClassName(hairStyle === style.id)}
                                        onClick={() => setHairStyle(style.id)}
                                    >
                                        <span className={styles.optionLabel}>{style.name}</span>
                                    </button>
                                ))}
                            </div>
                        </section>

                        {/* Hair Color */}
                        <section className={styles.customizationSection}>
                            <h3 className={styles.sectionTitle}>Color de Cabello</h3>
                            <div className={styles.colorGrid}>
                                {hairColors.map((color) => (
                                    <button
                                        key={color.id}
                                        className={getColorSwatchClassName({ isActive: hairColor === color.color })}
                                        style={{ backgroundColor: color.color }}
                                        onClick={() => setHairColor(color.color)}
                                        title={color.name}
                                    >
                                        {hairColor === color.color && <span className={styles.checkmark}>✓</span>}
                                    </button>
                                ))}
                            </div>
                        </section>

                        {/* Eye Color */}
                        <section className={styles.customizationSection}>
                            <h3 className={styles.sectionTitle}>Color de Ojos</h3>
                            <div className={styles.colorGrid}>
                                {eyeColors.map((color) => (
                                    <button
                                        key={color.id}
                                        className={getColorSwatchClassName({ isActive: eyeColor === color.color })}
                                        style={{ backgroundColor: color.color }}
                                        onClick={() => setEyeColor(color.color)}
                                        title={color.name}
                                    >
                                        {eyeColor === color.color && <span className={styles.checkmark}>✓</span>}
                                    </button>
                                ))}
                            </div>
                        </section>

                        {/* Eye Size */}
                        <section className={styles.customizationSection}>
                            <h3 className={styles.sectionTitle}>Tamaño de Ojos</h3>
                            <div className={styles.sliderContainer}>
                                <input
                                    type="range"
                                    min="0.7"
                                    max="1.5"
                                    step="0.1"
                                    value={eyeSize}
                                    onChange={(e) => setEyeSize(parseFloat(e.target.value))}
                                    className={styles.customSlider}
                                />
                                <div className={styles.sliderLabels}>
                                    <span>Pequeños</span>
                                    <span>Grandes</span>
                                </div>
                            </div>
                        </section>

                        {/* Skin Tone */}
                        <section className={styles.customizationSection}>
                            <h3 className={styles.sectionTitle}>Tono de Piel</h3>
                            <div className={styles.colorGrid}>
                                {skinTones.map((tone) => (
                                    <button
                                        key={tone.id}
                                        className={getColorSwatchClassName({ isActive: skinTone === tone.color, isSkinTone: true })}
                                        style={{ backgroundColor: tone.color }}
                                        onClick={() => setSkinTone(tone.color)}
                                        title={tone.name}
                                    >
                                        {skinTone === tone.color && <span className={styles.checkmark}>✓</span>}
                                    </button>
                                ))}
                            </div>
                        </section>

                        {/* Body Proportions */}
                        <section className={styles.customizationSection}>
                            <h3 className={styles.sectionTitle}>Proporciones Corporales</h3>
                            <div className={styles.proportionControls}>
                                <div className={styles.proportionItem}>
                                    <label className={styles.proportionHeader}>
                                        <span className={styles.proportionLabel}>Altura</span>
                                        <span className={styles.proportionValue}>{bodyProportions.height.toFixed(2)}</span>
                                    </label>
                                    <input
                                        type="range"
                                        min="0.8"
                                        max="1.2"
                                        step="0.01"
                                        value={bodyProportions.height}
                                        onChange={(e) => setBodyProportions({ ...bodyProportions, height: parseFloat(e.target.value) })}
                                        className={styles.customSlider}
                                    />
                                </div>
                                <div className={styles.proportionItem}>
                                    <label className={styles.proportionHeader}>
                                        <span className={styles.proportionLabel}>Busto</span>
                                        <span className={styles.proportionValue}>{bodyProportions.bust.toFixed(2)}</span>
                                    </label>
                                    <input
                                        type="range"
                                        min="0.6"
                                        max="1.8"
                                        step="0.01"
                                        value={bodyProportions.bust}
                                        onChange={(e) => setBodyProportions({ ...bodyProportions, bust: parseFloat(e.target.value) })}
                                        className={styles.customSlider}
                                    />
                                </div>
                            </div>
                        </section>
                    </div>
                ) : (
                    <div className={styles.personalizarContent}>
                        {partLibrary && (
                            <BodyPartSelector
                                selectedParts={selectedParts}
                                onPartSelect={onPartSelect}
                                partLibrary={partLibrary}
                            />
                        )}
                        {!partLibrary && (
                            <div className={styles.loadingPlaceholder}>
                                <p>Cargando biblioteca de partes...</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
