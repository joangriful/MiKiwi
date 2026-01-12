# Integridad y Validaciones de Base de Datos - MiKiwi

## Objetivo

Mover la lógica de validación de datos críticos desde la aplicación a la Base de Datos para garantizar la **Integridad Referencial** y la **consistencia** sin importar la fuente de la operación (aplicación web, API, scripts de migración, acceso directo a DB).

---

## 1. Constraints de Integridad Referencial (Foreign Keys)

### 1.1 Módulo: Usuarios y Autenticación

```sql
-- USER_PREFERENCES
ALTER TABLE user_preferences
    ADD CONSTRAINT fk_user_preferences_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE;

-- USER_ADDRESSES
ALTER TABLE user_addresses
    ADD CONSTRAINT fk_user_addresses_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE;

-- USER_PAYMENT_METHODS
ALTER TABLE user_payment_methods
    ADD CONSTRAINT fk_user_payment_methods_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE;
```

---

### 1.2 Módulo: Catálogo y Productos

```sql
-- CATEGORIES (auto-referencia para jerarquía)
ALTER TABLE categories
    ADD CONSTRAINT fk_categories_parent
    FOREIGN KEY (parent_id) REFERENCES categories(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE;

-- PRODUCTS
ALTER TABLE products
    ADD CONSTRAINT fk_products_category
    FOREIGN KEY (category_id) REFERENCES categories(id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE;

ALTER TABLE products
    ADD CONSTRAINT fk_products_supplier
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE;

-- PRODUCT_VARIANTS
ALTER TABLE product_variants
    ADD CONSTRAINT fk_product_variants_product
    FOREIGN KEY (product_id) REFERENCES products(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE;
```

> [!IMPORTANT]
> **RESTRICT** en `products.category_id` y `products.supplier_id` impide eliminar categorías o proveedores que tengan productos asociados. Primero deben reasignarse o eliminarse los productos.

---

### 1.3 Módulo: Carrito y Wishlist

```sql
-- CARTS
ALTER TABLE carts
    ADD CONSTRAINT fk_carts_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE;

-- CART_ITEMS
ALTER TABLE cart_items
    ADD CONSTRAINT fk_cart_items_cart
    FOREIGN KEY (cart_id) REFERENCES carts(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE;

ALTER TABLE cart_items
    ADD CONSTRAINT fk_cart_items_product
    FOREIGN KEY (product_id) REFERENCES products(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE;

ALTER TABLE cart_items
    ADD CONSTRAINT fk_cart_items_variant
    FOREIGN KEY (variant_id) REFERENCES product_variants(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE;

-- WISHLISTS
ALTER TABLE wishlists
    ADD CONSTRAINT fk_wishlists_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE;

ALTER TABLE wishlists
    ADD CONSTRAINT fk_wishlists_product
    FOREIGN KEY (product_id) REFERENCES products(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE;
```

---

### 1.4 Módulo: Pedidos y Ventas

```sql
-- ORDERS
ALTER TABLE orders
    ADD CONSTRAINT fk_orders_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE;

ALTER TABLE orders
    ADD CONSTRAINT fk_orders_coupon
    FOREIGN KEY (coupon_id) REFERENCES coupons(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE;

ALTER TABLE orders
    ADD CONSTRAINT fk_orders_payment_method
    FOREIGN KEY (payment_method_id) REFERENCES user_payment_methods(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE;

ALTER TABLE orders
    ADD CONSTRAINT fk_orders_shipping_address
    FOREIGN KEY (shipping_address_id) REFERENCES user_addresses(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE;

ALTER TABLE orders
    ADD CONSTRAINT fk_orders_billing_address
    FOREIGN KEY (billing_address_id) REFERENCES user_addresses(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE;

-- ORDER_ITEMS
ALTER TABLE order_items
    ADD CONSTRAINT fk_order_items_order
    FOREIGN KEY (order_id) REFERENCES orders(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE;

ALTER TABLE order_items
    ADD CONSTRAINT fk_order_items_product
    FOREIGN KEY (product_id) REFERENCES products(id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE;

ALTER TABLE order_items
    ADD CONSTRAINT fk_order_items_variant
    FOREIGN KEY (variant_id) REFERENCES product_variants(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE;
```

> [!CAUTION]
> **RESTRICT** en `orders.user_id` y `order_items.product_id` previene la eliminación de usuarios con pedidos o productos que están en pedidos históricos. Esta es una regla de negocio crítica para mantener la trazabilidad.

---

### 1.5 Módulo: Reviews y Valoraciones

```sql
-- REVIEWS
ALTER TABLE reviews
    ADD CONSTRAINT fk_reviews_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE;

ALTER TABLE reviews
    ADD CONSTRAINT fk_reviews_product
    FOREIGN KEY (product_id) REFERENCES products(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE;

ALTER TABLE reviews
    ADD CONSTRAINT fk_reviews_order
    FOREIGN KEY (order_id) REFERENCES orders(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE;
```

---

### 1.6 Módulo: Soporte y Tickets

```sql
-- SUPPORT_TICKETS
ALTER TABLE support_tickets
    ADD CONSTRAINT fk_support_tickets_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE;

ALTER TABLE support_tickets
    ADD CONSTRAINT fk_support_tickets_order
    FOREIGN KEY (order_id) REFERENCES orders(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE;

-- TICKET_MESSAGES
ALTER TABLE ticket_messages
    ADD CONSTRAINT fk_ticket_messages_ticket
    FOREIGN KEY (ticket_id) REFERENCES support_tickets(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE;

ALTER TABLE ticket_messages
    ADD CONSTRAINT fk_ticket_messages_sender
    FOREIGN KEY (sender_id) REFERENCES users(id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE;
```

---

### 1.7 Módulo: Notificaciones y Alertas

```sql
-- NOTIFICATIONS
ALTER TABLE notifications
    ADD CONSTRAINT fk_notifications_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE;

-- RESTOCK_ALERTS
ALTER TABLE restock_alerts
    ADD CONSTRAINT fk_restock_alerts_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE;

ALTER TABLE restock_alerts
    ADD CONSTRAINT fk_restock_alerts_product
    FOREIGN KEY (product_id) REFERENCES products(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE;

ALTER TABLE restock_alerts
    ADD CONSTRAINT fk_restock_alerts_variant
    FOREIGN KEY (variant_id) REFERENCES product_variants(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE;
```

---

### 1.8 Módulo: Auditoría

```sql
-- AUDIT_LOGS
ALTER TABLE audit_logs
    ADD CONSTRAINT fk_audit_logs_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE;
```

> [!NOTE]
> En auditoría se usa `SET NULL` para preservar los logs aunque el usuario sea eliminado.

---

## 2. Constraints UNIQUE

```sql
-- USERS
ALTER TABLE users ADD CONSTRAINT uk_users_email UNIQUE (email);

-- CATEGORIES
ALTER TABLE categories ADD CONSTRAINT uk_categories_slug UNIQUE (slug);

-- SUPPLIERS
ALTER TABLE suppliers ADD CONSTRAINT uk_suppliers_tax_id UNIQUE (tax_id);

-- PRODUCTS
ALTER TABLE products ADD CONSTRAINT uk_products_sku UNIQUE (sku);

-- PRODUCT_VARIANTS
ALTER TABLE product_variants ADD CONSTRAINT uk_product_variants_sku UNIQUE (sku);

-- COUPONS
ALTER TABLE coupons ADD CONSTRAINT uk_coupons_code UNIQUE (code);

-- ORDERS
ALTER TABLE orders ADD CONSTRAINT uk_orders_order_number UNIQUE (order_number);

-- SUPPORT_TICKETS
ALTER TABLE support_tickets ADD CONSTRAINT uk_support_tickets_ticket_number UNIQUE (ticket_number);

-- WISHLISTS (un usuario solo puede tener un producto una vez en wishlist)
ALTER TABLE wishlists ADD CONSTRAINT uk_wishlists_user_product UNIQUE (user_id, product_id);

-- REVIEWS (un usuario solo puede hacer una review por producto/pedido)
ALTER TABLE reviews ADD CONSTRAINT uk_reviews_user_product_order UNIQUE (user_id, product_id, order_id);

-- USER_PREFERENCES (un usuario solo tiene una configuración)
ALTER TABLE user_preferences ADD CONSTRAINT uk_user_preferences_user UNIQUE (user_id);

-- CARTS (un usuario solo tiene un carrito activo)
ALTER TABLE carts ADD CONSTRAINT uk_carts_user UNIQUE (user_id);

-- CART_ITEMS (evitar duplicados de producto/variante en mismo carrito)
ALTER TABLE cart_items ADD CONSTRAINT uk_cart_items_cart_product_variant UNIQUE (cart_id, product_id, variant_id);

-- RESTOCK_ALERTS (evitar alertas duplicadas)
ALTER TABLE restock_alerts ADD CONSTRAINT uk_restock_alerts_user_product_variant UNIQUE (user_id, product_id, variant_id);
```

---

## 3. Constraints NOT NULL (Campos Obligatorios)

```sql
-- USERS
ALTER TABLE users
    ALTER COLUMN email SET NOT NULL,
    ALTER COLUMN password_hash SET NOT NULL,
    ALTER COLUMN role SET NOT NULL,
    ALTER COLUMN is_active SET NOT NULL,
    ALTER COLUMN created_at SET NOT NULL;

-- USER_ADDRESSES
ALTER TABLE user_addresses
    ALTER COLUMN user_id SET NOT NULL,
    ALTER COLUMN address_type SET NOT NULL,
    ALTER COLUMN full_name SET NOT NULL,
    ALTER COLUMN street_address SET NOT NULL,
    ALTER COLUMN city SET NOT NULL,
    ALTER COLUMN postal_code SET NOT NULL,
    ALTER COLUMN country SET NOT NULL,
    ALTER COLUMN is_default SET NOT NULL;

-- PRODUCTS
ALTER TABLE products
    ALTER COLUMN category_id SET NOT NULL,
    ALTER COLUMN name SET NOT NULL,
    ALTER COLUMN sku SET NOT NULL,
    ALTER COLUMN base_price SET NOT NULL,
    ALTER COLUMN stock_quantity SET NOT NULL,
    ALTER COLUMN is_featured SET NOT NULL,
    ALTER COLUMN is_adult_only SET NOT NULL,
    ALTER COLUMN requires_age_verification SET NOT NULL;

-- PRODUCT_VARIANTS
ALTER TABLE product_variants
    ALTER COLUMN product_id SET NOT NULL,
    ALTER COLUMN sku SET NOT NULL,
    ALTER COLUMN variant_name SET NOT NULL,
    ALTER COLUMN stock_quantity SET NOT NULL,
    ALTER COLUMN is_active SET NOT NULL;

-- ORDERS
ALTER TABLE orders
    ALTER COLUMN user_id SET NOT NULL,
    ALTER COLUMN order_number SET NOT NULL,
    ALTER COLUMN status SET NOT NULL,
    ALTER COLUMN payment_status SET NOT NULL,
    ALTER COLUMN subtotal_amount SET NOT NULL,
    ALTER COLUMN total_amount SET NOT NULL;

-- ORDER_ITEMS
ALTER TABLE order_items
    ALTER COLUMN order_id SET NOT NULL,
    ALTER COLUMN product_id SET NOT NULL,
    ALTER COLUMN product_name_snapshot SET NOT NULL,
    ALTER COLUMN unit_price_at_purchase SET NOT NULL,
    ALTER COLUMN quantity SET NOT NULL;

-- REVIEWS
ALTER TABLE reviews
    ALTER COLUMN user_id SET NOT NULL,
    ALTER COLUMN product_id SET NOT NULL,
    ALTER COLUMN rating SET NOT NULL,
    ALTER COLUMN is_verified_purchase SET NOT NULL,
    ALTER COLUMN is_approved SET NOT NULL;

-- SUPPORT_TICKETS
ALTER TABLE support_tickets
    ALTER COLUMN user_id SET NOT NULL,
    ALTER COLUMN ticket_number SET NOT NULL,
    ALTER COLUMN priority SET NOT NULL,
    ALTER COLUMN status SET NOT NULL,
    ALTER COLUMN subject SET NOT NULL,
    ALTER COLUMN category SET NOT NULL;

-- TICKET_MESSAGES
ALTER TABLE ticket_messages
    ALTER COLUMN ticket_id SET NOT NULL,
    ALTER COLUMN sender_id SET NOT NULL,
    ALTER COLUMN message_body SET NOT NULL;

-- COUPONS
ALTER TABLE coupons
    ALTER COLUMN code SET NOT NULL,
    ALTER COLUMN discount_type SET NOT NULL,
    ALTER COLUMN discount_value SET NOT NULL,
    ALTER COLUMN is_active SET NOT NULL;

-- NOTIFICATIONS
ALTER TABLE notifications
    ALTER COLUMN user_id SET NOT NULL,
    ALTER COLUMN type SET NOT NULL,
    ALTER COLUMN title SET NOT NULL,
    ALTER COLUMN message SET NOT NULL,
    ALTER COLUMN is_read SET NOT NULL;

-- CATEGORIES
ALTER TABLE categories
    ALTER COLUMN name SET NOT NULL,
    ALTER COLUMN slug SET NOT NULL,
    ALTER COLUMN is_active SET NOT NULL;

-- SUPPLIERS
ALTER TABLE suppliers
    ALTER COLUMN company_name SET NOT NULL,
    ALTER COLUMN tax_id SET NOT NULL,
    ALTER COLUMN is_active SET NOT NULL;
```

---

## 4. CHECK Constraints (Validaciones de Negocio)

### 4.1 Validaciones de Valores Numéricos

```sql
-- REVIEWS: Rating entre 1 y 5
ALTER TABLE reviews
    ADD CONSTRAINT chk_reviews_rating
    CHECK (rating >= 1 AND rating <= 5);

-- PRODUCTS: Precios positivos
ALTER TABLE products
    ADD CONSTRAINT chk_products_base_price_positive
    CHECK (base_price > 0);

-- PRODUCTS: Stock no negativo
ALTER TABLE products
    ADD CONSTRAINT chk_products_stock_non_negative
    CHECK (stock_quantity >= 0);

-- PRODUCTS: Contadores no negativos
ALTER TABLE products
    ADD CONSTRAINT chk_products_view_count_non_negative
    CHECK (view_count >= 0 OR view_count IS NULL);

ALTER TABLE products
    ADD CONSTRAINT chk_products_sales_count_non_negative
    CHECK (sales_count >= 0 OR sales_count IS NULL);

ALTER TABLE products
    ADD CONSTRAINT chk_products_review_count_non_negative
    CHECK (review_count >= 0 OR review_count IS NULL);

-- PRODUCTS: Rating promedio entre 0 y 5
ALTER TABLE products
    ADD CONSTRAINT chk_products_avg_rating_range
    CHECK (avg_rating >= 0 AND avg_rating <= 5 OR avg_rating IS NULL);

-- PRODUCT_VARIANTS: Stock no negativo
ALTER TABLE product_variants
    ADD CONSTRAINT chk_product_variants_stock_non_negative
    CHECK (stock_quantity >= 0);

-- ORDER_ITEMS: Cantidad positiva
ALTER TABLE order_items
    ADD CONSTRAINT chk_order_items_quantity_positive
    CHECK (quantity > 0);

-- ORDER_ITEMS: Precio unitario positivo
ALTER TABLE order_items
    ADD CONSTRAINT chk_order_items_unit_price_positive
    CHECK (unit_price_at_purchase > 0);

-- CART_ITEMS: Cantidad positiva
ALTER TABLE cart_items
    ADD CONSTRAINT chk_cart_items_quantity_positive
    CHECK (quantity > 0);

-- ORDERS: Montos no negativos
ALTER TABLE orders
    ADD CONSTRAINT chk_orders_subtotal_non_negative
    CHECK (subtotal_amount >= 0);

ALTER TABLE orders
    ADD CONSTRAINT chk_orders_discount_non_negative
    CHECK (discount_amount >= 0 OR discount_amount IS NULL);

ALTER TABLE orders
    ADD CONSTRAINT chk_orders_shipping_non_negative
    CHECK (shipping_cost >= 0 OR shipping_cost IS NULL);

ALTER TABLE orders
    ADD CONSTRAINT chk_orders_tax_non_negative
    CHECK (tax_amount >= 0 OR tax_amount IS NULL);

ALTER TABLE orders
    ADD CONSTRAINT chk_orders_total_non_negative
    CHECK (total_amount >= 0);

-- COUPONS: Valor de descuento positivo
ALTER TABLE coupons
    ADD CONSTRAINT chk_coupons_discount_value_positive
    CHECK (discount_value > 0);

-- COUPONS: Monto mínimo de compra no negativo
ALTER TABLE coupons
    ADD CONSTRAINT chk_coupons_min_purchase_non_negative
    CHECK (min_purchase_amount >= 0 OR min_purchase_amount IS NULL);

-- COUPONS: Usos máximos positivo
ALTER TABLE coupons
    ADD CONSTRAINT chk_coupons_max_uses_positive
    CHECK (max_uses > 0 OR max_uses IS NULL);

-- COUPONS: Usos actuales no negativo y <= max_uses
ALTER TABLE coupons
    ADD CONSTRAINT chk_coupons_current_uses_non_negative
    CHECK (current_uses >= 0 OR current_uses IS NULL);

ALTER TABLE coupons
    ADD CONSTRAINT chk_coupons_current_uses_max
    CHECK (current_uses <= max_uses OR max_uses IS NULL OR current_uses IS NULL);

-- COUPONS: Porcentaje máximo 100%
ALTER TABLE coupons
    ADD CONSTRAINT chk_coupons_percentage_max
    CHECK (discount_type != 'percentage' OR discount_value <= 100);

-- CATEGORIES: Orden de visualización positivo
ALTER TABLE categories
    ADD CONSTRAINT chk_categories_display_order_positive
    CHECK (display_order >= 0 OR display_order IS NULL);

-- PROMOTIONS: Orden de visualización positivo
ALTER TABLE promotions
    ADD CONSTRAINT chk_promotions_display_order_positive
    CHECK (display_order >= 0 OR display_order IS NULL);
```

### 4.2 Validaciones de Fechas

```sql
-- COUPONS: valid_from debe ser anterior a valid_until
ALTER TABLE coupons
    ADD CONSTRAINT chk_coupons_valid_date_range
    CHECK (valid_from < valid_until OR valid_from IS NULL OR valid_until IS NULL);

-- PROMOTIONS: valid_from debe ser anterior a valid_until
ALTER TABLE promotions
    ADD CONSTRAINT chk_promotions_valid_date_range
    CHECK (valid_from < valid_until OR valid_from IS NULL OR valid_until IS NULL);

-- USERS: Fecha de nacimiento razonable (no en el futuro, mínimo 13 años)
ALTER TABLE users
    ADD CONSTRAINT chk_users_birth_date_past
    CHECK (birth_date < CURRENT_DATE);

-- ORDERS: paid_at debe ser posterior a created_at
ALTER TABLE orders
    ADD CONSTRAINT chk_orders_paid_after_created
    CHECK (paid_at >= created_at OR paid_at IS NULL);

-- ORDERS: shipped_at debe ser posterior a paid_at
ALTER TABLE orders
    ADD CONSTRAINT chk_orders_shipped_after_paid
    CHECK (shipped_at >= paid_at OR shipped_at IS NULL OR paid_at IS NULL);

-- ORDERS: delivered_at debe ser posterior a shipped_at
ALTER TABLE orders
    ADD CONSTRAINT chk_orders_delivered_after_shipped
    CHECK (delivered_at >= shipped_at OR delivered_at IS NULL OR shipped_at IS NULL);
```

### 4.3 Validaciones de ENUM/Valores Permitidos

```sql
-- USERS: Roles válidos
ALTER TABLE users
    ADD CONSTRAINT chk_users_role_valid
    CHECK (role IN ('customer', 'admin', 'support'));

-- USER_ADDRESSES: Tipos de dirección válidos
ALTER TABLE user_addresses
    ADD CONSTRAINT chk_user_addresses_type_valid
    CHECK (address_type IN ('shipping', 'billing'));

-- ORDERS: Estados válidos
ALTER TABLE orders
    ADD CONSTRAINT chk_orders_status_valid
    CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled'));

-- ORDERS: Estados de pago válidos
ALTER TABLE orders
    ADD CONSTRAINT chk_orders_payment_status_valid
    CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded'));

-- COUPONS: Tipos de descuento válidos
ALTER TABLE coupons
    ADD CONSTRAINT chk_coupons_discount_type_valid
    CHECK (discount_type IN ('percentage', 'fixed'));

-- SUPPORT_TICKETS: Prioridades válidas
ALTER TABLE support_tickets
    ADD CONSTRAINT chk_support_tickets_priority_valid
    CHECK (priority IN ('low', 'medium', 'high', 'urgent'));

-- SUPPORT_TICKETS: Estados válidos
ALTER TABLE support_tickets
    ADD CONSTRAINT chk_support_tickets_status_valid
    CHECK (status IN ('open', 'in_progress', 'resolved', 'closed'));

-- SUPPORT_TICKETS: Categorías válidas
ALTER TABLE support_tickets
    ADD CONSTRAINT chk_support_tickets_category_valid
    CHECK (category IN ('product', 'shipping', 'payment', 'other'));

-- NOTIFICATIONS: Tipos válidos
ALTER TABLE notifications
    ADD CONSTRAINT chk_notifications_type_valid
    CHECK (type IN ('order_status', 'restock', 'promotion', 'review'));

-- AUDIT_LOGS: Acciones válidas
ALTER TABLE audit_logs
    ADD CONSTRAINT chk_audit_logs_action_valid
    CHECK (action IN ('create', 'update', 'delete'));

-- USER_PREFERENCES: Tiempos de entrega válidos
ALTER TABLE user_preferences
    ADD CONSTRAINT chk_user_preferences_delivery_time_valid
    CHECK (preferred_delivery_time IN ('morning', 'afternoon', 'evening', 'any') 
           OR preferred_delivery_time IS NULL);
```

### 4.4 Validaciones de Formato

```sql
-- USERS: Formato de email válido
ALTER TABLE users
    ADD CONSTRAINT chk_users_email_format
    CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- USER_ADDRESSES: Código postal válido (España: 5 dígitos)
ALTER TABLE user_addresses
    ADD CONSTRAINT chk_user_addresses_postal_code_format
    CHECK (postal_code ~ '^\d{5}$' OR country != 'ES');

-- SUPPLIERS: NIF/CIF válido (formato básico España)
ALTER TABLE suppliers
    ADD CONSTRAINT chk_suppliers_tax_id_format
    CHECK (tax_id ~ '^[A-Z0-9]{9}$');

-- PRODUCTS: SKU formato válido (alfanumérico con guiones)
ALTER TABLE products
    ADD CONSTRAINT chk_products_sku_format
    CHECK (sku ~ '^[A-Z0-9\-]+$');

-- ORDERS: Número de pedido formato MK-YYYY-XXXXX
ALTER TABLE orders
    ADD CONSTRAINT chk_orders_order_number_format
    CHECK (order_number ~ '^MK-\d{4}-\d{5}$');

-- SUPPORT_TICKETS: Número de ticket formato TK-XXXXX
ALTER TABLE support_tickets
    ADD CONSTRAINT chk_support_tickets_ticket_number_format
    CHECK (ticket_number ~ '^TK-\d{5}$');
```

---

## 5. Triggers de Automatización

### 5.1 Trigger: Actualización Automática de `updated_at`

```sql
-- Función genérica para actualizar updated_at
CREATE OR REPLACE FUNCTION fn_update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar a todas las tablas con updated_at
CREATE TRIGGER trg_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION fn_update_timestamp();

CREATE TRIGGER trg_user_preferences_updated_at
    BEFORE UPDATE ON user_preferences
    FOR EACH ROW EXECUTE FUNCTION fn_update_timestamp();

CREATE TRIGGER trg_user_addresses_updated_at
    BEFORE UPDATE ON user_addresses
    FOR EACH ROW EXECUTE FUNCTION fn_update_timestamp();

CREATE TRIGGER trg_user_payment_methods_updated_at
    BEFORE UPDATE ON user_payment_methods
    FOR EACH ROW EXECUTE FUNCTION fn_update_timestamp();

CREATE TRIGGER trg_categories_updated_at
    BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION fn_update_timestamp();

CREATE TRIGGER trg_suppliers_updated_at
    BEFORE UPDATE ON suppliers
    FOR EACH ROW EXECUTE FUNCTION fn_update_timestamp();

CREATE TRIGGER trg_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION fn_update_timestamp();

CREATE TRIGGER trg_product_variants_updated_at
    BEFORE UPDATE ON product_variants
    FOR EACH ROW EXECUTE FUNCTION fn_update_timestamp();

CREATE TRIGGER trg_carts_updated_at
    BEFORE UPDATE ON carts
    FOR EACH ROW EXECUTE FUNCTION fn_update_timestamp();

CREATE TRIGGER trg_cart_items_updated_at
    BEFORE UPDATE ON cart_items
    FOR EACH ROW EXECUTE FUNCTION fn_update_timestamp();

CREATE TRIGGER trg_wishlists_updated_at
    BEFORE UPDATE ON wishlists
    FOR EACH ROW EXECUTE FUNCTION fn_update_timestamp();

CREATE TRIGGER trg_coupons_updated_at
    BEFORE UPDATE ON coupons
    FOR EACH ROW EXECUTE FUNCTION fn_update_timestamp();

CREATE TRIGGER trg_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION fn_update_timestamp();

CREATE TRIGGER trg_order_items_updated_at
    BEFORE UPDATE ON order_items
    FOR EACH ROW EXECUTE FUNCTION fn_update_timestamp();

CREATE TRIGGER trg_reviews_updated_at
    BEFORE UPDATE ON reviews
    FOR EACH ROW EXECUTE FUNCTION fn_update_timestamp();

CREATE TRIGGER trg_support_tickets_updated_at
    BEFORE UPDATE ON support_tickets
    FOR EACH ROW EXECUTE FUNCTION fn_update_timestamp();

CREATE TRIGGER trg_ticket_messages_updated_at
    BEFORE UPDATE ON ticket_messages
    FOR EACH ROW EXECUTE FUNCTION fn_update_timestamp();

CREATE TRIGGER trg_notifications_updated_at
    BEFORE UPDATE ON notifications
    FOR EACH ROW EXECUTE FUNCTION fn_update_timestamp();

CREATE TRIGGER trg_restock_alerts_updated_at
    BEFORE UPDATE ON restock_alerts
    FOR EACH ROW EXECUTE FUNCTION fn_update_timestamp();

CREATE TRIGGER trg_promotions_updated_at
    BEFORE UPDATE ON promotions
    FOR EACH ROW EXECUTE FUNCTION fn_update_timestamp();
```

---

### 5.2 Trigger: Decrementar Stock al Pagar Pedido

```sql
-- Función para decrementar stock cuando el pedido cambia a PAID
CREATE OR REPLACE FUNCTION fn_decrement_stock_on_payment()
RETURNS TRIGGER AS $$
BEGIN
    -- Solo actuar cuando el payment_status cambia a 'paid'
    IF NEW.payment_status = 'paid' AND OLD.payment_status != 'paid' THEN
        -- Actualizar paid_at
        NEW.paid_at = CURRENT_TIMESTAMP;
        
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

CREATE TRIGGER trg_orders_decrement_stock
    BEFORE UPDATE ON orders
    FOR EACH ROW
    WHEN (OLD.payment_status IS DISTINCT FROM NEW.payment_status)
    EXECUTE FUNCTION fn_decrement_stock_on_payment();
```

> [!WARNING]
> Este trigger asume que se ha validado previamente que hay stock suficiente. Se recomienda agregar una validación adicional o usar un constraint CHECK para evitar stock negativo.

---

### 5.3 Trigger: Restaurar Stock al Cancelar/Reembolsar Pedido

```sql
-- Función para restaurar stock cuando el pedido es cancelado o reembolsado
CREATE OR REPLACE FUNCTION fn_restore_stock_on_cancel()
RETURNS TRIGGER AS $$
BEGIN
    -- Solo actuar si el pedido fue pagado y ahora se cancela/reembolsa
    IF (NEW.status = 'cancelled' AND OLD.status != 'cancelled' AND OLD.payment_status = 'paid')
       OR (NEW.payment_status = 'refunded' AND OLD.payment_status = 'paid') THEN
        
        -- Establecer timestamps según el caso
        IF NEW.status = 'cancelled' THEN
            NEW.cancelled_at = CURRENT_TIMESTAMP;
        END IF;
        
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

CREATE TRIGGER trg_orders_restore_stock
    BEFORE UPDATE ON orders
    FOR EACH ROW
    WHEN (OLD.status IS DISTINCT FROM NEW.status OR OLD.payment_status IS DISTINCT FROM NEW.payment_status)
    EXECUTE FUNCTION fn_restore_stock_on_cancel();
```

---

### 5.4 Trigger: Calcular Rating Promedio tras Review

```sql
-- Función para recalcular el rating promedio del producto
CREATE OR REPLACE FUNCTION fn_update_product_rating()
RETURNS TRIGGER AS $$
DECLARE
    v_product_id UUID;
BEGIN
    -- Determinar el product_id afectado
    IF TG_OP = 'DELETE' THEN
        v_product_id := OLD.product_id;
    ELSE
        v_product_id := NEW.product_id;
    END IF;
    
    -- Recalcular el rating promedio y contador
    UPDATE products
    SET 
        avg_rating = (
            SELECT ROUND(AVG(rating)::numeric, 2)
            FROM reviews
            WHERE product_id = v_product_id
              AND is_approved = TRUE
              AND deleted_at IS NULL
        ),
        review_count = (
            SELECT COUNT(*)
            FROM reviews
            WHERE product_id = v_product_id
              AND is_approved = TRUE
              AND deleted_at IS NULL
        )
    WHERE id = v_product_id;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger después de INSERT
CREATE TRIGGER trg_reviews_update_rating_insert
    AFTER INSERT ON reviews
    FOR EACH ROW EXECUTE FUNCTION fn_update_product_rating();

-- Trigger después de UPDATE (por si se aprueba/desaprueba o cambia rating)
CREATE TRIGGER trg_reviews_update_rating_update
    AFTER UPDATE ON reviews
    FOR EACH ROW
    WHEN (OLD.rating IS DISTINCT FROM NEW.rating 
          OR OLD.is_approved IS DISTINCT FROM NEW.is_approved
          OR OLD.deleted_at IS DISTINCT FROM NEW.deleted_at)
    EXECUTE FUNCTION fn_update_product_rating();

-- Trigger después de DELETE
CREATE TRIGGER trg_reviews_update_rating_delete
    AFTER DELETE ON reviews
    FOR EACH ROW EXECUTE FUNCTION fn_update_product_rating();
```

---

### 5.5 Trigger: Generar Número de Pedido Secuencial (MK-YYYY-XXXXX)

```sql
-- Secuencia para números de pedido por año
CREATE SEQUENCE IF NOT EXISTS seq_order_number_2024 START WITH 1;
CREATE SEQUENCE IF NOT EXISTS seq_order_number_2025 START WITH 1;
CREATE SEQUENCE IF NOT EXISTS seq_order_number_2026 START WITH 1;
-- Agregar más años según sea necesario

-- Función para generar número de pedido
CREATE OR REPLACE FUNCTION fn_generate_order_number()
RETURNS TRIGGER AS $$
DECLARE
    v_year TEXT;
    v_seq_number INTEGER;
BEGIN
    v_year := TO_CHAR(CURRENT_DATE, 'YYYY');
    
    -- Obtener el siguiente número de la secuencia del año actual
    EXECUTE format('SELECT nextval(''seq_order_number_%s'')', v_year) INTO v_seq_number;
    
    -- Generar el número de pedido
    NEW.order_number := 'MK-' || v_year || '-' || LPAD(v_seq_number::TEXT, 5, '0');
    
    -- Establecer created_at si no está definido
    IF NEW.created_at IS NULL THEN
        NEW.created_at := CURRENT_TIMESTAMP;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_orders_generate_order_number
    BEFORE INSERT ON orders
    FOR EACH ROW
    WHEN (NEW.order_number IS NULL)
    EXECUTE FUNCTION fn_generate_order_number();
```

---

### 5.6 Trigger: Generar Número de Ticket de Soporte (TK-XXXXX)

```sql
-- Secuencia para tickets
CREATE SEQUENCE IF NOT EXISTS seq_ticket_number START WITH 1;

-- Función para generar número de ticket
CREATE OR REPLACE FUNCTION fn_generate_ticket_number()
RETURNS TRIGGER AS $$
DECLARE
    v_seq_number INTEGER;
BEGIN
    SELECT nextval('seq_ticket_number') INTO v_seq_number;
    NEW.ticket_number := 'TK-' || LPAD(v_seq_number::TEXT, 5, '0');
    
    IF NEW.created_at IS NULL THEN
        NEW.created_at := CURRENT_TIMESTAMP;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_support_tickets_generate_number
    BEFORE INSERT ON support_tickets
    FOR EACH ROW
    WHEN (NEW.ticket_number IS NULL)
    EXECUTE FUNCTION fn_generate_ticket_number();
```

---

### 5.7 Trigger: Actualizar Timestamps de Estado de Pedido

```sql
-- Función para actualizar timestamps según cambio de estado
CREATE OR REPLACE FUNCTION fn_update_order_status_timestamps()
RETURNS TRIGGER AS $$
BEGIN
    -- shipped_at cuando cambia a 'shipped'
    IF NEW.status = 'shipped' AND OLD.status != 'shipped' THEN
        NEW.shipped_at := CURRENT_TIMESTAMP;
    END IF;
    
    -- delivered_at cuando cambia a 'delivered'
    IF NEW.status = 'delivered' AND OLD.status != 'delivered' THEN
        NEW.delivered_at := CURRENT_TIMESTAMP;
    END IF;
    
    -- cancelled_at cuando cambia a 'cancelled'
    IF NEW.status = 'cancelled' AND OLD.status != 'cancelled' THEN
        NEW.cancelled_at := CURRENT_TIMESTAMP;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_orders_status_timestamps
    BEFORE UPDATE ON orders
    FOR EACH ROW
    WHEN (OLD.status IS DISTINCT FROM NEW.status)
    EXECUTE FUNCTION fn_update_order_status_timestamps();
```

---

### 5.8 Trigger: Cerrar Tickets Automáticamente al Resolver

```sql
-- Función para establecer timestamps de ticket
CREATE OR REPLACE FUNCTION fn_update_ticket_timestamps()
RETURNS TRIGGER AS $$
BEGIN
    -- resolved_at cuando cambia a 'resolved'
    IF NEW.status = 'resolved' AND OLD.status != 'resolved' THEN
        NEW.resolved_at := CURRENT_TIMESTAMP;
    END IF;
    
    -- closed_at cuando cambia a 'closed'
    IF NEW.status = 'closed' AND OLD.status != 'closed' THEN
        NEW.closed_at := CURRENT_TIMESTAMP;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_support_tickets_timestamps
    BEFORE UPDATE ON support_tickets
    FOR EACH ROW
    WHEN (OLD.status IS DISTINCT FROM NEW.status)
    EXECUTE FUNCTION fn_update_ticket_timestamps();
```

---

### 5.9 Trigger: Incrementar Uso de Cupón

```sql
-- Función para incrementar uso de cupón al usarlo en pedido
CREATE OR REPLACE FUNCTION fn_increment_coupon_usage()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.coupon_id IS NOT NULL THEN
        UPDATE coupons
        SET current_uses = COALESCE(current_uses, 0) + 1
        WHERE id = NEW.coupon_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_orders_increment_coupon
    AFTER INSERT ON orders
    FOR EACH ROW
    WHEN (NEW.coupon_id IS NOT NULL)
    EXECUTE FUNCTION fn_increment_coupon_usage();
```

---

### 5.10 Trigger: Notificar Restock cuando Stock > 0

```sql
-- Función para activar notificaciones de restock
CREATE OR REPLACE FUNCTION fn_check_restock_notifications()
RETURNS TRIGGER AS $$
BEGIN
    -- Solo actuar si el stock pasó de 0 a > 0
    IF OLD.stock_quantity = 0 AND NEW.stock_quantity > 0 THEN
        -- Marcar alertas como notificadas y crear notificaciones
        INSERT INTO notifications (id, user_id, type, title, message, data, is_read, created_at)
        SELECT 
            gen_random_uuid(),
            ra.user_id,
            'restock',
            'Producto disponible',
            'El producto que esperabas ya está disponible: ' || NEW.name,
            jsonb_build_object('product_id', NEW.id, 'product_name', NEW.name),
            FALSE,
            CURRENT_TIMESTAMP
        FROM restock_alerts ra
        WHERE ra.product_id = NEW.id
          AND ra.variant_id IS NULL
          AND ra.notified = FALSE;
        
        -- Marcar alertas como notificadas
        UPDATE restock_alerts
        SET notified = TRUE, notified_at = CURRENT_TIMESTAMP
        WHERE product_id = NEW.id
          AND variant_id IS NULL
          AND notified = FALSE;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_products_check_restock
    AFTER UPDATE ON products
    FOR EACH ROW
    WHEN (OLD.stock_quantity IS DISTINCT FROM NEW.stock_quantity)
    EXECUTE FUNCTION fn_check_restock_notifications();
```

---

### 5.11 Trigger: Establecer `is_verified_purchase` en Reviews

```sql
-- Función para verificar si la review viene de una compra verificada
CREATE OR REPLACE FUNCTION fn_verify_purchase_review()
RETURNS TRIGGER AS $$
BEGIN
    -- Verificar si el usuario ha comprado el producto
    IF NEW.order_id IS NOT NULL THEN
        -- Verificar que el pedido pertenece al usuario y contiene el producto
        IF EXISTS (
            SELECT 1 FROM orders o
            JOIN order_items oi ON oi.order_id = o.id
            WHERE o.id = NEW.order_id
              AND o.user_id = NEW.user_id
              AND oi.product_id = NEW.product_id
              AND o.payment_status = 'paid'
        ) THEN
            NEW.is_verified_purchase := TRUE;
        ELSE
            NEW.is_verified_purchase := FALSE;
        END IF;
    ELSE
        -- Si no hay order_id, verificar si existe alguna compra anterior
        NEW.is_verified_purchase := EXISTS (
            SELECT 1 FROM orders o
            JOIN order_items oi ON oi.order_id = o.id
            WHERE o.user_id = NEW.user_id
              AND oi.product_id = NEW.product_id
              AND o.payment_status = 'paid'
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_reviews_verify_purchase
    BEFORE INSERT ON reviews
    FOR EACH ROW EXECUTE FUNCTION fn_verify_purchase_review();
```

---

### 5.12 Trigger: Validar Stock Antes de Crear Order Items

```sql
-- Función para validar stock disponible
CREATE OR REPLACE FUNCTION fn_validate_stock_before_order_item()
RETURNS TRIGGER AS $$
DECLARE
    v_available_stock INTEGER;
BEGIN
    -- Obtener stock disponible
    IF NEW.variant_id IS NOT NULL THEN
        SELECT stock_quantity INTO v_available_stock
        FROM product_variants
        WHERE id = NEW.variant_id;
    ELSE
        SELECT stock_quantity INTO v_available_stock
        FROM products
        WHERE id = NEW.product_id;
    END IF;
    
    -- Verificar stock suficiente
    IF v_available_stock < NEW.quantity THEN
        RAISE EXCEPTION 'Stock insuficiente. Disponible: %, Solicitado: %', 
            v_available_stock, NEW.quantity;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_order_items_validate_stock
    BEFORE INSERT ON order_items
    FOR EACH ROW EXECUTE FUNCTION fn_validate_stock_before_order_item();
```

---

### 5.13 Trigger: Auditoría Automática

```sql
-- Función genérica de auditoría
CREATE OR REPLACE FUNCTION fn_audit_trigger()
RETURNS TRIGGER AS $$
DECLARE
    v_old_data JSONB;
    v_new_data JSONB;
    v_user_id UUID;
BEGIN
    -- Intentar obtener el user_id del contexto (si está disponible)
    v_user_id := current_setting('app.current_user_id', TRUE)::UUID;
    
    IF TG_OP = 'INSERT' THEN
        v_old_data := NULL;
        v_new_data := to_jsonb(NEW);
    ELSIF TG_OP = 'UPDATE' THEN
        v_old_data := to_jsonb(OLD);
        v_new_data := to_jsonb(NEW);
    ELSIF TG_OP = 'DELETE' THEN
        v_old_data := to_jsonb(OLD);
        v_new_data := NULL;
    END IF;
    
    INSERT INTO audit_logs (id, user_id, table_name, action, record_id, old_values, new_values, ip_address, created_at)
    VALUES (
        gen_random_uuid(),
        v_user_id,
        TG_TABLE_NAME,
        LOWER(TG_OP),
        COALESCE(NEW.id, OLD.id),
        v_old_data,
        v_new_data,
        current_setting('app.client_ip', TRUE),
        CURRENT_TIMESTAMP
    );
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Aplicar auditoría a tablas críticas
CREATE TRIGGER trg_orders_audit
    AFTER INSERT OR UPDATE OR DELETE ON orders
    FOR EACH ROW EXECUTE FUNCTION fn_audit_trigger();

CREATE TRIGGER trg_products_audit
    AFTER INSERT OR UPDATE OR DELETE ON products
    FOR EACH ROW EXECUTE FUNCTION fn_audit_trigger();

CREATE TRIGGER trg_users_audit
    AFTER INSERT OR UPDATE OR DELETE ON users
    FOR EACH ROW EXECUTE FUNCTION fn_audit_trigger();

CREATE TRIGGER trg_coupons_audit
    AFTER INSERT OR UPDATE OR DELETE ON coupons
    FOR EACH ROW EXECUTE FUNCTION fn_audit_trigger();
```

---

## 6. Validaciones Adicionales de Seguridad

### 6.1 Prevención de Eliminación Física (Soft Delete)

```sql
-- Función para convertir DELETE en soft delete
CREATE OR REPLACE FUNCTION fn_soft_delete()
RETURNS TRIGGER AS $$
BEGIN
    -- En lugar de eliminar, marcar como eliminado
    EXECUTE format(
        'UPDATE %I.%I SET deleted_at = CURRENT_TIMESTAMP WHERE id = $1',
        TG_TABLE_SCHEMA, TG_TABLE_NAME
    ) USING OLD.id;
    
    RETURN NULL; -- Evitar la eliminación real
END;
$$ LANGUAGE plpgsql;

-- Aplicar a tablas con deleted_at
CREATE TRIGGER trg_users_soft_delete
    BEFORE DELETE ON users
    FOR EACH ROW EXECUTE FUNCTION fn_soft_delete();

CREATE TRIGGER trg_products_soft_delete
    BEFORE DELETE ON products
    FOR EACH ROW EXECUTE FUNCTION fn_soft_delete();

CREATE TRIGGER trg_categories_soft_delete
    BEFORE DELETE ON categories
    FOR EACH ROW EXECUTE FUNCTION fn_soft_delete();

CREATE TRIGGER trg_suppliers_soft_delete
    BEFORE DELETE ON suppliers
    FOR EACH ROW EXECUTE FUNCTION fn_soft_delete();

CREATE TRIGGER trg_user_addresses_soft_delete
    BEFORE DELETE ON user_addresses
    FOR EACH ROW EXECUTE FUNCTION fn_soft_delete();

CREATE TRIGGER trg_user_payment_methods_soft_delete
    BEFORE DELETE ON user_payment_methods
    FOR EACH ROW EXECUTE FUNCTION fn_soft_delete();

CREATE TRIGGER trg_coupons_soft_delete
    BEFORE DELETE ON coupons
    FOR EACH ROW EXECUTE FUNCTION fn_soft_delete();

CREATE TRIGGER trg_reviews_soft_delete
    BEFORE DELETE ON reviews
    FOR EACH ROW EXECUTE FUNCTION fn_soft_delete();

CREATE TRIGGER trg_support_tickets_soft_delete
    BEFORE DELETE ON support_tickets
    FOR EACH ROW EXECUTE FUNCTION fn_soft_delete();

CREATE TRIGGER trg_product_variants_soft_delete
    BEFORE DELETE ON product_variants
    FOR EACH ROW EXECUTE FUNCTION fn_soft_delete();
```

---

### 6.2 Validación de Cupones

```sql
-- Función para validar cupón antes de aplicar a pedido
CREATE OR REPLACE FUNCTION fn_validate_coupon_on_order()
RETURNS TRIGGER AS $$
DECLARE
    v_coupon RECORD;
BEGIN
    IF NEW.coupon_id IS NOT NULL THEN
        SELECT * INTO v_coupon
        FROM coupons
        WHERE id = NEW.coupon_id;
        
        -- Verificar que el cupón esté activo
        IF NOT v_coupon.is_active THEN
            RAISE EXCEPTION 'El cupón no está activo';
        END IF;
        
        -- Verificar que el cupón no haya expirado
        IF v_coupon.valid_until IS NOT NULL AND v_coupon.valid_until < CURRENT_TIMESTAMP THEN
            RAISE EXCEPTION 'El cupón ha expirado';
        END IF;
        
        -- Verificar que el cupón haya comenzado
        IF v_coupon.valid_from IS NOT NULL AND v_coupon.valid_from > CURRENT_TIMESTAMP THEN
            RAISE EXCEPTION 'El cupón aún no es válido';
        END IF;
        
        -- Verificar usos máximos
        IF v_coupon.max_uses IS NOT NULL AND v_coupon.current_uses >= v_coupon.max_uses THEN
            RAISE EXCEPTION 'El cupón ha alcanzado el límite de usos';
        END IF;
        
        -- Verificar compra mínima
        IF v_coupon.min_purchase_amount IS NOT NULL AND NEW.subtotal_amount < v_coupon.min_purchase_amount THEN
            RAISE EXCEPTION 'El monto mínimo de compra es %', v_coupon.min_purchase_amount;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_orders_validate_coupon
    BEFORE INSERT OR UPDATE ON orders
    FOR EACH ROW
    WHEN (NEW.coupon_id IS NOT NULL)
    EXECUTE FUNCTION fn_validate_coupon_on_order();
```

---

### 6.3 Prevención de Auto-Referencia Cíclica en Categorías

```sql
-- Función para prevenir ciclos en jerarquía de categorías
CREATE OR REPLACE FUNCTION fn_prevent_category_cycle()
RETURNS TRIGGER AS $$
DECLARE
    v_parent_id UUID;
    v_depth INTEGER := 0;
    v_max_depth INTEGER := 10; -- Máximo nivel de profundidad
BEGIN
    IF NEW.parent_id IS NOT NULL THEN
        -- No permitir que una categoría sea su propio padre
        IF NEW.id = NEW.parent_id THEN
            RAISE EXCEPTION 'Una categoría no puede ser su propio padre';
        END IF;
        
        -- Validar que no se cree un ciclo
        v_parent_id := NEW.parent_id;
        WHILE v_parent_id IS NOT NULL AND v_depth < v_max_depth LOOP
            IF v_parent_id = NEW.id THEN
                RAISE EXCEPTION 'Se detectó un ciclo en la jerarquía de categorías';
            END IF;
            
            SELECT parent_id INTO v_parent_id
            FROM categories
            WHERE id = v_parent_id;
            
            v_depth := v_depth + 1;
        END LOOP;
        
        IF v_depth >= v_max_depth THEN
            RAISE EXCEPTION 'La jerarquía de categorías excede la profundidad máxima permitida';
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_categories_prevent_cycle
    BEFORE INSERT OR UPDATE ON categories
    FOR EACH ROW
    WHEN (NEW.parent_id IS NOT NULL)
    EXECUTE FUNCTION fn_prevent_category_cycle();
```

---

### 6.4 Validación de Verificación de Edad

```sql
-- Función para validar acceso a productos para adultos
CREATE OR REPLACE FUNCTION fn_validate_age_for_adult_products()
RETURNS TRIGGER AS $$
DECLARE
    v_product RECORD;
    v_user RECORD;
BEGIN
    -- Obtener información del producto
    SELECT is_adult_only, requires_age_verification 
    INTO v_product
    FROM products
    WHERE id = NEW.product_id;
    
    -- Si el producto requiere verificación de edad
    IF v_product.is_adult_only OR v_product.requires_age_verification THEN
        -- Obtener información del usuario (a través del carrito o pedido)
        IF TG_TABLE_NAME = 'cart_items' THEN
            SELECT u.age_verified, u.birth_date
            INTO v_user
            FROM users u
            JOIN carts c ON c.user_id = u.id
            WHERE c.id = NEW.cart_id;
        ELSIF TG_TABLE_NAME = 'order_items' THEN
            SELECT u.age_verified, u.birth_date
            INTO v_user
            FROM users u
            JOIN orders o ON o.user_id = u.id
            WHERE o.id = NEW.order_id;
        END IF;
        
        -- Verificar edad
        IF NOT v_user.age_verified THEN
            RAISE EXCEPTION 'Se requiere verificación de edad para este producto';
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_cart_items_validate_age
    BEFORE INSERT ON cart_items
    FOR EACH ROW EXECUTE FUNCTION fn_validate_age_for_adult_products();

CREATE TRIGGER trg_order_items_validate_age
    BEFORE INSERT ON order_items
    FOR EACH ROW EXECUTE FUNCTION fn_validate_age_for_adult_products();
```

---

## 7. Índices para Rendimiento

```sql
-- Índices para búsquedas frecuentes
CREATE INDEX idx_users_email ON users(email) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_role ON users(role) WHERE deleted_at IS NULL;

-- Índices para productos
CREATE INDEX idx_products_category ON products(category_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_products_supplier ON products(supplier_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_products_featured ON products(is_featured) WHERE deleted_at IS NULL AND is_active = TRUE;
CREATE INDEX idx_products_rating ON products(avg_rating DESC NULLS LAST) WHERE deleted_at IS NULL;
CREATE INDEX idx_products_sku ON products(sku) WHERE deleted_at IS NULL;

-- Índices para pedidos
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);
CREATE INDEX idx_orders_order_number ON orders(order_number);

-- Índices para reviews
CREATE INDEX idx_reviews_product ON reviews(product_id) WHERE is_approved = TRUE AND deleted_at IS NULL;
CREATE INDEX idx_reviews_user ON reviews(user_id) WHERE deleted_at IS NULL;

-- Índices para soporte
CREATE INDEX idx_support_tickets_user ON support_tickets(user_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_support_tickets_status ON support_tickets(status) WHERE deleted_at IS NULL;

-- Índices para categorías
CREATE INDEX idx_categories_parent ON categories(parent_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_categories_slug ON categories(slug) WHERE deleted_at IS NULL;

-- Índices para wishlist y alertas
CREATE INDEX idx_wishlists_user ON wishlists(user_id);
CREATE INDEX idx_restock_alerts_product ON restock_alerts(product_id) WHERE notified = FALSE;

-- Índices para auditoría
CREATE INDEX idx_audit_logs_table_record ON audit_logs(table_name, record_id);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at DESC);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id) WHERE user_id IS NOT NULL;
```

---

## 8. Resumen de Reglas de Negocio Implementadas

| Tabla | Regla | Tipo | Descripción |
|-------|-------|------|-------------|
| `users` | Email único | UNIQUE | No puede haber dos usuarios con el mismo email |
| `users` | Formato email | CHECK | El email debe tener formato válido |
| `users` | Roles válidos | CHECK | Solo `customer`, `admin`, `support` |
| `products` | SKU único | UNIQUE | Cada producto tiene un código único |
| `products` | Precio positivo | CHECK | El precio base debe ser > 0 |
| `products` | Stock no negativo | CHECK | El stock nunca puede ser negativo |
| `products` | Rating 0-5 | CHECK | El rating promedio entre 0 y 5 |
| `reviews` | Rating 1-5 | CHECK | Las valoraciones entre 1 y 5 |
| `reviews` | Una por usuario/producto | UNIQUE | Un usuario solo puede hacer una review por producto |
| `orders` | Formato número | CHECK | Formato MK-YYYY-XXXXX |
| `orders` | Montos no negativos | CHECK | Todos los montos >= 0 |
| `orders` | Estados válidos | CHECK | Solo estados definidos |
| `orders` | Stock decrementado | TRIGGER | Stock decrementado al pagar |
| `orders` | Stock restaurado | TRIGGER | Stock restaurado al cancelar |
| `coupons` | Porcentaje máximo | CHECK | Descuento porcentaje <= 100 |
| `coupons` | Fechas coherentes | CHECK | valid_from < valid_until |
| `coupons` | Usos validados | TRIGGER | No permitir uso si alcanzó límite |
| `categories` | Sin ciclos | TRIGGER | Prevenir auto-referencia cíclica |
| `*` | updated_at automático | TRIGGER | Se actualiza en cada UPDATE |
| `*` | Soft delete | TRIGGER | DELETE convertido a soft delete |
| `*` | Auditoría | TRIGGER | Registro de cambios críticos |

---

## 9. Consideraciones de Implementación

> [!TIP]
> **Orden de Ejecución**: Al crear la base de datos, ejecutar en este orden:
> 1. Crear tablas sin constraints
> 2. Agregar constraints UNIQUE y NOT NULL
> 3. Agregar Foreign Keys
> 4. Agregar CHECK constraints
> 5. Crear funciones de triggers
> 6. Crear triggers
> 7. Crear índices

> [!IMPORTANT]
> **Testing**: Es fundamental probar cada trigger y constraint antes de desplegar en producción. Crear scripts de prueba que validen:
> - Casos exitosos (happy path)
> - Casos de error esperados
> - Casos límite

> [!WARNING]
> **Migración**: Si ya existe data en la base de datos, algunos constraints pueden fallar. Es necesario:
> - Hacer backup completo
> - Limpiar/corregir datos inconsistentes
> - Agregar constraints gradualmente
> - Verificar integridad después de cada paso
