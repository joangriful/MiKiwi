import './MainProductImage.css';
export default function MainProductImage({ image }) {
    return (
        <div className="h-full w-full flex items-center justify-center p-8">
            {image ? (
                <img
                    src={image}
                    alt="Vista detallada del producto"
                    className="max-w-full max-h-full object-contain transition-all duration-700 ease-in-out hover:scale-105"
                />
            ) : (
                <span className="material-symbols-outlined text-9xl text-gray-200">image</span>
            )}
        </div>
    );
}
