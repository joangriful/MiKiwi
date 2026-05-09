import React from 'react';
import PreviewContainer from '../PreviewContainer/PreviewContainer';
import styles from './PagesGridView.module.css';

const PRODUCTS_PAGE_DEMO_PROPS = {
    products: {
        data: Array(6).fill({
            id: 1,
            name: 'Producto Demo',
            slug: 'producto-demo',
            base_price: 99.99,
            description: 'Descripción corta.',
            image_url: null,
        }),
        links: [],
    },
    categories: [
        { id: 1, name: 'Femenino' },
        { id: 2, name: 'Masculino' },
        { id: 3, name: 'Parejas' },
        { id: 4, name: 'Cosmética' },
        { id: 5, name: 'Sets' },
        { id: 6, name: 'Cuidado' },
    ],
    filters: {},
};

const PRODUCT_PAGE_DEMO_PROPS = {
    product: {
        id: 1,
        name: 'Producto de Ejemplo',
        slug: 'producto-ejemplo',
        description: 'Este es un ejemplo de producto para previsualización en el gestor de componentes.',
        base_price: 12.50,
        image_url: 'https://via.placeholder.com/400x500/99b849/ffffff?text=Producto+Demo',
        category_id: 1,
        category: { id: 1, name: 'Femenino' },
        stock_quantity: 100,
        is_active: true,
    },
    accessories: [],
    relatedProducts: [
        {
            id: 2,
            name: 'Producto Relacionado 1',
            slug: 'producto-1',
            base_price: 8.99,
            description: 'Descripción del producto relacionado 1.',
            image_url: 'https://via.placeholder.com/300x400/6b7280/ffffff?text=Producto+1',
            category: { id: 1, name: 'Femenino' },
        },
        {
            id: 3,
            name: 'Producto Relacionado 2',
            slug: 'producto-2',
            base_price: 15.00,
            description: 'Descripción del producto relacionado 2.',
            image_url: 'https://via.placeholder.com/300x400/6b7280/ffffff?text=Producto+2',
            category: { id: 2, name: 'Masculino' },
        },
        {
            id: 4,
            name: 'Producto Relacionado 3',
            slug: 'producto-3',
            base_price: 4.50,
            description: 'Descripción del producto relacionado 3.',
            image_url: 'https://via.placeholder.com/300x400/6b7280/ffffff?text=Producto+3',
            category: { id: 4, name: 'Cosmética' },
        },
    ],
};

function getPagePreview(item) {
    let ComponentToRender = item.Component;
    let props = {};

    if (item.baseName === 'ProductPage') {
        ComponentToRender = React.lazy(() =>
            import('@/Pages/Catalog/ProductPage/ProductPage').then((module) => ({
                default: module.ProductPagePreview,
            }))
        );
        props = PRODUCT_PAGE_DEMO_PROPS;
    } else if (item.baseName === 'Products') {
        props = PRODUCTS_PAGE_DEMO_PROPS;
    }

    return { ComponentToRender, props };
}

function EmptyState() {
    return (
        <div className={styles.emptyState}>
            <div className={styles.emptyStateIconWrapper}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={styles.emptyStateIcon}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
            </div>
            <h3 className={styles.emptyStateTitle}>Select pages to view</h3>
            <div className={styles.emptyStateDescription}>
                <ul className={styles.emptyStateList}>
                    <li>Use the checkboxes in the sidebar</li>
                    <li>Or verify matching items via the Color Filter above</li>
                </ul>
            </div>
        </div>
    );
}

export default function PagesGridView({
    itemsList,
    selectedPagePaths,
    setSelectedPagePaths,
    gridCols,
    setGridCols,
    SelectedPages
}) {
    const areAllPagesSelected = itemsList.length > 0 && itemsList.every((item) => selectedPagePaths.has(item.path));

    return (
        <>
            <div className={styles.toolbar}>
                <label className={styles.toolbarCheckboxLabel}>
                    <input
                        aria-label="Ver todas las paginas"
                        type="checkbox"
                        checked={areAllPagesSelected}
                        onChange={(e) => {
                            if (e.target.checked) {
                                setSelectedPagePaths(new Set(itemsList.map((item) => item.path)));
                            } else {
                                setSelectedPagePaths(new Set());
                            }
                        }}
                        className={styles.toolbarCheckbox}
                    />
                    <span className={styles.toolbarLabel}>View All Pages</span>
                </label>

                <div className={styles.toolbarDivider} />

                <div className={styles.columnsControl}>
                    <span className={styles.toolbarLabel}>Columns:</span>
                    <input
                        aria-label="Numero de columnas"
                        type="number"
                        min="1"
                        max="5"
                        value={gridCols}
                        onChange={(e) => setGridCols(Math.max(1, Math.min(5, parseInt(e.target.value) || 1)))}
                        className={styles.columnsInput}
                    />
                </div>
            </div>

            <div className={styles.content}>
                {SelectedPages.length > 0 ? (
                    <div
                        className={styles.grid}
                        style={{ gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))` }}
                    >
                        {SelectedPages.map((item) => {
                            const { ComponentToRender, props } = getPagePreview(item);

                            return (
                                <PreviewContainer key={item.path} title={item.name}>
                                    <ComponentToRender {...props} />
                                </PreviewContainer>
                            );
                        })}
                    </div>
                ) : (
                    <EmptyState />
                )}
            </div>
        </>
    );
}
