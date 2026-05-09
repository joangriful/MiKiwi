import { resolveProductImageUrl } from "@/Utils/productImageUrls";

const PLACEHOLDER_IMAGE = "https://via.placeholder.com/150";
const DOLL_CART_IMAGE = "/images/img_cart_doll/img_doll.jpg";
const DOLL_PRODUCT_TYPE = "doll";

export function getProductImage(product = {}) {
    if (product.product_type === DOLL_PRODUCT_TYPE) {
        return DOLL_CART_IMAGE;
    }

    const primaryImage = resolveProductImageUrl(product.image_url);

    if (primaryImage) {
        return primaryImage;
    }

    try {
        const images =
            typeof product.images === "string"
                ? JSON.parse(product.images)
                : product.images;

        if (Array.isArray(images) && images.length > 0) {
            const imageUrl = resolveProductImageUrl(images[0]);

            if (imageUrl) {
                return imageUrl;
            }
        }
    } catch {
        // Invalid image payloads fall back to the primary image URL below.
    }

    return product.image_url || PLACEHOLDER_IMAGE;
}
