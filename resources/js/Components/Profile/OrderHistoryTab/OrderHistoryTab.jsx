import React, { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import styles from './OrderHistoryTab.module.css';

const STATUS_LABELS = {
    pending: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800' },
    processing: { label: 'En proceso', color: 'bg-blue-100 text-blue-800' },
    shipped: { label: 'Enviado', color: 'bg-indigo-100 text-indigo-800' },
    delivered: { label: 'Entregado', color: 'bg-green-100 text-green-800' },
    cancelled: { label: 'Cancelado', color: 'bg-red-100 text-red-800' },
};

export default function OrderHistoryTab({ orders = [] }) {
    const { props } = usePage();
    // Support orders passed from the parent (perfil.jsx) or from usePage
    const allOrders = orders.length > 0 ? orders : (props.orders || []);
    const [expandedId, setExpandedId] = useState(null);
    const [cancellingId, setCancellingId] = useState(null);
    const flash = props.flash || {};

    const handleCancel = (orderId) => {
        if (!confirm('¿Estás seguro de que quieres cancelar este pedido?')) return;
        setCancellingId(orderId);
        router.patch(route('orders.cancel', orderId), {}, {
            onFinish: () => setCancellingId(null),
        });
    };

    if (allOrders.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-10 text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-gray-100">
                    <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-700 mb-2">Sin pedidos todavía</h3>
                <p className="text-sm text-gray-400">Cuando realices tu primer pedido, aparecerá aquí.</p>
            </div>
        );
    }

    return (
        <div className={`${styles.root} bg-white rounded-xl shadow-sm border border-gray-100 p-6`}>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Historial de pedidos</h2>

            {flash.success && (
                <div className="mb-4 p-4 rounded-xl bg-green-50 border border-green-100 text-green-800 text-sm font-medium">
                    {flash.success}
                </div>
            )}
            {flash.error && (
                <div className="mb-4 p-4 rounded-xl bg-red-50 border border-red-100 text-red-800 text-sm font-medium">
                    {flash.error}
                </div>
            )}

            <div className="space-y-5">
                {allOrders.map((order) => {
                    const statusInfo = STATUS_LABELS[order.status] || { label: order.status, color: 'bg-gray-100 text-gray-700' };
                    const isExpanded = expandedId === order.id;
                    const canCancel = ['pending', 'processing'].includes(order.status);
                    const address = order.shipping_address_snapshot || {};
                    const total = parseFloat(order.total_amount || 0).toFixed(2);
                    const date = new Date(order.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });

                    return (
                        <div key={order.id} className="border border-gray-200 rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
                            {/* Order header */}
                            <div className="flex flex-wrap justify-between items-center p-6 gap-4">
                                <div>
                                    <h3 className="font-body text-xl text-gray-900 font-bold">{order.order_number}</h3>
                                    <p className="text-xs text-gray-400 font-medium mt-1">Realizado el {date}</p>
                                </div>
                                <div className="flex flex-wrap items-center gap-3">
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${statusInfo.color}`}>
                                        {statusInfo.label}
                                    </span>
                                    <span className="text-lg font-black text-gray-900">{total} €</span>
                                </div>
                            </div>

                            {/* Items preview */}
                            <div className="px-6 pb-4 border-t border-gray-50 pt-4">
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {(order.items || []).map((item, i) => (
                                        <div key={i} className="text-xs bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 font-medium text-gray-700">
                                            {item.product_name_snapshot}
                                            <span className="ml-1 text-gray-400">× {item.quantity}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Expanded details */}
                                {isExpanded && (
                                    <div className="mt-4 mb-4 space-y-4 animate-in slide-in-from-top-2 duration-300">
                                        <div className="p-4 bg-gray-50 rounded-xl">
                                            <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Dirección de envío</p>
                                            <p className="text-sm text-gray-700 font-medium">{address.full_name}</p>
                                            <p className="text-sm text-gray-500">{address.street_address}</p>
                                            <p className="text-sm text-gray-500">{address.postal_code} {address.city}, {address.country}</p>
                                        </div>
                                        <div className="p-4 bg-gray-50 rounded-xl">
                                            <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Desglose</p>
                                            {(order.items || []).map((item, i) => (
                                                <div key={i} className="flex justify-between text-sm py-1">
                                                    <span className="text-gray-700">{item.product_name_snapshot} × {item.quantity}</span>
                                                    <span className="font-bold text-gray-900">
                                                        {(parseFloat(item.unit_price) * item.quantity).toFixed(2)} €
                                                    </span>
                                                </div>
                                            ))}
                                            <div className="border-t border-gray-200 mt-2 pt-2 flex justify-between font-black text-gray-900">
                                                <span>Total</span>
                                                <span>{total} €</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="flex flex-wrap gap-3 justify-end">
                                    <button
                                        onClick={() => setExpandedId(isExpanded ? null : order.id)}
                                        className="text-xs font-black text-[#99b849] hover:underline uppercase tracking-widest"
                                    >
                                        {isExpanded ? 'Ocultar detalles' : 'Ver detalles'}
                                    </button>
                                    {canCancel && (
                                        <button
                                            onClick={() => handleCancel(order.id)}
                                            disabled={cancellingId === order.id}
                                            className="text-xs font-black text-red-500 hover:underline uppercase tracking-widest disabled:opacity-50"
                                        >
                                            {cancellingId === order.id ? 'Cancelando...' : 'Cancelar pedido'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
