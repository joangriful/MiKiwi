import React from 'react';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';

export default function PaymentStep({ data, setData, onSubmit, onBack, processing }) {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-4">4. Pago Seguro</h2>

            <div className="space-y-4 mb-6">
                <div className="border p-4 rounded-lg bg-gray-50">
                    <div className="flex items-center mb-4">
                        <input
                            type="radio"
                            checked={true}
                            readOnly
                            className="mr-3 text-primary h-5 w-5 focus:ring-primary"
                        />
                        <span className="font-medium">Tarjeta de Crédito / Débito</span>
                    </div>

                    <div className="space-y-4 ml-7">
                        <div>
                            <InputLabel value="Número de tarjeta" />
                            <TextInput
                                placeholder="0000 0000 0000 0000"
                                className="w-full mt-1 bg-white"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <InputLabel value="Fecha de caducidad (MM/YY)" />
                                <TextInput
                                    placeholder="MM/YY"
                                    className="w-full mt-1 bg-white"
                                />
                            </div>
                            <div>
                                <InputLabel value="CVC" />
                                <TextInput
                                    placeholder="123"
                                    className="w-full mt-1 bg-white"
                                />
                            </div>
                        </div>
                        <div>
                            <InputLabel value="Titular de la tarjeta" />
                            <TextInput
                                placeholder="Nombre como aparece en la tarjeta"
                                className="w-full mt-1 bg-white"
                            />
                        </div>
                    </div>
                </div>

                <div className="border p-4 rounded-lg flex items-center opacity-50">
                    <input type="radio" disabled className="mr-3" />
                    <span>PayPal (Próximamente)</span>
                </div>
            </div>

            <div className="flex items-center mb-6">
                <input
                    type="checkbox"
                    id="billing"
                    checked={data.billing_same_as_shipping}
                    onChange={(e) => setData('billing_same_as_shipping', e.target.checked)}
                    className="mr-2 text-primary rounded focus:ring-primary h-5 w-5"
                />
                <label htmlFor="billing" className="text-sm text-gray-700">
                    La dirección de facturación es la misma que la de envío
                </label>
            </div>

            <div className="flex justify-between items-center pt-6">
                <button type="button" onClick={onBack} className="text-primary hover:text-primary-dark font-medium">
                    &lt; Volver a Envíos
                </button>
                <button
                    onClick={onSubmit}
                    disabled={processing}
                    className="px-12 py-4 bg-primary text-white font-black rounded-xl hover:bg-primary-dark shadow-xl shadow-green-100 transition-all duration-300 transform hover:-translate-y-1 active:scale-95 text-lg w-full md:w-auto"
                >
                    {processing ? 'Procesando...' : 'Pagar Ahora'}
                </button>
            </div>
        </div>
    );
}
