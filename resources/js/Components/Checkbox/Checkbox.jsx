import styles from './Checkbox.module.css';

export default function Checkbox({ className = '', ...props }) {
    return (
        <input
            {...props}
            type="checkbox"
            className={
                `${styles.root} rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500 ` +
                className
            }
        />
    );
}
