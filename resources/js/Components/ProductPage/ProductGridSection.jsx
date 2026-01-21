export default function ProductGridSection({ title, children }) {
    return (
        <div className="w-full my-8">
            <h2 className="text-xl font-bold mb-4 px-4">{title || 'Section Title'}</h2>
            {children}
        </div>
    );
}
