-- ======================================================================================
-- ARCHIVO: 01_schema.sql
-- DESCRIPCIÓN: Schema optimizado para E-Commerce de Juguetes Eróticos & Muñecas (Laravel)
-- ======================================================================================

-- 0. CONFIGURACIÓN INICIAL
-- ======================================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Configuración de seguridad básica
ALTER DATABASE postgres SET statement_timeout = '30s'; 

-- ======================================================================================
-- 2. USUARIOS Y SEGURIDAD (+18)
-- ======================================================================================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    
    -- DATOS LEGALES (Requeridos para +18)
    dni VARCHAR(20) NOT NULL UNIQUE, 
    birth_date DATE NOT NULL,
    
    -- Constraint de Seguridad: La BBDD rechaza insertar si es menor de 18
    CONSTRAINT check_is_adult CHECK (birth_date <= (CURRENT_DATE - INTERVAL '18 years')),

    role VARCHAR(50) DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'support')),
    is_active BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE TABLE user_addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    alias VARCHAR(50), -- Ej: "Casa", "Oficina"
    full_name VARCHAR(150) NOT NULL,
    phone VARCHAR(50),
    street_address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    country VARCHAR(100) NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ======================================================================================
-- 3. CATÁLOGO (ACTUALIZADO: Lógica de Productos y Accesorios)
-- ======================================================================================

CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parent_id UUID REFERENCES categories(id),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(120) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES categories(id),
    
    name VARCHAR(255) NOT NULL,
    sku VARCHAR(100) UNIQUE, -- La referencia del proveedor
    description TEXT,
    
    base_price DECIMAL(10, 2) NOT NULL CHECK (base_price >= 0),
    stock_quantity INTEGER DEFAULT NULL, -- NULL = Bajo demanda (Muñecas/Extras)
    
    -- TIPOLOGÍA DEL PRODUCTO
    -- 'simple': Un juguete normal (vibrador en caja).
    -- 'configurable': La muñeca base.
    -- 'component': Un extra (ojos, calefacción) que no se vende suelto, va en una muñeca.
    product_type VARCHAR(20) DEFAULT 'simple' CHECK (product_type IN ('simple', 'configurable', 'component')),
    
    is_adult_only BOOLEAN DEFAULT TRUE,
    images JSONB DEFAULT '[]',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- ESTA TABLA SUSTITUYE A 'product_modifiers'
-- Define qué extras (componentes) se le pueden poner a qué muñeca.
CREATE TABLE product_accessories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parent_product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE, -- La Muñeca
    accessory_product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE, -- El Extra (Ojos, etc)
    
    is_mandatory BOOLEAN DEFAULT FALSE, -- Ej: ¿Es obligatorio elegir un color de ojos?
    group_name VARCHAR(50), -- Ej: "Ojos", "Piel", "Extras Tecnológicos"
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(parent_product_id, accessory_product_id)
);

-- ======================================================================================
-- 4. PEDIDOS (ACTUALIZADO: Agrupación de Items)
-- ======================================================================================

CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    order_number VARCHAR(50) NOT NULL UNIQUE,
    status VARCHAR(50) DEFAULT 'pending',
    payment_status VARCHAR(50) DEFAULT 'pending',
    total_amount DECIMAL(10, 2) NOT NULL,
    
    shipping_address_snapshot JSONB NOT NULL,
    billing_address_snapshot JSONB,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    
    -- CAMPO CLAVE NUEVO: parent_item_id
    -- Si compro una Muñeca (ID 1) y Calefacción (ID 2):
    -- Fila 1: Muñeca, parent_item_id = NULL
    -- Fila 2: Calefacción, parent_item_id = ID de Fila 1.
    -- Así el proveedor sabe que la calefacción va DENTRO de esa muñeca específica.
    parent_item_id UUID REFERENCES order_items(id) ON DELETE CASCADE, 
    
    product_name_snapshot VARCHAR(255) NOT NULL,
    sku_snapshot VARCHAR(100), -- Guardamos el SKU para remitir al proveedor
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price DECIMAL(10, 2) NOT NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ======================================================================================
-- 5. SOPORTE Y CHATBOT
-- ======================================================================================

CREATE TABLE chat_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id), -- Puede ser NULL si inicia chat antes de loguearse (opcional)
    status VARCHAR(20) DEFAULT 'active', -- active, closed, bot
    subject VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
    sender_type VARCHAR(20) NOT NULL, -- 'user', 'bot', 'admin'
    message_body TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    product_id UUID NOT NULL REFERENCES products(id),
    rating INTEGER CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    is_approved BOOLEAN DEFAULT FALSE, -- Requiere moderación
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
