import React from 'react';
import { Link } from '@inertiajs/react';
import './ManagerHeader.css';

const ManagerHeader = ({ searchTerm, setSearchTerm, activeManager, onSaveDefaults }) => {
    return (
        <header className="bg-white border-b border-gray-200 shadow-sm flex items-center justify-between px-6 py-4 z-10 shrink-0">
            {/* Left: Logo & Title */}
            <div className="flex items-center gap-4">
                <Link href="/" className="text-gray-500 hover:text-[#99b849] transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                    </svg>
                </Link>
                <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <img src="/assets/icons/manager.svg" alt="Manager" className="w-6 h-6 opacity-75 invert-0" />
                </h1>
            </div>


            {/* Right: Search or Save Button */}
            <div className="flex justify-end">
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
                        <img src="/assets/icons/Save_icon.svg" alt="Save" className="w-4 h-4 brightness-0 invert" />
                        Save
                    </button>
                )}
            </div>
        </header>
    );
};

export default ManagerHeader;
