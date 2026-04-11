import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ShippingStep.css';

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

    const fetchPickupPoints = async (query = '') => {
        setLoading(true);
        try {
            const isPostalCode = /^\d{4,5}$/.test(query.trim());
            const response = await axios.get(route('pickup-points.index'), {
                params: isPostalCode
                    ? { postal_code: query.trim() }
                    : { city: query.trim() }
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
        <div className="space-y-10 animate-in slide-in-from-right duration-700">
            <div className="mb-10 pb-6 border-b border-gray-100">
                <h2 className="text-4xl font-black text-gray-900 tracking-tight">Envío</h2>
                <p className="text-gray-400 text-[10px] uppercase tracking-widest font-bold mt-2">Paso 3 de 4</p>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {shippingMethods.map((method) => (
                    <div
                        key={method.id}
                        className={`group relative border-2 p-8 rounded-3xl cursor-pointer transition-all duration-500 ${data.shipping_method === method.id ? 'border-primary bg-primary/5 ring-8 ring-primary/5' : 'border-gray-50 hover:border-gray-200 bg-white shadow-sm'}`}
                        onClick={() => setData('shipping_method', method.id)}
                    >
                        <div className="flex justify-between items-center w-full">
                            <div className="flex items-center gap-6">
                                <div className={`w-8 h-8 rounded-xl border-4 flex items-center justify-center transition-all duration-500 ${data.shipping_method === method.id ? 'border-primary bg-primary shadow-lg shadow-primary/20' : 'border-gray-100 bg-gray-50'}`}>
                                    {data.shipping_method === method.id && <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /></svg>}
                                </div>
                                <div>
                                    <h3 className="font-black text-xl text-gray-900 leading-none">{method.name}</h3>
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-2">{method.desc}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className={`text-2xl font-black ${data.shipping_method === method.id ? 'text-primary' : 'text-gray-900'}`}>{method.price.toFixed(2)}<span className="text-sm ml-0.5">€</span></span>
                            </div>
                        </div>

                        {/* Pickup Points Selector */}
                        {method.id === 'pickup' && data.shipping_method === 'pickup' && (
                            <div className="mt-10 pt-10 border-t border-primary/10 animate-in slide-in-from-top-4 duration-500" onClick={(e) => e.stopPropagation()}>
                                <div className="flex gap-4 mb-8 bg-white p-2 rounded-2xl border border-primary/10 shadow-sm focus-within:border-primary/30 transition-all">
                                    <input
                                        type="text"
                                        placeholder="Busca por ciudad o CP..."
                                        className="flex-1 rounded-xl border-none text-sm font-bold focus:ring-0 h-12 px-4 placeholder:text-gray-300"
                                        value={searchCity}
                                        onChange={(e) => setSearchCity(e.target.value)}
                                    />
                                    <button
                                        onClick={handleSearch}
                                        className="px-8 py-2 bg-gray-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary transition-all active:scale-95 shadow-lg shadow-black/5"
                                    >
                                        Buscar
                                    </button>
                                </div>

                                {loading ? (
                                    <div className="flex flex-col items-center py-10 text-primary">
                                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-current mb-4"></div>
                                        <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Localizando puntos...</span>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 gap-4 max-h-80 overflow-y-auto pr-2 custom-scrollbar p-2">
                                        {pickupPoints.length > 0 ? (
                                            pickupPoints.map((point) => (
                                                <div
                                                    key={point.id}
                                                    className={`p-6 rounded-2xl border-2 transition-all duration-300 transform group/point ${data.pickup_point_id === point.id ? 'bg-white border-primary shadow-xl shadow-primary/10 -translate-y-1' : 'bg-gray-50/50 border-transparent hover:border-gray-100 hover:bg-white'}`}
                                                    onClick={() => setData('pickup_point_id', point.id)}
                                                >
                                                    <div className="flex justify-between items-center text-left">
                                                        <div className="flex-1">
                                                            <div className={`font-black uppercase tracking-tight text-sm transition-colors ${data.pickup_point_id === point.id ? 'text-primary' : 'text-gray-900 group-hover/point:text-primary'}`}>{point.name}</div>
                                                            <div className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mt-2 leading-relaxed">
                                                                {point.address} — {point.postal_code} {point.city}
                                                            </div>
                                                        </div>
                                                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${data.pickup_point_id === point.id ? 'bg-primary text-white scale-110' : 'bg-gray-200 text-transparent group-hover/point:bg-primary/20 group-hover/point:text-primary'}`}>
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /></svg>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-12 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-100">
                                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 border border-gray-100 shadow-sm text-gray-300">
                                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                                </div>
                                                <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest leading-relaxed px-10">No encontramos tiendas en esta zona.<br />Prueba con otra ciudad o CP.</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-12 border-t border-gray-100 mt-12">
                <button
                    type="button"
                    onClick={onBack}
                    className="flex justify-center items-center px-8 py-4 bg-gray-50 rounded-2xl text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-primary hover:bg-primary/5 transition-all duration-300 group order-2 md:order-1 min-w-[200px]"
                >
                    <span className="mr-2 group-hover:-translate-x-1 transition-transform">
                        &larr;
                    </span>{" "}
                    Mis Datos
                </button>
                <button
                    onClick={onNext}
                    disabled={!data.shipping_method || (data.shipping_method === 'pickup' && !data.pickup_point_id)}
                    className={`px-12 py-5 font-black rounded-2xl shadow-2xl transition-all duration-500 transform hover:-translate-y-1 active:scale-95 text-xl w-full md:w-auto order-1 md:order-2 flex items-center justify-center min-w-[320px] group ${(!data.shipping_method || (data.shipping_method === 'pickup' && !data.pickup_point_id)) ? 'bg-gray-100 text-gray-300 cursor-not-allowed shadow-none' : 'bg-primary text-white hover:bg-primary-dark shadow-primary/20'}`}
                >
                    CONTINUAR A PAGO
                    <svg className="w-5 h-5 ml-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
