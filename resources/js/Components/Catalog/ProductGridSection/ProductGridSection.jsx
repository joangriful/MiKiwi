import styles from './ProductGridSection.module.css';

export default function ProductGridSection({ title, children }) {
    return (
        <div className={`${styles.root} w-full my-8`}>
            <h2 className="text-3xl font-bold mb-6 px-4 text-gray-800">{title || 'Section Title'}</h2>
            {children}
        </div>
    );
}
