import React from 'react';
import { Link } from '@inertiajs/react';
import LegalSection from '@/Components/Marketing/LegalSection/LegalSection';
import MarketingPageLayout from '@/Components/Marketing/MarketingPageLayout/MarketingPageLayout';

export default function LegalNotice() {
    return (
        <MarketingPageLayout title="Aviso Legal" updatedAt="Febrero 2026" maxWidth="narrow">
            <LegalSection title="Datos Identificativos del Titular">
                <p>
                    En cumplimiento con el deber de información recogido en el artículo 10 de la Ley 34/2002, de 11 de julio,
                    de Servicios de la Sociedad de la Información y del Comercio Electrónico (LSSI-CE), se informa de los
                    datos identificativos del titular del sitio web:
                </p>
                <ul>
                    <li><strong>Denominación social:</strong> MiKiwi</li>
                    <li><strong>Domicilio social:</strong> Pago Valdeconejos, s/n, 11550 Chipiona, Cádiz, España</li>
                    <li><strong>Actividad:</strong> Comercio electrónico de artículos de bienestar íntimo</li>
                    <li><strong>Correo electrónico:</strong> hola@mikiwi.com</li>
                    <li><strong>Sitio web:</strong> www.mikiwi.com</li>
                </ul>
            </LegalSection>

            <LegalSection title="Objeto y Ámbito de Aplicación">
                <p>
                    El presente Aviso Legal regula el acceso y el uso del sitio web www.mikiwi.com (en adelante, "el Sitio Web"),
                    del que es titular MiKiwi. El acceso al Sitio Web implica la aceptación expresa y sin reservas de todos los
                    términos del presente Aviso Legal.
                </p>
                <p>El Sitio Web está destinado a personas mayores de 18 años.</p>
            </LegalSection>

            <LegalSection title="Propiedad Intelectual e Industrial">
                <p>
                    Todos los contenidos del Sitio Web son propiedad exclusiva de MiKiwi o de terceros que han cedido su uso,
                    y están protegidos por la legislación vigente.
                </p>
                <p>Queda prohibida la reproducción, distribución, comunicación pública o transformación sin autorización previa.</p>
            </LegalSection>

            <LegalSection title="Condiciones de Acceso y Uso">
                <p>El usuario se compromete a:</p>
                <ul>
                    <li>Hacer un uso lícito del Sitio Web, conforme a la ley y a las buenas costumbres.</li>
                    <li>No introducir, almacenar o difundir contenidos ilícitos, dañinos o contrarios a derechos de terceros.</li>
                    <li>No realizar ingeniería inversa, descompilación o extracción de código del Sitio Web.</li>
                    <li>No utilizar el Sitio Web con fines comerciales no autorizados por MiKiwi.</li>
                </ul>
            </LegalSection>

            <LegalSection title="Exclusión de Garantías y Responsabilidad">
                <p>
                    MiKiwi no garantiza la disponibilidad continua e ininterrumpida del Sitio Web ni se responsabiliza de daños
                    derivados del acceso o uso del mismo, incluyendo virus, fallos de conexión o errores en contenidos.
                </p>
                <p>MiKiwi no se hace responsable de contenidos de sitios web de terceros accesibles mediante enlaces.</p>
            </LegalSection>

            <LegalSection title="Protección de Datos de Carácter Personal">
                <p>
                    MiKiwi trata los datos personales conforme al RGPD y la LOPDGDD. Para más información, consulta nuestra{' '}
                    <Link href={route('privacy.policy')}>Política de Privacidad</Link>.
                </p>
            </LegalSection>

            <LegalSection title="Política de Cookies">
                <p>
                    El Sitio Web utiliza cookies propias y de terceros. Para más información, consulta nuestra{' '}
                    <Link href={route('cookie.policy')}>Política de Cookies</Link>.
                </p>
            </LegalSection>

            <LegalSection title="Ley Aplicable y Jurisdicción">
                <p>
                    Las relaciones entre MiKiwi y el Usuario se regirán por la normativa española vigente. Para cualquier
                    controversia, las partes se someterán a los Juzgados y Tribunales de Cádiz, sin perjuicio de la normativa
                    de consumidores y usuarios.
                </p>
            </LegalSection>
        </MarketingPageLayout>
    );
}
