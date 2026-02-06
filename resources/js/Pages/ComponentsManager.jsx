import React from 'react';
import { Head } from '@inertiajs/react';
import ManagerHeader from '../Components/ComponentsManager/ManagerHeader';
import ManagerSidebar from '../Components/ComponentsManager/ManagerSidebar';
import SingleComponentView from '../Components/ComponentsManager/SingleComponentView';
import PagesGridView from '../Components/ComponentsManager/PagesGridView';
import { useComponentsManager } from '../Components/ComponentsManager/useComponentsManager';

export default function ComponentsManager() {
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
        SelectedSingleComponent, // This is a component (LazyExoticComponent) or null
        SelectedPages,
        itemsList
    } = useComponentsManager();

    return (
        <div className="h-screen flex flex-col bg-white font-sans overflow-hidden select-none cursor-default">
            <Head title="Components Manager" />

            <ManagerHeader searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

            <div className="flex flex-1 overflow-hidden">
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
        </div>
    );
}
