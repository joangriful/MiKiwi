import { useEffect } from 'react';
import Lenis from 'lenis';

export default function useLenisScroll() {
    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.4,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
        });

        let rafId = null;

        function raf(time) {
            lenis.raf(time);
            rafId = requestAnimationFrame(raf);
        }

        rafId = requestAnimationFrame(raf);

        return () => {
            if (rafId !== null) {
                cancelAnimationFrame(rafId);
            }

            lenis.destroy();
        };
    }, []);
}
