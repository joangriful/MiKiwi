import { useCallback, useEffect, useMemo, useState } from "react";
import { CardElement, useStripe } from "@stripe/react-stripe-js";
import axios from "axios";
import InputLabel from "@/Components/InputLabel/InputLabel";
import { normalizeApiError } from "@/Utils/httpError";
import styles from "./PaymentStep.module.css";

const TEST_CARDS = [
    { brand: "Visa", number: "4242424242424242", display: "4242 4242 4242 4242", exp: "12/26", cvc: "123", id: "tok_visa" },
    { brand: "MasterCard", number: "5555555555554444", display: "5555 5555 5555 4444", exp: "12/26", cvc: "123", id: "tok_mastercard" },
    { brand: "Amex", number: "378282246310005", display: "3782 8224 6310 005", exp: "12/26", cvc: "123", id: "tok_amex" },
];

function getBrandClassName(brand) {
    const normalizedBrand = brand.toLowerCase();

    if (normalizedBrand === "visa") return styles.brandVisa;
    if (normalizedBrand === "mastercard") return styles.brandMastercard;
    if (normalizedBrand === "amex") return styles.brandAmex;

    return styles.brandDefault;
}

function getOptionCardClassName(isSelected, dashed = false) {
    const idleClassName = dashed ? styles.optionCardDashed : styles.optionCardIdle;

    return `${styles.optionCard} ${isSelected ? styles.optionCardSelected : idleClassName}`;
}

function getSelectionCheckClassName(isSelected) {
    return `${styles.selectionCheck} ${isSelected ? styles.selectionCheckSelected : styles.selectionCheckIdle}`;
}

function BillingField({ label, htmlFor, value, onChange, placeholder }) {
    return (
        <div className={styles.billingField}>
            <InputLabel htmlFor={htmlFor} value={label} className={styles.billingLabel} />
            <input
                id={htmlFor}
                type="text"
                value={value}
                onChange={onChange}
                className={styles.billingInput}
                placeholder={placeholder}
                aria-label={label}
                required
            />
        </div>
    );
}

export default function PaymentStep({ data, setData, auth, onSubmit, onBack, processing, submitError, onClearSubmitError }) {
    const isAdmin = auth?.user?.role === "admin";
    const stripe = useStripe();
    const [cardError, setCardError] = useState(null);
    const [isConfirming, setIsConfirming] = useState(false);
    const [savedCards, setSavedCards] = useState([]);
    const [isLoadingCards, setIsLoadingCards] = useState(false);
    const [savedCardsError, setSavedCardsError] = useState(null);
    const [paymentOption, setPaymentOption] = useState("new");
    const [showAdminTestCards, setShowAdminTestCards] = useState(false);
    const [copiedId, setCopiedId] = useState(null);
    const [isCardComplete, setIsCardComplete] = useState(false);
    const cardElementOptions = useMemo(() => {
        const fallbackColors = {
            text: "#1f2937",
            placeholder: "#9ca3af",
            invalid: "#ef4444",
        };

        if (typeof window === "undefined") {
            return {
                hidePostalCode: true,
                style: {
                    base: {
                        fontSize: "16px",
                        color: fallbackColors.text,
                        "::placeholder": {
                            color: fallbackColors.placeholder,
                        },
                    },
                    invalid: {
                        color: fallbackColors.invalid,
                    },
                },
            };
        }

        const cssVars = getComputedStyle(document.documentElement);
        const readVar = (name, fallback) => cssVars.getPropertyValue(name).trim() || fallback;

        return {
            hidePostalCode: true,
            style: {
                base: {
                    fontSize: "16px",
                    color: readVar("--color-text-strong", fallbackColors.text),
                    "::placeholder": {
                        color: readVar("--color-text-subtle", fallbackColors.placeholder),
                    },
                },
                invalid: {
                    color: readVar("--color-danger-soft", fallbackColors.invalid),
                },
            },
        };
    }, []);

    useEffect(() => {
        if (!processing) {
            setIsConfirming(false);
        }
    }, [processing]);

    const fetchSavedCards = useCallback(async () => {
        setIsLoadingCards(true);

        try {
            const { data: cards } = await axios.get(route("payment-methods.index"));
            setSavedCards(cards);
            setSavedCardsError(null);

            if (cards.length > 0) {
                setPaymentOption(cards[0].id);
                setData("selected_payment_method", cards[0].id);
            } else {
                setPaymentOption("new");
                setData("selected_payment_method", null);
            }
        } catch (error) {
            setSavedCards([]);
            setSavedCardsError(normalizeApiError(error, {
                title: "No pudimos cargar tus tarjetas",
                message: "No pudimos cargar tus tarjetas guardadas. Puedes continuar usando una tarjeta nueva.",
                code: "payment_method_list_failed",
            }));
        } finally {
            setIsLoadingCards(false);
        }
    }, [setData]);

    useEffect(() => {
        if (auth?.user) {
            fetchSavedCards();
        }
    }, [auth?.user, fetchSavedCards]);

    const handleOptionChange = (optionId) => {
        setPaymentOption(optionId);
        setData("selected_payment_method", optionId === "new" ? null : optionId);
        onClearSubmitError();
    };

    const copyToClipboard = (text, id) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleCardChange = (event) => {
        setIsCardComplete(event.complete);
        setCardError(event.error ? event.error.message : null);
        if (event.error === undefined) {
            onClearSubmitError();
        }
    };

    const onSubmitClick = (event) => {
        event.preventDefault();

        if (!stripe) {
            setCardError("El pago seguro todavía se está cargando. Espera unos segundos y vuelve a intentarlo.");
            return;
        }

        if (paymentOption === "new" && !isCardComplete) {
            setCardError("Por favor, completa los datos de tu tarjeta.");
            return;
        }

        setIsConfirming(true);
        setCardError(null);
        onClearSubmitError();
        onSubmit();
    };

    const isSubmitDisabled =
        processing ||
        isConfirming;

    const showSavedCards = !isLoadingCards && (savedCards.length > 0 || isAdmin);

    return (
        <div className={styles.root}>
            <div className={styles.header}>
                <div>
                    <h2 className={styles.title}>Casi listo...</h2>
                    <p className={styles.stepMeta}>Paso 4 de 4 — Pago Seguro</p>
                </div>

                <div className={styles.securityBadge}>
                    <svg className={styles.iconSm} fill="currentColor" viewBox="0 0 20 20">
                        <path
                            fillRule="evenodd"
                            d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2V7a3 3 0 016 0z"
                            clipRule="evenodd"
                        />
                    </svg>
                    <span className={styles.securityText}>Encriptado SSL</span>
                </div>
            </div>

            <div className={styles.infoBanner}>
                    <div className={styles.infoBannerIcon}>
                    <span className={`material-symbols-outlined ${styles.materialIconLg}`}>shield_moon</span>
                </div>
                <p className={styles.infoBannerText}>
                    Selecciona un método de pago. Tus datos están protegidos por
                    encriptación de grado bancario.
                </p>
            </div>

            <div className={styles.paymentSection}>
                {savedCardsError ? (
                    <div className={styles.errorBanner}>
                        <svg className={styles.iconSm} fill="currentColor" viewBox="0 0 20 20">
                            <path
                                fillRule="evenodd"
                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <span className={styles.errorBannerText}>{savedCardsError.message}</span>
                    </div>
                ) : null}

                {showSavedCards ? (
                    <div className={styles.optionGroup}>
                        <div className={styles.groupLabel}>
                            <span className={styles.groupLabelLine} />
                            {isAdmin ? "Tarjetas Guardadas y Modo Prueba" : "Tus Tarjetas Guardadas"}
                        </div>

                         {savedCards.map((card) => {
                             const isSelected = paymentOption === card.id;

                             return (
                                <button
                                    type="button"
                                    key={card.id}
                                    onClick={() => handleOptionChange(card.id)}
                                    className={getOptionCardClassName(isSelected)}
                                    aria-pressed={isSelected}
                                    aria-label={`Tarjeta terminada en ${card.card.last4}`}
                                >
                                    <div className={`${styles.savedCardBrand} ${isSelected ? styles.savedCardBrandSelected : ""}`}>
                                        <span className={`${styles.savedCardBrandText} ${getBrandClassName(card.card.brand)}`}>
                                            {card.card.brand}
                                        </span>
                                    </div>

                                    <div className={styles.optionContent}>
                                        <p className={styles.optionTitle}>•••• {card.card.last4}</p>
                                        <p className={styles.optionSubtitle}>
                                            Vence: {card.card.exp_month}/{card.card.exp_year}
                                        </p>
                                    </div>

                                    <div className={getSelectionCheckClassName(isSelected)}>
                                        {isSelected ? (
                                            <svg className={styles.iconXs} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
                                            </svg>
                                        ) : null}
                                    </div>
                                </button>
                             );
                         })}

                        {isAdmin
                            ? TEST_CARDS.map((card) => {
                                  const isSelected = paymentOption === card.id;

                                  return (
                                      <button
                                          type="button"
                                          key={card.id}
                                           onClick={() => handleOptionChange(card.id)}
                                           className={getOptionCardClassName(isSelected, true)}
                                           aria-pressed={isSelected}
                                           aria-label={`Tarjeta de prueba ${card.brand} ${card.number.slice(-4)}`}
                                       >
                                          <div className={styles.testCardBrand}>
                                              <span className={styles.testCardBrandText}>{card.brand}</span>
                                              <span className={styles.testBadge}>TEST</span>
                                          </div>

                                          <div className={styles.optionContent}>
                                              <p className={styles.optionTitle}>•••• {card.number.slice(-4)}</p>
                                              <p className={styles.optionToken}>{card.id}</p>
                                          </div>

                                          <div className={getSelectionCheckClassName(isSelected)}>
                                              {isSelected ? (
                                                  <svg className={styles.iconXs} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
                                                  </svg>
                                              ) : null}
                                          </div>
                                      </button>
                                  );
                              })
                            : null}
                    </div>
                ) : null}

                <button
                    type="button"
                    onClick={() => handleOptionChange("new")}
                    className={getOptionCardClassName(paymentOption === "new")}
                    aria-pressed={paymentOption === "new"}
                    aria-label="Usar una nueva tarjeta"
                >
                    <div className={`${styles.newCardIcon} ${paymentOption === "new" ? styles.newCardIconSelected : ""}`}>
                        <span className={`material-symbols-outlined ${styles.materialIconLg}`}>add_card</span>
                    </div>

                    <div className={styles.optionContent}>
                        <span className={styles.optionHeading}>Nueva Tarjeta de Crédito</span>
                        {paymentOption === "new" ? (
                            <span className={styles.optionHighlight}>Completa los datos a continuación</span>
                        ) : null}
                    </div>

                    <div className={getSelectionCheckClassName(paymentOption === "new")}>
                        {paymentOption === "new" ? (
                            <svg className={styles.iconXs} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
                            </svg>
                        ) : null}
                    </div>
                </button>

                {paymentOption === "new" ? (
                    <div className={styles.cardEditorWrapper}>
                        <div className={styles.cardEditorFrame}>
                            <div
                                className={`${styles.cardEditorPanel} ${
                                    cardError
                                        ? styles.cardEditorPanelError
                                        : isCardComplete
                                          ? styles.cardEditorPanelSuccess
                                          : styles.cardEditorPanelIdle
                                }`}
                            >
                                <div className={styles.cardEditorHeader}>
                                    <h4 className={styles.cardEditorTitle}>
                                        <span className={styles.cardEditorLine} />
                                        Introduce tus datos
                                    </h4>

                                    <div className={styles.cardBrandSkeletons}>
                                        <div className={`${styles.cardBrandSkeleton} ${styles.cardBrandSkeletonMuted}`} />
                                        <div className={styles.cardBrandSkeleton} />
                                        <div className={`${styles.cardBrandSkeleton} ${styles.cardBrandSkeletonMuted}`} />
                                    </div>
                                </div>

                                <div className={styles.cardElementWrapper}>
                                    <CardElement options={cardElementOptions} onChange={handleCardChange} />
                                </div>

                                {isCardComplete && !cardError ? (
                                    <div className={styles.cardCompleteBadge}>
                                        <svg className={styles.iconXs} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                ) : null}
                            </div>

                            {isAdmin ? (
                                <div className={styles.adminTools}>
                                    <button
                                        type="button"
                                        onClick={() => setShowAdminTestCards(!showAdminTestCards)}
                                        className={styles.adminToggle}
                                    >
                                        <span className={`material-symbols-outlined ${styles.materialIconSm}`}>science</span>
                                        {showAdminTestCards
                                            ? "Ocultar Cuentas de Prueba"
                                            : "Modo Developer: Ver Cuentas de Prueba"}
                                    </button>

                                    {showAdminTestCards ? (
                                        <div className={styles.adminCardList}>
                                            {TEST_CARDS.map((card, index) => (
                                                <div key={card.id} className={styles.adminCardRow}>
                                                    <div className={styles.adminCardText}>
                                                        <span className={styles.adminCardBrand}>{card.brand}</span>
                                                        <span className={styles.adminCardDisplay}>{card.display}</span>
                                                    </div>

                                                    <div className={styles.adminCardActions}>
                                                        <button
                                                            type="button"
                                                            onClick={() => copyToClipboard(card.number, `num-${index}`)}
                                                            className={`${styles.iconButton} ${
                                                                copiedId === `num-${index}` ? styles.iconButtonSuccess : ""
                                                            }`}
                                                            title="Copiar Número"
                                                        >
                                                            <span className={`material-symbols-outlined ${styles.materialIconSm}`}>
                                                                {copiedId === `num-${index}` ? "check" : "content_copy"}
                                                            </span>
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={() => copyToClipboard(`${card.exp} | ${card.cvc}`, `exp-${index}`)}
                                                            className={`${styles.iconButton} ${
                                                                copiedId === `exp-${index}` ? styles.iconButtonSuccess : ""
                                                            }`}
                                                            title="Copiar Exp/CVC"
                                                        >
                                                            <span className={`material-symbols-outlined ${styles.materialIconSm}`}>
                                                                {copiedId === `exp-${index}` ? "check" : "calendar_today"}
                                                            </span>
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                            <p className={styles.adminHint}>C.P. Recomendado: 28001</p>
                                        </div>
                                    ) : null}
                                </div>
                            ) : null}
                        </div>
                    </div>
                ) : null}

                {cardError && paymentOption === "new" ? (
                    <div className={styles.errorBanner}>
                        <svg className={styles.iconSm} fill="currentColor" viewBox="0 0 20 20">
                            <path
                                fillRule="evenodd"
                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <span className={styles.errorBannerText}>{cardError}</span>
                    </div>
                ) : null}

                {submitError ? (
                    <div className={styles.errorBanner}>
                        <svg className={styles.iconSm} fill="currentColor" viewBox="0 0 20 20">
                            <path
                                fillRule="evenodd"
                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <span className={styles.errorBannerText}>{submitError.message}</span>
                    </div>
                ) : null}
            </div>

            <div className={`${styles.billingToggle} ${data.billing_same_as_shipping ? styles.billingToggleChecked : styles.billingToggleOpen}`}>
                <button
                    type="button"
                    className={styles.billingToggleHeader}
                    onClick={() => setData("billing_same_as_shipping", !data.billing_same_as_shipping)}
                    aria-expanded={!data.billing_same_as_shipping}
                    aria-label="Alternar dirección de facturación"
                >
                    <div className={styles.billingToggleCheckWrapper}>
                        <div className={getSelectionCheckClassName(data.billing_same_as_shipping)}>
                            {data.billing_same_as_shipping ? (
                                <svg className={styles.iconSm} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
                                </svg>
                            ) : null}
                        </div>
                    </div>

                    <div className={styles.billingToggleText}>
                        <span className={styles.billingToggleLabel}>
                            Usar misma dirección de facturación
                        </span>
                        <p className={styles.billingToggleDescription}>
                            Haremos llegar la factura a tus datos de envío habituales.
                        </p>
                    </div>
                </button>

                {!data.billing_same_as_shipping ? (
                    <div className={styles.billingPanel}>
                        <div className={styles.billingPanelHeader}>
                            <span className={styles.billingPanelTitle}>Datos Factura</span>
                            <div className={styles.billingPanelDivider} />
                        </div>

                        <BillingField
                            label="Dirección Completa"
                            htmlFor="billing_address"
                            value={data.billing_address.address}
                            onChange={(event) =>
                                setData("billing_address", {
                                    ...data.billing_address,
                                    address: event.target.value,
                                })
                            }
                            placeholder="Calle, número, portal..."
                        />

                        <div className={styles.billingGrid}>
                            <BillingField
                                label="Ciudad"
                                htmlFor="billing_city"
                                value={data.billing_address.city}
                                onChange={(event) =>
                                    setData("billing_address", {
                                        ...data.billing_address,
                                        city: event.target.value,
                                    })
                                }
                                placeholder="Ej: Madrid"
                            />

                            <BillingField
                                label="Código Postal"
                                htmlFor="billing_postal_code"
                                value={data.billing_address.postal_code}
                                onChange={(event) =>
                                    setData("billing_address", {
                                        ...data.billing_address,
                                        postal_code: event.target.value,
                                    })
                                }
                                placeholder="28001"
                            />
                        </div>
                    </div>
                ) : null}
            </div>

            <div className={styles.actions}>
                <button type="button" onClick={onBack} className={styles.secondaryButton}>
                    <span className={styles.backArrow}>&larr;</span>
                    Volver a Envío
                </button>

                <button
                    onClick={onSubmitClick}
                    disabled={isSubmitDisabled}
                    className={`${styles.primaryButton} ${isSubmitDisabled ? styles.primaryButtonDisabled : ""}`}
                >
                    <div className={styles.primaryButtonContent}>
                        {processing || isConfirming ? (
                            <>
                                <div className={styles.buttonSpinner} />
                                <span className={styles.buttonLoadingText}>Confirmando...</span>
                            </>
                        ) : (
                            <>
                                <span className={`material-symbols-outlined ${styles.buttonIcon}`}>verified_user</span>
                                <span className={styles.buttonText}>FINALIZAR PEDIDO</span>
                            </>
                        )}
                    </div>

                    {!isSubmitDisabled ? <div className={styles.primaryButtonShine} /> : null}
                </button>
            </div>
        </div>
    );
}
