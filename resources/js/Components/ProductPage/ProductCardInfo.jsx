export default function ProductCardInfo() {
    return (
        <div className="p-4">
            <div className="font-bold text-gray-900 mb-1">Kiwi Pack</div>
            <div className="text-yellow-400 flex text-xs mb-2">
                <span className="material-symbols-outlined text-[16px] fill-current">star</span>
                <span className="material-symbols-outlined text-[16px] fill-current">star</span>
                <span className="material-symbols-outlined text-[16px] fill-current">star</span>
                <span className="material-symbols-outlined text-[16px] fill-current">star</span>
                <span className="material-symbols-outlined text-[16px] fill-current">star</span>
            </div>
            <div className="flex justify-between items-center">
                <span className="font-bold text-lg text-gray-900">$4.99</span>
                <button className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full transition-colors flex items-center justify-center">
                    <span className="material-symbols-outlined text-[16px]">add_shopping_cart</span>
                </button>
            </div>
        </div>
    );
}
