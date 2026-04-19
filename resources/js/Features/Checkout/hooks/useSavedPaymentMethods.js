import { useCallback, useEffect, useState } from 'react';
import { fetchSavedPaymentMethods } from '@/Features/Checkout/services/checkoutApi';

export default function useSavedPaymentMethods({ enabled = false } = {}) {
    const [savedCards, setSavedCards] = useState([]);
    const [isLoadingCards, setIsLoadingCards] = useState(false);
    const [savedCardsError, setSavedCardsError] = useState(null);

    const reloadSavedCards = useCallback(async () => {
        setIsLoadingCards(true);
        setSavedCardsError(null);

        try {
            const cards = await fetchSavedPaymentMethods();
            setSavedCards(Array.isArray(cards) ? cards : []);
            return cards;
        } catch (error) {
            setSavedCardsError(error);
            setSavedCards([]);
            throw error;
        } finally {
            setIsLoadingCards(false);
        }
    }, []);

    useEffect(() => {
        if (!enabled) {
            return;
        }

        reloadSavedCards().catch(() => {
            // Error state is already handled inside the hook.
        });
    }, [enabled, reloadSavedCards]);

    return {
        savedCards,
        isLoadingCards,
        savedCardsError,
        reloadSavedCards,
    };
}
