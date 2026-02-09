export default function Footer() {
    return (
        <footer className="bg-black text-white pt-16 pb-8 border-t border-gray-900">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-start mb-12">
                    {/* Brand Section - Logo Only */}
                    <div className="flex-1 max-w-sm">
                        <img
                            src="/assets/icons/mikiwi_logo.svg"
                            alt="MiKiwi Logo"
                            className="w-full max-w-[280px] h-auto mb-8 invert brightness-0 opacity-90"
                        />
                    </div>

                    {/* Navigation Columns - Tighter spacing */}
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
                        <div>
                            <h3 className="font-bold text-lg mb-4 text-green-400">Tienda</h3>
                            <ul className="space-y-3 text-sm text-gray-400">
                                <li><a href="#" className="hover:text-white transition-colors">Nuestros Kiwis</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Packs Regalo</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Suscripciones</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Ofertas</a></li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-bold text-lg mb-4 text-green-400">Compañía</h3>
                            <ul className="space-y-3 text-sm text-gray-400">
                                <li><a href="#" className="hover:text-white transition-colors">Sobre Nosotros</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Sostenibilidad</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Contacto</a></li>
                            </ul>
                        </div>

                        <div className="hidden lg:block">
                            <h3 className="font-bold text-lg mb-4 text-green-400">Legal</h3>
                            <ul className="space-y-3 text-sm text-gray-400">
                                <li><a href="#" className="hover:text-white transition-colors">Privacidad</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Términos</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Devoluciones</a></li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Social & Newsletter Row */}
                <div className="flex flex-col md:flex-row justify-between items-end gap-8 pb-12 border-b border-gray-900">
                    {/* Social Icons */}
                    <div className="flex gap-4">
                        <a href="#" className="flex items-center justify-center p-3 rounded-full hover:bg-white transition-all group border border-transparent hover:border-white/50">
                            <img src="/assets/icons/github.svg" alt="GitHub" className="h-6 w-6 invert brightness-0 group-hover:filter-none transition-all" />
                        </a>
                        <a href="#" className="flex items-center justify-center p-3 rounded-full hover:bg-white transition-all group border border-transparent hover:border-white/50">
                            <img src="/assets/icons/linkedin.svg" alt="LinkedIn" className="h-6 w-6 invert brightness-0 group-hover:filter-none transition-all" />
                        </a>
                        <a href="#" className="flex items-center justify-center p-3 rounded-full hover:bg-white transition-all group border border-transparent hover:border-white/50">
                            <img src="/assets/icons/gmail.svg" alt="Gmail" className="h-6 w-6 invert brightness-0 group-hover:filter-none transition-all" />
                        </a>
                    </div>

                    {/* Newsletter Section */}
                    <div className="w-full md:w-auto">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                            <div>
                                <h4 className="text-white font-medium mb-1 text-lg">Únete al círculo exclusivo de MiKiwi</h4>
                                <p className="text-gray-500 text-xs">Recibe ofertas especiales y recetas frescas.</p>
                            </div>
                            <form className="flex gap-2 w-full md:w-auto md:min-w-[350px]">
                                <input
                                    type="email"
                                    placeholder="Tu correo electrónico"
                                    className="bg-zinc-900/50 border border-zinc-800 text-gray-300 text-sm rounded-lg block w-full p-2.5 focus:ring-accent focus:border-accent outline-none transition-colors"
                                />
                                <button type="submit" className="text-white bg-accent hover:opacity-90 focus:ring-4 focus:ring-accent/30 font-medium rounded-lg text-sm px-4 py-2.5 transition-all">
                                    Suscribirse
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
                    <p>&copy; 2026 MiKiwi Inc. Todos los derechos reservados.</p>
                    <div className="flex gap-6 mt-4 md:mt-0">
                        <a href="#" className="hover:text-white transition-colors">Politica de Privacidad</a>
                        <a href="#" className="hover:text-white transition-colors">Términos de Uso</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
