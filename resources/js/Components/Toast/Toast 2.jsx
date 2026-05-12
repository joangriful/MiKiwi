import { useEffect } from 'react';
import styles from './Toast.module.css';

export default function Toast({ message, type = 'success', onClose }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            if (onClose) onClose();
        }, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    if (!message) return null;

    const toastClassName = [
        styles.root,
        type === 'success' ? styles.success : styles.error,
    ].join(' ');

    return (
        <div className={toastClassName}>
            <span className={`${styles.icon} material-symbols-outlined`}>
                {type === 'success' ? 'check' : 'priority_high'}
            </span>
            <div className={styles.body}>
                <p className={styles.message}>{message}</p>
            </div>
            <button
                type="button"
                onClick={onClose}
                className={styles.closeButton}
                aria-label="Close notification"
            >
                <span className="material-symbols-outlined">close</span>
            </button>
        </div>
    );
}
