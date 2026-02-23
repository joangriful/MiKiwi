import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import axios from 'axios';

export default function PremiumAtelierSection() {
    const [isLoading, setIsLoading] = useState(false);

    const handleBuyNow = async () => {
        setIsLoading(true);
        try {
            const { data: responseData } = await axios.post(route("cart.buy-now"), {
                product_slug: 'mobi',
                quantity: 1,
            });
            
            if (responseData.redirect) {
                router.visit(responseData.redirect);
            } else {
                router.visit(route("cart.index", { buy_now: 1 }));
            }
        } catch (error) {
            console.error("Error buying now:", error);
            setIsLoading(false);
            // Fallback redirect if API fails or product not found
            router.visit(route('products.show', 'mobi'));
        }
    };

    return (
        <section className="premium-atelier">
            <div className="atelier-bg-visual"></div>
            <div className="atelier-content">
                <span className="atelier-tag">EXPERIMENTAL DIVISION</span>
                <h2>Zona Premium,<br />Tu Muñeca.</h2>
                <p style={{ fontSize: '1.5rem', color: 'rgba(255,255,255,0.4)', fontWeight: 300 }}>
                    Configuración de modelos de alta fidelidad. Crea tu unidad humana a medida con precisión biotécnica.
                </p>

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
