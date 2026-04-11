import { Link } from '@inertiajs/react';
import './FooterBottom.css';

export default function FooterBottom() {
    return (
        <div className="mt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 gap-4">
            <p>&copy; 2026 MiKiwi Inc. Todos los derechos reservados.</p>
            <div className="flex gap-6">
                <Link href={route('privacy.policy')} className="hover:text-white transition-colors">Política de Privacidad</Link>
                <Link href={route('terms.use')} className="hover:text-white transition-colors">Términos de Uso</Link>
            </div>
        </div>
    );
}
