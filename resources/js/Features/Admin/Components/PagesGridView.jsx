import React from 'react';
import PreviewContainer from './PreviewContainer';

const PagesGridView = ({
    itemsList,
    selectedPagePaths,
    setSelectedPagePaths,
    gridCols,
    setGridCols,
    SelectedPages
}) => {
    return (
        <>
            <div className="w-full bg-[#99b849] text-white px-8 py-3 flex items-center gap-6 sticky top-0 z-20 shadow-sm shrink-0">
                <label className="flex items-center space-x-2 cursor-pointer hover:opacity-90 transition select-none">
                    <input
                        type="checkbox"
                        checked={itemsList.length > 0 && itemsList.every(i => selectedPagePaths.has(i.path))}
                        onChange={(e) => {
                            if (e.target.checked) {
                                setSelectedPagePaths(new Set(itemsList.map(i => i.path)));
                            } else {
                                setSelectedPagePaths(new Set());
                            }
                        }}
                        className="rounded border-white text-[#99b849] focus:ring-white/50 w-4 h-4 cursor-pointer accent-white bg-white"
                    />
                    <span className="text-sm font-medium">View All Pages</span>
                </label>

                <div className="h-6 w-px bg-white/30"></div>

                <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium">Columns:</span>
                    <input
                        type="number"
                        min="1"
                        max="5"
                        value={gridCols}
                        onChange={(e) => setGridCols(Math.max(1, Math.min(5, parseInt(e.target.value) || 1)))}
                        className="w-16 p-1 text-sm bg-white/10 border border-white/30 rounded text-white placeholder-white/50 focus:bg-white/20 focus:ring-2 focus:ring-white/50 outline-none"
                    />
                </div>
            </div>

            <div className="p-8">
                {SelectedPages.length > 0 ? (
                    <div
                        className="grid gap-8 pb-10"
                        style={{ gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))` }}
                    >
                        {SelectedPages.map((item) => {
                            let props = {};
                            let ComponentToRender = item.Component;

                            if (item.name === 'ProductPage') {
                                // Use preview version without Header/Footer
                                ComponentToRender = React.lazy(() => 
                                    import('@/Features/Catalog/Pages/ProductPage').then(module => ({ 
                                        default: module.ProductPagePreview 
                                    }))
                                );
                                props = {
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
                                        is_active: true
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
                                            category: { id: 1, name: 'Femenino' }
                                        },
                                        { 
                                            id: 3, 
                                            name: 'Producto Relacionado 2', 
                                            slug: 'producto-2', 
                                            base_price: 15.00, 
                                            description: 'Descripción del producto relacionado 2.', 
                                            image_url: 'https://via.placeholder.com/300x400/6b7280/ffffff?text=Producto+2',
                                            category: { id: 2, name: 'Masculino' }
                                        },
                                        { 
                                            id: 4, 
                                            name: 'Producto Relacionado 3', 
                                            slug: 'producto-3', 
                                            base_price: 4.50, 
                                            description: 'Descripción del producto relacionado 3.', 
                                            image_url: 'https://via.placeholder.com/300x400/6b7280/ffffff?text=Producto+3',
                                            category: { id: 4, name: 'Cosmética' }
                                        },
                                    ]
                                };
                            } else if (item.name === 'Products') {
                                props = {
                                    products: {
                                        data: Array(6).fill({
                                            id: 1,
                                            name: 'Producto Demo',
                                            slug: 'producto-demo',
                                            base_price: 99.99,
                                            description: 'Descripción corta.',
                                            image_url: null
                                        }),
                                        links: []
                                    },
                                    categories: [
                                        { id: 1, name: 'Femenino' },
                                        { id: 2, name: 'Masculino' },
                                        { id: 3, name: 'Parejas' },
                                        { id: 4, name: 'Cosmética' },
                                        { id: 5, name: 'Sets' },
                                        { id: 6, name: 'Cuidado' }
                                    ],
                                    filters: {}
                                };
                            }

                            return (
                                <PreviewContainer key={item.path} title={item.name}>
                                    <ComponentToRender {...props} />
                                </PreviewContainer>
                            );
                        })}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] text-gray-400">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6 border border-gray-200">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-gray-300">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-600 mb-2">Select pages to view</h3>
                        <div className="text-gray-500 max-w-sm text-center">
                            <ul className="text-left list-disc pl-4 mt-2 mb-2 space-y-1">
                                <li>Use the checkboxes in the sidebar</li>
                                <li>Or verify matching items via the Color Filter above</li>
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default PagesGridView;
