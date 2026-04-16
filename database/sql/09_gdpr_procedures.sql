-- ======================================================================================
-- ARCHIVO: 09_gdpr_procedures.sql
-- DESCRIPCIÓN: Procedimientos para cumplimiento GDPR (RGPD)
-- ORDEN DE EJECUCIÓN: 9 de 9
-- ======================================================================================

-- ======================================================================================
-- 1. FUNCIÓN: Anonimizar usuario (Derecho al Olvido - Art. 17 GDPR)
-- Uso: SELECT anonymize_user('user-uuid');
-- ======================================================================================

CREATE OR REPLACE FUNCTION anonymize_user(p_user_id UUID)
RETURNS JSONB AS $$
DECLARE
    v_result JSONB;
    v_email_anonymized TEXT;
    v_orders_count INTEGER;
    v_reviews_count INTEGER;
    v_tickets_count INTEGER;
BEGIN
    -- Verificar que el usuario existe
    IF NOT EXISTS (SELECT 1 FROM users WHERE id = p_user_id) THEN
        RAISE EXCEPTION 'User with ID % not found', p_user_id;
    END IF;
    
    -- Generar email anonimizado único
    v_email_anonymized := 'deleted-' || p_user_id || '@anonymized.local';
    
    -- Contar registros relacionados para el reporte
    SELECT COUNT(*) INTO v_orders_count FROM orders WHERE user_id = p_user_id;
    SELECT COUNT(*) INTO v_reviews_count FROM reviews WHERE user_id = p_user_id;
    SELECT COUNT(*) INTO v_tickets_count FROM support_tickets WHERE user_id = p_user_id;
    
    -- Anonimizar usuario principal
    UPDATE users SET
        email = v_email_anonymized,
        password_hash = 'DELETED',
        birth_date = NULL,
        age_verified = FALSE,
        age_verified_at = NULL,
        is_active = FALSE,
        deleted_at = NOW()
    WHERE id = p_user_id;
    
    -- Anonimizar preferencias (se eliminan con CASCADE, pero por seguridad)
    DELETE FROM user_preferences WHERE user_id = p_user_id;
    
    -- Anonimizar direcciones
    UPDATE user_addresses SET
        full_name = 'DELETED',
        phone = NULL,
        phone_encrypted = NULL,
        street_address = 'DELETED',
        street_address_encrypted = NULL,
        city = 'DELETED',
        state = NULL,
        postal_code = 'DELETED',
        country = 'DELETED',
        deleted_at = NOW()
    WHERE user_id = p_user_id;
    
    -- Anonimizar métodos de pago
    UPDATE user_payment_methods SET
        gateway_token_id = 'DELETED',
        gateway_token_encrypted = NULL,
        last_4_digits = NULL,
        deleted_at = NOW()
    WHERE user_id = p_user_id;
    
    -- PRESERVE pedidos pero anonimizar direcciones (requerido por contabilidad)
    UPDATE orders SET
        shipping_address_snapshot = '{"anonymized": true, "reason": "GDPR Art. 17"}'::JSONB,
        billing_address_snapshot = '{"anonymized": true, "reason": "GDPR Art. 17"}'::JSONB,
        shipping_address_encrypted = NULL,
        billing_address_encrypted = NULL
    WHERE user_id = p_user_id;
    
    -- Anonimizar reviews (mantener contenido, eliminar autor)
    UPDATE reviews SET
        comment = CASE 
            WHEN comment IS NOT NULL 
            THEN '[Review de usuario eliminado]'
            ELSE NULL
        END
    WHERE user_id = p_user_id;
    -- Nota: No eliminamos el user_id de reviews porque el FK es RESTRICT
    -- La review queda asociada al usuario anonimizado
    
    -- Anonimizar tickets de soporte
    UPDATE support_tickets SET
        subject = '[Ticket de usuario eliminado]'
    WHERE user_id = p_user_id;
    
    UPDATE ticket_messages tm SET
        message_body = '[Mensaje de usuario eliminado]'
    FROM support_tickets st
    WHERE tm.ticket_id = st.id 
      AND st.user_id = p_user_id
      AND tm.sender_id = p_user_id;
    
    -- Eliminar carritos y wishlists (datos temporales)
    DELETE FROM cart_items WHERE cart_id IN (SELECT id FROM carts WHERE user_id = p_user_id);
    DELETE FROM carts WHERE user_id = p_user_id;
    DELETE FROM wishlists WHERE user_id = p_user_id;
    
    -- Eliminar notificaciones
    DELETE FROM notifications WHERE user_id = p_user_id;
    
    -- Eliminar alertas de restock
    DELETE FROM restock_alerts WHERE user_id = p_user_id;
    
    -- Registrar en audit_log
    INSERT INTO audit_logs (table_name, action, record_id, new_values)
    VALUES ('users', 'delete', p_user_id, jsonb_build_object(
        'action', 'GDPR Anonymization',
        'timestamp', NOW(),
        'orders_preserved', v_orders_count,
        'reviews_anonymized', v_reviews_count,
        'tickets_anonymized', v_tickets_count
    ));
    
    -- Construir resultado
    v_result := jsonb_build_object(
        'success', TRUE,
        'user_id', p_user_id,
        'anonymized_at', NOW(),
        'orders_preserved', v_orders_count,
        'reviews_anonymized', v_reviews_count,
        'tickets_anonymized', v_tickets_count,
        'message', 'User data anonymized successfully per GDPR Art. 17'
    );
    
    RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ======================================================================================
-- 2. FUNCIÓN: Exportar datos de usuario (Derecho de Portabilidad - Art. 20 GDPR)
-- Uso: SELECT export_user_data('user-uuid');
-- ======================================================================================

CREATE OR REPLACE FUNCTION export_user_data(p_user_id UUID)
RETURNS JSONB AS $$
DECLARE
    v_user_data JSONB;
    v_addresses JSONB;
    v_payment_methods JSONB;
    v_orders JSONB;
    v_reviews JSONB;
    v_tickets JSONB;
    v_preferences JSONB;
    v_result JSONB;
BEGIN
    -- Verificar que el usuario existe
    IF NOT EXISTS (SELECT 1 FROM users WHERE id = p_user_id) THEN
        RAISE EXCEPTION 'User with ID % not found', p_user_id;
    END IF;
    
    -- Datos del usuario
    SELECT jsonb_build_object(
        'id', id,
        'email', email,
        'role', role,
        'birth_date', birth_date,
        'age_verified', age_verified,
        'is_active', is_active,
        'created_at', created_at
    ) INTO v_user_data
    FROM users WHERE id = p_user_id;
    
    -- Preferencias
    SELECT jsonb_build_object(
        'discreet_packaging', discreet_packaging,
        'discreet_billing_name', discreet_billing_name,
        'preferred_delivery_time', preferred_delivery_time,
        'email_notifications', email_notifications,
        'sms_notifications', sms_notifications
    ) INTO v_preferences
    FROM user_preferences WHERE user_id = p_user_id;
    
    -- Direcciones (desencriptadas)
    SELECT COALESCE(jsonb_agg(jsonb_build_object(
        'address_type', address_type,
        'full_name', full_name,
        'phone', COALESCE(decrypt_sensitive(phone_encrypted), phone),
        'street_address', COALESCE(decrypt_sensitive(street_address_encrypted), street_address),
        'city', city,
        'state', state,
        'postal_code', postal_code,
        'country', country,
        'is_default', is_default
    )), '[]'::JSONB) INTO v_addresses
    FROM user_addresses 
    WHERE user_id = p_user_id AND deleted_at IS NULL;
    
    -- Métodos de pago (sin tokens sensibles)
    SELECT COALESCE(jsonb_agg(jsonb_build_object(
        'method_type', method_type,
        'gateway_provider', gateway_provider,
        'last_4_digits', last_4_digits,
        'is_default', is_default,
        'created_at', created_at
    )), '[]'::JSONB) INTO v_payment_methods
    FROM user_payment_methods 
    WHERE user_id = p_user_id AND deleted_at IS NULL;
    
    -- Pedidos con items
    SELECT COALESCE(jsonb_agg(jsonb_build_object(
        'order_number', o.order_number,
        'status', o.status,
        'payment_status', o.payment_status,
        'total_amount', o.total_amount,
        'created_at', o.created_at,
        'shipping_address', COALESCE(
            decrypt_json(o.shipping_address_encrypted),
            o.shipping_address_snapshot
        ),
        'items', (
            SELECT jsonb_agg(jsonb_build_object(
                'product_name', oi.product_name_snapshot,
                'quantity', oi.quantity,
                'unit_price', oi.unit_price_at_purchase
            ))
            FROM order_items oi WHERE oi.order_id = o.id
        )
    )), '[]'::JSONB) INTO v_orders
    FROM orders o WHERE o.user_id = p_user_id;
    
    -- Reviews
    SELECT COALESCE(jsonb_agg(jsonb_build_object(
        'product_id', r.product_id,
        'product_name', p.name,
        'rating', r.rating,
        'comment', r.comment,
        'is_verified_purchase', r.is_verified_purchase,
        'created_at', r.created_at
    )), '[]'::JSONB) INTO v_reviews
    FROM reviews r
    LEFT JOIN products p ON r.product_id = p.id
    WHERE r.user_id = p_user_id AND r.deleted_at IS NULL;
    
    -- Tickets de soporte
    SELECT COALESCE(jsonb_agg(jsonb_build_object(
        'ticket_number', st.ticket_number,
        'subject', st.subject,
        'category', st.category,
        'status', st.status,
        'created_at', st.created_at,
        'messages', (
            SELECT jsonb_agg(jsonb_build_object(
                'message', tm.message_body,
                'is_from_user', tm.sender_id = p_user_id,
                'created_at', tm.created_at
            ) ORDER BY tm.created_at)
            FROM ticket_messages tm WHERE tm.ticket_id = st.id
        )
    )), '[]'::JSONB) INTO v_tickets
    FROM support_tickets st 
    WHERE st.user_id = p_user_id AND st.deleted_at IS NULL;
    
    -- Construir resultado completo
    v_result := jsonb_build_object(
        'export_info', jsonb_build_object(
            'exported_at', NOW(),
            'format_version', '1.0',
            'gdpr_article', '20 - Right to Data Portability'
        ),
        'user', v_user_data,
        'preferences', v_preferences,
        'addresses', v_addresses,
        'payment_methods', v_payment_methods,
        'orders', v_orders,
        'reviews', v_reviews,
        'support_tickets', v_tickets
    );
    
    -- Registrar exportación en audit_log
    INSERT INTO audit_logs (user_id, table_name, action, record_id, new_values)
    VALUES (p_user_id, 'users', 'update', p_user_id, jsonb_build_object(
        'action', 'GDPR Data Export',
        'timestamp', NOW()
    ));
    
    RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ======================================================================================
-- 3. FUNCIÓN: Eliminación definitiva tras período de retención
-- Uso: SELECT purge_anonymized_users(365); -- Eliminar usuarios anonimizados hace >365 días
-- ======================================================================================

CREATE OR REPLACE FUNCTION purge_anonymized_users(p_retention_days INTEGER DEFAULT 365)
RETURNS TABLE (
    user_id UUID,
    deleted_at TIMESTAMP,
    purged_at TIMESTAMP
) AS $$
DECLARE
    v_user RECORD;
    v_cutoff_date TIMESTAMP;
BEGIN
    v_cutoff_date := NOW() - (p_retention_days || ' days')::INTERVAL;
    
    FOR v_user IN
        SELECT id, u.deleted_at
        FROM users u
        WHERE u.deleted_at IS NOT NULL
          AND u.deleted_at < v_cutoff_date
          AND u.email LIKE 'deleted-%@anonymized.local'
    LOOP
        -- Verificar que no hay pedidos en el último año (requisito contable)
        IF NOT EXISTS (
            SELECT 1 FROM orders 
            WHERE orders.user_id = v_user.id 
              AND created_at > NOW() - INTERVAL '1 year'
        ) THEN
            -- Eliminar reviews asociadas
            DELETE FROM reviews WHERE reviews.user_id = v_user.id;
            
            -- Actualizar referencia en orders a NULL
            UPDATE orders SET user_id = NULL WHERE orders.user_id = v_user.id;
            
            -- Actualizar referencia en support_tickets
            UPDATE support_tickets SET user_id = NULL WHERE support_tickets.user_id = v_user.id;
            UPDATE ticket_messages SET sender_id = NULL WHERE sender_id = v_user.id;
            
            -- Eliminar direcciones y métodos de pago
            DELETE FROM user_addresses WHERE user_addresses.user_id = v_user.id;
            DELETE FROM user_payment_methods WHERE user_payment_methods.user_id = v_user.id;
            
            -- Finalmente eliminar usuario
            DELETE FROM users WHERE id = v_user.id;
            
            user_id := v_user.id;
            deleted_at := v_user.deleted_at;
            purged_at := NOW();
            RETURN NEXT;
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ======================================================================================
-- 4. FUNCIÓN: Verificar consentimiento (GDPR Art. 7)
-- ======================================================================================

CREATE TABLE IF NOT EXISTS user_consents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    consent_type VARCHAR(50) NOT NULL,  -- 'marketing', 'analytics', 'third_party', 'cookies'
    granted BOOLEAN NOT NULL DEFAULT FALSE,
    granted_at TIMESTAMP,
    revoked_at TIMESTAMP,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, consent_type)
);

CREATE INDEX idx_user_consents_user ON user_consents(user_id);
CREATE INDEX idx_user_consents_type ON user_consents(consent_type, granted);

-- Función para registrar consentimiento
CREATE OR REPLACE FUNCTION record_consent(
    p_user_id UUID,
    p_consent_type VARCHAR(50),
    p_granted BOOLEAN,
    p_ip_address VARCHAR(45) DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
    v_result JSONB;
BEGIN
    INSERT INTO user_consents (user_id, consent_type, granted, granted_at, ip_address, user_agent)
    VALUES (
        p_user_id, 
        p_consent_type, 
        p_granted,
        CASE WHEN p_granted THEN NOW() ELSE NULL END,
        p_ip_address,
        p_user_agent
    )
    ON CONFLICT (user_id, consent_type) DO UPDATE SET
        granted = EXCLUDED.granted,
        granted_at = CASE WHEN EXCLUDED.granted THEN NOW() ELSE user_consents.granted_at END,
        revoked_at = CASE WHEN NOT EXCLUDED.granted THEN NOW() ELSE NULL END,
        ip_address = EXCLUDED.ip_address,
        user_agent = EXCLUDED.user_agent,
        updated_at = NOW();
    
    v_result := jsonb_build_object(
        'user_id', p_user_id,
        'consent_type', p_consent_type,
        'granted', p_granted,
        'timestamp', NOW()
    );
    
    RETURN v_result;
END;
$$ LANGUAGE plpgsql;

-- ======================================================================================
-- 5. VISTA: Estado de consentimientos por usuario
-- ======================================================================================

CREATE OR REPLACE VIEW v_user_consent_status AS
SELECT 
    u.id AS user_id,
    u.email,
    COALESCE(
        jsonb_object_agg(uc.consent_type, uc.granted)
        FILTER (WHERE uc.consent_type IS NOT NULL),
        '{}'::JSONB
    ) AS consents,
    MAX(uc.updated_at) AS last_consent_update
FROM users u
LEFT JOIN user_consents uc ON u.id = uc.user_id
WHERE u.deleted_at IS NULL
GROUP BY u.id, u.email;

GRANT SELECT ON v_user_consent_status TO app_role;

-- ======================================================================================
-- 6. FUNCIÓN: Generar reporte de cumplimiento GDPR
-- ======================================================================================

CREATE OR REPLACE FUNCTION generate_gdpr_compliance_report()
RETURNS JSONB AS $$
DECLARE
    v_result JSONB;
BEGIN
    v_result := jsonb_build_object(
        'report_date', NOW(),
        'total_users', (SELECT COUNT(*) FROM users WHERE deleted_at IS NULL),
        'anonymized_users', (SELECT COUNT(*) FROM users WHERE deleted_at IS NOT NULL AND email LIKE 'deleted-%@anonymized.local'),
        'pending_purge', (SELECT COUNT(*) FROM users WHERE deleted_at IS NOT NULL AND deleted_at < NOW() - INTERVAL '365 days'),
        'consent_stats', (
            SELECT jsonb_object_agg(consent_type, stats)
            FROM (
                SELECT 
                    consent_type,
                    jsonb_build_object(
                        'granted', COUNT(*) FILTER (WHERE granted = TRUE),
                        'revoked', COUNT(*) FILTER (WHERE granted = FALSE),
                        'total', COUNT(*)
                    ) AS stats
                FROM user_consents
                GROUP BY consent_type
            ) t
        ),
        'data_exports_last_30_days', (
            SELECT COUNT(*) 
            FROM audit_logs 
            WHERE new_values->>'action' = 'GDPR Data Export' 
              AND created_at > NOW() - INTERVAL '30 days'
        ),
        'anonymizations_last_30_days', (
            SELECT COUNT(*) 
            FROM audit_logs 
            WHERE new_values->>'action' = 'GDPR Anonymization' 
              AND created_at > NOW() - INTERVAL '30 days'
        )
    );
    
    RETURN v_result;
END;
$$ LANGUAGE plpgsql;

-- ======================================================================================
-- 7. PERMISOS
-- ======================================================================================

-- Solo admin_role puede ejecutar funciones de GDPR
GRANT EXECUTE ON FUNCTION anonymize_user TO admin_role;
GRANT EXECUTE ON FUNCTION export_user_data TO admin_role;
GRANT EXECUTE ON FUNCTION purge_anonymized_users TO admin_role;
GRANT EXECUTE ON FUNCTION generate_gdpr_compliance_report TO admin_role;

-- app_role puede registrar consentimientos
GRANT EXECUTE ON FUNCTION record_consent TO app_role;
GRANT SELECT, INSERT, UPDATE ON user_consents TO app_role;

-- ======================================================================================
-- NOTAS DE CUMPLIMIENTO GDPR
-- ======================================================================================

/*
ARTÍCULOS GDPR IMPLEMENTADOS:

Art. 7 - Condiciones para el consentimiento
  → Tabla user_consents con histórico de consentimientos

Art. 15 - Derecho de acceso
  → Función export_user_data() retorna todos los datos del usuario

Art. 17 - Derecho al olvido
  → Función anonymize_user() anonimiza todos los datos personales
  → Mantiene datos necesarios para cumplimiento legal (pedidos)

Art. 20 - Derecho a la portabilidad
  → Función export_user_data() retorna JSON estructurado

Art. 32 - Seguridad del tratamiento
  → Encriptación de datos sensibles (08_encryption.sql)
  → Roles con mínimo privilegio (06_security_roles.sql)

PROCESO RECOMENDADO:

1. Usuario solicita eliminación de cuenta
2. Verificar identidad del usuario
3. Ejecutar anonymize_user(user_id)
4. Notificar al usuario que sus datos han sido anonimizados
5. Después de 365 días: purge_anonymized_users(365) limpia físicamente

DOCUMENTACIÓN REQUERIDA:

- Política de privacidad actualizada
- Registro de actividades de tratamiento
- Evaluación de impacto (DPIA)
- Procedimiento de respuesta a brechas de seguridad
*/

-- ======================================================================================
-- FIN DE 09_gdpr_procedures.sql
-- Fin de archivos SQL modulares
-- ======================================================================================
