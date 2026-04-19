import { useCallback, useEffect, useState } from 'react';
import { fetchPickupPoints } from '@/Features/Checkout/services/checkoutApi';

export default function usePickupPoints({ enabled = false, initialQuery = '' } = {}) {
    const [pickupPoints, setPickupPoints] = useState([]);
    const [isLoadingPickupPoints, setIsLoadingPickupPoints] = useState(false);
    const [pickupPointsError, setPickupPointsError] = useState(null);

    const loadPickupPoints = useCallback(async (query = '') => {
        setIsLoadingPickupPoints(true);
        setPickupPointsError(null);

        try {
            const points = await fetchPickupPoints(query);
            setPickupPoints(Array.isArray(points) ? points : []);
            return points;
        } catch (error) {
            setPickupPointsError(error);
            setPickupPoints([]);
            throw error;
        } finally {
            setIsLoadingPickupPoints(false);
        }
    }, []);

    useEffect(() => {
        if (!enabled) {
            return;
        }

        loadPickupPoints(initialQuery).catch(() => {
            // Error state is already handled inside the hook.
        });
    }, [enabled, initialQuery, loadPickupPoints]);

    return {
        pickupPoints,
        isLoadingPickupPoints,
        pickupPointsError,
        loadPickupPoints,
    };
}
