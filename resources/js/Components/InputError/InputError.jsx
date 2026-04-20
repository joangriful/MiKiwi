import styles from './InputError.module.css';

export default function InputError({ message, className = '', ...props }) {
    return message ? (
        <p {...props} className={[styles.root, className].filter(Boolean).join(' ')}>
            {message}
        </p>
    ) : null;
}
