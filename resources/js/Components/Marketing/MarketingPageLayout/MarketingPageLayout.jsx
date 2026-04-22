import React from 'react';
import { Head, Link } from '@inertiajs/react';
import Header from '@/Components/Header/Header';
import Footer from '@/Components/Footer/Footer';
import styles from './MarketingPageLayout.module.css';

const widthClassBySize = {
    narrow: styles.mainNarrow,
    default: styles.mainDefault,
    wide: styles.mainWide,
};

export default function MarketingPageLayout({
    title,
    headTitle,
    updatedAt,
    children,
    maxWidth = 'default',
    showBreadcrumb = true,
    showPageHeader = true,
    className = '',
}) {
    const widthClass = widthClassBySize[maxWidth] ?? widthClassBySize.default;

    return (
        <div className={styles.page}>
            <Head title={headTitle ?? `${title} - MiKiwi`} />
            <Header />

            <main className={`${styles.main} ${widthClass} ${className}`}>
                {showBreadcrumb && (
                    <nav className={styles.breadcrumb} aria-label="Migas de pan">
                        <Link href={route('home')} className={styles.breadcrumbLink}>Inicio</Link>
                        <span aria-hidden="true">/</span>
                        <span className={styles.breadcrumbCurrent}>{title}</span>
                    </nav>
                )}

                {showPageHeader && (
                    <header className={styles.header}>
                        <h1 className={styles.title}>{title}</h1>
                        {updatedAt && <p className={styles.meta}>Última actualización: {updatedAt}</p>}
                    </header>
                )}

                {children}
            </main>

            <Footer />
        </div>
    );
}
