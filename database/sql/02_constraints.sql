-- ======================================================================================
-- ARCHIVO: 02_constraints.sql
-- DESCRIPCIÓN: Foreign Keys, CHECK, UNIQUE y NOT NULL constraints
-- ORDEN DE EJECUCIÓN: 2 de 9
-- ======================================================================================

-- ======================================================================================
-- 1. UNIQUE CONSTRAINTS
-- ======================================================================================

-- Identificadores únicos globales
ALTER TABLE users ADD CONSTRAINT uk_users_email UNIQUE (email);
ALTER TABLE categories ADD CONSTRAINT uk_categories_slug UNIQUE (slug);
ALTER TABLE suppliers ADD CONSTRAINT uk_suppliers_tax_id UNIQUE (tax_id);
ALTER TABLE products ADD CONSTRAINT uk_products_sku UNIQUE (sku);
ALTER TABLE product_variants ADD CONSTRAINT uk_product_variants_sku UNIQUE (sku);
ALTER TABLE coupons ADD CONSTRAINT uk_coupons_code UNIQUE (code);
ALTER TABLE orders ADD CONSTRAINT uk_orders_order_number UNIQUE (order_number);
ALTER TABLE support_tickets ADD CONSTRAINT uk_support_tickets_ticket_number UNIQUE (ticket_number);

-- Combinaciones únicas (reglas de negocio)
ALTER TABLE user_preferences ADD CONSTRAINT uk_user_preferences_user UNIQUE (user_id);
ALTER TABLE carts ADD CONSTRAINT uk_carts_user UNIQUE (user_id);
ALTER TABLE wishlists ADD CONSTRAINT uk_wishlists_user_product UNIQUE (user_id, product_id);
ALTER TABLE reviews ADD CONSTRAINT uk_reviews_user_product_order UNIQUE (user_id, product_id, order_id);
ALTER TABLE cart_items ADD CONSTRAINT uk_cart_items_cart_product_variant UNIQUE (cart_id, product_id, variant_id);
ALTER TABLE restock_alerts ADD CONSTRAINT uk_restock_alerts_user_product_variant UNIQUE (user_id, product_id, variant_id);

-- ======================================================================================
-- 2. CHECK CONSTRAINTS - Rangos Numéricos
-- ======================================================================================

-- Reviews
ALTER TABLE reviews ADD CONSTRAINT chk_reviews_rating 
    CHECK (rating >= 1 AND rating <= 5);

-- Productos
ALTER TABLE products ADD CONSTRAINT chk_products_base_price_positive 
    CHECK (base_price >= 0);
ALTER TABLE products ADD CONSTRAINT chk_products_stock_non_negative 
    CHECK (stock_quantity >= 0);

-- Variantes
ALTER TABLE product_variants ADD CONSTRAINT chk_product_variants_stock_non_negative 
    CHECK (stock_quantity >= 0);

-- Order Items
ALTER TABLE order_items ADD CONSTRAINT chk_order_items_quantity_positive 
    CHECK (quantity > 0);
ALTER TABLE order_items ADD CONSTRAINT chk_order_items_unit_price_positive 
    CHECK (unit_price_at_purchase > 0);

-- Cart Items
ALTER TABLE cart_items ADD CONSTRAINT chk_cart_items_quantity_positive 
    CHECK (quantity > 0);

-- Orders
ALTER TABLE orders ADD CONSTRAINT chk_orders_subtotal_non_negative 
    CHECK (subtotal_amount >= 0);
ALTER TABLE orders ADD CONSTRAINT chk_orders_total_non_negative 
    CHECK (total_amount >= 0);

-- Cupones
ALTER TABLE coupons ADD CONSTRAINT chk_coupons_discount_value_positive 
    CHECK (discount_value > 0);
ALTER TABLE coupons ADD CONSTRAINT chk_coupons_percentage_max 
    CHECK (discount_type != 'percentage' OR discount_value <= 100);

-- ======================================================================================
-- 3. CHECK CONSTRAINTS - ENUMs (Valores Permitidos)
-- ======================================================================================

-- Usuarios
ALTER TABLE users ADD CONSTRAINT chk_users_role 
    CHECK (role IN ('customer', 'admin', 'support'));

-- Direcciones
ALTER TABLE user_addresses ADD CONSTRAINT chk_user_addresses_type 
    CHECK (address_type IN ('shipping', 'billing'));

-- Pedidos
ALTER TABLE orders ADD CONSTRAINT chk_orders_status 
    CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled'));
ALTER TABLE orders ADD CONSTRAINT chk_orders_payment_status 
    CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded'));

-- Cupones
ALTER TABLE coupons ADD CONSTRAINT chk_coupons_discount_type 
    CHECK (discount_type IN ('percentage', 'fixed'));

-- Tickets de Soporte
ALTER TABLE support_tickets ADD CONSTRAINT chk_support_tickets_priority 
    CHECK (priority IN ('low', 'medium', 'high', 'urgent'));
ALTER TABLE support_tickets ADD CONSTRAINT chk_support_tickets_status 
    CHECK (status IN ('open', 'in_progress', 'resolved', 'closed'));
ALTER TABLE support_tickets ADD CONSTRAINT chk_support_tickets_category 
    CHECK (category IN ('product', 'shipping', 'payment', 'other'));

-- Notificaciones
ALTER TABLE notifications ADD CONSTRAINT chk_notifications_type 
    CHECK (type IN ('order_status', 'restock', 'promotion', 'review', 'system'));

-- Error Logs
ALTER TABLE error_logs ADD CONSTRAINT chk_error_logs_level 
    CHECK (error_level IN ('DEBUG', 'INFO', 'WARNING', 'ERROR', 'CRITICAL'));

-- ======================================================================================
-- 4. CHECK CONSTRAINTS - Coherencia de Fechas
-- ======================================================================================

ALTER TABLE coupons ADD CONSTRAINT chk_coupons_dates 
    CHECK (valid_from IS NULL OR valid_until IS NULL OR valid_from < valid_until);

ALTER TABLE promotions ADD CONSTRAINT chk_promotions_dates 
    CHECK (valid_from IS NULL OR valid_until IS NULL OR valid_from < valid_until);

-- ======================================================================================
-- 5. FOREIGN KEYS - Módulo Usuarios (CASCADE para datos dependientes)
-- ======================================================================================

ALTER TABLE user_preferences
    ADD CONSTRAINT fk_user_preferences_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE user_addresses
    ADD CONSTRAINT fk_user_addresses_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE user_payment_methods
    ADD CONSTRAINT fk_user_payment_methods_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE ON UPDATE CASCADE;

-- ======================================================================================
-- 6. FOREIGN KEYS - Módulo Catálogo
-- ======================================================================================

-- Categorías: SET NULL si se elimina el padre (mantener hijos como raíz)
ALTER TABLE categories
    ADD CONSTRAINT fk_categories_parent
    FOREIGN KEY (parent_id) REFERENCES categories(id)
    ON DELETE SET NULL ON UPDATE CASCADE;

-- Productos: RESTRICT para evitar eliminar categorías/proveedores con productos
ALTER TABLE products
    ADD CONSTRAINT fk_products_category
    FOREIGN KEY (category_id) REFERENCES categories(id)
    ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE products
    ADD CONSTRAINT fk_products_supplier
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id)
    ON DELETE RESTRICT ON UPDATE CASCADE;

-- Variantes: se eliminan con el producto
ALTER TABLE product_variants
    ADD CONSTRAINT fk_product_variants_product
    FOREIGN KEY (product_id) REFERENCES products(id)
    ON DELETE CASCADE ON UPDATE CASCADE;

-- ======================================================================================
-- 7. FOREIGN KEYS - Módulo Carrito y Wishlist
-- ======================================================================================

ALTER TABLE carts
    ADD CONSTRAINT fk_carts_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE cart_items
    ADD CONSTRAINT fk_cart_items_cart
    FOREIGN KEY (cart_id) REFERENCES carts(id)
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE cart_items
    ADD CONSTRAINT fk_cart_items_product
    FOREIGN KEY (product_id) REFERENCES products(id)
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE cart_items
    ADD CONSTRAINT fk_cart_items_variant
    FOREIGN KEY (variant_id) REFERENCES product_variants(id)
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE wishlists
    ADD CONSTRAINT fk_wishlists_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE wishlists
    ADD CONSTRAINT fk_wishlists_product
    FOREIGN KEY (product_id) REFERENCES products(id)
    ON DELETE CASCADE ON UPDATE CASCADE;

-- ======================================================================================
-- 8. FOREIGN KEYS - Módulo Pedidos (RESTRICT para histórico)
-- ======================================================================================

-- Pedidos: RESTRICT para preservar histórico de usuarios
ALTER TABLE orders
    ADD CONSTRAINT fk_orders_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE RESTRICT ON UPDATE CASCADE;

-- Referencias opcionales: SET NULL si se elimina el registro referenciado
ALTER TABLE orders
    ADD CONSTRAINT fk_orders_coupon
    FOREIGN KEY (coupon_id) REFERENCES coupons(id)
    ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE orders
    ADD CONSTRAINT fk_orders_payment_method
    FOREIGN KEY (payment_method_id) REFERENCES user_payment_methods(id)
    ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE orders
    ADD CONSTRAINT fk_orders_shipping_address
    FOREIGN KEY (shipping_address_id) REFERENCES user_addresses(id)
    ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE orders
    ADD CONSTRAINT fk_orders_billing_address
    FOREIGN KEY (billing_address_id) REFERENCES user_addresses(id)
    ON DELETE SET NULL ON UPDATE CASCADE;

-- Order Items
ALTER TABLE order_items
    ADD CONSTRAINT fk_order_items_order
    FOREIGN KEY (order_id) REFERENCES orders(id)
    ON DELETE CASCADE ON UPDATE CASCADE;

-- SET NULL para mantener histórico aunque se elimine el producto
ALTER TABLE order_items
    ADD CONSTRAINT fk_order_items_product
    FOREIGN KEY (product_id) REFERENCES products(id)
    ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE order_items
    ADD CONSTRAINT fk_order_items_variant
    FOREIGN KEY (variant_id) REFERENCES product_variants(id)
    ON DELETE SET NULL ON UPDATE CASCADE;

-- ======================================================================================
-- 9. FOREIGN KEYS - Módulo Reviews (RESTRICT para preservar integridad)
-- ======================================================================================

ALTER TABLE reviews
    ADD CONSTRAINT fk_reviews_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE reviews
    ADD CONSTRAINT fk_reviews_product
    FOREIGN KEY (product_id) REFERENCES products(id)
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE reviews
    ADD CONSTRAINT fk_reviews_order
    FOREIGN KEY (order_id) REFERENCES orders(id)
    ON DELETE SET NULL ON UPDATE CASCADE;

-- ======================================================================================
-- 10. FOREIGN KEYS - Módulo Soporte
-- ======================================================================================

ALTER TABLE support_tickets
    ADD CONSTRAINT fk_support_tickets_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE support_tickets
    ADD CONSTRAINT fk_support_tickets_order
    FOREIGN KEY (order_id) REFERENCES orders(id)
    ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE ticket_messages
    ADD CONSTRAINT fk_ticket_messages_ticket
    FOREIGN KEY (ticket_id) REFERENCES support_tickets(id)
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE ticket_messages
    ADD CONSTRAINT fk_ticket_messages_sender
    FOREIGN KEY (sender_id) REFERENCES users(id)
    ON DELETE RESTRICT ON UPDATE CASCADE;

-- ======================================================================================
-- 11. FOREIGN KEYS - Módulo Notificaciones y Alertas
-- ======================================================================================

ALTER TABLE notifications
    ADD CONSTRAINT fk_notifications_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE restock_alerts
    ADD CONSTRAINT fk_restock_alerts_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE restock_alerts
    ADD CONSTRAINT fk_restock_alerts_product
    FOREIGN KEY (product_id) REFERENCES products(id)
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE restock_alerts
    ADD CONSTRAINT fk_restock_alerts_variant
    FOREIGN KEY (variant_id) REFERENCES product_variants(id)
    ON DELETE CASCADE ON UPDATE CASCADE;

-- ======================================================================================
-- FIN DE 02_constraints.sql
-- Siguiente: 03_functions_triggers.sql
-- ======================================================================================
