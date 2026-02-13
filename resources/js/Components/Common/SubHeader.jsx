import { Link } from '@inertiajs/react';

export default function SubHeader({ isManager = false, activeManager, setActiveManager, transparent = false }) {
    if (isManager) {
        // Manager Mode: Show Components, Doll Manager, Users, Media, Productos tabs
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
                                    Media
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => setActiveManager('products')}
                                    className={`text-sm font-medium transition-all uppercase tracking-wider ${activeManager === 'products'
                                        ? 'text-black font-bold'
                                        : 'text-black hover:text-white hover:font-bold'
                                        }`}
                                >
                                    Productos
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        );
    }

    // Regular Mode: Show Juguetes, Muñecas, Conócete links
    return (
        <div className={`${transparent ? 'absolute top-[60px] z-20 w-full bg-transparent border-none' : 'bg-primary py-1.5 border-b border-black/10'}`}>
            <div className={`container mx-auto flex justify-center ${transparent ? 'py-4' : ''}`}>
                <nav>
                    <ul className="flex gap-8">
                        <li>
                            <Link
                                href="/productos"
                                className={`relative font-medium text-sm transition-colors uppercase tracking-wider after:content-[attr(data-text)] after:h-0 after:visibility-hidden after:overflow-hidden after:user-select-none after:pointer-events-none after:font-bold after:block ${transparent ? 'text-white hover:text-gray-200' : 'text-black hover:text-white'}`}
                                data-text="Juguetes"
                                onMouseEnter={(e) => e.currentTarget.style.fontWeight = 'bold'}
                                onMouseLeave={(e) => e.currentTarget.style.fontWeight = 'medium'}
                            >
                                Juguetes
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/configurador/wizard"
                                className={`relative font-medium text-sm transition-colors uppercase tracking-wider after:content-[attr(data-text)] after:h-0 after:visibility-hidden after:overflow-hidden after:user-select-none after:pointer-events-none after:font-bold after:block ${transparent ? 'text-white hover:text-gray-200' : 'text-black hover:text-white'}`}
                                data-text="Muñecas"
                                onMouseEnter={(e) => e.currentTarget.style.fontWeight = 'bold'}
                                onMouseLeave={(e) => e.currentTarget.style.fontWeight = 'medium'}
                            >
                                Muñecas
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/calibracion"
                                className={`relative font-medium text-sm transition-colors uppercase tracking-wider after:content-[attr(data-text)] after:h-0 after:visibility-hidden after:overflow-hidden after:user-select-none after:pointer-events-none after:font-bold after:block ${transparent ? 'text-white hover:text-gray-200' : 'text-black hover:text-white'}`}
                                data-text="Conócete"
                                onMouseEnter={(e) => e.currentTarget.style.fontWeight = 'bold'}
                                onMouseLeave={(e) => e.currentTarget.style.fontWeight = 'medium'}
                            >
                                Conócete
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
}
