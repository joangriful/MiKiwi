import React, { Suspense } from 'react';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import PageScaler from '../PageScaler/PageScaler';
import styles from './PreviewContainer.module.css';

const PREVIEW_ROUTES = {
    product: '/producto/kiwi-gold-premium',
    productpage: '/producto/kiwi-gold-premium',
    welcome: '/',
    'profile/profile': '/perfil',
    'marketing/collections': '/colecciones',
    'admin/componentsmanager': '/components-manager',
    'configurator/index': '/configurador/index',
    'configurator/collections': '/configurador/collections',
    'configurator/quiz': '/configurador/quiz',
    dollconfigurator: '/configurador/munecas',
    'configurator/dollconfigurator': '/configurador/munecas',
    claimsform: '/formulario-reclamaciones',
    'claims/claimsform': '/formulario-reclamaciones',
    privacypolicy: '/politica-privacidad',
    'marketing/privacypolicy': '/politica-privacidad',
    dollconfigtest: '/doll_config_test',
    'configurator/dollconfigtest': '/doll_config_test',
    'marketing/ourkiwis': '/nuestros-kiwis',
    'auth/auth': '/login',
};

function guessPreviewUrl(title) {
    const normalizedTitle = title.toLowerCase().replace(/\s+/g, '').trim();

    return PREVIEW_ROUTES[normalizedTitle] || `/${normalizedTitle}`;
}

function LoadingFallback() {
    return (
        <div className={styles.loadingFallback}>
            <span className={styles.loadingText}>Loading...</span>
        </div>
    );
}

export default function PreviewContainer({ children, title }) {
    const url = guessPreviewUrl(title);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <span className={styles.title} title={title}>{title}</span>
                <div className={styles.headerActions}>
                    <span className={styles.url}>{url}</span>
                    <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.linkButton}
                        title={`Open in new tab: ${url}`}
                        aria-label={`Open ${title} in new tab`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={styles.linkIcon}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                        </svg>
                    </a>
                </div>
            </div>

            <div className={styles.previewArea}>
                <div className={styles.previewContent}>
                    <ErrorBoundary>
                        <Suspense fallback={<LoadingFallback />}>
                            <PageScaler>
                                {children}
                            </PageScaler>
                        </Suspense>
                    </ErrorBoundary>
                </div>
            </div>
        </div>
    );
}
