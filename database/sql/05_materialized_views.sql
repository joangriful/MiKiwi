-- ======================================================================================
-- ARCHIVO: 05_materialized_views.sql
-- DESCRIPCIÓN: Vistas materializadas para performance
-- ORDEN DE EJECUCIÓN: 5 de 9
-- ======================================================================================

-- ======================================================================================
-- 1. VISTA: Dashboard Administrativo
-- Uso: Panel de control principal del admin
-- Refresh: Cada 5 minutos vía cron
-- ======================================================================================

CREATE MATERIALIZED VIEW mv_admin_dashboard_stats AS
SELECT
    -- Usuarios
    COUNT(DISTINCT u.id) FILTER (WHERE u.is_active = TRUE AND u.deleted_at IS NULL) AS total_active_users,
    COUNT(DISTINCT u.id) FILTER (WHERE u.created_at >= CURRENT_DATE - INTERVAL '7 days') AS new_users_last_7_days,
    
    -- Pedidos
    COUNT(DISTINCT o.id) FILTER (WHERE o.status = 'pending') AS pending_orders,
    COUNT(DISTINCT o.id) FILTER (WHERE o.status = 'processing') AS processing_orders,
    COUNT(DISTINCT o.id) FILTER (WHERE o.status = 'shipped') AS shipped_orders,
    COUNT(DISTINCT o.id) FILTER (WHERE DATE(o.created_at) = CURRENT_DATE) AS orders_today,
    
    -- Ingresos
    COALESCE(SUM(o.total_amount) FILTER (WHERE o.payment_status = 'paid'), 0) AS total_revenue,
    COALESCE(SUM(o.total_amount) FILTER (WHERE o.payment_status = 'paid' AND DATE(o.paid_at) = CURRENT_DATE), 0) AS revenue_today,
    COALESCE(SUM(o.total_amount) FILTER (WHERE o.payment_status = 'paid' AND o.paid_at >= CURRENT_DATE - INTERVAL '7 days'), 0) AS revenue_last_7_days,
    COALESCE(SUM(o.total_amount) FILTER (WHERE o.payment_status = 'paid' AND o.paid_at >= CURRENT_DATE - INTERVAL '30 days'), 0) AS revenue_last_30_days,
    
    -- Soporte
    COUNT(DISTINCT st.id) FILTER (WHERE st.status = 'open' AND st.deleted_at IS NULL) AS open_tickets,
    COUNT(DISTINCT st.id) FILTER (WHERE st.status = 'open' AND st.priority = 'urgent' AND st.deleted_at IS NULL) AS urgent_tickets,
    
    -- Reviews
    COUNT(DISTINCT r.id) FILTER (WHERE r.is_approved = FALSE AND r.deleted_at IS NULL) AS pending_reviews,
    
    -- Stock
    COUNT(DISTINCT p.id) FILTER (WHERE p.stock_quantity <= 5 AND p.deleted_at IS NULL) AS low_stock_products,
    COUNT(DISTINCT p.id) FILTER (WHERE p.stock_quantity = 0 AND p.deleted_at IS NULL) AS out_of_stock_products,
    
    -- Metadata
    NOW() AS last_refreshed_at
FROM users u
CROSS JOIN LATERAL (SELECT * FROM orders) o
CROSS JOIN LATERAL (SELECT * FROM support_tickets) st
CROSS JOIN LATERAL (SELECT * FROM reviews) r
CROSS JOIN LATERAL (SELECT * FROM products) p
LIMIT 1;

-- Índice único requerido para REFRESH CONCURRENTLY
CREATE UNIQUE INDEX idx_mv_admin_dashboard_refresh 
    ON mv_admin_dashboard_stats(last_refreshed_at);

-- ======================================================================================
-- 2. VISTA: Productos Bestseller
-- Uso: Sección "Más Vendidos" en home y listados
-- Refresh: Cada hora vía cron
-- ======================================================================================

CREATE MATERIALIZED VIEW mv_bestselling_products AS
SELECT 
    p.id AS product_id,
    p.name,
    p.sku,
    p.base_price,
    p.avg_rating,
    p.review_count,
    p.images,
    c.name AS category_name,
    c.slug AS category_slug,
    COALESCE(SUM(oi.quantity), 0) AS total_units_sold,
    COALESCE(SUM(oi.quantity * oi.unit_price_at_purchase), 0) AS total_revenue,
    RANK() OVER (ORDER BY COALESCE(SUM(oi.quantity), 0) DESC) AS sales_rank
FROM products p
LEFT JOIN order_items oi ON p.id = oi.product_id
LEFT JOIN orders o ON oi.order_id = o.id AND o.payment_status = 'paid'
LEFT JOIN categories c ON p.category_id = c.id
WHERE p.deleted_at IS NULL
GROUP BY p.id, p.name, p.sku, p.base_price, p.avg_rating, p.review_count, p.images, c.name, c.slug
ORDER BY total_units_sold DESC
LIMIT 100;

CREATE UNIQUE INDEX idx_mv_bestsellers_product 
    ON mv_bestselling_products(product_id);

CREATE INDEX idx_mv_bestsellers_rank 
    ON mv_bestselling_products(sales_rank);

-- ======================================================================================
-- 3. VISTA: Reporte de Ventas Mensuales
-- Uso: Analytics y reportes financieros
-- Refresh: Diario a las 00:00 vía cron
-- ======================================================================================

CREATE MATERIALIZED VIEW mv_monthly_sales_report AS
SELECT 
    DATE_TRUNC('month', o.paid_at) AS month,
    EXTRACT(YEAR FROM o.paid_at) AS year,
    EXTRACT(MONTH FROM o.paid_at) AS month_number,
    TO_CHAR(o.paid_at, 'Month YYYY') AS month_name,
    
    -- Métricas de pedidos
    COUNT(DISTINCT o.id) AS total_orders,
    COUNT(DISTINCT o.user_id) AS unique_customers,
    
    -- Métricas financieras
    SUM(o.subtotal_amount) AS gross_revenue,
    SUM(o.discount_amount) AS total_discounts,
    SUM(o.shipping_cost) AS total_shipping,
    SUM(o.tax_amount) AS total_taxes,
    SUM(o.total_amount) AS net_revenue,
    
    -- Promedios
    AVG(o.total_amount) AS avg_order_value,
    AVG(oi_stats.items_per_order) AS avg_items_per_order,
    
    -- Comparación MoM (se calcula en aplicación)
    LAG(SUM(o.total_amount)) OVER (ORDER BY DATE_TRUNC('month', o.paid_at)) AS prev_month_revenue

FROM orders o
LEFT JOIN LATERAL (
    SELECT 
        order_id, 
        COUNT(*) AS items_per_order
    FROM order_items
    GROUP BY order_id
) oi_stats ON oi_stats.order_id = o.id
WHERE o.payment_status = 'paid'
  AND o.paid_at IS NOT NULL
GROUP BY DATE_TRUNC('month', o.paid_at), 
         EXTRACT(YEAR FROM o.paid_at), 
         EXTRACT(MONTH FROM o.paid_at),
         TO_CHAR(o.paid_at, 'Month YYYY')
ORDER BY month DESC;

CREATE UNIQUE INDEX idx_mv_monthly_sales_month 
    ON mv_monthly_sales_report(month);

-- ======================================================================================
-- 4. VISTA: Productos de Catégoría con Stats
-- Uso: Listados de productos en categoría
-- Refresh: Cada hora vía cron
-- ======================================================================================

CREATE MATERIALIZED VIEW mv_category_products AS
SELECT 
    c.id AS category_id,
    c.name AS category_name,
    c.slug AS category_slug,
    COUNT(DISTINCT p.id) AS product_count,
    AVG(p.base_price) AS avg_price,
    MIN(p.base_price) AS min_price,
    MAX(p.base_price) AS max_price,
    AVG(p.avg_rating) FILTER (WHERE p.review_count > 0) AS avg_category_rating,
    SUM(p.stock_quantity) AS total_stock
FROM categories c
LEFT JOIN products p ON c.id = p.category_id AND p.deleted_at IS NULL
WHERE c.deleted_at IS NULL AND c.is_active = TRUE
GROUP BY c.id, c.name, c.slug
ORDER BY c.display_order, c.name;

CREATE UNIQUE INDEX idx_mv_category_products_id 
    ON mv_category_products(category_id);

-- ======================================================================================
-- 5. FUNCIÓN: Refrescar todas las vistas materializadas
-- Uso: Ejecutar desde cron o manualmente
-- ======================================================================================

CREATE OR REPLACE FUNCTION refresh_all_materialized_views()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY mv_admin_dashboard_stats;
    REFRESH MATERIALIZED VIEW CONCURRENTLY mv_bestselling_products;
    REFRESH MATERIALIZED VIEW CONCURRENTLY mv_monthly_sales_report;
    REFRESH MATERIALIZED VIEW CONCURRENTLY mv_category_products;
END;
$$ LANGUAGE plpgsql;

-- ======================================================================================
-- 6. FUNCIÓN: Refrescar vista específica
-- Uso: refresh_materialized_view('mv_bestselling_products')
-- ======================================================================================

CREATE OR REPLACE FUNCTION refresh_materialized_view(view_name TEXT)
RETURNS void AS $$
BEGIN
    EXECUTE 'REFRESH MATERIALIZED VIEW CONCURRENTLY ' || quote_ident(view_name);
END;
$$ LANGUAGE plpgsql;

-- ======================================================================================
-- NOTAS DE REFRESH PARA CRON
-- 
-- Agregar al crontab del servidor o usar pg_cron:
-- 
-- # Refresh dashboard cada 5 minutos
-- */5 * * * * psql -U mikiwi_admin -d mikiwi -c "REFRESH MATERIALIZED VIEW CONCURRENTLY mv_admin_dashboard_stats;"
-- 
-- # Refresh bestsellers cada hora
-- 0 * * * * psql -U mikiwi_admin -d mikiwi -c "REFRESH MATERIALIZED VIEW CONCURRENTLY mv_bestselling_products;"
-- 
-- # Refresh ventas mensuales cada día a las 00:05
-- 5 0 * * * psql -U mikiwi_admin -d mikiwi -c "REFRESH MATERIALIZED VIEW CONCURRENTLY mv_monthly_sales_report;"
-- 
-- # Refresh categorías cada hora
-- 0 * * * * psql -U mikiwi_admin -d mikiwi -c "REFRESH MATERIALIZED VIEW CONCURRENTLY mv_category_products;"
-- ======================================================================================

-- ======================================================================================
-- FIN DE 05_materialized_views.sql
-- Siguiente: 06_security_roles.sql
-- ======================================================================================
