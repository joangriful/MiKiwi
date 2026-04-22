import React from 'react';
import LegalSection from '@/Components/Marketing/LegalSection/LegalSection';
import MarketingPageLayout from '@/Components/Marketing/MarketingPageLayout/MarketingPageLayout';

export default function TermsOfUse() {
    return (
        <MarketingPageLayout title="Términos de Uso" updatedAt="Febrero 2026" maxWidth="narrow">
            <LegalSection title="Aceptación de los Términos">
                <p>
                    El acceso y uso de www.mikiwi.com atribuye la condición de usuario y supone la aceptación de estos Términos
                    de Uso, así como del Aviso Legal y la Política de Privacidad.
                </p>
                <p>Si no estás de acuerdo con algún término, abstente de utilizar el Sitio Web.</p>
            </LegalSection>

            <LegalSection title="Edad Mínima de Acceso">
                <p>
                    El Sitio Web comercializa artículos de bienestar íntimo destinados exclusivamente a personas
                    <strong> mayores de 18 años</strong>.
                </p>
                <p>MiKiwi puede solicitar documentación acreditativa de edad y cancelar pedidos que incumplan este requisito.</p>
            </LegalSection>

            <LegalSection title="Registro de Usuario">
                <p>Para realizar compras es necesario registrarse. Al hacerlo, te comprometes a:</p>
                <ul>
                    <li>Proporcionar información veraz, actual y completa.</li>
                    <li>Mantener la confidencialidad de tu contraseña.</li>
                    <li>Notificar cualquier uso no autorizado de tu cuenta.</li>
                    <li>Actualizar tus datos cuando sea necesario.</li>
                </ul>
            </LegalSection>

            <LegalSection title="Uso Aceptable del Sitio Web">
                <p>Está prohibido:</p>
                <ul>
                    <li>Utilizar el Sitio Web con fines ilegales.</li>
                    <li>Introducir contenidos falsos, engañosos, ofensivos o discriminatorios.</li>
                    <li>Suplantar la identidad de otros usuarios, de MiKiwi o de terceros.</li>
                    <li>Realizar scraping, spam o conductas que afecten al rendimiento del servidor.</li>
                    <li>Intentar acceder sin autorización a cuentas, sistemas o redes.</li>
                </ul>
            </LegalSection>

            <LegalSection title="Propiedad Intelectual">
                <p>
                    Todos los contenidos del Sitio Web son propiedad de MiKiwi o de terceros que han cedido su uso. Queda prohibida
                    su reproducción, distribución o comunicación pública sin autorización expresa.
                </p>
            </LegalSection>

            <LegalSection title="Limitación de Responsabilidad">
                <p>MiKiwi no garantiza que el Sitio Web esté libre de errores, virus o elementos perjudiciales.</p>
                <p>La información publicada tiene carácter informativo y puede estar sujeta a cambios sin previo aviso.</p>
            </LegalSection>

            <LegalSection title="Modificaciones de los Términos">
                <p>
                    MiKiwi puede modificar estos Términos de Uso. Las modificaciones entrarán en vigor desde su publicación.
                </p>
            </LegalSection>

            <LegalSection title="Ley Aplicable y Jurisdicción">
                <p>
                    Estos Términos se rigen por la legislación española. Las partes se someten a la jurisdicción de los Juzgados
                    y Tribunales de Cádiz, sin perjuicio de la normativa de consumidores y usuarios.
                </p>
            </LegalSection>
        </MarketingPageLayout>
    );
}
