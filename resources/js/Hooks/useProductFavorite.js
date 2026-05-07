import { router, usePage } from '@inertiajs/react';
import axios from 'axios';
import { useEffect, useState } from 'react';

export default function useProductFavorite(product, options = {}) {
    const { auth } = usePage().props;
    const [isFavorite, setIsFavorite] = useState(Boolean(product?.is_favorite));
    const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);

    useEffect(() => {
        setIsFavorite(Boolean(product?.is_favorite));
    }, [product?.id, product?.is_favorite]);

    const toggleFavorite = async () => {
        if (!product?.slug || isTogglingFavorite) {
            return;
        }

        if (!auth?.user) {
            router.visit(route('login'));
            return;
        }

        const nextIsFavorite = !isFavorite;
        setIsFavorite(nextIsFavorite);
        setIsTogglingFavorite(true);

        try {
            const endpoint = nextIsFavorite
                ? route('products.favorite.store', product.slug)
                : route('products.favorite.destroy', product.slug);

            const response = nextIsFavorite
                ? await axios.post(endpoint)
                : await axios.delete(endpoint);

            const confirmedIsFavorite = Boolean(response.data.is_favorite);
            setIsFavorite(confirmedIsFavorite);
            options.onChange?.(confirmedIsFavorite);
        } catch (error) {
            setIsFavorite(!nextIsFavorite);
            console.error('Error updating product favorite:', error);
        } finally {
            setIsTogglingFavorite(false);
        }
    };

    return {
        isFavorite,
        isTogglingFavorite,
        toggleFavorite,
    };
}
