import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const languages = {
    es: { code: 'es', name: 'Español', flag: '🇪🇸' },
    en: { code: 'en', name: 'English', flag: '🇬🇧' },
    fr: { code: 'fr', name: 'Français', flag: '🇫🇷' },
    de: { code: 'de', name: 'Deutsch', flag: '🇩🇪' }
};

export function LanguageProvider({ children }) {
    const [currentLanguage, setCurrentLanguage] = useState('es');

    useEffect(() => {
        // Load saved language from localStorage
        const savedLanguage = localStorage.getItem('language') || 'es';
        setCurrentLanguage(savedLanguage);
    }, []);

    const changeLanguage = (langCode) => {
        setCurrentLanguage(langCode);
        localStorage.setItem('language', langCode);
    };

    return (
        <LanguageContext.Provider value={{ currentLanguage, changeLanguage, languages }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
