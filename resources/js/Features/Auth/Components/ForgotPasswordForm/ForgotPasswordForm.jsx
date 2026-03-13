import InputError from '@/Components/InputError/InputError';
import { Link, useForm } from '@inertiajs/react';
import './ForgotPasswordForm.css';

export default function ForgotPasswordForm({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <form onSubmit={submit} className="space-y-5">
            {status && (
                <div className="mk-auth-status-success">
                    {status}
                </div>
            )}

            <div className="mk-auth-field">
                <label htmlFor="email" className="mk-auth-label">
                    Correo electrónico
                </label>
                <input
                    id="email"
                    type="email"
                    name="email"
                    value={data.email}
                    className="mk-auth-input w-full px-4 py-3.5 text-sm"
                    autoFocus
                    required
                    placeholder=" "
                    onChange={(e) => setData('email', e.target.value)}
                />
            </div>

            <InputError message={errors.email} className="mt-2 text-xs" />

            <button type="submit" className="mk-auth-btn-primary w-full py-4 text-xs font-semibold uppercase" disabled={processing}>
                <span>{processing ? 'Enviando...' : 'Enviar enlace de recuperación'}</span>
            </button>

            <div className="text-center text-xs text-gray-500">
                <Link href={route('login')} className="mk-auth-link font-medium">
                    Volver a iniciar sesión
                </Link>
            </div>
        </form>
    );
}

