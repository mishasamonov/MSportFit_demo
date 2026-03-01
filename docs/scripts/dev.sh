#!/usr/bin/env bash
# Скрипт для запуску середовища розробки (Linux/macOS)
set -e

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
SERVER_DIR="$ROOT_DIR/server"
CLIENT_DIR="$ROOT_DIR/client"

echo "==> Піднімаємо Docker Compose (PostgreSQL)..."
docker compose -f "$ROOT_DIR/docker-compose.yml" up -d

echo "==> Встановлюємо залежності server..."
npm install --prefix "$SERVER_DIR"

echo "==> Встановлюємо залежності client..."
npm install --prefix "$CLIENT_DIR"

# Перевірка наявності server/.env
if [ ! -f "$SERVER_DIR/.env" ]; then
  echo "  [!] Файл server/.env не знайдено — копіюємо з server/env.example"
  cp "$SERVER_DIR/env.example" "$SERVER_DIR/.env"
  echo "  [!] УВАГА: замініть JWT_SECRET у server/.env на власне секретне значення!"
fi

echo "==> Генеруємо Prisma Client..."
npm run --prefix "$SERVER_DIR" prisma:generate 2>/dev/null || \
  npx --prefix "$SERVER_DIR" prisma generate --schema="$SERVER_DIR/prisma/schema.prisma"

echo "==> Застосовуємо міграції Prisma..."
npm run --prefix "$SERVER_DIR" prisma:migrate 2>/dev/null || \
  npx --prefix "$SERVER_DIR" prisma migrate dev --schema="$SERVER_DIR/prisma/schema.prisma"

echo "==> Запускаємо server (npm run dev) у фоні..."
npm run dev --prefix "$SERVER_DIR" &
SERVER_PID=$!

echo "==> Запускаємо client (npm run dev) у фоні..."
npm run dev --prefix "$CLIENT_DIR" &
CLIENT_PID=$!

echo ""
echo "  Server PID: $SERVER_PID"
echo "  Client PID: $CLIENT_PID"
echo ""
echo "  Натисніть Ctrl+C щоб зупинити обидва процеси."

# Зупинити обидва процеси при виході
trap "echo '==> Зупиняємо...'; kill $SERVER_PID $CLIENT_PID 2>/dev/null; exit 0" INT TERM

wait $SERVER_PID $CLIENT_PID
