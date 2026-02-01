# Server (MSportFit)

**Етап B — як запустити:** Postgres у Docker, далі встановити залежності, Prisma generate/migrate, старт сервера.

## Env (обов'язково)

- **Шаблон:** `server/env.example` — скопіюй його вміст у файл `server/.env`.
- **Важливо:** файл `server/.env` **НЕ комітити** (він у `.gitignore`). Без `.env` і змінної `DATABASE_URL` команди Prisma видадуть помилку.

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
