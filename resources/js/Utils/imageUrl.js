export function optimizeImageUrl(url, options = {}) {
    if (!url || typeof url !== 'string') {
        return url;
    }

    if (!url.includes('res.cloudinary.com') || !url.includes('/image/upload/')) {
        return url;
    }

    const {
        width,
        height,
        quality = 'auto',
        format = 'auto',
        dpr = 'auto',
        crop = 'fill',
    } = options;

    const transforms = [`f_${format}`, `q_${quality}`, `dpr_${dpr}`];

    if (width) {
        transforms.push(`w_${width}`);
    }

    if (height) {
        transforms.push(`h_${height}`);
    }

    if (width || height) {
        transforms.push(`c_${crop}`);
    }

    const marker = '/image/upload/';
    const markerIndex = url.indexOf(marker);
    if (markerIndex === -1) {
        return url;
    }

    const prefix = url.slice(0, markerIndex + marker.length);
    const rest = url.slice(markerIndex + marker.length);

    if (/^(?:[a-z]{1,3}_[^/]+,)+/.test(rest) || /^(?:[a-z]{1,3}_[^/]+)$/.test(rest.split('/')[0])) {
        return url;
    }

    return `${prefix}${transforms.join(',')}/${rest}`;
}
