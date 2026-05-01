# 🚀 VARMAN CONSTRUCTIONS - Hostinger Deployment Guide

**Domain:** `https://varmanconstructions.in`

This guide explains how to set up the entire project — backend, frontend, database, and mail — securely and efficiently.

---

## 1. Prerequisites

- Hostinger shared hosting with **PHP 8.2+** and **Composer** available
- **SSH access** enabled
- GitHub SSH key authentication configured
- **Node.js 18+** (LTS) installed on your local machine
- Domain `varmanconstructions.in` connected to Hostinger

---

## 2. SSH Configuration (One‑Time Setup)

```bash
mkdir -p ~/.ssh
chmod 700 ~/.ssh
ssh-keyscan github.com >> ~/.ssh/known_hosts
chmod 600 ~/.ssh/known_hosts

# Test GitHub SSH access
ssh -T git@github.com || true
```

---

## 3. Clone the Repository

SSH into Hostinger:
```bash
ssh -p 65002 u244089748@145.79.210.59
```

Create the `site/` directory and clone into it:
```bash
cd ~/domains/varmanconstructions.in
mkdir -p site
cd site
git clone -b main --single-branch git@github.com:adhimiw/VarmanConstruction.git .
```

---

## 4. Build Frontend (Local Machine)

On your **local machine**:
```bash
git clone -b main git@github.com:adhimiw/VarmanConstruction
cd VarmanConstruction/frontend
npm install
npm run build
```

Upload the build output into the server's `backend/public/`:
```bash
scp -P 65002 -r dist/* u244089748@145.79.210.59:/home/u244089748/domains/varmanconstructions.in/site/backend/public/
```

---

## 5. Define Directory Paths

Run these on the server to set up path variables:
```bash
DOMAIN_ROOT=/home/u244089748/domains/varmanconstructions.in
SITE_DIR="$DOMAIN_ROOT/site"
BACKEND_DIR="$SITE_DIR/backend"
FRONTEND_DIR="$SITE_DIR/frontend"
PUBLIC_DIR="$BACKEND_DIR/public"
PUBLIC_HTML="$DOMAIN_ROOT/public_html"

echo "DOMAIN_ROOT: $DOMAIN_ROOT"
echo "SITE_DIR:    $SITE_DIR"
echo "BACKEND_DIR: $BACKEND_DIR"
echo "FRONTEND_DIR:$FRONTEND_DIR"
echo "PUBLIC_DIR:  $PUBLIC_DIR"
echo "PUBLIC_HTML: $PUBLIC_HTML"
```

---

## 6. Symlink `public_html` → `backend/public`

Replace `public_html` with a symlink pointing to the Laravel `public/` directory:
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

Create the `.htaccess` in `backend/public/`:
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

    # Handle X-XSRF-Token Header
    RewriteCond %{HTTP:x-xsrf-token} .
    RewriteRule .* - [E=HTTP_X_XSRF_TOKEN:%{HTTP:X-XSRF-Token}]

    # Serve existing files/folders directly
    RewriteCond %{REQUEST_FILENAME} -f [OR]
    RewriteCond %{REQUEST_FILENAME} -d
    RewriteRule ^ - [L]

    # Send backend routes to Laravel (fixed to match all API paths)
    RewriteCond %{REQUEST_URI} ^/(api|sanctum|storage) [NC]
    RewriteRule ^ index.php [L]

    # Frontend SPA fallback
    RewriteRule ^ index.html [L]
</IfModule>
HTA
```

---

## 8. Backend Environment Configuration

```bash
cd "$BACKEND_DIR"
cp .env.example .env
nano .env
```

Paste the following (update credentials as needed):
```env
APP_NAME="VARMAN CONSTRUCTIONS"
APP_ENV=production
APP_KEY=
APP_DEBUG=false
APP_URL=https://varmanconstructions.in

APP_LOCALE=en
APP_FALLBACK_LOCALE=en
APP_FAKER_LOCALE=en_US

LOG_CHANNEL=stack
LOG_STACK=single
LOG_LEVEL=error

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=your_hostinger_db_name
DB_USERNAME=your_hostinger_db_user
DB_PASSWORD=your_hostinger_db_password
CACHE_STORE=file
SESSION_DRIVER=file
SESSION_LIFETIME=120

MAIL_MAILER=smtp
MAIL_HOST=smtp.hostinger.com
MAIL_PORT=465
MAIL_USERNAME=info@varmanconstructions.in
MAIL_PASSWORD=your-email-password
MAIL_ENCRYPTION=ssl
MAIL_FROM_ADDRESS="info@varmanconstructions.in"
MAIL_FROM_NAME="VARMAN CONSTRUCTIONS"

ADMIN_EMAIL=info@varmanconstructions.in
ADMIN_WHATSAPP=919944508736
```

**Auto‑generate APP_KEY and JWT_SECRET:**
```bash
cd "$BACKEND_DIR"

# Generate Laravel APP_KEY (writes to .env automatically)
php artisan key:generate

# Generate a secure JWT_SECRET and append to .env
JWT_SECRET=$(php -r "echo bin2hex(random_bytes(32));")
echo "" >> .env
echo "JWT_SECRET=${JWT_SECRET}" >> .env
echo "✅ JWT_SECRET generated: ${JWT_SECRET}"

# Set production admin password
echo "ADMIN_DEFAULT_PASS=your-secure-password-here" >> .env
echo "✅ Remember to change ADMIN_DEFAULT_PASS above!"
```

---

## 9. Composer Install & Laravel Setup

```bash
cd "$BACKEND_DIR"

# Install PHP dependencies
composer install --no-dev --optimize-autoloader --no-interaction

# Run migrations (This will create tables in your MySQL database)
php artisan migrate --force

# Seed default data (products, FAQs, admin user)
php artisan db:seed --class=VarmanSeeder --force

# Cache for production performance
php artisan optimize:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Set permissions
chmod -R 775 storage bootstrap/cache
chmod 600 .env
```

---

## 10. Copy Static Assets

Ensure frontend images/assets are in the public directory:
```bash
# Copy public assets (logos, product images, etc.)
cp -r "$FRONTEND_DIR/public/assets/"* "$PUBLIC_DIR/assets/"

# Ensure uploads folder exists
mkdir -p "$PUBLIC_DIR/assets/uploads"
chmod 755 "$PUBLIC_DIR/assets/uploads"
```

---

## 11. Finalization & Test

| What | URL |
|------|-----|
| Website (public) | `https://varmanconstructions.in` |
| Admin login | `https://varmanconstructions.in/admin/login` |
| Admin dashboard | `https://varmanconstructions.in/admin` |
| API health check | `https://varmanconstructions.in/api/health` |
| API products | `https://varmanconstructions.in/api/products` |


**Default admin login:**
- **Username:** `admin`
- **Password:** whatever you set in `ADMIN_DEFAULT_PASS` (default: `Varman@Admin2026!`)

> ⚠️ Change the default password immediately after first login.

```bash
echo "✅ Deployment completed!"
echo "👉 https://varmanconstructions.in"
```

---

## 🔒 Security & Feature Notes

- `.env` has `chmod 600` — only the owner can read it
- `APP_KEY` auto-generated via `php artisan key:generate`
- `JWT_SECRET` auto-generated via `random_bytes(32)` — never uses dev default in production
- **IP Geolocation:** The backend natively supports tracking IP geolocations via `ip-api.com`. It correctly checks `CF-Connecting-IP` (if you use Cloudflare via Hostinger) and `X-Real-IP` (Hostinger's Nginx Proxy) to ensure it grabs the real user IP, not the proxy server's IP.
- Admin API routes protected by JWT token middleware (`RequireAdminToken`)
- CORS headers set via `ApiHeaders` middleware

---

## 🔄 Updating the Site

```bash
# SSH into server
ssh -p 65002 u244089748@145.79.210.59

# Pull latest code
cd ~/domains/varmanconstructions.in/site
git pull origin main

# Update backend
cd backend
composer install --no-dev --optimize-autoloader --no-interaction
php artisan migrate --force
php artisan optimize:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Copy assets
cp -r ../frontend/public/assets/* public/assets/

echo "✅ Backend updated!"
```

For frontend changes, rebuild locally then upload:
```bash
# Local machine
cd frontend
npm run build
scp -P 65002 -r dist/* u244089748@145.79.210.59:/home/u244089748/domains/varmanconstructions.in/site/backend/public/
```

---

## 📋 API Endpoints Reference

### Public
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/products` | List all products |
| GET | `/api/products/{id}` | Get single product |
| GET | `/api/faqs` | List FAQs |
| POST | `/api/contact` | Submit contact form |
| POST | `/api/quote` | Submit quote request |
| GET | `/api/site-content` | Get site content |
| POST | `/api/analytics/track` | Track analytics event |

### Admin (requires JWT token in `Authorization: Bearer <token>` header)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin/login` | Login, returns JWT token |
| POST | `/api/admin/change-password` | Change admin password |
| GET | `/api/admin/verify` | Verify token validity |
| GET/POST/PUT/DELETE | `/api/admin/products` | CRUD products |
| GET/POST/PUT/DELETE | `/api/admin/faqs` | CRUD FAQs |
| GET/PUT/DELETE | `/api/admin/contacts` | Manage contacts |
| GET/PUT/DELETE | `/api/admin/quotes` | Manage quotes |
| POST | `/api/admin/upload` | Upload image |
| DELETE | `/api/admin/upload/{filename}` | Delete image |
| GET | `/api/admin/images` | List uploaded images |

### Admin CMS Analytics & Tracking
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/cms/dashboard` | Dashboard stats, visitor trends, geo-data |
| GET | `/api/admin/cms/visitors` | List tracked IP visitors |
| GET | `/api/admin/cms/visitors/{id}`| Detail view of visitor & page views |
| GET/POST/PUT/DELETE | `/api/admin/cms/leads` | Manage CRM leads |
| GET | `/api/admin/cms/activity-logs` | User action tracking log |
| GET | `/api/admin/cms/security-logs`| Failed login attempts log |
| GET/POST | `/api/admin/cms/components` | Manage dynamic UI content blocks |
| GET/POST | `/api/admin/cms/settings` | Global SEO and site settings |

---

## 🧰 Quick Deploy Script

Save as `~/deploy-varman.sh` on the server:
```bash
#!/bin/bash
set -e

DOMAIN_ROOT=/home/u244089748/domains/varmanconstructions.in
SITE_DIR="$DOMAIN_ROOT/site"
BACKEND_DIR="$SITE_DIR/backend"
FRONTEND_DIR="$SITE_DIR/frontend"

echo "=== Pulling latest code ==="
cd "$SITE_DIR"
git pull origin main

echo "=== Updating backend ==="
cd "$BACKEND_DIR"
composer install --no-dev --optimize-autoloader --no-interaction
php artisan migrate --force
php artisan optimize:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "=== Copying assets ==="
cp -r "$FRONTEND_DIR/public/assets/"* "$BACKEND_DIR/public/assets/"

echo ""
echo "=== ✅ Server updated! ==="
echo "To update frontend, run locally:"
echo "  cd frontend && npm run build"
echo "  scp -P 65002 -r dist/* u244089748@145.79.210.59:$BACKEND_DIR/public/"
```

Make it executable:
```bash
chmod +x ~/deploy-varman.sh
```

Run updates with:
```bash
~/deploy-varman.sh
```
