# Резервне копіювання — MSportFit

> Лабораторна робота 3 · Стратегія та процедури резервного копіювання

---

## Зміст

1. [Стратегія резервного копіювання](#1-стратегія-резервного-копіювання)
2. [Типи резервних копій](#2-типи-резервних-копій)
3. [Частота та розклад](#3-частота-та-розклад)
4. [Ротація та зберігання](#4-ротація-та-зберігання)
5. [Процедура створення резервної копії (pg_dump)](#5-процедура-створення-резервної-копії-pg_dump)
6. [Процедура відновлення (pg_restore)](#6-процедура-відновлення-pg_restore)
7. [Перевірка цілісності](#7-перевірка-цілісності)
8. [Тестове відновлення](#8-тестове-відновлення)
9. [Автоматизація через cron](#9-автоматизація-через-cron)

---

## 1. Стратегія резервного копіювання

MSportFit зберігає всі критичні дані у PostgreSQL: облікові записи користувачів, продукти, вправи та обрані елементи. Файлова система застосунку є артефактом збірки і завжди може бути відтворена з репозиторію та бази даних.

### Що підлягає резервному копіюванню

| Об'єкт | Метод | Пріоритет |
|--------|-------|-----------|
| База даних PostgreSQL (`msportfit`) | `pg_dump` | **Критичний** |
| Файл змінних середовища `server/.env` | Копіювання файлу | Високий |
| Репозиторій коду | Git (remote) | Середній |

### Що **не** потребує резервного копіювання

- `client/dist/` — відтворюється командою `npm run build --prefix client`
- `node_modules/` — відтворюється командою `npm install`
- `server/prisma/migrations/` — зберігаються в репозиторії

---

## 2. Типи резервних копій

### Повна резервна копія (Full Backup)

Повний дамп усієї бази даних у бінарному форматі (`pg_dump -F c`). Містить схему, дані, індекси та послідовності.

**Переваги:** повне відновлення з одного файлу, підтримує вибіркове відновлення таблиць.

### Знімок перед оновленням (Pre-update Snapshot)

Створюється безпосередньо перед будь-яким розгортанням нової версії. Зберігається разом із копією `.env`.

**Ціль:** забезпечити можливість відкату (rollback) у разі збою оновлення.

---

## 3. Частота та розклад

| Тип | Частота | Час | Зберігання |
|-----|---------|-----|------------|
| Щоденна повна копія | 1 раз на добу | 03:00 | 7 днів |
| Щотижнева копія | 1 раз на тиждень (нд) | 02:00 | 4 тижні |
| Щомісячна копія | 1-го числа місяця | 01:00 | 3 місяці |
| Pre-update snapshot | Перед кожним оновленням | Вручну | До наступного успішного оновлення |

---

## 4. Ротація та зберігання

### Директорія зберігання

```
/var/backups/msportfit/
├── daily/
│   ├── msportfit_20260301_030000.dump
│   └── ...
├── weekly/
│   ├── msportfit_week_20260301.dump
│   └── ...
├── monthly/
│   ├── msportfit_2026_03.dump
│   └── ...
└── pre_update/
    ├── pre_update_20260301_120000.dump
    └── env_pre_update_20260301_120000.bak
```

### Ротація (видалення застарілих копій)

```bash
# Видалити щоденні копії старші за 7 днів
find /var/backups/msportfit/daily/ -name "*.dump" -mtime +7 -delete

# Видалити щотижневі копії старші за 28 днів
find /var/backups/msportfit/weekly/ -name "*.dump" -mtime +28 -delete

# Видалити щомісячні копії старші за 90 днів
find /var/backups/msportfit/monthly/ -name "*.dump" -mtime +90 -delete
```

### Рекомендації щодо зовнішнього зберігання

- Копіюйте щомісячні резервні копії до хмарного сховища (S3, Google Cloud Storage або аналог).
- Використовуйте шифрування при передачі та зберіганні за межами сервера (`gpg` або нативне шифрування хмарного провайдера).

---

## 5. Процедура створення резервної копії (pg_dump)

### 5.1. Ручне створення повної копії

```bash
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/msportfit/daily"
mkdir -p "$BACKUP_DIR"

pg_dump \
  -U msportfit \
  -h 127.0.0.1 \
  -p 5432 \
  -F c \
  -b \
  -v \
  -f "$BACKUP_DIR/msportfit_${TIMESTAMP}.dump" \
  msportfit

echo "Exit code: $?"
ls -lh "$BACKUP_DIR/msportfit_${TIMESTAMP}.dump"
```

Параметри команди:

| Параметр | Значення |
|----------|----------|
| `-U msportfit` | Ім'я користувача PostgreSQL |
| `-h 127.0.0.1` | Хост (локально) |
| `-p 5432` | Стандартний порт PostgreSQL |
| `-F c` | Формат `custom` (бінарний, стискається, підтримує вибіркове відновлення) |
| `-b` | Включити великі об'єкти (blobs) |
| `-v` | Детальний вивід |
| `-f <файл>` | Шлях до файлу дампу |

### 5.2. Резервна копія лише схеми

```bash
pg_dump -U msportfit -h 127.0.0.1 -F p --schema-only \
  -f /var/backups/msportfit/schema_only.sql msportfit
```

### 5.3. Резервна копія окремої таблиці

```bash
pg_dump -U msportfit -h 127.0.0.1 -F c \
  -t '"User"' \
  -f /var/backups/msportfit/table_user.dump \
  msportfit
```

> Назви таблиць у Prisma є PascalCase і вимагають екранування подвійними лапками.

---

## 6. Процедура відновлення (pg_restore)

### 6.1. Повне відновлення бази даних

```bash
# Крок 1: Зупинити API-сервер
pm2 stop msportfit-api

# Крок 2: Закрити всі активні підключення до БД
sudo -u postgres psql -c "
  SELECT pg_terminate_backend(pid)
  FROM pg_stat_activity
  WHERE datname = 'msportfit'
    AND pid <> pg_backend_pid();"

# Крок 3: Очистити та відновити базу
pg_restore \
  -U msportfit \
  -h 127.0.0.1 \
  -d msportfit \
  --clean \
  --if-exists \
  -v \
  /var/backups/msportfit/daily/msportfit_<TIMESTAMP>.dump

echo "Restore exit code: $?"

# Крок 4: Запустити API-сервер
pm2 start msportfit-api
```

### 6.2. Відновлення окремої таблиці

```bash
pg_restore \
  -U msportfit \
  -h 127.0.0.1 \
  -d msportfit \
  --table '"Product"' \
  -v \
  /var/backups/msportfit/daily/msportfit_<TIMESTAMP>.dump
```

### 6.3. Відновлення з SQL-дампу (plain format)

```bash
psql -U msportfit -h 127.0.0.1 -d msportfit \
  -f /var/backups/msportfit/schema_only.sql
```

---

## 7. Перевірка цілісності

### 7.1. Перевірка розміру файлу

Файл дампу не повинен бути порожнім або підозріло малим:

```bash
ls -lh /var/backups/msportfit/daily/
# Очікуваний розмір: > 10 КБ для непорожньої БД
```

### 7.2. Перевірка заголовку дампу

```bash
pg_restore --list /var/backups/msportfit/daily/msportfit_<TIMESTAMP>.dump | head -20
```

Якщо команда виконується без помилок і виводить список об'єктів — файл не пошкоджений.

### 7.3. Перевірка кількості записів після відновлення

```bash
psql -U msportfit -h 127.0.0.1 -d msportfit -c "
  SELECT 'User' AS table_name, COUNT(*) FROM \"User\"
  UNION ALL
  SELECT 'Product', COUNT(*) FROM \"Product\"
  UNION ALL
  SELECT 'Exercise', COUNT(*) FROM \"Exercise\"
  UNION ALL
  SELECT 'Favorite', COUNT(*) FROM \"Favorite\"
  UNION ALL
  SELECT 'ExerciseFavorite', COUNT(*) FROM \"ExerciseFavorite\";"
```

Порівняйте кількість записів із показниками до відновлення.

### 7.4. Перевірка контрольної суми файлу

```bash
# Під час створення дампу
sha256sum /var/backups/msportfit/daily/msportfit_<TIMESTAMP>.dump \
  > /var/backups/msportfit/daily/msportfit_<TIMESTAMP>.dump.sha256

# Перед відновленням
sha256sum -c /var/backups/msportfit/daily/msportfit_<TIMESTAMP>.dump.sha256
# Очікуваний результат: OK
```

---

## 8. Тестове відновлення

Тестове відновлення рекомендується виконувати **щомісяця** або після кожного значного оновлення, щоб переконатися, що резервна копія дійсно працездатна.

### 8.1. Створення тестової бази даних

```bash
sudo -u postgres psql -c "CREATE DATABASE msportfit_test OWNER msportfit;"
```

### 8.2. Відновлення дампу у тестову БД

```bash
pg_restore \
  -U msportfit \
  -h 127.0.0.1 \
  -d msportfit_test \
  -v \
  /var/backups/msportfit/daily/msportfit_<TIMESTAMP>.dump

echo "Test restore exit code: $?"
```

### 8.3. Верифікація даних у тестовій БД

```bash
psql -U msportfit -h 127.0.0.1 -d msportfit_test -c "
  SELECT 'User' AS tbl, COUNT(*) FROM \"User\"
  UNION ALL
  SELECT 'Product', COUNT(*) FROM \"Product\"
  UNION ALL
  SELECT 'Exercise', COUNT(*) FROM \"Exercise\";"
```

### 8.4. Перевірка API з тестовою БД (опціонально)

Тимчасово змініть `DATABASE_URL` у `server/.env`, запустіть сервер і виконайте функціональні перевірки:

```bash
# Тимчасово підмінити URL
DATABASE_URL="postgresql://msportfit:msportfit@127.0.0.1:5432/msportfit_test?schema=public" \
  node /var/www/msportfit/server/src/index.js &

curl -s http://localhost:3001/api/health
curl -s http://localhost:3001/api/products | jq length

kill %1   # зупинити тестовий процес
```

### 8.5. Видалення тестової бази після перевірки

```bash
sudo -u postgres psql -c "DROP DATABASE msportfit_test;"
```

---

## 9. Автоматизація через cron

Додайте наступні задачі до `crontab -e` від імені системного користувача:

```cron
# Щоденна резервна копія о 03:00
0 3 * * * /var/www/msportfit/scripts/backup_daily.sh >> /var/log/msportfit_backup.log 2>&1

# Щотижнева резервна копія у неділю о 02:00
0 2 * * 0 /var/www/msportfit/scripts/backup_weekly.sh >> /var/log/msportfit_backup.log 2>&1

# Щомісячна резервна копія 1-го числа о 01:00
0 1 1 * * /var/www/msportfit/scripts/backup_monthly.sh >> /var/log/msportfit_backup.log 2>&1
```

Приклад скрипту щоденного бекапу (`scripts/backup_daily.sh`):

```bash
#!/bin/bash
set -e

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/msportfit/daily"
DUMP_FILE="$BACKUP_DIR/msportfit_${TIMESTAMP}.dump"

mkdir -p "$BACKUP_DIR"

pg_dump -U msportfit -h 127.0.0.1 -F c -b -f "$DUMP_FILE" msportfit
sha256sum "$DUMP_FILE" > "${DUMP_FILE}.sha256"

# Ротація: видалити копії старші за 7 днів
find "$BACKUP_DIR" -name "*.dump" -mtime +7 -delete
find "$BACKUP_DIR" -name "*.sha256" -mtime +7 -delete

echo "[$(date)] Daily backup completed: $DUMP_FILE"
```

Зробіть скрипт виконуваним:

```bash
chmod +x /var/www/msportfit/scripts/backup_daily.sh
```

Перевірте журнал виконання:

```bash
tail -f /var/log/msportfit_backup.log
```
