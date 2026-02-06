import React from 'react';
import { Head } from '@inertiajs/react';
import Header from '@/Components/Common/Header';
import Footer from '@/Components/Common/Footer';

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen flex flex-col bg-white font-sans select-none cursor-default text-gray-800">
            <Head title="Política de Privacidad - MiKiwi" />

            <Header />

            <main className="flex-1 w-full max-w-4xl mx-auto py-16 px-6 md:px-12">
                <h1 className="text-3xl md:text-4xl font-bold mb-8 text-gray-900 border-b border-gray-100 pb-6">Política de Privacidad</h1>

                <div className="space-y-8 text-sm md:text-base leading-relaxed text-gray-600">
                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-4">1. Responsable del Tratamiento</h2>
                        <p>
                            MiKiwi Inc. (en adelante, "MiKiwi"), con domicilio social en Av. de la Fruta 123, es el responsable del tratamiento de sus datos personales.
                            Para cualquier consulta relacionada con la privacidad, puede contactarnos en <span className="text-[#99b849] font-medium">mikiwi.toys@gmail.com</span>.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-4">2. Finalidad del Tratamiento</h2>
                        <p className="mb-2">Sus datos personales serán tratados con las siguientes finalidades:</p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Gestión de pedidos y facturación.</li>
                            <li>Atención al cliente y gestión de reclamaciones.</li>
                            <li>Envío de comunicaciones comerciales (si ha otorgado su consentimiento).</li>
                            <li>Mejora de la experiencia de usuario y análisis web.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-4">3. Base Legitimadora</h2>
                        <p>
                            El tratamiento de sus datos se basa en la ejecución del contrato de compraventa, el cumplimiento de obligaciones legales y, en su caso, el consentimiento expreso del usuario.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-4">4. Destinatarios de los Datos</h2>
                        <p>
                            Sus datos no serán cedidos a terceros, salvo obligación legal o cuando sea necesario para la prestación del servicio (ej. empresas de transporte).
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-4">5. Derechos del Usuario</h2>
                        <p>
                            Puede ejercer sus derechos de acceso, rectificación, supresión, oposición, limitación y portabilidad enviando una solicitud a nuestro correo electrónico de contacto.
                        </p>
                    </section>

                    <section className="pt-6 border-t border-gray-100 text-xs text-gray-500">
                        <p>Última actualización: Enero 2026</p>
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
}
