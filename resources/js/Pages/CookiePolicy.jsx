import React from 'react';
import { Head, Link } from '@inertiajs/react';
import Header from '@/Components/Common/Header';
import Footer from '@/Components/Common/Footer';

const Section = ({ title, children }) => (
    <section className="mb-10">
        <h2 className="text-base font-bold text-gray-900 uppercase tracking-widest mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
            <span className="text-secondary-dark">·</span> {title}
        </h2>
        <div className="text-gray-600 text-sm leading-relaxed space-y-3">{children}</div>
    </section>
);

const CookieTable = ({ rows }) => (
    <div className="overflow-x-auto mt-4">
        <table className="w-full text-xs border-collapse">
            <thead>
                <tr className="bg-gray-50">
                    <th className="text-left p-3 font-semibold text-gray-700 border border-gray-200">Cookie</th>
                    <th className="text-left p-3 font-semibold text-gray-700 border border-gray-200">Tipo</th>
                    <th className="text-left p-3 font-semibold text-gray-700 border border-gray-200">Finalidad</th>
                    <th className="text-left p-3 font-semibold text-gray-700 border border-gray-200">Duración</th>
                </tr>
            </thead>
            <tbody>
                {rows.map((row, i) => (
                    <tr key={i} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="p-3 border border-gray-200 font-mono text-gray-600">{row.name}</td>
                        <td className="p-3 border border-gray-200">{row.type}</td>
                        <td className="p-3 border border-gray-200">{row.purpose}</td>
                        <td className="p-3 border border-gray-200">{row.duration}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

export default function CookiePolicy() {
    return (
        <div className="min-h-screen flex flex-col bg-white font-sans text-gray-800">
            <Head title="Política de Cookies - MiKiwi" />
            <Header />

            <main className="flex-grow container mx-auto px-6 py-12 md:py-16 max-w-3xl">
                {/* Breadcrumb */}
                <nav className="text-xs text-gray-400 mb-8 flex items-center gap-2">
                    <Link href={route('home')} className="hover:text-secondary-dark transition-colors">Inicio</Link>
                    <span>/</span>
                    <span className="text-gray-700">Política de Cookies</span>
                </nav>

                <h1 className="text-3xl font-bold mb-2 font-head uppercase tracking-tight text-secondary-dark">
                    Política de Cookies
                </h1>
                <p className="text-xs text-gray-400 mb-10">Última actualización: Febrero 2026</p>

                <Section title="¿Qué son las cookies?">
                    <p>
                        Las cookies son pequeños archivos de texto que los sitios web almacenan en tu dispositivo cuando los visitas.
                        Su función es recordar información sobre tu visita para que la próxima vez que accedas al sitio resulte más
                        fácil y útil.
                    </p>
                    <p>
                        Las cookies son totalmente seguras y no contienen información personal a menos que tú la hayas facilitado
                        al sitio web.
                    </p>
                </Section>

                <Section title="¿Qué tipos de cookies utilizamos?">
                    <p>En MiKiwi utilizamos los siguientes tipos de cookies:</p>

                    <div className="mt-4 space-y-5">
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h3 className="font-bold text-gray-900 mb-1">🔒 Cookies estrictamente necesarias</h3>
                            <p>Son imprescindibles para el correcto funcionamiento del Sitio Web. Sin ellas, servicios como el carrito de compras, el inicio de sesión o el formulario de pago no funcionarían. No requieren tu consentimiento.</p>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4">
                            <h3 className="font-bold text-gray-900 mb-1">📊 Cookies analíticas</h3>
                            <p>Nos permiten medir y analizar el comportamiento de los usuarios en el Sitio Web (páginas visitadas, tiempo de sesión, etc.) para mejorar el servicio. Solo se instalan con tu consentimiento.</p>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4">
                            <h3 className="font-bold text-gray-900 mb-1">⚙️ Cookies de funcionalidad</h3>
                            <p>Recuerdan tus preferencias de usuario (idioma, región, etc.) para personalizar tu experiencia. Solo se instalan con tu consentimiento.</p>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4">
                            <h3 className="font-bold text-gray-900 mb-1">📣 Cookies de marketing y publicidad</h3>
                            <p>Permiten mostrarte publicidad relevante basada en tus intereses y medir la efectividad de nuestras campañas. Solo se instalan con tu consentimiento.</p>
                        </div>
                    </div>
                </Section>

                <Section title="Listado de cookies utilizadas">
                    <CookieTable rows={[
                        { name: 'XSRF-TOKEN', type: 'Necesaria', purpose: 'Protección CSRF en formularios', duration: 'Sesión' },
                        { name: 'mikiwi_session', type: 'Necesaria', purpose: 'Gestión de sesión de usuario', duration: 'Sesión' },
                        { name: 'remember_web_*', type: 'Necesaria', purpose: 'Recordar inicio de sesión', duration: '5 años' },
                        { name: '_ga', type: 'Analítica', purpose: 'Google Analytics - identificar usuarios únicos', duration: '2 años' },
                        { name: '_ga_*', type: 'Analítica', purpose: 'Google Analytics - distinción de sesiones', duration: '2 años' },
                        { name: '_gid', type: 'Analítica', purpose: 'Google Analytics - distinción de usuarios', duration: '24 horas' },
                        { name: 'lang', type: 'Funcionalidad', purpose: 'Preferencia de idioma seleccionada', duration: '1 año' },
                        { name: 'fbp', type: 'Marketing', purpose: 'Meta Pixel - seguimiento de conversiones', duration: '90 días' },
                    ]} />
                </Section>

                <Section title="Cookies de terceros">
                    <p>
                        Algunos servicios de terceros que usamos pueden instalar sus propias cookies. No controlamos dichas cookies
                        y te recomendamos que revises las políticas de privacidad de cada proveedor:
                    </p>
                    <ul className="list-disc pl-5 space-y-1 mt-2">
                        <li><strong>Google Analytics</strong> – Análisis web: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-secondary-dark hover:underline">policies.google.com/privacy</a></li>
                        <li><strong>Meta Pixel (Facebook/Instagram)</strong> – Publicidad: <a href="https://www.facebook.com/privacy/policy" target="_blank" rel="noopener noreferrer" className="text-secondary-dark hover:underline">facebook.com/privacy</a></li>
                        <li><strong>Cloudinary</strong> – Gestión de imágenes: <a href="https://cloudinary.com/privacy" target="_blank" rel="noopener noreferrer" className="text-secondary-dark hover:underline">cloudinary.com/privacy</a></li>
                    </ul>
                </Section>

                <Section title="¿Cómo gestionar las cookies?">
                    <p>
                        Puedes configurar tu navegador para rechazar, eliminar o gestionar las cookies en cualquier momento.
                        Ten en cuenta que desactivar ciertas cookies puede afectar al funcionamiento del Sitio Web.
                    </p>

                    <div className="bg-gray-50 border border-gray-100 rounded-lg p-5 mt-4 space-y-2">
                        <h3 className="text-sm font-semibold text-gray-900 mb-3">Gestión por navegador:</h3>
                        <ul className="space-y-2">
                            <li><span className="font-medium">Chrome:</span> <span className="ml-1 text-gray-500">Ajustes → Privacidad y seguridad → Cookies y otros datos del sitio</span></li>
                            <li><span className="font-medium">Firefox:</span> <span className="ml-1 text-gray-500">Opciones → Privacidad y seguridad → Cookies y datos del sitio</span></li>
                            <li><span className="font-medium">Safari:</span> <span className="ml-1 text-gray-500">Preferencias → Privacidad → Gestionar datos de sitios web</span></li>
                            <li><span className="font-medium">Edge:</span> <span className="ml-1 text-gray-500">Configuración → Cookies y permisos del sitio</span></li>
                        </ul>
                    </div>
                </Section>

                <Section title="Actualizaciones de esta Política">
                    <p>
                        MiKiwi puede actualizar esta Política de Cookies en cualquier momento. Los cambios serán publicados en esta
                        página e indicaremos la fecha de la última actualización. Te recomendamos revisarla periódicamente.
                    </p>
                </Section>

                <Section title="Contacto">
                    <p>
                        Para cualquier duda sobre nuestra Política de Cookies, escríbenos a{' '}
                        <a href="mailto:hola@mikiwi.com" className="text-secondary-dark font-medium hover:underline">hola@mikiwi.com</a>.
                    </p>
                </Section>
            </main>

            <Footer />
        </div>
    );
}
