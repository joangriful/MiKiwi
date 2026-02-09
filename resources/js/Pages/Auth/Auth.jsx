import React from 'react';
import { Head, Link } from '@inertiajs/react';
import MikiwiLogo from '@/Components/MikiwiLogo';

// Import Form Components
import LoginForm from '@/Components/Auth/LoginForm';
import RegisterForm from '@/Components/Auth/RegisterForm';
import ForgotPasswordForm from '@/Components/Auth/ForgotPasswordForm';
import ResetPasswordForm from '@/Components/Auth/ResetPasswordForm';
import ConfirmPasswordForm from '@/Components/Auth/ConfirmPasswordForm';
import VerifyEmailForm from '@/Components/Auth/VerifyEmailForm';

export default function Auth({ view, title, subtitle, status, canResetPassword, token, email }) {

    const renderForm = () => {
        switch (view) {
            case 'login':
                return <LoginForm status={status} canResetPassword={canResetPassword} />;
            case 'register':
                return <RegisterForm />;
            case 'forgot-password':
                return <ForgotPasswordForm status={status} />;
            case 'reset-password':
                return <ResetPasswordForm token={token} email={email} />;
            case 'confirm-password':
                return <ConfirmPasswordForm />;
            case 'verify-email':
                return <VerifyEmailForm status={status} />;
            default:
                return (
                    <div className="text-center text-red-500">
                        Error: Unknown view "{view}"
                    </div>
                );
        }
    };

    // Dynamic titles based on view if not provided
    const getPageTitle = () => {
        if (title) return title;
        switch (view) {
            case 'login': return 'Welcome Back';
            case 'register': return 'Create Account';
            case 'forgot-password': return 'Forgot Password';
            case 'reset-password': return 'Reset Password';
            case 'confirm-password': return 'Confirm Password';
            case 'verify-email': return 'Email Verification';
            default: return 'Authentication';
        }
    };

    const getPageSubtitle = () => {
        if (subtitle) return subtitle;
        switch (view) {
            case 'login': return 'Please sign in to your account';
            case 'register': return 'Join us today';
            case 'forgot-password': return 'Enter your email to receive a password reset link.';
            case 'reset-password': return 'Choose a new password for your account.';
            case 'confirm-password': return 'This is a secure area. Please confirm your password.';
            case 'verify-email': return 'Please verify your email address to continue.';
            default: return '';
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
            <Head title={getPageTitle()} />

            <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl">
                {/* Header Section */}
                <div className="flex flex-col items-center bg-white p-6 pb-2 text-center">
                    <Link href="/" className="mb-4">
                        <MikiwiLogo className="h-16 w-16 text-primary" />
                    </Link>

                    <h2 className="text-2xl font-bold text-gray-900">
                        {getPageTitle()}
                    </h2>

                    {getPageSubtitle() && (
                        <p className="mt-2 text-sm text-gray-600">
                            {getPageSubtitle()}
                        </p>
                    )}
                </div>

                {/* Content Section */}
                <div className="px-6 py-6 pt-2">
                    {renderForm()}
                </div>
            </div>

            {/* Footer / Copyright */}
            <div className="mt-8 text-center text-xs text-gray-500">
                &copy; {new Date().getFullYear()} Mikiwi. All rights reserved.
            </div>
        </div>
    );
}
