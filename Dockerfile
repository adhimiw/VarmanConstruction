# Stage 1: Build React frontend
FROM node:22-alpine AS frontend-builder
WORKDIR /app
COPY frontend/package*.json ./
RUN npm ci --prefer-offline
COPY frontend/ ./
RUN npm run build

# Stage 2: Production runtime
FROM php:8.2-apache

RUN apt-get update && apt-get install -y --no-install-recommends \
    git unzip libsqlite3-dev libonig-dev libxml2-dev \
    curl \
    && docker-php-ext-install pdo pdo_sqlite mbstring bcmath xml \
    && a2enmod rewrite headers expires deflate \
    && rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Copy backend
COPY backend/ ./backend/

# Install backend dependencies
RUN composer install --working-dir=./backend \
    --no-dev --no-interaction --prefer-dist --optimize-autoloader

# Copy built frontend to public directory
COPY --from=frontend-builder /app/dist ./public/

# Apache configuration
COPY docker/apache.conf /etc/apache2/sites-enabled/000-default.conf

# Copy startup script
COPY docker/start.sh /usr/local/bin/start.sh
RUN chmod +x /usr/local/bin/start.sh

# Create runtime directories
RUN mkdir -p ./storage ./assets/uploads \
    ./backend/storage/framework/cache \
    ./backend/storage/framework/sessions \
    ./backend/storage/framework/views \
    ./backend/storage/logs \
    ./backend/bootstrap/cache

# Fix ownership (run as root during build, switch at runtime)
RUN chown -R www-data:www-data /var/www/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -fsS http://localhost/ || exit 1

CMD ["/usr/local/bin/start.sh"]
