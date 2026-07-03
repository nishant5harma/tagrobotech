#!/usr/bin/env bash
set -euo pipefail

APP_DIR="${APP_DIR:-/home/ubuntu/tagrobotech}"
cd "$APP_DIR"

echo "==> Pulling latest code..."
git fetch origin main
git reset --hard origin/main

echo "==> Installing dependencies..."
cd "${APP_DIR}/backend"
npm ci --omit=dev 2>/dev/null || npm install --omit=dev

cd "${APP_DIR}/admin-panel"
npm ci 2>/dev/null || npm install

cd "${APP_DIR}/frontend"
npm ci 2>/dev/null || npm install

echo "==> Running database migrations..."
cd "${APP_DIR}/backend"
npm run db:migrate

echo "==> Building Next.js apps..."
cd "${APP_DIR}/admin-panel"
API_PROXY_URL=http://127.0.0.1:4000 npm run build

cd "${APP_DIR}/frontend"
API_PROXY_URL=http://127.0.0.1:4000 CMS_API_URL=http://127.0.0.1:4000 npm run build

echo "==> Restarting services..."
sudo systemctl restart tagrobotech-backend
sleep 2
sudo systemctl restart tagrobotech-frontend tagrobotech-admin

echo "==> Health check..."
curl -sf http://127.0.0.1:4000/api/health | head -c 200
echo ""
curl -sf -o /dev/null -w "frontend:%{http_code} admin:%{http_code}\n" \
  http://127.0.0.1:3000 http://127.0.0.1:3001/login

echo "Deploy update complete."
