import React, { useState, useEffect } from 'react';
import styles from './AdminConfirmationModal.module.css';

const REMOVE_ACTION = 'remove';

function getActionCopy(actionType, identifier, userName) {
    const isRemoval = actionType === REMOVE_ACTION;

    return {
        confirmPhrase: isRemoval ? `remove admin ${identifier}` : `make admin ${identifier}`,
        icon: isRemoval ? 'warning' : 'security',
        title: isRemoval ? 'Remove Admin Privileges' : 'Grant Admin Privileges',
        titleIconClassName: isRemoval ? styles.titleIconDanger : styles.titleIconPrimary,
        description: isRemoval
            ? (
                <>
                    Are you sure you want to remove admin rights from{' '}
                    <span className={styles.highlightedName}>{userName}</span>?
                </>
            )
            : (
                <>
                    Are you sure you want to make{' '}
                    <span className={styles.highlightedName}>{userName}</span> an admin?
                </>
            ),
        warningMessage: isRemoval
            ? 'This action will restrict their access to the Components Manager immediately.'
            : null,
        confirmButtonText: isRemoval ? 'I understand, remove admin' : 'Confirm, make admin',
        confirmButtonVariant: isRemoval ? styles.confirmButtonDanger : styles.confirmButtonPrimary,
    };
}

export default function AdminConfirmationModal({ isOpen, onClose, onConfirm, user, actionType }) {
    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
        if (isOpen) {
            setInputValue('');
        }
    }, [isOpen]);

    if (!isOpen || !user) return null;

    const identifier = user.username || user.email;
    const actionCopy = getActionCopy(actionType, identifier, user.name);
    const { confirmPhrase } = actionCopy;
    const isMatch = inputValue === confirmPhrase;

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    const handleConfirmClick = () => {
        if (!isMatch) {
            return;
        }

        onConfirm();
        setInputValue('');
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <h3 className={styles.title}>
                        <span className={`material-symbols-outlined ${styles.titleIcon} ${actionCopy.titleIconClassName}`}>
                            {actionCopy.icon}
                        </span>
                        {actionCopy.title}
                    </h3>
                    <button type="button" onClick={onClose} className={styles.closeButton}>
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div className={styles.content}>
                    <p className={styles.description}>
                        {actionCopy.description}
                        {actionCopy.warningMessage && (
                            <span className={styles.warningMessage}>{actionCopy.warningMessage}</span>
                        )}
                    </p>

                    <label className={styles.label} htmlFor="admin-confirmation-input">
                        Type confirmation phrase
                    </label>
                    <div className={styles.confirmPhraseBox}>
                        {confirmPhrase}
                    </div>

                    <input
                        id="admin-confirmation-input"
                        type="text"
                        value={inputValue}
                        onChange={handleInputChange}
                        className={styles.input}
                        placeholder={confirmPhrase}
                        autoFocus
                    />
                </div>

                <div className={styles.footer}>
                    <button
                        type="button"
                        onClick={onClose}
                        className={styles.cancelButton}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        disabled={!isMatch}
                        onClick={handleConfirmClick}
                        className={`${styles.confirmButton} ${isMatch ? actionCopy.confirmButtonVariant : styles.confirmButtonDisabled}`}
                    >
                        {isMatch && <span className={`material-symbols-outlined ${styles.confirmIcon}`}>check</span>}
                        {actionCopy.confirmButtonText}
                    </button>
                </div>
            </div>
        </div>
    );
}
