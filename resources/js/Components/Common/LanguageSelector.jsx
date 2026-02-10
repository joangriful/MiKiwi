import React, { useState } from 'react';
import { useLanguage } from '@/Contexts/LanguageContext';

export default function LanguageSelector() {
    const { currentLanguage, changeLanguage, languages } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 text-xs text-gray-400 hover:text-white transition-colors"
            >
                <span className="text-base">{languages[currentLanguage].flag}</span>
                <span>{languages[currentLanguage].code.toUpperCase()}</span>
                <svg
                    className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute bottom-full left-0 mb-2 bg-gray-800 border border-gray-700 rounded-lg shadow-lg overflow-hidden z-50 min-w-[140px]">
                        {Object.values(languages).map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => {
                                    changeLanguage(lang.code);
                                    setIsOpen(false);
                                }}
                                className={`w-full flex items-center gap-3 px-4 py-2 text-xs transition-colors ${currentLanguage === lang.code
                                        ? 'bg-[#99b849] text-white'
                                        : 'text-gray-300 hover:bg-gray-700'
                                    }`}
                            >
                                <span className="text-base">{lang.flag}</span>
                                <span>{lang.name}</span>
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
