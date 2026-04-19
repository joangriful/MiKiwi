import React from 'react';
import { Head, Link } from '@inertiajs/react';

const Section = ({ title, children }) => (
    <section className="mb-10">
        <h2 className="text-base font-bold text-gray-900 uppercase tracking-widest mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
            <span className="text-secondary-dark">·</span> {title}
        </h2>
        <div className="text-gray-600 text-sm leading-relaxed space-y-3">{children}</div>
    </section>
);

export default function TermsOfUse() {
    return (
        <div className="min-h-screen flex flex-col bg-white font-sans text-gray-800">
            <Head title="Términos de Uso - MiKiwi" />

            <main className="flex-grow container mx-auto px-6 py-12 md:py-16 max-w-3xl">
                {/* Breadcrumb */}
                <nav className="text-xs text-gray-400 mb-8 flex items-center gap-2">
                    <Link href={route('home')} className="hover:text-secondary-dark transition-colors">Inicio</Link>
                    <span>/</span>
                    <span className="text-gray-700">Términos de Uso</span>
                </nav>

                <h1 className="text-3xl font-bold mb-2 font-head uppercase tracking-tight text-secondary-dark">
                    Términos de Uso
                </h1>
                <p className="text-xs text-gray-400 mb-10">Última actualización: Febrero 2026</p>

                <Section title="Aceptación de los Términos">
                    <p>
                        El acceso y uso del sitio web www.mikiwi.com (en adelante, "el Sitio Web") atribuye la condición de usuario
                        y supone la aceptación plena y sin reservas de todas las disposiciones incluidas en estos Términos de Uso,
                        así como en nuestro Aviso Legal y Política de Privacidad.
                    </p>
                    <p>
                        Si no estás de acuerdo con alguno de estos términos, por favor, abstente de utilizar el Sitio Web.
                    </p>
                </Section>

                <Section title="Edad Mínima de Acceso">
                    <p>
                        El Sitio Web comercializa artículos de bienestar íntimo destinados exclusivamente a personas
                        <strong> mayores de 18 años</strong>. Al acceder al Sitio Web, declaras expresamente ser mayor de edad
                        y tener capacidad legal para contratar.
                    </p>
                    <p>
                        MiKiwi se reserva el derecho de solicitar documentación acreditativa de la edad en cualquier momento del
                        proceso de compra y de cancelar los pedidos realizados en incumplimiento de este requisito.
                    </p>
                </Section>

                <Section title="Registro de Usuario">
                    <p>
                        Para realizar compras en el Sitio Web es necesario registrarse como usuario. Al registrarte, te comprometes a:
                    </p>
                    <ul className="list-disc pl-5 space-y-1 mt-2">
                        <li>Proporcionar información veraz, actual y completa.</li>
                        <li>Mantener la confidencialidad de tu contraseña y no compartirla con terceros.</li>
                        <li>Notificarnos inmediatamente de cualquier uso no autorizado de tu cuenta.</li>
                        <li>Actualizar tus datos siempre que sea necesario para que sean precisos.</li>
                    </ul>
                    <p>
                        MiKiwi no será responsable de los daños o pérdidas derivadas del incumplimiento de estas obligaciones.
                    </p>
                </Section>

                <Section title="Uso Aceptable del Sitio Web">
                    <p>El usuario se compromete a utilizar el Sitio Web de forma lícita y conforme a las buenas costumbres y al orden público. En particular, está prohibido:</p>
                    <ul className="list-disc pl-5 space-y-1 mt-2">
                        <li>Utilizar el Sitio Web con fines ilegales o contrarios al ordenamiento jurídico.</li>
                        <li>Introducir o difundir contenidos falsos, engañosos, ofensivos o discriminatorios.</li>
                        <li>Suplantar la identidad de otros usuarios, de MiKiwi o de terceros.</li>
                        <li>Realizar prácticas de web scraping, spamming o cualquier otra conducta que afecte al rendimiento del servidor.</li>
                        <li>Intentar acceder sin autorización a otras cuentas, sistemas o redes informáticas.</li>
                    </ul>
                </Section>

                <Section title="Propiedad Intelectual">
                    <p>
                        Todos los contenidos del Sitio Web (textos, imágenes, diseños, logotipos, código fuente, etc.) son propiedad
                        de MiKiwi o de terceros que han cedido su uso. Queda prohibida su reproducción, distribución o comunicación
                        pública sin autorización expresa, salvo para uso personal y no comercial.
                    </p>
                </Section>

                <Section title="Limitación de Responsabilidad">
                    <p>
                        MiKiwi no garantiza que el Sitio Web esté libre de errores, virus o cualquier otro elemento perjudicial.
                        No nos responsabilizamos de los daños que pueda ocasionar el uso indebido o la imposibilidad de uso del Sitio Web.
                    </p>
                    <p>
                        La información publicada en el Sitio Web tiene carácter meramente informativo y puede estar sujeta a cambios
                        sin previo aviso.
                    </p>
                </Section>

                <Section title="Modificaciones de los Términos">
                    <p>
                        MiKiwi se reserva el derecho de modificar en cualquier momento estos Términos de Uso. Las modificaciones
                        entrarán en vigor desde el momento de su publicación en el Sitio Web. El uso continuado del Sitio Web tras
                        la publicación de los cambios implicará la aceptación de los mismos.
                    </p>
                </Section>

                <Section title="Ley Aplicable y Jurisdicción">
                    <p>
                        Estos Términos de Uso se rigen por la legislación española. Para cualquier litigio relacionado con el uso
                        del Sitio Web, las partes se someten a la jurisdicción de los Juzgados y Tribunales de Cádiz, sin perjuicio
                        de lo dispuesto por la normativa de protección de consumidores y usuarios.
                    </p>
                </Section>
            </main>
        </div>
    );
}
