export default function FooterNewsletter() {
    return (
        <div className="w-full md:w-auto flex flex-col items-end text-right md:pr-12">
            <div className="mb-2">
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
    );
}
