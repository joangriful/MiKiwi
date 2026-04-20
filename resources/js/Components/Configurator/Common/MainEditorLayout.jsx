import React, { useEffect } from 'react';
import PreviewArea from '@/Components/Configurator/PreviewArea/PreviewArea';
import CloseUp from '@/Components/Configurator/CloseUp/CloseUp';
import OptionsBar from '@/Components/Configurator/OptionsBar/OptionsBar';
import PartSelector from '@/Components/Configurator/PartSelector/PartSelector';

console.log('%c[File] %cMainEditorLayout.jsx CARGADO', "color: #ff00ff; font-weight: bold", "color: #666");

export default function MainEditorLayout({
    topSectionHeight,
    handleDragStart,
    selectedParts,
    viewportInfo,
    setViewportInfo,
    partPositions,
    handle2DReady,
    defaultZoom,
    zoomLevel,
    setZoomLevel,
    currentView,
    setCurrentView,
    availableParts,
    handleSelectPart,
    sectionOrder,
    handleSavePosition
}) {
    console.log('%c[Execution] %cEntrando en MainEditorLayout', "color: #4CAF50; font-weight: bold");

    useEffect(() => {
        console.log('%c[Component] %cMainEditorLayout Montado', "color: #ff5722; font-weight: bold", "color: #666");
    }, []);

    return (
        <>
            {/* Left Content Area (Images ONLY) */}
            <div className="flex flex-col w-full h-full min-[724px]:w-full lg:w-auto lg:h-full lg:flex-1 border-r border-gray-200 bg-white shadow-xl lg:shadow-none z-20">
                <div className="flex-1 flex relative overflow-hidden">
                    {/* Preview Area */}
                    <div
                        className="absolute left-4 z-50 w-24 h-auto aspect-[2/3] pointer-events-none shadow-xl border-2 border-white rounded-lg bg-white overflow-hidden transition-all duration-75 ease-linear
                                   min-[724px]:relative min-[724px]:bottom-auto min-[724px]:left-auto min-[724px]:w-1/2 min-[724px]:h-full min-[724px]:pointer-events-auto min-[724px]:border-r min-[724px]:border-gray-200 min-[724px]:shadow-none min-[724px]:rounded-none min-[724px]:aspect-auto
                                   lg:w-1/4"
                        style={{ bottom: window.innerWidth < 724 ? `calc(${100 - topSectionHeight}% + 1rem)` : undefined }}
                    >
                        <div className="absolute inset-0 flex items-center justify-center">
                            <PreviewArea
                                selectedParts={selectedParts}
                                viewportInfo={viewportInfo}
                                onViewportChange={setViewportInfo}
                                className="bg-white"
                                partPositions={partPositions}
                                onReady={handle2DReady}
                            />
                        </div>
                    </div>

                    {/* CloseUp Area */}
                    <div className="w-full h-full relative bg-gray-100 overflow-hidden shadow-inner min-[724px]:w-1/2 lg:flex-1">
                        <CloseUp
                            selectedParts={selectedParts}
                            onViewportChange={setViewportInfo}
                            viewportOverride={viewportInfo}
                            initialViewport={defaultZoom}
                            zoomLevel={zoomLevel}
                        />
                    </div>
                </div>
            </div>

            {/* Drag Handle - Mobile/Tablet (Visible on lg:hidden) */}
            <div
                onMouseDown={handleDragStart}
                onTouchStart={handleDragStart}
                className="absolute w-full h-10 z-[100] flex items-center justify-center cursor-row-resize touch-none lg:hidden"
                style={{ bottom: `${100 - topSectionHeight}%`, transform: 'translateY(50%)' }}
            >
                <div className="w-16 h-2 bg-gray-400 rounded-full shadow-md mx-auto hover:bg-gray-600 transition-colors" />
            </div>

            {/* Right Column: Options Bar + Controls */}
            <div
                className="absolute bottom-0 left-0 w-full flex flex-col bg-gradient-to-b from-[var(--bg-surface)] to-[var(--bg-main)] backdrop-blur-2xl z-40 border-t border-[var(--border)]
                           min-[724px]:w-full lg:relative lg:w-[420px] lg:h-full lg:border-t-0 lg:border-l lg:border-[var(--border)] lg:flex-none transition-all duration-500 ease-premium shadow-[-20px_0_50px_rgba(0,0,0,0.05)]"
                style={{ height: window.innerWidth < 1024 ? `${100 - topSectionHeight}%` : '100%' }}
            >
                <div className="flex-none z-[60] relative">
                    <OptionsBar
                        currentView={currentView}
                        onViewChange={setCurrentView}
                        zoomLevel={zoomLevel}
                        onZoomChange={setZoomLevel}
                        surface="transparent"
                    />
                </div>

                <div className="flex-1 overflow-hidden">
                    <PartSelector
                        parts={availableParts}
                        selectedParts={selectedParts}
                        onSelect={handleSelectPart}
                        sectionOrder={sectionOrder}
                        showImages={true}
                        partPositions={partPositions}
                        currentView={currentView}
                        onSavePosition={handleSavePosition}
                    />
                </div>
            </div>
        </>
    );
}
