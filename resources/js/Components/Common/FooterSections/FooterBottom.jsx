import { Link } from '@inertiajs/react';

export default function FooterBottom() {
    return (
        <div className="mt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
            <p>&copy; 2026 MiKiwi Inc. Todos los derechos reservados.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
                <Link href="/politica-privacidad" className="hover:text-white transition-colors">Política de Privacidad</Link>
                <a href="#" className="hover:text-white transition-colors">Términos de Uso</a>
            </div>
        </div>
    );
}
