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

export default function LegalNotice() {
    return (
        <div className="min-h-screen flex flex-col bg-white text-gray-900 font-sans">
            <Head title="Aviso Legal - MiKiwi" />

            <main className="flex-grow container mx-auto px-6 py-12 md:py-16 max-w-3xl">
                {/* Breadcrumb */}
                <nav className="text-xs text-gray-400 mb-8 flex items-center gap-2">
                    <Link href={route('home')} className="hover:text-secondary-dark transition-colors">Inicio</Link>
                    <span>/</span>
                    <span className="text-gray-700">Aviso Legal</span>
                </nav>

                <h1 className="text-3xl font-bold mb-2 font-head uppercase tracking-tight text-secondary-dark">
                    Aviso Legal
                </h1>
                <p className="text-xs text-gray-400 mb-10">Última actualización: Febrero 2026</p>

                <Section title="Datos Identificativos del Titular">
                    <p>
                        En cumplimiento con el deber de información recogido en el artículo 10 de la Ley 34/2002, de 11 de julio,
                        de Servicios de la Sociedad de la Información y del Comercio Electrónico (LSSI-CE), se informa de los
                        datos identificativos del titular del sitio web:
                    </p>
                    <ul className="space-y-1 mt-2">
                        <li><strong>Denominación social:</strong> MiKiwi</li>
                        <li><strong>Domicilio social:</strong> Pago Valdeconejos, s/n, 11550 Chipiona, Cádiz, España</li>
                        <li><strong>Actividad:</strong> Comercio electrónico de artículos de bienestar íntimo</li>
                        <li><strong>Correo electrónico:</strong> hola@mikiwi.com</li>
                        <li><strong>Sitio web:</strong> www.mikiwi.com</li>
                    </ul>
                </Section>

                <Section title="Objeto y Ámbito de Aplicación">
                    <p>
                        El presente Aviso Legal regula el acceso y el uso del sitio web www.mikiwi.com (en adelante, "el Sitio Web"),
                        del que es titular MiKiwi. El acceso al Sitio Web implica la aceptación expresa y sin reservas de todos los
                        términos del presente Aviso Legal, con el mismo valor que si se hubiese suscrito en papel.
                    </p>
                    <p>
                        El Sitio Web está destinado a personas mayores de 18 años. Al acceder a él, el usuario declara ser mayor
                        de edad y tener la capacidad legal para contratar.
                    </p>
                </Section>

                <Section title="Propiedad Intelectual e Industrial">
                    <p>
                        Todos los contenidos del Sitio Web —incluyendo, sin carácter limitativo, textos, fotografías, gráficos,
                        imágenes, diseños, marcas, logotipos, nombres comerciales y software— son propiedad exclusiva de MiKiwi
                        o de terceros que han cedido su uso, y están protegidos por la legislación vigente en materia de propiedad
                        intelectual e industrial.
                    </p>
                    <p>
                        Queda expresamente prohibida la reproducción, distribución, comunicación pública, transformación o cualquier
                        otra forma de explotación de dichos contenidos sin autorización previa y expresa de MiKiwi.
                    </p>
                </Section>

                <Section title="Condiciones de Acceso y Uso">
                    <p>
                        El acceso al Sitio Web es gratuito y no requiere registro previo, salvo para la realización de compras o el
                        acceso a determinadas funcionalidades reservadas a usuarios registrados. El usuario se compromete a:
                    </p>
                    <ul className="list-disc pl-5 space-y-1 mt-2">
                        <li>Hacer un uso lícito del Sitio Web, conforme a la ley y a las buenas costumbres.</li>
                        <li>No introducir, almacenar o difundir contenidos que sean ilícitos, dañinos o contrarios a los derechos de terceros.</li>
                        <li>No realizar actividades de ingeniería inversa, descompilación o extracto de código del Sitio Web.</li>
                        <li>No utilizar el Sitio Web con fines comerciales no autorizados por MiKiwi.</li>
                    </ul>
                </Section>

                <Section title="Exclusión de Garantías y Responsabilidad">
                    <p>
                        MiKiwi no garantiza la disponibilidad continua e ininterrumpida del Sitio Web ni se responsabiliza de los
                        daños y perjuicios de cualquier naturaleza que pudieran derivarse del acceso o uso del mismo, incluyendo
                        los provocados por virus informáticos, fallos de conexión, interrupciones del servicio o errores en los contenidos.
                    </p>
                    <p>
                        Asimismo, MiKiwi no se hace responsable de los contenidos de sitios web de terceros accesibles mediante
                        enlaces desde el Sitio Web.
                    </p>
                </Section>

                <Section title="Protección de Datos de Carácter Personal">
                    <p>
                        MiKiwi trata los datos de carácter personal de conformidad con el Reglamento (UE) 2016/679 (RGPD) y la
                        Ley Orgánica 3/2018, de 5 de diciembre, de Protección de Datos Personales y garantía de los derechos digitales (LOPDGDD).
                        Para más información, consulte nuestra{' '}
                        <Link href={route('privacy.policy')} className="text-secondary-dark font-medium hover:underline">
                            Política de Privacidad
                        </Link>.
                    </p>
                </Section>

                <Section title="Política de Cookies">
                    <p>
                        El Sitio Web utiliza cookies propias y de terceros. Para más información sobre qué cookies se utilizan y
                        cómo gestionarlas, consulte nuestra{' '}
                        <Link href={route('cookie.policy')} className="text-secondary-dark font-medium hover:underline">
                            Política de Cookies
                        </Link>.
                    </p>
                </Section>

                <Section title="Ley Aplicable y Jurisdicción">
                    <p>
                        Las relaciones establecidas entre MiKiwi y el Usuario se regirán por lo dispuesto en la normativa española
                        vigente. Para la resolución de cualquier controversia o conflicto derivado del acceso o uso del Sitio Web,
                        las partes se someterán a los Juzgados y Tribunales de Cádiz, renunciando expresamente a cualquier otro
                        fuero que pudiera corresponderles, sin perjuicio de lo dispuesto por la normativa de consumidores y usuarios.
                    </p>
                </Section>
            </main>
        </div>
    );
}
