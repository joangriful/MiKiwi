#!/usr/bin/env bash

set -euo pipefail

: "${PORT:=10000}"

required_vars=(
  APP_KEY
  APP_URL
  DB_CONNECTION
  DB_HOST
  DB_PORT
  DB_DATABASE
  DB_USERNAME
  DB_PASSWORD
)

for var_name in "${required_vars[@]}"; do
  if [ -z "${!var_name:-}" ]; then
    echo "Missing required environment variable: ${var_name}" >&2
    exit 1
  fi
done

if [ "${DB_CONNECTION}" != "pgsql" ]; then
  echo "DB_CONNECTION must be pgsql for the Render + Supabase deployment." >&2
  exit 1
fi

export APP_ENV="${APP_ENV:-production}"
export APP_DEBUG="${APP_DEBUG:-false}"
export DB_SSLMODE="${DB_SSLMODE:-require}"
export PORT

mkdir -p \
  /run/php \
  /var/lib/nginx/tmp/client_body \
  /var/log/nginx \
  bootstrap/cache \
  storage/framework/cache \
  storage/framework/sessions \
  storage/framework/testing \
  storage/framework/views \
  storage/logs

chown -R www-data:www-data /run/php /var/lib/nginx /var/log/nginx bootstrap/cache storage

ln -sf /dev/stdout /var/log/nginx/access.log
ln -sf /dev/stderr /var/log/nginx/error.log

envsubst '${PORT}' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf

php artisan optimize:clear
php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache

php-fpm -D

exec nginx -g 'daemon off;'
