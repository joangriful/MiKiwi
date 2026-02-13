import React from 'react';
import { Head } from '@inertiajs/react';
import Header from '@/Components/Common/Header';
import Footer from '@/Components/Common/Footer';

export default function CookiePolicy() {
    return (
        <div className="min-h-screen flex flex-col bg-white font-sans select-none cursor-default text-gray-800">
            <Head title="Política de Cookies - MiKiwi" />

            <Header />

            <main className="flex-1 w-full max-w-4xl mx-auto py-16 px-6 md:px-12">
                <h1 className="text-3xl md:text-4xl font-bold mb-8 text-gray-900 border-b border-gray-100 pb-6">Política de Cookies</h1>

                <div className="space-y-8 text-sm md:text-base leading-relaxed text-gray-600">
                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-4">¿Qué son las cookies?</h2>
                        <p>
                            Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo cuando visitas un sitio web.
                            Estos archivos permiten que el sitio web recuerde tus acciones y preferencias (como inicio de sesión, idioma,
                            tamaño de fuente y otras preferencias de visualización) durante un período de tiempo, por lo que no tienes
                            que volver a configurarlas cada vez que regreses al sitio o navegues de una página a otra.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-4">¿Cómo utilizamos las cookies?</h2>
                        <p className="mb-3">
                            En MiKiwi, utilizamos cookies para mejorar tu experiencia de navegación y proporcionar funcionalidades
                            personalizadas. Nuestro uso de cookies se categoriza de la siguiente manera:
                        </p>

                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Cookies Esenciales</h3>
                                <p>
                                    Estas cookies son necesarias para el funcionamiento básico del sitio web. Permiten la navegación
                                    y el uso de funciones básicas como el acceso a áreas seguras del sitio. Sin estas cookies,
                                    el sitio web no puede funcionar correctamente.
                                </p>
                                <ul className="list-disc pl-5 mt-2 space-y-1">
                                    <li>Gestión de sesiones de usuario</li>
                                    <li>Autenticación y seguridad</li>
                                    <li>Carrito de compras</li>
                                    <li>Preferencias de consentimiento de cookies</li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Cookies de Rendimiento y Analíticas</h3>
                                <p>
                                    Estas cookies recopilan información sobre cómo utilizas nuestro sitio web, como las páginas
                                    que visitas con más frecuencia y si recibes mensajes de error. Utilizamos esta información
                                    para mejorar el funcionamiento del sitio web.
                                </p>
                                <ul className="list-disc pl-5 mt-2 space-y-1">
                                    <li>Google Analytics (análisis de tráfico web)</li>
                                    <li>Métricas de rendimiento del sitio</li>
                                    <li>Análisis de comportamiento del usuario</li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Cookies de Funcionalidad</h3>
                                <p>
                                    Estas cookies permiten que el sitio web recuerde las elecciones que haces (como tu nombre de
                                    usuario, idioma o la región en la que te encuentras) y proporcionan características mejoradas
                                    y más personales.
                                </p>
                                <ul className="list-disc pl-5 mt-2 space-y-1">
                                    <li>Preferencias de idioma</li>
                                    <li>Configuraciones de visualización</li>
                                    <li>Personalización de contenido</li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Cookies de Marketing y Publicidad</h3>
                                <p>
                                    Estas cookies se utilizan para ofrecer contenido publicitario más relevante para ti y tus intereses.
                                    También se utilizan para limitar el número de veces que ves un anuncio y ayudar a medir la efectividad
                                    de las campañas publicitarias.
                                </p>
                                <ul className="list-disc pl-5 mt-2 space-y-1">
                                    <li>Publicidad dirigida</li>
                                    <li>Seguimiento de conversiones</li>
                                    <li>Remarketing</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Cookies de terceros</h2>
                        <p className="mb-3">
                            Algunos de nuestros socios también pueden establecer cookies en tu dispositivo cuando visitas nuestro sitio.
                            No tenemos control sobre estas cookies de terceros y te recomendamos que revises las políticas de privacidad
                            de estos servicios:
                        </p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li><span className="font-medium">Google Analytics</span> - Para análisis web y estadísticas de uso</li>
                            <li><span className="font-medium">Cloudinary</span> - Para gestión y optimización de imágenes</li>
                            <li><span className="font-medium">Redes sociales</span> - Para integración de contenido social</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-4">¿Cómo gestionar las cookies?</h2>
                        <p className="mb-3">
                            Puedes controlar y/o eliminar las cookies según desees. Puedes eliminar todas las cookies que ya están
                            en tu dispositivo y puedes configurar la mayoría de los navegadores para evitar que se coloquen.
                            Sin embargo, si haces esto, es posible que tengas que ajustar manualmente algunas preferencias cada vez
                            que visites un sitio y algunos servicios y funcionalidades pueden no funcionar.
                        </p>

                        <div className="bg-gray-50 border border-gray-100 rounded-lg p-6 mt-4">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Gestión por navegador:</h3>
                            <ul className="space-y-2">
                                <li>
                                    <span className="font-medium">Chrome:</span>
                                    <span className="ml-2">Configuración → Privacidad y seguridad → Cookies y otros datos del sitio</span>
                                </li>
                                <li>
                                    <span className="font-medium">Firefox:</span>
                                    <span className="ml-2">Opciones → Privacidad y seguridad → Cookies y datos del sitio</span>
                                </li>
                                <li>
                                    <span className="font-medium">Safari:</span>
                                    <span className="ml-2">Preferencias → Privacidad → Gestionar datos de sitios web</span>
                                </li>
                                <li>
                                    <span className="font-medium">Edge:</span>
                                    <span className="ml-2">Configuración → Cookies y permisos del sitio → Cookies y datos del sitio</span>
                                </li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Duración de las cookies</h2>
                        <p className="mb-3">
                            Las cookies que utilizamos tienen diferentes períodos de duración:
                        </p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li><span className="font-medium">Cookies de sesión:</span> Se eliminan automáticamente cuando cierras el navegador</li>
                            <li><span className="font-medium">Cookies persistentes:</span> Permanecen en tu dispositivo por un período determinado (generalmente de 1 mes a 2 años)</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Actualizaciones de esta política</h2>
                        <p>
                            Podemos actualizar nuestra Política de Cookies ocasionalmente para reflejar cambios en nuestras prácticas
                            o por otras razones operativas, legales o reglamentarias. Te recomendamos que revises esta página periódicamente
                            para estar informado sobre nuestro uso de cookies.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Contacto</h2>
                        <p>
                            Si tienes alguna pregunta sobre nuestra Política de Cookies, puedes contactarnos en{' '}
                            <a href="mailto:mikiwi.toys@gmail.com" className="text-[#99b849] font-medium hover:underline">
                                mikiwi.toys@gmail.com
                            </a>
                        </p>
                    </section>

                    <section className="pt-6 border-t border-gray-100 text-xs text-gray-500">
                        <p>Última actualización: Febrero 2026</p>
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
}
