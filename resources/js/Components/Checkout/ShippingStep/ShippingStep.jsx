import React, { useState, useEffect } from "react";
import usePickupPoints from "@/Features/Checkout/hooks/usePickupPoints";
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
    const [searchCity, setSearchCity] = useState("");
    const bootstrapQuery = data.city || data.postal_code || "";
    const {
        pickupPoints,
        isLoadingPickupPoints,
        pickupPointsError,
        loadPickupPoints,
    } = usePickupPoints({
        enabled: data.shipping_method === "pickup",
        initialQuery: bootstrapQuery,
    });

    useEffect(() => {
        if (pickupPointsError) {
            console.error("Error fetching pickup points:", pickupPointsError);
        }
    }, [pickupPointsError]);

    const handleSearch = async (event) => {
        event.preventDefault();

        try {
            await loadPickupPoints(searchCity);
        } catch {
            // Error state is already handled by the hook.
        }
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
                        <div
                            key={method.id}
                            className={getMethodClassName(isSelected)}
                            onClick={() => setData("shipping_method", method.id)}
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

                            {method.id === "pickup" && isSelected ? (
                                <div
                                    className={styles.pickupSection}
                                    onClick={(event) => event.stopPropagation()}
                                >
                                    <form className={styles.searchBar} onSubmit={handleSearch}>
                                        <input
                                            type="text"
                                            placeholder="Busca por ciudad o CP..."
                                            className={styles.searchInput}
                                            value={searchCity}
                                            onChange={(event) => setSearchCity(event.target.value)}
                                        />
                                        <button type="submit" className={styles.searchButton}>
                                            Buscar
                                        </button>
                                    </form>

                                    {isLoadingPickupPoints ? (
                                        <div className={styles.loadingState}>
                                            <div className={styles.spinner}></div>
                                            <span className={styles.loadingLabel}>Localizando puntos...</span>
                                        </div>
                                    ) : (
                                        <div className={styles.pickupList}>
                                            {pickupPointsError ? (
                                                <div className={styles.emptyPickupState}>
                                                    <p className={styles.emptyPickupText}>
                                                        No hemos podido cargar los puntos de recogida ahora mismo.
                                                    </p>
                                                </div>
                                            ) : pickupPoints.length > 0 ? (
                                                pickupPoints.map((point) => {
                                                    const isPointSelected = data.pickup_point_id === point.id;

                                                    return (
                                                        <div
                                                            key={point.id}
                                                            className={getPickupPointClassName(isPointSelected)}
                                                            onClick={() => setData("pickup_point_id", point.id)}
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
                                                        </div>
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
