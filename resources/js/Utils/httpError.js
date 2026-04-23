const DEFAULT_ERROR = {
    title: 'No se pudo completar la operación',
    message: 'No pudimos completar la operación. Inténtalo de nuevo en unos minutos.',
    code: 'unknown_error',
    fieldErrors: null,
};

const CODE_MESSAGES = {
    profile_image_upload_failed: {
        title: 'No pudimos actualizar la foto',
        message: 'No pudimos actualizar tu foto de perfil. Inténtalo de nuevo en unos minutos.',
    },
    profile_banner_upload_failed: {
        title: 'No pudimos actualizar el banner',
        message: 'No pudimos actualizar tu banner. Inténtalo de nuevo en unos minutos.',
    },
    quiz_result_save_failed: {
        title: 'No pudimos guardar tu resultado',
        message: 'No pudimos guardar tu resultado del quiz. Inténtalo de nuevo en unos minutos.',
    },
    payment_method_list_failed: {
        title: 'No pudimos cargar tus tarjetas',
        message: 'No pudimos cargar tus tarjetas guardadas. Vuelve a intentarlo en unos minutos.',
    },
    payment_method_setup_failed: {
        title: 'No pudimos iniciar el registro de la tarjeta',
        message: 'No pudimos iniciar el registro de tu tarjeta. Inténtalo de nuevo en unos minutos.',
    },
    payment_method_delete_forbidden: {
        title: 'No se pudo eliminar la tarjeta',
        message: 'No pudimos eliminar esta tarjeta porque no está disponible para tu cuenta.',
    },
    payment_method_delete_failed: {
        title: 'No se pudo eliminar la tarjeta',
        message: 'No pudimos eliminar tu tarjeta en este momento. Inténtalo de nuevo más tarde.',
    },
    checkout_cart_empty: {
        title: 'Tu carrito está vacío',
        message: 'Añade al menos un producto antes de continuar con el pago.',
    },
    checkout_payment_intent_failed: {
        title: 'No pudimos iniciar el pago',
        message: 'No pudimos iniciar el pago seguro. Inténtalo de nuevo en unos minutos.',
    },
    pickup_points_load_failed: {
        title: 'No pudimos cargar los puntos de recogida',
        message: 'No pudimos cargar los puntos de recogida disponibles. Vuelve a intentarlo en unos minutos.',
    },
};

const STATUS_ERRORS = {
    401: {
        title: 'Tu sesión ha caducado',
        message: 'Vuelve a iniciar sesión para continuar.',
        code: 'unauthenticated',
    },
    403: {
        title: 'Acción no permitida',
        message: 'No tienes permiso para realizar esta acción.',
        code: 'forbidden',
    },
    404: {
        title: 'No encontramos lo que buscas',
        message: 'No encontramos el recurso solicitado. Recarga la página e inténtalo de nuevo.',
        code: 'not_found',
    },
    422: {
        title: 'Revisa los datos introducidos',
        message: 'Hay campos pendientes o con errores. Revísalos e inténtalo de nuevo.',
        code: 'validation_failed',
    },
    500: {
        title: 'Ha ocurrido un problema interno',
        message: 'Ha ocurrido un problema interno. Inténtalo de nuevo en unos minutos.',
        code: 'server_error',
    },
};

function buildError(overrides = {}) {
    return {
        ...DEFAULT_ERROR,
        ...overrides,
    };
}

function normalizeFieldErrors(errors) {
    if (!errors || typeof errors !== 'object' || Array.isArray(errors)) {
        return null;
    }

    return Object.fromEntries(
        Object.entries(errors).map(([field, value]) => {
            if (Array.isArray(value)) {
                return [field, value];
            }

            if (typeof value === 'string' && value.trim() !== '') {
                return [field, [value]];
            }

            return [field, []];
        }),
    );
}

function getFirstFieldError(fieldErrors) {
    if (!fieldErrors) {
        return null;
    }

    for (const messages of Object.values(fieldErrors)) {
        if (Array.isArray(messages) && messages.length > 0) {
            return messages[0];
        }
    }

    return null;
}

function normalizeLaravelJsonError(responseData, status, fallback) {
    const fieldErrors = normalizeFieldErrors(responseData?.errors);
    const firstFieldError = getFirstFieldError(fieldErrors);

    if (responseData?.code && CODE_MESSAGES[responseData.code]) {
        return buildError({
            ...CODE_MESSAGES[responseData.code],
            code: responseData.code,
            fieldErrors,
        });
    }

    if (fieldErrors) {
        return buildError({
            ...(STATUS_ERRORS[422] || {}),
            message: firstFieldError || STATUS_ERRORS[422].message,
            code: responseData?.code || STATUS_ERRORS[422].code,
            fieldErrors,
        });
    }

    if (typeof responseData?.message === 'string' && responseData.message.trim() !== '') {
        return buildError({
            ...(STATUS_ERRORS[status] || {}),
            message: responseData.message,
            code: responseData?.code || STATUS_ERRORS[status]?.code || fallback.code,
        });
    }

    if (STATUS_ERRORS[status]) {
        return buildError(STATUS_ERRORS[status]);
    }

    return buildError(fallback);
}

export function normalizeApiError(error, fallback = {}) {
    const fallbackError = buildError(fallback);
    const responseData = error?.response?.data;
    const status = error?.response?.status;

    if (responseData) {
        return normalizeLaravelJsonError(responseData, status, fallbackError);
    }

    if (typeof error?.message === 'string' && error.message === 'Network Error') {
        return buildError({
            title: 'No hay conexión con el servidor',
            message: 'No pudimos conectar con el servidor. Comprueba tu conexión e inténtalo de nuevo.',
            code: 'network_error',
        });
    }

    return fallbackError;
}

export function normalizeInertiaErrors(errors, fallback = {}) {
    const fieldErrors = normalizeFieldErrors(errors);
    const fallbackError = buildError(fallback);
    const firstFieldError = getFirstFieldError(fieldErrors);

    if (fieldErrors) {
        return buildError({
            title: 'Revisa los datos introducidos',
            message: firstFieldError || 'Hay campos pendientes o con errores. Revísalos e inténtalo de nuevo.',
            code: 'validation_failed',
            fieldErrors,
        });
    }

    return fallbackError;
}

export function normalizeStripeError(error, fallback = {}) {
    const fallbackError = buildError({
        title: 'No se pudo procesar el pago',
        message: 'No pudimos procesar la información de tu tarjeta. Revisa los datos e inténtalo de nuevo.',
        code: 'stripe_error',
        ...fallback,
    });

    if (typeof error?.message === 'string' && error.message.trim() !== '') {
        return buildError({
            ...fallbackError,
            message: error.message,
        });
    }

    return fallbackError;
}

export function getApiErrorMessage(error, fallbackMessage = DEFAULT_ERROR.message) {
    return normalizeApiError(error, { message: fallbackMessage }).message;
}

export function getStripeErrorMessage(error, fallbackMessage = DEFAULT_ERROR.message) {
    return normalizeStripeError(error, { message: fallbackMessage }).message;
}
