import React from 'react';
import { Link } from '@inertiajs/react';

export default function PremiumAtelierSection() {
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

                <Link href="#" className="atelier-btn">Lanzar Configurador</Link>
            </div>
        </section>
    );
}
