const CATEGORY_LABELS = {
    boca: 'Boca',
    cejas: 'Cejas',
    complementos: 'Complementos',
    cuerpo: 'Cuerpo',
    manos: 'Manos',
    nariz: 'Nariz',
    ojos: 'Ojos',
    orejas: 'Orejas',
    pecas: 'Pecas',
    pechos: 'Pechos',
    pelo: 'Pelo',
    pies: 'Pies',
    ropa: 'Ropa',
    vagina: 'Vagina',
    vello: 'Vello',
    vientre: 'Vientre',
};

const CATEGORY_ORDER = [
    'cuerpo',
    'pelo',
    'ojos',
    'cejas',
    'boca',
    'nariz',
    'orejas',
    'manos',
    'pies',
    'vientre',
    'pechos',
    'vagina',
    'vello',
    'ropa',
    'complementos',
    'pecas',
];

const HIDDEN_PART_PATHS = new Set([
    '/images/doll_parts_ps/front/boca/doll_0001s_0003s_0000_boca-7.png',
    '/images/doll_parts_ps/front/nariz/doll_0001s_0002s_0003_nariz2.png',
    '/images/doll_parts_ps/front/ropa/_0003s_0000s_0001_tanga_BLANCO.png',
]);

export function getCategoryLabel(category) {
    return CATEGORY_LABELS[category] ?? capitalize(category);
}

export function normalizePartPath(part) {
    const rawPath = part?.path || part?.url || part?.thumbnail || '';

    if (!rawPath) {
        return '';
    }

    return `/${String(rawPath).replace(/^\/+/, '')}`;
}

export function ensurePreselectedSelections(views, currentSelections = {}, configuratorRules = {}) {
    const nextSelections = {
        front: { ...(currentSelections.front || {}) },
        back: { ...(currentSelections.back || {}) },
    };

    const lockedCategories = configuratorRules.preselectedCategories || [];

    lockedCategories.forEach((category) => {
        ['front', 'back'].forEach((view) => {
            if (nextSelections[view]?.[category]) {
                return;
            }

            const items = views?.[view]?.[category] || [];

            if (items.length === 1) {
                nextSelections[view][category] = items[0];
            }
        });
    });

    return nextSelections;
}

export function filterHiddenPartsFromViews(views = {}) {
    return Object.fromEntries(
        Object.entries(views).map(([view, categories]) => [
            view,
            Object.fromEntries(
                Object.entries(categories || {}).map(([category, parts]) => [
                    category,
                    (parts || []).filter((part) => !isHiddenPart(part)),
                ]),
            ),
        ]),
    );
}

export function filterHiddenPartsFromSelections(selections = {}) {
    return Object.fromEntries(
        Object.entries(selections).map(([view, categories]) => [
            view,
            Object.fromEntries(
                Object.entries(categories || {}).filter(([, part]) => !isHiddenPart(part)),
            ),
        ]),
    );
}

export function getConfigurationEntries(allSelections = {}, configuratorRules = {}) {
    const partSurcharges = configuratorRules.partSurcharges || {};
    const categorySurcharges = configuratorRules.categorySurcharges || {};
    const seenCategories = new Set();
    const entries = [];

    Object.entries(allSelections).forEach(([view, categories]) => {
        Object.entries(categories || {}).forEach(([category, part]) => {
            if (!part) {
                return;
            }

            if (seenCategories.has(category)) {
                return;
            }

            seenCategories.add(category);

            const path = normalizePartPath(part);
            const extraPrice = partSurcharges[path] ?? categorySurcharges[category] ?? 0;

            entries.push({
                key: `${view}-${category}-${part.id}`,
                view,
                category,
                categoryLabel: getCategoryLabel(category),
                partId: part.id,
                label: getPartDisplayLabel(category, part),
                path,
                extraPrice,
                hasSpecialPrice: extraPrice > 0,
            });
        });
    });

    return entries.sort((entryA, entryB) => {
        const orderA = CATEGORY_ORDER.indexOf(entryA.category);
        const orderB = CATEGORY_ORDER.indexOf(entryB.category);

        if (orderA !== -1 && orderB !== -1) {
            return orderA - orderB;
        }

        if (orderA !== -1) {
            return -1;
        }

        if (orderB !== -1) {
            return 1;
        }

        return entryA.category.localeCompare(entryB.category);
    });
}

export function getMissingRequiredCategories(allSelections = {}, configuratorRules = {}, views = {}) {
    const frontSelections = allSelections.front || {};
    const availableFrontCategories = views.front || {};
    const requiredCategories = (configuratorRules.requiredFrontCategories || []).filter((category) => {
        const categoryParts = availableFrontCategories[category] || [];

        return categoryParts.length > 0;
    });

    return requiredCategories.filter((category) => !frontSelections[category]);
}

export function buildConfigurationPayload(allSelections = {}) {
    const selectedParts = {};

    Object.entries(allSelections).forEach(([view, categories]) => {
        selectedParts[view] = {};

        Object.entries(categories || {}).forEach(([category, part]) => {
            if (!part) {
                return;
            }

            selectedParts[view][category] = {
                id: part.id,
                label: getPartDisplayLabel(category, part),
                path: normalizePartPath(part),
            };
        });
    });

    return { selected_parts: selectedParts };
}

export function calculateConfigurationTotal(basePrice, entries = []) {
    const extrasTotal = entries.reduce((total, entry) => total + entry.extraPrice, 0);

    return {
        basePrice: Number(basePrice || 0),
        extrasTotal,
        total: Number(basePrice || 0) + extrasTotal,
    };
}

export function getPartExtraPrice(category, item, configuratorRules = {}) {
    if (!item) {
        return 0;
    }

    const path = normalizePartPath(item);

    return configuratorRules.partSurcharges?.[path] ?? configuratorRules.categorySurcharges?.[category] ?? 0;
}

function capitalize(value = '') {
    return value.charAt(0).toUpperCase() + value.slice(1);
}

function getPartDisplayLabel(category, part) {
    if (category === 'pecas') {
        return 'Pecas';
    }

    if (category === 'cuerpo') {
        return 'Cuerpo';
    }

    return part?.label || part?.name || part?.id || getCategoryLabel(category);
}

function isHiddenPart(part) {
    return HIDDEN_PART_PATHS.has(normalizePartPath(part));
}
