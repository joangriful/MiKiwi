import styles from './SecondaryButton.module.css';

export default function SecondaryButton({
    type = 'button',
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
            type={type}
            className={buttonClassName}
            disabled={disabled}
        >
            {children}
        </button>
    );
}
