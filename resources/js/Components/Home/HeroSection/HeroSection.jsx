import React, { useRef } from 'react';
import styles from './HeroSection.module.css';

export default function HeroSection({ heroImages }) {
    const heroRef = useRef(null);
    const backgroundImage = heroImages && heroImages.length > 0 ? heroImages[0].url : null;

    return (
        <section
            className={styles.root}
            ref={heroRef}
            style={{
                backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            }}
        >
            <div className={styles.content}></div>

            <img
                src="/assets/icons/mikiwi_logo.svg"
                alt="MiKiwi Logo"
                className={styles.logo}
            />
        </section>
    );
}
