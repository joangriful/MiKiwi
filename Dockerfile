FROM php:8.2-fpm-bookworm

ARG NODE_VERSION=20

ENV APP_ENV=production \
    APP_DEBUG=false \
    COMPOSER_ALLOW_SUPERUSER=1 \
    COMPOSER_MEMORY_LIMIT=-1

WORKDIR /var/www/html

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        ca-certificates \
        curl \
        gettext-base \
        git \
        libpq-dev \
        libzip-dev \
        nginx \
        unzip \
    && curl -fsSL "https://deb.nodesource.com/setup_${NODE_VERSION}.x" | bash - \
    && apt-get install -y --no-install-recommends nodejs \
    && docker-php-ext-install pdo_pgsql zip \
    && rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

COPY composer.json composer.lock package.json package-lock.json ./

RUN composer install --no-dev --no-interaction --prefer-dist --optimize-autoloader --no-scripts \
    && npm ci

COPY . .

RUN npm run build \
    && php artisan package:discover --ansi \
    && mkdir -p \
        bootstrap/cache \
        storage/framework/cache \
        storage/framework/sessions \
        storage/framework/testing \
        storage/framework/views \
        storage/logs \
    && chown -R www-data:www-data bootstrap/cache storage \
    && chmod -R ug+rwx bootstrap/cache storage

COPY docker/nginx/default.conf.template /etc/nginx/templates/default.conf.template
COPY docker/start.sh /usr/local/bin/start-container

RUN chmod +x /usr/local/bin/start-container \
    && rm -f /etc/nginx/sites-enabled/default /etc/nginx/conf.d/default.conf

EXPOSE 10000

CMD ["start-container"]
