import React from 'react';
import { Link } from '@inertiajs/react';
import MarketingPageLayout from '@/Components/Marketing/MarketingPageLayout/MarketingPageLayout';
import styles from './Sitemap.module.css';

const sitemapSections = [
    {
        title: 'Tienda',
        links: [
            { name: 'Juguetes', routeName: 'products.index' },
            { name: 'Muñecas (Configurador)', routeName: 'configurador.home' },
            { name: 'Colecciones', routeName: 'colecciones' },
        ],
    },
    {
        title: 'Descubre Mikiwi',
        links: [
            { name: 'Inicio', routeName: 'home' },
            { name: 'Conócete', href: '#' },
            { name: 'Sobre Nosotros', routeName: 'about-us' },
        ],
    },
    {
        title: 'Cuenta',
        links: [
            { name: 'Iniciar Sesión', routeName: 'login' },
            { name: 'Registrarse', routeName: 'register' },
            { name: 'Mi Perfil', routeName: 'profile.edit' },
            { name: 'Mis Pedidos', routeName: 'orders.index' },
        ],
    },
    {
        title: 'Legal',
        links: [
            { name: 'Política de Privacidad', routeName: 'privacy.policy' },
            { name: 'Política de Cookies', routeName: 'cookie.policy' },
            { name: 'Aviso Legal', routeName: 'legal.notice' },
            { name: 'Formulario de Reclamaciones', routeName: 'claims.form' },
        ],
    },
];

const getHref = (link) => link.href ?? route(link.routeName);

export default function Sitemap() {
    return (
        <MarketingPageLayout title="Mapa del sitio" maxWidth="wide" showBreadcrumb={false}>
            <div className={styles.grid}>
                {sitemapSections.map((section) => (
                    <section className={styles.section} key={section.title}>
                        <h2>{section.title}</h2>
                        <ul>
                            {section.links.map((link) => (
                                <li key={link.name}>
                                    <Link href={getHref(link)}>{link.name}</Link>
                                </li>
                            ))}
                        </ul>
                    </section>
                ))}
            </div>
        </MarketingPageLayout>
    );
}
