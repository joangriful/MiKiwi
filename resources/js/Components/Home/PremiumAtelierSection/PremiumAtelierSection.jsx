import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import axios from 'axios';
import styles from './PremiumAtelierSection.module.css';

export default function PremiumAtelierSection() {
    const [isLoading, setIsLoading] = useState(false);

    const handleBuyNow = async () => {
        setIsLoading(true);

        try {
            const { data: responseData } = await axios.post(route('cart.buy-now'), {
                product_slug: 'mobi',
                quantity: 1,
            });

            if (responseData.redirect) {
                router.visit(responseData.redirect);
                return;
            }

            router.visit(route('cart.index', { buy_now: 1 }));
        } catch (error) {
            console.error('Error buying now:', error);
            setIsLoading(false);
            router.visit(route('products.show', 'mobi'));
        }
    };

    return (
        <section className={styles.root}>
            <div className={styles.backgroundVisual}></div>

            <div className={styles.content}>
                <span className={styles.tag}>EXPERIMENTAL DIVISION</span>
                <h2 className={styles.title}>Zona Premium,<br />Tu Muñeca.</h2>

                <div className={styles.previewBox}>
                    <div className={styles.previewItem}>
                        <span>POLÍMERO</span>
                        <p>OBSIDIAN</p>
                    </div>
                    <div className={styles.previewItem}>
                        <span>ID SYNC</span>
                        <p>ELITE-01</p>
                    </div>
                    <div className={styles.previewItem}>
                        <span>FINISH</span>
                        <p>MATTE</p>
                    </div>
                </div>

                <div className={styles.actions}>
                    <Link href={route('configurador.index')} className={styles.button}>Lanzar Configurador</Link>
                    <button
                        onClick={handleBuyNow}
                        disabled={isLoading}
                        className={`${styles.button} ${styles.buttonAccent}`}
                    >
                        {isLoading ? 'PROCESANDO...' : 'COMPRAR MOBI AHORA'}
                    </button>
                </div>
            </div>
        </section>
    );
}
