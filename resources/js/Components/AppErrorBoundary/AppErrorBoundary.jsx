import React from 'react';
import styles from './AppErrorBoundary.module.css';

export default class AppErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
        };
    }

    static getDerivedStateFromError(error) {
        return {
            hasError: true,
            error,
        };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Application render error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <main className={styles.root} role="alert">
                    <div className={styles.panel}>
                        <p className={styles.eyebrow}>Error de aplicacion</p>
                        <h1 className={styles.title}>Se produjo un error inesperado</h1>
                        <p className={styles.message}>
                            La interfaz no pudo renderizar esta vista correctamente. Recarga la pagina y, si el problema persiste,
                            revisa la consola para identificar el componente que ha fallado.
                        </p>
                    </div>
                </main>
            );
        }

        return this.props.children;
    }
}
