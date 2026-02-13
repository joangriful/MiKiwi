import { useState } from 'react';
import { router } from '@inertiajs/react';
import Toast from '../Toast'; // Check if this component exists

export default function FooterNewsletter() {
    const [email, setEmail] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [toast, setToast] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!email) {
            setToast({ message: 'Por favor ingresa tu correo electrónico', type: 'error' });
            return;
        }

        setSubmitting(true);

        router.post(route('newsletter.subscribe'), { email }, {
            preserveScroll: true,
            onSuccess: () => {
                setToast({ message: '¡Gracias por suscribirte a nuestro newsletter!', type: 'success' });
                setEmail('');
                setSubmitting(false);
            },
            onError: (errors) => {
                setToast({ message: errors.newsletter || 'Error al procesar la suscripción', type: 'error' });
                setSubmitting(false);
            }
        });
    };

    return (
        <div className="w-full md:w-auto flex flex-col items-end text-right md:pr-12 relative">
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            <div className="mb-2">
                <h4 className="text-white font-medium mb-1 text-lg">Únete al círculo exclusivo de MiKiwi</h4>
                <p className="text-gray-500 text-xs">Recibe ofertas especiales y recetas frescas.</p>
            </div>
            <form onSubmit={handleSubmit} className="flex gap-2 w-full md:w-auto md:min-w-[350px]">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Tu correo electrónico"
                    className="bg-zinc-900/50 border border-zinc-800 text-gray-300 text-sm rounded-lg block w-full p-2.5 focus:ring-accent focus:border-accent outline-none transition-colors"
                    disabled={submitting}
                />
                <button
                    type="submit"
                    disabled={submitting}
                    className="text-white bg-accent hover:opacity-90 focus:ring-4 focus:ring-accent/30 font-medium rounded-lg text-sm px-4 py-2.5 transition-all disabled:opacity-50"
                >
                    {submitting ? 'Enviando...' : 'Suscribirse'}
                </button>
            </form>
        </div>
    );
}
