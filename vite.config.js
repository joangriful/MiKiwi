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
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (!id.includes('node_modules')) {
                        return;
                    }

                    if (id.includes('/react/') || id.includes('/react-dom/') || id.includes('@inertiajs')) {
                        return 'react-stack';
                    }

                    if (id.includes('\\three\\') || id.includes('/three/')) {
                        return 'three-core';
                    }

                    if (id.includes('@react-three/fiber') || id.includes('@react-three/drei')) {
                        return 'react-three';
                    }

                    if (id.includes('@stripe')) {
                        return 'stripe-vendor';
                    }

                    if (id.includes('framer-motion')) {
                        return 'motion-vendor';
                    }

                    if (id.includes('@headlessui')) {
                        return 'headlessui-vendor';
                    }

                    if (id.includes('lodash')) {
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
