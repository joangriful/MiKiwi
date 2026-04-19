import { useCallback } from 'react';
import {
    fetchCloudinaryProductImages,
    linkProductFolder,
    uploadProductImages,
} from '@/Features/AdminProducts/services/productMediaApi';

export default function useProductMedia() {
    const linkFolder = useCallback((payload) => linkProductFolder(payload), []);
    const fetchCloudinaryImages = useCallback((payload) => fetchCloudinaryProductImages(payload), []);
    const uploadImages = useCallback((payload) => uploadProductImages(payload), []);

    return {
        linkFolder,
        fetchCloudinaryImages,
        uploadImages,
    };
}
