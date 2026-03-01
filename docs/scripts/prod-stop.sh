#!/usr/bin/env bash
# Шаблон зупинки production-сервісу через systemd
set -e

SERVICE_NAME="msportfit-api"

echo "==> Зупиняємо сервіс $SERVICE_NAME..."
sudo systemctl stop "$SERVICE_NAME"

echo "==> Перевіряємо статус $SERVICE_NAME..."
sudo systemctl status "$SERVICE_NAME" --no-pager || true

echo ""
echo "  Сервіс $SERVICE_NAME зупинено."
