/* @vitest-environment jsdom */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';
import UsersManager from '@/Components/Admin/UsersManager/UsersManager';
import { ConfirmProvider } from '@/Shared/Confirm/ConfirmProvider';

const { postMock } = vi.hoisted(() => ({
    postMock: vi.fn(),
}));

vi.mock('@inertiajs/react', () => ({
    router: {
        post: postMock,
    },
}));

function renderUsersManager() {
    const users = [
        {
            id: 1,
            name: 'Admin User',
            email: 'admin@test.com',
            username: 'admin',
            role: 'admin',
        },
        {
            id: 2,
            name: 'Regular User',
            email: 'user@test.com',
            username: 'user',
            role: 'user',
        },
    ];

    return render(
        <ConfirmProvider>
            <UsersManager users={users} />
        </ConfirmProvider>,
    );
}

describe('UsersManager admin role flow', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        globalThis.route = vi.fn((name, param) => `/${name}/${param}`);
    });

    afterEach(() => {
        cleanup();
    });

    it('confirms role update and shows success toast', async () => {
        const user = userEvent.setup();
        renderUsersManager();

        await user.click(screen.getByRole('button', { name: 'Hacer Admin' }));

        const dialog = await screen.findByRole('dialog');
        expect(within(dialog).getByRole('heading', { name: 'Otorgar permisos de administrador' })).toBeInTheDocument();

        await user.click(within(dialog).getByRole('button', { name: 'Otorgar permisos' }));

        expect(postMock).toHaveBeenCalledWith('/users.toggleRole/2', {}, {
            preserveScroll: true,
            onSuccess: expect.any(Function),
            onError: expect.any(Function),
        });

        const options = postMock.mock.calls[0][2];
        options.onSuccess();

        await waitFor(() => {
            expect(screen.getByText('Successfully granted admin rights to Regular User')).toBeInTheDocument();
        });
    });

    it('shows error toast when role update fails', async () => {
        const user = userEvent.setup();
        renderUsersManager();

        await user.click(screen.getByRole('button', { name: 'Quitar Admin' }));

        const dialog = await screen.findByRole('dialog');
        await user.click(within(dialog).getByRole('button', { name: 'Quitar permisos' }));

        const options = postMock.mock.calls[0][2];
        options.onError();

        await waitFor(() => {
            expect(screen.getByText('Failed to update user role. Please try again.')).toBeInTheDocument();
        });
    });

    it('does not call endpoint when user cancels confirmation', async () => {
        const user = userEvent.setup();
        renderUsersManager();

        await user.click(screen.getByRole('button', { name: 'Quitar Admin' }));

        const dialog = await screen.findByRole('dialog');
        await user.click(within(dialog).getByRole('button', { name: 'Cancelar' }));

        expect(postMock).not.toHaveBeenCalled();
    });
});
