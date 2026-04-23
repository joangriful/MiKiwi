import assert from 'node:assert/strict';
import { normalizeApiError, normalizeInertiaErrors, normalizeStripeError } from './httpError.js';

function run(name, fn) {
    try {
        fn();
        console.log(`PASS ${name}`);
    } catch (error) {
        console.error(`FAIL ${name}`);
        throw error;
    }
}

run('normalizeApiError maps known backend codes to stable user-facing messages', () => {
    const normalized = normalizeApiError({
        response: {
            status: 500,
            data: {
                success: false,
                code: 'profile_image_upload_failed',
                message: 'Internal provider timeout',
            },
        },
    });

    assert.deepEqual(normalized, {
        title: 'No pudimos actualizar la foto',
        message: 'No pudimos actualizar tu foto de perfil. Inténtalo de nuevo en unos minutos.',
        code: 'profile_image_upload_failed',
        fieldErrors: null,
    });
});

run('normalizeApiError extracts first validation message from Laravel JSON errors', () => {
    const normalized = normalizeApiError({
        response: {
            status: 422,
            data: {
                message: 'The given data was invalid.',
                errors: {
                    email: ['Introduce una direccion de correo valida.'],
                },
            },
        },
    });

    assert.equal(normalized.code, 'validation_failed');
    assert.equal(normalized.message, 'Introduce una direccion de correo valida.');
    assert.deepEqual(normalized.fieldErrors, {
        email: ['Introduce una direccion de correo valida.'],
    });
});

run('normalizeInertiaErrors returns the first field error and preserves fieldErrors', () => {
    const normalized = normalizeInertiaErrors({
        newsletter: 'No pudimos completar tu suscripcion.',
    });

    assert.equal(normalized.code, 'validation_failed');
    assert.equal(normalized.message, 'No pudimos completar tu suscripcion.');
    assert.deepEqual(normalized.fieldErrors, {
        newsletter: ['No pudimos completar tu suscripcion.'],
    });
});

run('normalizeStripeError keeps explicit Stripe messages with fallback metadata', () => {
    const normalized = normalizeStripeError(
        { message: 'Tu tarjeta ha sido rechazada.' },
        { code: 'payment_method_setup_failed', title: 'No pudimos validar la tarjeta' },
    );

    assert.equal(normalized.title, 'No pudimos validar la tarjeta');
    assert.equal(normalized.code, 'payment_method_setup_failed');
    assert.equal(normalized.message, 'Tu tarjeta ha sido rechazada.');
});
