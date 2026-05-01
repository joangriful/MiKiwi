import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { normalizeApiError } from "@/Utils/httpError";
import styles from "./ShippingStep.module.css";

const SHIPPING_METHODS = [
    { id: "standard", name: "Envío a Domicilio", price: 3.99, desc: "Entrega en 24-48h" },
    { id: "pickup", name: "Punto de Recogida", price: 2.99, desc: "Recoge en tienda más cercana" },
];

function getMethodClassName(isSelected) {
    return `${styles.methodCard} ${isSelected ? styles.methodCardSelected : styles.methodCardIdle}`;
}

function getMethodIndicatorClassName(isSelected) {
    return `${styles.methodIndicator} ${isSelected ? styles.methodIndicatorSelected : styles.methodIndicatorIdle}`;
}

function getPickupPointClassName(isSelected) {
    return `${styles.pickupPointCard} ${isSelected ? styles.pickupPointCardSelected : styles.pickupPointCardIdle}`;
}

function getPickupPointCheckClassName(isSelected) {
    return `${styles.pickupPointCheck} ${isSelected ? styles.pickupPointCheckSelected : styles.pickupPointCheckIdle}`;
}

export default function ShippingStep({ data, setData, onNext, onBack }) {
    const [pickupPoints, setPickupPoints] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchCity, setSearchCity] = useState("");
    const [pickupPointsError, setPickupPointsError] = useState(null);

    const fetchPickupPoints = useCallback(async (query = "") => {
        setLoading(true);
        setPickupPointsError(null);

        try {
            const isPostalCode = /^\d{4,5}$/.test(query.trim());
            const response = await axios.get(route("pickup-points.index"), {
                params: isPostalCode
                    ? { postal_code: query.trim() }
                    : { city: query.trim() },
            });

            setPickupPoints(response.data);
        } catch (error) {
            setPickupPoints([]);
            setPickupPointsError(normalizeApiError(error, {
                title: "No pudimos cargar los puntos de recogida",
                message: "No pudimos cargar los puntos de recogida disponibles. Prueba con otra búsqueda o inténtalo de nuevo en unos minutos.",
                code: "pickup_points_load_failed",
            }));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (data.shipping_method === "pickup") {
            const initialSearch = searchCity || data.city || data.postal_code || "";
            fetchPickupPoints(initialSearch);
        }
    }, [data.shipping_method, data.city, data.postal_code, searchCity, fetchPickupPoints]);

    const handleSearch = (event) => {
        event.preventDefault();
        fetchPickupPoints(searchCity);
    };

    const isPickupSelectionMissing =
        data.shipping_method === "pickup" && !data.pickup_point_id;
    const isNextDisabled = !data.shipping_method || isPickupSelectionMissing;

    return (
        <div className={styles.root}>
            <div className={styles.header}>
                <h2 className={styles.title}>Envío</h2>
                <p className={styles.stepMeta}>Paso 3 de 4</p>
            </div>

            <div className={styles.methodGrid}>
                {SHIPPING_METHODS.map((method) => {
                    const isSelected = data.shipping_method === method.id;

                    return (
                        <div key={method.id} className={getMethodClassName(isSelected)}>
                            <button
                                type="button"
                                className={styles.methodSelectButton}
                                onClick={() => setData("shipping_method", method.id)}
                                aria-pressed={isSelected}
                                aria-label={`${method.name}. ${method.desc}. ${method.price.toFixed(2)} euros`}
                            >
                                <div className={styles.methodRow}>
                                    <div className={styles.methodInfo}>
                                        <div className={getMethodIndicatorClassName(isSelected)}>
                                            {isSelected ? (
                                                <svg className={styles.iconSm} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
                                                </svg>
                                            ) : null}
                                        </div>

                                        <div>
                                            <h3 className={styles.methodTitle}>{method.name}</h3>
                                            <p className={styles.methodDescription}>{method.desc}</p>
                                        </div>
                                    </div>

                                    <div className={styles.methodPriceWrapper}>
                                        <span className={`${styles.methodPrice} ${isSelected ? styles.methodPriceSelected : ""}`}>
                                            {method.price.toFixed(2)}
                                            <span className={styles.currency}>€</span>
                                        </span>
                                    </div>
                                </div>
                            </button>

                            {method.id === "pickup" && isSelected ? (
                                <div className={styles.pickupSection}>
                                    <form className={styles.searchBar} onSubmit={handleSearch}>
                                        <input
                                            type="text"
                                            placeholder="Busca por ciudad o CP..."
                                            className={styles.searchInput}
                                            value={searchCity}
                                            aria-label="Buscar punto de recogida por ciudad o código postal"
                                            onChange={(event) => setSearchCity(event.target.value)}
                                        />
                                        <button type="submit" className={styles.searchButton}>
                                            Buscar
                                        </button>
                                    </form>

                                    {loading ? (
                                        <div className={styles.loadingState}>
                                            <div className={styles.spinner} />
                                            <span className={styles.loadingLabel}>Localizando puntos...</span>
                                        </div>
                                    ) : (
                                        <div className={styles.pickupList}>
                                            {pickupPointsError ? (
                                                <div className={styles.errorBanner}>
                                                    <svg className={styles.iconSm} fill="currentColor" viewBox="0 0 20 20">
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                    <span className={styles.errorBannerText}>{pickupPointsError.message}</span>
                                                </div>
                                            ) : null}

                                            {pickupPoints.length > 0 ? (
                                                pickupPoints.map((point) => {
                                                    const isPointSelected = data.pickup_point_id === point.id;

                                                    return (
                                                        <button
                                                            type="button"
                                                            key={point.id}
                                                            className={getPickupPointClassName(isPointSelected)}
                                                            onClick={() => setData("pickup_point_id", point.id)}
                                                            aria-pressed={isPointSelected}
                                                            aria-label={`${point.name}, ${point.address}, ${point.postal_code} ${point.city}`}
                                                        >
                                                            <div className={styles.pickupPointContent}>
                                                                <div className={styles.pickupPointText}>
                                                                    <div className={`${styles.pickupPointName} ${isPointSelected ? styles.pickupPointNameSelected : ""}`}>
                                                                        {point.name}
                                                                    </div>
                                                                    <div className={styles.pickupPointMeta}>
                                                                        {point.address} — {point.postal_code} {point.city}
                                                                    </div>
                                                                </div>

                                                                <div className={getPickupPointCheckClassName(isPointSelected)}>
                                                                    <svg className={styles.iconSm} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
                                                                    </svg>
                                                                </div>
                                                            </div>
                                                        </button>
                                                    );
                                                })
                                            ) : (
                                                <div className={styles.emptyPickupState}>
                                                    <div className={styles.emptyPickupIcon}>
                                                        <svg className={styles.iconLg} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        </svg>
                                                    </div>
                                                    <p className={styles.emptyPickupText}>
                                                        No encontramos tiendas en esta zona.
                                                        <br />
                                                        Prueba con otra ciudad o CP.
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ) : null}
                        </div>
                    );
                })}
            </div>

            <div className={styles.actions}>
                <button type="button" onClick={onBack} className={styles.secondaryButton}>
                    <span className={styles.backArrow}>&larr;</span>
                    Mis Datos
                </button>

                <button onClick={onNext} disabled={isNextDisabled} className={`${styles.primaryButton} ${isNextDisabled ? styles.primaryButtonDisabled : ""}`}>
                    CONTINUAR A PAGO
                    <svg className={styles.iconMdForward} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
