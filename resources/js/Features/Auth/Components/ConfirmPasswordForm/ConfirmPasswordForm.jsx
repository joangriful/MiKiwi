import InputError from '@/Components/InputError/InputError';
import { Link, useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import './ConfirmPasswordForm.css';

export default function ConfirmPasswordForm() {
    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();

        post(route('password.confirm'));
    };

    return (
        <form onSubmit={submit} className="space-y-5">
            <div className="mk-auth-field">
                <label htmlFor="password" className="mk-auth-label">
                    Contraseña actual
                </label>
                <input
                    id="password"
                    type="password"
                    name="password"
                    value={data.password}
                    className="mk-auth-input w-full px-4 py-3.5 text-sm"
                    autoFocus
                    required
                    placeholder=" "
                    onChange={(e) => setData('password', e.target.value)}
                />
                <InputError message={errors.password} className="mt-2 text-xs" />
            </div>

            <button type="submit" className="mk-auth-btn-primary w-full py-4 text-xs font-semibold uppercase" disabled={processing}>
                <span>{processing ? 'Confirmando...' : 'Confirmar acceso'}</span>
            </button>

            <div className="text-center text-xs text-gray-500">
                <Link href={route('login')} className="mk-auth-link font-medium">
                    Volver a login
                </Link>
            </div>
        </form>
    );
}

