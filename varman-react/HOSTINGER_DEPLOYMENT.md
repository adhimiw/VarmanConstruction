# 🚀 VARMAN CONSTRUCTIONS – Hostinger Deployment Guide

> **Domain:** `https://varmanconstructions.in`  
> **Stack:** React 19 SPA + Laravel 12 API + MySQL  
> **Hosting:** Hostinger Shared Hosting (Business+)  
> **Updated:** April 2026

---

## 1. Pre-Requisites

| Requirement          | Details                                     |
|----------------------|---------------------------------------------|
| Hostinger Plan       | Business+ (SSH access required)             |
| PHP Version          | 8.2+ (set in hPanel → Advanced → PHP Config) |
| Node.js (local)      | v20 LTS or later                            |
| Composer (server)     | Pre-installed on Hostinger                  |
| GitHub SSH key       | Added to your GitHub account                |

### Enable PHP Extensions (hPanel → Advanced → PHP Configuration → Extensions)
- `pdo_mysql`, `mbstring`, `bcmath`, `xml`, `curl`, `json`, `openssl`, `fileinfo`, `tokenizer`

---

## 2. SSH Configuration

```bash
ssh -p 65002 u244089748@145.79.210.59

# First time only - setup GitHub SSH keys
mkdir -p ~/.ssh
chmod 700 ~/.ssh
ssh-keyscan github.com >> ~/.ssh/known_hosts
chmod 600 ~/.ssh/known_hosts
ssh -T git@github.com || true
```

---

## 3. Directory Setup & Clone

```bash
cd ~/domains/varmanconstructions.in/
mkdir -p site
cd site

# Clone the project
git clone -b main git@github.com:adhimiw/VarmanConstruction.git .
```

---

## 4. Build Frontend (Local Machine)

```bash
cd frontend
npm install
npm run build
```

Upload the build output to the server's `backend/public/`:

```bash
scp -P 65002 -r dist/* u244089748@145.79.210.59:/home/u244089748/domains/varmanconstructions.in/site/backend/public/
```

---

## 5. Define Directory Paths

```bash
DOMAIN_ROOT=/home/u244089748/domains/varmanconstructions.in
SITE_DIR="$DOMAIN_ROOT/site"
BACKEND_DIR="$SITE_DIR/backend"
FRONTEND_DIR="$SITE_DIR/frontend"
PUBLIC_DIR="$BACKEND_DIR/public"
PUBLIC_HTML="$DOMAIN_ROOT/public_html"

echo "$DOMAIN_ROOT"
echo "$SITE_DIR"
echo "$BACKEND_DIR"
echo "$FRONTEND_DIR"
echo "$PUBLIC_DIR"
echo "$PUBLIC_HTML"
```

---

## 6. Symlink Deployment

```bash
cd "$DOMAIN_ROOT"

if [ -e "$PUBLIC_HTML" ] || [ -L "$PUBLIC_HTML" ]; then
  BACKUP_NAME="public_html_backup_$(date +%F_%H%M%S)"
  mv "$PUBLIC_HTML" "$BACKUP_NAME"
  echo "Old public_html backed up as: $BACKUP_NAME"
fi

ln -s "$PUBLIC_DIR" "$PUBLIC_HTML"
echo "Symlink created: public_html -> $PUBLIC_DIR"
```

---

## 7. Setup .htaccess

```bash
cat > "$PUBLIC_DIR/.htaccess" <<'HTA'
<IfModule mod_rewrite.c>
    DirectoryIndex index.html index.php

    <IfModule mod_negotiation.c>
        Options -MultiViews -Indexes
    </IfModule>

    RewriteEngine On

    # Handle Authorization Header
    RewriteCond %{HTTP:Authorization} .
    RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]

    # Serve existing files/folders directly
    RewriteCond %{REQUEST_FILENAME} -f [OR]
    RewriteCond %{REQUEST_FILENAME} -d
    RewriteRule ^ - [L]

    # Send API routes to Laravel
    RewriteCond %{REQUEST_URI} ^/api(/|$) [NC]
    RewriteRule ^ index.php [L]

    # Frontend SPA fallback
    RewriteRule ^ index.html [L]
</IfModule>

# Security headers
<IfModule mod_headers.c>
    Header set X-Frame-Options "SAMEORIGIN"
    Header set X-Content-Type-Options "nosniff"
    Header set X-XSS-Protection "1; mode=block"
    Header set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>

# Gzip compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/plain text/css application/json
    AddOutputFilterByType DEFLATE application/javascript text/javascript
</IfModule>

# Cache static assets
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 month"
    ExpiresByType image/jpeg "access plus 1 month"
    ExpiresByType image/webp "access plus 1 month"
    ExpiresByType image/svg+xml "access plus 1 month"
</IfModule>
HTA
```

---

## 8. Backend Environment (.env)

```bash
cd "$BACKEND_DIR"
nano .env
```

Paste the following:

```env
APP_NAME=VarmanConstructions
APP_ENV=production
APP_KEY=
APP_DEBUG=false
APP_URL=https://varmanconstructions.in

DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=u244089748_varman
DB_USERNAME=u244089748_varman
DB_PASSWORD='Varman@2026!DB#Secure91'

CACHE_STORE=file
SESSION_DRIVER=file
QUEUE_CONNECTION=sync

MAIL_MAILER=smtp
MAIL_HOST=smtp.hostinger.com
MAIL_PORT=465
MAIL_USERNAME=info@varmanconstructions.in
MAIL_PASSWORD=Manjupriya@2026
MAIL_SCHEME=smtps
MAIL_FROM_ADDRESS=info@varmanconstructions.in
MAIL_FROM_NAME="VARMAN CONSTRUCTIONS"

ADMIN_EMAIL=info@varmanconstructions.in

VITE_APP_NAME="${APP_NAME}"
```

---

## 9. Composer & Laravel Setup

```bash
cd "$BACKEND_DIR"

composer install --no-dev --optimize-autoloader --no-interaction

php artisan key:generate
php artisan migrate --force
php artisan db:seed --force
php artisan optimize:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache
chmod -R 775 storage bootstrap/cache
```

---

## 10. Create MySQL Database (hPanel)

Go to **hPanel → Databases → MySQL Databases**:

| Field        | Value                            |
|--------------|----------------------------------|
| DB Name      | `u244089748_varman`              |
| DB User      | `u244089748_varman`              |
| DB Password  | `Varman@2026!DB#Secure91`        |

Assign user to database with **ALL PRIVILEGES**.

---

## 11. Verify Deployment

```bash
# Test API health
curl https://varmanconstructions.in/api/health

# Test frontend
curl -I https://varmanconstructions.in/

# Test admin
curl -I https://varmanconstructions.in/admin/login
```

---

## Quick Re-Deploy Script

Save as `deploy.sh` and run locally:

```bash
#!/bin/bash
set -e

HOST="u244089748@145.79.210.59"
PORT=65002
DOMAIN_ROOT="/home/u244089748/domains/varmanconstructions.in"
SITE_DIR="$DOMAIN_ROOT/site"
BACKEND_DIR="$SITE_DIR/backend"

echo "🔨 Building React SPA..."
cd frontend && npm run build && cd ..

echo "📤 Uploading React build to backend/public..."
scp -P $PORT -r frontend/dist/* $HOST:$BACKEND_DIR/public/

echo "📤 Uploading Laravel backend..."
rsync -avz --delete \
  --exclude='vendor' --exclude='.env' --exclude='node_modules' \
  --exclude='storage/logs/*' --exclude='storage/framework/cache/*' \
  --exclude='storage/framework/sessions/*' --exclude='storage/framework/views/*' \
  backend/ $HOST:$BACKEND_DIR/ -e "ssh -p $PORT"

echo "🔧 Running post-deploy on server..."
ssh -p $PORT $HOST << 'REMOTE'
cd /home/u244089748/domains/varmanconstructions.in/site/backend
composer install --no-dev --optimize-autoloader --quiet
php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache
chmod -R 775 storage bootstrap/cache
echo "✅ Deploy complete!"
REMOTE
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| 500 error on `/api/*` | Check `storage/logs/laravel.log` |
| SPA routes return 404 | Verify `.htaccess` rewrite rules |
| Permission denied | `chmod -R 775 storage bootstrap/cache` |
| MySQL connection refused | Verify DB credentials in `.env` |
| CORS errors | Check `api.headers` middleware |
| CSS/JS not loading | Re-build frontend and re-upload dist |
| Mail not sending | Verify SMTP credentials and port 465 + smtps |
