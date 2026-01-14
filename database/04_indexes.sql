-- ======================================================================================
-- ARCHIVO: 04_indexes.sql
-- DESCRIPCIÓN: Índices optimizados para rendimiento
-- ORDEN DE EJECUCIÓN: 4 de 9
-- ======================================================================================

-- ======================================================================================
-- 1. ÍNDICES DE USUARIOS
-- ======================================================================================

-- Email para login (excluir soft deletes)
CREATE INDEX idx_users_email_active 
    ON users(email) 
    WHERE deleted_at IS NULL;

-- Usuarios activos por rol
CREATE INDEX idx_users_role_active 
    ON users(role) 
    WHERE is_active = TRUE AND deleted_at IS NULL;

-- ======================================================================================
-- 2. ÍNDICES DE CATÁLOGO
-- ======================================================================================

-- Categorías activas ordenadas
CREATE INDEX idx_categories_active_order 
    ON categories(display_order, name) 
    WHERE is_active = TRUE AND deleted_at IS NULL;

-- Categorías por padre (para árbol de categorías)
CREATE INDEX idx_categories_parent 
    ON categories(parent_id) 
    WHERE deleted_at IS NULL;

-- Productos por categoría (filtrado principal)
CREATE INDEX idx_products_category_active 
    ON products(category_id) 
    WHERE deleted_at IS NULL;

-- Productos destacados ordenados por rating
CREATE INDEX idx_products_featured 
    ON products(is_featured, avg_rating DESC) 
    WHERE is_featured = TRUE AND deleted_at IS NULL;

-- Productos por precio (filtrado de rango)
CREATE INDEX idx_products_price 
    ON products(base_price) 
    WHERE deleted_at IS NULL;

-- Productos: combinación típica de filtros
CREATE INDEX idx_products_category_price_rating 
    ON products(category_id, base_price, avg_rating DESC) 
    WHERE deleted_at IS NULL;

-- Full-text search en español (nombre + descripción)
CREATE INDEX idx_products_fts 
    ON products 
    USING GIN (to_tsvector('spanish', name || ' ' || COALESCE(description, '')));

-- Productos por SKU
CREATE INDEX idx_products_sku 
    ON products(sku) 
    WHERE deleted_at IS NULL;

-- Variantes por producto
CREATE INDEX idx_product_variants_product 
    ON product_variants(product_id) 
    WHERE is_active = TRUE AND deleted_at IS NULL;

-- ======================================================================================
-- 3. ÍNDICES DE PEDIDOS (Keyset Pagination)
-- ======================================================================================

-- Keyset pagination eficiente (mejor que OFFSET para grandes datasets)
-- Uso: WHERE (created_at, id) < ($last_created_at, $last_id) ORDER BY created_at DESC, id DESC LIMIT 20
CREATE INDEX idx_orders_keyset 
    ON orders(created_at DESC, id DESC);

-- Pedidos por usuario
CREATE INDEX idx_orders_user 
    ON orders(user_id, created_at DESC);

-- Pedidos por estado (para dashboard admin)
CREATE INDEX idx_orders_status 
    ON orders(status, created_at DESC);

-- Pedidos por estado de pago
CREATE INDEX idx_orders_payment_status 
    ON orders(payment_status, created_at DESC);

-- Pedidos pendientes (vista frecuente)
CREATE INDEX idx_orders_pending 
    ON orders(created_at DESC) 
    WHERE status = 'pending' AND payment_status = 'pending';

-- Order number para búsqueda directa
CREATE INDEX idx_orders_order_number 
    ON orders(order_number);

-- Order items por pedido
CREATE INDEX idx_order_items_order 
    ON order_items(order_id);

-- Order items por producto (para analytics)
CREATE INDEX idx_order_items_product 
    ON order_items(product_id);

-- ======================================================================================
-- 4. ÍNDICES DE CARRITO Y WISHLIST
-- ======================================================================================

-- Carrito por usuario
CREATE INDEX idx_carts_user 
    ON carts(user_id);

-- Items del carrito
CREATE INDEX idx_cart_items_cart 
    ON cart_items(cart_id);

-- Wishlist por usuario
CREATE INDEX idx_wishlists_user 
    ON wishlists(user_id);

-- Wishlist por producto (para conteo de popularidad)
CREATE INDEX idx_wishlists_product 
    ON wishlists(product_id);

-- ======================================================================================
-- 5. ÍNDICES DE REVIEWS
-- ======================================================================================

-- Reviews aprobadas por producto (para mostrar en PDP)
CREATE INDEX idx_reviews_product_approved 
    ON reviews(product_id, created_at DESC) 
    WHERE is_approved = TRUE AND deleted_at IS NULL;

-- Reviews por usuario
CREATE INDEX idx_reviews_user 
    ON reviews(user_id) 
    WHERE deleted_at IS NULL;

-- Reviews pendientes de moderación
CREATE INDEX idx_reviews_pending 
    ON reviews(created_at DESC) 
    WHERE is_approved = FALSE AND deleted_at IS NULL;

-- ======================================================================================
-- 6. ÍNDICES DE SOPORTE
-- ======================================================================================

-- Tickets por usuario y estado
CREATE INDEX idx_support_tickets_user_status 
    ON support_tickets(user_id, status) 
    WHERE deleted_at IS NULL;

-- Tickets abiertos por prioridad (para dashboard soporte)
CREATE INDEX idx_support_tickets_open_priority 
    ON support_tickets(priority, created_at DESC) 
    WHERE status IN ('open', 'in_progress') AND deleted_at IS NULL;

-- Ticket number para búsqueda
CREATE INDEX idx_support_tickets_number 
    ON support_tickets(ticket_number);

-- Mensajes por ticket
CREATE INDEX idx_ticket_messages_ticket 
    ON ticket_messages(ticket_id, created_at);

-- ======================================================================================
-- 7. ÍNDICES DE NOTIFICACIONES
-- ======================================================================================

-- Notificaciones no leídas por usuario
CREATE INDEX idx_notifications_user_unread 
    ON notifications(user_id, created_at DESC) 
    WHERE is_read = FALSE;

-- ======================================================================================
-- 8. ÍNDICES DE CUPONES
-- ======================================================================================

-- Cupones activos y válidos
CREATE INDEX idx_coupons_active_valid 
    ON coupons(code) 
    WHERE is_active = TRUE AND deleted_at IS NULL;

-- ======================================================================================
-- 9. ÍNDICES DE AUDITORÍA Y LOGS
-- ======================================================================================

-- Error logs por nivel y fecha
CREATE INDEX idx_error_logs_level_date 
    ON error_logs(error_level, created_at DESC);

-- Error logs por usuario (para debugging)
CREATE INDEX idx_error_logs_user 
    ON error_logs(user_id, created_at DESC) 
    WHERE user_id IS NOT NULL;

-- ======================================================================================
-- 10. ÍNDICES DE ALERTAS DE RESTOCK
-- ======================================================================================

-- Alertas no notificadas por producto
CREATE INDEX idx_restock_alerts_product_pending 
    ON restock_alerts(product_id) 
    WHERE notified = FALSE;

-- Alertas por usuario
CREATE INDEX idx_restock_alerts_user 
    ON restock_alerts(user_id);

-- ======================================================================================
-- FIN DE 04_indexes.sql
-- Siguiente: 05_materialized_views.sql
-- ======================================================================================
