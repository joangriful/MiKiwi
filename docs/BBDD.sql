-- ======================================================================================
-- ARCHIVO: BBDD.sql
-- DESCRIPCIÓN: Schema completo para E-Commerce Enterprise (PostgreSQL 16+)
-- HUs CUBIERTAS: Constraints, Performance, Seguridad, Automatización.
-- ======================================================================================

-- 0. CONFIGURACIÓN INICIAL Y EXTENSIONES
-- ======================================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements"; -- HU: Monitoring
CREATE EXTENSION IF NOT EXISTS "pgcrypto"; -- Para encriptación si fuera necesaria

-- Configuración de seguridad de sesión (HU: Seguridad)
ALTER DATABASE postgres SET statement_timeout = '30s'; 
ALTER DATABASE postgres SET idle_in_transaction_session_timeout = '60s';

-- ======================================================================================
-- 1. FUNCIONES UTILITARIAS Y DE AUTOMATIZACIÓN (HU: Triggers)
-- ======================================================================================

-- 1.1 Actualizar updated_at
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

-- 1.2 Generador de Números de Pedido Secuenciales (MK-YYYY-XXXXX)
CREATE SEQUENCE order_number_seq;

CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
    -- Formato: MK-2024-00001 (Reinicia la secuencia manualmente cada año o usa lógica extra)
    NEW.order_number := 'MK-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(NEXTVAL('order_number_seq')::TEXT, 5, '0');
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

-- 1.3 Calcular Rating Promedio (Trigger tras Review)
CREATE OR REPLACE FUNCTION update_product_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE products
    SET 
        avg_rating = (SELECT AVG(rating) FROM reviews WHERE product_id = NEW.product_id AND is_approved = TRUE),
        review_count = (SELECT COUNT(*) FROM reviews WHERE product_id = NEW.product_id AND is_approved = TRUE)
    WHERE id = NEW.product_id;
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

-- 1.4 Decrementar Stock al Pagar
CREATE OR REPLACE FUNCTION reduce_stock_on_paid()
RETURNS TRIGGER AS $$
BEGIN
    -- Solo si el estado cambia a 'paid' y antes no lo estaba
    IF NEW.payment_status = 'paid' AND OLD.payment_status != 'paid' THEN
        UPDATE products p
        SET stock_quantity = p.stock_quantity - oi.quantity,
            sales_count = p.sales_count + oi.quantity
        FROM order_items oi
        WHERE oi.order_id = NEW.id AND oi.product_id = p.id;
        
        -- Manejo de Variantes
        UPDATE product_variants pv
        SET stock_quantity = pv.stock_quantity - oi.quantity
        FROM order_items oi
        WHERE oi.order_id = NEW.id AND oi.variant_id = pv.id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

-- ======================================================================================
-- 2. TABLAS DEL NÚCLEO (Usuarios)
-- ======================================================================================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'support')),
    birth_date DATE,
    age_verified BOOLEAN DEFAULT FALSE,
    age_verified_at TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE TABLE user_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    discreet_packaging BOOLEAN DEFAULT FALSE,
    discreet_billing_name BOOLEAN DEFAULT FALSE,
    preferred_delivery_time VARCHAR(50),
    email_notifications BOOLEAN DEFAULT TRUE,
    sms_notifications BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    address_type VARCHAR(20) CHECK (address_type IN ('shipping', 'billing')),
    full_name VARCHAR(150),
    phone VARCHAR(50),
    street_address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100),
    postal_code VARCHAR(20) NOT NULL,
    country VARCHAR(100) NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE TABLE user_payment_methods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    method_type VARCHAR(50) NOT NULL,
    gateway_provider VARCHAR(50) NOT NULL, 
    gateway_token_id VARCHAR(255) NOT NULL,
    last_4_digits VARCHAR(4),
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- ======================================================================================
-- 3. CATÁLOGO (Constraints de Negocio)
-- ======================================================================================

CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parent_id UUID REFERENCES categories(id),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(120) NOT NULL UNIQUE,
    description TEXT,
    meta_description VARCHAR(255),
    icon_url VARCHAR(255),
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE TABLE suppliers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_name VARCHAR(200) NOT NULL,
    tax_id VARCHAR(50) NOT NULL UNIQUE,
    contact_email VARCHAR(255),
    phone VARCHAR(50),
    address JSONB,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES categories(id),
    supplier_id UUID REFERENCES suppliers(id),
    name VARCHAR(255) NOT NULL,
    sku VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    meta_description TEXT,
    
    -- HU: Constraints de Negocio
    base_price DECIMAL(10, 2) NOT NULL CHECK (base_price >= 0),
    stock_quantity INTEGER DEFAULT 0 CHECK (stock_quantity >= 0),
    
    avg_rating DECIMAL(3, 2) DEFAULT 0.00,
    review_count INTEGER DEFAULT 0,
    
    images JSONB DEFAULT '[]',
    attributes JSONB DEFAULT '{}',
    is_featured BOOLEAN DEFAULT FALSE,
    is_adult_only BOOLEAN DEFAULT FALSE,
    requires_age_verification BOOLEAN DEFAULT FALSE,
    view_count INTEGER DEFAULT 0,
    sales_count INTEGER DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE TABLE product_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    sku VARCHAR(100) NOT NULL UNIQUE,
    variant_name VARCHAR(150),
    attributes JSONB DEFAULT '{}',
    stock_quantity INTEGER DEFAULT 0 CHECK (stock_quantity >= 0),
    price_modifier DECIMAL(10, 2) DEFAULT 0.00,
    image_url VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- ======================================================================================
-- 4. PEDIDOS (Integridad y Secuencias)
-- ======================================================================================

CREATE TABLE coupons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) NOT NULL UNIQUE,
    discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
    discount_value DECIMAL(10, 2) NOT NULL,
    min_purchase_amount DECIMAL(10, 2) DEFAULT 0,
    max_uses INTEGER,
    current_uses INTEGER DEFAULT 0,
    valid_from TIMESTAMP,
    valid_until TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE RESTRICT, -- HU: No borrar usuario con pedidos
    coupon_id UUID REFERENCES coupons(id),
    payment_method_id UUID REFERENCES user_payment_methods(id),
    shipping_address_id UUID REFERENCES user_addresses(id),
    billing_address_id UUID REFERENCES user_addresses(id),
    
    order_number VARCHAR(50) NOT NULL UNIQUE, -- Se llena vía Trigger
    status VARCHAR(50) DEFAULT 'pending',
    payment_status VARCHAR(50) DEFAULT 'pending',
    
    subtotal_amount DECIMAL(10, 2) NOT NULL CHECK (subtotal_amount >= 0),
    discount_amount DECIMAL(10, 2) DEFAULT 0.00,
    shipping_cost DECIMAL(10, 2) DEFAULT 0.00,
    tax_amount DECIMAL(10, 2) DEFAULT 0.00,
    total_amount DECIMAL(10, 2) NOT NULL CHECK (total_amount >= 0),
    
    tracking_number VARCHAR(100),
    shipping_carrier VARCHAR(100),
    discreet_packaging BOOLEAN DEFAULT FALSE,
    
    shipping_address_snapshot JSONB NOT NULL,
    billing_address_snapshot JSONB,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    paid_at TIMESTAMP,
    shipped_at TIMESTAMP,
    delivered_at TIMESTAMP,
    cancelled_at TIMESTAMP
);

CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL, -- Si se borra producto, queda histórico
    variant_id UUID REFERENCES product_variants(id),
    
    product_name_snapshot VARCHAR(255) NOT NULL,
    unit_price_at_purchase DECIMAL(10, 2) NOT NULL,
    variant_snapshot JSONB,
    quantity INTEGER NOT NULL CHECK (quantity > 0),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE carts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cart_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cart_id UUID NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id),
    variant_id UUID REFERENCES product_variants(id),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(cart_id, product_id, variant_id)
);

CREATE TABLE wishlists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, product_id)
);

-- ======================================================================================
-- 5. REVIEWS Y SOPORTE
-- ======================================================================================

CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    product_id UUID REFERENCES products(id),
    order_id UUID REFERENCES orders(id),
    rating INTEGER CHECK (rating BETWEEN 1 AND 5), -- HU: Validación
    comment TEXT,
    is_verified_purchase BOOLEAN DEFAULT FALSE,
    is_approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE TABLE support_tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    order_id UUID REFERENCES orders(id),
    ticket_number VARCHAR(50) NOT NULL UNIQUE,
    priority VARCHAR(20) DEFAULT 'medium',
    status VARCHAR(20) DEFAULT 'open',
    subject VARCHAR(255) NOT NULL,
    category VARCHAR(50) DEFAULT 'other',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP,
    closed_at TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE TABLE ticket_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id UUID NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES users(id),
    message_body TEXT NOT NULL,
    attachments JSONB DEFAULT '[]',
    is_internal_note BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT,
    data JSONB,
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE promotions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    banner_image_url VARCHAR(255),
    link_url VARCHAR(255),
    display_order INTEGER DEFAULT 0,
    valid_from TIMESTAMP,
    valid_until TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE restock_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    variant_id UUID REFERENCES product_variants(id),
    notified BOOLEAN DEFAULT FALSE,
    notified_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ======================================================================================
-- 6. AUDITORÍA Y PARTICIONAMIENTO (HU: Performance & Scalability)
-- ======================================================================================

-- Definición de tabla Particionada (Range Partitioning por fecha)
CREATE TABLE audit_logs (
    id UUID DEFAULT uuid_generate_v4(),
    user_id UUID,
    table_name VARCHAR(50) NOT NULL,
    action VARCHAR(20) NOT NULL,
    record_id UUID NOT NULL,
    old_values JSONB,
    new_values JSONB,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id, created_at) -- Requisito técnico: Key de partición debe ser parte de PK
) PARTITION BY RANGE (created_at);

-- Particiones (Ejemplo 2024-2025)
CREATE TABLE audit_logs_y2024 PARTITION OF audit_logs
    FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');

CREATE TABLE audit_logs_y2025 PARTITION OF audit_logs
    FOR VALUES FROM ('2025-01-01') TO ('2026-01-01');

-- Default partition para evitar errores si nos salimos del rango
CREATE TABLE audit_logs_default PARTITION OF audit_logs DEFAULT;

-- ======================================================================================
-- 7. VISTAS MATERIALIZADAS (HU: Performance)
-- ======================================================================================

-- 7.1 Dashboard Administrativo
CREATE MATERIALIZED VIEW mv_admin_dashboard_stats AS
SELECT
    COUNT(DISTINCT u.id) FILTER (WHERE u.is_active = TRUE) as total_active_users,
    COUNT(DISTINCT o.id) FILTER (WHERE o.status = 'pending') as pending_orders,
    COALESCE(SUM(o.total_amount) FILTER (WHERE o.payment_status = 'paid'), 0) as total_revenue,
    COUNT(DISTINCT st.id) FILTER (WHERE st.status = 'open') as open_support_tickets,
    NOW() as last_refreshed_at
FROM users u
LEFT JOIN orders o ON true
LEFT JOIN support_tickets st ON true;

CREATE UNIQUE INDEX idx_mv_admin_dashboard ON mv_admin_dashboard_stats(last_refreshed_at);

-- 7.2 Bestsellers (Para la Home)
CREATE MATERIALIZED VIEW mv_bestselling_products AS
SELECT 
    p.id as product_id,
    p.name,
    p.base_price,
    SUM(oi.quantity) as total_units_sold
FROM products p
JOIN order_items oi ON p.id = oi.product_id
JOIN orders o ON oi.order_id = o.id
WHERE o.payment_status = 'paid'
GROUP BY p.id
ORDER BY total_units_sold DESC
LIMIT 100;

CREATE UNIQUE INDEX idx_mv_bestsellers ON mv_bestselling_products(product_id);

-- ======================================================================================
-- 8. ÍNDICES Y SEGURIDAD (HU: Security & Performance)
-- ======================================================================================

-- Índices de Rendimiento (FTS y B-Tree)
CREATE INDEX idx_products_cat_price_rating ON products (category_id, base_price, avg_rating);
CREATE INDEX idx_products_fts ON products USING GIN (to_tsvector('spanish', name || ' ' || coalesce(description, '')));
CREATE INDEX idx_orders_keyset ON orders (created_at DESC, id DESC); -- Keyset Pagination
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

-- Aplicación de Roles (Principio de Mínimo Privilegio)
-- Rol para la aplicación Backend
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'app_role') THEN
    CREATE ROLE app_role WITH LOGIN PASSWORD 'secure_password_env_var';
  END IF;
END
$$;

GRANT CONNECT ON DATABASE postgres TO app_role;
GRANT USAGE ON SCHEMA public TO app_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app_role;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO app_role;

-- ======================================================================================
-- 9. ACTIVACIÓN DE TRIGGERS
-- ======================================================================================

-- Orden secuencial
CREATE TRIGGER trg_set_order_number BEFORE INSERT ON orders FOR EACH ROW EXECUTE PROCEDURE generate_order_number();

-- Control de Stock
CREATE TRIGGER trg_reduce_stock_on_paid AFTER UPDATE ON orders FOR EACH ROW EXECUTE PROCEDURE reduce_stock_on_paid();

-- Ratings
CREATE TRIGGER trg_update_avg_rating AFTER INSERT OR UPDATE OR DELETE ON reviews FOR EACH ROW EXECUTE PROCEDURE update_product_rating();

-- Updated At (Loop para todas las tablas clave)
CREATE TRIGGER trg_users_upd BEFORE UPDATE ON users FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER trg_products_upd BEFORE UPDATE ON products FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER trg_orders_upd BEFORE UPDATE ON orders FOR EACH ROW EXECUTE PROCEDURE update_modified_column();