function firstString(values) {
    for (const value of values) {
        if (typeof value === 'string' && value.trim()) {
            return value.trim();
        }
    }

    return null;
}

function normalizeValidationErrors(errorsObject) {
    if (!errorsObject || typeof errorsObject !== 'object') {
        return null;
    }

    const firstEntry = Object.values(errorsObject).find((value) => {
        if (typeof value === 'string') {
            return value.trim().length > 0;
        }

        if (Array.isArray(value)) {
            return value.some((item) => typeof item === 'string' && item.trim().length > 0);
        }

        return false;
    });

    if (typeof firstEntry === 'string') {
        return firstEntry.trim();
    }

    if (Array.isArray(firstEntry)) {
        const candidate = firstEntry.find((item) => typeof item === 'string' && item.trim().length > 0);
        return candidate ? candidate.trim() : null;
    }

    return null;
}

export function getErrorMessage(error, fallback = 'Ha ocurrido un error inesperado.') {
    if (!error) {
        return fallback;
    }

    const responseData = error.response?.data;

    const directMessage = firstString([
        responseData?.message,
        responseData?.error,
        error.message,
    ]);

    if (directMessage) {
        return directMessage;
    }

    const validationMessage = normalizeValidationErrors(responseData?.errors);
    if (validationMessage) {
        return validationMessage;
    }

    return fallback;
}
