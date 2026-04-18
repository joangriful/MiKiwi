import React, { useState, useEffect, useRef } from 'react';
import styles from './PageScaler.module.css';

const BASE_WIDTH = 1280;

export default function PageScaler({ children }) {
    const containerRef = useRef(null);
    const [scale, setScale] = useState(1);

    useEffect(() => {
        if (!containerRef.current) return;

        const updateScale = () => {
            if (!containerRef.current) return;
            const w = containerRef.current.getBoundingClientRect().width;
            if (w > 0) {
                setScale((w / BASE_WIDTH));
            }
        };

        const observer = new ResizeObserver(updateScale);
        observer.observe(containerRef.current);
        updateScale();
        return () => observer.disconnect();
    }, []);

    return (
        <div ref={containerRef} className={styles.container}>
            <div
                style={{
                    width: `${BASE_WIDTH}px`,
                    zoom: scale,
                    minHeight: '100%',
                }}
                className={styles.scaledContent}
            >
                {children}
            </div>
        </div>
    );
}
