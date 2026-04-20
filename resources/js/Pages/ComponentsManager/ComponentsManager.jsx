import { useRef, useState } from 'react';
import DollManager from '@/Components/Configurator/DollManager/DollManager';
import { Head } from '@inertiajs/react';
import ManagerHeader from '@/Components/Admin/ManagerHeader/ManagerHeader';
import ManagerSidebar from '@/Components/Admin/ManagerSidebar/ManagerSidebar';
import SingleComponentView from '@/Components/Admin/SingleComponentView/SingleComponentView';
import PagesGridView from '@/Components/Admin/PagesGridView/PagesGridView';
import UsersManager from '@/Components/Admin/UsersManager/UsersManager';
import ContentManager from '@/Components/Admin/ContentManager/ContentManager';
import ProductsManager from '@/Components/Admin/ProductsManager/ProductsManager';
import StripeTestCards from '@/Components/Admin/StripeTestCards/StripeTestCards';
import { useComponentsManager } from '@/Components/Admin/hooks/useComponentsManager';
import styles from './ComponentsManager.module.css';

export default function ComponentsManager({ views, defaultSettings, partPositions, users, heroImages, categories, products, debugCount }) {
    const [activeManager, setActiveManager] = useState('components'); // 'components' | 'doll' | 'users' | 'content'

    const {
        sourceType, setSourceType,
        selectedPagePaths, setSelectedPagePaths,
        selectedComponentPath,
        searchTerm, setSearchTerm,
        selectedColor, setSelectedColor,
        openFolders, focusedIndex,
        gridCols, setGridCols,
        definedColors,
        visibleItems,
        handleFolderToggle,
        handleItemSelect,
        SelectedSingleComponent,
        SelectedPages,
        itemsList
    } = useComponentsManager();

    const dollManagerRef = useRef(null);

    const handleSaveDollDefaults = () => {
        if (dollManagerRef.current) {
            dollManagerRef.current.save();
        }
    };

    return (
        <div className={`${styles.root} h-screen flex flex-col bg-white font-sans overflow-hidden select-none cursor-default`}>
            <Head title="Components Manager" />

            {/* Unified Manager Header */}
            <ManagerHeader
                activeManager={activeManager}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                onSaveDefaults={handleSaveDollDefaults}
            />

            {/* Navigation Tabs */}
            <div className="bg-white border-b border-gray-200 px-6">
                <nav className="flex gap-1">
                    {[
                        { id: 'components', label: 'Components', icon: 'widgets' },
                        { id: 'doll', label: 'Doll', icon: 'person' },
                        { id: 'users', label: 'Users', icon: 'group' },
                        { id: 'content', label: 'Content', icon: 'image' },
                        { id: 'products', label: 'Products', icon: 'inventory_2' },
                        { id: 'payments', label: 'Payments', icon: 'payments' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveManager(tab.id)}
                            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${activeManager === tab.id
                                ? 'border-blue-600 text-blue-600 font-medium'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            <span className="material-symbols-outlined text-lg">{tab.icon}</span>
                            <span className="text-sm">{tab.label}</span>
                        </button>
                    ))}
                </nav>
            </div>

            <div className="flex-1 overflow-hidden relative">
                {activeManager === 'components' && (
                    <div className="flex h-full">
                        <ManagerSidebar
                            sourceType={sourceType}
                            setSourceType={setSourceType}
                            definedColors={definedColors}
                            selectedColor={selectedColor}
                            setSelectedColor={setSelectedColor}
                            visibleItems={visibleItems}
                            focusedIndex={focusedIndex}
                            selectedPagePaths={selectedPagePaths}
                            selectedComponentPath={selectedComponentPath}
                            openFolders={openFolders}
                            handleFolderToggle={handleFolderToggle}
                            handleItemSelect={handleItemSelect}
                        />

                        <main className={`flex-1 overflow-y-auto ${sourceType === 'pages' ? 'bg-gray-200' : 'bg-gray-50'}`}>
                            {sourceType === 'components' ? (
                                <SingleComponentView
                                    selectedComponentPath={selectedComponentPath}
                                    SelectedSingleComponent={SelectedSingleComponent}
                                />
                            ) : (
                                <PagesGridView
                                    itemsList={itemsList}
                                    selectedPagePaths={selectedPagePaths}
                                    setSelectedPagePaths={setSelectedPagePaths}
                                    gridCols={gridCols}
                                    setGridCols={setGridCols}
                                    SelectedPages={SelectedPages}
                                />
                            )}
                        </main>
                    </div>
                )}

                {activeManager === 'doll' && (
                    <DollManager ref={dollManagerRef} views={views} defaultSettings={defaultSettings} partPositions={partPositions} />
                )}

                {activeManager === 'users' && (
                    <UsersManager users={users} />
                )}

                {activeManager === 'content' && (
                    <ContentManager heroImages={heroImages} />
                )}

                {activeManager === 'products' && (
                    <ProductsManager categories={categories} products={products} debugCount={debugCount} />
                )}
                
                {activeManager === 'payments' && (
                    <StripeTestCards />
                )}
            </div>
        </div>
    );
}
