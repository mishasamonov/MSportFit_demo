# Процедура оновлення — MSportFit

> Лабораторна робота 3 · Порядок безпечного оновлення застосунку

---

## Зміст

1. [Підготовка до оновлення](#1-підготовка-до-оновлення)
2. [Резервна копія перед оновленням](#2-резервна-копія-перед-оновленням)
3. [Перевірка сумісності](#3-перевірка-сумісності)
4. [Зупинка сервісів](#4-зупинка-сервісів)
5. [Оновлення коду](#5-оновлення-коду)
6. [Встановлення залежностей](#6-встановлення-залежностей)
7. [Застосування міграцій Prisma](#7-застосування-міграцій-prisma)
8. [Збірка клієнта](#8-збірка-клієнта)
9. [Запуск та перевірка](#9-запуск-та-перевірка)
10. [Rollback — відкат до попередньої версії](#10-rollback--відкат-до-попередньої-версії)

---

## 1. Підготовка до оновлення

Перед початком оновлення:

1. Прочитайте `CHANGELOG` або перелік коммітів між поточною та новою версією:

   ```bash
   git log --oneline HEAD..origin/main
   ```

2. Перевірте, чи не містить нова версія **breaking changes** для API, схеми БД або змінних середовища.

3. Зафіксуйте поточну версію, що розгорнута:

   ```bash
   git -C /var/www/msportfit rev-parse --short HEAD
   # Збережіть хеш — він знадобиться при rollback
   ```

4. Переконайтеся, що на сервері є місце для нового артефакту збірки:

   ```bash
   df -h /var/www/msportfit
   ```

---

## 2. Резервна копія перед оновленням

**Це обов'язковий крок.** Ніколи не оновлюйте без свіжого дампу бази даних.

```bash
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/msportfit"
mkdir -p "$BACKUP_DIR"

pg_dump -U msportfit -h 127.0.0.1 -F c \
  -f "$BACKUP_DIR/pre_update_${TIMESTAMP}.dump" \
  msportfit

echo "Backup saved: $BACKUP_DIR/pre_update_${TIMESTAMP}.dump"
```

Також збережіть поточний `.env` файл:

```bash
cp /var/www/msportfit/server/.env \
   /var/backups/msportfit/env_pre_update_${TIMESTAMP}.bak
```

> Детальна документація по резервному копіюванню — у файлі [backup.md](./backup.md).

---

## 3. Перевірка сумісності

### 3.1. Node.js

```bash
node -v
# Переконайтеся, що версія відповідає вимогам package.json ("engines" або README)
```

### 3.2. Нові змінні середовища

Порівняйте `server/env.example` з репозиторію та поточний `server/.env`:

```bash
git show origin/main:server/env.example
cat /var/www/msportfit/server/.env
```

Якщо у новій версії з'явилися нові змінні — додайте їх до `.env` до запуску.

### 3.3. Нові міграції Prisma

Перегляньте список нових міграцій:

```bash
git diff HEAD origin/main -- server/prisma/migrations/
```

Якщо є незворотні зміни схеми (видалення колонок, зміна типів) — спочатку узгодьте план відкату.

---

## 4. Зупинка сервісів

```bash
pm2 stop msportfit-api
pm2 status   # переконатися, що процес зупинено (status: stopped)
```

---

## 5. Оновлення коду

```bash
cd /var/www/msportfit

git fetch origin
git pull origin main
```

Якщо виникли конфлікти злиття — розв'яжіть їх або виконайте rollback (розділ 10).

---

## 6. Встановлення залежностей

Встановлюйте залежності навіть якщо `package.json` не змінювався — могли оновитися `package-lock.json`.

```bash
# Кореневий рівень
npm install

# Сервер
npm install --prefix server

# Клієнт
npm install --prefix client
```

> Якщо з'явилися нові пакети або оновлено транзитивні залежності, `npm install` синхронізує `node_modules` з `package-lock.json`.

---

## 7. Застосування міграцій Prisma

```bash
cd /var/www/msportfit/server
npx prisma generate
npx prisma migrate deploy
```

Перевірте статус міграцій після застосування:

```bash
npx prisma migrate status
```

Очікуваний вивід — усі міграції у стані `Applied`.

---

## 8. Збірка клієнта

```bash
cd /var/www/msportfit
npm run build --prefix client
```

Нова збірка перезаписує `client/dist/`. Nginx одразу починає роздавати оновлену версію фронтенду.

---

## 9. Запуск та перевірка

### 9.1. Запуск API-сервера

```bash
pm2 restart msportfit-api
pm2 status
# Переконайтеся: status = online, ↺ restarts не зростає нескінченно
```

### 9.2. Перевірка health-check

```bash
curl -s http://localhost:3001/api/health
# Очікується: {"status":"ok"}
```

### 9.3. Перевірка через Nginx

```bash
curl -s http://example.com/api/health
# Очікується: {"status":"ok"}
```

### 9.4. Функціональна перевірка

```bash
# Вхід існуючого користувача
TOKEN=$(curl -s -X POST http://example.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test1234!"}' | jq -r .token)

# Захищений ендпоінт
curl -s http://example.com/api/auth/me \
  -H "Authorization: Bearer $TOKEN" | jq .

# Список продуктів
curl -s http://example.com/api/products | jq length
```

### 9.5. Перегляд логів

```bash
pm2 logs msportfit-api --lines 50
```

Якщо є помилки підключення до БД або JWT — перевірте `server/.env`.

### 9.6. Чеклист після оновлення

- [ ] `pm2 status` → `msportfit-api` у стані `online`
- [ ] `GET /api/health` → `{"status":"ok"}`
- [ ] Prisma: `migrate status` → усі міграції `Applied`
- [ ] Логін існуючого користувача успішний
- [ ] Фронтенд відображає актуальну версію

---

## 10. Rollback — відкат до попередньої версії

Використовуйте цей розділ, якщо після оновлення виникли критичні помилки.

### 10.1. Зупинити сервер

```bash
pm2 stop msportfit-api
```

### 10.2. Відкатити код до попереднього комміту

```bash
cd /var/www/msportfit
git log --oneline -10   # знайдіть хеш стабільної версії
git checkout <попередній-хеш>
```

> Хеш попередньої версії було зафіксовано на кроці 1.

### 10.3. Відновити залежності попередньої версії

```bash
npm install
npm install --prefix server
npm install --prefix client
```

### 10.4. Відновити базу даних з дампу

```bash
# Зупинити підключення до БД (опціонально — для production)
sudo -u postgres psql -c "
  SELECT pg_terminate_backend(pid)
  FROM pg_stat_activity
  WHERE datname = 'msportfit' AND pid <> pg_backend_pid();"

# Відновити з резервної копії
pg_restore -U msportfit -h 127.0.0.1 \
  --clean --if-exists \
  -d msportfit \
  /var/backups/msportfit/pre_update_<TIMESTAMP>.dump
```

### 10.5. Відновити змінні середовища

```bash
cp /var/backups/msportfit/env_pre_update_<TIMESTAMP>.bak \
   /var/www/msportfit/server/.env
```

### 10.6. Перегенерувати Prisma-клієнт

```bash
cd /var/www/msportfit/server
npx prisma generate
```

### 10.7. Перезібрати клієнт

```bash
cd /var/www/msportfit
npm run build --prefix client
```

### 10.8. Запустити попередню версію

```bash
pm2 start msportfit-api
pm2 status
curl -s http://localhost:3001/api/health
```

### 10.9. Зафіксувати інцидент

Після успішного відкату задокументуйте:

- Яку версію було розгорнуто та з якої відкатились
- Причину збою (лог-файли, повідомлення про помилку)
- Час простою
- Вжиті заходи для виправлення проблеми перед повторним оновленням
