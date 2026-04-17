import styles from './ProductImagePlaceholder.module.css';

export default function ProductImagePlaceholder() {
    return (
        <div className={`${styles.root} w-full h-[381px] bg-gray-100 flex items-center justify-center text-gray-300 shrink-0`}>
            <span className="material-symbols-outlined text-5xl">image</span>
        </div>
    );
}
