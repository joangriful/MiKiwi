import React, { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import styles from './OrderHistoryTab.module.css';

const STATUS_LABELS = {
    pending: { label: 'Pendiente', className: 'pending' },
    processing: { label: 'En proceso', className: 'processing' },
    shipped: { label: 'Enviado', className: 'shipped' },
    delivered: { label: 'Entregado', className: 'delivered' },
    cancelled: { label: 'Cancelado', className: 'cancelled' },
};

export default function OrderHistoryTab({ orders = [] }) {
    const { props } = usePage();
    const allOrders = orders.length > 0 ? orders : (props.orders || []);
    const [expandedId, setExpandedId] = useState(null);
    const [cancellingId, setCancellingId] = useState(null);
    const flash = props.flash || {};

    const handleCancel = (orderId) => {
        if (!confirm('¿Estás seguro de que quieres cancelar este pedido?')) {
            return;
        }

        setCancellingId(orderId);
        router.patch(route('orders.cancel', orderId), {}, {
            onFinish: () => setCancellingId(null),
        });
    };

    if (allOrders.length === 0) {
        return (
            <div className={`${styles.root} ${styles.emptyPanel}`}>
                <div className={styles.emptyIconWrap}>
                    <svg className={styles.emptyIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                </div>
                <h3 className={styles.emptyTitle}>Sin pedidos todavía</h3>
                <p className={styles.emptyDescription}>Cuando realices tu primer pedido, aparecerá aquí.</p>
            </div>
        );
    }

    return (
        <div className={`${styles.root} ${styles.panel}`}>
            <h2 className={styles.title}>Historial de pedidos</h2>

            {flash.success && <div className={`${styles.flash} ${styles.flashSuccess}`}>{flash.success}</div>}
            {flash.error && <div className={`${styles.flash} ${styles.flashError}`}>{flash.error}</div>}

            <div className={styles.list}>
                {allOrders.map((order) => {
                    const statusInfo = STATUS_LABELS[order.status] || { label: order.status, className: 'default' };
                    const isExpanded = expandedId === order.id;
                    const canCancel = ['pending', 'processing'].includes(order.status);
                    const address = order.shipping_address_snapshot || {};
                    const total = parseFloat(order.total_amount || 0).toFixed(2);
                    const date = new Date(order.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });

                    return (
                        <div key={order.id} className={styles.orderCard}>
                            <div className={styles.orderHeader}>
                                <div>
                                    <h3 className={styles.orderNumber}>{order.order_number}</h3>
                                    <p className={styles.orderDate}>Realizado el {date}</p>
                                </div>
                                <div className={styles.orderHeaderMeta}>
                                    <span className={`${styles.statusBadge} ${styles[`status${statusInfo.className.charAt(0).toUpperCase()}${statusInfo.className.slice(1)}`] || styles.statusDefault}`}>
                                        {statusInfo.label}
                                    </span>
                                    <span className={styles.orderTotal}>{total} €</span>
                                </div>
                            </div>

                            <div className={styles.orderBody}>
                                <div className={styles.itemsPreview}>
                                    {(order.items || []).map((item, index) => (
                                        <div key={index} className={styles.itemChip}>
                                            {item.product_name_snapshot}
                                            <span className={styles.itemQty}>× {item.quantity}</span>
                                        </div>
                                    ))}
                                </div>

                                {isExpanded && (
                                    <div className={styles.expanded}>
                                        <div className={styles.detailBox}>
                                            <p className={styles.detailLabel}>Dirección de envío</p>
                                            <p className={styles.detailName}>{address.full_name}</p>
                                            <p className={styles.detailText}>{address.street_address}</p>
                                            <p className={styles.detailText}>{address.postal_code} {address.city}, {address.country}</p>
                                        </div>
                                        <div className={styles.detailBox}>
                                            <p className={styles.detailLabel}>Desglose</p>
                                            {(order.items || []).map((item, index) => (
                                                <div key={index} className={styles.breakdownRow}>
                                                    <span className={styles.breakdownText}>{item.product_name_snapshot} × {item.quantity}</span>
                                                    <span className={styles.breakdownPrice}>
                                                        {(parseFloat(item.unit_price) * item.quantity).toFixed(2)} €
                                                    </span>
                                                </div>
                                            ))}
                                            <div className={styles.breakdownTotal}>
                                                <span>Total</span>
                                                <span>{total} €</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className={styles.actions}>
                                    <button type="button" onClick={() => setExpandedId(isExpanded ? null : order.id)} className={styles.linkAction}>
                                        {isExpanded ? 'Ocultar detalles' : 'Ver detalles'}
                                    </button>
                                    <a href={route('orders.invoice', order.id)} target="_blank" rel="noopener noreferrer" className={styles.linkAction}>
                                        Descargar factura
                                    </a>
                                    {canCancel && (
                                        <button
                                            type="button"
                                            onClick={() => handleCancel(order.id)}
                                            disabled={cancellingId === order.id}
                                            className={styles.cancelAction}
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
