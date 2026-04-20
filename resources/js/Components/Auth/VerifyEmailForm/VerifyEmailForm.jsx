import { Link, useForm } from '@inertiajs/react';
import { authClass } from '@/Components/Auth/AuthShell/authShellStyles';
import styles from './VerifyEmailForm.module.css';

export default function VerifyEmailForm({ status }) {
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();

        post(route('verification.send'));
    };

    return (
        <form onSubmit={submit} className={styles.root}>
            {status === 'verification-link-sent' && (
                <div className={authClass('mk-auth-status-success')}>
                    Hemos enviado un nuevo enlace de verificación al correo usado en tu registro.
                </div>
            )}

            <button type="submit" className={`${authClass('mk-auth-btn-primary')} ${styles.submitButton}`} disabled={processing}>
                <span>{processing ? 'Enviando...' : 'Reenviar verificación'}</span>
            </button>

            <div className={styles.footerText}>
                <Link
                    href={route('logout')}
                    method="post"
                    as="button"
                    className={`${authClass('mk-auth-link')} ${styles.inlineLink}`}
                >
                    Cerrar sesión
                </Link>
            </div>
        </form>
    );
}
