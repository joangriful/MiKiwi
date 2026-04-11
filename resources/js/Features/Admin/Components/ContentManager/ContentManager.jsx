import React, { useState } from 'react';
import HeroImageManager from '../HeroImageManager/HeroImageManager';
import './ContentManager.css';

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
                    <div className="flex flex-col gap-8 pb-10">
                        {/* Home Hero Images */}
                        <HeroImageManager
                            images={heroImages.filter(img => img.type === 'home' || !img.type)}
                            title="Imágenes del Hero (Home)"
                            description="Gestiona las imágenes de fondo del hero principal"
                            uploadType="home"
                        />

                        {/* Sustainability Hero Images */}
                        <HeroImageManager
                            images={heroImages.filter(img => img.type === 'sustainability')}
                            title="Imágenes del Hero (Sostenibilidad)"
                            description="Gestiona las imágenes del hero de la página de sostenibilidad"
                            uploadType="sustainability"
                        />

                        {/* Dolls Section Images */}
                        <HeroImageManager
                            images={heroImages.filter(img => img.type === 'dolls')}
                            title="GIF / Imágenes Sección Muñecas (Home)"
                            description="Gestiona el GIF de fondo que aparece en la sección Sex Dolls de la página principal"
                            uploadType="dolls"
                        />

                        {/* Calibration Section Images */}
                        <HeroImageManager
                            images={heroImages.filter(img => img.type === 'calibration')}
                            title="Fondo Sección Calibración (Home)"
                            description="Gestiona la imagen de fondo para la sección de 'Descubre tu personalidad'"
                            uploadType="calibration"
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
