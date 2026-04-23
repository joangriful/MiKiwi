import React, { useCallback, useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import styles from './CardsTab.module.css';
import {
    Elements,
    CardElement,
    useStripe,
    useElements,
} from '@stripe/react-stripe-js';

const TEST_CARDS = [
    { brand: 'Visa', number: '4242 4242 4242 4242', raw: '4242424242424242', exp: '12/26', cvc: '123' },
    { brand: 'MasterCard', number: '5555 5555 5555 4444', raw: '5555555555554444', exp: '12/26', cvc: '123' },
    { brand: 'Amex', number: '3782 8224 6310 005', raw: '378282246310005', exp: '12/26', cvc: '123' },
];

function CardForm({ onCancel, onSuccess }) {
    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);
    const [holder, setHolder] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!stripe || !elements) {
            return;
        }

        setIsProcessing(true);
        setError(null);

        try {
            const { data } = await axios.post(route('payment-methods.setup-intent'));
            const clientSecret = data.clientSecret;

            const result = await stripe.confirmCardSetup(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                    billing_details: { name: holder },
                },
            });

            if (result.error) {
                setError(result.error.message);
                setIsProcessing(false);
            } else {
                onSuccess();
            }
        } catch {
            setError('Error al iniciar el proceso de registro.');
            setIsProcessing(false);
        }
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalCard}>
                <button type="button" onClick={onCancel} className={styles.closeButton} aria-label="Cerrar formulario de tarjeta">
                    <span className={styles.materialIcon}>close</span>
                </button>

                <h3 className={styles.modalTitle}>Nueva Tarjeta</h3>
                <p className={styles.modalDescription}>Tus datos se guardarán de forma segura en Stripe.</p>

                <form onSubmit={handleSubmit} className={styles.modalForm}>
                    <div>
                        <label htmlFor="card-holder-name" className={styles.fieldLabel}>Nombre del Titular</label>
                        <input
                            id="card-holder-name"
                            aria-label="Nombre del titular"
                            type="text"
                            required
                            value={holder}
                            onChange={(event) => setHolder(event.target.value)}
                            placeholder="Como aparece en la tarjeta"
                            className={styles.fieldInput}
                        />
                    </div>

                    <div>
                        <span className={styles.fieldLabel}>Datos de la Tarjeta</span>
                        <div className={styles.cardElementWrap}>
                            <CardElement
                                options={{
                                    style: {
                                        base: {
                                            fontSize: '16px',
                                            color: '#1f2937',
                                            fontFamily: 'Inter, sans-serif',
                                            '::placeholder': { color: '#9ca3af' },
                                        },
                                    },
                                }}
                            />
                        </div>
                    </div>

                    {error && (
                        <div className={styles.errorBox}>
                            <span className={styles.materialIcon}>error</span>
                            <p className={styles.errorText}>{error}</p>
                        </div>
                    )}

                    <button type="submit" disabled={!stripe || isProcessing} className={styles.submitButton}>
                        {isProcessing ? (
                            <>
                                <div className={styles.spinnerSmall} />
                                <span>Guardando...</span>
                            </>
                        ) : (
                            <>
                                <span className={styles.materialIcon}>verified_user</span>
                                <span>Vincular Tarjeta</span>
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default function CardsTab() {
    const { stripeKey } = usePage().props;
    const { auth } = usePage().props;
    const [stripePromise] = useState(() => loadStripe(stripeKey));
    const [cards, setCards] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [copiedId, setCopiedId] = useState(null);
    const isAdmin = auth?.user?.role === 'admin';

    const handleCopy = (text, id) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const fetchCards = useCallback(async () => {
        setIsLoading(true);
        try {
            const { data } = await axios.get(route('payment-methods.index'));
            setCards(data);
        } catch {
            setCards([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCards();
    }, [fetchCards]);

    const handleDelete = async (id) => {
        if (!confirm('¿Estás seguro de que quieres eliminar esta tarjeta?')) {
            return;
        }

        try {
            await axios.delete(route('payment-methods.destroy', id));
            setCards((currentCards) => currentCards.filter((card) => card.id !== id));
        } catch {
            alert('Error al eliminar la tarjeta.');
        }
    };

    const getBrandClass = (brand) => {
        const map = {
            visa: styles.brandVisa,
            mastercard: styles.brandMastercard,
            amex: styles.brandAmex,
        };

        return map[brand.toLowerCase()] || styles.brandDefault;
    };

    return (
        <div className={`${styles.root} ${styles.panel}`}>
            <div className={styles.header}>
                <div className={styles.heading}>
                    <h2>Mis Tarjetas</h2>
                    <p>Bóveda segura de métodos de pago activos.</p>
                </div>

                <button onClick={() => setIsAdding(true)} className={styles.addButton}>
                    <span className={styles.materialIcon}>add_card</span>
                    Añadir Nuevo Método
                </button>
            </div>

            {isLoading ? (
                <div className={styles.centerState}>
                    <div className={styles.loader} />
                    <span className={styles.stateText}>Sincronizando con Stripe...</span>
                </div>
            ) : cards.length > 0 ? (
                <div className={styles.cardsList}>
                    {cards.map((card) => (
                        <div key={card.id} className={styles.cardRow}>
                            <div className={styles.brandBlock}>
                                <span className={`${styles.brandName} ${getBrandClass(card.card.brand)}`}>{card.card.brand}</span>
                                <div className={styles.brandDivider} />
                                <span className={styles.brandType}>Credit</span>
                            </div>

                            <div className={styles.cardContent}>
                                <p className={styles.cardNumber}>•••• •••• •••• {card.card.last4}</p>
                                <div className={styles.cardMeta}>
                                    <span className={styles.cardMetaItem}>
                                        <span className={styles.cardMetaIcon}>calendar_month</span>
                                        Expira: {card.card.exp_month}/{card.card.exp_year}
                                    </span>
                                    <div className={styles.cardMetaDot} />
                                    <span className={styles.cardMetaItem}>
                                        <span className={styles.cardMetaIcon}>person</span>
                                        {card.billing_details.name || 'Titular'}
                                    </span>
                                </div>
                            </div>

                            <button onClick={() => handleDelete(card.id)} className={styles.deleteButton} title="Eliminar tarjeta">
                                <span className={styles.materialIcon}>delete</span>
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className={`${styles.centerState} ${styles.emptyState}`}>
                    <div className={styles.emptyIconWrap}>
                        <span className={styles.emptyIcon}>credit_card_off</span>
                    </div>
                    <p className={styles.emptyTitle}>Sin métodos de pago</p>
                    <p className={styles.emptyDescription}>Añade una tarjeta para acelerar tus futuras compras en MiKiwi.</p>
                </div>
            )}

            {isAdding && (
                <Elements stripe={stripePromise}>
                    <CardForm
                        onCancel={() => setIsAdding(false)}
                        onSuccess={() => {
                            setIsAdding(false);
                            fetchCards();
                        }}
                    />
                </Elements>
            )}

            {isAdmin && (
                <div className={styles.adminSection}>
                    <div className={styles.adminHeader}>
                        <div className={styles.adminIconWrap}>
                            <span className={styles.materialIcon}>science</span>
                        </div>
                        <div>
                            <h3 className={styles.adminTitle}>Referencia para Pruebas</h3>
                            <p className={styles.adminSubtitle}>Uso exclusivo de administradores (Modo Test)</p>
                        </div>
                    </div>

                    <div className={styles.testGrid}>
                        {TEST_CARDS.map((card, index) => (
                            <div key={card.raw} className={styles.testCard}>
                                <span className={styles.testBrand}>{card.brand}</span>
                                <div className={styles.testRow}>
                                    <span className={styles.testNumber}>{card.number}</span>
                                    <button
                                        onClick={() => handleCopy(card.raw, `profile-card-${index}`)}
                                        className={`${styles.copyButton} ${copiedId === `profile-card-${index}` ? styles.copyButtonSuccess : styles.copyButtonIdle}`}
                                        title="Copiar número"
                                    >
                                        <span className={styles.copyIcon}>
                                            {copiedId === `profile-card-${index}` ? 'check' : 'content_copy'}
                                        </span>
                                    </button>
                                </div>
                                <div className={styles.testFooter}>
                                    <div className={styles.testDetails}>
                                        <div>
                                            <span className={styles.testDetailLabel}>Exp</span>
                                            <span className={styles.testDetailValue}>{card.exp}</span>
                                        </div>
                                        <div>
                                            <span className={styles.testDetailLabel}>CVC</span>
                                            <span className={styles.testDetailValue}>{card.cvc}</span>
                                        </div>
                                    </div>
                                    <p className={styles.testPostal}>CP: 28001</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
