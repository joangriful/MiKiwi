import React from 'react';
import { Head } from '@inertiajs/react';
import Header from '@/Components/Common/Header';
import Footer from '@/Components/Common/Footer';
import ClaimsFormComponent from '@/Components/ClaimsForm/ClaimsFormComponent';

export default function ClaimsForm() {
    return (
        <div className="min-h-screen flex flex-col bg-green-50/50 font-sans select-none cursor-default">
            <Head title="Formulario de Reclamaciones - MiKiwi" />

            <Header />

            <main className="flex-1 w-full py-16 px-4 flex items-center justify-center">
                <ClaimsFormComponent />
            </main>

            <Footer />
        </div>
    );
}
