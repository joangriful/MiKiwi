import axios from 'axios';

const MULTIPART_HEADERS = {
    'Content-Type': 'multipart/form-data',
};

function assertProductName(productName) {
    if (!productName || typeof productName !== 'string') {
        throw new Error('Invalid product name');
    }
}

export async function linkProductFolder({ productName, source }) {
    assertProductName(productName);

    const { data } = await axios.post('/admin/products/link-folder', {
        product_name: productName,
        source,
    });

    return data;
}

export async function fetchCloudinaryProductImages({ productName }) {
    assertProductName(productName);

    const { data } = await axios.get('/admin/products/cloudinary-images', {
        params: { product_name: productName },
    });

    return data;
}

export async function uploadProductImages({ productName, files }) {
    assertProductName(productName);

    const formData = new FormData();
    files.forEach((file) => formData.append('images[]', file));
    formData.append('product_name', productName);

    const { data } = await axios.post('/admin/products/upload-images', formData, {
        headers: MULTIPART_HEADERS,
    });

    return data;
}

export const productMediaApi = {
    linkProductFolder,
    fetchCloudinaryProductImages,
    uploadProductImages,
};
