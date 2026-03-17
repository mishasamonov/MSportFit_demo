#!/usr/bin/env bash
# Резервне копіювання бази даних PostgreSQL (формат custom pg_dump)
# DATABASE_URL береться з server/.env
set -e

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
ENV_FILE="$ROOT_DIR/server/.env"
BACKUP_DIR="/var/backups/msportfit"

# Зчитуємо DATABASE_URL з .env
if [ ! -f "$ENV_FILE" ]; then
  echo "[ERROR] Файл $ENV_FILE не знайдено." >&2
  exit 1
fi

DATABASE_URL=$(grep -E '^DATABASE_URL=' "$ENV_FILE" | cut -d '=' -f 2-)

if [ -z "$DATABASE_URL" ]; then
  echo "[ERROR] DATABASE_URL не знайдено у $ENV_FILE." >&2
  exit 1
fi

# Парсимо з'єднувальні параметри з URL виду:
#   postgresql://user:password@host:port/dbname?schema=public
_url="${DATABASE_URL#postgresql://}"
_url="${_url#postgres://}"
DB_USER="${_url%%:*}"
_url="${_url#*:}"
DB_PASS="${_url%%@*}"
_url="${_url#*@}"
DB_HOST="${_url%%:*}"
_url="${_url#*:}"
DB_PORT="${_url%%/*}"
_url="${_url#*/}"
DB_NAME="${_url%%\?*}"

TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/${DB_NAME}_${TIMESTAMP}.dump"

mkdir -p "$BACKUP_DIR"

echo "==> Виконуємо pg_dump..."
echo "    Хост:  $DB_HOST:$DB_PORT"
echo "    БД:    $DB_NAME"
echo "    Файл:  $BACKUP_FILE"

PGPASSWORD="$DB_PASS" pg_dump \
  --host="$DB_HOST" \
  --port="$DB_PORT" \
  --username="$DB_USER" \
  --format=custom \
  --file="$BACKUP_FILE" \
  "$DB_NAME"

echo "==> Резервна копія збережена: $BACKUP_FILE"
