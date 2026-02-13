import { Link } from '@inertiajs/react';

export default function FooterLinks() {
    return (
        <div className="grid grid-cols-3 gap-6 lg:gap-8">
            <div>
                <h3 className="font-bold text-base mb-3 text-green-400">Tienda</h3>
                <ul className="space-y-2 text-xs text-gray-400">
                    <li><a href="#" className="hover:text-white transition-colors">Nuestros Kiwis</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Packs Regalo</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Suscripciones</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Ofertas</a></li>
                </ul>
            </div>

            <div>
                <h3 className="font-bold text-base mb-3 text-green-400">Compañía</h3>
                <ul className="space-y-2 text-xs text-gray-400">
                    <li><Link href="/sobre-nosotros" className="hover:text-white transition-colors">Sobre Nosotros</Link></li>
                    <li><a href="#" className="hover:text-white transition-colors">Sostenibilidad</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Contacto</a></li>
                </ul>
            </div>

            <div>
                <h3 className="font-bold text-base mb-3 text-green-400">Legal</h3>
                <ul className="space-y-2 text-xs text-gray-400">
                    <li><a href="#" className="hover:text-white transition-colors">Aviso Legal</a></li>
                    <li><Link href="/politica-cookies" className="hover:text-white transition-colors">Política de Cookies</Link></li>
                    <li><a href="#" className="hover:text-white transition-colors">Condiciones de Contratación</a></li>
                    <li><Link href="/formulario-reclamaciones" className="hover:text-white transition-colors">Formulario de Reclamaciones</Link></li>
                </ul>
            </div>
        </div>
    );
}
