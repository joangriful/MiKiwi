import React, { useEffect } from 'react';
import styles from './ConfiguratorCommon.module.css';

console.log('%c[File] %cConfiguratorTabs.jsx CARGADO', "color: #795548; font-weight: bold", "color: #666");

export default function ConfiguratorTabs({ activeTab, setActiveTab }) {
    console.log('%c[Execution] %cEntrando en ConfiguratorTabs', "color: #4CAF50; font-weight: bold");

    useEffect(() => {
        console.log('%c[Component] %cConfiguratorTabs Montado', "color: #9c27b0; font-weight: bold", "color: #666");
    }, []);
    
    return (
        <div className={`${styles.tabsRoot} z-50 bg-white border-b border-gray-100`}>
            <div className="flex justify-center border-t border-[var(--border)] bg-[var(--bg-surface)] py-4">
                <div className="inline-flex p-1.5 bg-[var(--bg-main)] rounded-2xl shadow-inner border border-[var(--border)]/50">
                    <button
                        onClick={() => setActiveTab('customize')}
                        className={`px-8 py-2.5 rounded-xl text-sm font-bold tracking-wide transition-all duration-300 ${activeTab === 'customize'
                            ? 'bg-[var(--premium-gradient)] text-white shadow-[0_4px_15px_rgba(153,184,73,0.4)] scale-105'
                            : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-white/50'
                            }`}
                    >
                        PERSONALIZAR
                    </button>
                    <button
                        onClick={() => setActiveTab('ready')}
                        className={`px-8 py-2.5 rounded-xl text-sm font-bold tracking-wide transition-all duration-300 ${activeTab === 'ready'
                            ? 'bg-[var(--premium-gradient)] text-white shadow-[0_4px_15px_rgba(153,184,73,0.4)] scale-105'
                            : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-white/50'
                            }`}
                    >
                        MUÑECAS LISTAS
                    </button>
                </div>
            </div>
        </div>
    );
}
