import { resolveProductImageUrl } from "@/Utils/productImageUrls";

const PLACEHOLDER_IMAGE = "https://via.placeholder.com/150";
const PREFAB_DOLL_THUMBNAIL = "/images/mannequin-base-skin.png";
const PREFAB_DOLL_SLUGS = new Set([
    "queen-doll",
    "hat-doll",
    "bikini-doll",
    "witch-doll",
]);

export function getProductImage(product = {}) {
    if (PREFAB_DOLL_SLUGS.has(product.slug)) {
        return PREFAB_DOLL_THUMBNAIL;
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
