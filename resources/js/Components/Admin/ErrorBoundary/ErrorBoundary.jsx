import React from 'react';
import styles from './ErrorBoundary.module.css';

export default class ErrorBoundary extends React.Component {
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
        console.error('Component Preview Error:', error, errorInfo);
    }

    getErrorMessage() {
        return this.state.error?.toString() || 'Unknown preview error';
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className={styles.errorBox} role="alert">
                    <strong className={styles.errorLabel}>Error:</strong>{' '}
                    <span className={styles.errorMessage}>{this.getErrorMessage()}</span>
                </div>
            );
        }

        return this.props.children;
    }
}
