export default function Header() {
    return (
        <div className="flex items-center justify-between px-4 border-2 border-dashed border-blue-500 bg-blue-50 h-16">
            <button className="p-2 rounded-full hover:bg-blue-100 transition-colors">
                <span className="material-symbols-outlined text-blue-700">menu</span>
            </button>

            <span className="material-symbols-outlined text-3xl text-blue-700">local_florist</span>

            <div className="flex gap-2">
                <button className="p-2 rounded-full hover:bg-blue-100 transition-colors">
                    <span className="material-symbols-outlined text-blue-700">search</span>
                </button>
                <button className="p-2 rounded-full hover:bg-blue-100 transition-colors">
                    <span className="material-symbols-outlined text-blue-700">shopping_bag</span>
                </button>
            </div>
        </div>
    );
}
