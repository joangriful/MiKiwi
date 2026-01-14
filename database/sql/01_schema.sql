-- ======================================================================================
-- ARCHIVO: 01_schema.sql
-- DESCRIPCIÓN: Estructura de tablas para E-Commerce MiKiwi (PostgreSQL 16+)
-- ORDEN DE EJECUCIÓN: 1 de 9
-- ======================================================================================

-- 0. EXTENSIONES REQUERIDAS
-- ======================================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

-- ======================================================================================
-- 1. MÓDULO: USUARIOS
-- ======================================================================================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'customer',
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
    user_id UUID NOT NULL,
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
    user_id UUID NOT NULL,
    address_type VARCHAR(20),
    full_name VARCHAR(150),
    phone VARCHAR(50),
    -- Campos sensibles: almacenados encriptados (ver 08_encryption.sql)
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
    user_id UUID NOT NULL,
    method_type VARCHAR(50) NOT NULL,
    gateway_provider VARCHAR(50) NOT NULL,
    -- Campo sensible: almacenado encriptado (ver 08_encryption.sql)
    gateway_token_id VARCHAR(255) NOT NULL,
    last_4_digits VARCHAR(4),
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- ======================================================================================
-- 2. MÓDULO: CATÁLOGO
-- ======================================================================================

CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parent_id UUID,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(120) NOT NULL,
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
    tax_id VARCHAR(50) NOT NULL,
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
    category_id UUID,
    supplier_id UUID,
    name VARCHAR(255) NOT NULL,
    sku VARCHAR(100) NOT NULL,
    description TEXT,
    meta_description TEXT,
    base_price DECIMAL(10, 2) NOT NULL,
    stock_quantity INTEGER DEFAULT 0,
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
    product_id UUID NOT NULL,
    sku VARCHAR(100) NOT NULL,
    variant_name VARCHAR(150),
    attributes JSONB DEFAULT '{}',
    stock_quantity INTEGER DEFAULT 0,
    price_modifier DECIMAL(10, 2) DEFAULT 0.00,
    image_url VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- ======================================================================================
-- 3. MÓDULO: CUPONES Y PROMOCIONES
-- ======================================================================================

CREATE TABLE coupons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) NOT NULL,
    discount_type VARCHAR(20) NOT NULL,
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

-- ======================================================================================
-- 4. MÓDULO: PEDIDOS
-- ======================================================================================

CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    coupon_id UUID,
    payment_method_id UUID,
    shipping_address_id UUID,
    billing_address_id UUID,
    order_number VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    payment_status VARCHAR(50) DEFAULT 'pending',
    subtotal_amount DECIMAL(10, 2) NOT NULL,
    discount_amount DECIMAL(10, 2) DEFAULT 0.00,
    shipping_cost DECIMAL(10, 2) DEFAULT 0.00,
    tax_amount DECIMAL(10, 2) DEFAULT 0.00,
    total_amount DECIMAL(10, 2) NOT NULL,
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
    order_id UUID NOT NULL,
    product_id UUID,
    variant_id UUID,
    product_name_snapshot VARCHAR(255) NOT NULL,
    unit_price_at_purchase DECIMAL(10, 2) NOT NULL,
    variant_snapshot JSONB,
    quantity INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ======================================================================================
-- 5. MÓDULO: CARRITO Y WISHLIST
-- ======================================================================================

CREATE TABLE carts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cart_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cart_id UUID NOT NULL,
    product_id UUID NOT NULL,
    variant_id UUID,
    quantity INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE wishlists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    product_id UUID NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ======================================================================================
-- 6. MÓDULO: REVIEWS
-- ======================================================================================

CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    product_id UUID,
    order_id UUID,
    rating INTEGER,
    comment TEXT,
    is_verified_purchase BOOLEAN DEFAULT FALSE,
    is_approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- ======================================================================================
-- 7. MÓDULO: SOPORTE
-- ======================================================================================

CREATE TABLE support_tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    order_id UUID,
    ticket_number VARCHAR(50) NOT NULL,
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
    ticket_id UUID NOT NULL,
    sender_id UUID,
    message_body TEXT NOT NULL,
    attachments JSONB DEFAULT '[]',
    is_internal_note BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ======================================================================================
-- 8. MÓDULO: NOTIFICACIONES Y ALERTAS
-- ======================================================================================

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT,
    data JSONB,
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE restock_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    product_id UUID NOT NULL,
    variant_id UUID,
    notified BOOLEAN DEFAULT FALSE,
    notified_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ======================================================================================
-- 9. MÓDULO: LOGS DE ERRORES (Nueva tabla para HU-03)
-- ======================================================================================

CREATE TABLE error_logs (
    id UUID DEFAULT uuid_generate_v4(),
    error_level VARCHAR(20) NOT NULL,
    error_message TEXT NOT NULL,
    error_context JSONB,
    stack_trace TEXT,
    user_id UUID,
    request_path VARCHAR(500),
    request_method VARCHAR(10),
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id, created_at)
) PARTITION BY RANGE (created_at);

-- Particiones iniciales para error_logs
CREATE TABLE error_logs_y2025m01 PARTITION OF error_logs
    FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');
CREATE TABLE error_logs_y2025m02 PARTITION OF error_logs
    FOR VALUES FROM ('2025-02-01') TO ('2025-03-01');
CREATE TABLE error_logs_y2025m03 PARTITION OF error_logs
    FOR VALUES FROM ('2025-03-01') TO ('2025-04-01');
CREATE TABLE error_logs_y2025m04 PARTITION OF error_logs
    FOR VALUES FROM ('2025-04-01') TO ('2025-05-01');
CREATE TABLE error_logs_y2025m05 PARTITION OF error_logs
    FOR VALUES FROM ('2025-05-01') TO ('2025-06-01');
CREATE TABLE error_logs_y2025m06 PARTITION OF error_logs
    FOR VALUES FROM ('2025-06-01') TO ('2025-07-01');
CREATE TABLE error_logs_y2025m07 PARTITION OF error_logs
    FOR VALUES FROM ('2025-07-01') TO ('2025-08-01');
CREATE TABLE error_logs_y2025m08 PARTITION OF error_logs
    FOR VALUES FROM ('2025-08-01') TO ('2025-09-01');
CREATE TABLE error_logs_y2025m09 PARTITION OF error_logs
    FOR VALUES FROM ('2025-09-01') TO ('2025-10-01');
CREATE TABLE error_logs_y2025m10 PARTITION OF error_logs
    FOR VALUES FROM ('2025-10-01') TO ('2025-11-01');
CREATE TABLE error_logs_y2025m11 PARTITION OF error_logs
    FOR VALUES FROM ('2025-11-01') TO ('2025-12-01');
CREATE TABLE error_logs_y2025m12 PARTITION OF error_logs
    FOR VALUES FROM ('2025-12-01') TO ('2026-01-01');
CREATE TABLE error_logs_y2026m01 PARTITION OF error_logs
    FOR VALUES FROM ('2026-01-01') TO ('2026-02-01');
CREATE TABLE error_logs_default PARTITION OF error_logs DEFAULT;

-- ======================================================================================
-- FIN DE 01_schema.sql
-- Siguiente: 02_constraints.sql
-- ======================================================================================
