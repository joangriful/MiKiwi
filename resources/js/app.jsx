import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import AppLayout from '@/Layouts/AppLayout';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => {
        const pages = import.meta.glob('./Features/**/Pages/**/*.jsx');

        if (!name.includes('/')) {
            throw new Error(`Inertia page name must include feature prefix: ${name}`);
        }

        const [feature, ...rest] = name.split('/');
        const featurePath = `./Features/${feature}/Pages/${rest.join('/')}.jsx`;

        if (pages[featurePath]) {
            return pages[featurePath]();
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
