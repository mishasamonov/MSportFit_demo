#!/usr/bin/env bash
# Шаблон запуску production-сервісу через systemd + nginx
set -e

SERVICE_NAME="msportfit-api"

echo "==> Запускаємо сервіс $SERVICE_NAME..."
sudo systemctl start "$SERVICE_NAME"
sudo systemctl enable "$SERVICE_NAME"

echo "==> Перевіряємо статус $SERVICE_NAME..."
sudo systemctl status "$SERVICE_NAME" --no-pager

echo "==> Перезавантажуємо nginx..."
sudo systemctl reload nginx

echo ""
echo "  Production-сервіс запущено."
echo "  Логи: sudo journalctl -u $SERVICE_NAME -f"
