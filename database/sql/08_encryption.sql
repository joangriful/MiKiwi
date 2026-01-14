-- ======================================================================================
-- ARCHIVO: 08_encryption.sql
-- DESCRIPCIÓN: Encriptación de datos sensibles con pgcrypto
-- ORDEN DE EJECUCIÓN: 8 de 9
-- ======================================================================================

-- ======================================================================================
-- 1. CONFIGURACIÓN DE CLAVE DE ENCRIPTACIÓN
-- ======================================================================================

/*
IMPORTANTE: La clave de encriptación debe almacenarse en variables de entorno,
nunca en código o en la base de datos.

Configurar en postgresql.conf o al iniciar sesión:
  SET app.encryption_key = 'tu-clave-secreta-de-32-caracteres';

O en Docker:
  POSTGRES_INITDB_ARGS="-c app.encryption_key=tu-clave"

En Laravel, configurar el parámetro al conectar:
  'options' => [
      PDO::ATTR_INIT_COMMAND => "SET app.encryption_key = '" . env('DB_ENCRYPTION_KEY') . "';"
  ]
*/

-- Verificar que pgcrypto está instalado
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pgcrypto') THEN
        CREATE EXTENSION pgcrypto;
    END IF;
END $$;

-- ======================================================================================
-- 2. FUNCIONES DE ENCRIPTACIÓN/DESENCRIPTACIÓN
-- ======================================================================================

-- 2.1 Encriptar texto a bytea
CREATE OR REPLACE FUNCTION encrypt_sensitive(p_plaintext TEXT)
RETURNS BYTEA AS $$
DECLARE
    v_key TEXT;
BEGIN
    -- Obtener clave de configuración
    BEGIN
        v_key := current_setting('app.encryption_key');
    EXCEPTION WHEN OTHERS THEN
        RAISE EXCEPTION 'Encryption key not configured. Set app.encryption_key first.';
    END;
    
    IF v_key IS NULL OR v_key = '' THEN
        RAISE EXCEPTION 'Encryption key cannot be empty';
    END IF;
    
    RETURN pgp_sym_encrypt(p_plaintext, v_key);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2.2 Desencriptar bytea a texto
CREATE OR REPLACE FUNCTION decrypt_sensitive(p_encrypted BYTEA)
RETURNS TEXT AS $$
DECLARE
    v_key TEXT;
BEGIN
    IF p_encrypted IS NULL THEN
        RETURN NULL;
    END IF;
    
    BEGIN
        v_key := current_setting('app.encryption_key');
    EXCEPTION WHEN OTHERS THEN
        RAISE EXCEPTION 'Encryption key not configured. Set app.encryption_key first.';
    END;
    
    BEGIN
        RETURN pgp_sym_decrypt(p_encrypted, v_key);
    EXCEPTION WHEN OTHERS THEN
        RAISE WARNING 'Failed to decrypt data. Possible key mismatch.';
        RETURN NULL;
    END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2.3 Encriptar JSON a bytea
CREATE OR REPLACE FUNCTION encrypt_json(p_json JSONB)
RETURNS BYTEA AS $$
BEGIN
    RETURN encrypt_sensitive(p_json::TEXT);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2.4 Desencriptar bytea a JSON
CREATE OR REPLACE FUNCTION decrypt_json(p_encrypted BYTEA)
RETURNS JSONB AS $$
DECLARE
    v_text TEXT;
BEGIN
    v_text := decrypt_sensitive(p_encrypted);
    IF v_text IS NULL THEN
        RETURN NULL;
    END IF;
    RETURN v_text::JSONB;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ======================================================================================
-- 3. COLUMNAS ENCRIPTADAS - Agregar columnas para datos sensibles
-- ======================================================================================

-- 3.1 user_payment_methods: token de gateway encriptado
ALTER TABLE user_payment_methods 
    ADD COLUMN IF NOT EXISTS gateway_token_encrypted BYTEA;

-- 3.2 user_addresses: campos sensibles encriptados
ALTER TABLE user_addresses 
    ADD COLUMN IF NOT EXISTS street_address_encrypted BYTEA,
    ADD COLUMN IF NOT EXISTS phone_encrypted BYTEA;

-- 3.3 orders: snapshots de direcciones encriptados
ALTER TABLE orders 
    ADD COLUMN IF NOT EXISTS shipping_address_encrypted BYTEA,
    ADD COLUMN IF NOT EXISTS billing_address_encrypted BYTEA;

-- ======================================================================================
-- 4. TRIGGERS PARA ENCRIPTACIÓN AUTOMÁTICA
-- ======================================================================================

-- 4.1 Trigger: Encriptar token de payment method
CREATE OR REPLACE FUNCTION encrypt_payment_method_token()
RETURNS TRIGGER AS $$
BEGIN
    -- Si hay token en texto plano, encriptarlo
    IF NEW.gateway_token_id IS NOT NULL AND NEW.gateway_token_id != '' THEN
        NEW.gateway_token_encrypted := encrypt_sensitive(NEW.gateway_token_id);
        -- Mantener los últimos 4 dígitos para referencia
        -- El campo gateway_token_id original se puede vaciar después de migrar
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_encrypt_payment_token
    BEFORE INSERT OR UPDATE ON user_payment_methods
    FOR EACH ROW EXECUTE FUNCTION encrypt_payment_method_token();

-- 4.2 Trigger: Encriptar dirección
CREATE OR REPLACE FUNCTION encrypt_address_fields()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.street_address IS NOT NULL THEN
        NEW.street_address_encrypted := encrypt_sensitive(NEW.street_address);
    END IF;
    IF NEW.phone IS NOT NULL THEN
        NEW.phone_encrypted := encrypt_sensitive(NEW.phone);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_encrypt_address
    BEFORE INSERT OR UPDATE ON user_addresses
    FOR EACH ROW EXECUTE FUNCTION encrypt_address_fields();

-- 4.3 Trigger: Encriptar snapshots de pedido
CREATE OR REPLACE FUNCTION encrypt_order_addresses()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.shipping_address_snapshot IS NOT NULL THEN
        NEW.shipping_address_encrypted := encrypt_json(NEW.shipping_address_snapshot);
    END IF;
    IF NEW.billing_address_snapshot IS NOT NULL THEN
        NEW.billing_address_encrypted := encrypt_json(NEW.billing_address_snapshot);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_encrypt_order_addresses
    BEFORE INSERT OR UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION encrypt_order_addresses();

-- ======================================================================================
-- 5. VISTAS SEGURAS (Desencriptan automáticamente para usuarios autorizados)
-- ======================================================================================

-- 5.1 Vista: Direcciones con datos desencriptados
CREATE OR REPLACE VIEW v_user_addresses_decrypted AS
SELECT 
    id,
    user_id,
    address_type,
    full_name,
    -- Campos desencriptados
    COALESCE(decrypt_sensitive(street_address_encrypted), street_address) AS street_address,
    COALESCE(decrypt_sensitive(phone_encrypted), phone) AS phone,
    city,
    state,
    postal_code,
    country,
    is_default,
    created_at,
    updated_at,
    deleted_at
FROM user_addresses;

-- Solo app_role y admin_role pueden ver datos desencriptados
GRANT SELECT ON v_user_addresses_decrypted TO app_role;
GRANT SELECT ON v_user_addresses_decrypted TO admin_role;

-- 5.2 Vista: Pedidos con direcciones desencriptadas
CREATE OR REPLACE VIEW v_orders_decrypted AS
SELECT 
    o.*,
    COALESCE(
        decrypt_json(o.shipping_address_encrypted), 
        o.shipping_address_snapshot
    ) AS shipping_address_decrypted,
    COALESCE(
        decrypt_json(o.billing_address_encrypted), 
        o.billing_address_snapshot
    ) AS billing_address_decrypted
FROM orders o;

GRANT SELECT ON v_orders_decrypted TO app_role;
GRANT SELECT ON v_orders_decrypted TO admin_role;

-- ======================================================================================
-- 6. FUNCIÓN: Migrar datos existentes a encriptados
-- Uso: Solo ejecutar una vez después de configurar la clave
-- ======================================================================================

CREATE OR REPLACE FUNCTION migrate_to_encrypted()
RETURNS TABLE (
    table_name TEXT,
    rows_migrated BIGINT
) AS $$
DECLARE
    v_count BIGINT;
BEGIN
    -- Migrar user_payment_methods
    UPDATE user_payment_methods
    SET gateway_token_encrypted = encrypt_sensitive(gateway_token_id)
    WHERE gateway_token_encrypted IS NULL 
      AND gateway_token_id IS NOT NULL;
    GET DIAGNOSTICS v_count = ROW_COUNT;
    table_name := 'user_payment_methods';
    rows_migrated := v_count;
    RETURN NEXT;
    
    -- Migrar user_addresses
    UPDATE user_addresses
    SET 
        street_address_encrypted = encrypt_sensitive(street_address),
        phone_encrypted = CASE WHEN phone IS NOT NULL THEN encrypt_sensitive(phone) END
    WHERE street_address_encrypted IS NULL 
      AND street_address IS NOT NULL;
    GET DIAGNOSTICS v_count = ROW_COUNT;
    table_name := 'user_addresses';
    rows_migrated := v_count;
    RETURN NEXT;
    
    -- Migrar orders
    UPDATE orders
    SET 
        shipping_address_encrypted = encrypt_json(shipping_address_snapshot),
        billing_address_encrypted = CASE 
            WHEN billing_address_snapshot IS NOT NULL 
            THEN encrypt_json(billing_address_snapshot) 
        END
    WHERE shipping_address_encrypted IS NULL 
      AND shipping_address_snapshot IS NOT NULL;
    GET DIAGNOSTICS v_count = ROW_COUNT;
    table_name := 'orders';
    rows_migrated := v_count;
    RETURN NEXT;
END;
$$ LANGUAGE plpgsql;

-- ======================================================================================
-- 7. FUNCIÓN: Rotar clave de encriptación
-- Uso: Cuando se necesite cambiar la clave de encriptación
-- ======================================================================================

CREATE OR REPLACE FUNCTION rotate_encryption_key(p_new_key TEXT)
RETURNS TABLE (
    table_name TEXT,
    rows_rotated BIGINT
) AS $$
DECLARE
    v_count BIGINT;
    v_old_key TEXT;
BEGIN
    v_old_key := current_setting('app.encryption_key');
    
    -- Establecer nueva clave temporalmente para re-encriptar
    -- Nota: Este proceso debe hacerse en una transacción y con el sistema en mantenimiento
    
    -- Re-encriptar user_payment_methods
    UPDATE user_payment_methods
    SET gateway_token_encrypted = pgp_sym_encrypt(
        pgp_sym_decrypt(gateway_token_encrypted, v_old_key),
        p_new_key
    )
    WHERE gateway_token_encrypted IS NOT NULL;
    GET DIAGNOSTICS v_count = ROW_COUNT;
    table_name := 'user_payment_methods';
    rows_rotated := v_count;
    RETURN NEXT;
    
    -- Re-encriptar user_addresses
    UPDATE user_addresses
    SET 
        street_address_encrypted = pgp_sym_encrypt(
            pgp_sym_decrypt(street_address_encrypted, v_old_key),
            p_new_key
        ),
        phone_encrypted = CASE 
            WHEN phone_encrypted IS NOT NULL 
            THEN pgp_sym_encrypt(pgp_sym_decrypt(phone_encrypted, v_old_key), p_new_key)
        END
    WHERE street_address_encrypted IS NOT NULL;
    GET DIAGNOSTICS v_count = ROW_COUNT;
    table_name := 'user_addresses';
    rows_rotated := v_count;
    RETURN NEXT;
    
    -- Re-encriptar orders
    UPDATE orders
    SET 
        shipping_address_encrypted = pgp_sym_encrypt(
            pgp_sym_decrypt(shipping_address_encrypted, v_old_key),
            p_new_key
        ),
        billing_address_encrypted = CASE 
            WHEN billing_address_encrypted IS NOT NULL 
            THEN pgp_sym_encrypt(pgp_sym_decrypt(billing_address_encrypted, v_old_key), p_new_key)
        END
    WHERE shipping_address_encrypted IS NOT NULL;
    GET DIAGNOSTICS v_count = ROW_COUNT;
    table_name := 'orders';
    rows_rotated := v_count;
    RETURN NEXT;
    
    RAISE NOTICE 'Key rotation complete. Update app.encryption_key to the new key.';
END;
$$ LANGUAGE plpgsql;

-- ======================================================================================
-- 8. FUNCIÓN: Hash de contraseñas (para referencia, Laravel usa bcrypt)
-- ======================================================================================

-- Generar hash bcrypt (compatibilidad con Laravel)
CREATE OR REPLACE FUNCTION hash_password(p_password TEXT)
RETURNS TEXT AS $$
BEGIN
    -- Usar gen_salt con bf (blowfish/bcrypt) factor 10
    RETURN crypt(p_password, gen_salt('bf', 10));
END;
$$ LANGUAGE plpgsql;

-- Verificar contraseña contra hash
CREATE OR REPLACE FUNCTION verify_password(p_password TEXT, p_hash TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN crypt(p_password, p_hash) = p_hash;
END;
$$ LANGUAGE plpgsql;

-- ======================================================================================
-- 9. PERMISOS DE FUNCIONES DE ENCRIPTACIÓN
-- ======================================================================================

-- Solo app_role puede usar funciones de encriptación
GRANT EXECUTE ON FUNCTION encrypt_sensitive TO app_role;
GRANT EXECUTE ON FUNCTION decrypt_sensitive TO app_role;
GRANT EXECUTE ON FUNCTION encrypt_json TO app_role;
GRANT EXECUTE ON FUNCTION decrypt_json TO app_role;

-- Solo admin_role puede migrar y rotar claves
GRANT EXECUTE ON FUNCTION migrate_to_encrypted TO admin_role;
GRANT EXECUTE ON FUNCTION rotate_encryption_key TO admin_role;

-- ======================================================================================
-- NOTAS DE SEGURIDAD
-- ======================================================================================

/*
1. NUNCA almacenar la clave de encriptación en:
   - Código fuente
   - Base de datos
   - Logs
   - Control de versiones

2. Usar un gestor de secretos en producción:
   - AWS Secrets Manager
   - HashiCorp Vault
   - Docker Secrets

3. Rotar claves periódicamente (cada 6-12 meses)

4. Mantener backups de claves en lugar seguro y separado

5. Después de migrar a encriptado, considerar vaciar columnas originales:
   UPDATE user_addresses SET street_address = '[ENCRYPTED]', phone = '[ENCRYPTED]';
   UPDATE orders SET shipping_address_snapshot = '{"encrypted": true}';
*/

-- ======================================================================================
-- FIN DE 08_encryption.sql
-- Siguiente: 09_gdpr_procedures.sql
-- ======================================================================================
