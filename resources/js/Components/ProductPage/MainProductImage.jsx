export default function MainProductImage({ image }) {
    return (
        <div className="h-full w-full flex items-center justify-center border-r-2 border-dashed border-purple-500 bg-white">
            {image ? (
                <img src={image} alt="Product" className="max-w-full max-h-full object-contain" />
            ) : (
                <span className="material-symbols-outlined text-9xl text-purple-300">image</span>
            )}
        </div>
    );
}
