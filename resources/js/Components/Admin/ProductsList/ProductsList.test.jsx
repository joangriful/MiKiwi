/* @vitest-environment jsdom */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';
import { toast } from 'react-toastify';
import ProductsList from '@/Components/Admin/ProductsList/ProductsList';
import { ConfirmProvider } from '@/Shared/Confirm/ConfirmProvider';

const { deleteMock } = vi.hoisted(() => ({
    deleteMock: vi.fn(),
}));

vi.mock('@inertiajs/react', () => ({
    router: {
        delete: deleteMock,
    },
}));

vi.mock('react-toastify', () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn(),
    },
}));

function renderProductsList() {
    const products = [
        {
            id: 1,
            name: 'Mobi One',
            sku: 'MB-001',
            image_url: '/assets/mobi.jpg',
            category: { name: 'Colección' },
            base_price: 59.9,
            stock_quantity: 5,
            is_active: true,
        },
    ];

    return render(
        <ConfirmProvider>
            <ProductsList products={products} onEdit={() => {}} />
        </ConfirmProvider>,
    );
}

describe('ProductsList delete flow', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        globalThis.route = vi.fn((name, param) => `/${name}/${param}`);
    });

    afterEach(() => {
        cleanup();
    });

    it('confirms deletion and reports success toast', async () => {
        const user = userEvent.setup();
        renderProductsList();

        await user.click(screen.getByTitle('Eliminar'));

        const dialog = await screen.findByRole('dialog');
        expect(within(dialog).getByText('Eliminar producto')).toBeInTheDocument();

        await user.click(within(dialog).getByRole('button', { name: 'Eliminar' }));

        expect(deleteMock).toHaveBeenCalledWith('/products.delete/1', {
            onSuccess: expect.any(Function),
            onError: expect.any(Function),
        });

        const options = deleteMock.mock.calls[0][1];
        options.onSuccess();

        await waitFor(() => {
            expect(toast.success).toHaveBeenCalledWith('Producto eliminado correctamente');
        });
    });

    it('shows error toast when deletion callback fails', async () => {
        const user = userEvent.setup();
        renderProductsList();

        await user.click(screen.getByTitle('Eliminar'));

        const dialog = await screen.findByRole('dialog');
        await user.click(within(dialog).getByRole('button', { name: 'Eliminar' }));

        const options = deleteMock.mock.calls[0][1];
        options.onError();

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('Error al eliminar el producto');
        });
    });

    it('does not call delete endpoint when user cancels dialog', async () => {
        const user = userEvent.setup();
        renderProductsList();

        await user.click(screen.getByTitle('Eliminar'));

        const dialog = await screen.findByRole('dialog');
        await user.click(within(dialog).getByRole('button', { name: 'Cancelar' }));

        expect(deleteMock).not.toHaveBeenCalled();
        expect(toast.success).not.toHaveBeenCalled();
        expect(toast.error).not.toHaveBeenCalled();
    });
});
