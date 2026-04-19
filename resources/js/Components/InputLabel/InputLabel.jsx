import styles from './InputLabel.module.css';

export default function InputLabel({
    value,
    className = '',
    children,
    ...props
}) {
    return (
        <label
            {...props}
            className={[styles.root, className].filter(Boolean).join(' ')}
        >
            {value ? value : children}
        </label>
    );
}
