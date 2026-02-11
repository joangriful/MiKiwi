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
            // Priority: Search term -> User city -> User Postal Code
            const initialSearch = searchCity || data.city || data.postal_code || '';
            fetchPickupPoints(initialSearch);
        }
    }, [data.shipping_method]);

    const fetchPickupPoints = async (city = '') => {
        setLoading(true);
        try {
            const response = await axios.get(route('pickup-points.index'), {
                params: {
                    city: city,
                    postal_code: data.postal_code // Also pass CP for better filtering
                }
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
        <div className="space-y-8 animate-in slide-in-from-right duration-500">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-2">3. Método de Envío</h2>
            <p className="text-sm text-gray-500 mb-6">Elige cómo quieres recibir tu pedido.</p>

            <div className="space-y-4">
                {shippingMethods.map((method) => (
                    <div
                        key={method.id}
                        className={`group relative border-2 p-6 rounded-2xl cursor-pointer transition-all duration-300 ${data.shipping_method === method.id ? 'border-primary bg-primary/5 ring-4 ring-primary/5' : 'border-gray-100 hover:border-gray-200 bg-white'}`}
                        onClick={() => setData('shipping_method', method.id)}
                    >
                        <div className="flex justify-between items-center w-full">
                            <div className="flex items-center">
                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 transition-colors ${data.shipping_method === method.id ? 'border-primary bg-primary' : 'border-gray-300'}`}>
                                    {data.shipping_method === method.id && <div className="w-2 h-2 rounded-full bg-white"></div>}
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">{method.name}</h3>
                                    <p className="text-xs text-gray-500 font-medium">{method.desc}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className={`text-lg font-black ${data.shipping_method === method.id ? 'text-primary' : 'text-gray-900'}`}>{method.price.toFixed(2)} €</span>
                            </div>
                        </div>

                        {/* Pickup Points Selector */}
                        {method.id === 'pickup' && data.shipping_method === 'pickup' && (
                            <div className="mt-8 pt-8 border-t border-primary/10 slide-in-from-top duration-300" onClick={(e) => e.stopPropagation()}>
                                <div className="flex gap-2 mb-6">
                                    <input
                                        type="text"
                                        placeholder="Ciudad o código postal..."
                                        className="flex-1 rounded-xl border-gray-200 text-sm focus:border-primary focus:ring-4 focus:ring-primary/5 h-12"
                                        value={searchCity}
                                        onChange={(e) => setSearchCity(e.target.value)}
                                    />
                                    <button
                                        onClick={handleSearch}
                                        className="px-6 py-2 bg-gray-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all"
                                    >
                                        Buscar
                                    </button>
                                </div>

                                {loading ? (
                                    <div className="flex flex-col items-center py-8 text-primary">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-current mb-2"></div>
                                        <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Buscando puntos cercanos...</span>
                                    </div>
                                ) : (
                                    <div className="space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                                        {pickupPoints.length > 0 ? (
                                            pickupPoints.map((point) => (
                                                <div
                                                    key={point.id}
                                                    className={`p-4 rounded-xl border-2 transition-all group/point ${data.pickup_point_id === point.id ? 'bg-white border-primary shadow-lg shadow-primary/5' : 'bg-white border-gray-50 hover:border-gray-200'}`}
                                                    onClick={() => setData('pickup_point_id', point.id)}
                                                >
                                                    <div className="flex justify-between items-start">
                                                        <div className="flex-1">
                                                            <div className="font-bold text-gray-900 text-sm mb-1">{point.name}</div>
                                                            <div className="text-[11px] text-gray-500 font-medium leading-relaxed">
                                                                {point.address}<br />
                                                                {point.postal_code} {point.city}
                                                            </div>
                                                        </div>
                                                        {data.pickup_point_id === point.id && (
                                                            <div className="bg-primary/10 p-1.5 rounded-full">
                                                                <svg className="w-3 h-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                                                </svg>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-8 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                                <p className="text-xs font-bold text-gray-400">No hay puntos disponibles en esta zona.</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-10 border-t border-gray-100">
                <button
                    type="button"
                    onClick={onBack}
                    className="flex items-center px-6 py-3 rounded-xl border-2 border-gray-100 text-gray-400 hover:text-primary hover:border-primary/20 transition-all duration-300 font-bold text-xs uppercase tracking-widest order-2 md:order-1"
                >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                    Información
                </button>
                <button
                    onClick={onNext}
                    disabled={!data.shipping_method || (data.shipping_method === 'pickup' && !data.pickup_point_id)}
                    className={`px-12 py-4 font-black rounded-2xl shadow-2xl transition-all duration-300 transform hover:-translate-y-1 active:scale-95 text-lg w-full md:w-auto order-1 md:order-2 flex items-center justify-center min-w-[280px] ${(!data.shipping_method || (data.shipping_method === 'pickup' && !data.pickup_point_id)) ? 'bg-gray-100 text-gray-300 cursor-not-allowed shadow-none' : 'bg-primary text-white hover:bg-primary-dark shadow-primary/20'}`}
                >
                    CONTINUAR A PAGO
                    <svg className="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
