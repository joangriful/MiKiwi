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
            className={
                `${styles.root} block text-sm font-medium text-gray-700 ` +
                className
            }
        >
            {value ? value : children}
        </label>
    );
}
