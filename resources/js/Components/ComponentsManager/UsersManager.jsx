import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import Toast from '../Common/Toast';
import AdminConfirmationModal from './AdminConfirmationModal';

export default function UsersManager({ users }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all'); // 'all' | 'admin'

    // UI State
    const [toast, setToast] = useState(null);
    const [modalConfig, setModalConfig] = useState({ isOpen: false, user: null, actionType: null });

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (user.username && user.username.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesFilter = filter === 'all' ? true : user.role === 'admin';

        return matchesSearch && matchesFilter;
    });

    const handleToggleClick = (user) => {
        setModalConfig({
            isOpen: true,
            user: user,
            actionType: user.role === 'admin' ? 'remove' : 'add'
        });
    };

    const handleConfirmToggle = () => {
        const { user } = modalConfig;
        if (!user) return;

        router.post(route('users.toggleRole', user.id), {}, {
            preserveScroll: true,
            onSuccess: () => {
                setToast({
                    message: `Successfully ${user.role === 'admin' ? 'removed admin rights from' : 'granted admin rights to'} ${user.name}`,
                    type: 'success'
                });
                setModalConfig({ isOpen: false, user: null, actionType: null });
            },
            onError: () => {
                setToast({
                    message: 'Failed to update user role. Please try again.',
                    type: 'error'
                });
                setModalConfig({ isOpen: false, user: null, actionType: null });
            }
        });
    };

    return (
        <div className="flex h-full bg-gray-50 relative">
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            <AdminConfirmationModal
                isOpen={modalConfig.isOpen}
                onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
                onConfirm={handleConfirmToggle}
                user={modalConfig.user}
                actionType={modalConfig.actionType}
            />

            {/* Sidebar / Filter */}
            <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
                <div className="p-4 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-gray-800">Usuarios</h2>
                    <p className="text-xs text-gray-500">Gestión de roles</p>
                </div>

                <div className="p-2 space-y-1">
                    <button
                        onClick={() => setFilter('all')}
                        className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'all' ? 'bg-[#99b849]/10 text-[#99b849]' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        Todos los usuarios
                    </button>
                    <button
                        onClick={() => setFilter('admin')}
                        className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'admin' ? 'bg-[#99b849]/10 text-[#99b849]' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        Administradores
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Search Bar */}
                <div className="p-4 bg-white border-b border-gray-200 flex gap-4">
                    <div className="relative flex-1 max-w-md">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 material-symbols-outlined text-[20px]">search</span>
                        <input
                            type="text"
                            placeholder="Buscar por nombre, usuario o email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#99b849]/50 focus:border-[#99b849]"
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="flex-1 overflow-auto p-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 text-gray-500 font-medium">
                                <tr>
                                    <th className="px-6 py-4">Nombre</th>
                                    <th className="px-6 py-4">Usuario</th>
                                    <th className="px-6 py-4">Correo Electrónico</th>
                                    <th className="px-6 py-4 text-center">Rol</th>
                                    <th className="px-6 py-4 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900">{user.name}</td>
                                        <td className="px-6 py-4 text-gray-600">{user.username || '-'}</td>
                                        <td className="px-6 py-4 text-gray-600">{user.email}</td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${user.role === 'admin'
                                                    ? 'bg-purple-50 text-purple-700 border-purple-200'
                                                    : 'bg-blue-50 text-blue-700 border-blue-200'
                                                }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleToggleClick(user)}
                                                className={`text-xs font-semibold px-3 py-1.5 rounded-md transition-colors ${user.role === 'admin'
                                                        ? 'text-red-600 hover:bg-red-50'
                                                        : 'text-[#99b849] hover:bg-[#99b849]/10'
                                                    }`}
                                            >
                                                {user.role === 'admin' ? 'Quitar Admin' : 'Hacer Admin'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {filteredUsers.length === 0 && (
                            <div className="p-12 text-center text-gray-400">
                                <p>No se encontraron usuarios.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
