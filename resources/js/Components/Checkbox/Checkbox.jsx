import styles from './Checkbox.module.css';

export default function Checkbox({ className = '', ...props }) {
    return (
        <input
            {...props}
            type="checkbox"
            className={[styles.root, className].filter(Boolean).join(' ')}
        />
    );
}
