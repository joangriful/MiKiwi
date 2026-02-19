import { lazy, Suspense } from 'react';
import '../css/app.css';
import '../css/typography.css';
import '../css/colores.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { LanguageProvider } from './Contexts/LanguageContext';

const GlobalToastContainer = lazy(() => import('@/Components/Common/GlobalToastContainer'));

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob([
                './Pages/**/*.jsx',
                '!./Pages/**/Partials/**/*.jsx',
            ]),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);
        const hasAuthenticatedUser = Boolean(props.initialPage?.props?.auth?.user);

        root.render(
            <LanguageProvider>
                <App {...props} />
                {hasAuthenticatedUser ? (
                    <Suspense fallback={null}>
                        <GlobalToastContainer />
                    </Suspense>
                ) : null}
            </LanguageProvider>
        );
    },
    progress: {
        color: '#4B5563',
    },
});
