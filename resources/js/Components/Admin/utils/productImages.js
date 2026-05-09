import { resolveProductImageUrl } from '@/Utils/productImageUrls';

const DOLL_PRODUCT_TYPE = 'doll';
const DOLL_PRODUCT_IMAGE = '/images/img_cart_doll/img_doll.jpg';

function resolveGalleryImage(images) {
    const galleryImages = typeof images === 'string' ? JSON.parse(images) : images;

    if (!Array.isArray(galleryImages) || galleryImages.length === 0) {
        return '';
    }

    return resolveProductImageUrl(galleryImages[0]);
}

export function getAdminProductImage(product = {}) {
    if (product.product_type === DOLL_PRODUCT_TYPE) {
        return DOLL_PRODUCT_IMAGE;
    }

    const primaryImage = resolveProductImageUrl(product.image_url);

    if (primaryImage) {
        return primaryImage;
    }

    try {
        return resolveGalleryImage(product.images);
    } catch {
        return '';
    }
}
