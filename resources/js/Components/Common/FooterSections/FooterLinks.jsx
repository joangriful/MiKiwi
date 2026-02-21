import { Link } from '@inertiajs/react';

export default function FooterLinks() {
    return (
        <div className="grid grid-cols-3 gap-6 lg:gap-8">
            <div>
                <h3 className="font-bold text-base mb-3 text-green-400">Tienda</h3>
                <ul className="space-y-2 text-xs text-gray-400">
                    <li><Link href="/nuestros-kiwis" className="hover:text-white transition-colors">Nuestros Kiwis</Link></li>
                    <li><Link href="/packs-regalo" className="hover:text-white transition-colors">Packs Regalo</Link></li>
                    <li><Link href="/suscripciones" className="hover:text-white transition-colors">Suscripciones</Link></li>
                    <li><Link href="/ofertas" className="hover:text-white transition-colors">Ofertas</Link></li>
                    <li><Link href="/compania" className="hover:text-white transition-colors">Compañía</Link></li>
                </ul>
            </div>

            <div>
                <h3 className="font-bold text-base mb-3 text-green-400">Sobre Nosotros</h3>
                <ul className="space-y-2 text-xs text-gray-400">
                    <li><Link href="/sobre-nosotros" className="hover:text-white transition-colors">Sobre Nosotros</Link></li>
                    <li><Link href="/sostenibilidad" className="hover:text-white transition-colors">Sostenibilidad</Link></li>
                    <li><Link href="/preguntas-frecuentes" className="hover:text-white transition-colors">Preguntas frecuentes</Link></li>
                    <li><Link href="/contacto" className="hover:text-white transition-colors">Contacto</Link></li>
                </ul>
            </div>

            <div>
                <h3 className="font-bold text-base mb-3 text-green-400">Legal</h3>
                <ul className="space-y-2 text-xs text-gray-400">
                    <li><Link href="/aviso-legal" className="hover:text-white transition-colors">Aviso Legal</Link></li>
                    <li><Link href="/politica-privacidad" className="hover:text-white transition-colors">Política de Privacidad</Link></li>
                    <li><Link href="/terminos-uso" className="hover:text-white transition-colors">Términos de Uso</Link></li>
                    <li><Link href="/politica-cookies" className="hover:text-white transition-colors">Política de Cookies</Link></li>
                    <li><Link href="/condiciones-contratacion" className="hover:text-white transition-colors">Condiciones de Contratación</Link></li>
                    <li><Link href="/formulario-reclamaciones" className="hover:text-white transition-colors">Formulario de Reclamaciones</Link></li>
                </ul>
            </div>
        </div>
    );
}
