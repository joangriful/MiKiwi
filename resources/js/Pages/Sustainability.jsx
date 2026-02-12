import React from 'react';
import { Head } from '@inertiajs/react';
import Header from '@/Components/Common/Header';
import Footer from '@/Components/Common/Footer';

export default function Sustainability({ heroImages = [] }) {
    return (
        <div className="min-h-screen flex flex-col bg-white font-sans text-gray-800">
            <Head title="Sostenibilidad - MiKiwi" />
            <Header />

            <main className="flex-grow">
                {/* Hero Section */}
                <div className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden bg-gray-900">
                    {/* Background Image */}
                    {heroImages.length > 0 ? (
                        <div className="absolute inset-0 z-0">
                            <img
                                src={heroImages[0].url}
                                alt="Sustainability Hero"
                                className="w-full h-full object-cover opacity-60"
                            />
                            <div className="absolute inset-0 bg-black/40"></div>
                        </div>
                    ) : (
                        // Fallback/Default Background
                        <div className="absolute inset-0 z-0 bg-green-900/20">
                            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                                <div className="absolute top-10 right-10 w-64 h-64 bg-green-200 rounded-full blur-3xl"></div>
                                <div className="absolute bottom-10 left-10 w-48 h-48 bg-yellow-100 rounded-full blur-3xl"></div>
                            </div>
                        </div>
                    )}

                    <div className="container mx-auto max-w-4xl relative z-10 text-center text-white px-6">
                        <span className="font-bold tracking-wider uppercase text-sm mb-4 block text-green-400">Nuestro Compromiso</span>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight drop-shadow-lg">
                            Jugando por un <span className="text-green-400">futuro mejor</span>
                        </h1>
                        <p className="text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed text-gray-100 drop-shadow-md">
                            En Mikiwi, creemos que la diversión no debe costar el planeta. Diseñamos juguetes responsables,
                            seguros y duraderos, pensando en las generaciones venideras.
                        </p>
                    </div>
                </div>

                {/* Main Content */}
                <div className="container mx-auto px-6 py-16 max-w-6xl">
                    <div className="grid md:grid-cols-3 gap-12">
                        {/* Materiales Seguros */}
                        <div className="text-center p-6 rounded-2xl bg-white hover:shadow-xl transition-shadow border border-gray-100">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Materiales Seguros</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Utilizamos silicona hipoalergénica, algodón orgánico y maderas certificadas.
                                Nuestra impresión 3D utiliza <strong>PLA biodegradable</strong>, un plástico de origen vegetal
                                y libre de tóxicos.
                            </p>
                        </div>

                        {/* Producción Local */}
                        <div className="text-center p-6 rounded-2xl bg-white hover:shadow-xl transition-shadow border border-gray-100">
                            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Producción Local</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Fabricado con orgullo en <strong>Chipiona, Cádiz</strong>. Apostamos por el talento local,
                                reduciendo nuestra huella de carbono al minimizar el transporte y apoyando la economía de nuestra región.
                            </p>
                        </div>

                        {/* Packaging Eco */}
                        <div className="text-center p-6 rounded-2xl bg-white hover:shadow-xl transition-shadow border border-gray-100">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Packaging Sin Plásticos</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Nuestros envíos son 100% libres de plásticos. Utilizamos cajas de cartón reciclable
                                y tintas respetuosas con el medio ambiente. Menos residuos, más amor por la naturaleza.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Philosophy Section */}
                <div className="bg-gray-50 py-16 px-6">
                    <div className="container mx-auto max-w-4xl flex flex-col md:flex-row items-center gap-12">
                        <div className="md:w-1/2">
                            <div className="aspect-square rounded-2xl bg-gray-200 overflow-hidden relative shadow-lg">
                                {/* Placeholder for an image, using a nice gradient for now */}
                                <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-blue-500 opacity-80"></div>
                                <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-2xl opacity-20 transform -rotate-12">
                                    SLOW TOYS
                                </div>
                            </div>
                        </div>
                        <div className="md:w-1/2">
                            <span className="text-blue-600 font-bold tracking-wider uppercase text-sm mb-2 block">Nuestra Filosofía</span>
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">Menos es más: La filosofía &quot;Slow&quot;</h2>
                            <p className="text-gray-600 mb-6 leading-relaxed">
                                En un mundo de consumo rápido, en Mikiwi apostamos por la durabilidad. Nuestros juguetes
                                están diseñados para durar, para ser reparados y para pasar de generación en generación.
                                Fomentamos una economía circular donde nada se desperdicia.
                            </p>
                            <ul className="space-y-3">
                                <li className="flex items-center gap-3 text-gray-700">
                                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                    Diseño atemporal y duradero
                                </li>
                                <li className="flex items-center gap-3 text-gray-700">
                                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                    Fomento del juego consciente
                                </li>
                                <li className="flex items-center gap-3 text-gray-700">
                                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                    Respeto por los tiempos de la infancia
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
