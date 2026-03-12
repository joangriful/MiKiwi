import React from 'react';
import { Head, Link } from '@inertiajs/react';
import Header from '@/Components/Common/Header';
import Footer from '@/Components/Common/Footer';

export default function Sitemap() {
    const sitemapLinks = [
        {
            title: "Tienda",
            links: [
                { name: "Juguetes", url: route('products.index') },
                { name: "Muñecas (Configurador)", url: route('configurador.home') },
                { name: "Colecciones", url: route('colecciones') },
            ]
        },
        {
            title: "Descubre Mikiwi",
            links: [
                { name: "Inicio", url: route('home') },
                { name: "Conócete", url: "#" }, // Placeholder for now or link to specific section if available
                { name: "Sobre Nosotros", url: route('sobre.nosotros') },
            ]
        },
        {
            title: "Cuenta",
            links: [
                { name: "Iniciar Sesión", url: route('login') },
                { name: "Registrarse", url: route('register') },
                { name: "Mi Perfil", url: route('profile.edit') },
                { name: "Mis Pedidos", url: route('orders.index') },
            ]
        },
        {
            title: "Legal",
            links: [
                { name: "Política de Privacidad", url: route('politica.privacidad') },
                { name: "Política de Cookies", url: route('politica.cookies') },
                { name: "Aviso Legal", url: route('legal.notice') },
                { name: "Formulario de Reclamaciones", url: route('formulario.reclamaciones') },
            ]
        }
    ];

    return (
        <div className="min-h-screen flex flex-col bg-white text-gray-900 font-sans">
            <Head title="Mapa del sitio - MiKiwi" />

            <Header />

            <main className="flex-grow container mx-auto px-6 py-16">
                <div className="max-w-5xl mx-auto">
                    <h1 className="text-4xl font-bold mb-12 text-gray-900 border-b pb-6">Mapa del sitio</h1>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                        {sitemapLinks.map((section, index) => (
                            <div key={index}>
                                <h2 className="text-lg font-semibold text-gray-900 mb-6">{section.title}</h2>
                                <ul className="space-y-4">
                                    {section.links.map((link, linkIndex) => (
                                        <li key={linkIndex}>
                                            <Link
                                                href={link.url}
                                                className="text-gray-600 hover:text-primary hover:underline transition-colors block"
                                            >
                                                {link.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
