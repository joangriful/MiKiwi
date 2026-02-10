import { Link } from '@inertiajs/react';

export default function SubHeader({ isManager = false, activeManager, setActiveManager }) {
    if (isManager) {
        // Manager Mode: Show Components, Doll Manager, Users, Contenido tabs
        return (
            <div className="bg-primary py-1.5 border-b border-black/10">
                <div className="container mx-auto flex justify-center">
                    <nav>
                        <ul className="flex gap-8">
                            <li>
                                <button
                                    onClick={() => setActiveManager('components')}
                                    className={`text-sm font-medium transition-all uppercase tracking-wider ${activeManager === 'components'
                                        ? 'text-black font-bold'
                                        : 'text-black hover:text-white hover:font-bold'
                                        }`}
                                >
                                    Components
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => setActiveManager('doll')}
                                    className={`text-sm font-medium transition-all uppercase tracking-wider ${activeManager === 'doll'
                                        ? 'text-black font-bold'
                                        : 'text-black hover:text-white hover:font-bold'
                                        }`}
                                >
                                    Doll Manager
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => setActiveManager('users')}
                                    className={`text-sm font-medium transition-all uppercase tracking-wider ${activeManager === 'users'
                                        ? 'text-black font-bold'
                                        : 'text-black hover:text-white hover:font-bold'
                                        }`}
                                >
                                    Users
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => setActiveManager('content')}
                                    className={`text-sm font-medium transition-all uppercase tracking-wider ${activeManager === 'content'
                                        ? 'text-black font-bold'
                                        : 'text-black hover:text-white hover:font-bold'
                                        }`}
                                >
                                    Contenido
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        );
    }

    // Regular Mode: Show Colecciones, Configurador, Resonancia links
    return (
        <div className="bg-primary py-1.5 border-b border-black/10">
            <div className="container mx-auto flex justify-center">
                <nav>
                    <ul className="flex gap-8">
                        <li>
                            <Link
                                href="/configurador/collections"
                                className="relative text-black font-medium text-sm hover:text-white transition-colors uppercase tracking-wider after:content-[attr(data-text)] after:h-0 after:visibility-hidden after:overflow-hidden after:user-select-none after:pointer-events-none after:font-bold after:block"
                                data-text="Colecciones"
                                onMouseEnter={(e) => e.currentTarget.style.fontWeight = 'bold'}
                                onMouseLeave={(e) => e.currentTarget.style.fontWeight = 'medium'}
                            >
                                Colecciones
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/configurador/wizard"
                                className="relative text-black font-medium text-sm hover:text-white transition-colors uppercase tracking-wider after:content-[attr(data-text)] after:h-0 after:visibility-hidden after:overflow-hidden after:user-select-none after:pointer-events-none after:font-bold after:block"
                                data-text="Configurador"
                                onMouseEnter={(e) => e.currentTarget.style.fontWeight = 'bold'}
                                onMouseLeave={(e) => e.currentTarget.style.fontWeight = 'medium'}
                            >
                                Configurador
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/calibracion"
                                className="relative text-black font-medium text-sm hover:text-white transition-colors uppercase tracking-wider after:content-[attr(data-text)] after:h-0 after:visibility-hidden after:overflow-hidden after:user-select-none after:pointer-events-none after:font-bold after:block"
                                data-text="Resonancia"
                                onMouseEnter={(e) => e.currentTarget.style.fontWeight = 'bold'}
                                onMouseLeave={(e) => e.currentTarget.style.fontWeight = 'medium'}
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
