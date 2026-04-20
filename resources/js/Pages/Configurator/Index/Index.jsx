import React, { useEffect, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import styles from './Index.module.css';

const MODEL_OPTIONS = [
    {
        name: 'Classic Wand',
        price: 89,
        type: 'classic',
        description: 'Cabezal flexible y potencia tradicional.',
    },
    {
        name: 'Ergo Curve',
        price: 109,
        type: 'curve',
        description: 'Diseño ergonómico para mayor confort.',
    },
];

const MATERIAL_OPTIONS = [
    {
        name: 'Mate Satinado',
        price: 0,
        type: 'satin',
        description: 'Suave al tacto y antideslizante.',
    },
    {
        name: 'Metal Pulido',
        price: 25,
        type: 'metal',
        description: 'Acabado frío y premium (+25€).',
    },
];

const FINISH_OPTIONS = [
    {
        name: 'Mate Profundo',
        price: 0,
        type: 'matte',
        description: 'Sin reflejos, elegancia pura.',
    },
    {
        name: 'Brillo Espejo',
        price: 10,
        type: 'glossy',
        description: 'Reflejos vibrantes (+10€).',
    },
];

const COLOR_OPTIONS = [
    { name: 'Obsidian Black', hex: '#000' },
    { name: 'Pearl White', hex: '#fff' },
    { name: 'Rose Gold', hex: '#e5b3a3' },
    { name: 'Kiwi Mint', hex: '#90d090' },
];

const EXTRA_OPTIONS = [
    { id: 'case', name: 'Funda de Viaje', price: 15, description: 'Protección rígida (+15€).' },
    { id: 'care', name: 'Kit de Cuidado', price: 12, description: 'Limpieza y mantenimiento (+12€).' },
];

export default function Index() {
    const [currentStep, setCurrentStep] = useState(1);
    const [selections, setSelections] = useState({
        model: MODEL_OPTIONS[0],
        material: MATERIAL_OPTIONS[0],
        color: COLOR_OPTIONS[0],
        finish: FINISH_OPTIONS[0],
        extras: [],
    });
    const [total, setTotal] = useState(89);

    useEffect(() => {
        let newTotal = selections.model.price + selections.material.price + selections.finish.price;
        selections.extras.forEach((extra) => {
            newTotal += extra.price;
        });
        setTotal(newTotal);
    }, [selections]);

    const changeStep = (increment) => {
        setCurrentStep((prev) => prev + increment);
    };

    const updateSelection = (group, item) => {
        setSelections((prev) => ({
            ...prev,
            [group]: item,
        }));
    };

    const toggleExtra = (extra) => {
        setSelections((prev) => {
            const exists = prev.extras.some((item) => item.id === extra.id);

            return {
                ...prev,
                extras: exists ? prev.extras.filter((item) => item.id !== extra.id) : [...prev.extras, extra],
            };
        });
    };

    const getModelStyles = () => {
        const dynamicStyles = {
            width: '180px',
            height: '450px',
            borderRadius: '90px',
            transition: 'var(--transition)',
            transformStyle: 'preserve-3d',
            border: '1px solid rgba(0, 0, 0, 0.03)',
            position: 'relative',
        };

        if (selections.model.type === 'curve') {
            dynamicStyles.borderRadius = '40px 90px 40px 90px';
            dynamicStyles.transform = 'skewX(-5deg) rotate(3deg)';
        }

        if (selections.material.type === 'metal') {
            dynamicStyles.background = 'linear-gradient(135deg, #888, #222, #555)';
            dynamicStyles.boxShadow = '0 50px 100px rgba(0, 0, 0, 0.9), inset 0 0 20px rgba(255,255,255,0.2)';
        } else {
            dynamicStyles.background = 'linear-gradient(135deg, #333, #111, #222)';
            dynamicStyles.boxShadow = '0 50px 100px rgba(0, 0, 0, 0.9)';
        }

        return dynamicStyles;
    };

    const getOptionCardClass = (isActive) => (
        `${styles.optionCard} ${isActive ? styles.optionCardActive : ''}`
    );

    return (
        <div className={styles.page}>
            <Head title="Configurador" />

            <div className={styles.topBar}>
                <div className={styles.brand}>MI KIWI</div>

                <div className={styles.progress}>
                    {[1, 2, 3].map((step) => (
                        <React.Fragment key={step}>
                            <div
                                className={`${styles.progressDot} ${currentStep >= step ? styles.progressDotActive : ''}`}
                            ></div>
                            {step < 3 && (
                                <div
                                    className={`${styles.progressLine} ${currentStep > step ? styles.progressLineActive : ''}`}
                                ></div>
                            )}
                        </React.Fragment>
                    ))}
                </div>

                <Link href="/configurador" className={styles.closeLink}>
                    &#10005;
                </Link>
            </div>

            <div className={styles.content}>
                <div className={styles.previewPane}>
                    <div style={getModelStyles()}>
                        <div
                            className={styles.previewOverlay}
                            style={{
                                backgroundColor: selections.color.hex,
                                opacity: selections.finish.type === 'glossy' ? 0.6 : 0.3,
                                borderRadius: 'inherit',
                            }}
                        ></div>
                        <div className={styles.previewHighlight}></div>
                    </div>

                    <div className={styles.previewLabel}>VISTA PREVIA EN VIVO</div>
                </div>

                <div className={styles.controls}>
                    {currentStep === 1 && (
                        <div className={styles.stepPanel}>
                            <div className={styles.stepHeader}>
                                <div className={styles.stepTag}>PASO 01</div>
                                <div className={styles.stepTitle}>Elige tu base</div>
                            </div>

                            <div className={styles.optionSection}>
                                <div className={styles.sectionLabel}>MODELO</div>
                                <div className={styles.optionGrid}>
                                    {MODEL_OPTIONS.map((option) => (
                                        <button
                                            key={option.type}
                                            type="button"
                                            className={getOptionCardClass(selections.model.type === option.type)}
                                            onClick={() => updateSelection('model', option)}
                                        >
                                            <div className={styles.optionName}>{option.name}</div>
                                            <div className={styles.optionDescription}>{option.description}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className={styles.optionSection}>
                                <div className={styles.sectionLabel}>MATERIAL</div>
                                <div className={styles.optionGrid}>
                                    {MATERIAL_OPTIONS.map((option) => (
                                        <button
                                            key={option.type}
                                            type="button"
                                            className={getOptionCardClass(selections.material.type === option.type)}
                                            onClick={() => updateSelection('material', option)}
                                        >
                                            <div className={styles.optionName}>{option.name}</div>
                                            <div className={styles.optionDescription}>{option.description}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {currentStep === 2 && (
                        <div className={styles.stepPanel}>
                            <div className={styles.stepHeader}>
                                <div className={styles.stepTag}>PASO 02</div>
                                <div className={styles.stepTitle}>Personalización</div>
                            </div>

                            <div className={styles.optionSection}>
                                <div className={styles.sectionLabel}>COLOR</div>
                                <div className={styles.colorRow}>
                                    {COLOR_OPTIONS.map((color) => (
                                        <button
                                            key={color.name}
                                            type="button"
                                            className={`${styles.colorSwatch} ${selections.color.name === color.name ? styles.colorSwatchActive : ''}`}
                                            style={{ backgroundColor: color.hex }}
                                            onClick={() => updateSelection('color', color)}
                                            aria-label={`Seleccionar ${color.name}`}
                                        ></button>
                                    ))}
                                </div>
                                <div className={styles.colorName}>{selections.color.name}</div>
                            </div>

                            <div className={styles.optionSection}>
                                <div className={styles.sectionLabel}>ACABADO</div>
                                <div className={styles.optionGrid}>
                                    {FINISH_OPTIONS.map((option) => (
                                        <button
                                            key={option.type}
                                            type="button"
                                            className={getOptionCardClass(selections.finish.type === option.type)}
                                            onClick={() => updateSelection('finish', option)}
                                        >
                                            <div className={styles.optionName}>{option.name}</div>
                                            <div className={styles.optionDescription}>{option.description}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {currentStep === 3 && (
                        <div className={styles.stepPanel}>
                            <div className={styles.stepHeader}>
                                <div className={styles.stepTag}>PASO 03</div>
                                <div className={styles.stepTitle}>Extras y Resumen</div>
                            </div>

                            <div className={styles.optionSection}>
                                <div className={styles.sectionLabel}>ACCESORIOS</div>
                                <div className={styles.optionGrid}>
                                    {EXTRA_OPTIONS.map((extra) => (
                                        <button
                                            key={extra.id}
                                            type="button"
                                            className={getOptionCardClass(selections.extras.some((item) => item.id === extra.id))}
                                            onClick={() => toggleExtra(extra)}
                                        >
                                            <div className={styles.optionName}>{extra.name}</div>
                                            <div className={styles.optionDescription}>{extra.description}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <ul className={styles.summaryList}>
                                    <li className={styles.summaryItem}>
                                        <span>Base: {selections.model.name}</span>
                                        <span className={styles.summaryValue}>{selections.model.price}€</span>
                                    </li>
                                    <li className={styles.summaryItem}>
                                        <span>Material: {selections.material.name}</span>
                                        <span className={styles.summaryValue}>
                                            {selections.material.price > 0 ? '+' : ''}
                                            {selections.material.price}€
                                        </span>
                                    </li>
                                    <li className={styles.summaryItem}>
                                        <span>Color: {selections.color.name}</span>
                                        <span className={styles.summaryValue}>INCL.</span>
                                    </li>
                                    <li className={`${styles.summaryItem} ${styles.summaryItemLast}`}>
                                        <span>Extras seleccionados</span>
                                        <span className={styles.summaryValue}>
                                            +{selections.extras.reduce((acc, extra) => acc + extra.price, 0)}€
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    )}

                    <div className={styles.footer}>
                        <div className={styles.totalBlock}>
                            <span className={styles.totalLabel}>TOTAL ESTIMADO</span>
                            <span className={styles.totalValue}>{total.toFixed(2).replace('.', ',')} €</span>
                        </div>

                        <div className={styles.footerActions}>
                            {currentStep > 1 && (
                                <button
                                    type="button"
                                    className={`${styles.actionButton} ${styles.outlineButton}`}
                                    onClick={() => changeStep(-1)}
                                >
                                    Atrás
                                </button>
                            )}
                            <button
                                type="button"
                                className={`${styles.actionButton} ${styles.primaryButton}`}
                                onClick={() => (currentStep < 3 ? changeStep(1) : alert('Pedido finalizado'))}
                            >
                                {currentStep === 3 ? 'Finalizar Pedido' : 'Siguiente'} &rarr;
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
