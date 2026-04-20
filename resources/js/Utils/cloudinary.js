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

    // If it's already a full URL, return it as is (unless we want to force optimizations on external URLs too, which is complex)
    if (path.startsWith('http')) return path;

    const baseUrl = import.meta.env.VITE_CLOUDINARY_URL || '';

    // Ensure baseUrl ends with a slash if it exists
    const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;

    // Default transformations if none provided
    const transformations = options.transformations || 'f_auto,q_auto';

    // Construct URL: Base + Transformations + / + Path
    // Cloudinary URL structure: https://res.cloudinary.com/<cloud_name>/image/upload/<transformations>/<version>/<public_id>

    // Remove leading slash from path to avoid double slashes
    const cleanPath = path.replace(/^\//, '');

    return `${cleanBaseUrl}${transformations}/${cleanPath}`;
};
