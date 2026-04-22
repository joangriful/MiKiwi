import React from 'react';
import MarketingPageLayout from '@/Components/Marketing/MarketingPageLayout/MarketingPageLayout';
import styles from './PlaceholderMarketingPage.module.css';

export default function PlaceholderMarketingPage({ title }) {
    return (
        <MarketingPageLayout title={title} maxWidth="default" showBreadcrumb={false} showPageHeader={false}>
            <section className={styles.panel}>
                <p className={styles.kicker}>MiKiwi</p>
                <h2 className={styles.heading}>{title}</h2>
                <p className={styles.text}>Contenido en desarrollo.</p>
            </section>
        </MarketingPageLayout>
    );
}
