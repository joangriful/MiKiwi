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
                        <p className={styles.eyebrow}>Algo no ha salido como esperábamos</p>
                        <h1 className={styles.title}>No pudimos mostrar esta pantalla</h1>
                        <p className={styles.message}>
                            Ha ocurrido un problema al cargar esta parte de la aplicación. Recarga la página y, si vuelve a pasar,
                            inténtalo de nuevo dentro de unos minutos.
                        </p>
                    </div>
                </main>
            );
        }

        return this.props.children;
    }
}
