import { useEffect } from 'react';
import InputError from '@/Components/InputError/InputError';
import AuthSocialButtons from '@/Components/Auth/AuthSocialButtons/AuthSocialButtons';
import { authClass } from '@/Components/Auth/AuthShell/authShellStyles';
import { clearStoredQuizResultCategory, getStoredQuizResultCategory } from '@/Utils/authQuizResultStorage';
import { Link, useForm } from '@inertiajs/react';
import styles from './LoginForm.module.css';

export default function LoginForm({ status, canResetPassword, autoFocus = false }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
        quiz_result_category: null,
    });

    useEffect(() => {
        const quizResultCategory = getStoredQuizResultCategory();

        if (quizResultCategory) {
            setData('quiz_result_category', quizResultCategory);
        }

        return () => {
            reset('password');
        };
    }, [reset, setData]);

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onSuccess: () => {
                clearStoredQuizResultCategory();
            },
        });
    };

    return (
        <form onSubmit={submit} className={styles.root}>
            {status && (
                <div className={authClass('mk-auth-status-success')}>
                    {status}
                </div>
            )}

            <div className={authClass('mk-auth-field')}>
                <label htmlFor="email" className={authClass('mk-auth-label')}>
                    Correo electrónico
                </label>
                <input
                    id="email"
                    type="email"
                    name="email"
                    value={data.email}
                    className={`${authClass('mk-auth-input', 'mk-auth-input-access')} ${styles.input}`}
                    autoComplete="username"
                    autoFocus={autoFocus}
                    required
                    aria-label="Correo electrónico"
                    placeholder=" "
                    onChange={(e) => setData('email', e.target.value)}
                />
                <InputError message={errors.email} className={styles.error} />
            </div>

            <div className={authClass('mk-auth-field')}>
                <label htmlFor="password" className={authClass('mk-auth-label')}>
                    Contraseña
                </label>
                <input
                    id="password"
                    type="password"
                    name="password"
                    value={data.password}
                    className={`${authClass('mk-auth-input', 'mk-auth-input-access')} ${styles.input}`}
                    autoComplete="current-password"
                    required
                    aria-label="Contraseña"
                    placeholder=" "
                    onChange={(e) => setData('password', e.target.value)}
                />
                <InputError message={errors.password} className={styles.error} />
            </div>

            <div className={styles.checkboxRow}>
                <label className={styles.checkboxLabel}>
                    <input
                        type="checkbox"
                        name="remember"
                        checked={data.remember}
                        className={styles.checkboxInput}
                        aria-label="Recordarme"
                        onChange={(e) => setData('remember', e.target.checked)}
                    />
                    <span className={styles.checkboxText}>
                        Recordarme
                    </span>
                </label>
                {canResetPassword && (
                    <Link
                        href={route('password.request')}
                        className={`${authClass('mk-auth-link')} ${styles.inlineLink}`}
                    >
                        ¿Has olvidado tu contraseña?
                    </Link>
                )}
            </div>

            <button
                type="submit"
                className={`${authClass('mk-auth-btn-primary', 'mk-auth-btn-access')} ${styles.submitButton}`}
                disabled={processing}
            >
                <span>
                    {processing ? 'Accediendo...' : 'Acceso'}
                </span>
            </button>

            <AuthSocialButtons dividerText="o continúa con" />
        </form>
    );
}
