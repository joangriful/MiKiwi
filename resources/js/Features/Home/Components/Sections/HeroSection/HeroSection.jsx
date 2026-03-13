import React, { useRef } from 'react';
import './HeroSection.css';

export default function HeroSection({ heroImages }) {
    const heroRef = useRef(null);

    // Get the first active hero image if available
    const bgImage = heroImages && heroImages.length > 0 ? heroImages[0].url : null;

    return (
        <section
            className="hero-side"
            ref={heroRef}
            style={{
                backgroundImage: bgImage ? `url(${bgImage})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
            }}
        >
            <div className="hero-content" style={{ position: 'relative', zIndex: 100, marginBottom: '20vh' }}>
            </div>

            <img
                src="/assets/icons/mikiwi_logo.svg"
                alt="MiKiwi Logo"
                style={{
                    position: 'absolute',
                    bottom: 0,
                    right: '5%',
                    width: 'clamp(120px, 20vw, 320px)',
                    height: 'auto',
                    zIndex: 100,
                    display: 'block'
                }}
                className="hero-logo-img"
            />
        </section>
    );
}
