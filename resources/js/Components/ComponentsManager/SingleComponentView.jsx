import React, { Suspense } from 'react';
import ErrorBoundary from './ErrorBoundary';

const SingleComponentView = ({ selectedComponentPath, SelectedSingleComponent }) => {
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
        <div className="flex-1 flex flex-col h-full bg-[#f3f4f6]"
            style={{
                backgroundImage: 'radial-gradient(#000000 1px, transparent 1px)',
                backgroundSize: '20px 20px',
            }}
        >
            <div className="bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center shadow-sm">
                <h2 className="font-semibold text-gray-700 text-lg">
                    {selectedComponentPath.replace('../Components/', '').replace('.jsx', '')}
                </h2>
                <span className="px-2 py-1 bg-gray-100 rounded-md text-gray-500 font-mono text-xs border border-gray-200">JSX</span>
            </div>
            <div className="flex-1 p-8 overflow-auto w-full">
                <ErrorBoundary key={selectedComponentPath}>
                    <Suspense fallback={<div className="text-sm text-gray-400">Loading Component...</div>}>
                        <div className="w-full shadow-lg bg-white p-1">
                            {SelectedSingleComponent && <SelectedSingleComponent />}
                        </div>
                    </Suspense>
                </ErrorBoundary>
            </div>
        </div>
    );
};

export default SingleComponentView;
