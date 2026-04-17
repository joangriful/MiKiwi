import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import styles from './FilterMenu.module.css';

export default function FilterMenu({ isOpen, onClose, categories = [], filters = {} }) {
    // Local state to store changes before applying
    const [localFilters, setLocalFilters] = useState(filters);

    // Al cambiar la categoría principal, reseteamos la subcategoría
    const handleCategoryClick = (category) => {
        const isSelected = localFilters.category === category.id;
        setLocalFilters(prev => ({
            ...prev,
            category: isSelected ? null : category.id,
            categoryName: isSelected ? null : category.name,
            subCategory: null,
            // Guardamos los hijos para mostrarlos
            activeChildren: isSelected ? [] : (category.children || [])
        }));
    };

    // Sync local state when menu opens
    useEffect(() => {
        if (isOpen) {
            setLocalFilters(filters);

            // Si hay una categoría seleccionada, buscamos sus hijos
            if (filters.category) {
                const activeCat = categories.find(c => String(c.id) === String(filters.category));
                if (activeCat) {
                    setLocalFilters(prev => ({
                        ...prev,
                        activeChildren: activeCat.children || []
                    }));
                }
            }

            // Block scroll
            document.body.style.overflow = 'hidden';
        } else {
            // Restore scroll
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen, filters, categories]);

    if (!isOpen) return null;

    const updateLocalFilter = (newParams) => {
        setLocalFilters(prev => ({ ...prev, ...newParams }));
    };

    const handleApply = () => {
        router.get(
            route('products.index'),
            localFilters,
            { preserveState: true }
        );
        onClose();
    };

    const handleClear = () => {
        setLocalFilters({});
        router.get(route('products.index'));
        onClose();
    };

    return (
        <div className={`${styles.root} fixed inset-0 z-[100] overflow-hidden flex justify-end`}>
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-md transition-opacity animate-in fade-in duration-500"
                onClick={onClose}
            ></div>

            {/* Menu Panel */}
            <div className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-500 ease-out">
                {/* Header */}
                <div className="p-10 border-b border-gray-100 flex justify-between items-center group">
                    <div className="flex flex-col">
                        <h2 className="text-3xl font-bold text-gray-900 tracking-tighter">Filtros Avanzados</h2>
                        <span className="text-[10px] uppercase tracking-[0.2em] text-[#99b849] font-bold mt-1">Sincronía Sensorial</span>
                    </div>
                    <button onClick={onClose} className="w-12 h-12 flex items-center justify-center hover:bg-gray-100 rounded-full transition-all active:scale-90">
                        <span className="material-symbols-outlined text-gray-400 group-hover:text-black transition-colors">close</span>
                    </button>
                </div>

                <div className="flex-grow overflow-y-auto px-10 py-12 space-y-16 scrollbar-thin scrollbar-thumb-gray-200">

                    {/* Stock & Highlights */}
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => updateLocalFilter({ stock: localFilters.stock ? null : 1 })}
                            className={`flex items-center justify-between px-6 py-5 rounded-3xl border transition-all ${localFilters.stock ? 'bg-black border-black text-white shadow-xl shadow-black/10' : 'bg-gray-50 border-transparent hover:border-gray-200'}`}
                        >
                            <span className="text-xs font-bold uppercase tracking-widest text-inherit">En Stock</span>
                            <div className={`w-2 h-2 rounded-full ${localFilters.stock ? 'bg-[#99b849]' : 'bg-gray-300'}`}></div>
                        </button>

                        <button
                            onClick={() => updateLocalFilter({ offer: localFilters.offer ? null : 1 })}
                            className={`flex items-center justify-between px-6 py-5 rounded-3xl border transition-all ${localFilters.offer ? 'bg-black border-black text-white shadow-xl shadow-black/10' : 'bg-gray-50 border-transparent hover:border-gray-200'}`}
                        >
                            <span className="text-xs font-bold uppercase tracking-widest text-inherit">Descuentos</span>
                            <span className="text-[10px] font-bold bg-[#99b849]/20 text-[#99b849] px-2 py-0.5 rounded-full">%</span>
                        </button>
                    </div>

                    {/* Categories Section */}
                    <section>
                        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mb-8 border-l-2 border-[#99b849] pl-4">Explorar Colección</h3>
                        <div className="grid grid-cols-2 gap-3 mb-6">
                            {categories.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => handleCategoryClick(category)}
                                    className={`px-5 py-4 rounded-3xl text-[11px] font-bold uppercase tracking-widest transition-all text-left border flex justify-between items-center ${localFilters.category == category.id
                                        ? 'bg-black text-white border-black shadow-lg shadow-black/10'
                                        : 'bg-gray-50 text-gray-600 border-transparent hover:border-gray-200'
                                        }`}
                                >
                                    <span>{category.name}</span>
                                    <span className={`text-[9px] px-2 py-0.5 rounded-full ${localFilters.category == category.id ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-400'}`}>
                                        {category.total_products_count || 0}
                                    </span>
                                </button>
                            ))}
                        </div>

                        {/* Sub-categories (Conditional) */}
                        {localFilters.activeChildren && localFilters.activeChildren.length > 0 && (
                            <div className="flex flex-wrap gap-2 animate-in fade-in slide-in-from-top-2 duration-300 bg-gray-50/50 p-4 rounded-[2rem] border border-gray-100">
                                {localFilters.activeChildren.map((sub) => (
                                    <button
                                        key={sub.id}
                                        onClick={() => updateLocalFilter({ subCategory: localFilters.subCategory === sub.name ? null : sub.name })}
                                        className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all border flex items-center gap-2 ${localFilters.subCategory === sub.name
                                            ? 'bg-[#99b849] text-white border-[#99b849] shadow-md shadow-[#99b849]/20'
                                            : 'bg-white text-gray-400 border-gray-200 hover:border-black hover:text-black'
                                            }`}
                                    >
                                        <span>{sub.name}</span>
                                        <span className={`text-[8px] px-1.5 py-0.5 rounded-full ${localFilters.subCategory === sub.name ? 'bg-white/30 text-white' : 'bg-gray-100 text-gray-400'}`}>
                                            {sub.products_count || 0}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </section>

                    {/* Ratings Section */}
                    <section>
                        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mb-8 border-l-2 border-[#99b849] pl-4">Valoraciones</h3>
                        <div className="flex gap-2">
                            {[5, 4, 3, 2, 1].map((rating) => (
                                <button
                                    key={rating}
                                    onClick={() => updateLocalFilter({ rating: localFilters.rating == rating ? null : rating })}
                                    className={`flex-grow flex items-center justify-center gap-1 py-4 rounded-3xl transition-all border ${localFilters.rating == rating
                                        ? 'bg-black text-white border-black'
                                        : 'bg-gray-50 text-gray-400 border-transparent hover:border-gray-200'
                                        }`}
                                >
                                    <span className="text-xs font-bold">{rating}</span>
                                    <span className={`material-symbols-outlined text-sm ${localFilters.rating == rating ? 'text-[#99b849]' : 'text-inherit'}`}>star</span>
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* Discreción (Noise Level) */}
                    <section>
                        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mb-8 border-l-2 border-[#99b849] pl-4">Nivel de Silencio</h3>
                        <div className="grid grid-cols-2 gap-3">
                            {['Whisper', 'Standard'].map((level) => (
                                <button
                                    key={level}
                                    onClick={() => updateLocalFilter({ noise: localFilters.noise === level ? null : level })}
                                    className={`px-5 py-4 rounded-3xl text-xs font-bold uppercase tracking-widest transition-all text-left border ${localFilters.noise === level
                                        ? 'bg-black text-white border-black shadow-lg shadow-black/10'
                                        : 'bg-gray-50 text-gray-600 border-transparent hover:border-gray-200'
                                        }`}
                                >
                                    {level === 'Whisper' ? 'Ultra Silencioso' : 'Estándar V6'}
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* Usage & Types */}
                    <section>
                        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mb-8 border-l-2 border-[#99b849] pl-4">Modo de Uso</h3>
                        <div className="flex flex-wrap gap-2">
                            {['Solo', 'En Pareja', 'Penetración', 'Licking', 'Estimulación Clitoriana'].map((use) => (
                                <button
                                    key={use}
                                    onClick={() => updateLocalFilter({ usage: localFilters.usage === use ? null : use })}
                                    className={`px-6 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all border ${localFilters.usage === use
                                        ? 'bg-black text-[#99b849] border-black'
                                        : 'bg-white text-gray-400 border-gray-200 hover:border-black hover:text-black'
                                        }`}
                                >
                                    {use}
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* Color Picker */}
                    <section>
                        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mb-8 border-l-2 border-[#99b849] pl-4">Acabados Sensoriales</h3>
                        <div className="flex gap-4">
                            {[
                                { name: 'Noir', hex: '#111' },
                                { name: 'Biolink', hex: '#99b849' },
                                { name: 'Aura', hex: '#f8b7ea' },
                                { name: 'Mist', hex: '#e2e0db' },
                            ].map((color) => (
                                <button
                                    key={color.name}
                                    onClick={() => updateLocalFilter({ color: localFilters.color === color.name ? null : color.name })}
                                    className={`w-12 h-12 rounded-full border-2 transition-all flex items-center justify-center p-1 ${localFilters.color === color.name ? 'border-black scale-110 shadow-lg' : 'border-transparent'
                                        }`}
                                >
                                    <div
                                        className="w-full h-full rounded-full shadow-inner"
                                        style={{ backgroundColor: color.hex }}
                                        title={color.name}
                                    ></div>
                                </button>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Footer Actions */}
                <div className="p-10 border-t border-gray-100 bg-gray-50/50 flex gap-4">
                    <button
                        onClick={handleClear}
                        className="flex-grow bg-white text-black border border-gray-200 py-5 rounded-[32px] font-bold hover:bg-gray-100 transition-all text-xs uppercase tracking-[0.2em]"
                    >
                        Limpiar Todo
                    </button>
                    <button
                        onClick={handleApply}
                        className="flex-grow bg-black text-white py-5 rounded-[32px] font-bold hover:bg-gray-800 transition-all shadow-xl shadow-black/10 text-xs uppercase tracking-[0.2em] relative overflow-hidden group"
                    >
                        <span className="relative z-10">Aplicar Filtros</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    </button>
                </div>
            </div>
        </div>
    );
}
