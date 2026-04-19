import InputError from '@/Components/InputError/InputError';
import { Link, useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import styles from './ConfirmPasswordForm.module.css';

export default function ConfirmPasswordForm() {
    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, [reset]);

    const submit = (e) => {
        e.preventDefault();

        post(route('password.confirm'));
    };

    return (
        <form onSubmit={submit} className={styles.root}>
            <div className="mk-auth-field">
                <label htmlFor="password" className="mk-auth-label">
                    Contraseña actual
                </label>
                <input
                    id="password"
                    type="password"
                    name="password"
                    value={data.password}
                    className={`mk-auth-input ${styles.input}`}
                    autoFocus
                    required
                    placeholder=" "
                    onChange={(e) => setData('password', e.target.value)}
                />
                <InputError message={errors.password} className={styles.error} />
            </div>

            <button type="submit" className={`mk-auth-btn-primary ${styles.submitButton}`} disabled={processing}>
                <span>{processing ? 'Confirmando...' : 'Confirmar acceso'}</span>
            </button>

            <div className={styles.footerText}>
                <Link href={route('login')} className={`mk-auth-link ${styles.inlineLink}`}>
                    Volver a login
                </Link>
            </div>
        </form>
    );
}
