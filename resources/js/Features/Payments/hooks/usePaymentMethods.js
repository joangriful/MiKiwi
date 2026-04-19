import { useCallback, useEffect, useState } from 'react';
import {
    fetchPaymentMethods,
    removePaymentMethod,
} from '@/Features/Payments/services/paymentMethodsApi';

export default function usePaymentMethods({ enabled = true } = {}) {
    const [cards, setCards] = useState([]);
    const [isLoadingCards, setIsLoadingCards] = useState(false);
    const [cardsError, setCardsError] = useState(null);

    const reloadCards = useCallback(async () => {
        setIsLoadingCards(true);
        setCardsError(null);

        try {
            const data = await fetchPaymentMethods();
            const nextCards = Array.isArray(data) ? data : [];
            setCards(nextCards);
            return nextCards;
        } catch (error) {
            setCardsError(error);
            setCards([]);
            throw error;
        } finally {
            setIsLoadingCards(false);
        }
    }, []);

    const deleteCard = useCallback(async (id) => {
        await removePaymentMethod(id);
        setCards((current) => current.filter((card) => card.id !== id));
    }, []);

    useEffect(() => {
        if (!enabled) {
            return;
        }

        reloadCards().catch(() => {
            // Error state is already handled in the hook.
        });
    }, [enabled, reloadCards]);

    return {
        cards,
        isLoadingCards,
        cardsError,
        reloadCards,
        deleteCard,
    };
}
