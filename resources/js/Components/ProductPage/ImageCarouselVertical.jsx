export default function ImageCarouselVertical({ images = [], selectedImage, onSelectImage }) {
    return (
        <div className="h-full w-24 flex flex-col gap-4 items-center justify-center py-4">
            {images.map((img, index) => (
                <div
                    key={index}
                    onClick={() => onSelectImage(img)}
                    className={`w-16 h-16 rounded-xl cursor-pointer transition-all flex items-center justify-center overflow-hidden border-2 
                        ${selectedImage === img ? 'border-[#99b849] opacity-100 ring-2 ring-[#99b849]/30' : 'border-transparent opacity-60 hover:opacity-100 hover:border-gray-200'}
                    `}
                >
                    <img
                        src={img}
                        alt={`Thumbnail ${index}`}
                        className="w-full h-full object-cover"
                    />
                </div>
            ))}
        </div>
    );
}
