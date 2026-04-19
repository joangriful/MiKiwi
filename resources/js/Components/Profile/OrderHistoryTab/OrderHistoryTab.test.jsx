/* @vitest-environment jsdom */

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';
import OrderHistoryTab from '@/Components/Profile/OrderHistoryTab/OrderHistoryTab';
import { ConfirmProvider } from '@/Shared/Confirm/ConfirmProvider';

const { patchMock } = vi.hoisted(() => ({
    patchMock: vi.fn(),
}));

vi.mock('@inertiajs/react', () => ({
    usePage: () => ({
        props: {
            flash: {},
        },
    }),
    router: {
        patch: patchMock,
    },
}));

function renderOrderHistory() {
    const orders = [
        {
            id: 7,
            order_number: 'MK-0007',
            status: 'pending',
            total_amount: '39.90',
            created_at: '2026-01-10T10:00:00.000Z',
            items: [
                { product_name_snapshot: 'Mobi', quantity: 1, unit_price: '39.90' },
            ],
            shipping_address_snapshot: {
                full_name: 'Test User',
                street_address: 'Calle Falsa 123',
                postal_code: '28001',
                city: 'Madrid',
                country: 'España',
            },
        },
    ];

    return render(
        <ConfirmProvider>
            <OrderHistoryTab orders={orders} />
        </ConfirmProvider>,
    );
}

describe('OrderHistoryTab cancellation flow', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        globalThis.route = vi.fn((name, param) => `/${name}/${param}`);
    });

    it('opens confirmation modal and calls cancellation endpoint', async () => {
        const user = userEvent.setup();
        renderOrderHistory();

        await user.click(screen.getByRole('button', { name: 'Cancelar pedido' }));

        const dialog = await screen.findByRole('dialog');
        expect(within(dialog).getByRole('heading', { name: 'Cancelar pedido' })).toBeInTheDocument();

        await user.click(within(dialog).getByRole('button', { name: 'Cancelar pedido' }));

        expect(patchMock).toHaveBeenCalledWith('/orders.cancel/7', {}, {
            onFinish: expect.any(Function),
        });
    });
});
