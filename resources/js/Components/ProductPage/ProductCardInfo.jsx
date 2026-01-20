export default function ProductCardInfo() {
    return (
        <div className="border border-dashed border-yellow-500 bg-yellow-50 p-2">
            <div className="font-bold text-sm mb-1">Kiwi Pack</div>
            <div className="text-yellow-500 flex text-xs mb-1">
                <span className="material-symbols-outlined text-[14px]">star</span>
                <span className="material-symbols-outlined text-[14px]">star</span>
                <span className="material-symbols-outlined text-[14px]">star</span>
                <span className="material-symbols-outlined text-[14px]">star</span>
                <span className="material-symbols-outlined text-[14px]">star</span>
            </div>
            <div className="font-bold text-gray-800">$4.99</div>
        </div>
    );
}
