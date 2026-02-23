import React from 'react';
import { Head } from '@inertiajs/react';
import Header from '@/Components/Common/Header';
import Footer from '@/Components/Common/Footer';
import { useLanguage } from '@/Contexts/LanguageContext';
import esTranslations from '@/translations/es.json';
import enTranslations from '@/translations/en.json';
import frTranslations from '@/translations/fr.json';
import deTranslations from '@/translations/de.json';

const translations = {
    es: esTranslations,
    en: enTranslations,
    fr: frTranslations,
    de: deTranslations
};

export default function AboutUs() {
    const { currentLanguage } = useLanguage();
    const t = translations[currentLanguage].aboutUs;

    return (
        <div className="min-h-screen flex flex-col bg-white font-sans select-none cursor-default text-gray-800">
            <Head title={`${t.title} - MiKiwi`} />

            <Header />

            <main className="flex-1 w-full max-w-5xl mx-auto py-12 md:py-16 px-6 md:px-12">
                <h1 className="text-2xl md:text-4xl font-bold mb-8 text-gray-900 border-b border-gray-100 pb-6 leading-tight">{t.title}</h1>

                <div className="space-y-12">
                    {/* Quiénes Somos */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">{t.whoWeAre.title}</h2>
                        <p className="text-base text-gray-600 leading-relaxed mb-4">
                            <span className="text-[#99b849] font-semibold">MiKiwi</span> {t.whoWeAre.text1.replace('MiKiwi ', '')}
                        </p>
                        <p className="text-base text-gray-600 leading-relaxed">
                            {t.whoWeAre.text2}
                        </p>
                    </section>

                    {/* Misión */}
                    <section className="bg-gray-50 border border-gray-100 rounded-lg p-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">{t.mission.title}</h2>
                        <p className="text-base text-gray-700 leading-relaxed italic">
                            "{t.mission.text}"
                        </p>
                    </section>

                    {/* Visión */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">{t.vision.title}</h2>
                        <p className="text-base text-gray-600 leading-relaxed">
                            {t.vision.text}
                        </p>
                    </section>

                    {/* Valores */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">{t.values.title}</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                                <h3 className="text-lg font-semibold text-[#99b849] mb-3">{t.values.inclusion.title}</h3>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    {t.values.inclusion.text}
                                </p>
                            </div>

                            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                                <h3 className="text-lg font-semibold text-[#99b849] mb-3">{t.values.trust.title}</h3>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    {t.values.trust.text}
                                </p>
                            </div>

                            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                                <h3 className="text-lg font-semibold text-[#99b849] mb-3">{t.values.wellness.title}</h3>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    {t.values.wellness.text}
                                </p>
                            </div>

                            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                                <h3 className="text-lg font-semibold text-[#99b849] mb-3">{t.values.innovation.title}</h3>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    {t.values.innovation.text}
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Propuesta de Valor */}
                    <section className="bg-gradient-to-r from-gray-50 to-white border border-gray-100 rounded-lg p-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">{t.valueProposition.title}</h2>
                        <p className="text-base text-gray-600 leading-relaxed mb-4">
                            {t.valueProposition.intro}
                        </p>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li className="flex items-start">
                                <span className="text-[#99b849] font-bold mr-2">✓</span>
                                <span><span className="font-semibold">{t.valueProposition.features.customization.title}</span> {t.valueProposition.features.customization.text}</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-[#99b849] font-bold mr-2">✓</span>
                                <span><span className="font-semibold">{t.valueProposition.features.quality.title}</span> {t.valueProposition.features.quality.text}</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-[#99b849] font-bold mr-2">✓</span>
                                <span><span className="font-semibold">{t.valueProposition.features.discretion.title}</span> {t.valueProposition.features.discretion.text}</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-[#99b849] font-bold mr-2">✓</span>
                                <span><span className="font-semibold">{t.valueProposition.features.experience.title}</span> {t.valueProposition.features.experience.text}</span>
                            </li>
                        </ul>
                    </section>

                    {/* Contacto */}
                    <section className="text-center pt-8 border-t border-gray-100">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">{t.contact.title}</h2>
                        <p className="text-base text-gray-600 mb-4">
                            {t.contact.text}
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
                        <p>{t.footer.tagline}</p>
                        <p className="mt-2">{t.footer.address}</p>
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
}
