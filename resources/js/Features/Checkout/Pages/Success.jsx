import React from 'react';
import { Head, Link } from '@inertiajs/react';
import Header from '@/Components/Common/Header';
import Footer from '@/Components/Common/Footer';

export default function Success() {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50 font-sans">
            <Head title="Pedido Completado – MiKiwi" />
            <Header />

            <main className="flex-1 flex items-center justify-center px-4 py-20">
                <div className="max-w-xl w-full text-center">
                    {/* Success icon */}
                    <div className="flex items-center justify-center mb-8">
                        <div className="w-24 h-24 rounded-full bg-[#99b849]/10 flex items-center justify-center">
                            <svg className="w-12 h-12 text-[#99b849]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                    </div>

                    <h1 className="text-4xl font-black text-gray-900 mb-4">¡Pedido realizado!</h1>
                    <p className="text-gray-500 text-lg mb-10 leading-relaxed">
                        Tu pedido ha sido procesado correctamente. Recibirás un correo de confirmación en breve.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href={route('perfil.view')}
                            className="px-8 py-4 bg-[#99b849] text-white font-black rounded-2xl hover:bg-[#7a943a] transition-all shadow-lg shadow-[#99b849]/20 hover:-translate-y-0.5"
                        >
                            Ver mis pedidos
                        </Link>
                        <Link
                            href={route('products.index')}
                            className="px-8 py-4 bg-gray-100 text-gray-700 font-black rounded-2xl hover:bg-gray-200 transition-all hover:-translate-y-0.5"
                        >
                            Seguir comprando
                        </Link>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
