const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/auth');

/**
 * Хелпер для створення JWT.
 * @param {string} userId
 * @returns {string}
 */
function signToken(userId) {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw Object.assign(
      new Error(
        'JWT_SECRET is not set. Create server/.env (copy from env.example) and restart server.',
      ),
      {
        name: 'ServerConfigError',
        status: 500,
      },
    );
  }

  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

  return jwt.sign({ sub: userId }, secret, { expiresIn });
}

/**
 * Маршрути авторизації.
 * @param {import('@prisma/client').PrismaClient} prisma
 */
function createAuthRouter(prisma) {
  const router = express.Router();

  // POST /api/auth/register
  router.post('/register', async (req, res) => {
    const { email, password } = req.body || {};

    if (!email || typeof email !== 'string') {
      return res.status(400).json({
        error: 'ValidationError',
        message: 'Поле "email" є обовʼязковим і має бути рядком',
      });
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({
        error: 'ValidationError',
        message: 'Пароль має містити щонайменше 6 символів',
      });
    }

    try {
      const passwordHash = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: {
          email,
          passwordHash,
        },
      });

      const token = signToken(user.id);

      return res.status(201).json({
        token,
        user: {
          id: user.id,
          email: user.email,
        },
      });
    } catch (err) {
      console.error('POST /api/auth/register error:', err);

      // Prisma unique constraint violation
      if (err.code === 'P2002') {
        return res.status(400).json({
          error: 'EmailAlreadyInUse',
          message: 'Користувач з таким email вже існує',
        });
      }

      const status = err.status && Number.isInteger(err.status) ? err.status : 500;

      return res.status(status).json({
        error: err.name || 'InternalServerError',
        message: err.message || 'Не вдалося зареєструвати користувача',
      });
    }
  });

  // POST /api/auth/login
  router.post('/login', async (req, res) => {
    const { email, password } = req.body || {};

    if (!email || typeof email !== 'string') {
      return res.status(400).json({
        error: 'ValidationError',
        message: 'Поле "email" є обовʼязковим і має бути рядком',
      });
    }

    if (!password || typeof password !== 'string') {
      return res.status(400).json({
        error: 'ValidationError',
        message: 'Поле "password" є обовʼязковим і має бути рядком',
      });
    }

    try {
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return res.status(401).json({
          error: 'InvalidCredentials',
          message: 'Невірний email або пароль',
        });
      }

      const isValid = await bcrypt.compare(password, user.passwordHash);

      if (!isValid) {
        return res.status(401).json({
          error: 'InvalidCredentials',
          message: 'Невірний email або пароль',
        });
      }

      const token = signToken(user.id);

      return res.json({
        token,
        user: {
          id: user.id,
          email: user.email,
        },
      });
    } catch (err) {
      console.error('POST /api/auth/login error:', err);

      const status = err.status && Number.isInteger(err.status) ? err.status : 500;

      return res.status(status).json({
        error: err.name || 'InternalServerError',
        message: err.message || 'Не вдалося виконати вхід',
      });
    }
  });

  // GET /api/auth/me (protected)
  router.get('/me', authMiddleware, async (req, res) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        select: {
          id: true,
          email: true,
          createdAt: true,
        },
      });

      if (!user) {
        return res.status(404).json({
          error: 'NotFound',
          message: 'Користувача не знайдено',
        });
      }

      return res.json(user);
    } catch (err) {
      console.error('GET /api/auth/me error:', err);

      return res.status(500).json({
        error: 'InternalServerError',
        message: 'Не вдалося отримати поточного користувача',
      });
    }
  });

  return router;
}

module.exports = createAuthRouter;
