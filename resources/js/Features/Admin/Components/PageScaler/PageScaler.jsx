import React, { useState, useEffect, useRef } from 'react';
import './PageScaler.css';

// --- Page Scaler Component ---
const PageScaler = ({ children }) => {
    const containerRef = useRef(null);
    const [scale, setScale] = useState(1);
    const BASE_WIDTH = 1280;

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
        <div ref={containerRef} className="w-full h-full overflow-y-auto overflow-x-hidden relative bg-gray-200 no-scrollbar">
            <style>{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>

            <div
                style={{
                    width: `${BASE_WIDTH}px`,
                    zoom: scale,
                    minHeight: '100%',
                }}
                className="bg-white origin-top-left"
            >
                {children}
            </div>
        </div>
    );
};

export default PageScaler;
