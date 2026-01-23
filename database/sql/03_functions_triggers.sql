-- ======================================================================================
-- ARCHIVO: 03_functions_triggers.sql
-- DESCRIPCIÓN: Funciones y Triggers para E-Commerce de Juguetes Eróticos & Muñecas
-- ======================================================================================

-- ======================================================================================
-- 1. FUNCIONES UTILITARIAS (TRIGGERS)
-- ======================================================================================

-- 1.1 Actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

-- 1.2 Generador de Números de Pedido (MK-202X-XXXXX)
CREATE SEQUENCE order_number_seq;

CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
    -- Genera MK-2024-00001
    NEW.order_number := 'MK-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(NEXTVAL('order_number_seq')::TEXT, 5, '0');
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

-- 1.3 Gestión de Stock Híbrida (Solo baja stock si NO es NULL)
-- Si stock_quantity es NULL, significa "Bajo Demanda" (Muñecas)
CREATE OR REPLACE FUNCTION reduce_stock_on_paid()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.payment_status = 'paid' AND OLD.payment_status != 'paid' THEN
        UPDATE products p
        SET stock_quantity = p.stock_quantity - oi.quantity,
            sales_count = p.sales_count + oi.quantity
        FROM order_items oi
        WHERE oi.order_id = NEW.id 
          AND oi.product_id = p.id 
          AND p.stock_quantity IS NOT NULL; -- Solo resta si hay control de inventario
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

-- ======================================================================================
-- 6. ACTIVACIÓN DE TRIGGERS
-- ======================================================================================

-- Orden secuencial automático
CREATE TRIGGER trg_set_order_number 
BEFORE INSERT ON orders 
FOR EACH ROW EXECUTE PROCEDURE generate_order_number();

-- Reducir stock al pagar (Solo productos con stock físico)
CREATE TRIGGER trg_reduce_stock_on_paid 
AFTER UPDATE ON orders 
FOR EACH ROW EXECUTE PROCEDURE reduce_stock_on_paid();

-- Timestamps automáticos
CREATE TRIGGER trg_users_upd BEFORE UPDATE ON users FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER trg_products_upd BEFORE UPDATE ON products FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER trg_orders_upd BEFORE UPDATE ON orders FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
