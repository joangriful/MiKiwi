import { Link } from '@inertiajs/react';

export default function SubHeader() {
    return (
        <div className="bg-primary py-1.5 border-b border-black/10">
            <div className="container mx-auto flex justify-center">
                <nav>
                    <ul className="flex gap-8">
                        <li>
                            <Link
                                href="/configurador/collections"
                                className="text-black font-medium text-sm hover:text-opacity-70 transition-opacity uppercase tracking-wider"
                            >
                                Colecciones
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/configurador/wizard"
                                className="text-black font-medium text-sm hover:text-opacity-70 transition-opacity uppercase tracking-wider"
                            >
                                Configurador
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/calibracion"
                                className="text-black font-medium text-sm hover:text-opacity-70 transition-opacity uppercase tracking-wider"
                            >
                                Resonancia
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
}
