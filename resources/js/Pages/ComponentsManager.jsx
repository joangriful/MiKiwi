import React, { useState } from 'react';
import DollManager from '../Components/DollManager/DollManager';
import { Head } from '@inertiajs/react';
import ManagerHeader from '../Components/ComponentsManager/ManagerHeader';
import ManagerSidebar from '../Components/ComponentsManager/ManagerSidebar';
import SingleComponentView from '../Components/ComponentsManager/SingleComponentView';
import PagesGridView from '../Components/ComponentsManager/PagesGridView';
import { useComponentsManager } from '../Components/ComponentsManager/useComponentsManager';

export default function ComponentsManager({ views, defaultSettings }) {
    const [activeManager, setActiveManager] = useState('components'); // 'components' | 'doll'

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

    const dollManagerRef = React.useRef(null);

    const handleSaveDollDefaults = () => {
        if (dollManagerRef.current) {
            dollManagerRef.current.save();
        }
    };

    return (
        <div className="h-screen flex flex-col bg-white font-sans overflow-hidden select-none cursor-default">
            <Head title="Components Manager" />

            {/* Unified Manager Header */}
            <ManagerHeader
                activeManager={activeManager}
                setActiveManager={setActiveManager}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                onSaveDefaults={handleSaveDollDefaults}
            />

            <div className="flex-1 overflow-hidden relative">
                {activeManager === 'components' ? (
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
                ) : (
                    <DollManager ref={dollManagerRef} views={views} defaultSettings={defaultSettings} />
                )}
            </div>
        </div>
    );
}
