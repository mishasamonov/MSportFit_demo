#!/usr/bin/env bash
# Відновлення бази даних PostgreSQL з резервної копії (pg_restore)
# DATABASE_URL береться з server/.env
# Використання: ./restore-db.sh /var/backups/msportfit/msportfit_20260101_120000.dump
set -e

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
ENV_FILE="$ROOT_DIR/server/.env"

# Перевіряємо аргумент — шлях до файлу резервної копії
BACKUP_FILE="${1:-}"
if [ -z "$BACKUP_FILE" ]; then
  echo "Використання: $0 <шлях_до_файлу_.dump>" >&2
  exit 1
fi

if [ ! -f "$BACKUP_FILE" ]; then
  echo "[ERROR] Файл резервної копії не знайдено: $BACKUP_FILE" >&2
  exit 1
fi

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

# Парсимо з'єднувальні параметри з URL
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

echo "==> Виконуємо pg_restore..."
echo "    Хост:  $DB_HOST:$DB_PORT"
echo "    БД:    $DB_NAME"
echo "    Файл:  $BACKUP_FILE"
echo "    [!] Наявні дані будуть замінені (--clean --if-exists)"

PGPASSWORD="$DB_PASS" pg_restore \
  --host="$DB_HOST" \
  --port="$DB_PORT" \
  --username="$DB_USER" \
  --dbname="$DB_NAME" \
  --clean \
  --if-exists \
  --no-owner \
  --no-privileges \
  "$BACKUP_FILE"

echo "==> Відновлення завершено успішно."
