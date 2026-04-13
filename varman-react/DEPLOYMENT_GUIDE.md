# 🚀 VARMAN CONSTRUCTIONS — Hostinger Deployment Guide

**Domain (Test):** `https://gray-hamster-669595.hostingersite.com`  
**Domain (Production):** `https://varmanconstructions.in`  
**Stack:** React 19 + Laravel 12 + MySQL + Hostinger Shared Hosting

---

## 📋 Table of Contents

1. [Pre-Requisites](#1-pre-requisites)
2. [SSH Configuration](#2-ssh-configuration)
3. [Directory Setup & Clone](#3-directory-setup--clone)
4. [Create MySQL Database](#4-create-mysql-database)
5. [Build Frontend (Local Machine)](#5-build-frontend-local-machine)
6. [Upload Frontend Build to Server](#6-upload-frontend-build-to-server)
7. [Define Directory Paths](#7-define-directory-paths)
8. [Symlink Deployment](#8-symlink-deployment)
9. [Setup .htaccess](#9-setup-htaccess)
10. [Backend Environment (.env)](#10-backend-environment-env)
11. [Composer & Laravel Setup](#11-composer--laravel-setup)
12. [Create Admin User](#12-create-admin-user)
13. [File Permissions](#13-file-permissions)
14. [Verify Deployment](#14-verify-deployment)
15. [Quick Re-Deploy Script](#15-quick-re-deploy-script)
16. [Troubleshooting](#16-troubleshooting)

---

## 1. Pre-Requisites

| Requirement          | Details                                     |
|----------------------|---------------------------------------------|
| Hostinger Plan       | Business+ (SSH access required)             |
| PHP Version          | 8.2+ (set in hPanel → Advanced → PHP Config) |
| Node.js (local)      | v20 LTS or later                            |
| Composer (server)     | Pre-installed on Hostinger                  |
| GitHub SSH key       | Added to your GitHub account                |

### Enable Required PHP Extensions (hPanel)
Go to **hPanel → Advanced → PHP Configuration → Extensions** and enable:
- `pdo_mysql`
- `mbstring`
- `bcmath`
- `xml`
- `curl`
- `json`
- `openssl`
- `fileinfo`
- `tokenizer`

---

## 2. SSH Configuration

```bash
# Connect to Hostinger via SSH
ssh -p 65002 u244089748@145.79.210.59

# Setup SSH keys for GitHub (first time only)
mkdir -p ~/.ssh
chmod 700 ~/.ssh
ssh-keyscan github.com >> ~/.ssh/known_hosts
chmod 600 ~/.ssh/known_hosts

# Test GitHub connectivity
ssh -T git@github.com || true
```

---

## 3. Directory Setup & Clone

```bash
# Navigate to domain root
cd ~/domains/gray-hamster-669595.hostingersite.com/

# Create project directory
mkdir -p site
cd site

# Clone repository (use your branch name)
git clone -b main git@github.com:zdatatechnologies/varman-constructions.git .

# If repo already exists, just pull latest
# git pull origin main
```

---

## 4. Create MySQL Database

**Via hPanel → Databases → MySQL Databases:**

| Field        | Value (Test)                          |
|--------------|---------------------------------------|
| DB Name      | `u244089748_varman`                   |
| DB User      | `u244089748_varman`                   |
| DB Password  | *(set a strong password)*             |

> **Note:** Hostinger auto-prepends `u244089748_` to database and user names.

---

## 5. Build Frontend (Local Machine)

```bash
# On your local machine
cd varman-react/frontend

# Install dependencies
npm install

# Build for production
npm run build

# This creates dist/ folder with:
# dist/index.html
# dist/assets/  (JS, CSS bundles)
```

---

## 6. Upload Frontend Build to Server

```bash
# From your local machine, upload dist/ contents to server's backend/public/
scp -P 65002 -r dist/* u244089748@145.79.210.59:/home/u244089748/domains/gray-hamster-669595.hostingersite.com/site/backend/public/
```

**What this does:** Places the React SPA (`index.html` + assets) inside Laravel's `public/` directory so both the frontend and API are served from the same domain.

---

## 7. Define Directory Paths

Run these on the **server** (via SSH) to set up reusable variables for the rest of the guide:

```bash
# ===== SET THESE VARIABLES =====
DOMAIN_ROOT=/home/u244089748/domains/gray-hamster-669595.hostingersite.com
SITE_DIR="$DOMAIN_ROOT/site"
BACKEND_DIR="$SITE_DIR/backend"
FRONTEND_DIR="$SITE_DIR/varman-react/frontend"
PUBLIC_DIR="$BACKEND_DIR/public"
PUBLIC_HTML="$DOMAIN_ROOT/public_html"
ASSETS_DIR="$SITE_DIR/assets"

# Verify paths
echo "Domain Root : $DOMAIN_ROOT"
echo "Site Dir    : $SITE_DIR"
echo "Backend Dir : $BACKEND_DIR"
echo "Public Dir  : $PUBLIC_DIR"
echo "Public HTML : $PUBLIC_HTML"
```

---

## 8. Symlink Deployment

Replace the default `public_html` with a symlink to Laravel's `public/` directory:

```bash
cd "$DOMAIN_ROOT"

# Backup existing public_html
if [ -e "$PUBLIC_HTML" ] || [ -L "$PUBLIC_HTML" ]; then
  BACKUP_NAME="public_html_backup_$(date +%F_%H%M%S)"
  mv "$PUBLIC_HTML" "$BACKUP_NAME"
  echo "✅ Old public_html backed up as: $BACKUP_NAME"
fi

# Create symlink
ln -s "$PUBLIC_DIR" "$PUBLIC_HTML"
echo "✅ Symlink created: public_html -> $PUBLIC_DIR"

# Also create assets directory and symlink for uploads
mkdir -p "$ASSETS_DIR/uploads"
ln -s "$ASSETS_DIR" "$PUBLIC_DIR/assets" 2>/dev/null || true
echo "✅ Assets symlink created"
```

---

## 9. Setup .htaccess

```bash
cat > "$PUBLIC_DIR/.htaccess" <<'HTA'
<IfModule mod_rewrite.c>
    DirectoryIndex index.html index.php

    <IfModule mod_negotiation.c>
        Options -MultiViews -Indexes
    </IfModule>

    RewriteEngine On

    # Handle Authorization Header (JWT tokens)
    RewriteCond %{HTTP:Authorization} .
    RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]

    # Serve existing files/folders directly
    RewriteCond %{REQUEST_FILENAME} -f [OR]
    RewriteCond %{REQUEST_FILENAME} -d
    RewriteRule ^ - [L]

    # Send API & backend routes to Laravel index.php
    RewriteCond %{REQUEST_URI} ^/api(/|$) [NC]
    RewriteRule ^ index.php [L]

    # Frontend SPA fallback — everything else to index.html
    RewriteRule ^ index.html [L]
</IfModule>

# Security Headers
<IfModule mod_headers.c>
    Header set X-Content-Type-Options "nosniff"
    Header set X-Frame-Options "SAMEORIGIN"
    Header set X-XSS-Protection "1; mode=block"
    Header set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>

# Gzip Compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/plain text/css
    AddOutputFilterByType DEFLATE application/javascript application/json
    AddOutputFilterByType DEFLATE image/svg+xml
</IfModule>

# Cache static assets
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/webp "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType application/javascript "access plus 1 month"
    ExpiresByType font/woff2 "access plus 1 year"
</IfModule>
HTA

echo "✅ .htaccess created"
```

---

## 10. Backend Environment (.env)

```bash
cd "$BACKEND_DIR"

cat > .env <<'ENV'
APP_NAME="Varman Constructions"
APP_ENV=production
APP_KEY=
APP_DEBUG=false
APP_URL=https://gray-hamster-669595.hostingersite.com
APP_TIMEZONE=Asia/Kolkata
APP_LOCALE=en

LOG_CHANNEL=stack
LOG_STACK=single
LOG_LEVEL=error

# ===== DATABASE (MySQL) =====
DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=u244089748_varman
DB_USERNAME=u244089748_varman
DB_PASSWORD=YOUR_DB_PASSWORD_HERE

# ===== CACHE & SESSION =====
CACHE_STORE=database
SESSION_DRIVER=database
SESSION_LIFETIME=120
QUEUE_CONNECTION=database

# ===== MAIL (Hostinger SMTP) =====
MAIL_MAILER=smtp
MAIL_HOST=smtp.hostinger.com
MAIL_PORT=465
MAIL_USERNAME=testing@adhithanr.space
MAIL_PASSWORD=testpoDa@12
MAIL_ENCRYPTION=ssl
MAIL_FROM_ADDRESS="testing@adhithanr.space"
MAIL_FROM_NAME="Varman Constructions"

# ===== CUSTOM CONFIG (varman.php) =====
JWT_SECRET=CHANGE_THIS_TO_A_STRONG_64_CHAR_RANDOM_STRING
ADMIN_DEFAULT_USER=admin
ADMIN_DEFAULT_PASS=YOUR_SECURE_ADMIN_PASSWORD
ADMIN_EMAIL=testing@adhithanr.space
ADMIN_WHATSAPP=917708484811

# ===== SMTP (used by VarmanApiSupport directly) =====
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_USER=testing@adhithanr.space
SMTP_PASS=testpoDa@12
SMTP_FROM=testing@adhithanr.space
SMTP_SECURE=ssl

# ===== GEOIP (optional — free fallback to ip-api.com) =====
GEOIP_API_KEY=

# ===== FRONTEND URL =====
FRONTEND_URL=https://gray-hamster-669595.hostingersite.com
ENV

echo "✅ .env file created"
echo ""
echo "⚠️  IMPORTANT: Edit .env and set:"
echo "    1. DB_PASSWORD (your actual database password)"
echo "    2. JWT_SECRET (run: openssl rand -base64 48)"
echo "    3. Mail credentials if different"
```

### Generate JWT Secret

```bash
# Generate a strong JWT secret
JWT=$(openssl rand -base64 48)
echo "Generated JWT_SECRET: $JWT"

# Replace in .env
sed -i "s|JWT_SECRET=CHANGE_THIS_TO_A_STRONG_64_CHAR_RANDOM_STRING|JWT_SECRET=$JWT|" .env
```

---

## 11. Composer & Laravel Setup

```bash
cd "$BACKEND_DIR"

# Install PHP dependencies (production only)
composer install --no-dev --optimize-autoloader --no-interaction

# Generate application key
php artisan key:generate --force

# Run database migrations
php artisan migrate --force

# Seed default data (products, FAQs, admin user)
php artisan db:seed --class=VarmanSeeder --force

# Clear and cache config for production
php artisan optimize:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "✅ Laravel setup complete"
```

---

## 12. Create Admin User

```bash
cd "$BACKEND_DIR"

# Create admin user (uses custom artisan command)
php artisan make:admin --username=admin --password='YOUR_SECURE_PASSWORD' --role=admin

echo "✅ Admin user created"
echo "   Login at: https://gray-hamster-669595.hostingersite.com/admin"
echo "   Username: admin"
echo "   Password: YOUR_SECURE_PASSWORD"
```

---

## 13. File Permissions

```bash
cd "$BACKEND_DIR"

# Storage and cache must be writable
chmod -R 775 storage
chmod -R 775 bootstrap/cache

# Create storage directories if missing
mkdir -p storage/app/public
mkdir -p storage/framework/{cache,sessions,views}
mkdir -p storage/logs

# Uploads directory
mkdir -p "$ASSETS_DIR/uploads"
chmod -R 775 "$ASSETS_DIR/uploads"

echo "✅ Permissions set"
```

---

## 14. Verify Deployment

```bash
# Test API health
curl -s "https://gray-hamster-669595.hostingersite.com/api/health"
# Expected: {"status":"ok","timestamp":"..."}

# Test products endpoint
curl -s "https://gray-hamster-669595.hostingersite.com/api/products" | head -c 200
# Expected: {"products":[...]}

# Test admin login
curl -s -X POST "https://gray-hamster-669595.hostingersite.com/api/admin/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"YOUR_SECURE_PASSWORD"}'
# Expected: {"token":"eyJ..."}

# Test frontend loads
curl -s "https://gray-hamster-669595.hostingersite.com/" | head -5
# Expected: <!DOCTYPE html> ...

echo ""
echo "✅ All checks passed!"
echo ""
echo "🌐 Frontend: https://gray-hamster-669595.hostingersite.com/"
echo "🔑 Admin:    https://gray-hamster-669595.hostingersite.com/admin"
echo "📡 API:      https://gray-hamster-669595.hostingersite.com/api/health"
```

---

## 15. Quick Re-Deploy Script

Save this as `~/redeploy.sh` on the server for future updates:

```bash
#!/bin/bash
set -e

DOMAIN_ROOT=/home/u244089748/domains/gray-hamster-669595.hostingersite.com
SITE_DIR="$DOMAIN_ROOT/site"
BACKEND_DIR="$SITE_DIR/backend"

echo "🔄 Pulling latest code..."
cd "$SITE_DIR"
git pull origin main

echo "📦 Installing dependencies..."
cd "$BACKEND_DIR"
composer install --no-dev --optimize-autoloader --no-interaction

echo "🗃️ Running migrations..."
php artisan migrate --force

echo "🧹 Clearing caches..."
php artisan optimize:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "🔑 Setting permissions..."
chmod -R 775 storage bootstrap/cache

echo ""
echo "✅ Re-deploy complete!"
echo ""
echo "⚠️  NOTE: If frontend changed, rebuild locally and re-upload dist/:"
echo "    cd varman-react/frontend && npm run build"
echo "    scp -P 65002 -r dist/* u244089748@145.79.210.59:$BACKEND_DIR/public/"
```

Make it executable:
```bash
chmod +x ~/redeploy.sh
```

---

## 16. Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| **500 Internal Server Error** | Check `storage/logs/laravel.log` — likely missing .env or permissions |
| **API returns HTML** | .htaccess rewrite rules not working — check `mod_rewrite` is enabled |
| **Admin login fails** | Run `php artisan make:admin` again — check JWT_SECRET is set |
| **CORS errors** | API and frontend are on same domain — CORS shouldn't apply |
| **Mail not sending** | Verify SMTP credentials in .env — check port 465 + ssl |
| **Images not loading** | Check assets symlink: `ls -la $PUBLIC_DIR/assets` |
| **"Class not found" errors** | Run `composer dump-autoload -o` |
| **Database connection refused** | Verify DB credentials in hPanel — host should be `localhost` |
| **Frontend routes 404** | .htaccess SPA fallback missing — re-run Step 9 |
| **Blank page** | Check browser console — likely build issue. Rebuild frontend |

### Debug Commands

```bash
cd "$BACKEND_DIR"

# Check Laravel logs
tail -50 storage/logs/laravel.log

# Test database connection
php artisan tinker --execute="DB::connection()->getPdo(); echo 'DB OK';"

# Test mail
php artisan tinker --execute="Mail::raw('Test', function(\$m) { \$m->to('your@email.com')->subject('Test'); }); echo 'Sent';"

# Check routes are cached
php artisan route:list --compact

# Clear everything and start fresh
php artisan optimize:clear
```

### Switch to Production Domain

When ready to move from test domain to `varmanconstructions.in`:

1. Update `.env`:
   ```
   APP_URL=https://varmanconstructions.in
   FRONTEND_URL=https://varmanconstructions.in
   ```
2. Update mail credentials to production email
3. Update DB credentials if using different database
4. Re-cache: `php artisan config:cache`
5. Update DNS records in Hostinger hPanel

---

## 📂 Project Structure on Server

```
~/domains/gray-hamster-669595.hostingersite.com/
├── public_html -> site/backend/public/     ← Symlink
└── site/                                    ← Git repo root
    ├── assets/
    │   └── uploads/                         ← User uploads
    ├── backend/                             ← Laravel 12
    │   ├── app/
    │   ├── config/
    │   ├── database/
    │   ├── public/                          ← Web root
    │   │   ├── index.php                    ← Laravel entry
    │   │   ├── index.html                   ← React SPA
    │   │   ├── assets/                      ← Vite build output
    │   │   └── .htaccess                    ← Routing rules
    │   ├── routes/
    │   ├── storage/
    │   ├── vendor/
    │   ├── .env                             ← Environment config
    │   └── composer.json
    └── varman-react/
        └── frontend/                        ← React source (not deployed)
```

---

**Last Updated:** April 2026
