export function resolveProductImageUrl(image) {
    if (typeof image === 'string') {
        return image;
    }

    return image?.url || image?.image_url || image?.secure_url || '';
}
