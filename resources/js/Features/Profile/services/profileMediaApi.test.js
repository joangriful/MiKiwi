import { beforeEach, describe, expect, it, vi } from 'vitest';
import axios from 'axios';
import {
    uploadProfileBanner,
    uploadProfileImage,
} from '@/Features/Profile/services/profileMediaApi';

vi.mock('axios', () => ({
    default: {
        post: vi.fn(),
    },
}));

describe('profileMediaApi', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        globalThis.route = vi.fn((name) => `/${name}`);
    });

    it('uploads profile image as multipart request', async () => {
        const payload = { success: true, profile_photo_url: '/img/profile.jpg' };
        axios.post.mockResolvedValueOnce({ data: payload });

        const response = await uploadProfileImage({ fake: 'form-data' });

        expect(globalThis.route).toHaveBeenCalledWith('profile.image.update');
        expect(axios.post).toHaveBeenCalledWith(
            '/profile.image.update',
            { fake: 'form-data' },
            { headers: { 'Content-Type': 'multipart/form-data' } },
        );
        expect(response).toEqual(payload);
    });

    it('uploads profile banner as multipart request', async () => {
        const payload = { success: true, banner_url: '/img/banner.jpg' };
        axios.post.mockResolvedValueOnce({ data: payload });

        const response = await uploadProfileBanner({ fake: 'form-data' });

        expect(globalThis.route).toHaveBeenCalledWith('profile.banner.update');
        expect(axios.post).toHaveBeenCalledWith(
            '/profile.banner.update',
            { fake: 'form-data' },
            { headers: { 'Content-Type': 'multipart/form-data' } },
        );
        expect(response).toEqual(payload);
    });
});
