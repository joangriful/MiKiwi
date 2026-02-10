import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function ShippingStep({ data, setData, onNext, onBack }) {
    const [pickupPoints, setPickupPoints] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchCity, setSearchCity] = useState('');

    const shippingMethods = [
        { id: 'standard', name: 'Envío a Domicilio', price: 3.99, desc: 'Entrega en 24-48h' },
        { id: 'pickup', name: 'Punto de Recogida', price: 2.99, desc: 'Recoge en tienda más cercana' },
    ];

    useEffect(() => {
        if (data.shipping_method === 'pickup') {
            fetchPickupPoints();
        }
    }, [data.shipping_method]);

    const fetchPickupPoints = async (city = '') => {
        setLoading(true);
        try {
            const response = await axios.get(route('pickup-points.index'), {
                params: { city }
            });
            setPickupPoints(response.data);
        } catch (error) {
            console.error('Error fetching pickup points:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchPickupPoints(searchCity);
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-4">3. Método de Envío</h2>

            <div className="space-y-4">
                {shippingMethods.map((method) => (
                    <div
                        key={method.id}
                        className={`border p-5 rounded-xl cursor-pointer flex flex-col transition-all ${data.shipping_method === method.id ? 'border-primary bg-green-50 bg-opacity-30 ring-1 ring-primary' : 'border-gray-200 hover:border-gray-300'}`}
                        onClick={() => setData('shipping_method', method.id)}
                    >
                        <div className="flex justify-between items-center w-full">
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

                        {/* Pickup Points Selector */}
                        {method.id === 'pickup' && data.shipping_method === 'pickup' && (
                            <div className="mt-6 pt-6 border-t border-green-100" onClick={(e) => e.stopPropagation()}>
                                <div className="flex gap-2 mb-4">
                                    <input
                                        type="text"
                                        placeholder="Buscar por ciudad..."
                                        className="flex-1 rounded-lg border-gray-200 text-sm focus:border-primary focus:ring-primary"
                                        value={searchCity}
                                        onChange={(e) => setSearchCity(e.target.value)}
                                    />
                                    <button
                                        onClick={handleSearch}
                                        className="px-4 py-2 bg-gray-800 text-white rounded-lg text-xs font-bold"
                                    >
                                        Buscar
                                    </button>
                                </div>

                                {loading ? (
                                    <div className="text-center py-4">
                                        <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                                        <span className="ml-2 text-sm text-gray-500">Buscando puntos...</span>
                                    </div>
                                ) : (
                                    <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                                        {pickupPoints.length > 0 ? (
                                            pickupPoints.map((point) => (
                                                <div
                                                    key={point.id}
                                                    className={`p-3 rounded-lg border text-sm cursor-pointer transition-colors ${data.pickup_point_id === point.id ? 'bg-white border-primary shadow-sm' : 'bg-gray-50 border-gray-100 hover:border-gray-200'}`}
                                                    onClick={() => setData('pickup_point_id', point.id)}
                                                >
                                                    <div className="font-bold text-gray-900">{point.name}</div>
                                                    <div className="text-gray-500">{point.address}, {point.postal_code} {point.city}</div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-xs text-center text-gray-400 py-4">No se encontraron puntos de recogida.</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="flex justify-between items-center pt-6">
                <button type="button" onClick={onBack} className="text-primary hover:text-primary-dark font-medium">
                    &lt; Volver a Información
                </button>
                <button
                    onClick={onNext}
                    disabled={!data.shipping_method || (data.shipping_method === 'pickup' && !data.pickup_point_id)}
                    className={`px-8 py-3 rounded-xl font-bold text-white transition-all duration-300 ${(!data.shipping_method || (data.shipping_method === 'pickup' && !data.pickup_point_id)) ? 'bg-gray-300 cursor-not-allowed' : 'bg-primary hover:bg-primary-dark shadow-lg shadow-green-100 hover:-translate-y-0.5 active:scale-95'}`}
                >
                    Continuar a Pago &rarr;
                </button>
            </div>
        </div>
    );
}
