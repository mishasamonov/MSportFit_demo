# Server (MSportFit)

**Етап B — як запустити:** Postgres у Docker, далі встановити залежності, Prisma generate/migrate, старт сервера.

## Env (обов'язково)

- **Шаблон:** `server/env.example` — скопіюй його вміст у файл `server/.env`.
- **Важливо:** файл `server/.env` **НЕ комітити** (він у `.gitignore`). Без `.env` і змінної `DATABASE_URL` команди Prisma видадуть помилку.
- Для авторизації **обов'язково** потрібен `JWT_SECRET` (довгий випадковий рядок, мінімум 32 символи) і, за бажанням, `JWT_EXPIRES_IN` (наприклад, `7d`).

### Налаштування JWT_SECRET

1. Скопіюйте `env.example` → `.env`:
   ```bash
   copy env.example .env    # Windows
   # або
   cp env.example .env      # Linux/Mac
   ```

2. Відкрийте `.env` та встановіть унікальний секретний ключ:
   ```env
   JWT_SECRET=your_long_random_secret_key_here_min_32_chars
   JWT_EXPIRES_IN=7d
   ```

3. Перезапустіть сервер

**При старті сервера:**
- Якщо JWT_SECRET налаштовано: `✓ Auth config OK: JWT_SECRET налаштовано`
- Якщо JWT_SECRET відсутній: детальна помилка з інструкціями

**Без JWT_SECRET:**
- Auth endpoints (`/api/auth/register`, `/api/auth/login`, `/api/auth/me`) повертатимуть:
  ```json
  {
    "error": "ServerConfigError",
    "message": "JWT_SECRET is not set. Create server/.env (copy from env.example) and restart server."
  }
  ```

## Чеклист перевірки (етап B)

1. **Запуск Postgres** (з кореня репо):
   ```bash
   docker compose up -d
   ```

2. **У каталозі server:** встановити залежності, згенерувати клієнт Prisma, застосувати міграції:
   ```bash
   cd server
   npm install
   npm run prisma:generate
   npm run prisma:migrate
   ```

3. **Запуск сервера:**
   ```bash
   npm start
   ```

4. **Перевірка:**
   - `GET http://localhost:3001/api/health` → `{ "ok": true }`
   - `GET http://localhost:3001/api/products` → `[]` або список продуктів
   - Prisma Studio: `npm run prisma:studio` (з каталогу server), далі `http://localhost:5555`

## Тестування Auth API

**ВАЖЛИВО:** `/api/auth/login` та `/api/auth/register` — це **POST** запити.  
Відкриття їх у браузері (GET запит) поверне `Cannot GET /api/auth/login` — це нормально!

### Автоматичний тест (рекомендовано)

Найпростіший спосіб перевірити всю функціональність Stage D (auth + favorites):

```bash
# 1. Переконайтесь що сервер запущено
npm run dev

# 2. В іншому терміналі запустіть тест
npm run test:stage-d
```

Цей скрипт автоматично:
- Перевіряє здоровʼя сервера
- Реєструє нового користувача (випадковий email)
- Отримує поточного користувача через `/api/auth/me`
- Додає продукти та вправи в обране
- Перевіряє списки обраного

**Вимоги:**
- Node.js 18+ (використовує нативний fetch)
- Запущений сервер з налаштованим JWT_SECRET в `.env`
- (Опціонально) Дані в БД: `npm run seed`

### PowerShell (Windows)

#### Реєстрація
```powershell
$body = @{ email="test@example.com"; password="secret123" } | ConvertTo-Json
$res = Invoke-RestMethod "http://localhost:3001/api/auth/register" -Method Post -ContentType "application/json" -Body $body
$token = $res.token
Write-Host "Token: $token"
```

#### Вхід
```powershell
$body = @{ email="test@example.com"; password="secret123" } | ConvertTo-Json
$res = Invoke-RestMethod "http://localhost:3001/api/auth/login" -Method Post -ContentType "application/json" -Body $body
$token = $res.token
Write-Host "Token: $token"
```

#### Перевірка токену (GET /api/auth/me)
```powershell
Invoke-RestMethod "http://localhost:3001/api/auth/me" -Headers @{ Authorization = "Bearer $token" }
```

### curl (Linux/Mac/Git Bash)

```bash
# Реєстрація
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"secret123"}'

# Вхід та збереження токену
TOKEN=$(curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"secret123"}' | jq -r '.token')

# Перевірка токену
curl http://localhost:3001/api/auth/me -H "Authorization: Bearer $TOKEN"
```
