#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="/var/www/html"
BACKEND_DIR="$ROOT_DIR/backend"

# Ensure runtime directories exist
mkdir -p "$ROOT_DIR/storage" "$ROOT_DIR/assets/uploads"
mkdir -p "$BACKEND_DIR/storage/framework/cache" \
         "$BACKEND_DIR/storage/framework/sessions" \
         "$BACKEND_DIR/storage/framework/views" \
         "$BACKEND_DIR/storage/logs" \
         "$BACKEND_DIR/bootstrap/cache"

# Ensure SQLite database file exists and is writable
touch "$BACKEND_DIR/database/database.sqlite"

# Set proper ownership for runtime directories and database
chown -R www-data:www-data "$ROOT_DIR/storage" \
    "$ROOT_DIR/assets/uploads" \
    "$BACKEND_DIR/storage" \
    "$BACKEND_DIR/bootstrap/cache" \
    "$BACKEND_DIR/database"

# Ensure .env exists
if [ ! -f "$BACKEND_DIR/.env" ] && [ -f "$BACKEND_DIR/.env.example" ]; then
    cp "$BACKEND_DIR/.env.example" "$BACKEND_DIR/.env"
fi

cd "$BACKEND_DIR"

# Generate app key if missing
if ! grep -Eq '^APP_KEY=base64:' .env; then
    php artisan key:generate --force --ansi
fi

# Run migrations and seed
php artisan migrate --seed --force --ansi

cd "$ROOT_DIR"

# Run Apache as non-root (drop privileges)
exec apache2-foreground
