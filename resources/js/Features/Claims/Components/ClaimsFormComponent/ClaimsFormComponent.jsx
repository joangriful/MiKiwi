import { useState } from 'react';
import { Link } from '@inertiajs/react';
import { toast } from 'react-toastify';
import './ClaimsFormComponent.css';

export default function ClaimsFormComponent() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        orderId: '',
        reason: 'defecto',
        message: '',
        terms: false,
    });

    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.terms) {
            toast.warning('Debes aceptar la Política de Privacidad para continuar.');
            return;
        }
        // Simulated submission — replace with real backend call
        setSubmitted(true);
        toast.success('¡Reclamación enviada! Nos pondremos en contacto contigo en un plazo máximo de 48 horas.');
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    if (submitted) {
        return (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 w-full max-w-2xl mx-auto text-center">
                <div className="text-5xl mb-6">✅</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3 font-head">Reclamación registrada</h2>
                <p className="text-gray-500 mb-2 text-sm leading-relaxed">
                    Tu reclamación ha sido registrada correctamente. Recibirás una confirmación en{' '}
                    <strong className="text-gray-700">{formData.email}</strong> y nos pondremos en contacto contigo
                    en un plazo máximo de <strong className="text-gray-700">48 horas hábiles</strong>.
                </p>
                <p className="text-xs text-gray-400 mb-8">
                    Número de referencia: <strong>MK-{Date.now().toString().slice(-8)}</strong>. Guárdalo para futuras consultas.
                </p>
                <Link
                    href={route('home')}
                    className="inline-block border border-secondary text-secondary-dark rounded-full px-8 py-3 text-sm font-bold hover:bg-secondary hover:text-white transition-all uppercase tracking-widest"
                >
                    Volver al inicio
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 md:p-12 w-full max-w-3xl mx-auto">
            {/* Header */}
            <div className="mb-8 pb-6 border-b border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-2 font-head uppercase tracking-tight">
                    Formulario de Reclamaciones
                </h2>
                <p className="text-gray-400 text-sm leading-relaxed">
                    Lamentamos que hayas tenido una incidencia. Rellena los datos a continuación y nuestro equipo
                    se pondrá en contacto contigo en un plazo máximo de <strong className="text-gray-600">48 horas hábiles</strong>.
                </p>
            </div>

            {/* Legal notice box */}
            <div className="bg-gray-50 rounded-xl p-4 mb-8 text-xs text-gray-500 leading-relaxed border border-gray-100">
                <p>
                    <strong className="text-gray-700">Información sobre la resolución de litigios.</strong>{' '}
                    De conformidad con el Reglamento (UE) n.º 524/2013 sobre resolución de litigios en línea en materia de consumo,
                    la Comisión Europea pone a disposición una plataforma de resolución en línea accesible en{' '}
                    <a
                        href="https://ec.europa.eu/consumers/odr"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-secondary-dark hover:underline font-medium"
                    >
                        ec.europa.eu/consumers/odr
                    </a>.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Data */}
                <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Datos personales</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Nombre completo <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                required
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none transition-all text-sm bg-white"
                                placeholder="Tu nombre y apellidos"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Correo electrónico <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="email"
                                name="email"
                                required
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none transition-all text-sm bg-white"
                                placeholder="tu@email.com"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Teléfono de contacto</label>
                            <input
                                type="tel"
                                name="phone"
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none transition-all text-sm bg-white"
                                placeholder="+34 000 000 000"
                                value={formData.phone}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Número de pedido</label>
                            <input
                                type="text"
                                name="orderId"
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none transition-all text-sm bg-white"
                                placeholder="#MK-000000"
                                value={formData.orderId}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </div>

                {/* Claim Detail */}
                <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Detalle de la reclamación</h3>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Motivo de la reclamación <span className="text-red-400">*</span>
                        </label>
                        <select
                            name="reason"
                            required
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none transition-all text-sm bg-white appearance-none"
                            value={formData.reason}
                            onChange={handleChange}
                        >
                            <option value="defecto">Producto defectuoso o en mal estado</option>
                            <option value="no_recibido">Pedido no recibido</option>
                            <option value="incorrecto">Producto incorrecto recibido</option>
                            <option value="envio">Problema con el envío o entrega</option>
                            <option value="devolucion">Solicitud de devolución / desistimiento</option>
                            <option value="facturacion">Error de facturación o cobro</option>
                            <option value="publicidad">Publicidad engañosa</option>
                            <option value="otro">Otro motivo</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Descripción detallada <span className="text-red-400">*</span>
                        </label>
                        <textarea
                            name="message"
                            required
                            rows="5"
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none transition-all resize-none text-sm bg-white"
                            placeholder="Describe el problema con el mayor detalle posible. Incluye fechas, importes y cualquier información relevante..."
                            value={formData.message}
                            onChange={handleChange}
                        />
                        <p className="text-xs text-gray-400 mt-1.5">
                            Cuantos más detalles incluyas, antes podremos resolver tu caso.
                        </p>
                    </div>
                </div>

                {/* Privacy */}
                <div className="flex items-start gap-3 pt-2">
                    <div
                        className={`mt-0.5 min-w-[18px] h-[18px] border-2 rounded transition-all flex items-center justify-center cursor-pointer ${formData.terms ? 'bg-secondary-dark border-secondary-dark' : 'border-gray-300 hover:border-secondary-dark'}`}
                        onClick={() => setFormData(prev => ({ ...prev, terms: !prev.terms }))}
                    >
                        {formData.terms && <span className="text-white text-xs font-bold leading-none">✓</span>}
                    </div>
                    <input type="checkbox" name="terms" className="hidden" checked={formData.terms} onChange={handleChange} />
                    <label
                        className="text-xs text-gray-500 leading-relaxed cursor-pointer"
                        onClick={() => setFormData(prev => ({ ...prev, terms: !prev.terms }))}
                    >
                        He leído y acepto la{' '}
                        <Link href={route('privacy.policy')} className="text-secondary-dark font-medium hover:underline">
                            Política de Privacidad
                        </Link>{' '}
                        y autorizo el tratamiento de mis datos personales para la gestión de esta reclamación, de
                        conformidad con el RGPD (UE) 2016/679.
                    </label>
                </div>

                {/* Submit */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-400">
                        Respondemos en un plazo máximo de <strong className="text-gray-600">48 horas hábiles</strong>.
                    </p>
                    <button
                        type="submit"
                        className="w-full sm:w-auto border-2 border-secondary-dark text-secondary-dark px-8 py-3 rounded-full font-bold hover:bg-secondary-dark hover:text-white transition-all text-sm uppercase tracking-wider"
                    >
                        Enviar Reclamación
                    </button>
                </div>
            </form>
        </div>
    );
}
