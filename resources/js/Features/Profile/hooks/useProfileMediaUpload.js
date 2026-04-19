import { useCallback } from 'react';
import {
    uploadProfileBanner,
    uploadProfileImage,
} from '@/Features/Profile/services/profileMediaApi';

export default function useProfileMediaUpload() {
    const uploadBannerImage = useCallback((formData) => uploadProfileBanner(formData), []);
    const uploadAvatarImage = useCallback((formData) => uploadProfileImage(formData), []);

    return {
        uploadBannerImage,
        uploadAvatarImage,
    };
}
