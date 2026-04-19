/* @vitest-environment jsdom */

import { useState } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';
import { ConfirmProvider, useConfirm } from '@/Shared/Confirm/ConfirmProvider';

function ConfirmProbe() {
    const confirmAction = useConfirm();
    const [result, setResult] = useState('idle');

    const handleOpen = async () => {
        const accepted = await confirmAction({
            title: 'Eliminar producto',
            message: 'Confirma si quieres eliminar el producto.',
            confirmText: 'Eliminar',
            cancelText: 'Cancelar',
            tone: 'danger',
        });

        setResult(accepted ? 'accepted' : 'cancelled');
    };

    return (
        <div>
            <button type="button" onClick={handleOpen}>Abrir confirmación</button>
            <span>{result}</span>
        </div>
    );
}

describe('ConfirmProvider', () => {
    afterEach(() => {
        cleanup();
    });

    it('resolves true when user confirms', async () => {
        const user = userEvent.setup();

        render(
            <ConfirmProvider>
                <ConfirmProbe />
            </ConfirmProvider>,
        );

        await user.click(screen.getByRole('button', { name: 'Abrir confirmación' }));
        expect(await screen.findByRole('dialog')).toBeInTheDocument();

        await user.click(screen.getByRole('button', { name: 'Eliminar' }));
        expect(await screen.findByText('accepted')).toBeInTheDocument();
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('resolves false when user cancels from button', async () => {
        const user = userEvent.setup();

        render(
            <ConfirmProvider>
                <ConfirmProbe />
            </ConfirmProvider>,
        );

        await user.click(screen.getByRole('button', { name: 'Abrir confirmación' }));
        expect(await screen.findByRole('dialog')).toBeInTheDocument();

        await user.click(screen.getByRole('button', { name: 'Cancelar' }));
        expect(await screen.findByText('cancelled')).toBeInTheDocument();
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('resolves false when user presses Escape', async () => {
        const user = userEvent.setup();

        render(
            <ConfirmProvider>
                <ConfirmProbe />
            </ConfirmProvider>,
        );

        await user.click(screen.getByRole('button', { name: 'Abrir confirmación' }));
        expect(await screen.findByRole('dialog')).toBeInTheDocument();

        await user.keyboard('{Escape}');
        expect(await screen.findByText('cancelled')).toBeInTheDocument();
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
});
