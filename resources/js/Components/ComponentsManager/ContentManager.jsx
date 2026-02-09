import React, { useState } from 'react';
import HeroImageManager from './HeroImageManager';

export default function ContentManager({ heroImages }) {
    const [activeSection, setActiveSection] = useState('hero');

    return (
        <div className="flex h-full bg-gray-50">
            {/* Sidebar */}
            <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
                <div className="p-4 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-gray-800">Contenido</h2>
                    <p className="text-xs text-gray-500">Gestión de contenido del sitio</p>
                </div>

                <div className="p-2 space-y-1">
                    <button
                        onClick={() => setActiveSection('hero')}
                        className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${activeSection === 'hero'
                                ? 'bg-[#99b849]/10 text-[#99b849]'
                                : 'text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        <span className="material-symbols-outlined text-[18px]">image</span>
                        Hero
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto">
                {activeSection === 'hero' && (
                    <HeroImageManager images={heroImages} />
                )}
            </div>
        </div>
    );
}
