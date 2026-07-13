#!/usr/bin/env bash
set -euo pipefail

APP_DIR="/home/ubuntu/tagrobotech"
PUBLIC_HOST="${PUBLIC_HOST:-13.234.29.101}"
DB_NAME="cms_tagrobotech"
DB_USER="cms"
DB_PASS="${DB_PASS:-$(openssl rand -base64 24 | tr -d '/+=' | head -c 24)}"
JWT_SECRET="${JWT_SECRET:-$(openssl rand -base64 48 | tr -d '/+=')}"

echo "==> Installing system packages..."
sudo apt-get update -qq
sudo DEBIAN_FRONTEND=noninteractive apt-get install -y -qq curl nginx mysql-server build-essential

if ! command -v node >/dev/null 2>&1 || [[ "$(node -v | cut -d. -f1 | tr -d v)" -lt 20 ]]; then
  echo "==> Installing Node.js 20..."
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo DEBIAN_FRONTEND=noninteractive apt-get install -y -qq nodejs
fi

echo "==> Node $(node -v), npm $(npm -v)"

echo "==> Configuring MySQL..."
sudo systemctl enable mysql
sudo systemctl start mysql

sudo mysql <<EOF
CREATE DATABASE IF NOT EXISTS ${DB_NAME} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS '${DB_USER}'@'localhost' IDENTIFIED BY '${DB_PASS}';
ALTER USER '${DB_USER}'@'localhost' IDENTIFIED BY '${DB_PASS}';
GRANT ALL PRIVILEGES ON ${DB_NAME}.* TO '${DB_USER}'@'localhost';
FLUSH PRIVILEGES;
EOF

RESEND_API_KEY="${RESEND_API_KEY:-}"
RESEND_FROM_EMAIL="${RESEND_FROM_EMAIL:-Tag RoBo Tech <onboarding@resend.dev>}"
LEADS_NOTIFY_EMAIL="${LEADS_NOTIFY_EMAIL:-nishantsharma.meta@gmail.com}"
SEED_SAMPLE_DATA="${SEED_SAMPLE_DATA:-false}"

# Preserve existing production env if already installed
if [ -f "${APP_DIR}/backend/.env" ]; then
  echo "==> Existing backend/.env found — keeping credentials and backing up DB first"
  if [ -f "${APP_DIR}/deploy/backup-db.sh" ]; then
    # shellcheck disable=SC1091
    source "${APP_DIR}/deploy/backup-db.sh"
    backup_database "$APP_DIR"
  fi
else
  cat > "${APP_DIR}/backend/.env" <<EOF
PORT=4000
DATABASE_URL=mysql://${DB_USER}:${DB_PASS}@127.0.0.1:3306/${DB_NAME}
JWT_SECRET=${JWT_SECRET}
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://${PUBLIC_HOST},http://${PUBLIC_HOST}:8080,http://tagrobotech.com,http://www.tagrobotech.com,https://tagrobotech.com,https://www.tagrobotech.com,http://admin.tagrobotech.com,https://admin.tagrobotech.com
PUBLIC_ASSET_URL=https://tagrobotech.com
RESEND_API_KEY=${RESEND_API_KEY}
RESEND_FROM_EMAIL=${RESEND_FROM_EMAIL}
LEADS_NOTIFY_EMAIL=${LEADS_NOTIFY_EMAIL}
EOF
fi

if [ ! -f "${APP_DIR}/admin-panel/.env.local" ]; then
  cat > "${APP_DIR}/admin-panel/.env.local" <<EOF
API_PROXY_URL=http://127.0.0.1:4000
NEXT_PUBLIC_API_URL=
EOF
fi

if [ ! -f "${APP_DIR}/frontend/.env.local" ]; then
  cat > "${APP_DIR}/frontend/.env.local" <<EOF
API_PROXY_URL=http://127.0.0.1:4000
NEXT_PUBLIC_CMS_API_URL=
CMS_API_URL=http://127.0.0.1:4000
EOF
fi

echo "==> Installing npm dependencies..."
cd "${APP_DIR}/backend" && npm ci --omit=dev 2>/dev/null || npm install --omit=dev
cd "${APP_DIR}/admin-panel" && npm ci 2>/dev/null || npm install
cd "${APP_DIR}/frontend" && npm ci 2>/dev/null || npm install

echo "==> Running database migrations..."
cd "${APP_DIR}/backend"
npm run db:migrate
npm run db:ensure-admin

if [ "${SEED_SAMPLE_DATA}" = "true" ]; then
  if [ -f "${APP_DIR}/deploy/backup-db.sh" ]; then
    # shellcheck disable=SC1091
    source "${APP_DIR}/deploy/backup-db.sh"
    if cms_has_existing_pages "$APP_DIR"; then
      echo "==> Skipping sample seed: existing pages already present"
    else
      echo "==> Seeding sample CMS data (empty database)..."
      npm run db:seed
    fi
  else
    echo "==> Seeding sample CMS data..."
    npm run db:seed
  fi
else
  echo "==> Skipping sample seed (SEED_SAMPLE_DATA=${SEED_SAMPLE_DATA})"
fi

echo "==> Building Next.js apps (this may take a few minutes)..."
cd "${APP_DIR}/admin-panel"
API_PROXY_URL=http://127.0.0.1:4000 npm run build

cd "${APP_DIR}/frontend"
API_PROXY_URL=http://127.0.0.1:4000 CMS_API_URL=http://127.0.0.1:4000 npm run build

mkdir -p "${APP_DIR}/backend/uploads"
chmod 755 "${APP_DIR}/backend/uploads"

echo "==> Installing systemd services..."
sudo cp "${APP_DIR}/deploy/systemd/tagrobotech-backend.service" /etc/systemd/system/
sudo cp "${APP_DIR}/deploy/systemd/tagrobotech-frontend.service" /etc/systemd/system/
sudo cp "${APP_DIR}/deploy/systemd/tagrobotech-admin.service" /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable tagrobotech-backend tagrobotech-frontend tagrobotech-admin

echo "==> Configuring nginx..."
sudo cp "${APP_DIR}/deploy/nginx/tagrobotech.conf" /etc/nginx/sites-available/tagrobotech.conf
sudo ln -sf /etc/nginx/sites-available/tagrobotech.conf /etc/nginx/sites-enabled/tagrobotech.conf
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl enable nginx
sudo systemctl restart nginx

echo "==> Starting application services..."
sudo systemctl restart tagrobotech-backend
sleep 2
sudo systemctl restart tagrobotech-frontend
sudo systemctl restart tagrobotech-admin

echo ""
echo "============================================"
echo " Deployment complete"
echo "============================================"
echo " Website:  http://${PUBLIC_HOST}/"
echo " Admin:    https://admin.tagrobotech.com/login"
echo "           (run deploy/setup-ssl-admin.sh after DNS points to this server)"
echo " API:      http://${PUBLIC_HOST}/api/health"
echo ""
echo " Admin login: admin@tagrobotech.com / Admin@123456"
echo " DB user: ${DB_USER}"
echo " DB pass: ${DB_PASS}"
echo " JWT secret saved in ${APP_DIR}/backend/.env"
echo ""
sudo systemctl --no-pager status tagrobotech-backend tagrobotech-frontend tagrobotech-admin nginx mysql | head -40
