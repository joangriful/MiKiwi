import React from 'react';
import { Head } from '@inertiajs/react';
import Header from '@/Components/Header/Header';
import Footer from '@/Components/Footer/Footer';

const content = {
    title: 'Sobre Nosotros',
    whoWeAre: {
        title: 'Quiénes Somos',
        text1: 'MiKiwi es una plataforma innovadora de e-commerce especializada en bienestar sexual personalizado. Nacimos con la visión de transformar la industria ofreciendo productos totalmente personalizables bajo demanda, eliminando las limitaciones de los catálogos genéricos tradicionales.',
        text2: 'Como startup tecnológica, combinamos innovación, diseño y un profundo compromiso ético para crear experiencias únicas que se adaptan perfectamente a las necesidades individuales de cada persona.',
    },
    mission: {
        title: 'Nuestra Misión',
        text: 'Democratizar la plenitud sexual ofreciendo a cada individuo la posibilidad de co-crear herramientas de placer únicas, personalizadas bajo demanda, con un compromiso inquebrantable de inclusión, seguridad y discreción.',
    },
    vision: {
        title: 'Nuestra Visión',
        text: 'Ser el referente global del bienestar sexual personalizado, eliminando la estandarización y normalizando la autoexploración como un componente esencial de la salud integral. Aspiramos a ser la plataforma que transforme el tabú en tecnología, y la incertidumbre en confianza.',
    },
    values: {
        title: 'Nuestros Valores',
        inclusion: {
            title: 'Inclusión',
            text: 'Garantizamos que la búsqueda de placer sea accesible y respetuosa para todos los cuerpos y todas las identidades, incluyendo a la comunidad LGTBQ+.',
        },
        trust: {
            title: 'Confianza y Ética',
            text: 'Mantenemos un compromiso absoluto con la discreción del cliente y la seguridad del producto, utilizando únicamente materiales certificados.',
        },
        wellness: {
            title: 'Plenitud y Bienestar',
            text: 'Promovemos la sexualidad como un pilar fundamental de la salud integral y fomentamos la autoexploración positiva.',
        },
        innovation: {
            title: 'Innovación Tecnológica',
            text: 'Utilizamos soluciones de vanguardia, como la co-creación on-demand, para resolver problemas reales del consumidor.',
        },
    },
    valueProposition: {
        title: 'Nuestra Propuesta de Valor',
        intro: 'MiKiwi resuelve la principal fricción del consumidor en el sector: la incertidumbre. A través de nuestro innovador configurador on-demand, eliminamos las dudas sobre el ajuste, material y funcionalidad del producto.',
        features: {
            customization: {
                title: 'Personalización Total:',
                text: 'Diseña tu producto según tus necesidades anatómicas, funcionales y estéticas.',
            },
            quality: {
                title: 'Calidad Premium:',
                text: 'Materiales certificados y procesos de fabricación de alto valor.',
            },
            discretion: {
                title: 'Discreción Absoluta:',
                text: 'Envío y facturación completamente confidenciales.',
            },
            experience: {
                title: 'Experiencia Única:',
                text: 'Tecnología avanzada para una experiencia de compra fluida y segura.',
            },
        },
    },
    contact: {
        title: '¿Tienes alguna pregunta?',
        text: 'Estamos aquí para ayudarte. No dudes en contactarnos.',
    },
    footer: {
        tagline: 'MiKiwi - Innovación, Inclusión y Bienestar',
        address: 'Pago Valdeconejos, s/n, 11550 Chipiona, Cádiz',
    },
};

export default function AboutUs() {
    const whoWeAreText1 = content.whoWeAre.text1;

    return (
        <div className="min-h-screen flex flex-col bg-white font-sans select-none cursor-default text-gray-800">
            <Head title={`${content.title} - MiKiwi`} />

            <Header />

            <main className="flex-1 w-full max-w-5xl mx-auto py-12 md:py-16 px-6 md:px-12">
                <h1 className="text-2xl md:text-4xl font-bold mb-8 text-gray-900 border-b border-gray-100 pb-6 leading-tight">{content.title}</h1>

                <div className="space-y-12">
                    {/* Quiénes Somos */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">{content.whoWeAre.title}</h2>
                        <p className="text-base text-gray-600 leading-relaxed mb-4">
                            <span className="text-[#99b849] font-semibold">MiKiwi</span> {whoWeAreText1.replace('MiKiwi ', '')}
                        </p>
                        <p className="text-base text-gray-600 leading-relaxed">
                            {content.whoWeAre.text2}
                        </p>
                    </section>

                    {/* Misión */}
                    <section className="bg-gray-50 border border-gray-100 rounded-lg p-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">{content.mission.title}</h2>
                        <p className="text-base text-gray-700 leading-relaxed italic">
                            "{content.mission.text}"
                        </p>
                    </section>

                    {/* Visión */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">{content.vision.title}</h2>
                        <p className="text-base text-gray-600 leading-relaxed">
                            {content.vision.text}
                        </p>
                    </section>

                    {/* Valores */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">{content.values.title}</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                                <h3 className="text-lg font-semibold text-[#99b849] mb-3">{content.values.inclusion.title}</h3>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    {content.values.inclusion.text}
                                </p>
                            </div>

                            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                                <h3 className="text-lg font-semibold text-[#99b849] mb-3">{content.values.trust.title}</h3>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    {content.values.trust.text}
                                </p>
                            </div>

                            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                                <h3 className="text-lg font-semibold text-[#99b849] mb-3">{content.values.wellness.title}</h3>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    {content.values.wellness.text}
                                </p>
                            </div>

                            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                                <h3 className="text-lg font-semibold text-[#99b849] mb-3">{content.values.innovation.title}</h3>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    {content.values.innovation.text}
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Propuesta de Valor */}
                    <section className="bg-gradient-to-r from-gray-50 to-white border border-gray-100 rounded-lg p-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">{content.valueProposition.title}</h2>
                        <p className="text-base text-gray-600 leading-relaxed mb-4">
                            {content.valueProposition.intro}
                        </p>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li className="flex items-start">
                                <span className="text-[#99b849] font-bold mr-2">✓</span>
                                <span><span className="font-semibold">{content.valueProposition.features.customization.title}</span> {content.valueProposition.features.customization.text}</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-[#99b849] font-bold mr-2">✓</span>
                                <span><span className="font-semibold">{content.valueProposition.features.quality.title}</span> {content.valueProposition.features.quality.text}</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-[#99b849] font-bold mr-2">✓</span>
                                <span><span className="font-semibold">{content.valueProposition.features.discretion.title}</span> {content.valueProposition.features.discretion.text}</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-[#99b849] font-bold mr-2">✓</span>
                                <span><span className="font-semibold">{content.valueProposition.features.experience.title}</span> {content.valueProposition.features.experience.text}</span>
                            </li>
                        </ul>
                    </section>

                    {/* Contacto */}
                    <section className="text-center pt-8 border-t border-gray-100">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">{content.contact.title}</h2>
                        <p className="text-base text-gray-600 mb-4">
                            {content.contact.text}
                        </p>
                        <a
                            href="mailto:mikiwi.toys@gmail.com"
                            onClick={(e) => {
                                e.preventDefault();
                                window.location.href = 'mailto:mikiwi.toys@gmail.com';
                            }}
                            className="inline-block bg-[#99b849] text-white px-8 py-3 rounded-lg font-medium hover:opacity-90 transition-all cursor-pointer"
                        >
                            mikiwi.toys@gmail.com
                        </a>
                    </section>

                    <section className="text-xs text-gray-500 text-center pt-6 border-t border-gray-100">
                        <p>{content.footer.tagline}</p>
                        <p className="mt-2">{content.footer.address}</p>
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
}
