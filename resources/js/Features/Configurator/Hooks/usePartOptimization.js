import { useMemo } from 'react';
import { getCloudinaryUrl } from '@/Shared/Utils/cloudinary';

export const usePartOptimization = ({ item, partPositions, currentView, category, isEditing = false, showImages = true, overrideConfig = null }) => {

    // 1. Resolve Configuration for this part
    const config = useMemo(() => {
        if (overrideConfig) return overrideConfig;

        if (!partPositions || !item) return { x: 0, y: 0, scale: 1 };

        let key = null;
        if (currentView && category) {
            key = `${currentView}|${category}|${item.id}`;
        } else {
            // Fallback: Try to find any key ending with the item ID
            // This supports PreviewArea where we might iterate selected items without explicit view context
            // (Though we should pass view context if possible)
            const suffix = `|${category}|${item.id}`;
            const foundKey = Object.keys(partPositions).find(k => k.endsWith(suffix));
            if (foundKey) key = foundKey;
        }

        if (key && partPositions[key]) {
            return partPositions[key];
        }
        return { x: 0, y: 0, scale: 1 }; // Default
    }, [partPositions, item, currentView, category, overrideConfig]);

    // 2. Optimization Logic (Crop vs Full)
    const optimization = useMemo(() => {
        // If editing, force full image for smooth drag (no crop)
        if (isEditing) return { useCrop: false };

        if (!showImages || !item || !config) return { useCrop: false };

        const { x, y, scale } = config;

        // Threshold for cropping
        if (scale < 1.05) return { useCrop: false };

        // Viewport Reference: 500x500
        const w_crop = 1 / scale;
        const h_crop = 1 / scale;

        const tx = x / 500;
        const ty = y / 500;

        const x_crop = 0.5 - tx - (w_crop / 2);
        const y_crop = 0.5 - ty - (h_crop / 2);

        // Bounds check
        if (x_crop < 0 || y_crop < 0 || x_crop + w_crop > 1 || y_crop + h_crop > 1) {
            return { useCrop: false };
        }

        return {
            useCrop: true,
            cropParams: { x: x_crop, y: y_crop, w: w_crop, h: h_crop }
        };
    }, [isEditing, showImages, item, config]);

    // 3. Generate URL and Style
    const result = useMemo(() => {
        if (!showImages || !item) return { src: null, style: {} };

        const sourceUrl = item.url || item.thumbnail;

        if (!sourceUrl) return { src: null, style: {} };

        let src = '';
        let style = {};

        if (optimization.useCrop && !isEditing) {
            const { x, y, w, h } = optimization.cropParams;
            const f = (n) => n.toFixed(4);
            const cropTransform = `c_crop,fl_region_relative,g_north_west,x_${f(x)},y_${f(y)},w_${f(w)},h_${f(h)}`;
            src = getCloudinaryUrl(sourceUrl, { transformations: `${cropTransform},w_400,f_auto,q_auto` });

            style = {
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                transform: 'none'
            };
        } else {
            // Full Image or fallback
            // During editing, we use a fixed width transformation but handle translation/scale via CSS
            const w = isEditing ? 'w_800' : 'w_400';
            src = getCloudinaryUrl(sourceUrl, { transformations: `${w},f_auto,q_auto` });

            // Apply Transform via CSS
            if (config) {
                // We use translate3d for hardware acceleration
                style = {
                    transform: `translate3d(${config.x / 5}%, ${config.y / 5}%, 0) scale(${config.scale})`,
                    transformOrigin: 'center center',
                    willChange: 'transform'
                };
            }
        }

        return { src, style, config };
    }, [item, showImages, optimization, isEditing, config]);

    return result;
};
