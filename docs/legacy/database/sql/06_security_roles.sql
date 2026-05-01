-- ======================================================================================
-- ARCHIVO: 06_security_roles.sql
-- DESCRIPCIÓN: Roles de base de datos, permisos y configuración de seguridad
-- ORDEN DE EJECUCIÓN: 6 de 9
-- ======================================================================================

-- ======================================================================================
-- 1. CONFIGURACIÓN DE SEGURIDAD DEL SERVIDOR
-- ======================================================================================

-- Timeout para queries lentas (30 segundos)
ALTER DATABASE mikiwi SET statement_timeout = '30s';

-- Timeout para transacciones idle (60 segundos)
ALTER DATABASE mikiwi SET idle_in_transaction_session_timeout = '60s';

-- Límite de conexiones lentas en log
ALTER DATABASE mikiwi SET log_min_duration_statement = '1000';

-- Activar logging de conexiones
ALTER DATABASE mikiwi SET log_connections = 'on';
ALTER DATABASE mikiwi SET log_disconnections = 'on';

-- ======================================================================================
-- 2. ROL: app_role (Aplicación Backend - Laravel)
-- Permisos: SELECT, INSERT, UPDATE, DELETE
-- Uso: Conexión desde la aplicación web
-- ======================================================================================

DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'app_role') THEN
        CREATE ROLE app_role WITH 
            LOGIN 
            PASSWORD 'CHANGE_ME_IN_ENV'  -- Usar variable de entorno en producción
            NOSUPERUSER 
            NOCREATEDB 
            NOCREATEROLE 
            INHERIT 
            CONNECTION LIMIT 100;
    END IF;
END $$;

-- Permisos de conexión
GRANT CONNECT ON DATABASE mikiwi TO app_role;
GRANT USAGE ON SCHEMA public TO app_role;

-- Permisos CRUD en tablas
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app_role;
GRANT SELECT, UPDATE ON ALL SEQUENCES IN SCHEMA public TO app_role;

-- Permisos en vistas materializadas (solo lectura)
GRANT SELECT ON mv_admin_dashboard_stats TO app_role;
GRANT SELECT ON mv_bestselling_products TO app_role;
GRANT SELECT ON mv_monthly_sales_report TO app_role;
GRANT SELECT ON mv_category_products TO app_role;

-- Permisos por defecto para nuevas tablas
ALTER DEFAULT PRIVILEGES IN SCHEMA public 
    GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO app_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public 
    GRANT SELECT, UPDATE ON SEQUENCES TO app_role;

-- ======================================================================================
-- 3. ROL: readonly_role (Analytics/BI/Backups)
-- Permisos: Solo SELECT
-- Uso: Herramientas de BI, Metabase, Grafana, scripts de backup
-- ======================================================================================

DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'readonly_role') THEN
        CREATE ROLE readonly_role WITH 
            LOGIN 
            PASSWORD 'CHANGE_ME_IN_ENV'  -- Usar variable de entorno en producción
            NOSUPERUSER 
            NOCREATEDB 
            NOCREATEROLE 
            INHERIT 
            CONNECTION LIMIT 10;
    END IF;
END $$;

-- Permisos de conexión
GRANT CONNECT ON DATABASE mikiwi TO readonly_role;
GRANT USAGE ON SCHEMA public TO readonly_role;

-- Solo lectura en todas las tablas
GRANT SELECT ON ALL TABLES IN SCHEMA public TO readonly_role;

-- Permitir ver vistas materializadas
GRANT SELECT ON mv_admin_dashboard_stats TO readonly_role;
GRANT SELECT ON mv_bestselling_products TO readonly_role;
GRANT SELECT ON mv_monthly_sales_report TO readonly_role;
GRANT SELECT ON mv_category_products TO readonly_role;

-- Permisos por defecto para nuevas tablas
ALTER DEFAULT PRIVILEGES IN SCHEMA public 
    GRANT SELECT ON TABLES TO readonly_role;

-- ======================================================================================
-- 4. ROL: admin_role (Mantenimiento y DevOps)
-- Permisos: Todos excepto DROP DATABASE
-- Uso: Migraciones, mantenimiento, emergencias
-- ======================================================================================

DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'admin_role') THEN
        CREATE ROLE admin_role WITH 
            LOGIN 
            PASSWORD 'CHANGE_ME_IN_ENV'  -- Usar variable de entorno en producción
            NOSUPERUSER 
            CREATEDB 
            CREATEROLE 
            INHERIT 
            CONNECTION LIMIT 5;
    END IF;
END $$;

-- Permisos completos en la base de datos
GRANT CONNECT ON DATABASE mikiwi TO admin_role;
GRANT ALL PRIVILEGES ON SCHEMA public TO admin_role;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO admin_role;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO admin_role;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO admin_role;

-- Puede refrescar vistas materializadas
GRANT ALL ON mv_admin_dashboard_stats TO admin_role;
GRANT ALL ON mv_bestselling_products TO admin_role;
GRANT ALL ON mv_monthly_sales_report TO admin_role;
GRANT ALL ON mv_category_products TO admin_role;

-- Puede ejecutar VACUUM, ANALYZE
GRANT EXECUTE ON FUNCTION pg_catalog.pg_reload_conf() TO admin_role;

-- Permisos por defecto para nuevas tablas
ALTER DEFAULT PRIVILEGES IN SCHEMA public 
    GRANT ALL ON TABLES TO admin_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public 
    GRANT ALL ON SEQUENCES TO admin_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public 
    GRANT ALL ON FUNCTIONS TO admin_role;

-- ======================================================================================
-- 5. TABLA: Auditoría de Conexiones Fallidas
-- Uso: Detectar ataques de fuerza bruta
-- ======================================================================================

CREATE TABLE IF NOT EXISTS connection_audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_type VARCHAR(50) NOT NULL,  -- 'connection_success', 'connection_failed', 'authentication_failed'
    username VARCHAR(100),
    database_name VARCHAR(100),
    client_ip VARCHAR(45),
    client_port INTEGER,
    server_port INTEGER,
    application_name VARCHAR(255),
    ssl_used BOOLEAN,
    event_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    details JSONB
);

CREATE INDEX idx_connection_audit_time 
    ON connection_audit_log(event_time DESC);

CREATE INDEX idx_connection_audit_failures 
    ON connection_audit_log(client_ip, event_time DESC) 
    WHERE event_type LIKE '%failed%';

-- ======================================================================================
-- 6. FUNCIÓN: Registrar intento de conexión fallido
-- Uso: Trigger desde pg_audit o aplicación
-- ======================================================================================

CREATE OR REPLACE FUNCTION log_connection_attempt(
    p_event_type VARCHAR(50),
    p_username VARCHAR(100),
    p_client_ip VARCHAR(45),
    p_details JSONB DEFAULT NULL
)
RETURNS void AS $$
BEGIN
    INSERT INTO connection_audit_log (
        event_type, 
        username, 
        database_name, 
        client_ip, 
        details
    ) VALUES (
        p_event_type,
        p_username,
        current_database(),
        p_client_ip,
        p_details
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Permitir a app_role registrar intentos
GRANT EXECUTE ON FUNCTION log_connection_attempt TO app_role;

-- ======================================================================================
-- 7. FUNCIÓN: Detectar patrones sospechosos
-- Uso: Ejecutar periódicamente para alertas
-- ======================================================================================

CREATE OR REPLACE FUNCTION detect_suspicious_activity()
RETURNS TABLE (
    alert_type VARCHAR(100),
    ip_address VARCHAR(45),
    attempt_count BIGINT,
    first_attempt TIMESTAMP,
    last_attempt TIMESTAMP
) AS $$
BEGIN
    -- Múltiples intentos fallidos desde misma IP (últimos 15 minutos)
    RETURN QUERY
    SELECT 
        'Multiple failed logins from same IP'::VARCHAR(100) AS alert_type,
        cal.client_ip,
        COUNT(*) AS attempt_count,
        MIN(cal.event_time) AS first_attempt,
        MAX(cal.event_time) AS last_attempt
    FROM connection_audit_log cal
    WHERE cal.event_type LIKE '%failed%'
      AND cal.event_time > NOW() - INTERVAL '15 minutes'
    GROUP BY cal.client_ip
    HAVING COUNT(*) >= 5;
END;
$$ LANGUAGE plpgsql;

-- ======================================================================================
-- 8. VISTA: Resumen de actividad de conexiones
-- Uso: Dashboard de seguridad
-- ======================================================================================

CREATE OR REPLACE VIEW v_connection_activity_summary AS
SELECT 
    DATE_TRUNC('hour', event_time) AS hour,
    event_type,
    COUNT(*) AS event_count,
    COUNT(DISTINCT client_ip) AS unique_ips
FROM connection_audit_log
WHERE event_time > NOW() - INTERVAL '24 hours'
GROUP BY DATE_TRUNC('hour', event_time), event_type
ORDER BY hour DESC, event_type;

GRANT SELECT ON v_connection_activity_summary TO app_role;
GRANT SELECT ON v_connection_activity_summary TO admin_role;

-- ======================================================================================
-- 9. REVOCAR PERMISOS PELIGROSOS
-- ======================================================================================

-- Revocar acceso público por defecto
REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM PUBLIC;

-- Nunca usar rol postgres en aplicación
-- (Nota: esto es documentación, el rol postgres no se puede restringir desde SQL)

-- ======================================================================================
-- 10. NOTAS DE SEGURIDAD PARA PRODUCCIÓN
-- ======================================================================================

/*
IMPORTANTE - CONFIGURACIÓN SSL EN postgresql.conf:

ssl = on
ssl_cert_file = '/etc/ssl/certs/server.crt'
ssl_key_file = '/etc/ssl/private/server.key'
ssl_ca_file = '/etc/ssl/certs/ca.crt'

IMPORTANTE - CONFIGURACIÓN pg_hba.conf:

# Forzar SSL para conexiones remotas
hostssl mikiwi app_role 0.0.0.0/0 scram-sha-256
hostssl mikiwi readonly_role 0.0.0.0/0 scram-sha-256
hostssl mikiwi admin_role 10.0.0.0/8 scram-sha-256  # Solo red interna

# Denegar conexiones sin SSL
hostnossl all all 0.0.0.0/0 reject

IMPORTANTE - VARIABLES DE ENTORNO (.env):

DB_APP_PASSWORD=<password-seguro-aleatorio-32-chars>
DB_READONLY_PASSWORD=<password-seguro-aleatorio-32-chars>
DB_ADMIN_PASSWORD=<password-seguro-aleatorio-32-chars>
DB_ENCRYPTION_KEY=<clave-encriptación-32-chars>
*/

-- ======================================================================================
-- FIN DE 06_security_roles.sql
-- Siguiente: 07_partitions.sql
-- ======================================================================================
