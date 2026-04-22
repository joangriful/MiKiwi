import InputError from '@/Components/InputError/InputError';
import { authClass } from '@/Components/Auth/AuthShell/authShellStyles';
import { Link, useForm } from '@inertiajs/react';
import styles from './ForgotPasswordForm.module.css';

export default function ForgotPasswordForm({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.email'));
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
                    className={`${authClass('mk-auth-input')} ${styles.input}`}
                    autoFocus
                    required
                    aria-label="Correo electrónico"
                    placeholder=" "
                    onChange={(e) => setData('email', e.target.value)}
                />
            </div>

            <InputError message={errors.email} className={styles.error} />

            <button type="submit" className={`${authClass('mk-auth-btn-primary')} ${styles.submitButton}`} disabled={processing}>
                <span>{processing ? 'Enviando...' : 'Enviar enlace de recuperación'}</span>
            </button>

            <div className={styles.footerText}>
                <Link href={route('login')} className={`${authClass('mk-auth-link')} ${styles.inlineLink}`}>
                    Volver a iniciar sesión
                </Link>
            </div>
        </form>
    );
}
