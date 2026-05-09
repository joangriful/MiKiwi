import React, { useMemo, useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import Toast from '@/Components/Toast/Toast';
import styles from './UsersManager.module.css';

const USER_FILTERS = [
    { id: 'all', label: 'Todos' },
    { id: 'active', label: 'Activos' },
    { id: 'inactive', label: 'Desactivados' },
    { id: 'admin', label: 'Administradores' },
];

const ROLE_OPTIONS = [
    { value: 'customer', label: 'Cliente' },
    { value: 'admin', label: 'Administrador' },
    { value: 'support', label: 'Soporte' },
];

const EMPTY_FORM = {
    name: '',
    username: '',
    email: '',
    password: '',
    role: 'customer',
    is_active: true,
};

function formatDate(value) {
    if (!value) {
        return '-';
    }

    return new Intl.DateTimeFormat('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(value));
}

function normalizeFormUser(user) {
    return {
        name: user.name || '',
        username: user.username || '',
        email: user.email || '',
        password: '',
        role: user.role || 'customer',
        is_active: !!user.is_active,
    };
}

function getErrorMessage(errors, fallback) {
    const firstError = Object.values(errors || {})[0];

    return Array.isArray(firstError) ? firstError[0] : firstError || fallback;
}

function SearchBar({ searchTerm, onSearchTermChange }) {
    return (
        <div className={styles.searchBar}>
            <span className={`material-symbols-outlined ${styles.searchIcon}`}>search</span>
            <input
                aria-label="Buscar usuarios"
                type="text"
                placeholder="Buscar por nombre, usuario o email..."
                value={searchTerm}
                onChange={(event) => onSearchTermChange(event.target.value)}
                className={styles.searchInput}
            />
        </div>
    );
}

function EmptyState() {
    return (
        <div className={styles.emptyState}>
            <span className={`material-symbols-outlined ${styles.emptyStateIcon}`}>person_off</span>
            <p>No se encontraron usuarios.</p>
        </div>
    );
}

function UserForm({ mode, formData, selectedUser, currentUserId, isSaving, onChange, onCancel, onSubmit }) {
    const isEditing = mode === 'edit';
    const isEditingSelf = selectedUser?.id === currentUserId;

    return (
        <form className={styles.formPanel} onSubmit={onSubmit}>
            <div className={styles.panelHeader}>
                <div>
                    <h3 className={styles.panelTitle}>{isEditing ? 'Editar usuario' : 'Crear usuario'}</h3>
                    <p className={styles.panelDescription}>
                        {isEditing ? 'Actualiza los datos principales del usuario.' : 'Añade un usuario nuevo al sistema.'}
                    </p>
                </div>
                {isEditing && (
                    <button type="button" className={styles.secondaryButton} onClick={onCancel}>
                        Cancelar
                    </button>
                )}
            </div>

            <div className={styles.formGrid}>
                <label className={styles.field}>
                    <span>Nombre</span>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(event) => onChange('name', event.target.value)}
                        className={styles.input}
                        required
                    />
                </label>
                <label className={styles.field}>
                    <span>Usuario</span>
                    <input
                        type="text"
                        value={formData.username}
                        onChange={(event) => onChange('username', event.target.value)}
                        className={styles.input}
                    />
                </label>
                <label className={styles.field}>
                    <span>Email</span>
                    <input
                        type="email"
                        value={formData.email}
                        onChange={(event) => onChange('email', event.target.value)}
                        className={styles.input}
                        required
                    />
                </label>
                <label className={styles.field}>
                    <span>{isEditing ? 'Nueva contraseña' : 'Contraseña'}</span>
                    <input
                        type="password"
                        value={formData.password}
                        onChange={(event) => onChange('password', event.target.value)}
                        className={styles.input}
                        minLength={8}
                        required={!isEditing}
                        placeholder={isEditing ? 'Mantener actual' : ''}
                    />
                </label>
                <label className={styles.field}>
                    <span>Rol</span>
                    <select
                        value={formData.role}
                        onChange={(event) => onChange('role', event.target.value)}
                        className={styles.input}
                        disabled={isEditingSelf}
                    >
                        {ROLE_OPTIONS.map((role) => (
                            <option key={role.value} value={role.value}>{role.label}</option>
                        ))}
                    </select>
                </label>
                {!isEditing && (
                    <label className={styles.checkboxField}>
                        <input
                            type="checkbox"
                            checked={formData.is_active}
                            onChange={(event) => onChange('is_active', event.target.checked)}
                        />
                        <span>Usuario activo</span>
                    </label>
                )}
            </div>

            <div className={styles.formActions}>
                <button type="submit" className={styles.primaryButton} disabled={isSaving}>
                    {isSaving ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Crear usuario'}
                </button>
            </div>
        </form>
    );
}

function UserDetails({ user, onClose }) {
    if (!user) {
        return null;
    }

    return (
        <aside className={styles.detailsPanel} aria-label={`Detalle de ${user.name}`}>
            <div className={styles.panelHeader}>
                <div>
                    <h3 className={styles.panelTitle}>{user.name}</h3>
                    <p className={styles.panelDescription}>{user.email}</p>
                </div>
                <button type="button" className={styles.iconButton} onClick={onClose} aria-label="Cerrar detalle">
                    <span className="material-symbols-outlined">close</span>
                </button>
            </div>
            <dl className={styles.detailsList}>
                <div>
                    <dt>Usuario</dt>
                    <dd>{user.username || '-'}</dd>
                </div>
                <div>
                    <dt>Rol</dt>
                    <dd>{user.role}</dd>
                </div>
                <div>
                    <dt>Estado</dt>
                    <dd>{user.is_active ? 'Activo' : 'Desactivado'}</dd>
                </div>
                <div>
                    <dt>Email verificado</dt>
                    <dd>{user.email_verified_at ? 'Sí' : 'No'}</dd>
                </div>
                <div>
                    <dt>Creado</dt>
                    <dd>{formatDate(user.created_at)}</dd>
                </div>
                <div>
                    <dt>Actualizado</dt>
                    <dd>{formatDate(user.updated_at)}</dd>
                </div>
            </dl>
        </aside>
    );
}

export default function UsersManager({ users = [] }) {
    const currentUserId = usePage().props.auth?.user?.id;
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all');
    const [toast, setToast] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState(EMPTY_FORM);
    const [saving, setSaving] = useState(false);
    const [loadingAction, setLoadingAction] = useState(null);

    const filteredUsers = useMemo(() => users.filter((user) => {
        const query = searchTerm.trim().toLowerCase();
        const matchesSearch = !query ||
            user.name?.toLowerCase().includes(query) ||
            user.email?.toLowerCase().includes(query) ||
            user.username?.toLowerCase().includes(query);

        const matchesFilter = {
            all: true,
            active: user.is_active,
            inactive: !user.is_active,
            admin: user.role === 'admin',
        }[filter];

        return matchesSearch && matchesFilter;
    }), [users, searchTerm, filter]);

    const counts = useMemo(() => ({
        all: users.length,
        active: users.filter((user) => user.is_active).length,
        inactive: users.filter((user) => !user.is_active).length,
        admin: users.filter((user) => user.role === 'admin').length,
    }), [users]);

    const updateForm = (field, value) => {
        setFormData((current) => ({ ...current, [field]: value }));
    };

    const resetForm = () => {
        setEditingUser(null);
        setFormData(EMPTY_FORM);
    };

    const editUser = (user) => {
        setEditingUser(user);
        setSelectedUser(user);
        setFormData(normalizeFormUser(user));
    };

    const submitForm = (event) => {
        event.preventDefault();
        setSaving(true);

        const payload = {
            ...formData,
            username: formData.username || null,
        };

        const options = {
            preserveScroll: true,
            onSuccess: () => {
                setToast({ message: editingUser ? 'Usuario actualizado' : 'Usuario creado', type: 'success' });
                setSaving(false);
                resetForm();
            },
            onError: (errors) => {
                setToast({ message: getErrorMessage(errors, 'No se pudo guardar el usuario.'), type: 'error' });
                setSaving(false);
            },
        };

        if (editingUser) {
            router.put(route('users.update', editingUser.id), payload, options);
            return;
        }

        router.post(route('users.store'), payload, options);
    };

    const toggleRole = (user) => {
        setLoadingAction(`role-${user.id}`);
        router.post(route('users.toggleRole', user.id), {}, {
            preserveScroll: true,
            onSuccess: () => {
                setToast({ message: 'Rol actualizado', type: 'success' });
                setLoadingAction(null);
            },
            onError: (errors) => {
                setToast({ message: getErrorMessage(errors, 'No se pudo actualizar el rol.'), type: 'error' });
                setLoadingAction(null);
            },
        });
    };

    const toggleActive = (user) => {
        setLoadingAction(`active-${user.id}`);
        router.patch(route('users.toggleActive', user.id), {}, {
            preserveScroll: true,
            onSuccess: () => {
                setToast({ message: user.is_active ? 'Usuario desactivado' : 'Usuario activado', type: 'success' });
                setLoadingAction(null);
            },
            onError: (errors) => {
                setToast({ message: getErrorMessage(errors, 'No se pudo actualizar el estado.'), type: 'error' });
                setLoadingAction(null);
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

            <aside className={styles.sidebar}>
                <div className={styles.sidebarHeader}>
                    <h2 className={styles.sidebarTitle}>Usuarios</h2>
                    <p className={styles.sidebarDescription}>Lectura, creación, edición y estado</p>
                </div>

                <div className={styles.sidebarFilters}>
                    {USER_FILTERS.map((filterOption) => (
                        <button
                            key={filterOption.id}
                            type="button"
                            onClick={() => setFilter(filterOption.id)}
                            className={`${styles.filterButton} ${filter === filterOption.id ? styles.filterButtonActive : ''}`}
                        >
                            <span>{filterOption.label}</span>
                            <span className={styles.filterCount}>{counts[filterOption.id]}</span>
                        </button>
                    ))}
                </div>
            </aside>

            <main className={styles.content}>
                <div className={styles.searchArea}>
                    <SearchBar searchTerm={searchTerm} onSearchTermChange={setSearchTerm} />
                    <button type="button" className={styles.primaryButton} onClick={resetForm}>
                        Nuevo usuario
                    </button>
                </div>

                <div className={styles.workspace}>
                    <section className={styles.tableArea}>
                        <div className={styles.tableContainer}>
                            <table className={styles.table}>
                                <thead className={styles.tableHead}>
                                    <tr>
                                        <th className={styles.heading}>Nombre</th>
                                        <th className={styles.heading}>Usuario</th>
                                        <th className={styles.heading}>Correo</th>
                                        <th className={`${styles.heading} ${styles.headingCentered}`}>Rol</th>
                                        <th className={`${styles.heading} ${styles.headingCentered}`}>Estado</th>
                                        <th className={`${styles.heading} ${styles.headingRight}`}>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.map((user) => {
                                        const isSelf = user.id === currentUserId;

                                        return (
                                            <tr key={user.id} className={styles.tableRow}>
                                                <td className={`${styles.cell} ${styles.nameCell}`}>{user.name}</td>
                                                <td className={styles.cell}>{user.username || '-'}</td>
                                                <td className={styles.cell}>{user.email}</td>
                                                <td className={`${styles.cell} ${styles.cellCentered}`}>
                                                    <span className={`${styles.roleBadge} ${user.role === 'admin' ? styles.roleBadgeAdmin : styles.roleBadgeUser}`}>
                                                        {user.role}
                                                    </span>
                                                </td>
                                                <td className={`${styles.cell} ${styles.cellCentered}`}>
                                                    <span className={`${styles.statusBadge} ${user.is_active ? styles.statusBadgeActive : styles.statusBadgeInactive}`}>
                                                        {user.is_active ? 'Activo' : 'Desactivado'}
                                                    </span>
                                                </td>
                                                <td className={`${styles.cell} ${styles.cellRight}`}>
                                                    <div className={styles.actionGroup}>
                                                        <button type="button" className={styles.iconButton} onClick={() => setSelectedUser(user)} aria-label={`Ver ${user.name}`}>
                                                            <span className="material-symbols-outlined">visibility</span>
                                                        </button>
                                                        <button type="button" className={styles.iconButton} onClick={() => editUser(user)} aria-label={`Editar ${user.name}`}>
                                                            <span className="material-symbols-outlined">edit</span>
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => toggleRole(user)}
                                                            disabled={isSelf || loadingAction === `role-${user.id}`}
                                                            className={`${styles.actionButton} ${user.role === 'admin' ? styles.actionButtonDanger : styles.actionButtonPrimary}`}
                                                        >
                                                            {user.role === 'admin' ? 'Quitar admin' : 'Hacer admin'}
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => toggleActive(user)}
                                                            disabled={isSelf || loadingAction === `active-${user.id}`}
                                                            className={`${styles.actionButton} ${user.is_active ? styles.actionButtonDanger : styles.actionButtonPrimary}`}
                                                        >
                                                            {user.is_active ? 'Desactivar' : 'Activar'}
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>

                            {filteredUsers.length === 0 && (
                                <EmptyState />
                            )}
                        </div>
                    </section>

                    <div className={styles.sidePanels}>
                        <UserForm
                            mode={editingUser ? 'edit' : 'create'}
                            formData={formData}
                            selectedUser={editingUser}
                            currentUserId={currentUserId}
                            isSaving={saving}
                            onChange={updateForm}
                            onCancel={resetForm}
                            onSubmit={submitForm}
                        />
                        <UserDetails user={selectedUser} onClose={() => setSelectedUser(null)} />
                    </div>
                </div>
            </main>
        </div>
    );
}
