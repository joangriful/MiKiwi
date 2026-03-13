import { Link } from '@inertiajs/react';
import './FooterLinks.css';

export default function FooterLinks() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12 w-full">
            <div>
                <h3 className="font-bold text-lg mb-4 text-[#d697c8]">Tienda</h3>
                <ul className="space-y-3 text-sm text-gray-400">
                    <li><Link href={route('products.index')} className="hover:text-white transition-colors">Mis productos</Link></li>
                    <li><Link href={route('doll.config.test')} className="hover:text-white transition-colors">Personalizar muñecas</Link></li>
                </ul>
            </div>

            <div>
                <h3 className="font-bold text-lg mb-4 text-[#d697c8]">Sobre Nosotros</h3>
                <ul className="space-y-3 text-sm text-gray-400">
                    <li><Link href={route('about-us')} className="hover:text-white transition-colors">Sobre Nosotros</Link></li>
                    <li><Link href={route('sustainability')} className="hover:text-white transition-colors">Sostenibilidad</Link></li>
                    <li><Link href={route('faq')} className="hover:text-white transition-colors">Preguntas frecuentes</Link></li>
                    <li><Link href={route('contacto')} className="hover:text-white transition-colors">Contacto</Link></li>
                </ul>
            </div>

            <div>
                <h3 className="font-bold text-lg mb-4 text-[#d697c8]">Legal</h3>
                <ul className="space-y-3 text-sm text-gray-400">
                    <li><Link href={route('legal.notice')} className="hover:text-white transition-colors">Aviso Legal</Link></li>
                    <li><Link href={route('privacy.policy')} className="hover:text-white transition-colors">Política de Privacidad</Link></li>
                    <li><Link href={route('terms.use')} className="hover:text-white transition-colors">Términos de Uso</Link></li>
                    <li><Link href={route('cookie.policy')} className="hover:text-white transition-colors">Política de Cookies</Link></li>
                    <li><Link href={route('terms.contract')} className="hover:text-white transition-colors">Condiciones de Contratación</Link></li>
                    <li><Link href={route('claims.form')} className="hover:text-white transition-colors">Formulario de Reclamaciones</Link></li>
                </ul>
            </div>
        </div>
    );
}
