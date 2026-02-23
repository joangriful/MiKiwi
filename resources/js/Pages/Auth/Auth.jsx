import React from 'react';
import { Head, Link } from '@inertiajs/react';

import MikiwiLogo from '@/Components/MikiwiLogo';
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
                return <div className="text-center text-red-500">Error: unknown view "{view}"</div>;
        }
    };

    const getPageTitle = () => {
        if (title) return title;
        switch (view) {
            case 'login':
                return 'Iniciar sesión';
            case 'register':
                return 'Crear cuenta';
            case 'forgot-password':
                return 'Recuperar contraseña';
            case 'reset-password':
                return 'Restablecer contraseña';
            case 'confirm-password':
                return 'Confirmar contraseña';
            case 'verify-email':
                return 'Verificación de correo';
            default:
                return 'Autenticación';
        }
    };

    const getPageSubtitle = () => {
        if (subtitle) return subtitle;
        switch (view) {
            case 'login':
                return 'Accede a tu perfil sensorial y continúa tu experiencia MI KIWI.';
            case 'register':
                return 'Únete para crear tu cuenta y descubrir colecciones exclusivas.';
            case 'forgot-password':
                return 'Escribe tu correo y te enviaremos un enlace para recuperar acceso.';
            case 'reset-password':
                return 'Define una nueva contraseña para volver a entrar.';
            case 'confirm-password':
                return 'Esta es un área segura. Confirma tu contraseña para continuar.';
            case 'verify-email':
                return 'Verifica tu correo para activar todas las funciones de la cuenta.';
            default:
                return '';
        }
    };

    const getSingleEyebrow = () => {
        switch (view) {
            case 'forgot-password':
                return '01 - Recuperación';
            case 'reset-password':
                return '02 - Nueva contraseña';
            case 'confirm-password':
                return '03 - Seguridad';
            case 'verify-email':
                return '04 - Verificación';
            default:
                return 'Acceso';
        }
    };

    const isSplitLayout = view === 'login' || view === 'register';
    const isLoginActive = view === 'login';
    const isRegisterActive = view === 'register';
    const [hoveredAuthPanel, setHoveredAuthPanel] = React.useState(null);
    const [selectedAuthPanel, setSelectedAuthPanel] = React.useState(null);
    const currentAuthState = hoveredAuthPanel ?? selectedAuthPanel ?? (isRegisterActive ? 'register' : 'login');
    const loginHref = route('login');
    const registerHref = route('register');

    const handleAuthSwitchClick = (event, target) => {
        if (!isSplitLayout || isMobileViewport) {
            return;
        }

        event.preventDefault();
        setSelectedAuthPanel(target);
        setHoveredAuthPanel(target);
    };

    const [isMobileViewport, setIsMobileViewport] = React.useState(() => {
        if (typeof window === 'undefined') {
            return false;
        }

        return window.matchMedia('(max-width: 767px)').matches;
    });

    React.useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        const mediaQuery = window.matchMedia('(max-width: 767px)');
        const handleChange = (event) => setIsMobileViewport(event.matches);

        setIsMobileViewport(mediaQuery.matches);

        if (mediaQuery.addEventListener) {
            mediaQuery.addEventListener('change', handleChange);

            return () => mediaQuery.removeEventListener('change', handleChange);
        }

        mediaQuery.addListener(handleChange);

        return () => mediaQuery.removeListener(handleChange);
    }, []);

    return (
        <div className="mk-auth-shell">
            <Head title={getPageTitle()} />

            <div className="mk-auth-glow-container" aria-hidden="true">
                <div className="mk-auth-glow-left" />
                <div className="mk-auth-glow-right" />
            </div>

            <nav className="mk-auth-nav">
                <Link href="/" className="mk-auth-brand">
                    <MikiwiLogo className="mk-auth-brand-logo" />
                </Link>
                <div className="mk-auth-nav-center">
                    <Link
                        href={loginHref}
                        className={`mk-auth-nav-switch ${currentAuthState === 'login' ? 'is-active' : ''}`}
                        preserveScroll
                        onClick={(event) => handleAuthSwitchClick(event, 'login')}
                    >
                        Acceso
                    </Link>
                    <span className="opacity-30">|</span>
                    <Link
                        href={registerHref}
                        className={`mk-auth-nav-switch ${currentAuthState === 'register' ? 'is-active' : ''}`}
                        preserveScroll
                        onClick={(event) => handleAuthSwitchClick(event, 'register')}
                    >
                        Registro
                    </Link>
                </div>
                <Link href="/" className="mk-auth-nav-link">
                    Volver al inicio
                </Link>
            </nav>

            {isSplitLayout ? (
                isMobileViewport ? (
                    <main className="mk-auth-main mk-auth-main-mobile">
                        <div className="mk-auth-mobile-orb mk-auth-mobile-orb-indigo" aria-hidden="true" />
                        <div className="mk-auth-mobile-orb mk-auth-mobile-orb-lime" aria-hidden="true" />

                        <section className="mk-auth-mobile-card">
                            <div className="mk-auth-mobile-sonic" aria-hidden="true">
                                <span className="mk-auth-mobile-sonic-core" />
                            </div>

                            <nav className="mk-auth-mobile-tabs" aria-label="Navegación de autenticación">
                                <span
                                    className={`mk-auth-mobile-tab-slider ${isRegisterActive ? 'mk-auth-mobile-tab-slider-register' : ''}`}
                                    aria-hidden="true"
                                />

                                <Link
                                    href={route('login')}
                                    className={`mk-auth-mobile-tab ${isLoginActive ? 'mk-auth-mobile-tab-active' : ''}`}
                                    preserveScroll
                                >
                                    Acceso
                                </Link>

                                <Link
                                    href={route('register')}
                                    className={`mk-auth-mobile-tab ${isRegisterActive ? 'mk-auth-mobile-tab-active' : ''}`}
                                    preserveScroll
                                >
                                    Registro
                                </Link>
                            </nav>

                            <div className="mk-auth-mobile-form-container">
                                {isLoginActive ? (
                                    <section className="mk-auth-mobile-form-panel mk-auth-mobile-form-panel-active">
                                        <header className="mk-auth-mobile-header">
                                            <h1 className="mk-auth-mobile-title">Bienvenido de vuelta</h1>
                                            <p className="mk-auth-mobile-subtitle">Continúa tu experiencia sensorial</p>
                                        </header>

                                        <LoginForm
                                            status={status}
                                            canResetPassword={canResetPassword}
                                            autoFocus={true}
                                        />
                                    </section>
                                ) : (
                                    <section className="mk-auth-mobile-form-panel mk-auth-mobile-form-panel-active">
                                        <header className="mk-auth-mobile-header">
                                            <h2 className="mk-auth-mobile-title">Crea tu identidad</h2>
                                            <p className="mk-auth-mobile-subtitle">Descubre tu huella sónica única</p>
                                        </header>

                                        <RegisterForm autoFocus={true} />
                                    </section>
                                )}
                            </div>
                        </section>

                        <div className="mk-auth-mobile-branding">Identidad sónica personalizada</div>
                    </main>

                ) : (
                    <main className="mk-auth-main mk-auth-main-split mk-auth-main-desktop">
                        <section
                            className={`group mk-auth-panel ${currentAuthState === 'login' ? 'mk-auth-panel-active' : ''}`}
                            onMouseEnter={() => setHoveredAuthPanel('login')}
                            onMouseLeave={() => setHoveredAuthPanel(null)}
                        >
                            <div className="mk-auth-tech-grid" />
                            <div className="mk-auth-aurora mk-auth-aurora-login" />

                            <div className="mk-auth-panel-content">
                                <h1 className="mk-auth-title">
                                    <span className="mk-auth-text-outline mk-auth-text-outline-login">Iniciar</span>
                                    <span className="mk-auth-title-solid">Sesión.</span>
                                </h1>

                                <div className="mk-auth-expandable">
                                    <p className="mk-auth-description">
                                        Accede a tu perfil sensorial personalizado y continúa tu experiencia <strong className="mk-auth-mikiwi-text">MI KIWI</strong> con total fluidez.
                                    </p>
                                    <LoginForm status={status} canResetPassword={canResetPassword} autoFocus={false} />
                                </div>
                            </div>
                        </section>

                        <div className="mk-auth-center-divider" />

                        <section
                            className={`group mk-auth-panel mk-auth-panel-register ${currentAuthState === 'register' ? 'mk-auth-panel-active' : ''}`}
                            onMouseEnter={() => setHoveredAuthPanel('register')}
                            onMouseLeave={() => setHoveredAuthPanel(null)}
                        >
                            <div className="mk-auth-tech-grid" />
                            <div className="mk-auth-aurora mk-auth-aurora-register" />

                            <div className="mk-auth-panel-content md:text-right">
                                <h2 className="mk-auth-title">
                                    <span className="mk-auth-title-solid">Crear</span>
                                    <span className="mk-auth-text-outline mk-auth-text-outline-register">Cuenta.</span>
                                </h2>

                                <div className="mk-auth-expandable">
                                    <p className="mk-auth-description md:ml-auto">
                                        Descubre tu identidad única y accede a experiencias premium diseñadas para ti.
                                    </p>
                                    <RegisterForm autoFocus={false} />
                                </div>
                            </div>
                        </section>
                    </main>
                )
            ) : (
                <main className="mk-auth-main mk-auth-main-single">
                    <section className="mk-auth-single-card">
                        <div className="mk-auth-tech-grid" />
                        <div className="mk-auth-aurora mk-auth-aurora-login mk-auth-aurora-visible" />

                        <div className="mk-auth-single-content">
                            <span className="mk-auth-subtitle mk-auth-subtitle-indigo">{getSingleEyebrow()}</span>
                            <h1 className="mk-auth-title-single">{getPageTitle()}</h1>
                            <p className="mk-auth-description">{getPageSubtitle()}</p>
                            {renderForm()}
                        </div>
                    </section>
                </main>
            )}

            <footer className="mk-auth-footer" aria-hidden="true">
                <div className="mk-auth-footer-hint">
                    Pasa el ratón sobre el panel para expandir. En móvil, usa las pestañas para cambiar entre acceso y registro.
                </div>
                <div className="mk-auth-footer-copy"><strong className="mk-auth-mikiwi-text">MI KIWI</strong> (c) {new Date().getFullYear()}</div>
            </footer>
        </div>
    );
}
