import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import useCartActions from '@/Features/Cart/hooks/useCartActions';
import styles from './PremiumAtelierSection.module.css';

export default function PremiumAtelierSection() {
    const { buyNow, resolveBuyNowUrl } = useCartActions();
    const [isLoading, setIsLoading] = useState(false);

    const handleBuyNow = async () => {
        setIsLoading(true);
        try {
            const responseData = await buyNow({
                productSlug: 'mobi',
                quantity: 1,
            });

            router.visit(resolveBuyNowUrl(responseData));
        } catch (error) {
            console.error("Error buying now:", error);
            setIsLoading(false);
            // Fallback redirect if API fails or product not found
            router.visit(route('products.show', 'mobi'));
        }
    };

    return (
        <section className={`${styles.root} premium-atelier`}>
            <div className="atelier-bg-visual"></div>
            <div className="atelier-content">
                <span className="atelier-tag">EXPERIMENTAL DIVISION</span>
                <h2>Zona Premium,<br />Tu Muñeca.</h2>

                <div className="config-preview-box">
                    <div className="config-item">
                        <span>POLÍMERO</span>
                        <p>OBSIDIAN</p>
                    </div>
                    <div className="config-item">
                        <span>ID SYNC</span>
                        <p>ELITE-01</p>
                    </div>
                    <div className="config-item">
                        <span>FINISH</span>
                        <p>MATTE</p>
                    </div>
                </div>

                <div className="flex gap-4 mt-8">
                    <Link href={route('configurador.index')} className="atelier-btn">Lanzar Configurador</Link>
                    <button
                        onClick={handleBuyNow}
                        disabled={isLoading}
                        className="atelier-btn ivory"
                        style={{ background: 'var(--primary)', border: 'none' }}
                    >
                        {isLoading ? 'PROCESANDO...' : 'COMPRAR MOBI AHORA'}
                    </button>
                </div>
            </div>
        </section>
    );
}
