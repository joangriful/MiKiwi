-- ======================================================================================
-- ARCHIVO: 07_partitions.sql
-- DESCRIPCIÓN: Particionamiento de tablas para performance y retención
-- ORDEN DE EJECUCIÓN: 7 de 9
-- ======================================================================================

-- ======================================================================================
-- 1. TABLA: audit_logs (Particionada por mes)
-- Uso: Registro de cambios en tablas principales
-- Retención: 12 meses, después se archivan/eliminan
-- ======================================================================================

CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID DEFAULT uuid_generate_v4(),
    user_id UUID,
    table_name VARCHAR(50) NOT NULL,
    record_id UUID NOT NULL,
    action VARCHAR(20) NOT NULL CHECK (action IN ('create', 'update', 'delete')),
    old_values JSONB,
    new_values JSONB,
    changed_fields TEXT[],
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id, created_at)
) PARTITION BY RANGE (created_at);

-- Particiones mensuales para 2025
CREATE TABLE IF NOT EXISTS audit_logs_y2025m01 PARTITION OF audit_logs
    FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');
CREATE TABLE IF NOT EXISTS audit_logs_y2025m02 PARTITION OF audit_logs
    FOR VALUES FROM ('2025-02-01') TO ('2025-03-01');
CREATE TABLE IF NOT EXISTS audit_logs_y2025m03 PARTITION OF audit_logs
    FOR VALUES FROM ('2025-03-01') TO ('2025-04-01');
CREATE TABLE IF NOT EXISTS audit_logs_y2025m04 PARTITION OF audit_logs
    FOR VALUES FROM ('2025-04-01') TO ('2025-05-01');
CREATE TABLE IF NOT EXISTS audit_logs_y2025m05 PARTITION OF audit_logs
    FOR VALUES FROM ('2025-05-01') TO ('2025-06-01');
CREATE TABLE IF NOT EXISTS audit_logs_y2025m06 PARTITION OF audit_logs
    FOR VALUES FROM ('2025-06-01') TO ('2025-07-01');
CREATE TABLE IF NOT EXISTS audit_logs_y2025m07 PARTITION OF audit_logs
    FOR VALUES FROM ('2025-07-01') TO ('2025-08-01');
CREATE TABLE IF NOT EXISTS audit_logs_y2025m08 PARTITION OF audit_logs
    FOR VALUES FROM ('2025-08-01') TO ('2025-09-01');
CREATE TABLE IF NOT EXISTS audit_logs_y2025m09 PARTITION OF audit_logs
    FOR VALUES FROM ('2025-09-01') TO ('2025-10-01');
CREATE TABLE IF NOT EXISTS audit_logs_y2025m10 PARTITION OF audit_logs
    FOR VALUES FROM ('2025-10-01') TO ('2025-11-01');
CREATE TABLE IF NOT EXISTS audit_logs_y2025m11 PARTITION OF audit_logs
    FOR VALUES FROM ('2025-11-01') TO ('2025-12-01');
CREATE TABLE IF NOT EXISTS audit_logs_y2025m12 PARTITION OF audit_logs
    FOR VALUES FROM ('2025-12-01') TO ('2026-01-01');

-- Particiones mensuales para 2026
CREATE TABLE IF NOT EXISTS audit_logs_y2026m01 PARTITION OF audit_logs
    FOR VALUES FROM ('2026-01-01') TO ('2026-02-01');
CREATE TABLE IF NOT EXISTS audit_logs_y2026m02 PARTITION OF audit_logs
    FOR VALUES FROM ('2026-02-01') TO ('2026-03-01');
CREATE TABLE IF NOT EXISTS audit_logs_y2026m03 PARTITION OF audit_logs
    FOR VALUES FROM ('2026-03-01') TO ('2026-04-01');
CREATE TABLE IF NOT EXISTS audit_logs_y2026m04 PARTITION OF audit_logs
    FOR VALUES FROM ('2026-04-01') TO ('2026-05-01');
CREATE TABLE IF NOT EXISTS audit_logs_y2026m05 PARTITION OF audit_logs
    FOR VALUES FROM ('2026-05-01') TO ('2026-06-01');
CREATE TABLE IF NOT EXISTS audit_logs_y2026m06 PARTITION OF audit_logs
    FOR VALUES FROM ('2026-06-01') TO ('2026-07-01');
CREATE TABLE IF NOT EXISTS audit_logs_y2026m07 PARTITION OF audit_logs
    FOR VALUES FROM ('2026-07-01') TO ('2026-08-01');
CREATE TABLE IF NOT EXISTS audit_logs_y2026m08 PARTITION OF audit_logs
    FOR VALUES FROM ('2026-08-01') TO ('2026-09-01');
CREATE TABLE IF NOT EXISTS audit_logs_y2026m09 PARTITION OF audit_logs
    FOR VALUES FROM ('2026-09-01') TO ('2026-10-01');
CREATE TABLE IF NOT EXISTS audit_logs_y2026m10 PARTITION OF audit_logs
    FOR VALUES FROM ('2026-10-01') TO ('2026-11-01');
CREATE TABLE IF NOT EXISTS audit_logs_y2026m11 PARTITION OF audit_logs
    FOR VALUES FROM ('2026-11-01') TO ('2026-12-01');
CREATE TABLE IF NOT EXISTS audit_logs_y2026m12 PARTITION OF audit_logs
    FOR VALUES FROM ('2026-12-01') TO ('2027-01-01');

-- Partición default para fechas fuera de rango
CREATE TABLE IF NOT EXISTS audit_logs_default PARTITION OF audit_logs DEFAULT;

-- Índices en tabla particionada
CREATE INDEX idx_audit_logs_table_action 
    ON audit_logs(table_name, action, created_at DESC);

CREATE INDEX idx_audit_logs_user 
    ON audit_logs(user_id, created_at DESC) 
    WHERE user_id IS NOT NULL;

CREATE INDEX idx_audit_logs_record 
    ON audit_logs(table_name, record_id, created_at DESC);

-- ======================================================================================
-- 2. FUNCIÓN: Crear partición mensual automáticamente
-- Uso: Ejecutar mensualmente vía cron para crear particiones futuras
-- ======================================================================================

CREATE OR REPLACE FUNCTION create_monthly_partition(
    p_table_name TEXT,
    p_year INTEGER,
    p_month INTEGER
)
RETURNS TEXT AS $$
DECLARE
    v_partition_name TEXT;
    v_start_date DATE;
    v_end_date DATE;
BEGIN
    v_partition_name := p_table_name || '_y' || p_year || 'm' || LPAD(p_month::TEXT, 2, '0');
    v_start_date := make_date(p_year, p_month, 1);
    v_end_date := v_start_date + INTERVAL '1 month';
    
    -- Verificar si ya existe
    IF EXISTS (
        SELECT 1 FROM pg_tables 
        WHERE tablename = v_partition_name
    ) THEN
        RETURN 'Partition ' || v_partition_name || ' already exists';
    END IF;
    
    -- Crear partición
    EXECUTE format(
        'CREATE TABLE IF NOT EXISTS %I PARTITION OF %I FOR VALUES FROM (%L) TO (%L)',
        v_partition_name,
        p_table_name,
        v_start_date,
        v_end_date
    );
    
    RETURN 'Created partition: ' || v_partition_name;
END;
$$ LANGUAGE plpgsql;

-- ======================================================================================
-- 3. FUNCIÓN: Crear particiones para los próximos N meses
-- Uso: SELECT create_future_partitions('audit_logs', 12);
-- ======================================================================================

CREATE OR REPLACE FUNCTION create_future_partitions(
    p_table_name TEXT,
    p_months_ahead INTEGER DEFAULT 12
)
RETURNS TABLE (result TEXT) AS $$
DECLARE
    v_date DATE;
    v_year INTEGER;
    v_month INTEGER;
    i INTEGER;
BEGIN
    FOR i IN 0..p_months_ahead LOOP
        v_date := CURRENT_DATE + (i || ' months')::INTERVAL;
        v_year := EXTRACT(YEAR FROM v_date);
        v_month := EXTRACT(MONTH FROM v_date);
        
        result := create_monthly_partition(p_table_name, v_year, v_month);
        RETURN NEXT;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- ======================================================================================
-- 4. FUNCIÓN: Eliminar particiones antiguas (retención)
-- Uso: SELECT drop_old_partitions('audit_logs', 12);
-- ======================================================================================

CREATE OR REPLACE FUNCTION drop_old_partitions(
    p_table_name TEXT,
    p_retain_months INTEGER DEFAULT 12
)
RETURNS TABLE (dropped_partition TEXT) AS $$
DECLARE
    v_cutoff_date DATE;
    v_partition RECORD;
BEGIN
    v_cutoff_date := CURRENT_DATE - (p_retain_months || ' months')::INTERVAL;
    
    FOR v_partition IN
        SELECT 
            inhrelid::regclass::TEXT AS partition_name,
            pg_get_expr(relpartbound, inhrelid) AS bounds
        FROM pg_inherits
        JOIN pg_class ON pg_class.oid = inhrelid
        WHERE inhparent = p_table_name::regclass
          AND relkind = 'r'
          AND relname != p_table_name || '_default'
    LOOP
        -- Extraer fecha de inicio del partition bounds
        -- Nota: esto es simplificado, en producción verificar el formato
        IF v_partition.bounds ~ 'TO \(''' || v_cutoff_date::TEXT THEN
            EXECUTE 'DROP TABLE IF EXISTS ' || v_partition.partition_name;
            dropped_partition := v_partition.partition_name;
            RETURN NEXT;
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- ======================================================================================
-- 5. FUNCIÓN: Archivar particiones antes de eliminar
-- Uso: SELECT archive_and_drop_partition('audit_logs_y2024m01', '/backups/archive/');
-- ======================================================================================

CREATE OR REPLACE FUNCTION archive_partition_info(p_partition_name TEXT)
RETURNS TABLE (
    partition_name TEXT,
    row_count BIGINT,
    size_bytes BIGINT,
    size_human TEXT,
    min_date TIMESTAMP,
    max_date TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY EXECUTE format(
        'SELECT 
            %L::TEXT,
            COUNT(*)::BIGINT,
            pg_relation_size(%L)::BIGINT,
            pg_size_pretty(pg_relation_size(%L)),
            MIN(created_at),
            MAX(created_at)
        FROM %I',
        p_partition_name,
        p_partition_name,
        p_partition_name,
        p_partition_name
    );
END;
$$ LANGUAGE plpgsql;

-- ======================================================================================
-- 6. VISTA: Estado de particiones
-- Uso: SELECT * FROM v_partition_status;
-- ======================================================================================

CREATE OR REPLACE VIEW v_partition_status AS
SELECT 
    parent.relname AS parent_table,
    child.relname AS partition_name,
    pg_size_pretty(pg_relation_size(child.oid)) AS size,
    pg_get_expr(child.relpartbound, child.oid) AS partition_bounds,
    (SELECT COUNT(*) FROM pg_stat_user_tables WHERE relname = child.relname) > 0 AS has_stats
FROM pg_inherits
JOIN pg_class parent ON parent.oid = pg_inherits.inhparent
JOIN pg_class child ON child.oid = pg_inherits.inhrelid
WHERE parent.relname IN ('audit_logs', 'error_logs')
ORDER BY parent.relname, child.relname;

GRANT SELECT ON v_partition_status TO admin_role;
GRANT SELECT ON v_partition_status TO readonly_role;

-- ======================================================================================
-- 7. NOTAS PARA CRON DE MANTENIMIENTO
-- ======================================================================================

/*
Agregar al crontab del servidor:

# Crear particiones futuras el día 1 de cada mes
0 1 1 * * psql -U mikiwi_admin -d mikiwi -c "SELECT create_future_partitions('audit_logs', 3);"
0 1 1 * * psql -U mikiwi_admin -d mikiwi -c "SELECT create_future_partitions('error_logs', 3);"

# Archivar y eliminar particiones antiguas (>12 meses) el día 15 de cada mes
0 2 15 * * psql -U mikiwi_admin -d mikiwi -c "SELECT drop_old_partitions('audit_logs', 12);"
0 2 15 * * psql -U mikiwi_admin -d mikiwi -c "SELECT drop_old_partitions('error_logs', 6);"

# VACUUM y ANALYZE en particiones recientes
0 3 * * 0 psql -U mikiwi_admin -d mikiwi -c "VACUUM ANALYZE audit_logs;"
0 3 * * 0 psql -U mikiwi_admin -d mikiwi -c "VACUUM ANALYZE error_logs;"
*/

-- ======================================================================================
-- FIN DE 07_partitions.sql
-- Siguiente: 08_encryption.sql
-- ======================================================================================
