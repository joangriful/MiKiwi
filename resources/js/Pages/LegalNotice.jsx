import React from 'react';
import { Head } from '@inertiajs/react';
import Header from '@/Components/Common/Header';
import Footer from '@/Components/Common/Footer';

export default function LegalNotice() {
    return (
        <div className="min-h-screen flex flex-col bg-white text-gray-900 font-sans">
            <Head title="Aviso Legal - MiKiwi" />

            <Header />

            <main className="flex-grow container mx-auto px-6 py-12 max-w-4xl">
                <div className="prose prose-lg max-w-none">
                    <h1 className="text-3xl font-bold mb-8 text-gray-900 border-b pb-4 flex items-center gap-3">
                        <img src="/assets/icons/legal.svg" alt="Legal" className="w-8 h-8" />
                        Aviso Legal
                    </h1>

                    <section className="mb-8">
                        <h2 className="text-xl font-bold mb-4 text-gray-800">1. Datos Identificativos</h2>
                        <p className="text-gray-600 mb-4">
                            En cumplimiento con el deber de información recogido en el artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y del Comercio Electrónico (LSSI-CE), a continuación se reflejan los siguientes datos:
                        </p>
                        <ul className="list-none pl-0 space-y-2 text-gray-600">
                            <li><strong>Titular del sitio web:</strong> Mikiwi</li>
                            <li><strong>Domicilio fiscal:</strong> Pago Valdeconejos, s/n, 11550 Chipiona, Cádiz, España</li>
                            <li><strong>Actividad:</strong> Comercio electrónico de productos de bienestar</li>
                            <li><strong>Correo electrónico de contacto:</strong> hola@mikiwi.com (Ejemplo)</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-bold mb-4 text-gray-800">2. Propiedad Intelectual e Industrial</h2>
                        <p className="text-gray-600">
                            Todos los contenidos del sitio web (incluyendo, sin carácter limitativo, bases de datos, imágenes y fotografías, dibujos, gráficos y archivos de texto) son propiedad de Mikiwi o de los proveedores de contenidos, habiendo sido, en este último caso, objeto de licencia o cesión por parte de los mismos, y están protegidos por las normas nacionales o internacionales de propiedad intelectual. La recopilación, diseño, ordenación y montaje de todo el contenido del sitio web es propiedad exclusiva de Mikiwi y se encuentra protegida por las normas nacionales e internacionales de propiedad industrial e intelectual.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-bold mb-4 text-gray-800">3. Condiciones de Uso del Portal</h2>
                        <p className="text-gray-600">
                            El acceso y/o uso de este portal de Mikiwi atribuye la condición de USUARIO, que acepta, desde dicho acceso y/o uso, las Condiciones Generales de Uso aquí reflejadas. Las citadas Condiciones serán de aplicación independientemente de las Condiciones Generales de Contratación que en su caso resulten de obligado cumplimiento.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-bold mb-4 text-gray-800">4. Protección de Datos</h2>
                        <p className="text-gray-600">
                            Mikiwi cumple con las directrices de la normativa vigente en materia de protección de datos personales, el Reglamento (UE) 2016/679 de 27 de abril de 2016 (RGPD), relativo a la protección de las personas físicas en cuanto al tratamiento de datos personales y a la libre circulación de estos datos. Para más información, puede consultar nuestra <a href="/politica-privacidad" className="text-blue-600 hover:underline">Política de Privacidad</a>.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-bold mb-4 text-gray-800">5. Ley Aplicable y Jurisdicción</h2>
                        <p className="text-gray-600">
                            La relación entre Mikiwi y el USUARIO se regirá por la normativa española vigente y cualquier controversia se someterá a los Juzgados y tribunales de la ciudad de Cádiz, salvo que la Ley aplicable disponga otra cosa.
                        </p>
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
}
