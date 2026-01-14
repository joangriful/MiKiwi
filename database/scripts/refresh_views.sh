#!/bin/sh
# =============================================================================
# MiKiwi - Refresh de Vistas Materializadas
# =============================================================================

set -e

echo "[$(date)] Refrescando vistas materializadas..."

# Dashboard admin (cada 5 minutos desde cron)
psql -c "REFRESH MATERIALIZED VIEW CONCURRENTLY mv_admin_dashboard_stats;" 2>/dev/null && \
    echo "[$(date)] mv_admin_dashboard_stats actualizada" || \
    echo "[$(date)] ERROR: mv_admin_dashboard_stats"

# Bestsellers (cada hora)
if [ "$(date +%M)" = "00" ]; then
    psql -c "REFRESH MATERIALIZED VIEW CONCURRENTLY mv_bestselling_products;" 2>/dev/null && \
        echo "[$(date)] mv_bestselling_products actualizada" || \
        echo "[$(date)] ERROR: mv_bestselling_products"
    
    psql -c "REFRESH MATERIALIZED VIEW CONCURRENTLY mv_category_products;" 2>/dev/null && \
        echo "[$(date)] mv_category_products actualizada" || \
        echo "[$(date)] ERROR: mv_category_products"
fi

# Ventas mensuales (una vez al día a las 00:05)
if [ "$(date +%H:%M)" = "00:05" ]; then
    psql -c "REFRESH MATERIALIZED VIEW CONCURRENTLY mv_monthly_sales_report;" 2>/dev/null && \
        echo "[$(date)] mv_monthly_sales_report actualizada" || \
        echo "[$(date)] ERROR: mv_monthly_sales_report"
fi

echo "[$(date)] Refresh completado"
