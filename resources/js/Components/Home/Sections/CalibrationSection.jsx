import React from 'react';
import { Link } from '@inertiajs/react';

export default function CalibrationSection() {
    return (
        <section className="calibration-section">
            <div className="calib-title">
                <span style={{ fontWeight: 900, letterSpacing: '10px', color: 'var(--kiwi)', textTransform: 'uppercase', fontSize: '0.7rem', display: 'block', marginBottom: '20px' }}>
                    SISTEMA DE IDENTIDAD v6
                </span>
                <h2>Descubre tu<br />Personalidad.</h2>
                <p style={{ marginTop: '20px', color: 'var(--text-muted)' }}>
                    Calibra tu estado mental para encontrar el perfil sensorial que se alinea con tu arquitectura interna.
                </p>
            </div>
            <div className="quiz-container">
                <p style={{ fontWeight: 900, letterSpacing: '5px', fontSize: '0.7rem', color: 'var(--color-primary)' }}>
                    CUESTIONARIO DE DIAGNÓSTICO
                </p>
                <h3 style={{ margin: '20px 0', fontSize: '2rem', fontFamily: 'var(--font-head)' }}>
                    ¿Cómo defines tu espacio de silencio?
                </h3>
                <p style={{ marginBottom: '40px', color: 'var(--text-muted)', opacity: 0.7 }}>
                    Analizaremos tu respuesta somática para recomendarte el núcleo de resonancia perfecto.
                </p>
                <Link href="#" className="btn-v6">Iniciar Calibración</Link>
            </div>
        </section>
    );
}
