import React from 'react';
import { Link } from '@inertiajs/react';
import LegalSection from '@/Components/Marketing/LegalSection/LegalSection';
import MarketingPageLayout from '@/Components/Marketing/MarketingPageLayout/MarketingPageLayout';

export default function PrivacyPolicy() {
    return (
        <MarketingPageLayout title="Política de Privacidad" updatedAt="Febrero 2026" maxWidth="narrow">
            <LegalSection title="Responsable del Tratamiento">
                <p>
                    MiKiwi (en adelante, "MiKiwi"), con domicilio en Pago Valdeconejos, s/n, 11550 Chipiona, Cádiz, España,
                    es el Responsable del Tratamiento de tus datos personales.
                </p>
                <p><strong>Correo de contacto para privacidad:</strong> hola@mikiwi.com</p>
            </LegalSection>

            <LegalSection title="¿Qué datos recopilamos?">
                <p>Los datos personales que podemos recopilar son los siguientes, según la interacción que tengas con nosotros:</p>
                <ul>
                    <li><strong>Datos de identificación:</strong> nombre y apellidos, correo electrónico, teléfono.</li>
                    <li><strong>Datos de envío:</strong> dirección postal, código postal, ciudad, país.</li>
                    <li><strong>Datos de pago:</strong> procesados de forma segura por pasarelas de pago certificadas PCI-DSS. MiKiwi no almacena datos de tarjeta.</li>
                    <li><strong>Datos de navegación:</strong> dirección IP, tipo de navegador, páginas visitadas, cookies de sesión.</li>
                    <li><strong>Comunicaciones:</strong> mensajes enviados a través del formulario de contacto.</li>
                </ul>
            </LegalSection>

            <LegalSection title="¿Con qué finalidad tratamos tus datos?">
                <p>Tus datos personales son tratados con las siguientes finalidades:</p>
                <ul>
                    <li><strong>Gestión de pedidos:</strong> procesar, gestionar y confirmar tus compras y envíos.</li>
                    <li><strong>Atención al cliente:</strong> responder a tus consultas, incidencias y reclamaciones.</li>
                    <li><strong>Marketing:</strong> enviarte comunicaciones comerciales sobre novedades, ofertas y contenidos exclusivos (solo si has dado tu consentimiento).</li>
                    <li><strong>Mejora del servicio:</strong> análisis estadístico del uso del sitio para mejorar la experiencia de usuario.</li>
                    <li><strong>Obligaciones legales:</strong> cumplimiento de la normativa fiscal, aduanera y contable.</li>
                </ul>
            </LegalSection>

            <LegalSection title="Bases Jurídicas del Tratamiento">
                <ul>
                    <li><strong>Ejecución de un contrato:</strong> para procesar tus pedidos y gestionar tu cuenta.</li>
                    <li><strong>Consentimiento:</strong> para el envío de comunicaciones comerciales y newsletter.</li>
                    <li><strong>Interés legítimo:</strong> para la prevención del fraude y la seguridad del sitio.</li>
                    <li><strong>Obligación legal:</strong> para el cumplimiento de obligaciones tributarias y legales.</li>
                </ul>
            </LegalSection>

            <LegalSection title="¿Durante cuánto tiempo conservamos tus datos?">
                <p>Conservamos tus datos durante el tiempo necesario para cumplir con las finalidades para las que fueron recogidos. En particular:</p>
                <ul>
                    <li>Los datos de pedidos se conservan durante <strong>5 años</strong> desde la fecha de compra, conforme a la normativa fiscal.</li>
                    <li>Los datos de newsletter se conservan hasta que retires tu consentimiento.</li>
                    <li>Los datos de contacto se conservan durante el tiempo necesario para responder a tu solicitud.</li>
                </ul>
            </LegalSection>

            <LegalSection title="¿A quién cedemos tus datos?">
                <p>MiKiwi podrá compartir tus datos con terceros únicamente cuando sea necesario para prestar el servicio:</p>
                <ul>
                    <li><strong>Empresas de transporte y logística:</strong> para la entrega de tus pedidos.</li>
                    <li><strong>Pasarelas de pago:</strong> para procesar los pagos de forma segura.</li>
                    <li><strong>Proveedores de servicios tecnológicos:</strong> alojamiento web, plataformas de correo electrónico y análisis.</li>
                    <li><strong>Autoridades:</strong> cuando sea requerido por ley o resolución judicial.</li>
                </ul>
                <p>Nunca venderemos ni cederemos tus datos a terceros con fines comerciales propios sin tu consentimiento expreso.</p>
            </LegalSection>

            <LegalSection title="Tus Derechos">
                <p>Como titular de los datos, tienes los siguientes derechos reconocidos por el RGPD:</p>
                <ul>
                    <li><strong>Acceso:</strong> conocer qué datos personales tratamos sobre ti.</li>
                    <li><strong>Rectificación:</strong> corregir datos inexactos o incompletos.</li>
                    <li><strong>Supresión ("derecho al olvido"):</strong> solicitar la eliminación de tus datos cuando ya no sean necesarios.</li>
                    <li><strong>Oposición:</strong> oponerte al tratamiento de tus datos para determinadas finalidades.</li>
                    <li><strong>Portabilidad:</strong> recibir tus datos en un formato estructurado y de uso común.</li>
                    <li><strong>Limitación del tratamiento:</strong> solicitar que el tratamiento de tus datos quede restringido.</li>
                </ul>
                <p>
                    Para ejercer cualquiera de estos derechos, envíanos un correo a <strong>hola@mikiwi.com</strong> indicando
                    el derecho que deseas ejercer y adjuntando una copia de tu DNI o documento identificativo.
                </p>
                <p>
                    También tienes derecho a presentar una reclamación ante la Agencia Española de Protección de Datos (AEPD):{' '}
                    <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer">www.aepd.es</a>.
                </p>
            </LegalSection>

            <LegalSection title="Seguridad de los Datos">
                <p>
                    MiKiwi aplica medidas técnicas y organizativas adecuadas para proteger tus datos contra el acceso no autorizado,
                    la pérdida, la destrucción o la divulgación accidental. El sitio web utiliza cifrado SSL/TLS en todas las
                    comunicaciones y las contraseñas se almacenan de forma segura mediante funciones de hash.
                </p>
            </LegalSection>

            <LegalSection title="Cookies">
                <p>
                    El Sitio Web utiliza cookies. Para más información sobre cómo las usamos y cómo gestionarlas, consulta nuestra{' '}
                    <Link href={route('cookie.policy')}>Política de Cookies</Link>.
                </p>
            </LegalSection>
        </MarketingPageLayout>
    );
}
