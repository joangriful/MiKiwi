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
import ReviewsManager from '@/Components/Admin/ReviewsManager/ReviewsManager';
import StripeTestCards from '@/Components/Admin/StripeTestCards/StripeTestCards';
import { useComponentsManager } from '@/Components/Admin/hooks/useComponentsManager';
import styles from './ComponentsManager.module.css';

export default function ComponentsManager({ views, defaultSettings, partPositions, users, heroImages, categories, products, reviews, debugCount }) {
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
        <div className={styles.root}>
            <Head title="Components Manager" />

            {/* Unified Manager Header */}
            <ManagerHeader
                activeManager={activeManager}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                onSaveDefaults={handleSaveDollDefaults}
            />

            {/* Navigation Tabs */}
            <div className={styles.tabsBar}>
                <nav className={styles.tabsNav}>
                    {[
                        { id: 'components', label: 'Components', icon: 'widgets' },
                        { id: 'doll', label: 'Doll', icon: 'person' },
                        { id: 'users', label: 'Users', icon: 'group' },
                        { id: 'content', label: 'Content', icon: 'image' },
                        { id: 'products', label: 'Products', icon: 'inventory_2' },
                        { id: 'reviews', label: 'Reviews', icon: 'rate_review' },
                        { id: 'payments', label: 'Payments', icon: 'payments' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => setActiveManager(tab.id)}
                            className={`${styles.tabButton} ${activeManager === tab.id ? styles.tabButtonActive : ''}`}
                        >
                            <span className={`material-symbols-outlined ${styles.tabIcon}`}>{tab.icon}</span>
                            <span className={styles.tabLabel}>{tab.label}</span>
                        </button>
                    ))}
                </nav>
            </div>

            <div className={styles.contentArea}>
                {activeManager === 'components' && (
                    <div className={styles.componentsLayout}>
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

                        <main className={`${styles.previewPane} ${sourceType === 'pages' ? styles.previewPanePages : styles.previewPaneComponents}`}>
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

                {activeManager === 'reviews' && (
                    <ReviewsManager reviews={reviews} users={users} products={products} />
                )}

                {activeManager === 'payments' && (
                    <StripeTestCards />
                )}
            </div>
        </div>
    );
}
