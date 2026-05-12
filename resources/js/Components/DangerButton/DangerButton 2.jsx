import styles from './DangerButton.module.css';

export default function DangerButton({
    className = '',
    disabled,
    children,
    ...props
}) {
    const buttonClassName = [
        styles.root,
        disabled ? styles.disabled : '',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <button
            {...props}
            className={buttonClassName}
            disabled={disabled}
        >
            {children}
        </button>
    );
}
