/* @vitest-environment jsdom */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';
import { toast } from 'react-toastify';
import CardsTab from '@/Components/Profile/CardsTab/CardsTab';
import { ConfirmProvider } from '@/Shared/Confirm/ConfirmProvider';

const { deleteCardMock, reloadCardsMock } = vi.hoisted(() => ({
    deleteCardMock: vi.fn(),
    reloadCardsMock: vi.fn(),
}));

vi.mock('@inertiajs/react', () => ({
    usePage: () => ({
        props: {
            stripeKey: 'pk_test_123',
            auth: {
                user: {
                    role: 'user',
                },
            },
        },
    }),
}));

vi.mock('@stripe/stripe-js', () => ({
    loadStripe: vi.fn(() => ({ id: 'stripe-instance' })),
}));

vi.mock('@stripe/react-stripe-js', () => ({
    Elements: ({ children }) => <div>{children}</div>,
    CardElement: () => null,
    useStripe: () => null,
    useElements: () => null,
}));

vi.mock('@/Features/Payments/hooks/usePaymentMethods', () => ({
    default: () => ({
        cards: [
            {
                id: 'pm_1',
                card: {
                    brand: 'visa',
                    last4: '4242',
                    exp_month: '12',
                    exp_year: '2030',
                },
                billing_details: {
                    name: 'Test Holder',
                },
            },
        ],
        isLoadingCards: false,
        cardsError: null,
        reloadCards: reloadCardsMock,
        deleteCard: deleteCardMock,
    }),
}));

vi.mock('react-toastify', () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn(),
    },
}));

describe('CardsTab destructive flow', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        cleanup();
    });

    it('confirms card deletion and executes delete action', async () => {
        const user = userEvent.setup();

        render(
            <ConfirmProvider>
                <CardsTab />
            </ConfirmProvider>,
        );

        await user.click(screen.getByTitle('Eliminar tarjeta'));

        const dialog = await screen.findByRole('dialog');
        expect(within(dialog).getByRole('heading', { name: 'Eliminar tarjeta' })).toBeInTheDocument();

        await user.click(within(dialog).getByRole('button', { name: 'Eliminar' }));

        expect(deleteCardMock).toHaveBeenCalledWith('pm_1');
        expect(toast.success).toHaveBeenCalledWith('Tarjeta eliminada correctamente.');
    });

    it('shows error toast when card deletion fails', async () => {
        deleteCardMock.mockRejectedValueOnce(new Error('No se pudo eliminar la tarjeta'));
        const user = userEvent.setup();

        render(
            <ConfirmProvider>
                <CardsTab />
            </ConfirmProvider>,
        );

        await user.click(screen.getByTitle('Eliminar tarjeta'));

        const dialog = await screen.findByRole('dialog');
        await user.click(within(dialog).getByRole('button', { name: 'Eliminar' }));

        expect(deleteCardMock).toHaveBeenCalledWith('pm_1');
        expect(toast.error).toHaveBeenCalledWith('No se pudo eliminar la tarjeta');
    });

    it('does not execute card deletion when user cancels dialog', async () => {
        const user = userEvent.setup();

        render(
            <ConfirmProvider>
                <CardsTab />
            </ConfirmProvider>,
        );

        await user.click(screen.getByTitle('Eliminar tarjeta'));

        const dialog = await screen.findByRole('dialog');
        await user.click(within(dialog).getByRole('button', { name: 'Cancelar' }));

        expect(deleteCardMock).not.toHaveBeenCalled();
        expect(toast.success).not.toHaveBeenCalled();
        expect(toast.error).not.toHaveBeenCalled();
    });
});
