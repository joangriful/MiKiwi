-- ======================================================================================
-- ARCHIVO: 03_functions_triggers.sql
-- DESCRIPCIÓN: Funciones y Triggers (Defensa en Profundidad)
-- ORDEN DE EJECUCIÓN: 3 de 9
-- NOTA: Laravel es la capa principal, estos triggers son fallback de seguridad
-- ======================================================================================

-- ======================================================================================
-- 1. SECUENCIAS
-- ======================================================================================

CREATE SEQUENCE IF NOT EXISTS order_number_seq START 1;
CREATE SEQUENCE IF NOT EXISTS ticket_number_seq START 1;

-- ======================================================================================
-- 2. FUNCIÓN: Actualizar updated_at automáticamente
-- ======================================================================================

CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ======================================================================================
-- 3. FUNCIÓN: Generar número de pedido secuencial (MK-YYYY-XXXXX)
-- ======================================================================================

CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
DECLARE
    v_year TEXT;
    v_seq INTEGER;
BEGIN
    -- Solo generar si no viene ya con order_number (Laravel lo genera)
    IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
        v_year := TO_CHAR(NOW(), 'YYYY');
        v_seq := NEXTVAL('order_number_seq');
        NEW.order_number := 'MK-' || v_year || '-' || LPAD(v_seq::TEXT, 5, '0');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ======================================================================================
-- 4. FUNCIÓN: Generar número de ticket secuencial (TK-XXXXX)
-- ======================================================================================

CREATE OR REPLACE FUNCTION generate_ticket_number()
RETURNS TRIGGER AS $$
DECLARE
    v_seq INTEGER;
BEGIN
    IF NEW.ticket_number IS NULL OR NEW.ticket_number = '' THEN
        v_seq := NEXTVAL('ticket_number_seq');
        NEW.ticket_number := 'TK-' || LPAD(v_seq::TEXT, 5, '0');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ======================================================================================
-- 5. FUNCIÓN: Calcular rating promedio del producto
-- ======================================================================================

CREATE OR REPLACE FUNCTION update_product_rating()
RETURNS TRIGGER AS $$
DECLARE
    v_product_id UUID;
    v_avg DECIMAL(3,2);
    v_count INTEGER;
BEGIN
    -- Determinar el product_id afectado
    IF TG_OP = 'DELETE' THEN
        v_product_id := OLD.product_id;
    ELSE
        v_product_id := NEW.product_id;
    END IF;
    
    -- Calcular nuevos valores
    SELECT 
        COALESCE(AVG(rating), 0.00),
        COUNT(*)
    INTO v_avg, v_count
    FROM reviews
    WHERE product_id = v_product_id 
      AND is_approved = TRUE 
      AND deleted_at IS NULL;
    
    -- Actualizar producto
    UPDATE products
    SET 
        avg_rating = ROUND(v_avg, 2),
        review_count = v_count
    WHERE id = v_product_id;
    
    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    ELSE
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- ======================================================================================
-- 6. FUNCIÓN: Decrementar stock al pagar pedido
-- ======================================================================================

CREATE OR REPLACE FUNCTION reduce_stock_on_paid()
RETURNS TRIGGER AS $$
BEGIN
    -- Solo ejecutar si el estado de pago cambia a 'paid'
    IF NEW.payment_status = 'paid' AND (OLD.payment_status IS NULL OR OLD.payment_status != 'paid') THEN
        -- Decrementar stock de productos
        UPDATE products p
        SET 
            stock_quantity = p.stock_quantity - oi.quantity,
            sales_count = COALESCE(p.sales_count, 0) + oi.quantity
        FROM order_items oi
        WHERE oi.order_id = NEW.id 
          AND oi.product_id = p.id
          AND oi.variant_id IS NULL;
        
        -- Decrementar stock de variantes
        UPDATE product_variants pv
        SET stock_quantity = pv.stock_quantity - oi.quantity
        FROM order_items oi
        WHERE oi.order_id = NEW.id 
          AND oi.variant_id = pv.id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ======================================================================================
-- 7. FUNCIÓN: Restaurar stock al cancelar pedido
-- ======================================================================================

CREATE OR REPLACE FUNCTION restore_stock_on_cancel()
RETURNS TRIGGER AS $$
BEGIN
    -- Solo ejecutar si el pedido fue pagado y ahora se cancela
    IF NEW.status = 'cancelled' AND OLD.status != 'cancelled' AND OLD.payment_status = 'paid' THEN
        -- Restaurar stock de productos
        UPDATE products p
        SET 
            stock_quantity = p.stock_quantity + oi.quantity,
            sales_count = GREATEST(COALESCE(p.sales_count, 0) - oi.quantity, 0)
        FROM order_items oi
        WHERE oi.order_id = NEW.id 
          AND oi.product_id = p.id
          AND oi.variant_id IS NULL;
        
        -- Restaurar stock de variantes
        UPDATE product_variants pv
        SET stock_quantity = pv.stock_quantity + oi.quantity
        FROM order_items oi
        WHERE oi.order_id = NEW.id 
          AND oi.variant_id = pv.id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ======================================================================================
-- 8. FUNCIÓN: Incrementar uso de cupón
-- ======================================================================================

CREATE OR REPLACE FUNCTION increment_coupon_usage()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.payment_status = 'paid' AND (OLD.payment_status IS NULL OR OLD.payment_status != 'paid') THEN
        IF NEW.coupon_id IS NOT NULL THEN
            UPDATE coupons
            SET current_uses = current_uses + 1
            WHERE id = NEW.coupon_id;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ======================================================================================
-- 9. FUNCIÓN: Validar stock antes de insertar order_item
-- ======================================================================================

CREATE OR REPLACE FUNCTION validate_stock_on_order()
RETURNS TRIGGER AS $$
DECLARE
    v_available INTEGER;
BEGIN
    IF NEW.variant_id IS NOT NULL THEN
        SELECT stock_quantity INTO v_available
        FROM product_variants
        WHERE id = NEW.variant_id;
    ELSE
        SELECT stock_quantity INTO v_available
        FROM products
        WHERE id = NEW.product_id;
    END IF;
    
    IF v_available < NEW.quantity THEN
        RAISE EXCEPTION 'Stock insuficiente. Disponible: %, Solicitado: %', 
            v_available, NEW.quantity;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ======================================================================================
-- 10. TRIGGERS DE updated_at (Todas las tablas principales)
-- ======================================================================================

CREATE TRIGGER trg_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER trg_user_preferences_updated_at
    BEFORE UPDATE ON user_preferences
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER trg_user_addresses_updated_at
    BEFORE UPDATE ON user_addresses
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER trg_user_payment_methods_updated_at
    BEFORE UPDATE ON user_payment_methods
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER trg_categories_updated_at
    BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER trg_suppliers_updated_at
    BEFORE UPDATE ON suppliers
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER trg_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER trg_product_variants_updated_at
    BEFORE UPDATE ON product_variants
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER trg_coupons_updated_at
    BEFORE UPDATE ON coupons
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER trg_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER trg_order_items_updated_at
    BEFORE UPDATE ON order_items
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER trg_carts_updated_at
    BEFORE UPDATE ON carts
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER trg_cart_items_updated_at
    BEFORE UPDATE ON cart_items
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER trg_wishlists_updated_at
    BEFORE UPDATE ON wishlists
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER trg_reviews_updated_at
    BEFORE UPDATE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER trg_support_tickets_updated_at
    BEFORE UPDATE ON support_tickets
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER trg_ticket_messages_updated_at
    BEFORE UPDATE ON ticket_messages
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER trg_notifications_updated_at
    BEFORE UPDATE ON notifications
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER trg_restock_alerts_updated_at
    BEFORE UPDATE ON restock_alerts
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- ======================================================================================
-- 11. TRIGGERS DE NEGOCIO
-- ======================================================================================

-- Generar número de pedido automáticamente
CREATE TRIGGER trg_orders_generate_number
    BEFORE INSERT ON orders
    FOR EACH ROW EXECUTE FUNCTION generate_order_number();

-- Generar número de ticket automáticamente
CREATE TRIGGER trg_tickets_generate_number
    BEFORE INSERT ON support_tickets
    FOR EACH ROW EXECUTE FUNCTION generate_ticket_number();

-- Actualizar rating del producto tras review
CREATE TRIGGER trg_reviews_update_rating
    AFTER INSERT OR UPDATE OR DELETE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_product_rating();

-- Decrementar stock al pagar
CREATE TRIGGER trg_orders_reduce_stock
    AFTER UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION reduce_stock_on_paid();

-- Restaurar stock al cancelar
CREATE TRIGGER trg_orders_restore_stock
    AFTER UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION restore_stock_on_cancel();

-- Incrementar uso de cupón
CREATE TRIGGER trg_orders_increment_coupon
    AFTER UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION increment_coupon_usage();

-- Validar stock antes de insertar order_item
CREATE TRIGGER trg_order_items_validate_stock
    BEFORE INSERT ON order_items
    FOR EACH ROW EXECUTE FUNCTION validate_stock_on_order();

-- ======================================================================================
-- FIN DE 03_functions_triggers.sql
-- Siguiente: 04_indexes.sql
-- ======================================================================================
