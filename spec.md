# Специфікація проєкту MSportFit (MVP)

## 1. Мета проєкту

**MSportFit** — веб-додаток фітнес- та спортивної тематики (монорепозиторій `client` + `server`). Користувачі переглядають каталог продуктів харчування, додають їх у обране, переглядають вправи та FAQ. Реєстрація та авторизація забезпечують збереження обраного.

---

## 2. Технологічний стек

### 2.1 Frontend (`/client`)

| Категорія | Технологія |
|-----------|------------|
| Збірка | React + Vite |
| Маршрутизація | React Router |
| Стилі | SCSS |
| Глобальний стан | Redux Toolkit *(лише: auth, favorites, products, фільтри списку вправ)* |
| UI | React Select |

### 2.2 Backend (`/server`)

| Категорія | Технологія |
|-----------|------------|
| Runtime | Node.js + Express |
| БД | PostgreSQL (Docker Compose) |
| ORM | Prisma |
| Авторизація | bcrypt + JWT (Bearer) |

---

## 3. Сторінки та маршрути

### 3.1 Публічні

| Маршрут | Опис |
|--------|------|
| `/` | Головна |
| `/products` | Каталог продуктів харчування |
| `/products/:id` | Картка продукту |
| `/exercises` | Список вправ (JSON), фільтри в Redux |
| `/exercises/:id` | Деталі вправи (YouTube-ембед за потреби) |
| `/faq` | FAQ (`faq.json`) |
| `/programs` | Програми *(опційно, `programs.json`)* |
| `/login` | Вхід |
| `/register` | Реєстрація |

### 3.2 Захищені (JWT)

| Маршрут | Опис |
|--------|------|
| `/favorites` | Обране |

### 3.3 Службові

| Маршрут | Опис |
|--------|------|
| `*` | 404 |

---

## 4. Джерела даних

### 4.1 PostgreSQL (Prisma)

- **users** — користувачі (реєстрація, логін).
- **products** — продукти харчування (title, category, calories, protein, fat, carbs).
- **favorites** — зв’язок user ↔ product, `@@unique([userId, productId])`.

### 4.2 Локальні JSON (frontend)

| Файл | Призначення |
|------|-------------|
| `exercises.json` | Вправи; відео — YouTube embed |
| `faq.json` | Питання та відповіді |
| `programs.json` | *(опційно)* Програми тренувань |

Продукти, обране, users — лише через REST API. Вправи, FAQ (і programs) — з JSON, без backend.

---

## 5. API-контракти

**Базовий URL:** `/api`.  
**Захищені маршрути:** `Authorization: Bearer <token>`.

---

### 5.1 Авторизація

#### `POST /api/auth/register`

**Request:**
```json
{ "email": "string", "password": "string" }
```

**Response `201`:**
```json
{ "token": "string", "user": { "id": "string", "email": "string" } }
```

**Помилки:** `400` — валідація, `409` — email зайнятий.

---

#### `POST /api/auth/login`

**Request:**
```json
{ "email": "string", "password": "string" }
```

**Response `200`:**
```json
{ "token": "string", "user": { "id": "string", "email": "string" } }
```

**Помилки:** `401` — невірні дані.

---

#### `GET /api/auth/me` *(захищений)*

**Response `200`:**
```json
{ "user": { "id": "...", "email": "..." } }
```

**Помилки:** `401` — невалідний/відсутній токен.

---

### 5.2 Продукти (харчування)

#### `GET /api/products`

Опційно: `?search=`, `?category=`, `?limit=`, `?offset=`.

**Response `200`:**
```json
{
  "items": [
    {
      "id": "...",
      "title": "...",
      "category": "...",
      "calories": 250,
      "protein": 12.5,
      "fat": 8.2,
      "carbs": 32
    }
  ],
  "total": 42
}
```

---

#### `GET /api/products/:id`

**Response `200`:**
```json
{
  "id": "...",
  "title": "...",
  "category": "...",
  "calories": 250,
  "protein": 12.5,
  "fat": 8.2,
  "carbs": 32
}
```

**Помилки:** `404`.

---

### 5.3 Обране *(захищені)*

#### `GET /api/favorites`

**Response `200`:**
```json
{
  "ok": true,
  "items": [
    {
      "id": "...",
      "title": "...",
      "category": "...",
      "calories": 250,
      "protein": 12.5,
      "fat": 8.2,
      "carbs": 32
    }
  ]
}
```

---

#### `POST /api/favorites`

**Request:**
```json
{ "productId": "string" }
```

**Response `201`:**
```json
{ "ok": true }
```

**Помилки:** `404` — продукт не знайдено, `409` — вже в обраному.

---

#### `DELETE /api/favorites/:productId`

**Response `200`:**
```json
{ "ok": true }
```

**Помилки:** `404` — не в обраному або невалідний productId.

---

## 6. Концепція моделей Prisma

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id           String     @id @default(uuid())
  email        String     @unique
  passwordHash String
  createdAt    DateTime   @default(now())
  favorites    Favorite[]
}

model Product {
  id        String   @id @default(uuid())
  title     String
  category  String?
  calories  Int
  protein   Decimal  @db.Decimal(8, 2)
  fat       Decimal  @db.Decimal(8, 2)
  carbs     Decimal  @db.Decimal(8, 2)
  createdAt DateTime @default(now())
  favorites Favorite[]
}

model Favorite {
  id        String   @id @default(uuid())
  userId    String
  productId String
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)

  @@unique([userId, productId])
  @@index([userId])
  @@index([productId])
}
```

- **User:** пароль зберігається як bcrypt-хеш у `passwordHash`.
- **Product:** продукти харчування (title, category, calories, protein, fat, carbs); ціни немає.
- **Favorite:** унікальна пара `(userId, productId)`.

---

## 7. Гібридний план (0 → A → B → C → D → E)

Поетапна реалізація: PostgreSQL + локальні JSON.

| Етап | Зміст |
|------|--------|
| **0** | Репозиторій: bootstrap монорепо (client + server), базові конфіги |
| **A** | UI-скелет: React Router, Layout, placeholder-сторінки для всіх маршрутів |
| **B** | Backend/DB-скелет: Docker Compose (Postgres), `GET /api/health`, `.env.example`, Prisma schema |
| **C** | UI на mock JSON: `exercises.json`, `faq.json`, сторінки вправ та FAQ; products UI з mock-плейсхолдерами |
| **D** | Реальна інтеграція: auth, products, favorites (API + БД, Redux) |
| **E** | Полірування: UX, безпека (Bearer, CORS, валідація), фінальна перевірка |

---

## 8. Чеклист реалізації

- [ ] **0:** Bootstrap монорепо (client + server)
- [ ] **A:** React Router, Layout, placeholder-сторінки
- [ ] **B:** Docker Compose + Postgres, `/api/health`, `.env.example`, Prisma schema
- [ ] **C:** `exercises.json`, `faq.json`, UI вправ/FAQ; products UI (mock)
- [ ] **D:** Auth (register/login, JWT), products API, favorites API, Redux, захищені маршрути
- [ ] **E:** Полірування (UX, безпека, валідація)
