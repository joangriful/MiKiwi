import React from 'react';
import { Link } from '@inertiajs/react';

export default function OrderHistoryTab() {
    // Mock data for orders
    const orders = [
        {
            id: 'Pedido 001',
            date: '20 Oct, 2024',
            status: 'Entregado',
            total: '125.00 euros',
            items: [
                { id: 1, name: 'Camiseta Básica', image: '/assets/products/p1.png' }, // Mock image paths
                { id: 2, name: 'Pantalón Vaquero', image: '/assets/products/p2.png' },
            ]
        },
        {
            id: 'Pedido 002',
            date: '05 Nov, 2024',
            status: 'En camino',
            total: '45.50 euros',
            items: [
                { id: 3, name: 'Gorra Negra', image: '/assets/products/p3.png' },
            ]
        }
    ];

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Historial de pedidos</h2>

            <div className="space-y-6">
                {orders.map((order) => (
                    <div key={order.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex flex-wrap justify-between items-center mb-4 pb-4 border-b border-gray-100">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">{order.id}</h3>
                                <p className="text-sm text-gray-500">Realizado el {order.date}</p>
                            </div>
                            <div className="text-right">
                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-1 ${order.status === 'Entregado' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                                    }`}>
                                    {order.status}
                                </span>
                                <p className="font-bold text-gray-900">{order.total}</p>
                            </div>
                        </div>

                        <div className="mt-4">
                            <p className="text-sm text-gray-600 mb-3 font-medium">Productos en este pedido:</p>
                            <div className="flex flex-wrap gap-4">
                                {order.items.map((item) => (
                                    <Link key={item.id} href={`/profile/orders/${order.id}`} className="group relative block w-24 h-24 bg-gray-100 rounded-md overflow-hidden border border-gray-200">
                                        {/* Using a placeholder div if image fails or for demo, but mimicking an img tag */}
                                        <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-400 group-hover:scale-105 transition-transform duration-300">
                                            {/* If we had real images we would use <img src={item.image} ... /> */}
                                            <span className="text-xs text-center p-1">{item.name}</span>
                                        </div>
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                                    </Link>
                                ))}
                            </div>
                            <div className="mt-4 text-right">
                                <Link href={`/profile/orders/${order.id}`} className="text-sm text-[#99b849] font-medium hover:text-[#7a943a] hover:underline">
                                    Ver detalles del pedido
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
