import React, { useRef } from 'react';

export default function HeroSection() {
    const heroRef = useRef(null);

    return (
        <section className="hero-side" ref={heroRef}>
            <div className="kinetic-bg">MIKIWI</div>
            <div className="kinetic-bg kinetic-bg-2">THE ORIGIN</div>

            <div className="hero-content" style={{ position: 'relative', zIndex: 100 }}>
                <h1>MiKiwi.</h1>
                <p>Trasc endiendo el límite de lo material. Ingeniería sensorial Suiza diseñada para la introspección profunda.</p>
            </div>
            <div className="hero-capsule-float">
                <div className="capsule-core"></div>
            </div>
        </section>
    );
}
