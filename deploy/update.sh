#!/usr/bin/env bash
set -euo pipefail

APP_DIR="${APP_DIR:-/home/ubuntu/tagrobotech}"
export NODE_OPTIONS="${NODE_OPTIONS:---max-old-space-size=1536}"
export NEXT_TELEMETRY_DISABLED=1

ensure_swap() {
  if swapon --show | grep -q '/swapfile'; then
    return 0
  fi
  if [ ! -f /swapfile ]; then
    echo "==> Creating 2G swap (one-time, helps Next.js builds)..."
    sudo fallocate -l 2G /swapfile || sudo dd if=/dev/zero of=/swapfile bs=1M count=2048
    sudo chmod 600 /swapfile
    sudo mkswap /swapfile
    sudo swapon /swapfile
    if ! grep -q '/swapfile' /etc/fstab; then
      echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
    fi
  else
    sudo swapon /swapfile 2>/dev/null || true
  fi
}

cd "$APP_DIR"

echo "==> Pulling latest code..."
git fetch origin main
git reset --hard origin/main

ensure_swap

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

echo "==> Ensuring backend is up for CMS fetches during build..."
sudo systemctl restart tagrobotech-backend || true
sleep 3
for i in 1 2 3 4 5; do
  if curl -sf http://127.0.0.1:4000/api/health >/dev/null; then
    break
  fi
  sleep 2
done

echo "==> Building admin panel..."
cd "${APP_DIR}/admin-panel"
API_PROXY_URL=http://127.0.0.1:4000 npm run build

echo "==> Building frontend..."
cd "${APP_DIR}/frontend"
API_PROXY_URL=http://127.0.0.1:4000 CMS_API_URL=http://127.0.0.1:4000 npm run build

echo "==> Restarting services..."
sudo systemctl restart tagrobotech-backend
sleep 2
sudo systemctl restart tagrobotech-frontend tagrobotech-admin

echo "==> Health check..."
sleep 5
curl -sf http://127.0.0.1:4000/api/health | head -c 200 || echo "backend health check failed"
echo ""
curl -sf -o /dev/null -w "frontend:%{http_code} admin:%{http_code}\n" \
  http://127.0.0.1:3000 http://127.0.0.1:3001/login || true

echo "Deploy update complete."
