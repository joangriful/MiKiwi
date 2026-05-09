export const DEFAULT_READY_DOLL_MODELS = [
    {
        id: 'naked_queen',
        name: 'Queen',
        path: '/models/naked-queen/source/NakedQueen.fbx',
        texturePath: '/models/naked-queen/textures/NakedQueen.jpeg',
        thumbnail: null,
        productSku: 'DOLL-QUEEN-001',
        productSlug: 'queen-doll',
        rotationY: 0,
    },
    {
        id: 'naked_woman_standing',
        name: 'Hat',
        path: '/models/naked-woman-standing/source/Nake-Sum_Wom_RtStand_875.fbx',
        texturePath: '/models/naked-woman-standing/textures/Nake-Sum_Wom_RtStand_diffuse_875.png',
        normalPath: '/models/naked-woman-standing/textures/Nake-Sum_Wom_RtStand_normal_875.png',
        thumbnail: null,
        productSku: 'DOLL-HAT-001',
        productSlug: 'hat-doll',
        rotationY: Math.PI,
    },
    {
        id: 'naked_woman_walk',
        name: 'Bikini',
        path: '/models/naked-woman-walk/source/Nake-Sum_Wom_RtWalk_854.fbx',
        texturePath: '/models/naked-woman-walk/textures/Nake-Sum_Wom_RtWalk_diffuse_854.png',
        normalPath: '/models/naked-woman-walk/textures/Nake-Sum_Wom_RtWalk_normal_854.png',
        thumbnail: null,
        productSku: 'DOLL-BIKINI-001',
        productSlug: 'bikini-doll',
        rotationY: 0,
    },
    {
        id: 'witch_naked',
        name: 'Witch',
        path: '/models/witch-naked/source/Yennefer_Naked_med.fbx',
        texturePath: '/models/witch-naked/textures/Yennefer_Naked_med.jpeg',
        thumbnail: null,
        productSku: 'DOLL-WITCH-001',
        productSlug: 'witch-doll',
        rotationY: 0,
    },
];

export function buildReadyDollModels(readyDollProducts = []) {
    const productsBySku = new Map(readyDollProducts.map((product) => [product.sku, product]));

    return DEFAULT_READY_DOLL_MODELS.map((model) => {
        const product = productsBySku.get(model.productSku);

        if (!product) {
            return model;
        }

        return {
            ...model,
            name: product.name || model.name,
            productSlug: product.slug || model.productSlug,
        };
    });
}
