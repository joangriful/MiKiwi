import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import styles from './Index.module.css';

export default function Index() {
    const [currentStep, setCurrentStep] = useState(1);
    const [selections, setSelections] = useState({
        model: { name: 'Classic Wand', price: 89, type: 'classic' },
        material: { name: 'Mate Satinado', price: 0, type: 'satin' },
        color: { name: 'Obsidian Black', hex: '#000' },
        finish: { name: 'Mate Profundo', price: 0, type: 'matte' },
        extras: []
    });

    const [total, setTotal] = useState(89);

    useEffect(() => {
        let newTotal = selections.model.price + selections.material.price + selections.finish.price;
        selections.extras.forEach(e => newTotal += e.price);
        setTotal(newTotal);
    }, [selections]);

    const changeStep = (n) => {
        setCurrentStep(prev => prev + n);
    };

    const updateSelection = (group, item) => {
        setSelections(prev => ({
            ...prev,
            [group]: item
        }));
    };

    const toggleExtra = (extra) => {
        setSelections(prev => {
            const index = prev.extras.findIndex(e => e.id === extra.id);
            if (index > -1) {
                return { ...prev, extras: prev.extras.filter(e => e.id !== extra.id) };
            } else {
                return { ...prev, extras: [...prev.extras, extra] };
            }
        });
    };

    // Model transform logic
    const getModelStyles = () => {
        let styles = {
            width: '180px',
            height: '450px',
            borderRadius: '90px',
            transition: 'var(--transition)',
            transformStyle: 'preserve-3d',
            border: '1px solid rgba(0, 0, 0, 0.03)',
            position: 'relative'
        };

        if (selections.model.type === 'classic') {
            styles.borderRadius = '90px';
        } else {
            styles.borderRadius = '40px 90px 40px 90px';
            styles.transform = 'skewX(-5deg) rotate(3deg)';
        }

        if (selections.material.type === 'metal') {
            styles.background = 'linear-gradient(135deg, #888, #222, #555)';
            styles.boxShadow = '0 50px 100px rgba(0, 0, 0, 0.9), inset 0 0 20px rgba(255,255,255,0.2)';
        } else {
            styles.background = 'linear-gradient(135deg, #333, #111, #222)';
            styles.boxShadow = '0 50px 100px rgba(0, 0, 0, 0.9)';
        }

        return styles;
    };

    return (
        <div className={`${styles.root} h-screen overflow-hidden flex flex-col bg-[var(--bg-main)] font-['Montserrat']`}>
            <Head title="Configurador" />

            {/* TOP BAR */}
            <div className="h-[70px] border-b border-[var(--border)] flex items-center px-[40px] justify-between z-10 bg-white/80 backdrop-blur-[10px]">
                <div className="font-extrabold tracking-[3px] text-[1.2rem] text-[var(--text-main)]">MI KIWI</div>
                <div className="flex gap-[12px] items-center">
                    {[1, 2, 3].map(step => (
                        <React.Fragment key={step}>
                            <div className={`w-[8px] h-[8px] rounded-full transition-all duration-400 ${currentStep >= step ? 'bg-[var(--color-primary)] scale-125 shadow-[0_0_15px_rgba(153,184,73,0.3)]' : 'bg-[var(--border)]'}`}></div>
                            {step < 3 && <div className={`w-[30px] h-[2px] transition-all duration-400 ${currentStep > step ? 'bg-[var(--color-primary)]' : 'bg-[var(--border)]'}`}></div>}
                        </React.Fragment>
                    ))}
                </div>
                <Link href="/configurador" className="text-[1.5rem] text-[var(--text-muted)] cursor-pointer hover:text-[var(--text-main)] transition-all hover:rotate-90">
                    &#10005;
                </Link>
            </div>

            <div className="flex-1 flex overflow-hidden flex-col lg:flex-row">
                {/* PREVIEW */}
                <div className="flex-[1.4] bg-[radial-gradient(circle_at_50%_40%,#ffffff,#f0f4e8)] flex items-center justify-center relative perspective-[1000px]">
                    <div style={getModelStyles()}>
                        <div
                            className="absolute inset-0 rounded-inherit transition-all duration-400 mix-blend-multiply"
                            style={{
                                backgroundColor: selections.color.hex,
                                opacity: selections.finish.type === 'glossy' ? 0.6 : 0.3,
                                borderRadius: 'inherit'
                            }}
                        ></div>
                        <div className="absolute top-[5%] left-[15%] w-[8px] h-[90%] bg-white/80 rounded-[10px] blur-[3px] opacity-50"></div>
                    </div>
                    <div className="absolute bottom-[40px] text-[0.75rem] tracking-[4px] text-[var(--text-muted)] uppercase opacity-60">
                        VISTA PREVIA EN VIVO
                    </div>
                </div>

                {/* CONTROLS */}
                <div className="flex-1 bg-white border-l border-[var(--border)] p-[50px] flex flex-col relative overflow-hidden">

                    {/* STEP 1 */}
                    {currentStep === 1 && (
                        <div className={`${styles.stepPanel} flex-1 flex flex-col`}>
                            <div className="mb-[40px]">
                                <div className="text-[0.8rem] uppercase text-[var(--color-primary)] mb-[8px] tracking-[2px] font-bold">PASO 01</div>
                                <div className="text-[2.2rem] font-semibold tracking-[-1px] text-[var(--text-main)]">Elige tu base</div>
                            </div>

                            <div className="mb-[35px]">
                                <div className="text-[0.8rem] text-[var(--text-muted)] mb-[15px] tracking-[1px] uppercase font-semibold">MODELO</div>
                                <div className="grid grid-cols-2 gap-[12px]">
                                    <div
                                        className={`p-[20px] border rounded-[12px] cursor-pointer transition-all ${selections.model.type === 'classic' ? 'bg-[var(--color-primary)]/5 border-[var(--color-primary)] shadow-[0_0_20px_rgba(153,184,73,0.1)]' : 'bg-white border-[var(--border)] hover:border-[var(--color-primary)] hover:-translate-y-[2px]'}`}
                                        onClick={() => updateSelection('model', { name: 'Classic Wand', price: 89, type: 'classic' })}
                                    >
                                        <div className="font-bold text-[0.95rem] mb-[4px]">Classic Wand</div>
                                        <div className="text-[0.75rem] text-[var(--text-muted)] leading-[1.4]">Cabezal flexible y potencia tradicional.</div>
                                    </div>
                                    <div
                                        className={`p-[20px] border rounded-[12px] cursor-pointer transition-all ${selections.model.type === 'curve' ? 'bg-[var(--color-primary)]/5 border-[var(--color-primary)] shadow-[0_0_20px_rgba(153,184,73,0.1)]' : 'bg-white border-[var(--border)] hover:border-[var(--color-primary)] hover:-translate-y-[2px]'}`}
                                        onClick={() => updateSelection('model', { name: 'Ergo Curve', price: 109, type: 'curve' })}
                                    >
                                        <div className="font-bold text-[0.95rem] mb-[4px]">Ergo Curve</div>
                                        <div className="text-[0.75rem] text-[var(--text-muted)] leading-[1.4]">Diseño ergonómico para mayor confort.</div>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-[35px]">
                                <div className="text-[0.8rem] text-[var(--text-muted)] mb-[15px] tracking-[1px] uppercase font-semibold">MATERIAL</div>
                                <div className="grid grid-cols-2 gap-[12px]">
                                    <div
                                        className={`p-[20px] border rounded-[12px] cursor-pointer transition-all ${selections.material.type === 'satin' ? 'bg-[var(--color-primary)]/5 border-[var(--color-primary)] shadow-[0_0_20px_rgba(153,184,73,0.1)]' : 'bg-white border-[var(--border)] hover:border-[var(--color-primary)] hover:-translate-y-[2px]'}`}
                                        onClick={() => updateSelection('material', { name: 'Mate Satinado', price: 0, type: 'satin' })}
                                    >
                                        <div className="font-bold text-[0.95rem] mb-[4px]">Mate Satinado</div>
                                        <div className="text-[0.75rem] text-[var(--text-muted)] leading-[1.4]">Suave al tacto y antideslizante.</div>
                                    </div>
                                    <div
                                        className={`p-[20px] border rounded-[12px] cursor-pointer transition-all ${selections.material.type === 'metal' ? 'bg-[var(--color-primary)]/5 border-[var(--color-primary)] shadow-[0_0_20px_rgba(153,184,73,0.1)]' : 'bg-white border-[var(--border)] hover:border-[var(--color-primary)] hover:-translate-y-[2px]'}`}
                                        onClick={() => updateSelection('material', { name: 'Metal Pulido', price: 25, type: 'metal' })}
                                    >
                                        <div className="font-bold text-[0.95rem] mb-[4px]">Metal Pulido</div>
                                        <div className="text-[0.75rem] text-[var(--text-muted)] leading-[1.4]">Acabado frío y premium (+25€).</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 2 */}
                    {currentStep === 2 && (
                        <div className={`${styles.stepPanel} flex-1 flex flex-col`}>
                            <div className="mb-[40px]">
                                <div className="text-[0.8rem] uppercase text-[var(--color-primary)] mb-[8px] tracking-[2px] font-bold">PASO 02</div>
                                <div className="text-[2.2rem] font-semibold tracking-[-1px] text-[var(--text-main)]">Personalización</div>
                            </div>

                            <div className="mb-[35px]">
                                <div className="text-[0.8rem] text-[var(--text-muted)] mb-[15px] tracking-[1px] uppercase font-semibold">COLOR</div>
                                <div className="flex gap-[15px]">
                                    {[
                                        { name: 'Obsidian Black', hex: '#000' },
                                        { name: 'Pearl White', hex: '#fff' },
                                        { name: 'Rose Gold', hex: '#e5b3a3' },
                                        { name: 'Kiwi Mint', hex: '#90d090' }
                                    ].map(color => (
                                        <div
                                            key={color.name}
                                            className={`w-[40px] h-[40px] rounded-full cursor-pointer border-[3px] border-white shadow-md transition-all ${selections.color.name === color.name ? 'scale-110 ring-2 ring-[var(--color-primary)]' : ''}`}
                                            style={{ backgroundColor: color.hex }}
                                            onClick={() => updateSelection('color', color)}
                                        ></div>
                                    ))}
                                </div>
                                <div className="mt-[10px] text-[0.8rem] text-[var(--text-muted)]">{selections.color.name}</div>
                            </div>

                            <div className="mb-[35px]">
                                <div className="text-[0.8rem] text-[var(--text-muted)] mb-[15px] tracking-[1px] uppercase font-semibold">ACABADO</div>
                                <div className="grid grid-cols-2 gap-[12px]">
                                    <div
                                        className={`p-[20px] border rounded-[12px] cursor-pointer transition-all ${selections.finish.type === 'matte' ? 'bg-[var(--color-primary)]/5 border-[var(--color-primary)] shadow-[0_0_20px_rgba(153,184,73,0.1)]' : 'bg-white border-[var(--border)] hover:border-[var(--color-primary)] hover:-translate-y-[2px]'}`}
                                        onClick={() => updateSelection('finish', { name: 'Mate Profundo', price: 0, type: 'matte' })}
                                    >
                                        <div className="font-bold text-[0.95rem] mb-[4px]">Mate Profundo</div>
                                        <div className="text-[0.75rem] text-[var(--text-muted)] leading-[1.4]">Sin reflejos, elegancia pura.</div>
                                    </div>
                                    <div
                                        className={`p-[20px] border rounded-[12px] cursor-pointer transition-all ${selections.finish.type === 'glossy' ? 'bg-[var(--color-primary)]/5 border-[var(--color-primary)] shadow-[0_0_20px_rgba(153,184,73,0.1)]' : 'bg-white border-[var(--border)] hover:border-[var(--color-primary)] hover:-translate-y-[2px]'}`}
                                        onClick={() => updateSelection('finish', { name: 'Brillo Espejo', price: 10, type: 'glossy' })}
                                    >
                                        <div className="font-bold text-[0.95rem] mb-[4px]">Brillo Espejo</div>
                                        <div className="text-[0.75rem] text-[var(--text-muted)] leading-[1.4]">Reflejos vibrantes (+10€).</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 3 */}
                    {currentStep === 3 && (
                        <div className={`${styles.stepPanel} flex-1 flex flex-col`}>
                            <div className="mb-[40px]">
                                <div className="text-[0.8rem] uppercase text-[var(--color-primary)] mb-[8px] tracking-[2px] font-bold">PASO 03</div>
                                <div className="text-[2.2rem] font-semibold tracking-[-1px] text-[var(--text-main)]">Extras y Resumen</div>
                            </div>

                            <div className="mb-[35px]">
                                <div className="text-[0.8rem] text-[var(--text-muted)] mb-[15px] tracking-[1px] uppercase font-semibold">ACCESORIOS</div>
                                <div className="grid grid-cols-2 gap-[12px]">
                                    {[
                                        { id: 'case', name: 'Funda de Viaje', price: 15, sub: 'Protección rígida (+15€).' },
                                        { id: 'care', name: 'Kit de Cuidado', price: 12, sub: 'Limpieza y mantenimiento (+12€).' }
                                    ].map(extra => (
                                        <div
                                            key={extra.id}
                                            className={`p-[20px] border rounded-[12px] cursor-pointer transition-all ${selections.extras.find(e => e.id === extra.id) ? 'bg-[var(--color-primary)]/5 border-[var(--color-primary)] shadow-[0_0_20px_rgba(153,184,73,0.1)]' : 'bg-white border-[var(--border)] hover:border-[var(--color-primary)] hover:-translate-y-[2px]'}`}
                                            onClick={() => toggleExtra(extra)}
                                        >
                                            <div className="font-bold text-[0.95rem] mb-[4px]">{extra.name}</div>
                                            <div className="text-[0.75rem] text-[var(--text-muted)] leading-[1.4]">{extra.sub}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex-1">
                                <ul className="list-none">
                                    <li className="flex justify-between py-[12px] border-b border-[var(--border)] text-[0.9rem]">
                                        <span>Base: {selections.model.name}</span>
                                        <span className="font-semibold text-[var(--color-primary)]">{selections.model.price}€</span>
                                    </li>
                                    <li className="flex justify-between py-[12px] border-b border-[var(--border)] text-[0.9rem]">
                                        <span>Material: {selections.material.name}</span>
                                        <span className="font-semibold text-[var(--color-primary)]">{selections.material.price > 0 ? '+' : ''}{selections.material.price}€</span>
                                    </li>
                                    <li className="flex justify-between py-[12px] border-b border-[var(--border)] text-[0.9rem]">
                                        <span>Color: {selections.color.name}</span>
                                        <span className="font-semibold text-[var(--color-primary)]">INCL.</span>
                                    </li>
                                    <li className="flex justify-between py-[12px] text-[0.9rem]">
                                        <span>Extras seleccionados</span>
                                        <span className="font-semibold text-[var(--color-primary)]">+{selections.extras.reduce((acc, e) => acc + e.price, 0)}€</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    )}

                    {/* FOOTER */}
                    <div className="mt-auto border-t border-[var(--border)] pt-[30px] flex justify-between items-center">
                        <div className="flex flex-col">
                            <span className="text-[0.7rem] uppercase text-[var(--text-muted)] tracking-[1px]">TOTAL ESTIMADO</span>
                            <span className="text-[1.6rem] font-light bg-transparent">{total.toFixed(2).replace('.', ',')} €</span>
                        </div>
                        <div className="flex gap-[15px]">
                            {currentStep > 1 && (
                                <button
                                    className={`${styles.actionButton} ${styles.outlineButton} px-[28px] py-[14px]`}
                                    onClick={() => changeStep(-1)}
                                >
                                    Atrás
                                </button>
                            )}
                            <button
                                className={`${styles.actionButton} ${styles.primaryButton} px-[28px] py-[14px]`}
                                onClick={() => currentStep < 3 ? changeStep(1) : alert('Pedido finalizado')}
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
