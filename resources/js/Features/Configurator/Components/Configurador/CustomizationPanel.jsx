import React from 'react';

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
    setBodyProportions
}) {

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
        <div className="customization-panel">
            <div className="panel-header">
                <h2>Personalización</h2>
                <p className="panel-subtitle">Diseña tu muñeca ideal</p>
            </div>

            <div className="panel-content">
                {/* Hair Style */}
                <section className="customization-section">
                    <h3 className="section-title">Estilo de Cabello</h3>
                    <div className="options-grid hair-styles">
                        {hairStyles.map((style) => (
                            <button
                                key={style.id}
                                className={`option-button ${hairStyle === style.id ? 'active' : ''}`}
                                onClick={() => setHairStyle(style.id)}
                            >
                                <span className="option-label">{style.name}</span>
                            </button>
                        ))}
                    </div>
                </section>

                {/* Hair Color */}
                <section className="customization-section">
                    <h3 className="section-title">Color de Cabello</h3>
                    <div className="color-grid">
                        {hairColors.map((color) => (
                            <button
                                key={color.id}
                                className={`color-swatch ${hairColor === color.color ? 'active' : ''}`}
                                style={{ backgroundColor: color.color }}
                                onClick={() => setHairColor(color.color)}
                                title={color.name}
                            >
                                {hairColor === color.color && <span className="checkmark">✓</span>}
                            </button>
                        ))}
                    </div>
                </section>

                {/* Eye Color */}
                <section className="customization-section">
                    <h3 className="section-title">Color de Ojos</h3>
                    <div className="color-grid">
                        {eyeColors.map((color) => (
                            <button
                                key={color.id}
                                className={`color-swatch ${eyeColor === color.color ? 'active' : ''}`}
                                style={{ backgroundColor: color.color }}
                                onClick={() => setEyeColor(color.color)}
                                title={color.name}
                            >
                                {eyeColor === color.color && <span className="checkmark">✓</span>}
                            </button>
                        ))}
                    </div>
                </section>

                {/* Eye Size */}
                <section className="customization-section">
                    <h3 className="section-title">Tamaño de Ojos</h3>
                    <div className="slider-container">
                        <input
                            type="range"
                            min="0.7"
                            max="1.5"
                            step="0.1"
                            value={eyeSize}
                            onChange={(e) => setEyeSize(parseFloat(e.target.value))}
                            className="custom-slider"
                        />
                        <div className="slider-labels">
                            <span>Pequeños</span>
                            <span>Grandes</span>
                        </div>
                    </div>
                </section>

                {/* Skin Tone */}
                <section className="customization-section">
                    <h3 className="section-title">Tono de Piel</h3>
                    <div className="color-grid">
                        {skinTones.map((tone) => (
                            <button
                                key={tone.id}
                                className={`color-swatch skin-tone ${skinTone === tone.color ? 'active' : ''}`}
                                style={{ backgroundColor: tone.color }}
                                onClick={() => setSkinTone(tone.color)}
                                title={tone.name}
                            >
                                {skinTone === tone.color && <span className="checkmark">✓</span>}
                            </button>
                        ))}
                    </div>
                </section>

                {/* Body Proportions */}
                <section className="customization-section">
                    <h3 className="section-title">Proporciones Corporales</h3>

                    <div className="proportion-controls">
                        <div className="proportion-item">
                            <label>
                                <span className="proportion-label">Altura</span>
                                <span className="proportion-value">{bodyProportions.height.toFixed(2)}</span>
                            </label>
                            <input
                                type="range"
                                min="0.8"
                                max="1.2"
                                step="0.01"
                                value={bodyProportions.height}
                                onChange={(e) => setBodyProportions({ ...bodyProportions, height: parseFloat(e.target.value) })}
                                className="custom-slider"
                            />
                        </div>

                        <div className="proportion-item">
                            <label>
                                <span className="proportion-label">Busto</span>
                                <span className="proportion-value">{bodyProportions.bust.toFixed(2)}</span>
                            </label>
                            <input
                                type="range"
                                min="0.6"
                                max="1.8"
                                step="0.01"
                                value={bodyProportions.bust}
                                onChange={(e) => setBodyProportions({ ...bodyProportions, bust: parseFloat(e.target.value) })}
                                className="custom-slider"
                            />
                        </div>

                        <div className="proportion-item">
                            <label>
                                <span className="proportion-label">Cintura</span>
                                <span className="proportion-value">{bodyProportions.waist.toFixed(2)}</span>
                            </label>
                            <input
                                type="range"
                                min="0.6"
                                max="1.4"
                                step="0.01"
                                value={bodyProportions.waist}
                                onChange={(e) => setBodyProportions({ ...bodyProportions, waist: parseFloat(e.target.value) })}
                                className="custom-slider"
                            />
                        </div>

                        <div className="proportion-item">
                            <label>
                                <span className="proportion-label">Caderas</span>
                                <span className="proportion-value">{bodyProportions.hips.toFixed(2)}</span>
                            </label>
                            <input
                                type="range"
                                min="0.7"
                                max="1.8"
                                step="0.01"
                                value={bodyProportions.hips}
                                onChange={(e) => setBodyProportions({ ...bodyProportions, hips: parseFloat(e.target.value) })}
                                className="custom-slider"
                            />
                        </div>
                    </div>
                </section>

                {/* Instructions */}
                <section className="instructions">
                    <div className="instruction-header">Instrucciones de Uso</div>
                    <div className="instruction-item">
                        <span className="instruction-label">Rotar:</span>
                        <span>Clic izquierdo + arrastrar</span>
                    </div>
                    <div className="instruction-item">
                        <span className="instruction-label">Zoom:</span>
                        <span>Rueda del ratón</span>
                    </div>
                    <div className="instruction-item">
                        <span className="instruction-label">Mover:</span>
                        <span>Clic derecho + arrastrar</span>
                    </div>
                </section>
            </div>
        </div>
    );
}
