export default function ImageCarouselVertical() {
    return (
        <div className="h-full w-24 border-r-2 border-dashed border-green-500 flex flex-col gap-4 items-center justify-center py-4">
            {/* Placeholders for thumbnails */}
            <div className="w-16 h-16 bg-green-200 rounded-xl cursor-pointer hover:opacity-80 transition-opacity flex items-center justify-center text-green-700">
                <span className="material-symbols-outlined text-xl">image</span>
            </div>
            <div className="w-16 h-16 bg-green-200 rounded-xl cursor-pointer hover:opacity-80 transition-opacity flex items-center justify-center text-green-700">
                <span className="material-symbols-outlined text-xl">image</span>
            </div>
            <div className="w-16 h-16 bg-green-200 rounded-xl cursor-pointer hover:opacity-80 transition-opacity flex items-center justify-center text-green-700">
                <span className="material-symbols-outlined text-xl">image</span>
            </div>
            <div className="w-16 h-16 bg-green-200 rounded-xl cursor-pointer hover:opacity-80 transition-opacity flex items-center justify-center text-green-700">
                <span className="material-symbols-outlined text-xl">image</span>
            </div>
        </div>
    );
}
