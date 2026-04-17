import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import AppLayout from '@/Layouts/AppLayout';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';
const pageModules = import.meta.glob('./Pages/**/*.jsx');

function resolveInertiaPage(name) {
    const normalizedName = name.replace(/\\/g, '/');
    const pageSegments = normalizedName.split('/');
    const pageName = pageSegments[pageSegments.length - 1];
    const nestedPagePath = `./Pages/${normalizedName}/${pageName}.jsx`;
    const flatPagePath = `./Pages/${normalizedName}.jsx`;

    if (pageModules[nestedPagePath]) {
        return pageModules[nestedPagePath]();
    }

    if (pageModules[flatPagePath]) {
        return pageModules[flatPagePath]();
    }

    throw new Error(`Inertia page not found in Pages: ${name}`);
}

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: resolveInertiaPage,
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <AppLayout>
                <App {...props} />
            </AppLayout>
        );
    },
    progress: {
        color: '#99b849',
    },
});
