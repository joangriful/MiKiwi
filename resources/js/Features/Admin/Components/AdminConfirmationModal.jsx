import React, { useState, useEffect } from 'react';

export default function AdminConfirmationModal({ isOpen, onClose, onConfirm, user, actionType }) {
    const [inputValue, setInputValue] = useState('');

    // Reset input when modal opens/closes
    useEffect(() => {
        if (isOpen) setInputValue('');
    }, [isOpen]);

    if (!isOpen || !user) return null;

    const identifier = user.username || user.email;
    const confirmPhrase = actionType === 'remove'
        ? `remove admin ${identifier}`
        : `make admin ${identifier}`;

    const isMatch = inputValue === confirmPhrase;

    return (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 transform transition-all scale-100 animate-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <span className={`material-symbols-outlined ${actionType === 'remove' ? 'text-red-500' : 'text-blue-500'}`}>
                            {actionType === 'remove' ? 'warning' : 'security'}
                        </span>
                        {actionType === 'remove' ? 'Remove Admin Privileges' : 'Grant Admin Privileges'}
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div className="mb-6">
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                        Are you sure you want to {actionType === 'remove' ? 'remove admin rights from' : 'make'} <span className="font-bold text-gray-800">{user.name}</span> {actionType === 'remove' ? '' : 'an admin'}?
                        {actionType === 'remove' && (
                            <span className="block mt-2 text-red-600 font-medium">This action will restrict their access to the Components Manager immediately.</span>
                        )}
                    </p>

                    <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
                        Type confirmation phrase
                    </label>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-3 select-all cursor-text font-mono text-sm text-gray-600">
                        {confirmPhrase}
                    </div>

                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 text-sm font-mono transition-shadow placeholder-gray-300"
                        placeholder={confirmPhrase}
                        autoFocus
                    />
                </div>

                <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 hover:text-gray-900 transition-all shadow-sm"
                    >
                        Cancel
                    </button>
                    <button
                        disabled={!isMatch}
                        onClick={() => {
                            if (isMatch) {
                                onConfirm();
                                setInputValue('');
                            }
                        }}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm flex items-center gap-2 ${isMatch
                                ? (actionType === 'remove' ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-[#99b849] hover:bg-[#8da843] text-white')
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                            }`}
                    >
                        {isMatch && <span className="material-symbols-outlined text-sm">check</span>}
                        {actionType === 'remove' ? 'I understand, remove admin' : 'Confirm, make admin'}
                    </button>
                </div>
            </div>
        </div>
    );
}
