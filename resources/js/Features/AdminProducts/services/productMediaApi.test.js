import { beforeEach, describe, expect, it, vi } from 'vitest';
import axios from 'axios';
import {
    fetchCloudinaryProductImages,
    linkProductFolder,
    uploadProductImages,
} from '@/Features/AdminProducts/services/productMediaApi';

vi.mock('axios', () => ({
    default: {
        get: vi.fn(),
        post: vi.fn(),
    },
}));

describe('productMediaApi', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('links an existing cloudinary folder to product name', async () => {
        axios.post.mockResolvedValueOnce({ data: { success: true } });

        const response = await linkProductFolder({
            productName: 'mobi',
            source: 'legacy-folder',
        });

        expect(axios.post).toHaveBeenCalledWith('/admin/products/link-folder', {
            product_name: 'mobi',
            source: 'legacy-folder',
        });
        expect(response).toEqual({ success: true });
    });

    it('fetches cloudinary images by product name', async () => {
        axios.get.mockResolvedValueOnce({ data: { images: ['a.jpg', 'b.jpg'] } });

        const response = await fetchCloudinaryProductImages({ productName: 'mobi' });

        expect(axios.get).toHaveBeenCalledWith('/admin/products/cloudinary-images', {
            params: { product_name: 'mobi' },
        });
        expect(response).toEqual({ images: ['a.jpg', 'b.jpg'] });
    });

    it('uploads product images as multipart request', async () => {
        axios.post.mockResolvedValueOnce({ data: { success: true, urls: ['x.jpg'] } });

        const response = await uploadProductImages({
            productName: 'mobi',
            files: [new Blob(['a'])],
        });

        expect(axios.post).toHaveBeenCalledWith(
            '/admin/products/upload-images',
            expect.any(FormData),
            { headers: { 'Content-Type': 'multipart/form-data' } },
        );
        expect(response).toEqual({ success: true, urls: ['x.jpg'] });
    });

    it('fails fast for invalid product name', async () => {
        await expect(fetchCloudinaryProductImages({ productName: '' })).rejects.toThrow('Invalid product name');
        expect(axios.get).not.toHaveBeenCalled();
    });
});
