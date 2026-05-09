import MikiwiLogo from '@/Components/MikiwiLogo/MikiwiLogo';
import styles from './UnderageBlock.module.css';

export default function UnderageBlock({ onBack }) {
    const handleGoBack = () => {
        if (onBack) onBack();
    };

    return (
        <div className={styles.root} role="main" aria-labelledby="underage-title">
            <div className={styles.content}>
                <MikiwiLogo className={styles.logo} aria-hidden="true" />


                <h1 id="underage-title" className={styles.title}>
                    Acceso restringido
                </h1>

                <p className={styles.message}>
                    Este contenido está destinado exclusivamente a mayores de 18 años.
                    <br />
                    No podemos permitirte el acceso.
                </p>

                <div className={styles.divider} aria-hidden="true" />

                <p className={styles.hint}>
                    ¿Eres mayor de edad?{' '}
                    <button
                        type="button"
                        className={styles.backLink}
                        onClick={handleGoBack}
                    >
                        Volver a verificar
                    </button>
                </p>
            </div>
        </div>
    );
}
