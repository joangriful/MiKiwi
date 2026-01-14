#!/bin/sh
# =============================================================================
# MiKiwi - Script de Restauración de PostgreSQL
# Uso: ./restore.sh <archivo_backup>
# =============================================================================

set -e

BACKUP_FILE="$1"

if [ -z "$BACKUP_FILE" ]; then
    echo "Uso: $0 <ruta_archivo_backup>"
    echo ""
    echo "Backups disponibles:"
    echo ""
    echo "Diarios:"
    ls -lh /backups/daily/*.dump 2>/dev/null | head -10
    echo ""
    echo "Semanales:"
    ls -lh /backups/weekly/*.dump 2>/dev/null | head -5
    echo ""
    echo "Mensuales:"
    ls -lh /backups/monthly/*.dump 2>/dev/null | head -5
    exit 1
fi

if [ ! -f "$BACKUP_FILE" ]; then
    echo "ERROR: Archivo no encontrado: $BACKUP_FILE"
    exit 1
fi

echo "=============================================="
echo "MiKiwi - Restauración de Base de Datos"
echo "=============================================="
echo ""
echo "Archivo: $BACKUP_FILE"
echo "Tamaño: $(du -h "$BACKUP_FILE" | cut -f1)"
echo "Base de datos destino: $PGDATABASE"
echo ""
echo "¡ADVERTENCIA! Esto eliminará todos los datos actuales."
echo ""
read -p "¿Continuar? (escribe 'SI' para confirmar): " CONFIRM

if [ "$CONFIRM" != "SI" ]; then
    echo "Operación cancelada."
    exit 0
fi

echo ""
echo "[$(date)] Verificando integridad del backup..."

if ! pg_restore --list "$BACKUP_FILE" > /dev/null 2>&1; then
    echo "ERROR: El archivo de backup está corrupto o tiene formato inválido."
    exit 1
fi

echo "[$(date)] Backup válido. Iniciando restauración..."

# Terminar conexiones activas
echo "[$(date)] Terminando conexiones activas..."
psql -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '$PGDATABASE' AND pid <> pg_backend_pid();" || true

# Crear backup de seguridad antes de restaurar
echo "[$(date)] Creando backup de seguridad..."
SAFETY_BACKUP="/backups/pre_restore_$(date +%Y%m%d_%H%M%S).dump"
pg_dump --format=custom --compress=9 --file="$SAFETY_BACKUP" "$PGDATABASE" || true

# Restaurar
echo "[$(date)] Restaurando base de datos..."

pg_restore \
    --clean \
    --if-exists \
    --no-owner \
    --no-privileges \
    --verbose \
    --dbname="$PGDATABASE" \
    "$BACKUP_FILE"

echo ""
echo "[$(date)] Restauración completada exitosamente"
echo ""
echo "Backup de seguridad guardado en: $SAFETY_BACKUP"
echo ""
echo "Verificando tablas restauradas:"
psql -c "\dt+" | head -20

echo ""
echo "=============================================="
echo "Restauración finalizada"
echo "=============================================="
