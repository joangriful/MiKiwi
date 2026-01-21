export default function Footer() {
    return (
        <footer className="bg-black text-white pt-16 pb-8 border-t border-gray-900">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-start gap-12">
                    {/* Brand Section */}
                    <div className="flex-1 max-w-sm">
                        <img
                            src="/assets/icons/mikiwi_logo.svg"
                            alt="MiKiwi Logo"
                            className="h-12 w-auto mb-6 invert brightness-0"
                        />
                        <p className="text-gray-400 text-sm leading-relaxed mb-6">
                            Llevando la frescura de la naturaleza directamente a tu mesa. Kiwis premium seleccionados para el máximo sabor y nutrición.
                        </p>
                        {/* Social Icons */}
                        <div className="flex gap-4">
                            <a href="#" className="p-2 bg-gray-900 rounded-full hover:bg-gray-800 transition-colors">
                                <img src="/assets/icons/github.svg" alt="GitHub" className="h-5 w-5 invert" />
                            </a>
                            <a href="#" className="p-2 bg-gray-900 rounded-full hover:bg-gray-800 transition-colors">
                                <img src="/assets/icons/linkedin.svg" alt="LinkedIn" className="h-5 w-5 invert" />
                            </a>
                            <a href="#" className="p-2 bg-gray-900 rounded-full hover:bg-gray-800 transition-colors">
                                <img src="/assets/icons/gmail.svg" alt="Gmail" className="h-5 w-5 invert" />
                            </a>
                        </div>
                    </div>

                    {/* Navigation Columns */}
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-16">
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

                <div className="border-t border-gray-900 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
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
