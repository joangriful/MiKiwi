import React from 'react';
import ConfiguratorLayout from '@/Layouts/ConfiguratorLayout';

export default function LoadingScreen() {
    return (
        <ConfiguratorLayout>
            <div className="flex flex-col items-center justify-center min-h-[60vh] bg-white">
                <div className="w-16 h-16 border-4 border-[var(--primary)]/20 border-t-[var(--primary)] rounded-full animate-spin mb-6"></div>
                <h2 className="text-2xl font-bold text-gray-800 font-outfit mb-2">Cargando Configurador</h2>
                <p className="text-gray-500 font-medium">Estamos preparando tu experiencia personalizada...</p>
            </div>
        </ConfiguratorLayout>
    );
}
