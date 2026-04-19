/* @vitest-environment jsdom */

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';
import CartStep from '@/Components/Checkout/CartStep/CartStep';
import { ConfirmProvider } from '@/Shared/Confirm/ConfirmProvider';

const mockDestroy = vi.fn();

vi.mock('@inertiajs/react', () => ({
    Link: ({ children, href, ...props }) => (
        <a href={href} {...props}>{children}</a>
    ),
    router: {
        post: vi.fn(),
        patch: vi.fn(),
    },
    useForm: () => ({
        delete: mockDestroy,
        processing: false,
    }),
}));

function renderCartStep() {
    const cart = {
        items: [
            {
                product_id: 10,
                quantity: 1,
                subtotal: 49.99,
                product: {
                    slug: 'mobi',
                    name: 'Mobi',
                    base_price: 49.99,
                    images: JSON.stringify(['/assets/mobi.jpg']),
                },
            },
        ],
        total: 49.99,
    };

    return render(
        <ConfirmProvider>
            <CartStep cart={cart} onNext={() => {}} popularProducts={[]} />
        </ConfirmProvider>,
    );
}

describe('CartStep confirmation flow', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        globalThis.route = vi.fn((name, param) => {
            if (typeof param !== 'undefined') {
                return `/${name}/${param}`;
            }

            return `/${name}`;
        });
    });

    it('opens confirm dialog and deletes item after confirmation', async () => {
        const user = userEvent.setup();
        renderCartStep();

        await user.click(screen.getByRole('button', { name: 'Eliminar' }));

        const dialog = await screen.findByRole('dialog');
        expect(within(dialog).getByText('Eliminar producto')).toBeInTheDocument();

        await user.click(within(dialog).getByRole('button', { name: 'Eliminar' }));

        expect(mockDestroy).toHaveBeenCalledWith('/cart.remove/10', {
            preserveScroll: true,
        });
    });
});
