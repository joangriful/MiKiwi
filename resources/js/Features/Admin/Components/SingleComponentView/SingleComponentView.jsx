import React, { Suspense } from 'react';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import './SingleComponentView.css';

const SingleComponentView = ({ selectedComponentPath, SelectedSingleComponent }) => {
    const [bgColor, setBgColor] = React.useState('bg-gray-100');
    const [contextMenu, setContextMenu] = React.useState(null);

    const handleContextMenu = (e) => {
        e.preventDefault();
        setContextMenu({
            mouseX: e.clientX,
            mouseY: e.clientY,
        });
    };

    const handleCloseContextMenu = () => {
        setContextMenu(null);
    };

    const handleColorChange = (color) => {
        setBgColor(color);
        handleCloseContextMenu();
    };

    React.useEffect(() => {
        const handleClick = () => handleCloseContextMenu();
        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    }, []);

    const bgOptions = [
        { label: 'White', value: 'bg-white' },
        { label: 'Light Grey', value: 'bg-gray-100' },
        { label: 'Grey', value: 'bg-gray-400' },
        { label: 'Dark Grey', value: 'bg-gray-800' },
        { label: 'Black', value: 'bg-black' },
    ];

    if (!selectedComponentPath) {
        return (
            <div className="flex-1 flex items-center justify-center h-full text-gray-400">
                <div className="text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-200">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-gray-300">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
                        </svg>
                    </div>
                    <h3 className="text-gray-500 font-medium">Select a component to view</h3>
                </div>
            </div>
        );
    }

    return (
        <div
            className={`flex-1 flex flex-col h-full ${bgColor} transition-colors duration-200 relative`}
            onContextMenu={handleContextMenu}
        >
            <div className="bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center shadow-sm shrink-0">
                <h2 className="font-semibold text-gray-700 text-lg">
                    {selectedComponentPath.replace('../Components/', '').replace('.jsx', '')}
                </h2>
                <span className="px-2 py-1 bg-gray-100 rounded-md text-gray-500 font-mono text-xs border border-gray-200">JSX</span>
            </div>
            <div className="flex-1 p-8 overflow-auto w-full">
                <ErrorBoundary key={selectedComponentPath}>
                    <Suspense fallback={<div className="text-sm text-gray-400">Loading Component...</div>}>
                        <div className="w-full">
                            {SelectedSingleComponent && <SelectedSingleComponent />}
                        </div>
                    </Suspense>
                </ErrorBoundary>
            </div>

            {contextMenu && (
                <div
                    className="fixed z-50 bg-white shadow-lg rounded-lg border border-gray-200 py-1 min-w-[150px]"
                    style={{ top: contextMenu.mouseY, left: contextMenu.mouseX }}
                >
                    <div className="px-3 py-2 text-xs font-semibold text-gray-500 border-b border-gray-100 mb-1">
                        Background Color
                    </div>
                    {bgOptions.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => handleColorChange(option.value)}
                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2 ${bgColor === option.value ? 'font-medium text-[#99b849]' : 'text-gray-700'}`}
                        >
                            <div className={`w-3 h-3 rounded-full border border-gray-300 ${option.value}`}></div>
                            {option.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SingleComponentView;
