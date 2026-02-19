import React from 'react';
import Header from '@/Components/Common/Header';
import Footer from '@/Components/Common/Footer';
import { Head } from '@inertiajs/react';

export default function Contact() {
    return (
        <div className="min-h-screen bg-black text-white">
            <Head title="Contacto - MiKiwi" />
            <Header />
            <main className="container mx-auto px-6 py-20">
                <h1 className="text-4xl font-bold mb-8">Contacto</h1>
                <p className="text-gray-400">Contenido en desarrollo...</p>
            </main>
            <Footer />
        </div>
    );
}
