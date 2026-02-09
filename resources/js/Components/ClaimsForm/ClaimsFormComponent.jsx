import { useState } from 'react';
import { Link } from '@inertiajs/react';

export default function ClaimsFormComponent() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        orderId: '',
        reason: 'defecto',
        message: '',
        files: null
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        // Here would go the logic to send to backend
        alert('Gracias. Su reclamación ha sido registrada. Nos pondremos en contacto con usted en breves.');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 md:p-12 w-full max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Formulario de Reclamaciones</h2>
            <p className="text-gray-500 mb-8 text-sm">
                Lamentamos que hayas tenido una incidencia. Por favor, rellena los detalles a continuación y nos pondremos en contacto contigo lo antes posible para solucionarlo.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
                        <input
                            type="text"
                            name="name"
                            required
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#99b849]/20 focus:border-[#99b849] outline-none transition-all"
                            placeholder="Tu nombre"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
                        <input
                            type="email"
                            name="email"
                            required
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#99b849]/20 focus:border-[#99b849] outline-none transition-all"
                            placeholder="tu@email.com"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                        <input
                            type="tel"
                            name="phone"
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#99b849]/20 focus:border-[#99b849] outline-none transition-all"
                            placeholder="+34 000 000 000"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Order ID */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Número de Pedido (Opcional)</label>
                        <input
                            type="text"
                            name="orderId"
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#99b849]/20 focus:border-[#99b849] outline-none transition-all"
                            placeholder="#123456"
                            value={formData.orderId}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                {/* Reason */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Motivo de la reclamación</label>
                    <select
                        name="reason"
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#99b849]/20 focus:border-[#99b849] outline-none transition-all bg-white"
                        value={formData.reason}
                        onChange={handleChange}
                    >
                        <option value="defecto">Producto defectuoso o en mal estado</option>
                        <option value="envio">Problema con el envío / Entrega</option>
                        <option value="facturacion">Problema de facturación</option>
                        <option value="otro">Otro</option>
                    </select>
                </div>

                {/* Message */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Detalle de la incidencia</label>
                    <textarea
                        name="message"
                        required
                        rows="5"
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#99b849]/20 focus:border-[#99b849] outline-none transition-all resize-none"
                        placeholder="Describe el problema con el mayor detalle posible..."
                        value={formData.message}
                        onChange={handleChange}
                    ></textarea>
                </div>

                {/* Terms */}
                <div className="flex items-start gap-3">
                    <input
                        type="checkbox"
                        id="privacy"
                        required
                        className="mt-1 w-4 h-4 rounded border-gray-300 text-[#99b849] focus:ring-[#99b849]"
                    />
                    <label htmlFor="privacy" className="text-xs text-gray-500">
                        He leído y acepto la <Link href="/politica-privacidad" className="text-[#99b849] hover:underline">Política de Privacidad</Link> y autorizo el tratamiento de mis datos para la gestión de esta reclamación.
                    </label>
                </div>

                {/* Submit */}
                <div className="pt-4 flex justify-end">
                    <button
                        type="submit"
                        className="bg-gray-900 text-white px-8 py-3 rounded-lg font-medium hover:bg-black transition-all shadow-lg hover:shadow-xl active:scale-95"
                    >
                        Enviar Reclamación
                    </button>
                </div>
            </form>
        </div>
    );
}
