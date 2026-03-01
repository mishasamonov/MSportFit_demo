# MSportFit — інформаційна система підтримки тренувань і харчування (demo)

Публічний репозиторій бакалаврського проєкту **MSportFit**.  
Формат: **монорепозиторій** (`client` + `server`). Поточний стан — початковий етап (MVP/скелет).

## Мета проєкту
Створити вебзастосунок, який допомагає користувачу:
- підбирати та виконувати **тренування** (програми/плани) і переглядати **вправи** з описом;
- користуватись **калькуляторами** (BMI / добова потреба в калоріях / БЖВ);
- працювати з розділом **харчування** (каталог продуктів та їх КБЖВ);
- отримувати довідкову інформацію у **FAQ** (додатковий розділ).

## Функціонал (MVP)
- Вправи та/або програми тренувань (з описом, фільтрами; відео — за потреби через YouTube embed).
- Калькулятори: BMI, добова потреба в калоріях (TDEE/BMR), БЖВ.
- Каталог продуктів харчування з КБЖВ.
- Авторизація (JWT) та **обране** (збереження вибраних елементів користувача).
- FAQ як додатковий інформаційний блок.

## Технології
**Frontend:** React, Vite, SCSS, React Router, Redux Toolkit (auth/favorites/products/filters), React Select  
**Backend:** Node.js, Express  
**DB:** PostgreSQL (Docker Compose), Prisma  
**Auth:** bcrypt + JWT (Bearer) — потребує змінної середовища `JWT_SECRET` на сервері

## Структура репозиторію
- `client/` — клієнтська частина (React/Vite)
- `server/` — серверна частина (API)
- `spec.md` — специфікація MVP, маршрути та API-контракти
- `PROJECT_RULES.md` — правила розробки/робочий гайд (у т.ч. для Cursor)
- `docker-compose.yml` — інфраструктура БД для локальної розробки
- `.gitignore` — ігнорування службових/згенерованих файлів і секретів
- `LICENSE` — ліцензія на код (MIT)

## Запуск локально

### 1) PostgreSQL (Docker)
```bash
docker compose up -d
```

### 2) Backend
```bash
cd server
npm install

# Налаштування .env (ОБОВ'ЯЗКОВО!)
# Скопіюйте env.example → .env
copy env.example .env    # Windows
# або
cp env.example .env      # Linux/Mac

# Після копіювання відредагуйте .env та встановіть JWT_SECRET
# Приклад: JWT_SECRET=my_super_secret_random_string_12345

# Prisma
npm run prisma:generate
npm run prisma:migrate

# Запуск
npm run dev
```

### 3) Frontend (Vite)
```bash
cd client
npm install
npm run dev
```

## Налаштування авторизації (обов'язково для Stage D+)

### Крок 1: Створіть .env файл
```bash
cd server
copy env.example .env    # Windows
# або
cp env.example .env      # Linux/Mac
```

### Крок 2: Встановіть JWT_SECRET
Відкрийте `server/.env` та встановіть унікальний секретний ключ:
```env
JWT_SECRET=your_long_random_secret_key_here
JWT_EXPIRES_IN=7d
```

**ВАЖЛИВО:** 
- JWT_SECRET має бути довгим випадковим рядком (мінімум 32 символи)
- Ніколи не комітьте файл `.env` в git!
- Без JWT_SECRET auth endpoints повертатимуть помилку `ServerConfigError`

### Крок 3: Перезапустіть сервер
```bash
npm run dev
```

Якщо все налаштовано правильно, при старті побачите:
```
✓ Auth config OK: JWT_SECRET налаштовано
Server running on port 3001
```

## Тестування API авторизації

**ВАЖЛИВО:** Endpoints `/api/auth/login` та `/api/auth/register` — це **POST** запити.  
Відкриття їх у браузері через адресний рядок використовує **GET** і поверне `Cannot GET /api/auth/login` — це нормально!

### 🚀 Швидке тестування (автоматичний скрипт)

Найпростіший спосіб перевірити auth та favorites:

```bash
# 1. Запустіть сервер (якщо ще не запущено)
cd server
npm run dev

# 2. В іншому терміналі
cd server
npm run test:stage-d
```

Скрипт автоматично протестує реєстрацію, вхід, `/me`, додавання в обране та отримання списків.

**Вимоги:** Node.js 18+, запущений сервер, налаштований JWT_SECRET

### Тестування через PowerShell (Windows)

#### 1. Реєстрація нового користувача
```powershell
$body = @{ 
  email = "test@example.com"
  password = "secret123" 
} | ConvertTo-Json

$response = Invoke-RestMethod `
  -Uri "http://localhost:3001/api/auth/register" `
  -Method Post `
  -ContentType "application/json" `
  -Body $body

# Зберігаємо токен для подальших запитів
$token = $response.token
Write-Host "Token: $token"
```

#### 2. Вхід (Login)
```powershell
$body = @{ 
  email = "test@example.com"
  password = "secret123" 
} | ConvertTo-Json

$response = Invoke-RestMethod `
  -Uri "http://localhost:3001/api/auth/login" `
  -Method Post `
  -ContentType "application/json" `
  -Body $body

$token = $response.token
Write-Host "Token: $token"
```

#### 3. Отримання поточного користувача (захищений endpoint)
```powershell
# Використовуємо токен з попереднього запиту
Invoke-RestMethod `
  -Uri "http://localhost:3001/api/auth/me" `
  -Method Get `
  -Headers @{ Authorization = "Bearer $token" }
```

### Тестування через curl (Linux/Mac)

#### Реєстрація
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"secret123"}'
```

#### Вхід
```bash
TOKEN=$(curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"secret123"}' \
  | jq -r '.token')

echo "Token: $TOKEN"
```

#### Отримання поточного користувача
```bash
curl http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

---

## Документування коду (Lab 5)

### Стандарт

Проєкт використовує **JSDoc** для документування JS/JSX-коду на клієнті (React/Vite) та сервері (Node.js/Express).

### Що документується

Обов'язково документуються всі **публічні та експортовані інтерфейси**:

- утиліти (`client/src/lib/`) — функції роботи з токеном, API-обгортки;
- React-хуки та контексти (`client/src/context/`) — `AuthProvider`, `useAuth`, typedef-и;
- Express-middleware (`server/src/middleware/`) — перевірка JWT, підготовка `req.user`;
- фабрики роутерів (`server/src/routes/`) — опис ендпоінтів, параметри, повернені значення.

### Вимоги до JSDoc-блоків

| Елемент | Обов'язкові теги |
|---------|-----------------|
| Функція / метод | Опис, `@param`, `@returns` |
| Функція, що кидає помилки | + `@throws` |
| Публічна утиліта / хук | + `@example` |
| Складний об'єкт / структура | `@typedef` з `@property` |

### Як згенерувати документацію

Детальна інструкція: [`docs/generate_docs.md`](docs/generate_docs.md).

```bash
# Виконується з кореня репозиторію
npm run docs:build
```

Результат: `docs/site/` — HTML-сайт із документацією (відкрийте `docs/site/index.html`).

> **Примітка:** директорія `docs/site/` додана до `.gitignore` і **не комітиться**.  
> Для здачі заархівуйте її у zip (PowerShell):
> ```powershell
> Compress-Archive -Path docs/site/* -DestinationPath docs-site.zip -Force
> ```