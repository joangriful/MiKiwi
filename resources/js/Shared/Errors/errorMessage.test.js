import { describe, expect, it } from 'vitest';
import { getErrorMessage } from '@/Shared/Errors/errorMessage';

describe('getErrorMessage', () => {
    it('returns response message when available', () => {
        const error = {
            response: {
                data: {
                    message: 'No se pudo procesar el pago.',
                },
            },
        };

        expect(getErrorMessage(error)).toBe('No se pudo procesar el pago.');
    });

    it('returns response error when message is missing', () => {
        const error = {
            response: {
                data: {
                    error: 'Credenciales inválidas.',
                },
            },
        };

        expect(getErrorMessage(error)).toBe('Credenciales inválidas.');
    });

    it('extracts first validation error from errors object', () => {
        const error = {
            response: {
                data: {
                    errors: {
                        email: ['El email es obligatorio.'],
                    },
                },
            },
        };

        expect(getErrorMessage(error)).toBe('El email es obligatorio.');
    });

    it('falls back to generic message when no details exist', () => {
        expect(getErrorMessage(null, 'Error genérico')).toBe('Error genérico');
    });
});
