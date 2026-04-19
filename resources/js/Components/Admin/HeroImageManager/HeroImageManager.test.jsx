/* @vitest-environment jsdom */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';
import HeroImageManager from '@/Components/Admin/HeroImageManager/HeroImageManager';
import { ConfirmProvider } from '@/Shared/Confirm/ConfirmProvider';

const { deleteMock } = vi.hoisted(() => ({
    deleteMock: vi.fn(),
}));

vi.mock('@inertiajs/react', () => ({
    router: {
        post: vi.fn(),
        delete: deleteMock,
    },
}));

describe('HeroImageManager delete flow', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        globalThis.route = vi.fn((name, param) => `/${name}/${param}`);
    });

    afterEach(() => {
        cleanup();
    });

    it('confirms deletion and triggers hero image delete endpoint', async () => {
        const user = userEvent.setup();

        render(
            <ConfirmProvider>
                <HeroImageManager
                    images={[{ id: 11, url: '/assets/hero-1.jpg', public_id: 'hero_1' }]}
                />
            </ConfirmProvider>,
        );

        await user.click(screen.getByTitle('Eliminar imagen'));

        const dialog = await screen.findByRole('dialog');
        expect(within(dialog).getByRole('heading', { name: 'Eliminar imagen' })).toBeInTheDocument();

        await user.click(within(dialog).getByRole('button', { name: 'Eliminar' }));

        expect(deleteMock).toHaveBeenCalledWith('/content.hero.delete/11', {
            preserveScroll: true,
            onSuccess: expect.any(Function),
            onError: expect.any(Function),
        });

        const options = deleteMock.mock.calls[0][1];
        options.onSuccess();

        await waitFor(() => {
            expect(screen.getByText('Imagen eliminada correctamente')).toBeInTheDocument();
        });
    });

    it('shows error toast when hero image deletion fails', async () => {
        const user = userEvent.setup();

        render(
            <ConfirmProvider>
                <HeroImageManager
                    images={[{ id: 13, url: '/assets/hero-2.jpg', public_id: 'hero_2' }]}
                />
            </ConfirmProvider>,
        );

        await user.click(screen.getByTitle('Eliminar imagen'));

        const dialog = await screen.findByRole('dialog');
        await user.click(within(dialog).getByRole('button', { name: 'Eliminar' }));

        const options = deleteMock.mock.calls[0][1];
        options.onError();

        await waitFor(() => {
            expect(screen.getByText('Error al eliminar la imagen')).toBeInTheDocument();
        });
    });

    it('does not call delete endpoint when user cancels dialog', async () => {
        const user = userEvent.setup();

        render(
            <ConfirmProvider>
                <HeroImageManager
                    images={[{ id: 17, url: '/assets/hero-3.jpg', public_id: 'hero_3' }]}
                />
            </ConfirmProvider>,
        );

        await user.click(screen.getByTitle('Eliminar imagen'));

        const dialog = await screen.findByRole('dialog');
        await user.click(within(dialog).getByRole('button', { name: 'Cancelar' }));

        expect(deleteMock).not.toHaveBeenCalled();
    });
});
