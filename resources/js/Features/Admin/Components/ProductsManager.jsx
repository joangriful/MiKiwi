import React, { useState } from 'react';
import UploadProduct from './UploadProduct';
import ProductsList from './ProductsList';
import FeaturedProductsManager from './FeaturedProductsManager';

export default function ProductsManager({ categories, products, debugCount }) {
    console.log('ProductsManager received products:', products, 'DebugCount:', debugCount);
    const [activeSection, setActiveSection] = useState('list');
    const [editingProduct, setEditingProduct] = useState(null);

    const sections = [
        { id: 'upload', label: 'Subir Producto', icon: 'upload' },
        { id: 'list', label: 'Lista de Productos', icon: 'list' },
        { id: 'featured', label: 'Productos Destacados', icon: 'star' },
    ];

    const handleEdit = (product) => {
        setEditingProduct(product);
        setActiveSection('upload');
    };

    const handleTabChange = (sectionId) => {
        if (sectionId === 'upload') {
            setEditingProduct(null); // Reset if going to "New Product"
        }
        setActiveSection(sectionId);
    };

    return (
        <div className="flex flex-1 overflow-hidden h-full relative">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col shrink-0">
                <div className="p-4 border-b border-gray-200">
                    <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Gestión de Productos
                    </h2>
                </div>
                <nav className="flex-1 overflow-y-auto p-2 space-y-1">
                    {sections.map(section => (
                        <button
                            key={section.id}
                            onClick={() => handleTabChange(section.id)}
                            className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${activeSection === section.id
                                ? 'bg-blue-50 text-blue-700'
                                : 'text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            <span className="material-symbols-outlined text-base">{section.icon}</span>
                            {section.label}
                        </button>
                    ))}
                </nav>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 bg-white overflow-hidden relative">
                {activeSection === 'upload' && (
                    <UploadProduct
                        categories={categories}
                        initialData={editingProduct}
                        onCancel={() => setActiveSection('list')}
                    />
                )}
                {activeSection === 'list' && (
                    <ProductsList products={products} onEdit={handleEdit} debugCount={debugCount} />
                )}
                {activeSection === 'featured' && (
                    <FeaturedProductsManager products={products} />
                )}
            </main>
        </div>
    );
}
