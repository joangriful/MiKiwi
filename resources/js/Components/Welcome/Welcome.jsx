import styles from './Welcome.module.css';

export default function Welcome() {
    return (
        <div className={styles.root}>
            <h1 className={styles.title}>Hola</h1>
        </div>
    );
}
