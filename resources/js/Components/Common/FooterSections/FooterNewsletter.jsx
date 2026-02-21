import { useForm } from '@inertiajs/react';
import { toast } from 'react-toastify';

export default function FooterNewsletter() {
    const { data, setData, post, processing, reset, errors } = useForm({
        email: '',
        gender: 'pene', // Default or could be blank, but controller expects it for the message
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        post(route('newsletter.subscribe'), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('¡Gracias por suscribirte!');
                reset();
            },
            onError: (err) => {
                toast.error(err.newsletter || 'Error al procesar la suscripción');
            }
        });
    };

    return (
        <div className="w-full md:w-auto flex flex-col items-end text-right md:pr-12 relative lg:mt-[-40px]">
            <div className="mb-2">
                <h4 className="text-white font-medium mb-1 text-lg font-head uppercase tracking-tight">Únete al círculo exclusivo de MiKiwi</h4>
                <p className="text-gray-500 text-[10px] italic">Recibe ofertas especiales y recetas frescas.</p>
            </div>
            <form onSubmit={handleSubmit} className="flex gap-2 w-full md:w-auto md:min-w-[350px]">
                <input
                    type="email"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    placeholder="Tu correo electrónico"
                    required
                    className="bg-zinc-900/50 border border-zinc-800 text-gray-300 text-sm rounded-lg block w-full p-2.5 focus:ring-[#d697c8] focus:border-[#d697c8] outline-none transition-colors"
                    disabled={processing}
                />
                <button
                    type="submit"
                    disabled={processing}
                    className="text-white bg-[#d697c8] hover:bg-[#f8b7ea] focus:ring-4 focus:ring-[#d697c8]/30 font-bold rounded-lg text-sm px-6 py-2.5 transition-all disabled:opacity-50 uppercase tracking-widest"
                >
                    {processing ? 'Enviando...' : 'Suscribirse'}
                </button>
            </form>
        </div>
    );
}
