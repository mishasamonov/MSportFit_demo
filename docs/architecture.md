# Архітектура проєкту msportfit

## Структура репозиторію

```
msportfit_demo/
├── client/               # React-фронтенд (Vite)
│   ├── src/
│   │   ├── api/          # Клієнтський API-шар (apiFetch)
│   │   ├── components/   # Перевикористовувані UI-компоненти
│   │   ├── context/      # React Context (AuthContext)
│   │   └── pages/        # Сторінки (маршрутизатор)
│   ├── .eslintrc.cjs
│   └── package.json
├── server/               # Node.js-бекенд (Express)
│   ├── src/
│   │   ├── middleware/   # JWT-перевірка (authMiddleware)
│   │   ├── routes/       # Express-роутери (auth, products, exercises, favorites)
│   │   └── index.js      # Точка входу
│   ├── prisma/
│   │   └── schema.prisma # Схема бази даних (PostgreSQL)
│   ├── scripts/          # Службові скрипти (seed, test)
│   ├── .eslintrc.cjs
│   └── package.json
├── docs/                 # Документація проєкту
├── jsdoc.json            # Конфігурація JSDoc
└── package.json          # Кореневий монорепозиторій (lint, docs:build)
```

---

## Технологічний стек

| Рівень | Технологія |
|--------|------------|
| Фронтенд | React 18, React Router v7, Vite |
| Бекенд | Node.js, Express 4 |
| ORM / БД | Prisma ORM, PostgreSQL |
| Аутентифікація | JWT (`jsonwebtoken`), `bcryptjs` |
| Якість коду | ESLint 8, Prettier, Husky, lint-staged |
| Документація | JSDoc, `eslint-plugin-jsdoc` |

---

## Auth Flow

```
Клієнт                              Сервер
  │                                   │
  │  POST /api/auth/register           │
  │  { email, password }               │
  │ ─────────────────────────────────> │
  │                                    │  bcrypt.hash + prisma.user.create
  │  { token }                         │  jwt.sign(userId, JWT_SECRET)
  │ <───────────────────────────────── │
  │                                    │
  │  localStorage.setItem('token', …)  │
  │                                    │
  │  GET /api/auth/me                  │
  │  Authorization: Bearer <jwt>       │
  │ ─────────────────────────────────> │
  │                      authMiddleware│ jwt.verify → req.user
  │  { id, email }                     │
  │ <───────────────────────────────── │
```

1. При реєстрації (`POST /api/auth/register`) або вході (`POST /api/auth/login`) сервер повертає підписаний JWT-токен.
2. Клієнт зберігає токен у `localStorage`.
3. При старті застосунку `AuthContext` виконує `GET /api/auth/me` з токеном — якщо токен дійсний, сесія відновлюється без повторного логіну.
4. Захищені сторінки обгортаються `ProtectedRoute`: відсутній або прострочений токен спричиняє редирект на `/login`.
5. На сервері кожен захищений роутер пропускає запит через `authMiddleware`, який перевіряє підпис JWT та встановлює `req.user`.

---

## Клієнтський API-шар (`apiFetch`)

Усі HTTP-звернення фронтенду до серверного API проходять через єдину утиліту `apiFetch` (`client/src/api/`):

```js
// публічний ендпоінт
const products = await apiFetch('/api/products');

// захищений ендпоінт (токен додається автоматично)
await apiFetch(`/api/favorites/products/${id}`, { method: 'POST' });
```

Поведінка `apiFetch`:

- Зчитує токен з `localStorage` і додає заголовок `Authorization: Bearer <token>`.
- Встановлює `Content-Type: application/json` та серіалізує `body` у JSON.
- Кидає помилку при `!response.ok` — централізована обробка HTTP-помилок.

---

## Захищені маршрути (сервер)

```
Публічні:
  POST  /api/auth/register
  POST  /api/auth/login
  GET   /api/products
  GET   /api/exercises
  GET   /api/health

Захищені (authMiddleware):
  GET   /api/auth/me
  GET   /api/favorites/products
  POST  /api/favorites/products/:id
  GET   /api/favorites/exercises
  POST  /api/favorites/exercises/:id
```
