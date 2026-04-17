import { Link, useForm } from '@inertiajs/react';
import styles from './VerifyEmailForm.module.css';

export default function VerifyEmailForm({ status }) {
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();

        post(route('verification.send'));
    };

    return (
        <form onSubmit={submit} className={`${styles.root} space-y-5`}>
            {status === 'verification-link-sent' && (
                <div className="mk-auth-status-success">
                    Hemos enviado un nuevo enlace de verificación al correo usado en tu registro.
                </div>
            )}

            <button type="submit" className="mk-auth-btn-primary w-full py-4 text-xs font-semibold uppercase" disabled={processing}>
                <span>{processing ? 'Enviando...' : 'Reenviar verificación'}</span>
            </button>

            <div className="text-center text-xs text-gray-500">
                <Link
                    href={route('logout')}
                    method="post"
                    as="button"
                    className="mk-auth-link font-medium"
                >
                    Cerrar sesión
                </Link>
            </div>
        </form>
    );
}
