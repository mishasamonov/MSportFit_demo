// Завантаження змінних середовища з .env
require('dotenv').config();

const express = require('express');
const { PrismaClient } = require('@prisma/client');

const productsRoutesFactory = require('./routes/products');
const exercisesRoutesFactory = require('./routes/exercises');
const authRoutesFactory = require('./routes/auth');
const favoritesRoutesFactory = require('./routes/favorites');
const programsRoutesFactory = require('./routes/programs');

// Перевірка наявності JWT_SECRET при старті
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.trim() === '') {
  console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.error('❌ ПОМИЛКА КОНФІГУРАЦІЇ: JWT_SECRET не налаштовано!');
  console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.error('');
  console.error('Для роботи авторизації потрібен JWT_SECRET.');
  console.error('');
  console.error('Кроки виправлення:');
  console.error('  1. Скопіюйте server/env.example → server/.env');
  console.error('  2. Встановіть JWT_SECRET (довгий випадковий рядок)');
  console.error('  3. Перезапустіть сервер');
  console.error('');
  console.error('Приклад: JWT_SECRET=my_super_secret_key_12345');
  console.error('');
  console.error('Сервер продовжує роботу, але /api/auth/* повертатимуть помилку.');
  console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.error('');
} else {
  console.log('✓ Auth config OK: JWT_SECRET налаштовано');
}

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

app.use('/api/products', productsRoutesFactory(prisma));
app.use('/api/exercises', exercisesRoutesFactory(prisma));
app.use('/api/auth', authRoutesFactory(prisma));
app.use('/api/favorites', favoritesRoutesFactory(prisma));
app.use('/api/programs', programsRoutesFactory(prisma));

// Fallback JSON error handler (safety net)
// Note: most Prisma errors are handled directly in route handlers.
// This ensures we always return JSON and never crash the server.
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  const status = err.status && Number.isInteger(err.status) ? err.status : 500;
  res.status(status).json({
    error: err.name || 'InternalServerError',
    message: err.message || 'Something went wrong',
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
