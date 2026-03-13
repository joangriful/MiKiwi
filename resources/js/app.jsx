import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import AppLayout from '@/Layouts/AppLayout';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => {
        const pages = import.meta.glob(['./Pages/**/*.jsx', './Features/**/Pages/**/*.jsx']);
        const directMatch = pages[`./Pages/${name}.jsx`];
        if (directMatch) {
            return directMatch();
        }

        if (name.includes('/')) {
            const [feature, ...rest] = name.split('/');
            const featurePath = `./Features/${feature}/Pages/${rest.join('/')}.jsx`;
            if (pages[featurePath]) {
                return pages[featurePath]();
            }
        }

        const featureMatchKey = Object.keys(pages).find((path) => path.endsWith(`/${name}.jsx`));
        if (featureMatchKey) {
            return pages[featureMatchKey]();
        }

        throw new Error(`Inertia page not found: ${name}`);
    },
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
