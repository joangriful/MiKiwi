import { defineConfig } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.jsx',
            refresh: true,
        }),
        react(),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'resources/js'),
        },
    },
    build: {
        chunkSizeWarningLimit: 700,
        rollupOptions: {
            output: {
                manualChunks(id) {
                    const normalizedId = id.replace(/\\/g, '/');

                    if (!normalizedId.includes('/node_modules/')) {
                        return;
                    }

                    if (normalizedId.includes('/react/') || normalizedId.includes('/react-dom/') || normalizedId.includes('@inertiajs')) {
                        return 'react-stack';
                    }

                    if (normalizedId.includes('@react-three/fiber') || normalizedId.includes('@react-three/drei')) {
                        return 'react-three';
                    }

                    if (normalizedId.includes('/three-stdlib/')) {
                        return 'three-stdlib';
                    }

                    if (normalizedId.includes('/three/examples/jsm/loaders/')) {
                        return 'three-loaders';
                    }

                    if (normalizedId.includes('/three/examples/jsm/')) {
                        return 'three-examples';
                    }

                    if (normalizedId.includes('/three/')) {
                        return 'three-core';
                    }

                    if (normalizedId.includes('@stripe')) {
                        return 'stripe-vendor';
                    }

                    if (normalizedId.includes('framer-motion')) {
                        return 'motion-vendor';
                    }

                    if (normalizedId.includes('@headlessui')) {
                        return 'headlessui-vendor';
                    }

                    if (normalizedId.includes('lodash')) {
                        return 'lodash-vendor';
                    }
                },
            },
        },
    },
    server: {
        host: '127.0.0.1',
        port: 5173,
        strictPort: false,
    },
});
