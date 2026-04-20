import React from 'react';
import { Head, Link } from '@inertiajs/react';
import Header from '@/Components/Header/Header';
import Footer from '@/Components/Footer/Footer';

const Section = ({ title, children }) => (
    <section className="mb-10">
        <h2 className="text-base font-bold text-gray-900 uppercase tracking-widest mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
            <span className="text-secondary-dark">·</span> {title}
        </h2>
        <div className="text-gray-600 text-sm leading-relaxed space-y-3">{children}</div>
    </section>
);

export default function TermsOfContract() {
    return (
        <div className="min-h-screen flex flex-col bg-white font-sans text-gray-800">
            <Head title="Condiciones de Contratación - MiKiwi" />
            <Header />

            <main className="flex-grow container mx-auto px-6 py-12 md:py-16 max-w-3xl">
                {/* Breadcrumb */}
                <nav className="text-xs text-gray-400 mb-8 flex items-center gap-2">
                    <Link href={route('home')} className="hover:text-secondary-dark transition-colors">Inicio</Link>
                    <span>/</span>
                    <span className="text-gray-700">Condiciones de Contratación</span>
                </nav>

                <h1 className="text-3xl font-bold mb-2 font-head uppercase tracking-tight text-secondary-dark">
                    Condiciones de Contratación
                </h1>
                <p className="text-xs text-gray-400 mb-10">Última actualización: Febrero 2026</p>

                <Section title="Partes del Contrato">
                    <p>
                        Las presentes Condiciones regulan el contrato de compraventa a distancia celebrado entre:
                    </p>
                    <ul className="mt-2 space-y-1">
                        <li><strong>Vendedor:</strong> MiKiwi, con domicilio en Pago Valdeconejos, s/n, 11550 Chipiona, Cádiz, España.</li>
                        <li><strong>Comprador:</strong> persona física mayor de 18 años que realiza un pedido a través del Sitio Web.</li>
                    </ul>
                </Section>

                <Section title="Proceso de Compra">
                    <p>El proceso de contratación en www.mikiwi.com sigue los siguientes pasos:</p>
                    <ol className="list-decimal pl-5 space-y-2 mt-2">
                        <li>Selección de productos y adición al carrito.</li>
                        <li>Revisión del carrito y acceso al proceso de pago.</li>
                        <li>Introducción de datos de envío y facturación.</li>
                        <li>Selección del método de pago y confirmación del pedido.</li>
                        <li>Recepción de confirmación de pedido por correo electrónico.</li>
                    </ol>
                    <p>
                        Al confirmar el pedido, el Cliente declara haber leído y aceptado estas Condiciones de Contratación.
                    </p>
                </Section>

                <Section title="Precios y Pagos">
                    <p>
                        Los precios indicados en el Sitio Web incluyen el Impuesto sobre el Valor Añadido (IVA) aplicable y están
                        expresados en euros (€), salvo indicación contraria.
                    </p>
                    <p>Los métodos de pago aceptados son:</p>
                    <ul className="list-disc pl-5 space-y-1 mt-2">
                        <li>Tarjeta de crédito/débito (Visa, Mastercard, American Express).</li>
                        <li>PayPal.</li>
                        <li>Bizum.</li>
                        <li>Transferencia bancaria (el pedido se procesará tras la confirmación del pago).</li>
                    </ul>
                    <p>
                        MiKiwi se reserva el derecho de modificar los precios en cualquier momento. Los cambios no afectarán
                        a los pedidos ya confirmados.
                    </p>
                </Section>

                <Section title="Disponibilidad y Plazos de Envío">
                    <p>
                        La disponibilidad de cada producto se indica en su ficha de producto. En caso de que un producto no esté
                        disponible después de haber realizado el pedido, MiKiwi te informará en el plazo máximo de 24 horas y
                        procederá al reembolso íntegro del importe pagado.
                    </p>
                    <p>
                        Los plazos de envío habituales son:
                    </p>
                    <ul className="list-disc pl-5 space-y-1 mt-2">
                        <li><strong>España peninsular:</strong> 24 a 48 horas laborables.</li>
                        <li><strong>Islas Baleares y Canarias:</strong> 3 a 5 días laborables.</li>
                        <li><strong>Portugal:</strong> 3 a 5 días laborables.</li>
                        <li><strong>Europa:</strong> 5 a 10 días laborables.</li>
                    </ul>
                    <p>
                        Todos nuestros envíos se realizan de forma <strong>discreta</strong>, sin indicación del contenido del paquete
                        en el exterior del mismo.
                    </p>
                </Section>

                <Section title="Derecho de Desistimiento">
                    <p>
                        De conformidad con la normativa vigente (Real Decreto Legislativo 1/2007), el Cliente tiene derecho a desistir
                        del contrato en un plazo de <strong>14 días naturales</strong> desde la recepción del pedido, sin necesidad
                        de indicar el motivo.
                    </p>
                    <p>
                        Para ejercer el derecho de desistimiento, deberás informarnos a través de nuestro formulario de contacto
                        o enviando un correo a hola@mikiwi.com. Los gastos de devolución correrán a cargo del cliente, salvo que
                        el producto llegue en mal estado o sea incorrecto.
                    </p>
                    <p>
                        <strong>Quedan excluidos del derecho de desistimiento</strong> los productos que, por razones de higiene y
                        salud, hayan sido desprecintados o utilizados después de su entrega.
                    </p>
                </Section>

                <Section title="Garantías y Devoluciones">
                    <p>
                        Todos los productos vendidos en MiKiwi disponen de garantía legal de conformidad durante <strong>3 años</strong>
                        desde la entrega, conforme al Real Decreto Legislativo 1/2007 y su modificación por el RDL 7/2021.
                    </p>
                    <p>
                        En caso de recibir un producto defectuoso o que no se corresponda con el pedido, ponte en contacto con
                        nosotros en un plazo máximo de <strong>30 días</strong> desde la recepción. Gestionaremos la devolución
                        o sustitución sin coste adicional.
                    </p>
                </Section>

                <Section title="Resolución de Litigios en Línea">
                    <p>
                        La Comisión Europea pone a disposición de los consumidores la Plataforma de Resolución de Litigios en Línea
                        (ODR), a la que puede acceder en:{' '}
                        <a
                            href="https://ec.europa.eu/consumers/odr"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-secondary-dark font-medium hover:underline"
                        >
                            ec.europa.eu/consumers/odr
                        </a>.
                    </p>
                </Section>

                <Section title="Ley Aplicable">
                    <p>
                        Las presentes Condiciones de Contratación se rigen por la legislación española. Las disputas que no puedan
                        resolverse de mutuo acuerdo se someterán a los Juzgados y Tribunales de Cádiz, sin perjuicio de la normativa
                        aplicable a consumidores y usuarios.
                    </p>
                </Section>
            </main>

            <Footer />
        </div>
    );
}
