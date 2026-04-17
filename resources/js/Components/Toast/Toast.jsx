import React, { useEffect } from 'react';
import styles from './Toast.module.css';

export default function Toast({ message, type = 'success', onClose }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            if (onClose) onClose();
        }, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    if (!message) return null;

    return (
        <div className={`${styles.root} fixed bottom-6 right-6 px-6 py-4 rounded-xl shadow-2xl text-white font-medium transition-all transform z-[9999] flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300 ${type === 'success' ? 'bg-green-600' : 'bg-red-600'
            }`}>
            <span className="material-symbols-outlined text-xl bg-white/20 p-1 rounded-full">
                {type === 'success' ? 'check' : 'priority_high'}
            </span>
            <div>
                <p className="text-sm">{message}</p>
            </div>
            <button onClick={onClose} className="ml-4 opacity-70 hover:opacity-100 transition-opacity">
                <span className="material-symbols-outlined text-lg">close</span>
            </button>
        </div>
    );
}
