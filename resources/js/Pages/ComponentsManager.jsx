import React, { useState } from 'react';
import DollManager from '../Components/DollManager/DollManager';
import { Head } from '@inertiajs/react';
import Header from '../Components/Common/Header';
import SubHeader from '../Components/Common/SubHeader';
import ManagerHeader from '../Components/ComponentsManager/ManagerHeader';
import ManagerSidebar from '../Components/ComponentsManager/ManagerSidebar';
import SingleComponentView from '../Components/ComponentsManager/SingleComponentView';
import PagesGridView from '../Components/ComponentsManager/PagesGridView';
import UsersManager from '../Components/ComponentsManager/UsersManager';
import ContentManager from '../Components/ComponentsManager/ContentManager';
import { useComponentsManager } from '../Components/ComponentsManager/useComponentsManager';

export default function ComponentsManager({ views, defaultSettings, users, heroImages }) {
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

    const dollManagerRef = React.useRef(null);

    const handleSaveDollDefaults = () => {
        if (dollManagerRef.current) {
            dollManagerRef.current.save();
        }
    };

    return (
        <div className="h-screen flex flex-col bg-white font-sans overflow-hidden select-none cursor-default">
            <Head title="Components Manager" />

            {/* Main Site Header */}
            <Header />

            {/* SubHeader with Manager Navigation */}
            <SubHeader
                isManager={true}
                activeManager={activeManager}
                setActiveManager={setActiveManager}
            />

            {/* Unified Manager Header */}
            <ManagerHeader
                activeManager={activeManager}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                onSaveDefaults={handleSaveDollDefaults}
            />

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
                    <DollManager ref={dollManagerRef} views={views} defaultSettings={defaultSettings} />
                )}

                {activeManager === 'users' && (
                    <UsersManager users={users} />
                )}

                {activeManager === 'content' && (
                    <ContentManager heroImages={heroImages} />
                )}
            </div>
        </div>
    );
}
