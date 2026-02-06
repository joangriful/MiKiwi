import React from 'react';
import { Link } from '@inertiajs/react';

const ManagerHeader = ({ searchTerm, setSearchTerm }) => {
    return (
        <header className="bg-white border-b border-gray-200 shadow-sm flex items-center justify-between px-6 py-4 z-10 shrink-0">
            <div className="flex items-center gap-4">
                <Link href="/" className="text-gray-500 hover:text-[#99b849] transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                    </svg>
                </Link>
                <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <img src="/assets/icons/manager.svg" alt="Manager" className="w-6 h-6 opacity-75 invert-0" />
                    Components Manager
                </h1>
            </div>

            <div className="flex items-center gap-4">
                <div className="w-64">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-[#99b849]/20 focus:border-[#99b849] outline-none transition-all text-sm select-text cursor-text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>
        </header>
    );
};

export default ManagerHeader;
