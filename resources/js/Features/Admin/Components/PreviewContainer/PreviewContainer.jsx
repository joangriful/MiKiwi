import React, { Suspense } from 'react';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import PageScaler from '../PageScaler/PageScaler';
import './PreviewContainer.css';

// --- Preview Container ---
const PreviewContainer = ({ children, title }) => {
    const guessUrl = () => {
        const lower = title.toLowerCase().replace(/\s+/g, '').trim();
        console.log('[PreviewContainer] URL Guess:', title, '->', lower);
        // Route Mappings based on web.php
        const routes = {
            'product': '/producto/kiwi-gold-premium',
            'productpage': '/producto/kiwi-gold-premium', // Explicit match for ProductPage.jsx
            'welcome': '/',
            'perfil': '/perfil',
            'colecciones': '/colecciones',
            'componentsmanager': '/components-manager',
            'configurador/home': '/configurador',
            'configurador/index': '/configurador/index',
            'configurador/collections': '/configurador/collections',
            'configurador/quiz': '/configurador/quiz',
            'dollconfigurator': '/configurador/munecas',
            'claimsform': '/formulario-reclamaciones',
            'privacypolicy': '/politica-privacidad',
            'dollconfigtest': '/doll_config_test',
            'auth/auth': '/login'
        };

        if (routes[lower]) {
            console.log('[PreviewContainer] Matched:', routes[lower]);
            return routes[lower];
        }

        // Default fallback
        console.log('[PreviewContainer] Fallback:', '/' + lower);
        return '/' + lower;
    };

    const url = guessUrl();

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full relative transition-shadow hover:shadow-md">
            <div className="p-3 border-b border-gray-100 flex justify-between items-center bg-gray-50 z-10 shrink-0">
                <span className="text-xs font-medium text-gray-600 truncate" title={title}>{title}</span>
                <div className="flex items-center gap-2">
                    <span className="text-[10px] text-gray-300 font-mono">{url}</span>
                    <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 text-gray-400 hover:text-[#99b849] transition-colors rounded hover:bg-gray-100"
                        title={`Open in new tab: ${url}`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                        </svg>
                    </a>
                </div>
            </div>

            {/* Aspect Ratio 16:9 for the Window */}
            <div className="relative w-full aspect-video group bg-gray-200">
                <div className="absolute inset-0">
                    <ErrorBoundary>
                        <Suspense fallback={
                            <div className="w-full h-full flex items-center justify-center bg-gray-50">
                                <span className="text-xs text-gray-400">Loading...</span>
                            </div>
                        }>
                            <PageScaler>
                                {children}
                            </PageScaler>
                        </Suspense>
                    </ErrorBoundary>
                </div>
            </div>
        </div>
    );
};

export default PreviewContainer;
