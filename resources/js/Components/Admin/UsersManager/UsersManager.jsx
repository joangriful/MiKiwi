import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import Toast from '@/Components/Toast/Toast';
import { useConfirm } from '@/Shared/Confirm/ConfirmProvider';
import styles from './UsersManager.module.css';

const USER_FILTERS = [
    { id: 'all', label: 'Todos los usuarios' },
    { id: 'admin', label: 'Administradores' },
];

function SearchBar({ searchTerm, setSearchTerm }) {
    return (
        <div className={styles.searchBar}>
            <span className={`material-symbols-outlined ${styles.searchIcon}`}>search</span>
            <input
                type="text"
                placeholder="Buscar por nombre, usuario o email..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className={styles.searchInput}
            />
        </div>
    );
}

function EmptyState() {
    return (
        <div className={styles.emptyState}>
            <p>No se encontraron usuarios.</p>
        </div>
    );
}

export default function UsersManager({ users }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all');
    const [toast, setToast] = useState(null);
    const confirmAction = useConfirm();

    const filteredUsers = users.filter((user) => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (user.username && user.username.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesFilter = filter === 'all' ? true : user.role === 'admin';

        return matchesSearch && matchesFilter;
    });

    const handleToggleClick = async (user) => {
        const isAdminUser = user.role === 'admin';
        const confirmed = await confirmAction({
            title: isAdminUser ? 'Quitar permisos de administrador' : 'Otorgar permisos de administrador',
            message: isAdminUser
                ? `¿Seguro que quieres quitar permisos de administrador a ${user.name}?`
                : `¿Seguro que quieres otorgar permisos de administrador a ${user.name}?`,
            confirmText: isAdminUser ? 'Quitar permisos' : 'Otorgar permisos',
            cancelText: 'Cancelar',
            tone: isAdminUser ? 'danger' : 'neutral',
        });

        if (!confirmed) {
            return;
        }

        router.post(route('users.toggleRole', user.id), {}, {
            preserveScroll: true,
            onSuccess: () => {
                setToast({
                    message: `Successfully ${isAdminUser ? 'removed admin rights from' : 'granted admin rights to'} ${user.name}`,
                    type: 'success',
                });
            },
            onError: () => {
                setToast({
                    message: 'Failed to update user role. Please try again.',
                    type: 'error',
                });
            },
        });
    };

    return (
        <div className={styles.layout}>
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            <div className={styles.sidebar}>
                <div className={styles.sidebarHeader}>
                    <h2 className={styles.sidebarTitle}>Usuarios</h2>
                    <p className={styles.sidebarDescription}>Gestión de roles</p>
                </div>

                <div className={styles.sidebarFilters}>
                    {USER_FILTERS.map((filterOption) => (
                        <button
                            key={filterOption.id}
                            type="button"
                            onClick={() => setFilter(filterOption.id)}
                            className={`${styles.filterButton} ${filter === filterOption.id ? styles.filterButtonActive : ''}`}
                        >
                            {filterOption.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className={styles.content}>
                <div className={styles.searchArea}>
                    <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                </div>

                <div className={styles.tableArea}>
                    <div className={styles.tableContainer}>
                        <table className={styles.table}>
                            <thead className={styles.tableHead}>
                                <tr>
                                    <th className={styles.heading}>Nombre</th>
                                    <th className={styles.heading}>Usuario</th>
                                    <th className={styles.heading}>Correo Electrónico</th>
                                    <th className={`${styles.heading} ${styles.headingCentered}`}>Rol</th>
                                    <th className={`${styles.heading} ${styles.headingRight}`}>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} className={styles.tableRow}>
                                        <td className={`${styles.cell} ${styles.nameCell}`}>{user.name}</td>
                                        <td className={styles.cell}>{user.username || '-'}</td>
                                        <td className={styles.cell}>{user.email}</td>
                                        <td className={`${styles.cell} ${styles.cellCentered}`}>
                                            <span className={`${styles.roleBadge} ${user.role === 'admin' ? styles.roleBadgeAdmin : styles.roleBadgeUser}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className={`${styles.cell} ${styles.cellRight}`}>
                                            <button
                                                type="button"
                                                onClick={() => handleToggleClick(user)}
                                                className={`${styles.actionButton} ${user.role === 'admin' ? styles.actionButtonDanger : styles.actionButtonPrimary}`}
                                            >
                                                {user.role === 'admin' ? 'Quitar Admin' : 'Hacer Admin'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {filteredUsers.length === 0 && (
                            <EmptyState />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
