#!/usr/bin/env bash
set -euo pipefail

APP_DIR="${APP_DIR:-/home/ubuntu/tagrobotech}"
PUBLIC_DOMAIN="${PUBLIC_DOMAIN:-tagrobotech.com}"
WWW_DOMAIN="${WWW_DOMAIN:-www.tagrobotech.com}"
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

echo "==> Requesting SSL certificate for ${PUBLIC_DOMAIN} and ${WWW_DOMAIN}..."
sudo certbot --nginx \
  -d "${PUBLIC_DOMAIN}" \
  -d "${WWW_DOMAIN}" \
  --non-interactive \
  --agree-tos \
  -m "${CERTBOT_EMAIL}" \
  --redirect

echo ""
echo "============================================"
echo " Public website SSL setup complete"
echo "============================================"
echo " Website: https://${PUBLIC_DOMAIN}/"
echo "          https://${WWW_DOMAIN}/"
echo ""
sudo certbot certificates 2>/dev/null | grep -A2 "${PUBLIC_DOMAIN}" || true
