import { resolveProductImageUrl } from "@/Utils/productImageUrls";

const PLACEHOLDER_IMAGE = "https://via.placeholder.com/150";

export function getProductImage(product = {}) {
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
