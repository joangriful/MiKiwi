import React from 'react';
import { Link } from '@inertiajs/react';

const ManagerHeader = ({ searchTerm, setSearchTerm, activeManager, setActiveManager, onSaveDefaults }) => {
    return (
        <header className="bg-white border-b border-gray-200 shadow-sm flex items-center justify-between px-6 py-4 z-10 shrink-0">
            {/* Left: Logo & Title */}
            <div className="flex items-center gap-4 w-1/4">
                <Link href="/" className="text-gray-500 hover:text-[#99b849] transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                    </svg>
                </Link>
                <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <img src="/assets/icons/manager.svg" alt="Manager" className="w-6 h-6 opacity-75 invert-0" />
                </h1>
            </div>

            {/* Center: Navigation Tabs */}
            <div className="flex bg-gray-100 p-1 rounded-lg">
                <button
                    onClick={() => setActiveManager('components')}
                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeManager === 'components'
                        ? 'bg-white shadow-sm text-gray-900'
                        : 'text-gray-500 hover:text-gray-900'
                        }`}
                >
                    Components
                </button>
                <button
                    onClick={() => setActiveManager('doll')}
                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeManager === 'doll'
                        ? 'bg-white shadow-sm text-gray-900'
                        : 'text-gray-500 hover:text-gray-900'
                        }`}
                >
                    Doll Manager
                </button>
            </div>


            {/* Right: Search (Conditional) */}
            <div className="w-1/4 flex justify-end">
                {activeManager === 'components' ? (
                    <div className="w-full max-w-xs">
                        <input
                            type="text"
                            placeholder="Search components..."
                            className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-[#99b849]/20 focus:border-[#99b849] outline-none transition-all text-sm select-text cursor-text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                ) : (
                    <button
                        onClick={onSaveDefaults}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm text-sm flex items-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                        </svg>
                        Save Defaults
                    </button>
                )}
            </div>
        </header>
    );
};

export default ManagerHeader;
