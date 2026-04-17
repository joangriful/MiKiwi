import styles from './InputError.module.css';

export default function InputError({ message, className = '', ...props }) {
    return message ? (
        <p
            {...props}
            className={`${styles.root} text-sm text-red-600 ` + className}
        >
            {message}
        </p>
    ) : null;
}
