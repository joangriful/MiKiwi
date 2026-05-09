import React, { useState } from 'react';
import styles from './StripeTestCards.module.css';

const TEST_CARDS = [
    { brand: 'Visa', number: '4242 4242 4242 4242', exp: '12/26', cvc: '123', type: 'Success', icon: 'payments' },
    { brand: 'MasterCard', number: '5555 5555 5555 4444', exp: '12/26', cvc: '123', type: 'Success', icon: 'credit_card' },
    { brand: 'Amex', number: '3782 8224 6310 005', exp: '12/26', cvc: '123', type: 'Success', icon: 'account_balance_wallet' },
    { brand: 'Discover', number: '6011 1111 1111 1117', exp: '12/26', cvc: '123', type: 'Success', icon: 'card_giftcard' },
    { brand: 'Generic', number: '4000 0000 0000 0002', exp: '12/26', cvc: '123', type: 'Declined', icon: 'error' },
    { brand: 'Generic', number: '4000 0000 0000 0069', exp: '01/20', cvc: '123', type: 'Expired', icon: 'event_busy' },
];

export default function StripeTestCards() {
    const [copied, setCopied] = useState(null);

    const handleCopy = (text, id) => {
        navigator.clipboard.writeText(text);
        setCopied(id);
        setTimeout(() => setCopied(null), 2000);
    };

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <header className={styles.header}>
                    <h2 className={styles.title}>Pasarela de Pagos (Stripe)</h2>
                    <p className={styles.description}>Tarjetas de prueba para validación de flujos de pago en entorno de desarrollo.</p>
                </header>

                <div className={styles.grid}>
                    {TEST_CARDS.map((card, idx) => (
                        <div key={idx} className={styles.card}>
                            <div className={styles.cardHeader}>
                                <div className={styles.cardBrand}>
                                    <div className={`${styles.cardIconWrapper} ${card.type === 'Success' ? styles.cardIconSuccess : styles.cardIconDanger}`}>
                                        <span className="material-symbols-outlined">{card.icon}</span>
                                    </div>
                                    <div>
                                        <h3 className={styles.cardTitle}>{card.brand}</h3>
                                        <span className={`${styles.cardType} ${card.type === 'Success' ? styles.cardTypeSuccess : styles.cardTypeDanger}`}>
                                            {card.type}
                                        </span>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleCopy(card.number.replace(/\s/g, ''), `num-${idx}`)}
                                    className={styles.copyButton}
                                    title="Copiar número"
                                    aria-label={`Copiar numero de ${card.brand}`}
                                >
                                    <span className={`material-symbols-outlined ${styles.copyButtonIcon}`}>
                                        {copied === `num-${idx}` ? 'check' : 'content_copy'}
                                    </span>
                                </button>
                            </div>

                            <div className={styles.cardFields}>
                                <button
                                    type="button"
                                    className={styles.numberField}
                                    onClick={() => handleCopy(card.number.replace(/\s/g, ''), `num-${idx}`)}
                                    aria-label={`Copiar numero de ${card.brand}`}
                                >
                                    <span className={styles.cardNumber}>{card.number}</span>
                                    <span className={styles.copyHint}>Copiar</span>
                                </button>

                                <div className={styles.metaFields}>
                                    <div className={styles.metaField}>
                                        <span className={styles.metaLabel}>Exp</span>
                                        <span className={styles.metaValue}>{card.exp}</span>
                                    </div>
                                    <div className={styles.metaField}>
                                        <span className={styles.metaLabel}>CVC</span>
                                        <span className={styles.metaValue}>{card.cvc}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className={styles.noticeCard}>
                    <div className={styles.noticeContent}>
                        <h4 className={styles.noticeTitle}>Recordatorio de Desarrollo</h4>
                        <p className={styles.noticeDescription}>
                            Estas tarjetas solo funcionan cuando la API de Stripe está en modo <strong>test</strong>. 
                            Cualquier intento de uso en producción resultará en error. 
                            El C.P. recomendado para España es <strong>28001</strong>.
                        </p>
                    </div>
                    <span className={`material-symbols-outlined ${styles.noticeIcon}`}>
                        security
                    </span>
                </div>
            </div>
        </div>
    );
}
