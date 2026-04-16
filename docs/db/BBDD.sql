-- ======================================================================================
-- ARCHIVO: BBDD.sql
-- DESCRIPCIÓN: Schema base compatible con Supabase/PostgreSQL para MiKiwi
-- USO: Ejecutar en Supabase SQL Editor sobre una base vacía o parcialmente creada
-- NOTA: Se han eliminado sentencias no compatibles con Postgres gestionado
-- ======================================================================================

SET search_path TO public;

-- ======================================================================================
-- 0. EXTENSIONES Y OBJETOS BASE
-- ======================================================================================

-- Supabase soporta pgcrypto; usamos gen_random_uuid() para evitar dependencias extra.
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE SEQUENCE IF NOT EXISTS order_number_seq START 1;

-- ======================================================================================
-- 1. FUNCIONES UTILITARIAS
-- ======================================================================================

CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
        NEW.order_number := 'MK-' || TO_CHAR(NOW(), 'YYYY') || '-' ||
            LPAD(NEXTVAL('order_number_seq')::TEXT, 5, '0');
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Solo descuenta stock físico; los productos bajo demanda usan stock_quantity = NULL.
CREATE OR REPLACE FUNCTION reduce_stock_on_paid()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.payment_status = 'paid'
       AND COALESCE(OLD.payment_status, '') <> 'paid' THEN
        UPDATE products p
        SET stock_quantity = p.stock_quantity - oi.quantity,
            sales_count = p.sales_count + oi.quantity
        FROM order_items oi
        WHERE oi.order_id = NEW.id
          AND oi.product_id = p.id
          AND p.stock_quantity IS NOT NULL;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ======================================================================================
-- 2. TABLAS
-- ======================================================================================

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    dni VARCHAR(20) UNIQUE,
    birth_date DATE,
    role VARCHAR(50) NOT NULL DEFAULT 'customer'
        CHECK (role IN ('customer', 'admin', 'support')),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS user_addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    alias VARCHAR(50),
    full_name VARCHAR(150) NOT NULL,
    phone VARCHAR(50),
    street_address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    country VARCHAR(100) NOT NULL,
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(120) NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    sku VARCHAR(100) UNIQUE,
    description TEXT,
    base_price DECIMAL(10, 2) NOT NULL CHECK (base_price >= 0),
    stock_quantity INTEGER DEFAULT NULL,
    product_type VARCHAR(20) NOT NULL DEFAULT 'simple'
        CHECK (product_type IN ('simple', 'configurable', 'component')),
    is_adult_only BOOLEAN NOT NULL DEFAULT TRUE,
    images JSONB NOT NULL DEFAULT '[]'::JSONB,
    sales_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS product_accessories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    accessory_product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    is_mandatory BOOLEAN NOT NULL DEFAULT FALSE,
    group_name VARCHAR(50),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT product_accessories_unique UNIQUE (parent_product_id, accessory_product_id)
);

CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    order_number VARCHAR(50) NOT NULL UNIQUE,
    status VARCHAR(50) NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
    payment_status VARCHAR(50) NOT NULL DEFAULT 'pending'
        CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
    total_amount DECIMAL(10, 2) NOT NULL CHECK (total_amount >= 0),
    shipping_address_snapshot JSONB NOT NULL,
    billing_address_snapshot JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    parent_item_id UUID REFERENCES order_items(id) ON DELETE CASCADE,
    product_name_snapshot VARCHAR(255) NOT NULL,
    sku_snapshot VARCHAR(100),
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    unit_price DECIMAL(10, 2) NOT NULL CHECK (unit_price > 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS chat_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'active'
        CHECK (status IN ('active', 'closed', 'bot')),
    subject VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
    sender_type VARCHAR(20) NOT NULL
        CHECK (sender_type IN ('user', 'bot', 'admin')),
    message_body TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    is_approved BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ======================================================================================
-- 3. ÍNDICES BÁSICOS
-- ======================================================================================

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id);

-- ======================================================================================
-- 4. TRIGGERS
-- ======================================================================================

DROP TRIGGER IF EXISTS trg_set_order_number ON orders;
CREATE TRIGGER trg_set_order_number
BEFORE INSERT ON orders
FOR EACH ROW EXECUTE FUNCTION generate_order_number();

DROP TRIGGER IF EXISTS trg_reduce_stock_on_paid ON orders;
CREATE TRIGGER trg_reduce_stock_on_paid
AFTER UPDATE ON orders
FOR EACH ROW EXECUTE FUNCTION reduce_stock_on_paid();

DROP TRIGGER IF EXISTS trg_users_upd ON users;
CREATE TRIGGER trg_users_upd
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

DROP TRIGGER IF EXISTS trg_user_addresses_upd ON user_addresses;
CREATE TRIGGER trg_user_addresses_upd
BEFORE UPDATE ON user_addresses
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

DROP TRIGGER IF EXISTS trg_categories_upd ON categories;
CREATE TRIGGER trg_categories_upd
BEFORE UPDATE ON categories
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

DROP TRIGGER IF EXISTS trg_products_upd ON products;
CREATE TRIGGER trg_products_upd
BEFORE UPDATE ON products
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

DROP TRIGGER IF EXISTS trg_orders_upd ON orders;
CREATE TRIGGER trg_orders_upd
BEFORE UPDATE ON orders
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

DROP TRIGGER IF EXISTS trg_chat_sessions_upd ON chat_sessions;
CREATE TRIGGER trg_chat_sessions_upd
BEFORE UPDATE ON chat_sessions
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- ======================================================================================
-- FIN
-- ======================================================================================
