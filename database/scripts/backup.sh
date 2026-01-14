#!/bin/sh
# =============================================================================
# MiKiwi - Script de Backup Automático para PostgreSQL
# Ejecutar: ./backup.sh [full|schema|data]
# =============================================================================

set -e

# Configuración
BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d_%H%M%S)
DAY_OF_WEEK=$(date +%u)  # 1=Lunes, 7=Domingo
DAY_OF_MONTH=$(date +%d)

# Crear directorios si no existen
mkdir -p "$BACKUP_DIR/daily"
mkdir -p "$BACKUP_DIR/weekly"
mkdir -p "$BACKUP_DIR/monthly"
mkdir -p "$BACKUP_DIR/schema"

# =============================================================================
# Función: Backup completo (pg_dump custom format)
# =============================================================================
backup_full() {
    echo "[$(date)] Iniciando backup completo..."
    
    BACKUP_FILE="$BACKUP_DIR/daily/full_${DATE}.dump"
    
    pg_dump \
        --format=custom \
        --compress=9 \
        --verbose \
        --file="$BACKUP_FILE" \
        "$PGDATABASE"
    
    # Verificar integridad
    if pg_restore --list "$BACKUP_FILE" > /dev/null 2>&1; then
        echo "[$(date)] Backup completo verificado: $BACKUP_FILE"
        echo "[$(date)] Tamaño: $(du -h "$BACKUP_FILE" | cut -f1)"
    else
        echo "[$(date)] ERROR: Backup corrupto, eliminando..."
        rm -f "$BACKUP_FILE"
        exit 1
    fi
    
    # Guardar copia semanal (domingos)
    if [ "$DAY_OF_WEEK" -eq 7 ]; then
        cp "$BACKUP_FILE" "$BACKUP_DIR/weekly/full_week_${DATE}.dump"
        echo "[$(date)] Copia semanal creada"
    fi
    
    # Guardar copia mensual (día 1)
    if [ "$DAY_OF_MONTH" -eq "01" ]; then
        cp "$BACKUP_FILE" "$BACKUP_DIR/monthly/full_month_${DATE}.dump"
        echo "[$(date)] Copia mensual creada"
    fi
}

# =============================================================================
# Función: Backup solo esquema (para versionado)
# =============================================================================
backup_schema() {
    echo "[$(date)] Iniciando backup de esquema..."
    
    SCHEMA_FILE="$BACKUP_DIR/schema/schema_${DATE}.sql"
    
    pg_dump \
        --schema-only \
        --no-owner \
        --no-privileges \
        --file="$SCHEMA_FILE" \
        "$PGDATABASE"
    
    # Comprimir
    gzip -f "$SCHEMA_FILE"
    
    echo "[$(date)] Backup de esquema completado: ${SCHEMA_FILE}.gz"
}

# =============================================================================
# Función: Backup solo datos
# =============================================================================
backup_data() {
    echo "[$(date)] Iniciando backup de datos..."
    
    DATA_FILE="$BACKUP_DIR/daily/data_${DATE}.dump"
    
    pg_dump \
        --data-only \
        --format=custom \
        --compress=9 \
        --file="$DATA_FILE" \
        "$PGDATABASE"
    
    echo "[$(date)] Backup de datos completado: $DATA_FILE"
}

# =============================================================================
# Función: Limpieza de backups antiguos (retención)
# =============================================================================
cleanup_old_backups() {
    echo "[$(date)] Limpiando backups antiguos..."
    
    # Diarios: retener últimos N días
    RETENTION_DAYS=${BACKUP_RETENTION_DAYS:-7}
    find "$BACKUP_DIR/daily" -name "*.dump" -mtime +$RETENTION_DAYS -delete
    find "$BACKUP_DIR/daily" -name "*.sql.gz" -mtime +$RETENTION_DAYS -delete
    echo "[$(date)] Backups diarios > $RETENTION_DAYS días eliminados"
    
    # Semanales: retener últimas N semanas
    RETENTION_WEEKS=${BACKUP_RETENTION_WEEKS:-4}
    RETENTION_DAYS_WEEKLY=$((RETENTION_WEEKS * 7))
    find "$BACKUP_DIR/weekly" -name "*.dump" -mtime +$RETENTION_DAYS_WEEKLY -delete
    echo "[$(date)] Backups semanales > $RETENTION_WEEKS semanas eliminados"
    
    # Mensuales: retener últimos N meses
    RETENTION_MONTHS=${BACKUP_RETENTION_MONTHS:-12}
    RETENTION_DAYS_MONTHLY=$((RETENTION_MONTHS * 30))
    find "$BACKUP_DIR/monthly" -name "*.dump" -mtime +$RETENTION_DAYS_MONTHLY -delete
    echo "[$(date)] Backups mensuales > $RETENTION_MONTHS meses eliminados"
    
    # Esquemas: retener últimos 30
    ls -tp "$BACKUP_DIR/schema/"*.sql.gz 2>/dev/null | tail -n +31 | xargs -r rm --
    echo "[$(date)] Esquemas antiguos limpiados"
}

# =============================================================================
# Función: Mostrar estadísticas de backups
# =============================================================================
show_stats() {
    echo "=============================================="
    echo "Estadísticas de Backups - MiKiwi"
    echo "=============================================="
    echo ""
    echo "Backups Diarios:"
    ls -lh "$BACKUP_DIR/daily/" 2>/dev/null | tail -5
    echo ""
    echo "Backups Semanales:"
    ls -lh "$BACKUP_DIR/weekly/" 2>/dev/null | tail -5
    echo ""
    echo "Backups Mensuales:"
    ls -lh "$BACKUP_DIR/monthly/" 2>/dev/null | tail -5
    echo ""
    echo "Espacio total usado:"
    du -sh "$BACKUP_DIR"
    echo "=============================================="
}

# =============================================================================
# Main
# =============================================================================
case "${1:-full}" in
    full)
        backup_full
        backup_schema
        cleanup_old_backups
        ;;
    schema)
        backup_schema
        ;;
    data)
        backup_data
        ;;
    cleanup)
        cleanup_old_backups
        ;;
    stats)
        show_stats
        ;;
    *)
        echo "Uso: $0 [full|schema|data|cleanup|stats]"
        exit 1
        ;;
esac

echo "[$(date)] Proceso completado exitosamente"
