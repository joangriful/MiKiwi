import { Link } from '@inertiajs/react';
import LanguageSelector from '../LanguageSelector';

export default function FooterBottom() {
    return (
        <div className="mt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 gap-4">
            <p>&copy; 2026 MiKiwi Inc. Todos los derechos reservados.</p>
            <LanguageSelector />
            <div className="flex gap-6">
                <a href="#" className="hover:text-white transition-colors">Política de Privacidad</a>
                <a href="#" className="hover:text-white transition-colors">Términos de Uso</a>
                <a href="#" className="hover:text-white transition-colors">Mapa del sitio</a>
            </div>
        </div>
    );
}
