import { useRef, useEffect } from 'react';

// Wrapper function for pre-loading components
const load3DEngine = () => import('@/Components/Configurator/Mannequin3DViewer/Mannequin3DViewer');

console.log('%c[File] %cuse3DPreload.js CARGADO', "color: #ff00ff; font-weight: bold", "color: #666");

// Helper to preload binary/image assets with full logging and timing
const preloadAsset = (path, type) => {
    const start = performance.now();
    console.log(`%c[Preload Init] %c${path} (38MB+)`, "color: #99b849; font-weight: bold", "color: #666");

    if (type === 'image') {
        const img = new Image();
        img.src = path;
        img.onload = () => {
            const end = performance.now();
            console.log(`%c[Preload Ready] %c${path} (%c${Math.round(end - start)}ms%c)`, "color: #4CAF50; font-weight: bold", "color: #666", "color: #4CAF50", "color: #666");
        };
    } else {
        fetch(path)
            .then(res => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.blob();
            })
            .then(() => {
                const end = performance.now();
                console.log(`%c[Preload Ready] %c${path} (%c${Math.round(end - start)}ms%c)`, "color: #4CAF50; font-weight: bold", "color: #666", "color: #4CAF50", "color: #666");
            })
            .catch(e => console.warn(`%c[Preload Skip] %c${path} - ${e.message}`, "color: #FF9800; font-weight: bold", "color: #666"));
    }
};

export function use3DPreload(views, defaultSettings) {
    const hasStartedPreload = useRef(false);

    const handle2DReady = () => {
        if (hasStartedPreload.current || !views || !defaultSettings) return;
        hasStartedPreload.current = true;

        console.log('%c[System] %cVisor 2D listo. Iniciando descarga de activos pesados (3D)...', "color: #2196F3; font-weight: bold", "color: #666");
        
        // 1. Preload Engine code
        const engineStart = performance.now();
        load3DEngine().then(() => {
            const end = performance.now();
            console.log(`%c[3D Engine] %cCódigo del motor descargado (%c${Math.round(end - engineStart)}ms%c)`, "color: #4CAF50; font-weight: bold", "color: #666", "color: #4CAF50", "color: #666");
        });
        
        // 2. Preload Large Assets (Queen Model)
        preloadAsset('/models/naked-queen/source/NakedQueen.fbx', 'fetch');
        preloadAsset('/models/naked-queen/textures/NakedQueen.jpeg', 'image');
    };

    return { handle2DReady, load3DEngine };
}
