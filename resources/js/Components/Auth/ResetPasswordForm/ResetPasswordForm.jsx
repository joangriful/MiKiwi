import { useEffect } from 'react';
import InputError from '@/Components/InputError/InputError';
import { authClass } from '@/Components/Auth/AuthShell/authShellStyles';
import { Link, useForm } from '@inertiajs/react';
import styles from './ResetPasswordForm.module.css';

export default function ResetPasswordForm({ token, email }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, [reset]);

    const submit = (e) => {
        e.preventDefault();

        post(route('password.store'));
    };

    return (
        <form onSubmit={submit} className={styles.root}>
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
                    autoComplete="username"
                    required
                    aria-label="Correo electrónico"
                    placeholder=" "
                    onChange={(e) => setData('email', e.target.value)}
                />
                <InputError message={errors.email} className={styles.error} />
            </div>

            <div className={authClass('mk-auth-field')}>
                <label htmlFor="password" className={authClass('mk-auth-label')}>
                    Nueva contraseña
                </label>
                <input
                    id="password"
                    type="password"
                    name="password"
                    value={data.password}
                    className={`${authClass('mk-auth-input')} ${styles.input}`}
                    autoComplete="new-password"
                    autoFocus
                    required
                    aria-label="Nueva contraseña"
                    placeholder=" "
                    onChange={(e) => setData('password', e.target.value)}
                />
                <InputError message={errors.password} className={styles.error} />
            </div>

            <div className={authClass('mk-auth-field')}>
                <label htmlFor="password_confirmation" className={authClass('mk-auth-label')}>
                    Confirmar contraseña
                </label>
                <input
                    type="password"
                    id="password_confirmation"
                    name="password_confirmation"
                    value={data.password_confirmation}
                    className={`${authClass('mk-auth-input')} ${styles.input}`}
                    autoComplete="new-password"
                    required
                    aria-label="Confirmar contraseña"
                    placeholder=" "
                    onChange={(e) => setData('password_confirmation', e.target.value)}
                />

                <InputError
                    message={errors.password_confirmation}
                    className={styles.error}
                />
            </div>

            <button type="submit" className={`${authClass('mk-auth-btn-primary')} ${styles.submitButton}`} disabled={processing}>
                <span>{processing ? 'Actualizando...' : 'Actualizar contraseña'}</span>
            </button>

            <div className={styles.footerText}>
                <Link href={route('login')} className={`${authClass('mk-auth-link')} ${styles.inlineLink}`}>
                    Volver a iniciar sesión
                </Link>
            </div>
        </form>
    );
}
