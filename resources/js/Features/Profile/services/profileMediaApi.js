import axios from 'axios';

const MULTIPART_HEADERS = {
    'Content-Type': 'multipart/form-data',
};

export async function uploadProfileImage(formData) {
    const { data } = await axios.post(route('profile.image.update'), formData, {
        headers: MULTIPART_HEADERS,
    });

    return data;
}

export async function uploadProfileBanner(formData) {
    const { data } = await axios.post(route('profile.banner.update'), formData, {
        headers: MULTIPART_HEADERS,
    });

    return data;
}

export const profileMediaApi = {
    uploadProfileImage,
    uploadProfileBanner,
};
