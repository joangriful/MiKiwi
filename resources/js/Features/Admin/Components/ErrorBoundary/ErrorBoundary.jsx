import React from 'react';
import './ErrorBoundary.css';

// Error Boundary
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }
    static getDerivedStateFromError(error) { return { hasError: true, error }; }
    componentDidCatch(error, errorInfo) { console.error("Component Preview Error:", error, errorInfo); }
    render() {
        if (this.state.hasError) {
            return (
                <div className="p-2 bg-red-50 border border-red-200 rounded text-red-600 text-xs overflow-hidden">
                    <strong>Error:</strong> {this.state.error?.toString()}
                </div>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;
