import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

const ConfirmContext = createContext(null);

const DEFAULT_OPTIONS = {
    title: 'Confirmar acción',
    message: '¿Quieres continuar?',
    confirmText: 'Confirmar',
    cancelText: 'Cancelar',
    tone: 'danger',
};

function resolveToneClasses(tone) {
    if (tone === 'neutral') {
        return 'bg-gray-900 hover:bg-black text-white';
    }

    return 'bg-red-600 hover:bg-red-700 text-white';
}

export function ConfirmProvider({ children }) {
    const [isOpen, setIsOpen] = useState(false);
    const [options, setOptions] = useState(DEFAULT_OPTIONS);
    const resolverRef = useRef(null);

    const closeDialog = useCallback((accepted) => {
        setIsOpen(false);

        if (resolverRef.current) {
            resolverRef.current(accepted);
            resolverRef.current = null;
        }
    }, []);

    const confirm = useCallback((customOptions = {}) => {
        setOptions({ ...DEFAULT_OPTIONS, ...customOptions });
        setIsOpen(true);

        return new Promise((resolve) => {
            resolverRef.current = resolve;
        });
    }, []);

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                closeDialog(false);
            }
        };

        window.addEventListener('keydown', handleEscape);

        return () => {
            window.removeEventListener('keydown', handleEscape);
        };
    }, [closeDialog, isOpen]);

    const contextValue = useMemo(() => confirm, [confirm]);
    const toneClasses = resolveToneClasses(options.tone);

    return (
        <ConfirmContext.Provider value={contextValue}>
            {children}

            {isOpen ? (
                <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/45"
                        onClick={() => closeDialog(false)}
                        aria-hidden="true"
                    />

                    <div
                        role="dialog"
                        aria-modal="true"
                        className="relative w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl"
                    >
                        <h3 className="text-lg font-bold text-gray-900">{options.title}</h3>
                        <p className="mt-2 text-sm text-gray-600">{options.message}</p>

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => closeDialog(false)}
                                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
                            >
                                {options.cancelText}
                            </button>
                            <button
                                type="button"
                                onClick={() => closeDialog(true)}
                                className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${toneClasses}`}
                            >
                                {options.confirmText}
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}
        </ConfirmContext.Provider>
    );
}

export function useConfirm() {
    const confirm = useContext(ConfirmContext);

    if (!confirm) {
        throw new Error('useConfirm must be used within ConfirmProvider');
    }

    return confirm;
}
