import React from "react";
import styles from "./CheckoutProgress.module.css";

const STEPS = ["Carrito", "Informacion", "Envio", "Pago"];

export default function CheckoutProgress({ currentStep }) {
    return (
        <nav className={styles.root} aria-label="Progreso del checkout">
            {STEPS.map((label, index) => {
                const stepNumber = index + 1;
                const isActive = currentStep === stepNumber;
                const isCompleted = currentStep > stepNumber;

                return (
                    <React.Fragment key={label}>
                        <div className={styles.step}>
                            <div
                                className={[
                                    styles.stepBadge,
                                    isActive ? styles.stepBadgeActive : "",
                                    isCompleted ? styles.stepBadgeCompleted : "",
                                ]
                                    .filter(Boolean)
                                    .join(" ")}
                                aria-current={isActive ? "step" : undefined}
                            >
                                {isCompleted ? (
                                    <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                    </svg>
                                ) : (
                                    stepNumber
                                )}
                            </div>
                            <span
                                className={[
                                    styles.stepLabel,
                                    isActive ? styles.stepLabelActive : "",
                                    isCompleted ? styles.stepLabelCompleted : "",
                                ]
                                    .filter(Boolean)
                                    .join(" ")}
                            >
                                {label}
                            </span>
                        </div>

                        {index < STEPS.length - 1 ? (
                            <div className={styles.connector} aria-hidden="true">
                                <div
                                    className={styles.connectorFill}
                                    style={{ width: currentStep > stepNumber ? "100%" : "0%" }}
                                />
                            </div>
                        ) : null}
                    </React.Fragment>
                );
            })}
        </nav>
    );
}
