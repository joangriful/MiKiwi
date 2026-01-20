export default function ProductGridSection({ title, children }) {
    return (
        <div className="border-2 border-dashed border-indigo-500 bg-indigo-50 p-4 my-8">
            <h2 className="text-xl font-bold mb-4">{title || 'Section Title'}</h2>
            {children}
        </div>
    );
}
