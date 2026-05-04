import { useState, useEffect } from 'react';
import MikiwiLogo from '@/Components/MikiwiLogo/MikiwiLogo';
import UnderageBlock from './UnderageBlock';
import styles from './AgeGate.module.css';

const STORAGE_KEY_VERIFIED = 'mw_age_verified';
const STORAGE_KEY_DENIED   = 'mw_age_denied';
const EXPIRY_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function isVerified() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY_VERIFIED);
        if (!raw) return false;
        const { ts } = JSON.parse(raw);
        return Date.now() - ts < EXPIRY_MS;
    } catch {
        return false;
    }
}

function isDenied() {
    try {
        return localStorage.getItem(STORAGE_KEY_DENIED) === 'true';
    } catch {
        return false;
    }
}

export default function AgeGate({ isLoggedIn = false }) {
    const [status, setStatus] = useState('checking'); // 'checking' | 'visible' | 'denied' | 'hidden'

    // Determine initial status on mount / when isLoggedIn changes
    useEffect(() => {
        if (isLoggedIn || isVerified()) {
            setStatus('hidden');
            return;
        }
        if (isDenied()) {
            setStatus('denied');
            return;
        }
        setStatus('visible');
    }, [isLoggedIn]);

    // Scroll lock: driven exclusively by status
    useEffect(() => {
        const shouldLock = status === 'visible' || status === 'denied';
        const overflowStyle = shouldLock ? 'hidden' : '';

        document.body.style.overflow = overflowStyle;
        document.documentElement.style.overflow = overflowStyle;

        // Notify other systems (like Lenis smooth scroll) to stop/start
        window.dispatchEvent(new CustomEvent('mw:scroll-lock', { 
            detail: { locked: shouldLock } 
        }));

        return () => {
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
            window.dispatchEvent(new CustomEvent('mw:scroll-lock', { 
                detail: { locked: false } 
            }));
        };
    }, [status]);

    // User confirms age
    const handleAccept = () => {
        try {
            localStorage.setItem(
                STORAGE_KEY_VERIFIED,
                JSON.stringify({ verified: true, ts: Date.now() })
            );
        } catch { /* ignore */ }
        setStatus('hidden');
    };

    // User denies
    const handleDeny = () => {
        try {
            localStorage.setItem(STORAGE_KEY_DENIED, 'true');
        } catch { /* ignore */ }
        setStatus('denied');
    };

    // Called from UnderageBlock: clear denial, show overlay again
    const handleGoBack = () => {
        try {
            localStorage.removeItem(STORAGE_KEY_DENIED);
        } catch { /* ignore */ }
        setStatus('visible');
    };

    if (status === 'checking' || status === 'hidden') return null;

    if (status === 'denied') return <UnderageBlock onBack={handleGoBack} />;

    return (
        <div
            className={styles.overlay}
            role="dialog"
            aria-modal="true"
            aria-labelledby="age-gate-title"
        >
            <div className={styles.card}>
                <div className={styles.logoWrapper} aria-hidden="true">
                    <MikiwiLogo className={styles.logo} />
                </div>


                <h1 id="age-gate-title" className={styles.title}>
                    Verificación de edad
                </h1>

                <p className={styles.subtitle}>
                    Este sitio contiene productos para adultos.<br />
                    ¿Tienes 18 años o más?
                </p>

                <div className={styles.actions}>
                    <button
                        type="button"
                        className={styles.btnAccept}
                        onClick={handleAccept}
                    >
                        Sí, tengo +18
                    </button>
                    <button
                        type="button"
                        className={styles.btnDeny}
                        onClick={handleDeny}
                    >
                        No, soy menor
                    </button>
                </div>

                <p className={styles.legal}>
                    Al entrar confirmas que eres mayor de edad y aceptas nuestros{' '}
                    <a href="/terminos-uso" className={styles.legalLink}>Términos y Condiciones</a>
                    {' '}y la{' '}
                    <a href="/politica-privacidad" className={styles.legalLink}>Política de Privacidad</a>.
                </p>
            </div>
        </div>
    );
}
