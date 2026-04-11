import React from 'react';
import { Head, Link } from '@inertiajs/react';
import Header from '@/Components/Common/Header/Header';
import Footer from '@/Components/Common/Footer/Footer';
import ClaimsFormComponent from '@/Features/Claims/Components/ClaimsFormComponent/ClaimsFormComponent';

export default function ClaimsForm() {
    return (
        <div className="min-h-screen flex flex-col bg-white font-sans">
            <Head title="Formulario de Reclamaciones - MiKiwi" />
            <Header />

            <main className="flex-grow container mx-auto px-6 py-16 max-w-4xl">
                {/* Breadcrumb */}
                <nav className="text-xs text-gray-400 mb-8 flex items-center gap-2">
                    <Link href={route('home')} className="hover:text-secondary-dark transition-colors">Inicio</Link>
                    <span>/</span>
                    <span className="text-gray-700">Formulario de Reclamaciones</span>
                </nav>

                <h1 className="text-3xl font-bold mb-2 font-head uppercase tracking-tight text-secondary-dark">
                    Formulario de Reclamaciones
                </h1>
                <p className="text-xs text-gray-400 mb-10">
                    En MiKiwi nos preocupamos por tu satisfacción. Si tienes alguna incidencia, estamos aquí para ayudarte.
                </p>

                <ClaimsFormComponent />
            </main>

            <Footer />
        </div>
    );
}

