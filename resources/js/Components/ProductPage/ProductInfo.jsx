export default function ProductInfo() {
    return (
        <div className="h-full w-full flex flex-col p-6 border-dashed border-orange-500 overflow-y-auto">
            <div className="flex justify-between items-start mb-2">
                <h1 className="text-3xl font-bold text-gray-800">Kiwi Premium</h1>
                <span className="material-symbols-outlined text-gray-400 hover:text-red-500 cursor-pointer">favorite</span>
            </div>

            <div className="flex items-center gap-1 mb-4 text-yellow-500">
                <span className="material-symbols-outlined text-sm">star</span>
                <span className="material-symbols-outlined text-sm">star</span>
                <span className="material-symbols-outlined text-sm">star</span>
                <span className="material-symbols-outlined text-sm">star</span>
                <span className="material-symbols-outlined text-sm">star_half</span>
                <span className="text-gray-500 text-sm ml-2">(128 reviews)</span>
            </div>

            <div className="text-2xl font-bold text-gray-900 mb-6">$4.99 <span className="text-sm font-normal text-gray-500">/ pack</span></div>

            <p className="text-gray-600 mb-6 leading-relaxed">
                Frescos, jugosos y llenos de vitamina C. Nuestros kiwis son seleccionados a mano para asegurar la mejor calidad en tu mesa. Perfectos para desayunos saludables.
            </p>

            <div className="mt-auto flex gap-4">
                <div className="flex items-center border border-gray-300 rounded-lg">
                    <button className="px-3 py-2 hover:bg-gray-100">-</button>
                    <span className="w-12 text-center font-medium">1</span>
                    <button className="px-3 py-2 hover:bg-gray-100">+</button>
                </div>
                <button className="flex-1 bg-gray-900 text-white rounded-lg py-3 font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined">shopping_cart</span>
                    Add to Cart
                </button>
            </div>
        </div>
    );
}
