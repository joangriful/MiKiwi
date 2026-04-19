import { ToastContainer } from 'react-toastify';
import { ConfirmProvider } from '@/Shared/Confirm/ConfirmProvider';
import 'react-toastify/dist/ReactToastify.css';

export default function AppProviders({ children }) {
    return (
        <ConfirmProvider>
            {children}
            <ToastContainer
                position="bottom-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
        </ConfirmProvider>
    );
}
