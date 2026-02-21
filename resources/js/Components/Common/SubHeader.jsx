import { Link } from '@inertiajs/react';

export default function SubHeader({ isManager = false, activeManager, setActiveManager, transparent = false, textBlack = false }) {
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

    // Regular Mode: Show Muñecas, Juguetes, Conócete links
    const textColorClass = textBlack ? 'text-black hover:text-gray-800' : (transparent ? 'text-white hover:text-gray-200' : 'text-black hover:text-white');

    return (
        <div className={`${transparent ? 'absolute top-[60px] lg:top-[80px] z-[110] w-full bg-transparent border-none' : 'bg-primary py-1.5 border-b border-black/10'} transition-all duration-300`}>
            <div className={`container mx-auto flex justify-center ${transparent ? 'py-4' : ''}`}>
                <nav>
                    <ul className="flex gap-8 items-center h-full">
                        <li>
                            <Link
                                href="/configurador/wizard"
                                className={`relative block font-bold text-sm lg:text-xl transition-all duration-300 uppercase tracking-wider origin-center hover:scale-110 ${textColorClass}`}
                                data-text="Muñecas"
                            >
                                Muñecas
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/productos"
                                className={`relative block font-bold text-sm lg:text-xl transition-all duration-300 uppercase tracking-wider origin-center hover:scale-110 ${textColorClass}`}
                                data-text="Juguetes"
                            >
                                Juguetes
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/calibracion"
                                className={`relative block font-bold text-sm lg:text-xl transition-all duration-300 uppercase tracking-wider origin-center hover:scale-110 ${textColorClass}`}
                                data-text="Conócete"
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
