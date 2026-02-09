import React from 'react';

export default function ShippingStep({ data, setData, onNext, onBack }) {

    const shippingMethods = [
        { id: 'standard', name: 'Envío a Domicilio', price: 3.99, desc: 'Entrega en 24-48h' },
        { id: 'pickup', name: 'Punto de Recogida', price: 2.99, desc: 'Recoge en tienda más cercana' },
    ];

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-4">3. Método de Envío</h2>

            <div className="space-y-4">
                {shippingMethods.map((method) => (
                    <div
                        key={method.id}
                        className={`border p-5 rounded-xl cursor-pointer flex justify-between items-center transition-all ${data.shipping_method === method.id ? 'border-primary bg-green-50 bg-opacity-30 ring-1 ring-primary' : 'border-gray-200 hover:border-gray-300'}`}
                        onClick={() => setData('shipping_method', method.id)}
                    >
                        <div className="flex items-center">
                            <input
                                type="radio"
                                name="shipping_method"
                                value={method.id}
                                checked={data.shipping_method === method.id}
                                onChange={() => setData('shipping_method', method.id)}
                                className="mr-3 text-primary focus:ring-primary h-5 w-5"
                            />
                            <div>
                                <h3 className="font-medium text-gray-900">{method.name}</h3>
                                <p className="text-sm text-gray-500">{method.desc}</p>
                            </div>
                        </div>
                        <span className="font-bold">{method.price.toFixed(2)} €</span>
                    </div>
                ))}
            </div>

            <div className="flex justify-between items-center pt-6">
                <button type="button" onClick={onBack} className="text-primary hover:text-primary-dark font-medium">
                    &lt; Volver a Información
                </button>
                <button
                    onClick={onNext}
                    disabled={!data.shipping_method}
                    className={`px-8 py-3 rounded-xl font-bold text-white transition-all duration-300 ${!data.shipping_method ? 'bg-gray-300 cursor-not-allowed' : 'bg-primary hover:bg-primary-dark shadow-lg shadow-green-100 hover:-translate-y-0.5 active:scale-95'}`}
                >
                    Continuar a Pago &rarr;
                </button>
            </div>
        </div>
    );
}
