import { useRef } from 'react';
import { loadMannequin3DViewer } from '@/Components/Configurator/utils/lazyLoaders';

// Helper to preload binary/image assets with silent background fetching
const preloadAsset = (path, type) => {
    if (type === 'image') {
        return new Promise((resolve) => {
            const img = new Image();
            img.src = path;
            img.onload = resolve;
            img.onerror = resolve; // Continue even on error
        });
    } else {
        return fetch(path)
            .then(res => res.ok ? res.blob() : Promise.reject())
            .catch(() => null); // Silent catch
    }
};

export function use3DPreload(views, defaultSettings) {
    const hasStartedPreload = useRef(false);

    const handle2DReady = () => {
        if (hasStartedPreload.current || !views || !defaultSettings) return;
        hasStartedPreload.current = true;

        // User requested Log 1: Starting
        console.warn('%c[System] %cIniciando descarga del modelo Queen para visualización instantánea...', "color: #2196F3; font-weight: bold", "color: #666");
        
        const startTime = performance.now();

        // Track all 3 heavy requirements
        const tasks = [
            loadMannequin3DViewer(), // Engine code
            preloadAsset('/models/naked-queen/source/NakedQueen.fbx', 'fetch'), // Main model
            preloadAsset('/models/naked-queen/textures/NakedQueen.jpeg', 'image'), // Texture
            preloadAsset('https://raw.githack.com/pmndrs/drei-assets/master/hdri/studio_small_08_1k.hdr', 'fetch') // Environment HDR
        ];

        Promise.all(tasks).then(() => {
            const duration = Math.round(performance.now() - startTime);
            // User requested Log 2: Ready
            console.warn(`%c[System] %cModelo Queen listo para visualización instantánea (%c${duration}ms%c)`, "color: #4CAF50; font-weight: bold", "color: #666", "color: #4CAF50", "color: #666");
        });
    };

    return { handle2DReady, load3DEngine: loadMannequin3DViewer };
}
