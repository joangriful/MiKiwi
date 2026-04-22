import React from 'react';
import CookieTable from '@/Components/Marketing/CookieTable/CookieTable';
import LegalSection from '@/Components/Marketing/LegalSection/LegalSection';
import MarketingPageLayout from '@/Components/Marketing/MarketingPageLayout/MarketingPageLayout';

const cookieRows = [
    { name: 'XSRF-TOKEN', type: 'Necesaria', purpose: 'Protección CSRF en formularios', duration: 'Sesión' },
    { name: 'mikiwi_session', type: 'Necesaria', purpose: 'Gestión de sesión de usuario', duration: 'Sesión' },
    { name: 'remember_web_*', type: 'Necesaria', purpose: 'Recordar inicio de sesión', duration: '5 años' },
    { name: '_ga', type: 'Analítica', purpose: 'Google Analytics - identificar usuarios únicos', duration: '2 años' },
    { name: '_ga_*', type: 'Analítica', purpose: 'Google Analytics - distinción de sesiones', duration: '2 años' },
    { name: '_gid', type: 'Analítica', purpose: 'Google Analytics - distinción de usuarios', duration: '24 horas' },
    { name: 'lang', type: 'Funcionalidad', purpose: 'Preferencia de idioma seleccionada', duration: '1 año' },
    { name: 'fbp', type: 'Marketing', purpose: 'Meta Pixel - seguimiento de conversiones', duration: '90 días' },
];

const cookieTypes = [
    {
        title: 'Cookies estrictamente necesarias',
        text: 'Son imprescindibles para el correcto funcionamiento del Sitio Web. Sin ellas, servicios como el carrito, el inicio de sesión o el formulario de pago no funcionarían.',
    },
    {
        title: 'Cookies analíticas',
        text: 'Nos permiten medir y analizar el comportamiento de los usuarios para mejorar el servicio. Solo se instalan con tu consentimiento.',
    },
    {
        title: 'Cookies de funcionalidad',
        text: 'Recuerdan tus preferencias de usuario para personalizar tu experiencia. Solo se instalan con tu consentimiento.',
    },
    {
        title: 'Cookies de marketing y publicidad',
        text: 'Permiten mostrar publicidad relevante y medir la efectividad de campañas. Solo se instalan con tu consentimiento.',
    },
];

export default function CookiePolicy() {
    return (
        <MarketingPageLayout title="Política de Cookies" updatedAt="Febrero 2026" maxWidth="narrow">
            <LegalSection title="¿Qué son las cookies?">
                <p>
                    Las cookies son pequeños archivos de texto que los sitios web almacenan en tu dispositivo cuando los visitas.
                    Su función es recordar información sobre tu visita para que la próxima vez resulte más fácil y útil.
                </p>
                <p>Las cookies son seguras y no contienen información personal salvo que tú la hayas facilitado al sitio web.</p>
            </LegalSection>

            <LegalSection title="¿Qué tipos de cookies utilizamos?">
                <p>En MiKiwi utilizamos los siguientes tipos de cookies:</p>
                {cookieTypes.map((type) => (
                    <article key={type.title}>
                        <h3>{type.title}</h3>
                        <p>{type.text}</p>
                    </article>
                ))}
            </LegalSection>

            <LegalSection title="Listado de cookies utilizadas">
                <CookieTable rows={cookieRows} />
            </LegalSection>

            <LegalSection title="Cookies de terceros">
                <p>Algunos servicios de terceros que usamos pueden instalar sus propias cookies:</p>
                <ul>
                    <li><strong>Google Analytics:</strong> <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">policies.google.com/privacy</a></li>
                    <li><strong>Meta Pixel:</strong> <a href="https://www.facebook.com/privacy/policy" target="_blank" rel="noopener noreferrer">facebook.com/privacy</a></li>
                    <li><strong>Cloudinary:</strong> <a href="https://cloudinary.com/privacy" target="_blank" rel="noopener noreferrer">cloudinary.com/privacy</a></li>
                </ul>
            </LegalSection>

            <LegalSection title="¿Cómo gestionar las cookies?">
                <p>Puedes configurar tu navegador para rechazar, eliminar o gestionar las cookies en cualquier momento.</p>
                <ul>
                    <li><strong>Chrome:</strong> Ajustes, Privacidad y seguridad, Cookies y otros datos del sitio.</li>
                    <li><strong>Firefox:</strong> Opciones, Privacidad y seguridad, Cookies y datos del sitio.</li>
                    <li><strong>Safari:</strong> Preferencias, Privacidad, Gestionar datos de sitios web.</li>
                    <li><strong>Edge:</strong> Configuración, Cookies y permisos del sitio.</li>
                </ul>
            </LegalSection>

            <LegalSection title="Actualizaciones de esta Política">
                <p>
                    MiKiwi puede actualizar esta Política de Cookies en cualquier momento. Los cambios se publicarán en esta página.
                </p>
            </LegalSection>

            <LegalSection title="Contacto">
                <p>Para cualquier duda sobre nuestra Política de Cookies, escríbenos a <a href="mailto:hola@mikiwi.com">hola@mikiwi.com</a>.</p>
            </LegalSection>
        </MarketingPageLayout>
    );
}
