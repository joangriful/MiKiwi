import React from 'react';
import LegalSection from '@/Components/Marketing/LegalSection/LegalSection';
import MarketingPageLayout from '@/Components/Marketing/MarketingPageLayout/MarketingPageLayout';

export default function TermsOfContract() {
    return (
        <MarketingPageLayout title="Condiciones de Contratación" updatedAt="Febrero 2026" maxWidth="narrow">
            <LegalSection title="Partes del Contrato">
                <p>Las presentes Condiciones regulan el contrato de compraventa a distancia celebrado entre:</p>
                <ul>
                    <li><strong>Vendedor:</strong> MiKiwi, con domicilio en Pago Valdeconejos, s/n, 11550 Chipiona, Cádiz, España.</li>
                    <li><strong>Comprador:</strong> persona física mayor de 18 años que realiza un pedido a través del Sitio Web.</li>
                </ul>
            </LegalSection>

            <LegalSection title="Proceso de Compra">
                <p>El proceso de contratación en www.mikiwi.com sigue estos pasos:</p>
                <ol>
                    <li>Selección de productos y adición al carrito.</li>
                    <li>Revisión del carrito y acceso al proceso de pago.</li>
                    <li>Introducción de datos de envío y facturación.</li>
                    <li>Selección del método de pago y confirmación del pedido.</li>
                    <li>Recepción de confirmación de pedido por correo electrónico.</li>
                </ol>
                <p>Al confirmar el pedido, el Cliente declara haber leído y aceptado estas Condiciones de Contratación.</p>
            </LegalSection>

            <LegalSection title="Precios y Pagos">
                <p>Los precios incluyen IVA aplicable y están expresados en euros (€), salvo indicación contraria.</p>
                <p>Los métodos de pago aceptados son:</p>
                <ul>
                    <li>Tarjeta de crédito/débito.</li>
                    <li>PayPal.</li>
                    <li>Bizum.</li>
                    <li>Transferencia bancaria.</li>
                </ul>
                <p>MiKiwi se reserva el derecho de modificar precios. Los cambios no afectarán a pedidos ya confirmados.</p>
            </LegalSection>

            <LegalSection title="Disponibilidad y Plazos de Envío">
                <p>Si un producto no está disponible tras el pedido, MiKiwi informará en 24 horas y reembolsará el importe pagado.</p>
                <ul>
                    <li><strong>España peninsular:</strong> 24 a 48 horas laborables.</li>
                    <li><strong>Islas Baleares y Canarias:</strong> 3 a 5 días laborables.</li>
                    <li><strong>Portugal:</strong> 3 a 5 días laborables.</li>
                    <li><strong>Europa:</strong> 5 a 10 días laborables.</li>
                </ul>
                <p>Todos los envíos se realizan de forma discreta.</p>
            </LegalSection>

            <LegalSection title="Derecho de Desistimiento">
                <p>El Cliente tiene derecho a desistir del contrato en un plazo de <strong>14 días naturales</strong> desde la recepción.</p>
                <p>Para ejercerlo, debe contactar con MiKiwi. Los gastos de devolución corren a cargo del cliente salvo producto defectuoso o incorrecto.</p>
                <p><strong>Quedan excluidos</strong> productos que por higiene y salud hayan sido desprecintados o utilizados.</p>
            </LegalSection>

            <LegalSection title="Garantías y Devoluciones">
                <p>Todos los productos tienen garantía legal de conformidad durante <strong>3 años</strong> desde la entrega.</p>
                <p>Si recibes un producto defectuoso o incorrecto, contacta en un plazo máximo de <strong>30 días</strong> desde la recepción.</p>
            </LegalSection>

            <LegalSection title="Resolución de Litigios en Línea">
                <p>
                    La Comisión Europea ofrece la Plataforma de Resolución de Litigios en Línea:{' '}
                    <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer">ec.europa.eu/consumers/odr</a>.
                </p>
            </LegalSection>

            <LegalSection title="Ley Aplicable">
                <p>
                    Estas Condiciones se rigen por la legislación española. Las disputas se someterán a los Juzgados y Tribunales
                    de Cádiz, sin perjuicio de la normativa aplicable a consumidores y usuarios.
                </p>
            </LegalSection>
        </MarketingPageLayout>
    );
}
