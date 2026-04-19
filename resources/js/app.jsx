import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import AppProviders from '@/AppProviders';
import PublicLayout from '@/Layouts/PublicLayout';
import AuthLayout from '@/Layouts/AuthLayout';
import AdminLayout from '@/Layouts/AdminLayout';
import BareLayout from '@/Layouts/BareLayout';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';
const pageModules = import.meta.glob('./Pages/**/*.jsx');
const authPages = new Set([
    'Auth/Auth',
]);

const adminPages = new Set([
    'Admin/ComponentsManager',
]);

const barePages = new Set([
    'Profile/Dashboard',
    'Profile/Edit',
]);

function resolvePageLayout(name) {
    if (authPages.has(name)) {
        return AuthLayout;
    }

    if (adminPages.has(name)) {
        return AdminLayout;
    }

    if (barePages.has(name)) {
        return BareLayout;
    }

    return PublicLayout;
}

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
    resolve: async (name) => {
        const page = await resolveInertiaPage(name);

        if (!page.default.layout) {
            page.default.layout = (pageNode) => {
                const Layout = resolvePageLayout(name);

                return <Layout>{pageNode}</Layout>;
            };
        }

        return page;
    },
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(
            <AppProviders>
                <App {...props} />
            </AppProviders>,
        );
    },
    progress: {
        color: '#99b849',
    },
});
