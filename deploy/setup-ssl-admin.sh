#!/usr/bin/env bash
set -euo pipefail

APP_DIR="${APP_DIR:-/home/ubuntu/tagrobotech}"
ADMIN_DOMAIN="${ADMIN_DOMAIN:-admin.tagrobotech.com}"
CERTBOT_EMAIL="${CERTBOT_EMAIL:-admin@tagrobotech.com}"

echo "==> Installing certbot..."
sudo apt-get update -qq
sudo DEBIAN_FRONTEND=noninteractive apt-get install -y -qq certbot python3-certbot-nginx

echo "==> Updating nginx config..."
sudo cp "${APP_DIR}/deploy/nginx/tagrobotech.conf" /etc/nginx/sites-available/tagrobotech.conf
sudo ln -sf /etc/nginx/sites-available/tagrobotech.conf /etc/nginx/sites-enabled/tagrobotech.conf
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx

echo "==> Updating backend CORS for admin domain..."
ENV_FILE="${APP_DIR}/backend/.env"
if [ -f "$ENV_FILE" ]; then
  if ! grep -q "https://${ADMIN_DOMAIN}" "$ENV_FILE"; then
    sudo sed -i "s|^CORS_ORIGIN=\(.*\)|CORS_ORIGIN=\1,https://${ADMIN_DOMAIN},http://${ADMIN_DOMAIN}|" "$ENV_FILE"
  fi
  sudo systemctl restart tagrobotech-backend
fi

echo "==> Requesting SSL certificate for ${ADMIN_DOMAIN}..."
sudo certbot --nginx \
  -d "${ADMIN_DOMAIN}" \
  --non-interactive \
  --agree-tos \
  -m "${CERTBOT_EMAIL}" \
  --redirect

echo ""
echo "============================================"
echo " Admin SSL setup complete"
echo "============================================"
echo " Admin panel: https://${ADMIN_DOMAIN}/login"
echo ""
sudo certbot certificates 2>/dev/null | grep -A2 "${ADMIN_DOMAIN}" || true
