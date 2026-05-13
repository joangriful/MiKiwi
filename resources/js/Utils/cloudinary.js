/**
 * Generates a Cloudinary URL with specified transformations.
 *
 * @param {string} path - The image path (e.g., 'folder/image.png' or full URL).
 * @param {object} options - Transformation options.
 * @param {string} [options.transformations] - Comma-separated transformations (e.g., 'f_auto,q_auto').
 * @returns {string} - The complete Cloudinary URL.
 */
export const getCloudinaryUrl = (path, options = {}) => {
    if (!path) return '';

    if (path.startsWith('/')) return path;
    const transformations = options.transformations || 'f_auto,q_auto';

    if (path.startsWith('http')) {
        if (!path.includes('/image/upload/')) {
            return path;
        }

        if (path.includes(`/${transformations}/`)) {
            return path;
        }

        return path.replace('/image/upload/', `/image/upload/${transformations}/`);
    }

    const baseUrl = import.meta.env.VITE_CLOUDINARY_URL || '';

    // Ensure baseUrl ends with a slash if it exists
    const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;

    // Construct URL: Base + Transformations + / + Path
    // Cloudinary URL structure: https://res.cloudinary.com/<cloud_name>/image/upload/<transformations>/<version>/<public_id>

    // Remove leading slash from path to avoid double slashes
    const cleanPath = path.replace(/^\//, '');

    return `${cleanBaseUrl}${transformations}/${cleanPath}`;
};
