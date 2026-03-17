// Завантаження змінних середовища з .env
require('dotenv').config();

const express = require('express');
const { PrismaClient } = require('@prisma/client');

const logger = require('./utils/logger');
const { requestContext, requestLogger } = require('./middleware/requestContext');
const errorHandler = require('./middleware/errorHandler');

const productsRoutesFactory = require('./routes/products');
const exercisesRoutesFactory = require('./routes/exercises');
const authRoutesFactory = require('./routes/auth');
const favoritesRoutesFactory = require('./routes/favorites');
const programsRoutesFactory = require('./routes/programs');
const supportRouter = require('./routes/support');

// --- Process-level error handlers ---

function onUncaughtException(err) {
  logger.error('uncaughtException — процес завершується', {
    module: 'process',
    critical: true,
    errMessage: err.message,
    stack: err.stack,
  });
  process.removeListener('uncaughtException', onUncaughtException);
  process.exitCode = 1;
  throw err;
}

process.on('uncaughtException', onUncaughtException);

process.on('unhandledRejection', (reason) => {
  logger.error('unhandledRejection', {
    module: 'process',
    reason: reason instanceof Error ? reason.message : String(reason),
    stack: reason instanceof Error ? reason.stack : undefined,
  });
});

// --- JWT_SECRET validation ---

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.trim() === '') {
  logger.error('JWT_SECRET не налаштовано — /api/auth/* повертатимуть помилку', {
    module: 'config',
    critical: true,
    hint: 'Скопіюйте server/env.example → server/.env і встановіть JWT_SECRET',
  });
} else {
  logger.info('Auth config OK: JWT_SECRET налаштовано', { module: 'config' });
}

// --- Prisma ---

const prisma = new PrismaClient({
  log: [
    { emit: 'event', level: 'query' },
    { emit: 'event', level: 'warn' },
    { emit: 'event', level: 'error' },
  ],
});

prisma.$on('query', (e) => {
  logger.debug('Prisma query', { module: 'prisma', query: e.query, duration: e.duration });
});

prisma.$on('warn', (e) => {
  logger.warn('Prisma warn', { module: 'prisma', message: e.message });
});

prisma.$on('error', (e) => {
  logger.error('Prisma error', { module: 'prisma', message: e.message });
});

// --- Express app ---

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(requestContext);
app.use(requestLogger);

app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

app.use('/api/products', productsRoutesFactory(prisma));
app.use('/api/exercises', exercisesRoutesFactory(prisma));
app.use('/api/auth', authRoutesFactory(prisma));
app.use('/api/favorites', favoritesRoutesFactory(prisma));
app.use('/api/programs', programsRoutesFactory(prisma));
app.use('/api/support', supportRouter);

// 404 — передаємо у errorHandler
app.use((req, res, next) => {
  const err = new Error(`Маршрут не знайдено: ${req.method} ${req.originalUrl}`);
  /** @type {any} */ (err).status = 404;
  next(err);
});

// Глобальний обробник помилок
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Сервер запущено на порту ${PORT}`, { module: 'server', port: PORT });
});
