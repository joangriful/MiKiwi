import React, { useState } from 'react';
import UploadProduct from '../UploadProduct/UploadProduct';
import ProductsList from '../ProductsList/ProductsList';
import FeaturedProductsManager from '../FeaturedProductsManager/FeaturedProductsManager';
import styles from './ProductsManager.module.css';

const PRODUCT_SECTIONS = [
    { id: 'upload', label: 'Subir Producto', icon: 'upload' },
    { id: 'list', label: 'Lista de Productos', icon: 'list' },
    { id: 'featured', label: 'Productos Destacados', icon: 'star' },
];

export default function ProductsManager({ categories, products, debugCount }) {
    const [activeSection, setActiveSection] = useState('list');
    const [editingProduct, setEditingProduct] = useState(null);

    const handleEdit = (product) => {
        setEditingProduct(product);
        setActiveSection('upload');
    };

    const handleTabChange = (sectionId) => {
        if (sectionId === 'upload') {
            setEditingProduct(null);
        }
        setActiveSection(sectionId);
    };

    return (
        <div className={styles.layout}>
            <aside className={styles.sidebar}>
                <div className={styles.sidebarHeader}>
                    <h2 className={styles.sidebarTitle}>
                        Gestión de Productos
                    </h2>
                </div>
                <nav className={styles.sidebarNav}>
                    {PRODUCT_SECTIONS.map((section) => (
                        <button
                            key={section.id}
                            type="button"
                            onClick={() => handleTabChange(section.id)}
                            className={`${styles.navButton} ${activeSection === section.id ? styles.navButtonActive : ''}`}
                        >
                            <span className={`material-symbols-outlined ${styles.navButtonIcon}`}>{section.icon}</span>
                            {section.label}
                        </button>
                    ))}
                </nav>
            </aside>

            <main className={styles.content}>
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
